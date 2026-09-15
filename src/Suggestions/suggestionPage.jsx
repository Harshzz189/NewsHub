import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { apiThunk } from "../Server/Apihandling";
import { CategoryRanker } from "../Preferences/rankingAlgos";
import "./suggestionspage.css";

export function Suggestions() {
    const user = useSelector((state) =>
        state.users.user.find((user) => user.id === state.users.currentUser.id)
    );

    const currentUserCache = useSelector(
        (state) => state.users.currentUser
    );

    const [counter, setCounter] = useState(0);
    const dispatch = useDispatch();

    const apiResponse = currentUserCache.homePageConfigs?.suggestionResponse;
    const preferences = user.preferences;
    const sortedpreferences = CategoryRanker([...preferences]);

    if (preferences.length === 0) {
        return (
            <div className="no-suggestions-container-sp">
                <h2 className="no-suggestions-heading-sp">
                    No Suggestions Available
                </h2>

                <p className="no-suggestions-text-sp">
                    Select some preferences to get personalized suggestions.
                </p>
            </div>
        );
    }

    useEffect(() => {
        if ( counter===1 ||
            (counter-1<=sortedpreferences.length && 
               (
            apiResponse[counter - 2]?.data ||
            apiResponse[counter - 2]?.error
        )
            )
        ) {
            console.log("fetched",counter)
            dispatch(
                apiThunk({
                    language: user.language,
                    country: user.country,
                    title: sortedpreferences[counter - 1]?.category?.type,
                    page: 1,
                    query: sortedpreferences[counter - 1]?.category?.type,
                    isSearch: false,
                    isSuggestion: true,
                })
            );

            return;
        }
    }, [counter, apiResponse.length]);

    useEffect(() => {
        setCounter(1);
    }, []);

    useEffect(() => {
        console.log(counter);

        if (apiResponse.length === counter) {
            if (counter > preferences.length) {
                return;
            }

            const timer = setTimeout(() => {
                setCounter((prev) => prev + 1);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [apiResponse?.length, counter]);

    return (
        <div className="category-articles-container-sp">
            {apiResponse.map((category, index) => (
                <div
                    className="category-heading-sp"
                    key={category.category}
                >
                    <h2 className="category-title-sp">
                        {category.category}
                    </h2>

                    {category.loading ? (
                        <div className="loading-state-sp">
                            Loading {category.category}...
                        </div>
                    ) : category.error ? (
                        <div className="error-state-sp">
                            <div className="error-message-sp">
                                {category.error}
                            </div>

                            <button
                                className="retry-button-sp"
                                onClick={() => {
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
                                    );
                                }}
                            >
                                Retry
                            </button>
                        </div>
                    ) : !category.data?.articles?.length ? (
                        <div className="empty-state-sp">
                            No Articles Found.
                        </div>
                    ) : (
                        <div className="articles-display-block-sp">
                            {category.data.articles
                                .slice(0, 4)
                                .map((article, index) => (
                                    <div
                                        className="articles-card-sp"
                                        key={index}
                                    >
                                        <img
                                            className="article-image-sp"
                                            src={article.image}
                                            alt={article.title}
                                        />

                                        <div className="article-info-sp">
                                            <h3 className="title-sp">
                                                {article.title}
                                            </h3>

                                            <p className="article-data-sp">
                                                {article.description}
                                            </p>

                                            <div className="article-origin-sp">
                                                <span>
                                                    {article.source.name}
                                                </span>

                                                <span>
                                                    {new Date(
                                                        article.publishedAt
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <a
                                                className="article-link-sp"
                                                href={article.url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Read More →
                                            </a>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}