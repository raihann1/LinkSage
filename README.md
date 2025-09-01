# 🔐 LinkSage – Stateless Discord Intelligence Bot

## Overview

**LinkSage** is a powerful, stateless Discord bot designed to enhance safety, productivity, and privacy in Discord communities. Built entirely on **Cloudflare Workers**, it integrates via **slash commands** and **message context menu commands** (User Apps), allowing users to analyze links with ease and speed — without any database or persistent state.

---

## 🎯 Core Features

| Feature        | Description |
|----------------|-------------|
| `linkscan`     | Scans a link for viruses, phishing, malware, and SSL certificate validity. |
| `preview`      | Generates a rich preview of any webpage showing its title, description, and thumbnail image. Particularly useful for shortened URLs. |
| `summarize`    | Generates an AI summary of the last ~100 messages in the channel. |

---

## ⚙️ Technology Stack

| Component       | Tech Used |
|-----------------|-----------|
| Runtime         | Cloudflare Workers |
| Bot Platform    | Discord API (Slash + Context Commands) |
| Summarization   | Cohere AI |
| Link Scanning   | VirusTotal, SSL Labs |
| Metadata Parsing| OpenGraph + Cheerio |

---

## 🚀 Planned Features 
| Feature        | Description |
|----------------|-------------|
| `verify-file`  | Scans a file for viruses or threats. |
| `tldr`      | Generates an AI summary of any article provided. |

## 🏠 Invite LinkSage to your server today!
[Invite Link](https://discord.com/oauth2/authorize?client_id=1392271362403467294)

If you have any questions or run into any issues, feel free to contact me through Discord (raihan.77)!
