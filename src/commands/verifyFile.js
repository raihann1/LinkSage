import { replyInteraction } from "../methods";
export async function verifyFile(interaction) {
    // fetch attachment from interaction data
    const attachment = interaction.data?.resolved?.messages?.[interaction.data.target_id]?.attachments;
    if (!attachment) {
        return await replyInteraction(interaction, "No file attached to the message.", true);
    }
    // fetch attachments, even if multiple
    const files = attachment.map(file => file.url);
    if (files.length === 0) {
        return await replyInteraction(interaction, "No files found in the message.", true);
    } else {
         await replyInteraction(interaction, `⌛ Scanning ${files.length} file(s). Please wait.`, true);
    }
    
}

export const commandInfo = {
    name: "Scan Files",
    description: "Scans any files attached to the message for safety and security purposes.",
};