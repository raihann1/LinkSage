const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const {
  SlashCommandBuilder,
} = require("@discordjs/builders");
const client = new Client({
  intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds],
});

client.on("ready", async () => {
  console.log("Successfully connected! Running registration to load slash commands now...")
  const guildID = process.env.TEST_SERVER
  const guild = await client.guilds.fetch(guildID);
  const pingCmd = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");
  const linkScanCmd = new SlashCommandBuilder()
    .setName("linkscan")
    .setDescription("Scans given link for any malware, phising, etc.")
    .addStringOption((option) =>
      option.setName("link").setDescription("Link to scan").setRequired(true)
    );
  const helpCmd = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows information about the bot, including commands.");
  await guild.commands.set([
    pingCmd.toJSON(),
    linkScanCmd.toJSON(),
    helpCmd.toJSON()
  ]);
  // Guild-only commands while in development
  await client.application?.commands.set([]);
  console.log("Slash commands loaded into guild!");
});

client.login(process.env.DISCORD_BOT_TOKEN);