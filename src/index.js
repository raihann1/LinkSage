import { Router } from "itty-router";
import { ping } from "./commands/ping";
import { linkScan } from "./commands/linkscan";
import { help } from "./commands/help";
import { deferReply } from "./methods";
import { verifyKey } from "discord-interactions";
import { InteractionType } from "discord-api-types/v10";
const router = Router();
router.get("/", () => new Response("Pong!", { status: 200 }));
router.get("/favicon.ico", () => new Response(null, { status: 404 }));
router.post("/interactions", async (request, args) => {
  const { event } = args;
  const message = await request.json();
  if (message.type === InteractionType.Ping) {
    return new Response(JSON.stringify({ type: 1 }), { status: 200 });
  } else if (message.type === InteractionType.ApplicationCommand) {
    // Slash command handling
    if (message.data.name === "ping") {
      event.waitUntil(
        (async () => {
          await ping(message);
        })()
      );
      return new Response(await deferReply(true), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (message.data.name === "linkscan") {
      event.waitUntil(
        (async () => {
          await linkScan(message, message.data.options[0].value);
        })()
      );
      return new Response(await deferReply(true), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (message.data.name === "help") {
      event.waitUntil(
        (async () => {
          await help(message);
        })()
      );
      return new Response(await deferReply(true), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
});

// handle incoming requests, verify interactions

const handlePost = async (e) => {
  const signature = e.request.headers.get("x-signature-ed25519");
  const timestamp = e.request.headers.get("x-signature-timestamp");
  if (!signature || !timestamp) {
    return new Response(JSON.stringify({ error: "Failed to verify request" }), {
      status: 401,
    });
  } else {
    const body = await e.request.clone().arrayBuffer();
    const isValidRequest = await verifyKey(
      body,
      signature,
      timestamp,
      DISCORD_PUBLIC_KEY
    );
    if (!isValidRequest) {
      return new Response(
        JSON.stringify({ error: "Failed to verify request" }),
        {
          status: 401,
        }
      );
    } else {
      return await router.fetch(e.request, { event: e });
    }
  }
};
addEventListener("fetch", (e) => {
  if (e.request.method === "POST") {
    e.respondWith(handlePost(e));
  } else {
    e.respondWith(router.fetch(e.request, { event: e }));
  }
});
