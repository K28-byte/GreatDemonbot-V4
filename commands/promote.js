const { isAdmin } = require('../lib/isAdmin');

async function promoteCommand(sock, chatId, sender, mentionedJids, msg) {
    try {
        let targets = [];

        // Check if users were mentioned or if replying to a message
        if (mentionedJids && mentionedJids.length > 0) {
            targets = mentionedJids;
        } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            targets = [msg.message.extendedTextMessage.contextInfo.participant];
        }

        if (targets.length === 0) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please tag or reply to the user(s) you want to promote!' 
            }, { quoted: msg });
            return;
        }

        // Promote users in the group
        await sock.groupParticipantsUpdate(chatId, targets, 'promote');

        const promoterTag = sender.id || sender;
        const promotedTags = targets.map(user => `• @${user.split('@')[0]}`).join('\n');
        const currentDate = new Date().toLocaleDateString();

        const successMessage = 
            `*『 𝐆𝐑𝐎𝐔𝐏 𝐀𝐃𝐌𝐈𝐍𝐒𝐇𝐈𝐏 』*\n\n` +
            `💫 *Promoted User${targets.length > 1 ? 's' : ''}:*\n` +
            `${promotedTags}\n\n` +
            `♻️ *Added Admin by:* @${promoterTag.split('@')[0]}\n\n` +
            `✅ *Date:* ${currentDate}`;

        await sock.sendMessage(chatId, {
            text: successMessage,
            mentions: [...targets, promoterTag]
        }, { quoted: msg });

    } catch (error) {
        console.error('Error in promote command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Failed to promote user. Make sure the bot is an admin!' 
        }, { quoted: msg });
    }
}

async function groupPromotionHandler(sock, chatId, participants, actor) {
    try {
        if (!participants || participants.length === 0) return;

        const formattedUsers = participants.map(user => `• @${user.split('@')[0]}`).join('\n');
        const promoterTag = actor ? `*${actor}*` : 'Admin';
        const currentDate = new Date().toLocaleDateString();

        const promotionAnnouncement = 
            `*『 GROUP PROMOTION 』*\n\n` +
            `👥 *Promoted User${participants.length > 1 ? 's' : ''}:*\n` +
            `${formattedUsers}\n\n` +
            `👑 *Promoted By:* ${promoterTag}\n\n` +
            `📅 *Date:* ${currentDate}`;

        await sock.sendMessage(chatId, {
            text: promotionAnnouncement,
            mentions: participants
        });

    } catch (error) {
        console.error('Error in groupPromotionHandler:', error);
    }
}

module.exports = {
    promoteCommand,
    groupPromotionHandler
};
