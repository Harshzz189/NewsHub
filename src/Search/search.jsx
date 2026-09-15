import { useDispatch, useSelector } from "react-redux"
import { addToBookMarks, loadMore, rankingCategories } from "../Redux/Slice";
import { useEffect, useState } from "react";
import "./searchpage.css"
export function SearchPage()
{   
 const state=useSelector((state)=>state.users.currentUser.homePageConfigs);
const preferences=useSelector((state)=>state.users.currentUser.preferences);
const currentuser=useSelector((state)=>state.users.user.find((user)=>user.id===state.users.currentUser.id));
const language=useSelector((state)=>state.users.currentUser.language);
const user1=useSelector((state)=>state.users.currentUser);
const [count ,setCount]=useState(0);
const [pages,setPages]=useState([]);
const apiresponse=user1.homePageConfigs.searchResponse;
const dispatch=useDispatch();
console.log(apiresponse);
const loading=user1.homePageConfigs.loading;
if (loading) {
    return (
        <div
            style={{
                height: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "22px",
                fontWeight: "bold"
            }}
        >
            Loading...
        </div>
    );
}
if (state.error) {
    return (
        <div
            style={{
                height: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "15px"
            }}
        >
            <h2>Couldn't fetch search results.</h2>

            <p>{state.error}</p>

            <button
                onClick={() => window.location.reload()}
            >
                Retry
            </button>
        </div>
    );
}
if (!apiresponse?.articles?.length) {
    return (
        <div
            style={{
                height: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "15px"
            }}
        >
            <h2>No Articles Found</h2>

            <p>
                Try searching with a different keyword.
            </p>
        </div>
    );
}
else
return (
  <div>
    <div className="search-page-header">
      <h2 className="search-result-title">
        Results for "{apiresponse?.query || "Search"}"
      </h2>

      <p className="search-result-count">
        {apiresponse?.articles?.length} Articles Found
      </p>
    </div>

    <div className="search-display-block">
      {apiresponse?.articles?.map((article, index) => {
        return (
          <div
            className="search-article-container"
            key={index}
          >
            <img
              className="search-card-image"
              src={article.image}
              alt={article.title}
            />

            <div className="search-card-content">
              <h2 className="search-card-title">
                {article.title}
              </h2>

              <p className="search-card-description">
                {article.description}
              </p>

              <div className="search-card-footer">
                <span
                  className="search-card-source"
                  style={{
                    color: "#666",
                    fontWeight: "bold",
                  }}
                >
                  {article.source?.name}
                </span>

                <a
                  className="search-card-link"
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read More →
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
}