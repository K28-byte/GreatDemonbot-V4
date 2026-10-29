const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { messageConfig } = require('../lib/messageConfig');
const fs = require('fs');
const path = require('path');

async function viewOnceCommand(conn, mek, m, { from, quoted, reply, isOwner }) {
    try {
        const targetMessage = quoted || m;
        
        // Check if the message is a View Once message
        const viewOnceInner = targetMessage.message?.viewOnceMessage?.message || 
                              targetMessage.message?.viewOnceMessageV2?.message;

        const mediaMessage = viewOnceInner || targetMessage.message;
        const mediaType = Object.keys(mediaMessage || {})[0];

        const isViewOnce = viewOnceInner || 
                           mediaMessage?.imageMessage?.viewOnce || 
                           mediaMessage?.videoMessage?.viewOnce;

        if (!isViewOnce || !['imageMessage', 'videoMessage'].includes(mediaType)) {
            return reply('⚠️ Please reply to a View Once image or video.');
        }

        // Download the media buffer
        const stream = await downloadMediaMessage(
            { message: mediaMessage },
            'buffer',
            {},
            { logger: console }
        );

        const innerMedia = mediaMessage[mediaType];
        const caption = innerMedia?.caption || '';
        const isVideo = mediaType === 'videoMessage';

        // Send back the decrypted media
        await conn.sendMessage(from, {
            [isVideo ? 'video' : 'image']: stream,
            caption: `*𝐄𝐌𝐌𝐘𝐇𝐄𝐍𝐙-𝐕1*\n\n*𝐕𝐈𝐄𝐖 𝐎𝐍𝐂𝐄 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐄𝐃 😎*\n${caption ? `*Caption:* ${caption}` : ''}`,
            ...messageConfig
        }, { quoted: mek });

    } catch (error) {
        console.error('Error in viewonce command:', error);
        await reply(`❌ An error occurred while processing the View Once message: ${error.message}`);
    }
}

module.exports = viewOnceCommand;
