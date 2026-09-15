import { NavLink ,Outlet} from "react-router"
import { Logout } from "../Redux/Slice"
import { useDispatch ,useSelector} from "react-redux"
import './navigation.css'
import { motion } from "framer-motion";
export function Navigation()
{
const language=useSelector((state)=>state.users.currentUser.language);
const dispatch=useDispatch();
const isSearch = useSelector(
  (state) => state.users.currentUser.homePageConfigs.searchActive
);
const isSuggestion=useSelector(
  (state) => state.users.currentUser.homePageConfigs.suggestionActive
);
 const Styling = ({ isActive }) => ({
  color: isActive ? "#f2f2f2" : "#ffffff",
  fontWeight: isActive ? "800" : "600",
  textDecoration: isActive ? "underline" : "none",
  textUnderlineOffset: "6px",
  textDecorationThickness: "2px",
fontSize: "clamp(8px, .95rem + .5vw, 24px)",
  transition: "0.2s ease",
})
  return (
  <div
    style={{
      minHeight: "100vh",
      background: "#f5f7fb",
    }}
  >
    <nav className="Nav-bar-main">

  <div className="nav-container">

    <motion.h2
      className="logo"
      initial={{ opacity: 1 }}
      whileHover={{
        opacity: [1, 0.45, 1],
        scale: [1, 0.98, 1],
        filter: ["blur(0px)", "blur(2px)", "blur(0px)"],
      }}
      transition={{
        duration: 0.85,
        ease: "easeInOut",
      }}
    >
      📰 NewsHub
    </motion.h2>

    <div className="navlinks-div">
      <NavLink
        style={Styling} 
        to={isSearch ?'/home/search':isSuggestion ?'/home/suggestions':'/home'} > 
        {language[0] === "eg" ? "Home" : "होम"}
        </NavLink>
       <NavLink 
         style={Styling} 
         to="bookmark"> 
         {language[0] === "eg"
          ? "Bookmarks"
          : "बुकमार्क"} 
          </NavLink> 
       <NavLink 
          style={Styling} 
          to="profile"> 
          {language[0] === "eg" 
          ? "Profile" 
          : "प्रोफ़ाइल"} 
       </NavLink>
    </div>

    <button className="logout-button"
     onClick={() => dispatch(Logout())}>
       Logout
    </button>

  </div>

</nav>

    <div className="page-wrapper" 
    >
      <Outlet />
    </div>
  </div>
);
}