const isAdmin = require('../lib/isAdmin');

async function tagAllCommand(sock, chatId, senderId) {
    try {
        // Check bot and sender admin status
        const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, { text: 'Bot must be an admin to use this command.' });
            return;
        }

        if (!isSenderAdmin) {
            await sock.sendMessage(chatId, { text: 'Only group admins can use the tagall command.' });
            return;
        }

        // Fetch group metadata and participants
        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants;

        let tagText = `*╔═══[ TAG ALL ]═══*\n`;
        tagText += `*╠ Total Members:* ${participants.length}\n`;
        tagText += `*╚══════════════════*\n\n`;

        const mentionedJidList = [];

        for (let participant of participants) {
            tagText += `@${participant.id.split('@')[0]}\n`;
            mentionedJidList.push(participant.id);
        }

        // Send message with mentions
        await sock.sendMessage(chatId, {
            text: tagText,
            mentions: mentionedJidList
        });

    } catch (error) {
        console.error('Error in tagall command:', error);
        await sock.sendMessage(chatId, { text: 'An error occurred while executing the tagall command.' });
    }
}

module.exports = tagAllCommand;
