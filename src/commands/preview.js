import { replyInteraction } from "../methods";
import * as cheerio from 'cheerio';

export async function preview(interaction) {
    const link = interaction.data.options[0].value;
    
    if (
        !link ||
        !/^((https?:\/\/)?(www\.)?)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/i.test(
            link
        )
    ) {
        await replyInteraction(
            interaction,
            "Invalid link provided. Please provide a valid URL.",
            true
        );
        return;
    }

    // Add protocol if missing
    let fullUrl = link;
    if (!/^https?:\/\//i.test(link)) {
        fullUrl = `https://${link}`;
    }

    try {
        const response = await fetch(fullUrl, {
            method: "GET",
            redirect: "follow",
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; LinkSage/1.0; +https://github.com/yourusername/linksage)'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Parse the HTML content
        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract metadata
        const title = $("title").text().trim() || 
                     $('meta[property="og:title"]').attr("content") || 
                     $('meta[name="twitter:title"]').attr("content") || 
                     "No title found";

        const description = $('meta[name="description"]').attr("content") || 
                           $('meta[property="og:description"]').attr("content") || 
                           $('meta[name="twitter:description"]').attr("content") || 
                           "No description available";

        const ogImage = $('meta[property="og:image"]').attr("content");
        const twitterImage = $('meta[name="twitter:image"]').attr("content");
        const faviconImage = $('link[rel="icon"]').attr("href") || $('link[rel="shortcut icon"]').attr("href");

    } catch (error) {
        console.error(`Preview error: ${error.message}`);
        await replyInteraction(
            interaction,
            `Failed to fetch link preview: ${error.message}. Please check the link and try again.`,
            true
        );
    }
}