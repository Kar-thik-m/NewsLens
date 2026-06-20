import express from "express";
import {
    getArticles,
    fetchNews,
} from "../Controllers/Fedd_Controlles.js";

const router = express.Router();

router.get("/get-news", getArticles);
router.get("/fetch-news", fetchNews);

export default router;