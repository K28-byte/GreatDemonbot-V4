const axios = require('axios');
const mumaker = require('mumaker');

async function textMakerCommand(sock, chatId, message, args, commandName) {
    try {
        const text = args.join(' ');

        if (!text) {
            await sock.sendMessage(chatId, { 
                text: '✦ 𝚻𝐰𝐢𝐧𝐤𝐥𝐢𝐧𝐠 𝚯𝐫𝐢𝐥𝐥𝐢𝐚𝐧𝐜𝐞 ✦\n\n*Please provide text for the textmaker command, Demon Emperor.*' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { 
            text: '✦ 𝚻𝐰𝐢𝐧𝐤𝐥𝐢𝐧𝐠 𝚯𝐫𝐢𝐥𝐥𝐢𝐚𝐧𝐜𝐞 ✦\n\n*Generating your request...*' 
        }, { quoted: message });

        // Example generation using mumaker (e.g., textpro or ephoto effect)
        let imageUrl;
        try {
            // Mapping common text effect based on command or default
            const result = await mumaker.textpro('https://textpro.me/neon-light-text-effect-online-882.html', text);
            imageUrl = result.image;
        } catch (e) {
            // Fallback or alternative generator
            const result = await mumaker.ephoto('https://en.ephoto360.com/create-digital-glitter-text-effects-online-777.html', text);
            imageUrl = result.image;
        }

        if (!imageUrl) {
            throw new Error('Failed to generate image from service.');
        }

        await sock.sendMessage(chatId, {
            image: { url: imageUrl },
            caption: '𝕯𝖊𝖒𝖔𝖓 𝕰𝖒𝖕𝖊𝖗𝖔𝖗 ✦ 𝚻𝐰𝐢𝐧𝐤𝐥𝐢𝐧𝐠 𝚯𝐫𝐢𝐥𝐥𝐢𝐚𝐧𝐜𝐞 ✦'
        }, { quoted: message });

    } catch (error) {
        console.error('Error in textmaker command:', error);
        await sock.sendMessage(chatId, { 
            text: `✦ 𝚻𝐰𝐢𝐧𝐤𝐥𝐢𝐧𝐠 𝚯𝐫𝐢𝐥𝐥𝐢𝐚𝐧𝐜𝐞 ✦\n\n*An error occurred while generating your request, Demon Emperor.*\nError: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = textMakerCommand;
