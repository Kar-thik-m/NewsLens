import express from "express";
import {
    getArticles,
    fetchNews,
    getAvailableCategories,
    FilterCategory,
} from "../Controllers/Fedd_Controlles.js";

const router = express.Router();

router.get("/get-news", getArticles);
router.get("/fetch-news", fetchNews);
router.get("/categories", getAvailableCategories);
router.get("/filter-category", FilterCategory);
export default router;