const axios = require('axios');
const { messageConfig } = require('../lib/messageConfig');

async function characterCommand(sock, chatId, message, sender, args) {
    try {
        // List of fun traits/descriptions that can be randomly assigned
        const traitsPool = [
            "⚡ Absolute Main Character Energy",
            "🔥 Unstoppable Hype Machine",
            "🧊 Ice-Cold Under Pressure",
            "🎯 Laser-Focused Strategist",
            "👑 Built Different / Unmatched Aura",
            "🌪️ Chaos Incarnate",
            "🛡️ Ride-or-Die Loyalist",
            "🧠 Big Brain Tactician"
        ];

        // Pick 3 random unique traits for the user
        let selectedTraits = [];
        let poolCopy = [...traitsPool];
        for (let i = 0; i < 3 && poolCopy.length > 0; i++) {
            let randomIndex = Math.floor(Math.random() * poolCopy.length);
            selectedTraits.push(poolCopy.splice(randomIndex, 1)[0]);
        }

        // Get target username or fallback
        let targetName = sender || "User";
        if (message && message.pushName) {
            targetName = message.pushName;
        }

        // Calculate a random fun rating percentage (between 50% and 100%)
        let overallRating = Math.floor(Math.random() * 51) + 50;

        // Build the styled output message
        let responseText = `🔷 *Character Ratings* 🔷\n\n` +
                           `🔸 *User:* ${targetName}\n\n` +
                           `🔸 *Key Traits:*\n${selectedTraits.join('\n')}\n\n` +
                           `🔸 *Overall Rating:* ${overallRating}%\n\n` +
                           `🛑 *Note:*  _This is a fun analysis!_`;

        // Send the message using your socket connection
        await sock.sendMessage(chatId, {
            text: responseText,
            ...messageConfig
        }, { quoted: message });

    } catch (error) {
        console.error("Error in character command:", error);
        await sock.sendMessage(chatId, { 
            text: "❌ Failed to generate character rating right now.",
            ...messageConfig
        }, { quoted: message });
    }
}

module.exports = characterCommand;
