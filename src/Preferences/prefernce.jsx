import { useNavigate } from "react-router"
import {Formik,Form,Field,ErrorMessage } from 'formik'
import * as yup from 'yup'
import { useDispatch, useSelector } from "react-redux";
import { submitPreferences } from "../Redux/Slice";
import { useEffect, useRef } from "react";
import { apiThunk } from "../Server/Apihandling";
import { Suggestions } from "../Suggestions/suggestionPage";
import "./preferencepage.css"
export function Preferences()
{   const navigate=useNavigate();
    const dispatch=useDispatch();
    const initialValues={
        country:'',
        preferences:[],
        language:[]
    }
    const validationSchema=yup.object({
        preferences:yup.array().min(3,'At least 3 required').max(5,'At most 5 allowed'),
        language:yup.array().min(1,'Select an Option').max(1,'Only one is Allowed'),
        country:yup.string().required('Enter the country')
    })
    function onSubmit(values)
    {
        dispatch(submitPreferences(
        {
            country:values.country,
            preferences:values.preferences,
            language:values.language
        }))
        values.preferences.map((pref)=>{
            dispatch(apiThunk({language:values.language,country:values.country,category:pref ,page:1,isSearch:false,isSuggestion:true}));
        })
        navigate('/home/suggestions');
    }

  return (
  <div className="main-container-pp"
  >
    <div className="info-container-pp"
    >
      <h1 className="info-header"
        style={{
          margin: 0,
          fontSize: "34px",
        }}
      >
        <i class="fa-solid fa-user"></i> Personalize Your Feed
      </h1>

      <p className="info-para"
      >
        Help us understand your preferences so we can deliver the most relevant
        news tailored specifically for you.
      </p>

      <div className="info-paras"
      >
        <div>
          <strong><i class="fa-solid fa-globe"></i> Country</strong>
          <p className="categories-info ">
            Select your country to receive local and regional news.
          </p>
        </div>

        <div>
          <strong><i class="fa-solid fa-heart"></i> Interests</strong>
          <p className="categories-info ">
            Choose 3–5 categories that interest you the most.
          </p>
        </div>

        <div>
          <strong><i class="fa-solid fa-language"></i> Language</strong>
          <p className="categories-info ">
            Pick your preferred language for a personalized experience.
          </p>
        </div>

        <div>
          <strong><i class="fa-solid fa-wand-magic-sparkles"></i> Recommendation</strong>
          <p className="categories-info ">
            The more accurate your preferences, the better your personalized
            news feed and recommendations will be.
          </p>
        </div>
      </div>
    </div>

    <div className="preferences-input-container"
    >
      <h2 className="input-heading"
      >
        Configure Preferences
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form className="preferences-form"
        >
          <Country />

          <Prefernce />

          <Language />

          <button className="save-button-pp"
            type="submit"
          >
            Save Preferences
          </button>
        </Form>
      </Formik>
    </div>
  </div>
);
}

export function Country()
{
  return (
  <div className="preference-layout"
  >
    <label className="preference-label"
    >
      <i class="fa-solid fa-globe"></i> Country
    </label>

    <Field
      name="country"
      placeholder="Choose Country"
      className="preference-field"
    />

    <ErrorMessage
      name="country"
      component="div"
      className="error-field"
    />
  </div>
);
}

export function Prefernce()
{
 return (
  <div className="preference-layout"
  >
    <label className="preference-label"
      htmlFor="preferences"
    >
      <i class="fa-solid fa-heart"></i> Interests
    </label>

    <p className="requirements-para"
    >
      Select at least <strong>3</strong> and at most <strong>5</strong> categories.
    </p>

    <div className="interests-choices"
    >
      <label className="interests-label"
      >
        <Field
          id="preferences"
          type="checkbox"
          name="preferences"
          value="technology"
        />
        <i class="fa-solid fa-microchip"></i>    Technology
      </label>

      <label
      className="interests-label"
      >
        <Field
          type="checkbox"
          name="preferences"
          value="sports"
        />
         <i class="fa-solid fa-futbol"></i>   Sports
      </label>

      <label className="interests-label"
      >
        <Field
          type="checkbox"
          name="preferences"
          value="business"
        />
        <i class="fa-solid fa-briefcase"></i>  Business
      </label>

      <label
      className="interests-label"
      >
        <Field
          type="checkbox"
          name="preferences"
          value="health"
        /> 
        <i class="fa-solid fa-heart-pulse"></i> Health
      </label>

      <label
      className="interests-label"
      >
        <Field
          type="checkbox"
          name="preferences"
          value="science"
        />
        <i class="fa-solid fa-flask"></i>    Science
      </label>

      <label
      className="interests-label"
      >
        <Field
          type="checkbox"
          name="preferences"
          value="entertainment"
        />
        <i class="fa-solid fa-film"></i>  Entertainment
      </label>
    </div>

    <ErrorMessage
      name="preferences"
      component="div"
      className="error-field"
    />
  </div>
);
}

export function Language()
{
return (
  <div className="preference-layout"
  >
    <label className="preference-label"
    >
     <i class="fa-solid fa-language"></i>   Language
    </label>

    <p  className="requirements-para"
    >
      Select your preferred language for reading the news.
    </p>
<div className="language-options">
    
      <label className="language-label"
      >
        <Field
          type="checkbox"
          name="language"
          value="eg"
        />
        English
      </label>

      <label className="language-label"
      >
        <Field
          type="checkbox"
          name="language"
          value="hn"
        />
         Hindi
      </label>
    </div>

    <ErrorMessage
      name="language"
      component="div"
      className="error-field"
    />
  </div>
);
}