import { useSelector,useDispatch } from "react-redux"
import { deleteFromBookMark } from "../Redux/Slice";
import { hindiTranslations } from "../Data/Languageguid";
import './bookmarks.css'
export function Bookmarks()
{     
     
    const currentuser=useSelector((state)=>state.users.user.find((user)=>user.id===state.users.currentUser.id));
    const dispatch=useDispatch();
    const language=useSelector((state)=>state.users.currentUser.language);
    if (currentuser.bookMarks.length === 0) {
    return (
        <div className="bookmarks-conatiner-default"
        >
            <h2 className="default-content">
    {language[0] === "eg"
        ? "No Bookmarked Articles"
        : "कोई बुकमार्क किए गए लेख नहीं"}
</h2>

<p className="user-suggestion">
    {language[0] === "eg"
        ? "Start building your personal reading collection. Bookmark articles from Home or Search, and they'll appear here instantly."
        : "अपना व्यक्तिगत पढ़ने का संग्रह बनाना शुरू करें। होम या सर्च से लेखों को बुकमार्क करें, वे तुरंत यहाँ दिखाई देंगे।"}
</p>
        </div>
    );
}
    function handleDelete(category,article)
     {
        dispatch(deleteFromBookMark({category:category,article:article}))  
     }
    return (
  <div className="BookMarks-container"
  >
    <div className="bookmark-header">
    <h1 className="bookmark-title"><i class="fa-solid fa-bookmark"></i> Bookmarks</h1>

  <p className="bookmark-subtitle">
    Your personal collection of saved articles, organized by category for quick access.
  </p>
</div>

    {currentuser.bookMarks.map((ele) => {
      return (
        <div className="Bookmarked-article"
          key={ele.category}
        >
          <h2 className="category-title"
          >
            {language[0] === "eg"
              ? ele.category
              : hindiTranslations[ele.category.toLowerCase()]}
          </h2>

          <div className="Category-articles"
          >
            {ele.articles.map((article) => {
              return (
                <div className="Article"
                  key={article.url}
                >
                  <img className="article-image"
                    src={
                      article.image ||
                      "https://via.placeholder.com/350x180?text=No+Image"
                    }
                    alt={article.title}
                  />
                  <div className="article-data-div"
                  >
                    <h3 className="article-title"
                    >
                      {article.title}
                    </h3>

                    <p className="article-description"
                    >
                      {article.description
                        ? article.description.slice(0, 100) + "..."
                        : "Description unavailable."}
                    </p>
                    <div className="article-bottom-div"
                    >
                      <button className="remove-bookmark"
                        onClick={() => {
                          handleDelete(ele.category, article);
                        }}
                      >
                        {language[0] === "eg"
                          ? "🗑 Remove"
                          : hindiTranslations["delete"]}
                      </button>

                      <a className="article-src"
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {language[0] === "eg"
                          ? "Read Article →"
                          : hindiTranslations["read more →"]}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    })}
  </div>
);
}