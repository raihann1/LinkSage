import { CohereClientV2 } from "cohere-ai";
import { replyInteraction, editInteractionMsg, createEmbed } from "../methods";

export async function summarize(interaction) {
const cohere = new CohereClientV2({
    token: COHERE_API_KEY,
})

(async () => {
  const response = await cohere.chat({
    model: 'command-a-03-2025',
    messages: [
      {
        role: 'user',
        content: 'hello world!',
      },
    ],
  });

  console.log(response);
})();
}