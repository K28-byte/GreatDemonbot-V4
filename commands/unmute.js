const fs = require('fs');
const path = require('path');
const { messageConfig } = require('../lib/messageConfig');

async function unmuteCommand(conn, mek, m, { from, args, reply, isOwner }) {
    try {
        // Path to the muted users database/file
        const muteFilePath = path.join(__dirname, '..', 'database', 'muted.json');

        // Extract target user to unmute from arguments or quoted message
        const targetUser = args[0] || m.mentionedJid[0] || m.quoted?.sender;

        if (!targetUser) {
            return reply('⚠️ Please specify or tag the user you want to unmute.');
        }

        // Check if the mute database file exists
        if (!fs.existsSync(muteFilePath)) {
            return reply('📂 No muted users database found.');
        }

        // Read muted users data
        let mutedUsers = JSON.parse(fs.readFileSync(muteFilePath, 'utf8'));

        // Check if the user is actually in the muted list
        const userIndex = mutedUsers.indexOf(targetUser);

        if (userIndex > -1) {
            // Remove user from muted list
            mutedUsers.splice(userIndex, 1);

            // Save updated database
            fs.writeFileSync(muteFilePath, JSON.stringify(mutedUsers, null, 2));

            // Format username/ID for display
            const username = targetUser.split('@')[0];
            
            await conn.sendMessage(from, {
                text: `✅ Successfully unmuted @${username}!`,
                mentions: [targetUser],
                ...messageConfig
            }, { quoted: mek });
        } else {
            const username = targetUser.split('@')[0];
            await conn.sendMessage(from, {
                text: `ℹ️ @${username} is not currently muted!`,
                mentions: [targetUser],
                ...messageConfig
            }, { quoted: mek });
        }
    } catch (error) {
        console.error('Error in unmute command:', error);
        await reply('❌ An error occurred while trying to unmute the user.');
    }
}

module.exports = unmuteCommand;
