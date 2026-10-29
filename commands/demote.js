const isAdmin = require('../lib/isAdmin');

async function XxskLN(client, message, args) {
    try {
        const { isSenderAdmin, isBotAdmin } = await isAdmin(client, message);

        if (!isBotAdmin) {
            return await client.sendMessage(message.from, {
                text: '❌ Please make me an admin first so I can demote members!'
            }, { quoted: message });
        }

        if (!isSenderAdmin) {
            return await client.sendMessage(message.from, {
                text: '❌ Only group admins can use this command!'
            }, { quoted: message });
        }

        const targetUser = message.mentionedJid?.[0] || message.quoted?.participant;

        if (!targetUser) {
            return await client.sendMessage(message.from, {
                text: '⚠️ Please tag or reply to the user you want to demote.'
            }, { quoted: message });
        }

        await client.groupParticipantsUpdate(message.from, [targetUser], 'demote');

        const demotedBy = message.author || message.sender;
        const timestamp = new Date().toLocaleString();

        const responseText = 
            `*『 𝐆𝐑𝐎𝐔𝐏 𝐃𝐄𝐌𝐎𝐓𝐈𝐎𝐍 』*\n\n` +
            `👤 *Demoted User:* @${targetUser.split('@')[0]}\n\n` +
            `👑 *Demoted By:* @${demotedBy.split('@')[0]}\n\n` +
            `📅 *Date:* ${timestamp}`;

        await client.sendMessage(message.from, {
            text: responseText,
            mentions: [targetUser, demotedBy]
        }, { quoted: message });

    } catch (error) {
        console.error('Error executing demote command:', error);
        await client.sendMessage(message.from, {
            text: '❌ Failed to demote the user. Please try again later.'
        }, { quoted: message });
    }
}

async function O405Ze6(client, message, args) {
    // Helper function stub if required by your router
}

module.exports = {
    name: 'demote',
    alias: ['dem'],
    code: XxskLN
};
