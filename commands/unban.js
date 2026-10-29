const fs = require('fs');
const path = require('path');
const { messageConfig } = require('../lib/messageConfig');

async function unbanCommand(conn, mek, m, { from, args, reply, isOwner }) {
    try {
        // Path to the banned users database/file
        const banFilePath = path.join(__dirname, '..', 'database', 'banned.json');

        // Check if user has permission (e.g., owner or admin check based on your bot structure)
        // Extract target user to unban from arguments or quoted message
        const targetUser = args[0] || m.mentionedJid[0] || m.quoted?.sender;

        if (!targetUser) {
            return reply('⚠️ Please specify or tag the user you want to unban.');
        }

        // Check if the ban database file exists
        if (!fs.existsSync(banFilePath)) {
            return reply('📂 No banned users database found.');
        }

        // Read banned users data
        let bannedUsers = JSON.parse(fs.readFileSync(banFilePath, 'utf8'));

        // Check if the user is actually in the banned list
        const userIndex = bannedUsers.indexOf(targetUser);

        if (userIndex > -1) {
            // Remove user from banned list
            bannedUsers.splice(userIndex, 1);

            // Save updated database
            fs.writeFileSync(banFilePath, JSON.stringify(bannedUsers, null, 2));

            // Format username/ID for display
            const username = targetUser.split('@')[0];
            
            await conn.sendMessage(from, {
                text: `✅ Successfully unbanned @${username}!`,
                mentions: [targetUser],
                ...messageConfig
            }, { quoted: mek });
        } else {
            const username = targetUser.split('@')[0];
            await conn.sendMessage(from, {
                text: `ℹ️ @${username} is not currently banned!`,
                mentions: [targetUser],
                ...messageConfig
            }, { quoted: mek });
        }
    } catch (error) {
        console.error('Error in unban command:', error);
        await reply('❌ An error occurred while trying to unban the user.');
    }
}

module.exports = unbanCommand;
