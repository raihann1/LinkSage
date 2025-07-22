import { replyInteraction } from "../methods"
export async function linkScan(interaction, link) {
    // check if the link is valid
   if (!link || !/^(https?:\/\/[^\s]+|www\.[^\s]+)$/i.test(link)) {
        await replyInteraction(interaction, "Invalid link provided. Please provide a valid URL.", true);
        return;
    } else {
        // Link scanning logic, check using external API and native methods
    }
}