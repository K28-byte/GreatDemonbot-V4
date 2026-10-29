const axios = require('axios');
const mumaker = require('mumaker');

async function textMakerCommand(sock, chatId, message, args, commandName) {
    try {
        const text = args.join(' ');

        if (!text) {
            await sock.sendMessage(chatId, { 
                text: '𝕯𝖊𝖒𝖔𝖓 𝕰𝖒𝖕𝖊𝖗𝖔𝖗 👑\n\n*Please provide text for the textmaker command.*' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { 
            text: '𝕯𝖊𝖒𝖔𝖓 𝕰𝖒𝖕𝖊𝖗𝖔𝖗 👑\n\n*Forging your request into existence...*' 
        }, { quoted: message });

        let imageUrl;
        try {
            const result = await mumaker.textpro('https://textpro.me/neon-light-text-effect-online-882.html', text);
            imageUrl = result.image;
        } catch (e) {
            const result = await mumaker.ephoto('https://en.ephoto360.com/create-digital-glitter-text-effects-online-777.html', text);
            imageUrl = result.image;
        }

        if (!imageUrl) {
            throw new Error('Failed to generate image from service.');
        }

        await sock.sendMessage(chatId, {
            image: { url: imageUrl },
            caption: '𝕯𝖊𝖒𝖔𝖓 𝕰𝖒𝖕𝖊𝖗𝖔𝖗 🖤'
        }, { quoted: message });

    } catch (error)  {
        console.error('Error in textmaker command:', error);
        await sock.sendMessage(chatId, { 
            text: `𝕯𝖊𝖒𝖔𝖓 𝕰𝖒𝖕𝖊𝖗𝖔𝖗 👑\n\n*An error occurred while forging your request.*\nError: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = textMakerCommand;
