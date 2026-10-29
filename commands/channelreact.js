const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { messageConfig } = require('../lib/messageConfig');

const pluginStoragePath = path.join(__dirname, '../database/autoreact.json');

// Ensure database file exists
if (!fs.existsSync(pluginStoragePath)) {
    fs.mkdirSync(path.dirname(pluginStoragePath), { recursive: true });
    fs.writeFileSync(pluginStoragePath, JSON.stringify([], null, 2));
}

// Channel Auto-React Command
async function autoReactCommand(sock, m, chatUpdate, store) {
    try {
        if (!m || !m.chat) return;

        // Extract arguments (emojis and target channel link/post)
        let text = m.body || m.text || '';
        let args = text.trim().split(/\s+/);
        
        if (args.length < 4) {
            await sock.sendMessage(m.chat, {
                text: '⚠️ *Usage Error*\n\nProvide 3 emojis and a target channel link.\nExample: `.autoreact ❤️ 🔥 👏 https://whatsapp.com/channel/...`',
                ...messageConfig
            });
            return;
        }

        let emoji1 = args[1];
        let emoji2 = args[2];
        let emoji3 = args[3];
        let targetUrl = args[4];

        if (!targetUrl || !targetUrl.includes('whatsapp.com/channel')) {
            await sock.sendMessage(m.chat, {
                text: '⚠️ *Invalid Link*\n\nPlease provide a valid WhatsApp channel post link.',
                ...messageConfig
            });
            return;
        }

        try {
            await sock.sendMessage(m.chat, {
                text: `🔄 Starting channel Auto React process...\n\nEmojis: ${emoji1} ${emoji2} ${emoji3}\nTarget: ${targetUrl}`,
                ...messageConfig
            });

            // Call external Auto-Like/React API
            const apiUrl = `https://ab-whatsapp-react.vercel.app/api/autolike?key=ab-badboi-0mzxpd&url=${encodeURIComponent(targetUrl)}&react1=${encodeURIComponent(emoji1)}&react2=${encodeURIComponent(emoji2)}&react3=${encodeURIComponent(emoji3)}`;
            
            const response = await axios.get(apiUrl);
            const result = response.data;

            if (result && (result.success || result.status === 'success' || response.status === 200)) {
                await sock.sendMessage(m.chat, {
                    text: `✅ Channel Auto React process completed successfully!\n\nReactions sent: ${emoji1} ${emoji2} ${emoji3}\nTarget: Channel post`,
                    ...messageConfig
                });
            } else {
                await sock.sendMessage(m.chat, {
                    text: `❌ API Error: ${result?.message || 'Unknown error'}\n\nPlease try again with different emojis or check the channel link.`,
                    ...messageConfig
                });
            }

        } catch (apiError) {
            console.error('API Request Failure:', apiError);
            await sock.sendMessage(m.chat, {
                text: `❌ Request Failed: ${apiError.message}`,
                ...messageConfig
            });
        }

    } catch (error) {
        console.error('Execution failure in autoReactCommand:', error);
        await sock.sendMessage(m.chat, {
            text: `💀 An anomaly disrupted the reaction process: ${error.message}`,
            ...messageConfig
        });
    }
}

module.exports = {
    autoreact: autoReactCommand
};
