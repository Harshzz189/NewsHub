import { Formik,Form, Field, ErrorMessage } from "formik"
import { useEffect, useReducer,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from 'yup'
import { apiThunk } from "../Server/Apihandling";
import { Apidata } from "./ApiData";
import { rankingCategories, removeSearch, removeSuggestion, resetResponse, setSearch, updateCategory } from "../Redux/Slice";
import { hindiTranslations } from "../Data/Languageguid";
import { SearchPage } from "../Search/search";
import { Outlet, useNavigate } from "react-router";
import "./homepage.css"
export function Homepage()
{  
    const initialValues={
    input:''
    };
    const [counter,setCounter]=useState(0);
    const currentuser=useSelector((state)=>state.users.user.find((user)=>user.id===state.users.currentUser.id));
    const currentUserCache=useSelector((state)=>state.users.currentUser);
    const isSearch=useSelector((state)=>state.users.currentUser.homePageConfigs.searchActive);
        const isSuggestion=useSelector((state)=>state.users.currentUser.homePageConfigs.suggestionActive)
    const dipatcher=useDispatch();
    const navigate=useNavigate();
    const [selectedCategory,setSelectedCategory]=useState(null);
     const language=useSelector((state)=>state.users.currentUser.language);
    const validationSchema=yup.object({
        input:yup.string().required('Entry a Valid Entry')
    })
    const category= currentuser.preferences.find((object)=>object.category.type===currentUserCache.homePageConfigs.categorySelected)
    let apiResponse=currentUserCache.homePageConfigs.response;
   useEffect(() => {
  if (!currentUserCache.homePageConfigs.categorySelected) return;

  const category = currentuser.preferences.find(
    (obj) =>
      obj.category.type ===
      currentUserCache.homePageConfigs.categorySelected
  );

  if (!category) return;

  category.subCategories.forEach((sub, index) => {
    setTimeout(() => {
      dipatcher(apiThunk({
        language: currentuser.language,
        country: currentuser.country,
        title: sub.title,
        query: sub.query,
        page: 1,
        isSearch: false,
        isSuggestion: false
      }));
    }, index * 300);
  });

}, [currentUserCache.homePageConfigs.categorySelected]);


    function handleNavClick(pref)
    {   if (currentUserCache.homePageConfigs.categorySelected === pref) {
         return;
       }
        setCounter(0);
        dipatcher(resetResponse());
        dipatcher(updateCategory({category:pref}));
        setCounter(prev=>prev+1);
        dipatcher(rankingCategories({category:pref,subCategory:''}));
    }
    function onSubmit(values,{resetForm})
    {    navigate('search');
        dipatcher(setSearch());
        dipatcher(removeSuggestion());
        dipatcher(resetResponse());
        dipatcher(apiThunk({language:currentuser.language,country:currentuser.country,title:values.input,query:values.input ,page:1,isSearch:true,isSuggestion:false}))
        resetForm();
    }
   return (
<div className="Main-Container-homepage"
>
<Formik
initialValues={initialValues}
validationSchema={validationSchema}
onSubmit={onSubmit}
>

<Form className="homepage-form"
>
<div className="searchbar-container"
>

<div className="search-box-container"
>

<Field className="search-bar"
name="input"
placeholder={
language[0] === "eg"
? "Search News..."
: hindiTranslations["search news"]
}
/>

<button className="submit-button-hp"
type="submit"
style={{}}
>
{language[0] === "eg"
? "Search"
: hindiTranslations["search"]}
</button>

</div>

<ErrorMessage className="error-field"
name="input"
component="div"
/>

</div>
<div className="display-container"
>
<nav className="home-nav-bar"
>

<h3 className="nav-headings"
>
Categories
</h3>

{
currentuser.preferences.map((pref)=>{

return(

<button className="nav-button"

key={pref.category.type}

type="button"

onClick={()=>{
handleNavClick(pref.category.type);
dipatcher(removeSearch());
dipatcher(removeSuggestion());
navigate("/home");
console.log(isSuggestion)
}}


onMouseEnter={(e)=>{
e.target.style.background="#111827";
e.target.style.color="white";
}}

onMouseLeave={(e)=>{
e.target.style.background="#edf3ff";
e.target.style.color="black";
}}

>

{
language[0]==='eg'
? pref.category.type
: hindiTranslations[pref.category.type]
}

</button>

)

})
}

</nav>

<div className="display-block"
>

<Outlet/>

</div>

</div>

</Form>

</Formik>

</div>
)
}