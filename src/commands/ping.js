import { replyInteraction } from "../methods"
export async function ping(interaction) {
    await replyInteraction(interaction, "Pong!", true);
}