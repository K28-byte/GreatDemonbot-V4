const axios = require('axios');

async function handleImmagineAI(conn, mek, m, { q, reply }) {
    try {
        if (!q) {
            return reply("❌ Please provide a prompt for image generation.\nExample: `.immagine a futuristic cyberpunk city at night`");
        }

        await reply("⏳ Generating your image, please wait...");

        // Call the Flux AI image generation API
        const response = await axios.get(`https://api.shizo.top/ai/imagine/flux`, {
            params: { prompt: q },
            responseType: 'arraybuffer' // Expecting image data back
        });

        // Send the generated image back to the chat
        await conn.sendMessage(m.chat, {
            image: Buffer.from(response.data),
            caption: `🎨 Generated image for: "${q}"`
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in immagine command:", error);
        await reply(`❌ Error generating image: ${error.message || error}`);
    }
}

module.exports = handleImmagineAI;
