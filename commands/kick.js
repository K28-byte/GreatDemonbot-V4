const isAdmin = require('../lib/isAdmin');

async function handleKickCommand(client, message, args) {
    try {
        // 1. Check admin status
        const { isSenderAdmin, isBotAdmin } = await isAdmin(client, message);

        // 2. Validate Bot Admin
        if (!isBotAdmin) {
            return await client.sendMessage(message.from, {
                text: '❌ Please make me an admin first so I can remove members!'
            }, { quoted: message });
        }

        // 3. Validate Sender Admin
        if (!isSenderAdmin) {
            return await client.sendMessage(message.from, {
                text: '❌ Only group admins can use this command!'
            }, { quoted: message });
        }

        // 4. Find the target user (from mention or quoted message)
        const targetUser = message.mentionedJid?.[0] || message.quoted?.participant;

        if (!targetUser) {
            return await client.sendMessage(message.from, {
                text: '⚠️ Please tag or reply to the user you want to remove.'
            }, { quoted: message });
        }

        // 5. Remove / Kick the user from the group
        await client.groupParticipantsUpdate(message.from, [targetUser], 'remove');

    } catch (error) {
        console.error('Error executing kick command:', error);
        await client.sendMessage(message.from, {
            text: '❌ Failed to remove the user. Please try again later.'
        }, { quoted: message });
    }
}

module.exports = {
    name: 'kick',           // Command trigger name (e.g. .kick)
    alias: ['remove', 'ban'], // Alternative triggers that do the same thing
    code: handleKickCommand
};
