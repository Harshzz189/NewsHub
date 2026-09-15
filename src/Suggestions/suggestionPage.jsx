import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { apiThunk } from "../Server/Apihandling";
import { CategoryRanker } from "../Preferences/rankingAlgos";
import "./suggestionspage.css";

export function Suggestions() {
    const user = useSelector((state) =>
        state.users.user.find((u) => u.id === state.users.currentUser.id)
    );
    const currentUserCache = useSelector(
        (state) => state.users.currentUser );
    const dispatch = useDispatch();
    const apiResponse =currentUserCache.homePageConfigs?.suggestionResponse || [];
    const preferences = user.preferences;
    const sortedpreferences = CategoryRanker([...preferences]);
    const [index, setIndex] = useState(0);
    if (!preferences.length) {
        return (
            <div className="no-suggestions-container-sp">
                <h2>No Suggestions Available</h2>
                <p>Select preferences to get suggestions.</p>
            </div>
        );
    }

    useEffect(() => {
        if (index >= sortedpreferences.length) return;
    const currentCategory =
            sortedpreferences[index]?.category?.type;
        if (!currentCategory) return;
        dispatch(
            apiThunk({
                language: user.language,
                country: user.country,
                title: currentCategory,
                query: currentCategory,
                page: 1,
                isSearch: false,
                isSuggestion: true,
            })
        );
    }, [index]);
    useEffect(() => {
        if (apiResponse.length > index) {
            const timer = setTimeout(() => {
                setIndex((prev) => prev + 1);
            }, 800); 
            return () => clearTimeout(timer);
        }
    }, [apiResponse.length]);
    return (
        <div className="category-articles-container-sp">
            {apiResponse.map((category, i) => (
                <div className="category-heading-sp" key={i}>
                    <h2>{category.category}</h2>

                    {category.loading ? (
                        <div>Loading {category.category}...</div>
                    ) : category.error ? (
                        <div>
                            <p>{category.error}</p>
                            <button
                                onClick={() =>
                                    dispatch(
                                        apiThunk({
                                            language: user.language,
                                            country: user.country,
                                            title: category.category,
                                            query: category.category,
                                            page: 1,
                                            isSearch: false,
                                            isSuggestion: true,
                                        })
                                    )
                                }
                            >
                                Retry
                            </button>
                        </div>
                    ) : !category.data?.articles?.length ? (
                        <div>No Articles Found</div>
                    ) : (
                        <div className="articles-display-block-sp">
                            {category.data.articles
                                .slice(0, 4)
                                .map((article, idx) => (
                                    <div
                                        className="articles-card-sp"
                                        key={idx}
                                    >
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                        />

                                        <h3>{article.title}</h3>
                                        <p>{article.description}</p>

                                        <span>
                                            {article.source.name}
                                        </span>

                                        <span>
                                            {new Date(
                                                article.publishedAt
                                            ).toLocaleDateString()}
                                        </span>

                                        <a
                                            href={article.url}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Read More →
                                        </a>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}