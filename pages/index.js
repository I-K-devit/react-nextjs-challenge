import Head from 'next/head'
import { useEffect, useState } from 'react';
import axios from "axios";
import {
    useQuery,
    QueryClient,
    QueryClientProvider,
} from "react-query";
import { categoriesMap } from '../constants';
import { SearchStyled, ButtonStyled, ArticleStyled, DeleteButtonStyled } from '../styledComponents';

const queryClient = new QueryClient();

const Search = ({ searchChange }) => {
    return <SearchStyled
        type='search'
        placeholder='Search articles'
        onChange={(event) => { searchChange(event.target.value) }}
    />;
};

const ShowAllButton = ({ showAllArticles }) => {
    return <ButtonStyled onClick={() => { showAllArticles() }}>Show All</ButtonStyled>;
};

const CategoryButton = ({ title, id, filterArticlesByCategory }) => {
    return <ButtonStyled
        onClick={() => { filterArticlesByCategory(id) }}
    >
        {title}
    </ButtonStyled>;
};

const Article = ({ newsInfo = {}, deleteArticle }) => {

    const imageSource = `https://www.alpha-orbital.com/assets/images/post_img/${newsInfo.post_thumbnail}`;
    const articleSource = `https://www.alpha-orbital.com/news/${newsInfo.slug}`;
    const clearedText = newsInfo.excerpt?.replace(/<\/?p[^>]*>/g, "");

    return (
        <ArticleStyled>
            <div>
                <a
                    target="_blank"
                    rel="noreferrer"
                    href={articleSource}
                >
                    <img src={imageSource} />
                </a>
            </div>
            <div>
                <h3>
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href={articleSource}
                    >
                        {newsInfo.title}
                    </a>
                </h3>
                <p>
                    {clearedText}
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href={articleSource}
                    >
                        Full Article
                    </a>
                </p>
            </div>
            <div><DeleteButtonStyled onClick={()=>{ deleteArticle(newsInfo.slug) }}>Delete</DeleteButtonStyled></div>
        </ArticleStyled>
    )
}

const Main = () => {

    const [filteredNews, setFilteredNews] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState(categoriesMap);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchInput, setSearchInput] = useState('');

    const useNews = () => {
        return useQuery("news", async () => {
            const { data } = await axios.get(
                "https://www.alpha-orbital.com/last-100-news.json"
            );

            const newsCategories = data.reduce((acc, { post_category_id }) => {
                acc[post_category_id] = acc[post_category_id] + 1;
                return acc;
            }, { 1: 0, 2: 0, 3: 0, 4: 0 });

            setFilteredCategories(categoriesMap.filter(({ id }) => newsCategories[id] > 0));
            setFilteredNews(fetchedNews);

            return data;
        });
    }

    const { data: fetchedNews } = useNews();

    const handleSearchChange = (searchValue) => {
        setSearchInput(searchValue);
    }

    const handleFilterArticlesByCategory = (id) => {
        const filteredArticlesByCategory = fetchedNews.filter(({ post_category_id }) => {
            return Number(post_category_id) === id;
        });

        setSelectedCategory(id);
        setFilteredNews(filteredArticlesByCategory);
    };

    const handleShowAllArticles = () => {
        setSelectedCategory(null);
        setFilteredNews(fetchedNews);
    }

    const handleFilterArticlesBySearchField = () => {
        const filteredArticlesBySearchField = filteredNews.filter(({ title, excerpt }) => {
            return title.toLowerCase().includes(searchInput.toLowerCase())
                || excerpt.toLowerCase().includes(searchInput.toLowerCase());
        });
        setFilteredNews(filteredArticlesBySearchField);
    };

    const handleDeleteArticle = (deleteArticleSlug) => {
        setFilteredNews(filteredNews.filter(({ slug }) => slug !== deleteArticleSlug));
    }

    useEffect(() => {
        if (searchInput.length >= 3) {
            handleFilterArticlesBySearchField();
        }
        if (searchInput.length < 3) {
            if (selectedCategory) {
                handleFilterArticlesByCategory(selectedCategory);
            } else {
                handleShowAllArticles();
            }
        }
    }, [searchInput]);

    const renderNews = (news = []) => (
        <>
            {
                news.map((newsItem, i) => {
                    return <Article key={i} newsInfo={newsItem} deleteArticle={handleDeleteArticle} />
                })
            }
        </>
    );

    const renderCategories = (categories = []) => (
        <>
            {
                categories.map(({ title, id }, i) => {
                    return (
                        <CategoryButton key={i} title={title} id={id} filterArticlesByCategory={handleFilterArticlesByCategory} />
                    )
                })
            }
        </>
    );

    return (
        <div className="container">
            <Head>
                <title>100 lastest news</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <nav>
                {renderCategories(filteredCategories)}
                <ShowAllButton showAllArticles={handleShowAllArticles} />
            </nav>
            <main>
                <Search searchChange={handleSearchChange} />
                <div>Current filtered news count: {filteredNews?.length}</div>

                {renderNews(filteredNews)}
            </main>

        <style jsx>{`
            .container {
                min-height: 100vh;
                padding: 0 0.5rem;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            main {
                padding: 5rem 0;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            }
        `}</style>

        <style jsx global>{`
            html,
            body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
                Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
                sans-serif;
            }
            * {
            box-sizing: border-box;
            }
        `}
        </style>
    </div>
    )
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Main />
        </QueryClientProvider>
    );
}
