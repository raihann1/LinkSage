import { replyInteraction, editInteractionMsg, createEmbed } from "../methods"
import { pollSslLabs } from "../scan";

export async function linkScan(interaction, link) {
    // check if the link is valid
if (!link || !/^((https?:\/\/)?(www\.)?)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/i.test(link)) {
    await replyInteraction(interaction, "Invalid link provided. Please provide a valid URL.", true);
    return;
} else {
    // we're going to reply initally that the link is being scanned, THEN edit our interaction reply
    await replyInteraction(interaction, `⌛ Scanning link. Please wait.`, true);
    // Link scanning logic, check using external API and native methods
    const domain = link.replace(/^(https?:\/\/)?(www\.)?/i, '').split('/')[0];
    // FIRST: SSL Labs API
    let sslLabsResult;
    try {
        sslLabsResult = await pollSslLabs(domain, interaction);
    } catch (err) {
        console.error(`SSL Labs error: ${err.message}`);
        sslLabsResult = `SSL Labs: ❓ (Unknown)`;
    }
    // create embed for results
    const embed = await createEmbed("LinkSage - Results", `Results for **${link}**:\n\n${sslLabsResult}`, 0x00AE86, "LinkSage", "https://cdn.discordapp.com/attachments/1396626483736346735/1397352856620761200/99BCF3CC-BDDF-4888-87BA-CE23EF37B015.png?ex=688169c2&is=68801842&hm=f8062cdccaf5566bfa92fa9d489a54329ca2ed018b9928da9412eeae556b16f6");
    await editInteractionMsg(interaction, `Scan complete! View results below.`, embed);
  }
}

export const commandInfo = {
    name: '/linkscan',
    description: 'Scans a link for security issues',
}