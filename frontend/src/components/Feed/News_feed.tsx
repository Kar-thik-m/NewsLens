import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../ApiUrl";

interface Article {
    _id: string;
    title: string;
    link: string;
    source: string;
    publishedAt: string;
    image?: string;
}

interface NewsResponse {
    success: boolean;
    articles: Article[];
}

const News_feed = () => {
    const [news, setNews] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchNews = async () => {
        try {
            setError("");

            const response = await axios.get<NewsResponse>(
                `${API_URL}/api/news/get-news`
            );

            setNews(response.data.articles || []);
        } catch (error) {
            console.error(error);
            setError("Failed to fetch news articles");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchNews();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl overflow-hidden shadow animate-pulse"
                            >
                                <div className="h-56 bg-slate-200"></div>

                                <div className="p-5">
                                    <div className="h-4 bg-slate-200 rounded w-20 mb-4"></div>

                                    <div className="h-5 bg-slate-200 rounded mb-2"></div>
                                    <div className="h-5 bg-slate-200 rounded mb-2"></div>
                                    <div className="h-5 bg-slate-200 rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 py-10 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-5xl font-extrabold text-slate-900">
                            📰 Latest News
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Stay updated with the latest headlines
                        </p>
                    </div>

                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition disabled:opacity-50"
                    >
                        {refreshing ? "Refreshing..." : "Refresh Feed"}
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-100 p-4 text-red-600">
                        {error}
                    </div>
                )}

                {/* Count */}
                {!error && (
                    <div className="mb-8">
                        <span className="bg-white px-4 py-2 rounded-full shadow text-slate-700 font-medium">
                            Total Articles: {news.length}
                        </span>
                    </div>
                )}

                {/* Empty State */}
                {news.length === 0 && !loading ? (
                    <div className="bg-white rounded-2xl shadow p-12 text-center">
                        <h2 className="text-2xl font-semibold text-slate-700">
                            No Articles Found
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Articles will appear here when available.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                        {news.map((article) => (
                            <article
                                key={article._id}
                                className="group overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Image */}
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={
                                            article.image ||
                                            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200"
                                        }
                                        alt={article.title}
                                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                                    <div className="absolute top-3 left-3">
                                        <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-slate-700">
                                            {article.source}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col min-h-[220px]">
                                    <span className="text-sm text-gray-500 mb-3">
                                        {new Date(
                                            article.publishedAt
                                        ).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>

                                    <h2 className="text-xl font-bold text-slate-800 line-clamp-3 mb-4">
                                        {article.title}
                                    </h2>

                                    <div className="mt-auto">
                                        <a
                                            href={article.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800"
                                        >
                                            Read Full Story
                                            <span>→</span>
                                        </a>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default News_feed;