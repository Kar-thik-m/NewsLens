import Article from "../Modals/Article_schema.js";
import { fetchAllFeeds } from "../Services/rssService.js";

export const getArticles = async (req, res) => {
    try {
        const articles = await Article.find()
            .sort({ publishedAt: -1 });

        res.status(200).json({
            success: true,
            count: articles.length,
            articles,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const fetchNews = async (req, res) => {
    try {
        await fetchAllFeeds();

        res.status(200).json({
            success: true,
            message: "News fetched successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};