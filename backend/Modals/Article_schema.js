import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
            unique: true,
        },
        source: {
            type: String,
            required: true,
        },
        publishedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Article", articleSchema);