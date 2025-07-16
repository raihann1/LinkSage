import { InteractionResponseType } from 'discord-api-types/v10'
module.exports = {
    replyInteraction: async (interaction, content, ephemeral) => {
        if (ephemeral) {
            // replies to the given interaction privately (ephemeral)
            return await fetch(`https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content,
                    flags: 1 << 6,
                }),
            })
        } else {
            await fetch(`https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content,
                }),
            })
        }
    },
    deferReply: async (ephemeral) => {
        const deferRes = {
            type: InteractionResponseType.DeferredChannelMessageWithSource
        }
        const deferResEph = {
            type: InteractionResponseType.DeferredChannelMessageWithSource,
            data: {
                flags: 1 << 6,
            }
        }
        if(ephemeral) {
            return JSON.stringify(deferResEph);
        } else {
            return JSON.stringify(deferRes);
        }
    }
}
