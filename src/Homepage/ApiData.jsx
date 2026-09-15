import { useDispatch, useSelector } from "react-redux"
import { addToBookMarks, loadMore, rankingCategories } from "../Redux/Slice";
import { useEffect, useState } from "react";
import { hindiTranslations } from "../Data/Languageguid";
import { apiThunk } from "../Server/Apihandling";
import './apidata.css'
export function Apidata()
{ const state=useSelector((state)=>state.users.currentUser.homePageConfigs);
  const preferences=useSelector((state)=>state.users.currentUser.preferences);
   const currentuser=useSelector((state)=>state.users.user.find((user)=>user.id===state.users.currentUser.id));
  const language=useSelector((state)=>state.users.currentUser.language);
  const user1 =useSelector( (state)=>state.users.user.find( 
    user => user.id === state.users.currentUser.id
      ));
  const loading=user1.homePageConfigs.loading;
  const [count ,setCount]=useState(0);
  const [pages,setPages]=useState([]);
  const dispatch=useDispatch();
  let isBookmarked=null;
    useEffect(()=>{
    if(count===0)
    {
      setCount(prev=>prev+1);
    }
    else
    {
      setCount(0);
    }
  },[pages]);
  console.log(state.response);
  function handleSeeMore(category,index)
  {
    const categoryObj = preferences
    .flatMap(obj => obj.subCategories)
    .find(obj => obj.title === category);
    console.log("seemore running");
    if(count===1)
    {
     dispatch(apiThunk({
    language: currentuser.language,
    country: currentuser.country,
    title: categoryObj.title,
    query: categoryObj.query,
    page: pages[index],
    isSearch: false
}));
      
    }
    else
      return;
  }
function handleBookaMark(article,category)
{  
   dispatch(addToBookMarks({article:article,category:category}))
   dispatch(rankingCategories({category:'',subCategory:category}))
  
}
function ArticleCounter({ele,category,index})
{
  const categoryObj = preferences.find(
    obj => obj.subCategories.find(
        sub => sub.title === category
    )
);
 const subCatObj =
    categoryObj?.subCategories.find(
        sub => sub.title === category
    ); 
const articleCount=subCatObj?.articles.count;
  const page=subCatObj?.articles.page;
  useEffect(() => {
    setPages((prev) => {
        if (prev[index] === page) return prev;

        const newPages = [...prev];
        newPages[index] = page;
        return newPages;
    });
}, [page, index]);
   if(ele.loading)
   {
    return(<>
    Loading..!!
    </>)
   }
   else if(ele.error && !ele.data)
   {
    return(<>{ele.error}</>)
   }
   else
   return (
  <>
    {!ele.data?.articles?.[articleCount] ? (
      <div className="no-article-div"
      >
        <h2 className="informative-header-no-articles"
        >
          🎉 You've Reached the End
        </h2>
        <p className="no-article-info"
        >
          There are no more articles available in this category.
        </p>
      </div>
    ) : (
      ele.data?.articles
        .slice(articleCount, articleCount + 4)
        .map((article) => (
        <div className="article-hp" key={article.url}>
  <img
    className="article-image-hp"
    src={
      article.image ||
      "https://via.placeholder.com/350x240?text=No+Image"
    }
    alt={article.title}
  />

  <div className="article-data-hp">
    <span className="article-category">
      {language[0] === "eg"
        ? ele.category.toUpperCase()
        : hindiTranslations[ele.category.toLowerCase()]}
    </span>



    <h2 className="article-title-hp">
      {article.title}
    </h2>


    <p className="article-description-hp">
      {article.description ||
        "Description unavailable."}
    </p>


    <div className="article-divider"></div>

    <div className="article-origin-hp">

      <span className="article-source">
        {article.source?.name}
      </span>

      <span className="article-date">
        {new Date(article.publishedAt).toLocaleDateString()}
      </span>

    </div>


    <div className="article-footer">

      {isBookmarked =
        currentuser.bookMarks
          .find(book => book.category === ele.category)
          ?.articles.some(item => item.url === article.url)}

      <button
        className="bookmark-button"
        disabled={isBookmarked}
        onClick={() =>
          handleBookaMark(article, ele.category)
        }
      >
        {isBookmarked
          ? "✓ Saved"
          : "Save"}
      </button>

      <a
        className="article-link-hp"
        href={article.url}
        target="_blank"
        rel="noreferrer"
      >
        Read Story →
      </a>

    </div>

  </div>
</div>
        ))
    )}
  </>
);
 }
  return (
  <div className="inner-cat-display-div"
  >
    {state.response.map((ele, index) => (
      <div className="category-div"
        key={ele.category}
      >

        <div className="upper-div-hp"
        >
          <h2 className="cat-title"
          >
            {language[0] === "eg"
              ? ele.category
              : hindiTranslations[ele.category.toLowerCase()]}
          </h2>

          <button className="view-more-button"
            type="button"
            onClick={() => {
              dispatch(loadMore(ele.category));
              handleSeeMore(ele.category, index);
              dispatch(
                rankingCategories({
                  category: "",
                  subCategory: ele.category,
                })
              );
            }}
          >
            {language[0] === "eg"
              ? "View More →"
              : hindiTranslations["see more"]}
          </button>
        </div>
        <div className="hp-articles-div"
        >
          <ArticleCounter
            ele={ele}
            category={ele.category}
            index={index}
          />
        </div>
      </div>
    ))}
  </div>
);   ;
}



