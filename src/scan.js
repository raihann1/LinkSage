const POLL_INTERVAL = 1000; // 1 second
const MAX_WAIT_TIME = 3000; // 3 seconds

export async function pollSslLabs(domain, interaction, startTime = Date.now()) {
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