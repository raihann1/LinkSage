import { replyInteraction, createEmbed } from "../methods";
import { commandInfo as pingCommand } from "./ping";
import { commandInfo as linkScanCommand } from "./linkscan";
import { commandInfo as previewCommand } from "./preview";
const commands = [pingCommand, linkScanCommand, previewCommand];
export async function help(interaction) {
    // loop through and create desc instead of doing this manually
    const helpDescription = commands.map(cmd => `\`${cmd.name}\`: ${cmd.description}`).join("\n");

    const embed = await createEmbed(
        "LinkSage",
        `List of available commands:\n\n${helpDescription}`,
        0x00ae86,
        "LinkSage"
    );
    await replyInteraction(interaction, "", true, embed);
}
