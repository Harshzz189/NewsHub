import { createContext, useState } from "react"
import { useSelector } from "react-redux";
import { Navigate } from "react-router";


 export function RouteProvider({children})
{
const isLogged=useSelector((state)=>state.users.islogged)
if(isLogged)
{
    return children
}
else
    return(<Navigate to='/' />)
}