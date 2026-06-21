import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import Article from "../Modals/Article_schema.js";
import cron from "node-cron";

const feeds = [
    // ── General ──────────────────────────────────────────────
    {
        source: "The Hindu",
        url: "https://www.thehindu.com/feeder/default.rss",
        category: "General",
    },
    {
        source: "BBC News",
        url: "https://feeds.bbci.co.uk/news/rss.xml",
        category: "General",
    },

    // ── Technology ───────────────────────────────────────────
    {
        source: "TechCrunch",
        url: "https://techcrunch.com/feed/",
        category: "Technology",
    },
    {
        source: "The Verge",
        url: "https://www.theverge.com/rss/index.xml",
        category: "Technology",
    },

    // ── Business ─────────────────────────────────────────────
    {
        source: "BBC Business",
        url: "https://feeds.bbci.co.uk/news/business/rss.xml",
        category: "Business",
    },
    {
        source: "The Hindu Business",
        url: "https://www.thehindu.com/business/feeder/default.rss",
        category: "Business",
    },

    // ── Science ──────────────────────────────────────────────
    {
        source: "BBC Science",
        url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
        category: "Science",
    },
    {
        source: "NASA Breaking News",
        url: "https://www.nasa.gov/rss/dyn/breaking_news.rss",
        category: "Science",
    },

    // ── Sports ───────────────────────────────────────────────
    {
        source: "BBC Sport",
        url: "https://feeds.bbci.co.uk/sport/rss.xml",
        category: "Sports",
    },
    {
        source: "The Hindu Sport",
        url: "https://www.thehindu.com/sport/feeder/default.rss",
        category: "Sports",
    },

    // ── Health ───────────────────────────────────────────────
    {
        source: "BBC Health",
        url: "https://feeds.bbci.co.uk/news/health/rss.xml",
        category: "Health",
    },

    // ── World ────────────────────────────────────────────────
    {
        source: "BBC World",
        url: "https://feeds.bbci.co.uk/news/world/rss.xml",
        category: "World",
    },
    {
        source: "The Hindu International",
        url: "https://www.thehindu.com/news/international/feeder/default.rss",
        category: "World",
    },
];

async function getFeed(url) {
    try {
        const response = await axios.get(url, { timeout: 10000 });

        const parser = new XMLParser({
            ignoreAttributes: false,
        });

        const result = parser.parse(response.data);

        let items = result?.rss?.channel?.item || result?.feed?.entry || [];

        if (!Array.isArray(items)) {
            items = [items];
        }

        return items;
    } catch (error) {
        console.error(`Error fetching feed: ${url}`);
        console.error(error.message);
        return [];
    }
}

async function saveArticles(articles, source, category) {
    for (const article of articles) {
        try {
            const link = article.link?.["@_href"] || article.link;
            if (!link) continue;

            const exists = await Article.findOne({ link });
            if (exists) continue;

            let imageUrl = "";

            // BBC / Media RSS
            if (article["media:thumbnail"]) {
                imageUrl = article["media:thumbnail"]["@_url"];
            }

            // Some feeds use media:content
            if (!imageUrl && article["media:content"]) {
                imageUrl = article["media:content"]["@_url"];
            }

            // Some feeds use enclosure
            if (!imageUrl && article.enclosure) {
                imageUrl = article.enclosure["@_url"];
            }

            await Article.create({
                title: article.title?.["#text"] || article.title,
                link,
                source,
                category,
                image: imageUrl,
                publishedAt: article.pubDate || article.published
                    ? new Date(article.pubDate || article.published)
                    : new Date(),
            });
        } catch (error) {
            if (error.code !== 11000) {
                // ignore duplicate key errors silently
                console.error("Error saving article:", error.message);
            }
        }
    }
}

export async function fetchAllFeeds() {
    try {
        for (const feed of feeds) {
            const articles = await getFeed(feed.url);
            await saveArticles(articles, feed.source, feed.category);
        }

        console.log("All feeds fetched successfully");
    } catch (error) {
        console.error("Feed fetch error:", error.message);
    }
}

export function getCategories() {
    return [...new Set(feeds.map((f) => f.category))];
}

// Run immediately when server starts
fetchAllFeeds();

// Run every 30 minutes
cron.schedule("*/30 * * * *", async () => {
    console.log("Fetching latest news...");
    await fetchAllFeeds();
});