import { useNavigate } from "react-router"
import {Formik,Form,Field,ErrorMessage} from 'formik'
import * as yup from 'yup'
import { useEffect, useRef, useState } from "react"
import {useDispatch, useSelector} from  'react-redux'
import { Adduser,setSuggestion,Userlogged} from "../Redux/Slice"
import "./loginpage.css"
export function Loginpage()
{
    const navigate=useNavigate();
    const [signUp,setSignUp]=useState(false);
    const idref=useRef();
    const passref=useRef();
    const dispatch=useDispatch();
        const state = useSelector((state) => state.users.user);
    useEffect(()=>{
        idref.current.focus()
    },[]);
    const initialValues={
        name:'',
        pass:''
    }
    const validationSchema=yup.object({
        name:yup.string().required('Id is Required'),
        pass:yup.string().required('Pass is Require')
    })
    function handleSignup()
    {
        setSignUp(prev=>!prev)
    }

    function onSubmit(values,{setFieldError})
    {
         let isexisted=state.find((user)=>user.id.toLowerCase()===values.name.toLowerCase());
        if(!signUp)
        {
            if(!isexisted)
            {
                setFieldError('name','User not exists');
                return;
            }

            if(isexisted.pass!==values.pass )
            {
             setFieldError('pass','Password is Incorrect')
             return;
            }
            else
            {
             dispatch(Userlogged(isexisted.id));
             if(isexisted.country==='')
             {
               navigate('/preferences'); 
             }
             else{
             
                navigate('/home/suggestions');
             }
            }

        }
        else
        {
          if(isexisted)
          {
            setFieldError(
                "name",
                "User already exists"
            );
            return;
          }
          else
          {
             dispatch(Adduser({id:values.name,pass:values.pass}));
          }
        }
    }
   return (
  <div className="login-Main-Container">
    <div className="app-info-container">
      <h1 className="info-title">
        📰 Welcome to NewsHub
      </h1>

      <h2 className="info-subtitle">
        Personalized News at Your Fingertips
      </h2>

      <p className="insight-para"
        style={{
          fontSize: "18px",
          lineHeight: "32px",
          color: "#f8fafc",
        }}
      >
        Discover breaking headlines, trending stories, and personalized
        recommendations based on your interests, preferred language, and
        country. Stay informed with an elegant, fast, and modern news
        experience.
      </p>

      <div className="features-div"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          fontSize: "17px",
        }}
      >
        <span>✔ Personalized News Feed</span>
        <span>✔ Smart Category Recommendations</span>
        <span>✔ Powerful Search</span>
        <span>✔ Bookmark Favourite Articles</span>
        <span>✔ Country-wise Headlines</span>
        <span>✔ Multi-language Support</span>
      </div>
    </div>
    <div className="user-login-container"
    >
      <h2 className="login-header"
      >
        {!signUp ? "Login to NewsHub" : "Create Your Account"}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form className="login-form">
          <Field className="input-field"
            name="name"
            ref={idref}
            placeholder={!signUp ? "Enter Id" : "Create Id"}
          />
          <ErrorMessage className="error-field"
            name="name"
            component="div"
          />

          <Field className="input-field"
            name="pass"
            type="password"
            placeholder={!signUp ? "Enter Password" : "Create Password"}
          />

          <ErrorMessage className="error-field"
            name="pass"
            component="div"
            ref={passref}
          />

          <div className="button-section-lp"
          >
            <button className="login-button"
              type="submit"
            >
              {!signUp ? "Login" : "Create Account"}
            </button>

            <button className="signup-button"
              type="button"
              onClick={handleSignup}
            >
              {!signUp ? "Sign Up" : "Go Back"}
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  </div>
);
}