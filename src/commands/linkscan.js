import { replyInteraction, editInteractionMsg, createEmbed } from "../methods"
import { pollSslLabs, pollVirusTotal, getOverallAnalysis } from "../scan";


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
    // SECOND: VirusTotal API
    let virusTotalResult;
    try {
        virusTotalResult = await pollVirusTotal(domain, interaction);
    } catch (err) {
        console.error(`VirusTotal error: ${err.message}`);
        virusTotalResult = `VirusTotal: ❓ (Unknown)`;
    }

    const overallAnalysis = getOverallAnalysis(sslLabsResult, virusTotalResult);
    const fields = [
        { name: "SSL Labs", value: sslLabsResult, inline: true },
        { name: "VirusTotal", value: virusTotalResult, inline: true },
        { name: "Overall Analysis", value: overallAnalysis, inline: false }
    ];
    // change the embed color based on the overall analysis
    let embedColor;
    if (overallAnalysis.includes("DANGEROUS") || overallAnalysis.includes("HIGH RISK")) {
        embedColor = 0xFF0000; // Red for dangerous/high risk
    } else if (overallAnalysis.includes("MEDIUM RISK") || overallAnalysis.includes("LOW RISK")) {
        embedColor = 0xFFA500; // Orange for medium risk/low risk
    } else if (overallAnalysis.includes("SAFE")) {
        embedColor = 0x00AE86; // Green for safe
    } else {
        embedColor = 0x808080; // Gray for unknown
    }
    const embed = await createEmbed("LinkSage - Results", `Results for **${link}**:\n`, embedColor, "LinkSage", "https://cdn.discordapp.com/attachments/1396626483736346735/1397352856620761200/99BCF3CC-BDDF-4888-87BA-CE23EF37B015.png?ex=688169c2&is=68801842&hm=f8062cdccaf5566bfa92fa9d489a54329ca2ed018b9928da9412eeae556b16f6", fields);
    await editInteractionMsg(interaction, `Scan complete! View results below.`, embed);
  }
}

export const commandInfo = {
    name: '/linkscan',
    description: 'Scans a link for security issues',
}