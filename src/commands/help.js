import { replyInteraction, createEmbed } from "../methods"
export async function help(interaction) {
    await replyInteraction(interaction, "Help command", true);
}