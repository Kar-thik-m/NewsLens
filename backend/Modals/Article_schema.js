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
        image: {
            type: String,
        },
        source: {
            type: String,
            required: true,
        },
        category: {
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

// Compound index for efficient category + date sorting
articleSchema.index({ category: 1, publishedAt: -1 });

// Text index for full-text search on title
articleSchema.index({ title: "text" });

export default mongoose.model("Article", articleSchema);