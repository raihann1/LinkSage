import { replyInteraction } from "../methods";
export async function preview(interaction) {
    await replyInteraction(interaction, "Work in progress.", true);
}