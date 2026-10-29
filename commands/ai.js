const axios = require('axios');
const fetch = require('node-fetch');

module.exports = {
    name: 'ai',
    alias: ['gpt', 'gemini', 'chat'],
    category: 'ai',
    description: 'Chat with the Demon AI assistant.',
    async execute(m, { conn, text, prefix, command }) {
        if (!text) {
            return await conn.sendMessage(m.chat, { 
                text: `⚠️ *Provide a prompt for the AI, Warrior!*\n\n*Example:* \`${prefix}${command} Who is the Demon Emperor?\`` 
            }, { quoted: m });
        }

        // Send a loading signal
        const waitingMsg = await conn.sendMessage(m.chat, { text: '🔮 *Consulting the dark archives...*' }, { quoted: m });

        try {
            // Primary API query (Dreaded / ChatGPT or fallback endpoints)
            const apiUrl = `https://api.dreaded.site/api/chatgpt?text=${encodeURIComponent(text)}`;
            const response = await axios.get(apiUrl);
            
            if (response.data && response.data.result) {
                const answer = response.data.result;
                return await conn.sendMessage(m.chat, {
                    text: `╭─── ✦ **DEMON AI** ✦ ───╮\n│\n${answer}\n│\n╰─────────────────────╯`,
                    edit: waitingMsg.key
                });
            }

            throw new Error('Primary API failed to return data.');

        } catch (error) {
            // Fallback to alternative AI endpoint if primary fails
            try {
                const fallbackUrl = `https://api.giftedtech.my.id/api/ai/geminiai?apikey=gifted&q=${encodeURIComponent(text)}`;
                const fbRes = await fetch(fallbackUrl);
                const fbData = await fbRes.json();

                const fallbackAnswer = fbData.result || fbData.data || 'The AI archives are currently silent.';

                return await conn.sendMessage(m.chat, {
                    text: `╭─── ✦ **DEMON AI (ALT)** ✦ ───╮\n│\n${fallbackAnswer}\n│\n╰─────────────────────────╯`,
                    edit: waitingMsg.key
                });
            } catch (err) {
                await conn.sendMessage(m.chat, {
                    text: '❌ *Failed to connect to the AI neural network. Try again later.*',
                    edit: waitingMsg.key
                });
            }
        }
    }
};
