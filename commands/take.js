const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { Image } = require('node-webpmux');
const crypto = require('crypto');

async function downloadMediaMessage(message, mediaType) {
    const stream = await downloadContentFromMessage(message, mediaType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
}

async function takeCommand(sock, chatId, message, args, replyMessage) {
    try {
        if (!replyMessage || (!replyMessage.stickerMessage && !replyMessage.imageMessage)) {
            await sock.sendMessage(chatId, { text: 'Please reply to an image or sticker to use this command.' });
            return;
        }

        let mediaBuffer;
        let mediaType;

        if (replyMessage.stickerMessage) {
            mediaBuffer = await downloadMediaMessage(replyMessage.stickerMessage, 'sticker');
            mediaType = 'sticker';
        } else if (replyMessage.imageMessage) {
            mediaBuffer = await downloadMediaMessage(replyMessage.imageMessage, 'image');
            mediaType = 'image';
        }

        // Parse pack and author name from args if provided (e.g., packname | author)
        const textArgs = args.join(' ').split('|');
        const packname = textArgs[0] ? textArgs[0].trim() : '🤖';
        const author = textArgs[1] ? textArgs[1].trim() : 'Emperor🌀;

        // Process sticker metadata using webpmux
        const img = new Image();
        await img.load(mediaBuffer);
        
        const json = {
            'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
            'sticker-pack-name': packname,
            'sticker-pack-publisher': author,
            'emojis': ['🤖']
        };

        const exifAttr = Buffer.from([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
        const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
        const exif = Buffer.concat([exifAttr, jsonBuffer]);
        exif.writeUIntLE(jsonBuffer.length, 14, 4);

        img.exif = exif;
        const modifiedStickerBuffer = await img.save(null);

        await sock.sendMessage(chatId, {
            sticker: modifiedStickerBuffer
        }, { quoted: message });

    } catch (error) {
        console.error('Error in take command:', error);
        await sock.sendMessage(chatId, { text: 'An error occurred while processing the sticker.' });
    }
}

module.exports = takeCommand;
