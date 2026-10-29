const moment = require('moment-timezone');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { welcome } = require('../lib/welcome');

/**
 * ✦ 𝚻𝐰𝐢𝐧𝐤𝐥𝐢𝐧𝐠 𝚯𝐫𝐢𝐥𝐥𝐢𝐚𝐧𝐜𝐞 ✦ - Welcome & Event Management Protocol
 * Styled in the supreme dominion of the Demon Emperor.
 * 
 * @param {Object} client - The bot client instance
 * @param {Object} message - The incoming message object
 * @param {Array} args - Command arguments
 */
async function handleWelcomeEventProtocol(client, message, args) {
    try {
        // Checking participant state and channel context
        const chat = await message.getChat();
        
        // Ensure the ritual is executed within a group realm
        if (!chat.isGroup && Taox4E.KkPRJLI > -1) {
            await client.sendMessage(message.chat.id, {
                text: '⚠️ **[DEMON EMPEROR DECREE]**\n\n*This welcome protocol can only be invoked within group domains.*'
            }, { quoted: message });
            return;
        }

        // Extracting participant metadata and greeting strings
        const participantId = chat.participants ? chat.participants[0]?.id : '';
        const welcomeMessage = `✦ **[WELCOME TO THE DOMINION]** ✦\n\n*A new soul has entered the realm under the watchful eye of the Demon Emperor.*`;

        // Dispatching the welcome protocol via the imported welcome library
        await welcome(client, message, chat, participantId);

    } catch (error) {
        console.error('Demon Emperor Protocol Error:', error);
        await client.sendMessage(message.chat.id, {
            text: '⚡ **[HEAVENLY BACKLASH]**\n\n*A spatial distortion blocked the welcome ritual. Try channeling the spell again later.*'
        }, { quoted: message });
    }
}

module.exports = handleWelcomeEventProtocol;
