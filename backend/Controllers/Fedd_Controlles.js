import Article from "../Modals/Article_schema.js";
import { fetchAllFeeds, getCategories } from "../Services/rssService.js";

export const getArticles = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 30 } = req.query;

        const query = {};

        // Category filter
        if (category && category !== "All") {
            query.category = category;
        }

        // Search filter — case-insensitive title match
        if (search && search.trim() !== "") {
            query.title = { $regex: search.trim(), $options: "i" };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [articles, total] = await Promise.all([
            Article.find(query)
                .sort({ publishedAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Article.countDocuments(query),
        ]);

        res.status(200).json({
            success: true,
            count: articles.length,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
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

export const getAvailableCategories = async (req, res) => {
    try {
        // Get categories both from the feed config and from what's actually in DB
        const dbCategories = await Article.distinct("category");
        const feedCategories = getCategories();

        const all = [...new Set([...feedCategories, ...dbCategories])].sort();

        res.status(200).json({
            success: true,
            categories: ["All", ...all],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const FilterCategory = async (req, res) => {
    try {
        const { category } = req.body;

        const articles = await Article.find({
            category: {
                $in: category.split(",").map(c => c.trim())
            }
        }).sort({ publishedAt: -1 });

        res.status(200).json({
            success: true,
            articles
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const DeleteAllArticles = async (req, res) => {
    try {
        const result = await Article.deleteMany({});

        res.status(200).json({
            success: true,
            message: "All articles deleted successfully",
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};