const moment = require('moment-timezone');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { welcome } = require('../lib/welcome');

/**
 * Supreme Group Welcome Protocol
 * Styled in the absolute dominion of the Demon Emperor.
 * 
 * @param {Object} client - The bot client instance
 * @param {Object} message - The incoming message object
 * @param {Array} args - Command arguments
 */
async function handleSupremeWelcomeProtocol(client, message, args) {
    try {
        // Accessing the chat realm
        const chat = await message.getChat();
        
        // Decree: This ritual only functions within group domains
        if (!chat.isGroup) {
            await client.sendMessage(message.chat.id, {
                text: '⚠️ **[DEMON EMPEROR DECREE]**\n\n*This welcome protocol can only be invoked within group domains.*'
            }, { quoted: message });
            return;
        }

        // Extracting participant identity for the welcome scroll
        const participantId = chat.participants && chat.participants[0] ? chat.participants[0].id : '';

        // Dispatching the welcome ceremony via the sacred welcome library
        await welcome(client, message, chat, participantId);

        // Fetching the group name to make the greeting personalized
        const groupName = chat.name || 'this group';

        // Sending the customized welcome message announcement
        const welcomeAnnouncement = `✨ **Welcome to ${groupName}!** ✨\n\nWe are glad to have you here. Make sure to read the group rules and enjoy your time in the realm!`;

        await client.sendMessage(message.chat.id, {
            text: welcomeAnnouncement
        });

    } catch (error) {
        console.error('Demon Emperor Protocol Error:', error);
        await client.sendMessage(message.chat.id, {
            text: '⚡ **[HEAVENLY BACKLASH]**\n\n*A spatial distortion blocked the welcome ritual. Try channeling the spell again later.*'
        }, { quoted: message });
    }
}

module.exports = handleSupremeWelcomeProtocol;
