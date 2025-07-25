import { replyInteraction } from "../methods";
export async function ping(interaction) {
  console.log("Ping command received");
  await replyInteraction(interaction, "Pong!", true, null);
}

export const commandInfo = {
  name: "/ping",
  description: "Replies with Pong!",
};
