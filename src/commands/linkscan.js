import { replyInteraction, editInteractionMsg, createEmbed } from "../methods"

const POLL_INTERVAL = 1000; // 1 second
const MAX_WAIT_TIME = 3000; // 3 seconds

async function pollSslLabs(domain, interaction, startTime = Date.now()) {
    const apiUrl = `https://api.ssllabs.com/api/v3/analyze?host=${domain}&publish=off&fromCache=on&all=done`;
    const resp = await fetch(apiUrl, { cf: { cacheTtl: 60 } });
    if (!resp.ok) {
        throw new Error(`SSL Labs API error: ${resp.status}`);
    }
    const data = await resp.json();

    if (data.endpoints && data.endpoints.length > 0 && data.endpoints[0].grade) {
        const endpoint = data.endpoints[0];
        const grade = endpoint.grade || "N/A";
        let symbol, message;
        if (["A+", "A", "A-", "B"].includes(grade)) {
            symbol = "✅";
            message = "Trusted SSL certificate";
        } else if (["C", "D", "E", "F", "T", "M", "N"].includes(grade)) {
            symbol = "❌";
            message = "Not trusted or insecure SSL certificate.";
        } else {
            symbol = "❓";
            message = "Unknown or no SSL grade available.";
        }
        return `SSL Labs: ${symbol} (${message})`;
    } else if (data.status === "ERROR") {
        console.error(`SSL Labs error: ${data.status}`);
        return `SSL Labs: ❓ (Unknown or no SSL grade available)`;
    } else {
        console.log(`SSL Labs status: ${data.status}`); // Still processing
        if (Date.now() - startTime < MAX_WAIT_TIME) {
            let timeElapsedinSeconds = Math.floor((Date.now() - startTime) / 1000);
            await editInteractionMsg(interaction, `⌛ Still scanning... Please wait. Time elapsed: ${timeElapsedinSeconds} seconds`, null);
            await new Promise(res => setTimeout(res, POLL_INTERVAL));
            return await pollSslLabs(domain, interaction, startTime);
        } else {
            return `SSL Labs: ❓ (Unknown)`;
        }
    }
}



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