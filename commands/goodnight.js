const fetch = require('node-fetch');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        // Fetching from the gnsd endpoint
        const response = await fetch(`https://api.shizo.top/api/quote/gnsd`);
        
        if (!response.ok) {
            throw new Error('API request failed.');
        }

        const data = await response.json();
        
        // Extracting the quote text from the API response
        const quoteText = data.result || data.quote || "May you have a peaceful rest.";
        
        // Constructing the message
        let messageText = `🌙 *Goodnight* 🌙\n\n`;
        messageText += `> "${quoteText}"\n\n`;
        messageText += `Sleep well!`;

        // Sending the message using multi-device syntax
        await conn.sendMessage(m.chat, { text: messageText }, { quoted: m });

    } catch (error) {
        console.error(error);
        
        // Fallback message if the API fails
        const fallbackText = `🌙 *Goodnight* 🌙\n\n> "Rest well and recharge for tomorrow."\n\nSleep tight!`;
        await conn.sendMessage(m.chat, { text: fallbackText }, { quoted: m });
    }
};

handler.help = ['goodnight'];
handler.tags = ['fun', 'anime'];
handler.command = /^(goodnight|gnsd)$/i;

module.exports = handler;
