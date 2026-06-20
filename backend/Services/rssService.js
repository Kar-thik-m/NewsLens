import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import Article from "../Modals/Article_schema.js";
import cron from "node-cron";

const feeds = [
    {
        source: "The Hindu",
        url: "https://www.thehindu.com/feeder/default.rss",
    },
    {
        source: "BBC",
        url: "https://feeds.bbci.co.uk/news/rss.xml",
    },
];

async function getFeed(url) {
    try {
        const response = await axios.get(url);

        const parser = new XMLParser({
            ignoreAttributes: false,
        });

        const result = parser.parse(response.data);

        let items = result?.rss?.channel?.item || [];

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

async function saveArticles(articles, source) {
    for (const article of articles) {
        try {
            const exists = await Article.findOne({
                link: article.link,
            });

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
                title: article.title,
                link: article.link,
                source,
                image: imageUrl,
                publishedAt: article.pubDate
                    ? new Date(article.pubDate)
                    : new Date(),
            });

        } catch (error) {
            console.error("Error saving article:", error.message);
        }
    }
}

export async function fetchAllFeeds() {
    try {
        for (const feed of feeds) {
            const articles = await getFeed(feed.url);

            await saveArticles(articles, feed.source);


        }

        console.log("All feeds fetched successfully");
    } catch (error) {
        console.error("Feed fetch error:", error.message);
    }
}

// Run immediately when server starts
fetchAllFeeds();

// Run every 30 minutes
cron.schedule("*/30 * * * *", async () => {
    console.log("Fetching latest news...");
    await fetchAllFeeds();
});