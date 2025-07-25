import { replyInteraction, createEmbed } from "../methods";
import { commandInfo as pingCommand } from "./ping";
import { commandInfo as linkScanCommand } from "./linkscan";
export async function help(interaction) {
  const embed = await createEmbed(
    "LinkSage",
    `List of available commands:\n\n\`${pingCommand.name}\`: ${pingCommand.description}\n\`${linkScanCommand.name}\`: ${linkScanCommand.description}`,
    0x00ae86,
    "LinkSage"
  );
  await replyInteraction(interaction, "", true, embed);
}
