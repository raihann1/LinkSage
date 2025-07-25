const POLL_INTERVAL = 2000;
const MAX_WAIT_TIME = 17000;
const MAX_WAIT_VT = 5000;

import { editInteractionMsg } from "./methods.js";
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
    console.error(`Morre info for SSL Labs error: ${data}`);
    return `SSL Labs: ❓ (Unknown or no SSL grade available)`;
  } else {
    console.log(`SSL Labs status: ${data.status}`); // Still processing
    if (Date.now() - startTime < MAX_WAIT_TIME) {
      let timeElapsedinSeconds = Math.floor((Date.now() - startTime) / 1000);
      await editInteractionMsg(
        interaction,
        `⌛ Scanning SSL certificate... Please wait. Time elapsed: ${timeElapsedinSeconds} seconds`,
        null
      );
      await new Promise((res) => setTimeout(res, POLL_INTERVAL));
      return await pollSslLabs(domain, interaction, startTime);
    } else {
      return `SSL Labs: ❓ (Unknown)`;
    }
  }
}

export async function pollVirusTotal(
  domain,
  interaction,
  startTime = Date.now()
) {
  const apiUrl = `https://www.virustotal.com/api/v3/domains/${domain}`;
  const resp = await fetch(apiUrl, {
    headers: {
      "x-apikey": VT_API_KEY,
    },
  });
  if (!resp.ok) {
    throw new Error(`VirusTotal API error: ${resp.status}`);
  }
  const data = await resp.json();

  if (data.data && data.data.attributes.last_analysis_stats) {
    const stats = data.data.attributes.last_analysis_stats;
    console.log(stats);
    console.log(data.data);
    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    const harmless = stats.harmless || 0;
    const undetected = stats.undetected || 0;
    let symbol, grade, message;

    if (malicious === 0 && suspicious === 0) {
      symbol = "✅";
      grade = "Clean";
      message = "No security vendors flagged this domain as malicious";
    } else if (malicious === 0 && suspicious <= 3) {
      symbol = "⚠️";
      grade = "Low Risk";
      message = `${suspicious} vendor(s) flagged as suspicious - likely safe but use caution`;
    } else if (malicious <= 2 && malicious + suspicious <= 6) {
      symbol = "⚠️";
      grade = "Medium Risk";
      message = `${malicious} malicious, ${suspicious} suspicious detections - exercise caution`;
    } else if (malicious <= 5 || malicious + suspicious <= 10) {
      symbol = "❌";
      grade = "High Risk";
      message = `${malicious} malicious, ${suspicious} suspicious detections - not recommended`;
    } else {
      symbol = "🚨";
      grade = "Dangerous";
      message = `${malicious} malicious, ${suspicious} suspicious detections - avoid this domain`;
    }

    return `VirusTotal: ${symbol} ${grade}\n${message}`;
  } else if (data.error) {
    console.error(`VirusTotal error: ${data.error.message}`);
    return `VirusTotal: ❓ (Unknown or no analysis available)`;
  } else {
    console.log(`VirusTotal status: ${data.status}`); // Still processing
    if (Date.now() - startTime < MAX_WAIT_VT) {
      let timeElapsedinSeconds = Math.floor((Date.now() - startTime) / 1000);
      await editInteractionMsg(
        interaction,
        `⌛ Scanning for virus/malware.. Please wait. Time elapsed: ${timeElapsedinSeconds} seconds`,
        null
      );
      await new Promise((res) => setTimeout(res, POLL_INTERVAL));
      return await pollVirusTotal(domain, interaction, startTime);
    } else {
      return `VirusTotal: ❓ (Unknown)`;
    }
  }
}

export function getOverallAnalysis(sslResult, vtResult) {
  // Extract SSL grade and VT grade from result strings
  const sslSafe = sslResult.includes("✅");
  const sslWarning = sslResult.includes("❌");
  const sslUnknown = sslResult.includes("❓");

  const vtClean = vtResult.includes("Clean") || vtResult.includes("Low Risk");
  const vtSuspicious = vtResult.includes("Medium Risk");
  const vtDangerous =
    vtResult.includes("High Risk") || vtResult.includes("Dangerous");
  const vtUnknown = vtResult.includes("❓");

  let symbol, verdict, recommendation;

  if (vtDangerous) {
    symbol = "🚨";
    verdict = "DANGEROUS";
    recommendation =
      "Do not visit this site. Multiple security vendors have flagged it as malicious.";
  } else if (vtSuspicious && sslWarning) {
    symbol = "❌";
    verdict = "HIGH RISK";
    recommendation =
      "Avoid this site. Both SSL configuration and threat analysis show security concerns.";
  } else if (vtSuspicious) {
    symbol = "⚠️";
    verdict = "MEDIUM RISK";
    recommendation =
      "Exercise caution. Some security vendors have flagged this domain.";
  } else if (sslWarning && vtClean) {
    symbol = "⚠️";
    verdict = "MEDIUM RISK";
    recommendation =
      "SSL certificate issues detected, but no malicious content found. Proceed with caution.";
  } else if (sslSafe && vtClean) {
    symbol = "✅";
    verdict = "SAFE";
    recommendation =
      "This site appears secure with a valid SSL certificate and no malicious flags. It is most likely safe to visit, but always proceed with caution.";
  } else if (sslSafe && vtUnknown) {
    symbol = "⚠️";
    verdict = "UNKNOWN";
    recommendation =
      "SSL certificate is valid, but threat analysis was unavailable. Try running again later or use caution when visiting the website.";
  } else if (sslUnknown && vtClean) {
    symbol = "⚠️";
    verdict = "LIKELY SAFE";
    recommendation =
      "No security threats detected, though SSL analysis was inconclusive.";
  } else {
    symbol = "⚠️";
    verdict = "UNKNOWN";
    recommendation =
      "Unable to complete full security analysis. This may be due to the fact the domain does not exist, is unreachable, or the analysis timed out. You can try again, but still exercise caution when visiting.";
  }

  return `\n\n${symbol} **${verdict}**\n${recommendation}`;
}
