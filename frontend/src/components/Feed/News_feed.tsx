import { useEffect, useState } from "react";
import axios from "axios";

interface Article {
    _id: string;
    title: string;
    link: string;
    source: string;
    publishedAt: string;
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
                "http://localhost:5000/api/news"
            );

            setNews(response.data.articles || []);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch news articles.");
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
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading latest news...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <h1 className="text-4xl font-bold text-slate-800">
                        📰 Latest News Feed
                    </h1>

                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-600 border border-red-200">
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {news.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-10 text-center">
                        <h2 className="text-xl font-semibold text-gray-700">
                            No Articles Found
                        </h2>
                        <p className="text-gray-500 mt-2">
                            News articles will appear here once feeds are fetched.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Count */}
                        <p className="mb-6 text-gray-600">
                            Total Articles:{" "}
                            <span className="font-semibold">{news.length}</span>
                        </p>

                        {/* News Grid */}
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {news.map((article) => (
                                <div
                                    key={article._id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 flex flex-col"
                                >
                                    <div className="p-5 flex flex-col h-full">
                                        {/* Source */}
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                {article.source}
                                            </span>

                                            <span className="text-xs text-gray-500">
                                                {new Date(
                                                    article.publishedAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-lg font-semibold text-gray-800 mb-4 line-clamp-3">
                                            {article.title}
                                        </h2>

                                        {/* Spacer */}
                                        <div className="flex-grow"></div>

                                        {/* Button */}
                                        <a
                                            href={article.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Read Full Article →
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default News_feed;