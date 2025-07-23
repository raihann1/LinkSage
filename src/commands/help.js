import { replyInteraction, createEmbed } from "../methods"
export async function help(interaction) {
    const embed = await createEmbed("LinkSage", "List of available commands:\n- /ping: Responds with Pong!\n- /linkscan: Scans a link for security issues", 0x00AE86, "LinkSage");
    await replyInteraction(interaction, "", true, embed);
}