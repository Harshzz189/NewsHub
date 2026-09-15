import { createSlice} from "@reduxjs/toolkit";
import { Preferences } from "../Preferences/prefernce";
import { apiThunk } from "../Server/Apihandling";
import { useSelector } from "react-redux";
import { apiCategories } from "../Data/categories";
import { subCategoryRanker } from "../Preferences/rankingAlgos";
const initialState= JSON.parse((localStorage.getItem('data'))) ||
{  user:[],
  islogged:false,
  currentUser:null
};
const  reducers=
{
   Adduser:(state,action)=>{
          state.user.push({
            id:action.payload.id,
            pass:action.payload.pass,
            language:[],
            preferences:[],
            country:'',
            homePageConfigs:{
              categorySelected:null,
              loading:false,
              error:null,
              response:[],
              searchResponse:[],
              suggestionResponse:[],
              suggestionActive:true,
              searchActive:false
            },
            bookMarks:[],
            interests:[]
          })
        },
    Userlogged:(state,action)=>{
       state.islogged=true;
       state.currentUser=state.user.find((user)=>user.id===action.payload)
    },
    Logout:(state)=>{
         state.islogged=false;
       state.currentUser=null
    }
    
}

const prefernceReducer={
  submitPreferences:(state,action)=>{
   const user1 = state.user.find( 
    user => user.id === state.currentUser.id
    );
    state.currentUser.preferences=[]
    user1.preferences=[];
    user1.language = action.payload.language;
    action.payload.preferences.forEach((category) => {
    const isExisted = user1.interests.find(
        (ele) => ele.category.type === category
    );

    if (isExisted) {
        user1.preferences.push(isExisted);
        state.currentUser.preferences.push(isExisted);
    } else {
        const apiCategory = apiCategories.find(
            (ele) => ele.category.type === category
        );
        user1.preferences.push(apiCategory);
        user1.interests.push(apiCategory);
        state.currentUser.preferences.push(apiCategory);
        user1.preferences=user1.preferences.map((pref)=>
         user1.interests.find((obj)=>obj.category.type===pref.category.type)
        )
    }
});
      user1.country = action.payload.country;
      state.currentUser.language = action.payload.language;
      state.currentUser.country = action.payload.country;
  }
  
}
const homePageReducer={
  updateCategory:(state,action)=>{
    let user1=state.currentUser
    const presentUser=state.user.find((user)=>user.id===state.currentUser.id)
    const presentCategory=presentUser.preferences.find((pref)=>pref.category.type===action.payload.category);
    if(user1)
    {
      user1.homePageConfigs.categorySelected=action.payload.category;
      if (!presentCategory.category.count)
        {
          presentCategory.category.count = 1;
        } 
      else 
        {
          presentCategory.category.count += 1;
        }
    }
  },
  rankingCategories:(state,action)=>{
     const user1 = state.user.find( 
    user => user.id === state.currentUser.id
      );
    if(action.payload.subCategory==='')
    {
       let index=user1.preferences.findIndex((object)=>object.category.type===action.payload.category);
      let categoryObject=user1.interests.find((object)=>object.category.type===action.payload.category);
      categoryObject.category.count+=1;
      user1.preferences[index].subCategories=subCategoryRanker(categoryObject.subCategories);
    }
    else
    {
      let categoryObject = user1.interests.find((object) =>
      object.subCategories.find((ele) => ele.title === action.payload.subCategory)
        );

        let index = user1.interests.findIndex((object) =>
            object.subCategories.find((ele) => ele.title === action.payload.subCategory)
        );

        const subCat = categoryObject.subCategories.find(
            (ele) => ele.title === action.payload.subCategory
        );
     categoryObject.category.count+=2;
     subCat.count+=1;

      user1.preferences[index]=categoryObject;
    }
   
  },
  resetResponse:(state)=>{
     let user1=state.currentUser;
     user1.homePageConfigs.loading=false;
      user1.homePageConfigs.response=[];
      user1.homePageConfigs.searchResponse=[];
      user1.homePageConfigs.error=null;
  }
}

const articlesHandler={
  loadMore:(state,action)=>{
    const user1 = state.user.find( 
    user => user.id === state.currentUser.id
    );
   const cacheCategory = state.currentUser.preferences.find(
    (obj)=>obj.subCategories.find((sub)=>sub.title===action.payload)
);

const cacheSubCategory = cacheCategory.subCategories.find(
    (sub)=>sub.title===action.payload
);
if(cacheSubCategory.articles.count===0 )
{
  cacheSubCategory.articles.count+=5;
  
}
else
{
  cacheSubCategory.articles.count=0;
  cacheSubCategory.articles.page+=1;
}
}
}

const bookMarkReducers={
  addToBookMarks:(state,action)=>{
      const user1 = state.user.find( 
    user => user.id === state.currentUser.id
      );
      const isExistedCategory=user1.bookMarks.find((ele)=>ele.category===action.payload.category);
      if( isExistedCategory)
      {
          const isExistedArticle=isExistedCategory.articles.find((ele)=>ele.id===action.payload.article.id)
           if(isExistedArticle)
           {
            return;
           }
           else 
          {
          isExistedCategory.articles.push(action.payload.article)
         }
      }
      else{
        user1.bookMarks.push(
          {category:action.payload.category,
          articles:[action.payload.article]})
      }
  },
  deleteFromBookMark:(state,action)=>{
      const user1 = state.user.find( 
    user => user.id === state.currentUser.id
      );
      const category=user1.bookMarks.find((ele)=>ele.category===action.payload.category);
     category.articles=category.articles.filter((article)=>article.id!==action.payload.article.id);
      if(category.articles.length===0)
      {
        user1.bookMarks=user1.bookMarks.filter((ele)=>ele.category!==action.payload.category)
      }
      if(!category)return;
  }
}
const searchHandler={
  setSearch:(state)=>{
   let search=state.currentUser.homePageConfigs;
   search.searchActive=true;
  },
  removeSearch:(state)=>{
   let search=state.currentUser.homePageConfigs
   search.searchActive=false;
  }
}
const suggestionHandler={
    removeSuggestion:(state)=>{
  let suggestion=state.currentUser.homePageConfigs;
  suggestion.suggestionActive=false;
    }
}
const slice=createSlice({
    name:'user',
    initialState,
    reducers:{
      ...reducers,...prefernceReducer,...homePageReducer,...bookMarkReducers,...articlesHandler,...searchHandler,...suggestionHandler
    },
   extraReducers: (builder) => {

builder.addCase(apiThunk.pending, (state, action) => {

    const user1 = state.currentUser;

    user1.homePageConfigs.loading = true;
    user1.homePageConfigs.error = null;
     if (action.meta.arg.isSearch) {
        return;
    }
    if (action.meta.arg.isSuggestion) {

        const existedSuggestion =
            user1.homePageConfigs.suggestionResponse.find(
                obj => obj.category === action.meta.arg.title
            );

        if (!existedSuggestion) {
            user1.homePageConfigs.suggestionResponse.push({
                category: action.meta.arg.title,
                loading: true,
                error: null,
                data: null
            });
        } else {
            existedSuggestion.loading = true;
            existedSuggestion.error = null;
        }

        return;
    }

    const isExisted = user1.homePageConfigs.response.find(
        obj => obj.category === action.meta.arg.title
    );

    if (!isExisted) {
        user1.homePageConfigs.response.push({
            category: action.meta.arg.title,
            loading: true,
            error: null,
            data: null
        });
    } else {
        isExisted.loading = true;
        isExisted.error = null;
    }

});

builder.addCase(apiThunk.fulfilled, (state, action) => {

    const user1 = state.currentUser;

    user1.homePageConfigs.loading = false;
    user1.homePageConfigs.error = null;

    if (action.payload.isSearch) {
        user1.homePageConfigs.searchResponse = action.payload.data;
        return;
    }

    if (action.payload.isSuggestion) {

        const existedSuggestion =
            user1.homePageConfigs.suggestionResponse.find(
                obj => obj.category === action.payload.category
            );

        if (existedSuggestion) {
            existedSuggestion.loading = false;
            existedSuggestion.error = null;
            existedSuggestion.data = action.payload.data;
        } else {
            user1.homePageConfigs.suggestionResponse.push({
                category: action.payload.category,
                loading: false,
                error: null,
                data: action.payload.data
            });
        }

        return;
    }

    const isExisted = user1.homePageConfigs.response.find(
        obj => obj.category === action.payload.category
    );

    if (isExisted) {
        isExisted.loading = false;
        isExisted.error = null;
        isExisted.data = action.payload.data;
    } else {
        user1.homePageConfigs.response.push({
            category: action.payload.category,
            loading: false,
            error: null,
            data: action.payload.data
        });
    }

});

builder.addCase(apiThunk.rejected, (state, action) => {

    const user1 = state.currentUser;

    user1.homePageConfigs.loading = false;
    user1.homePageConfigs.error = action.payload;
     if (action.meta.arg.isSearch) {
        return;
    }

    if (action.meta.arg.isSuggestion) {

        const existedSuggestion =
            user1.homePageConfigs.suggestionResponse.find(
                obj => obj.category === action.meta.arg.title
            );

        if (existedSuggestion) {
            existedSuggestion.loading = false;
            existedSuggestion.error = action.payload;
        }

        return;
    }

    const isExisted = user1.homePageConfigs.response.find(
        obj => obj.category === action.meta.arg.title
    );

    if (isExisted) {
        isExisted.loading = false;
        isExisted.error = action.payload;
    }

});

}
})
 export const {
  Adduser,
  Userlogged,
  Logout,
  submitPreferences,
  updateCategory,
  resetResponse,
  addToBookMarks,
  deleteFromBookMark,
  rankingCategories,
  loadMore,
  setSearch,
  removeSearch,
  setSuggestion,
  removeSuggestion
}=slice.actions;
export default slice.reducer

