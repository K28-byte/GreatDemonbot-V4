const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const settings = require('../settings');
const WebP = require('node-webpmux');
const crypto = require('crypto');

async function stickerCommand(client, message, args) {
    try {
        // Check if the message contains media or quotes media
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const mediaMessage = message.message?.imageMessage || message.message?.videoMessage || quotedMessage?.imageMessage || quotedMessage?.videoMessage;

        if (!mediaMessage) {
            return client.sendMessage(message.key.remoteJid, {
                text: '*STICKER COMMAND*\n\nSend or reply to an image or video with *.sticker* to convert it into a sticker.'
            }, { quoted: message });
        }

        // Determine target message object for downloading
        const targetMessage = quotedMessage ? { message: quotedMessage } : message;
        
        let mediaBuffer;
        try {
            mediaBuffer = await downloadMediaMessage(targetMessage, 'buffer', {});
        } catch (downloadError) {
            console.error('Error downloading media:', downloadError);
            return client.sendMessage(message.key.remoteJid, {
                text: 'Failed to download media. Please try again.'
            }, { quoted: message });
        }

        const tempDir = path.join(osTmpDir(), 'stickers');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const randomId = crypto.randomBytes(6).readUIntLE(0, 6).toString(36);
        const inputFilePath = path.join(tempDir, `temp_${randomId}`);
        const outputFilePath = path.join(tempDir, `sticker_${randomId}.webp`);

        fs.writeFileSync(inputFilePath, mediaBuffer);

        // Check if media is a video (animated sticker support)
        const isAnimated = mediaMessage.seconds > 0 || mediaMessage.videoMessage;

        // Ffmpeg command for conversion
        const ffmpegCommand = isAnimated
            ? `ffmpeg -i "${inputFilePath}" -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 75 -compression_level 6 "${outputFilePath}"`
            : `ffmpeg -i "${inputFilePath}" -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 75 -compression_level 6 "${outputFilePath}"`;

        await new Promise((resolve, reject) => {
            exec(ffmpegCommand, (error) => {
                if (error) reject(error);
                else resolve();
            });
        });

        // Add EXIF metadata (Pack name and Author)
        const img = new WebP.Image();
        await img.load(outputFilePath);
        
        const exifData = {
            'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
            'sticker-pack-name': settings.packname || 'Bot Sticker',
            'sticker-pack-publisher': settings.author || 'Demon Emperor',
            'emojis': ['🤖']
        };

        const exifBuffer = Buffer.from(JSON.stringify(exifData));
        const exifHeader = Buffer.from([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x54, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
        
        const fullExif = Buffer.concat([exifHeader, exifBuffer]);
        img.exif = fullExif;
        
        const finalBuffer = await img.save(null);

        // Send the sticker back
        await client.sendMessage(message.key.remoteJid, {
            sticker: finalBuffer
        }, { quoted: message });

        // Cleanup temporary files
        try {
            fs.unlinkSync(inputFilePath);
            fs.unlinkSync(outputFilePath);
        } catch (cleanupErr) {
            console.error('Error cleaning up temp files:', cleanupErr);
        }

    } catch (error) {
        console.error('Error in sticker command:', error);
        await client.sendMessage(message.key.remoteJid, {
            text: 'An error occurred while generating the sticker.'
        }, { quoted: message });
    }
}

function osTmpDir() {
    return require('os').tmpdir();
}

module.exports = stickerCommand;
