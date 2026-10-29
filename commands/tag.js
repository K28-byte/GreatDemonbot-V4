const { isSenderAdmin } = require('../lib/isAdmin'); // Depending on your project structure
const { getContentType } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

async function tagCommandHandler(client, message, args) {
    try {
        const remoteJid = message.key.remoteJid;
        const isGroup = remoteJid.endsWith('@g.us');

        if (!isGroup) {
            return client.sendMessage(remoteJid, {
                text: 'This command can only be used in groups.'
            }, { quoted: message });
        }

        // Check group metadata and admin status if required
        const groupMetadata = await client.groupMetadata(remoteJid);
        const participants = groupMetadata.participants;

        const memberJids = participants.map(p => p.id);
        const reason = args.join(' ') || 'Attention everyone!';

        let tagText = `*╔═══[ TAG ALL ]═══*\n`;
        tagText += `*╠ Message:* ${reason}\n`;
        tagText += `*╠ Members:* ${participants.length}\n`;
        tagText += `*╚══════════════════*\n\n`;

        for (let participant of participants) {
            tagText += `@${participant.id.split('@')[0]}\n`;
        }

        await client.sendMessage(remoteJid, {
            text: tagText,
            mentions: memberJids
        }, { quoted: message });

    } catch (error) {
        console.error('Error in tag command:', error);
        await client.sendMessage(message.key.remoteJid, {
            text: 'An error occurred while executing the tag command.'
        }, { quoted: message });
    }
}

module.exports = tagCommandHandler;
