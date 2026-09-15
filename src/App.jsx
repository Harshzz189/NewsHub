import {Routes ,Route} from 'react-router'
import { Loginpage } from "./login/loginpage"
import { Navigation } from './Navigation/Navigation'
import { Homepage } from './Homepage/Home'
import { Preferences } from './Preferences/prefernce'
import { RouteProvider } from './Navigation/router'
import { Profilepage } from './Profile/profile'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Language,Country,Prefernce } from './Preferences/prefernce'
import { Bookmarks } from './Bookmarks/BookMarks'
import { Suggestions } from './Suggestions/suggestionPage'
import { SearchPage } from './Search/search'
import { Apidata } from './Homepage/ApiData'
import './app.css'
function App() {
  const userState=useSelector((state)=>state.users);
 useEffect(()=>{
        localStorage.setItem( 'data',JSON.stringify(userState))
    },[userState])

  return (
    <Routes>
     <Route path='/' element={<Loginpage></Loginpage>} />
     <Route  path='/preferences' element={<RouteProvider><Preferences /></RouteProvider>} />
     <Route element={<RouteProvider><Navigation /></RouteProvider>}>
      <Route path='/home' element={<RouteProvider><Homepage /></RouteProvider>}>
      <Route index element={<RouteProvider ><Apidata /></RouteProvider>} />
        <Route path='search' element={<RouteProvider ><SearchPage /></RouteProvider>}/>
      <Route path='suggestions' element={<RouteProvider><Suggestions /></RouteProvider>} />
      </Route>
      <Route path='profile' element={<RouteProvider><Profilepage /></RouteProvider>} >
       <Route path='changeprefs' element={<Prefernce />}></Route>
       <Route path='changelang' element={<Language />}></Route>
       <Route path='changeCountry' element={<Country />}></Route>
       <Route path='changePass' ></Route>
      </Route>
      <Route path='bookmark' element={<RouteProvider><Bookmarks /></RouteProvider>}/>
     </Route>
    </Routes>
  )
}

export default App
