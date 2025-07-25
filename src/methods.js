import { InteractionResponseType } from 'discord-api-types/v10'
import * as discordBuilder from '@discordjs/builders'
module.exports = {
    replyInteraction: async (interaction, content, ephemeral, embed) => {
        if (ephemeral && embed) {
            // replies to the given interaction privately (ephemeral)
            return await fetch(`https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content,
                    flags: 1 << 6,
                    embeds: [embed],
                }),
            })
        } else if(!ephemeral && embed) {
            await fetch(`https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content,
                    embeds: [embed],
                }),
            })
        } else if (ephemeral && !embed) {
           return await fetch(`https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content,
                    flags: 1 << 6
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
    },
    editInteractionMsg: async (interaction, content, embed) => {
        // edits the original interaction message
        if(!embed) {
        return await fetch(`https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`, {
            method: 'PATCH',    
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
            })
        });
      } else {
        return await fetch(`https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`, {
            method: 'PATCH',    
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
                embeds: [embed]
            })
        });
      }
    },
    createEmbed: async (title, description, color, footer, thumbnail, fields) => {
        const embed = new discordBuilder.EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
        if(fields) {
            embed.addFields(fields);
        }
        if(footer) {
            embed.setFooter({ text: footer });
        }
        if (thumbnail) {
            embed.setThumbnail(thumbnail);
        }
        return embed;
    }
}
