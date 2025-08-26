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
         // use filescan.io api to scan each file
         const results = [];
         for(let i = 0; i < files.length; i++) {
            const fileUrl = files[i];
            console.log(fileUrl)
            try {
                const apiUrl = `https://filescan.io/api/scan/url`;
                const resp = await fetch(apiUrl, {
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json",
                        "X-Api-Key": FS_API_KEY
                    },
                    body: JSON.stringify({ 
                        url: fileUrl, 
                    })
                });
                if (!resp.ok) {
                    console.log(await resp.json());
                    throw new Error(`FileScan API error: ${resp.status}`);
                }
                const data = await resp.json();
                console.log(data);
            } catch (err) {
                console.error(`FileScan error: ${err.message}`);
            }
        }
    }
}

export const commandInfo = {
    name: "Scan Files",
    description: "Scans any files attached to the message for safety and security purposes.",
};