const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const axios = require('axios');
const sharp = require('sharp');

async function handleImageBlur(conn, mek, m, { reply }) {
    try {
        // Determine if the message contains an image or a quoted image
        const quoted = mek.msg?.contextInfo?.quotedMessage;
        const mime = (mek.msg || quoted)?.mimetype || '';

        if (!mime || !mime.includes('image')) {
            return reply("❌ Please reply to an image to apply the blur effect.");
        }

        await reply("⏳ Applying blur effect to the image, please wait...");

        // Download the media
        const mediaBuffer = await downloadMediaMessage(
            quoted ? { message: quoted } : mek,
            'buffer',
            {},
            { logger: console }
        );

        // Process the image using Sharp (resizing, formatting, and adding a blur effect)
        const processedBuffer = await sharp(mediaBuffer)
            .resize(800, 800, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .blur(15) // Apply blur filter
            .jpeg({ quality: 80 })
            .toBuffer();

        // Send the processed image back to the chat
        await conn.sendMessage(m.chat, {
            image: processedBuffer,
            caption: "✨ Blur effect applied successfully!"
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in img_blur command:", error);
        await reply(`❌ Error processing image: ${error.message || error}`);
    }
}

module.exports = handleImageBlur;
