const fetch = require('node-fetch');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

/**
 * Handles creating a sticker from combined emojis using the Tenor Emoji Kitchen API and ffmpeg.
 * 
 * @param {Object} client - The WhatsApp bot client instance
 * @param {Object} message - The incoming message object
 * @param {Array} args - Command arguments
 */
async function handleEmojiMixCommand(client, message, args) {
    try {
        // Extract emojis or query arguments from the message
        const body = message.body || message.text || '';
        const textArgs = body.split(' ').slice(1);

        if (textArgs.length === 0) {
            return await client.sendMessage(message.from, {
                text: '⚠️ Please provide two emojis to mix! Example: .emojimix 😃+🔥'
            }, { quoted: message });
        }

        const queryInput = textArgs.join(' ');
        if (!queryInput.includes('+')) {
            return await client.sendMessage(message.from, {
                text: '⚠️ Please separate the two emojis with a "+" sign. Example: .emojimix 😃+🔥'
            }, { quoted: message });
        }

        const [emoji1, emoji2] = queryInput.split('+').map(e => e.trim());

        // Fetch from Tenor Emoji Kitchen API
        const tenorUrl = `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`;
        
        const response = await fetch(tenorUrl);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return await client.sendMessage(message.from, {
                text: '❌ Could not find a combination for those emojis. Try another pair!'
            }, { quoted: message });
        }

        const imageUrl = data.results[0].media_formats.png_transparent.url;
        const tmpDir = path.join(process.cwd(), 'tmp');

        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        const tempInputPath = path.join(tmpDir, `temp_${Date.now()}.png`).replace(/\\/g, '/');
        const tempOutputPath = path.join(tmpDir, `sticker_${Date.now()}.webp`).replace(/\\/g, '/');

        // Download image
        const imageRes = await fetch(imageUrl);
        const imageBuffer = await imageRes.buffer();
        fs.writeFileSync(tempInputPath, imageBuffer);

        // Process with ffmpeg to convert to WebP sticker format
        const ffmpegCommand = `ffmpeg -i "${tempInputPath}" -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" "${tempOutputPath}"`;

        await new Promise((resolve, reject) => {
            exec(ffmpegCommand, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });

        const stickerBuffer = fs.readFileSync(tempOutputPath);
        
        // Send the sticker
        await client.sendMessage(message.from, {
            sticker: stickerBuffer
        }, { quoted: message });

        // Clean up temp files
        try {
            fs.unlinkSync(tempInputPath);
            fs.unlinkSync(tempOutputPath);
        } catch (cleanupErr) {
            console.error('Error cleaning up temp files:', cleanupErr);
        }

    } catch (error) {
        console.error('Error executing emojimix command:', error);
        await client.sendMessage(message.from, {
            text: '❌ Failed to generate the emoji sticker. Please try again later.'
        }, { quoted: message });
    }
}

module.exports = handleEmojiMixCommand;
