const fs = require('fs');
const path = require('path');

module.exports = async (m, client, args) => {
    try {
        const newBio = args.join(' ');

        if (!newBio) {
            return await client.sendMessage(m.chat, { 
                text: '❌ Please provide the new bio text!\n\n*Example:* `.setbio Demon Emperor never falls.`' 
            }, { quoted: m });
        }

        // Update the bot's profile status/bio
        await client.updateProfileStatus(newBio);

        // Send confirmation message
        await client.sendMessage(m.chat, { 
            text: `✅ Bio successfully updated to: "${newBio}"` 
        }, { quoted: m });

    } catch (error) {
        console.error('Error in setbio command:', error);
        await client.sendMessage(m.chat, { 
            text: `❌ Failed to update bio: ${error.message || error}` 
        }, { quoted: m });
    }
};
