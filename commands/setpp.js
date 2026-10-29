/**
 * Set Profile Picture Command - DEMON EMPEROR V4
 * Allows updating the WhatsApp bot's profile picture by replying to an image or sending one with the command.
 */
const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

const botConfig = {
    name: 'DEMON EMPEROR V4',
    version: '4.0'
};

const tempDir = path.join(__dirname, '../temp');

// Ensure temp directory exists
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

async function setProfilePicture(client, messageInfo, args) {
    try {
        const senderJid = messageInfo.key.remoteJid;
        
        // Check for quoted message or current message image
        const quotedMessage = messageInfo.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const targetMessage = quotedMessage || messageInfo.message;

        const isImage = targetMessage?.imageMessage || messageInfo.message?.imageMessage;

        if (!isImage) {
            return await client.sendMessage(senderJid, {
                text: `📸 *DEMON EMPEROR V4 - SET PROFILE PICTURE*\n\nPlease reply to an image or send an image with the caption *.setpp* to update the bot's profile picture.`
            }, { quoted: messageInfo });
        }

        // Download the media
        const imageMessage = targetMessage?.imageMessage || messageInfo.message.imageMessage;
        const stream = await downloadMediaMessage({ message: { imageMessage } }, 'buffer');
        
        let buffer = [];
        for await (const chunk of stream) {
            buffer.push(chunk);
        }
        const mediaBuffer = Buffer.concat(buffer);

        const tempFilePath = path.join(tempDir, `profile_${Date.now()}.jpg`);
        fs.writeFileSync(tempFilePath, mediaBuffer);

        // Update WhatsApp Profile Picture
        const botId = client.user.id;
        await client.updateProfilePicture(botId, { url: tempFilePath });

        // Clean up temp file
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }

        await client.sendMessage(senderJid, {
            text: `✅ *Success! Bot profile picture updated successfully.*\n\n_Powered by DEMON EMPEROR V4_`
        }, { quoted: messageInfo });

    } catch (error) {
        console.error('Error updating profile picture:', error);
        await client.sendMessage(messageInfo.key.remoteJid, {
            text: `❌ *Error updating profile picture:* ${error.message}`
        }, { quoted: messageInfo });
    }
}

module.exports = setProfilePicture;
