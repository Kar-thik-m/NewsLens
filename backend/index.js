import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Connect_to_db from "./Db/Connect_To_DB.js";
import UserRoutes from "./Routes/User.js";
import NewsRoutes from "./Routes/News.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
Connect_to_db();


app.use("/api/user", UserRoutes);
app.use("/api/news", NewsRoutes);

app.get("/", (req, res) => {
    res.json({ success: true, message: "NewsLens API is running 🚀" });
});

app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});