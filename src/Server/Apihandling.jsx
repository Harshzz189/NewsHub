import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const apiThunk=createAsyncThunk('apifetch', 
    async ({language,country,title,query,page,isSearch,isSuggestion},thunkApi)=>{
       try{
       // const response=await axios.get(`https://gnews.io/api/v4/search?q=${subCategories}&lang=hn&country=in&page=${Number(page)}&apikey=`);
          const response=await axios.get(`https://gnews.io/api/v4/search?q=${query}&lang=${language}&country=in&page=${Number(page)}&apikey=dbbe558eedca6d39b1fcdb2d1517420b`);
         //const response=await axios.get(`https://gnews.io/api/v4/search?q=${query}&lang=${language}&country=in&page=${Number(page)}&apikey=23d3c8d59f9cb5152fc39d813126deef`);
          console.log(response.data,title);
            return ({category:title,data:response.data,isSearch:isSearch,isSuggestion:isSuggestion})
       }
       catch(error)
       {
        return thunkApi.rejectWithValue(error.message);
       }
    })