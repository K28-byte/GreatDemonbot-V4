async function handleKickCommand(conn, mek, m, { reply, isGroup, groupMetadata, sender, quoted, mentionedJid }) {
    try {
        // 1. Ensure the command is being run in a group chat
        if (!isGroup) {
            return reply("❌ This command can only be used in groups!");
        }

        const participants = groupMetadata.participants || [];

        // 2. Check if the user executing the command is an admin
        const senderParticipant = participants.find(p => p.id === sender);
        const isSenderAdmin = senderParticipant && (senderParticipant.admin || senderParticipant.superAdmin);
        
        if (!isSenderAdmin) {
            return reply("❌ Only group admins can use the kick command!");
        }

        // 3. Check if the bot itself is an admin
        const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        const botParticipant = participants.find(p => p.id === botNumber);
        const isBotAdmin = botParticipant && (botParticipant.admin || botParticipant.superAdmin);

        if (!isBotAdmin) {
            return reply("❌ I need to be an admin in this group to kick members!");
        }

        // 4. Determine who to kick (from mentioned users or a quoted message)
        let targetUser = null;

        if (mentionedJid && mentionedJid.length > 0) {
            targetUser = mentionedJid[0];
        } else if (quoted && quoted.sender) {
            targetUser = quoted.sender;
        }

        if (!targetUser) {
            return reply("❌ Please tag the user or reply to their message to kick them!\n_Example:_ `.kick @user`");
        }

        // 5. Ensure the target is not an admin
        const targetParticipant = participants.find(p => p.id === targetUser);
        if (targetParticipant && (targetParticipant.admin || targetParticipant.superAdmin)) {
            return reply("⚠️ I cannot banish an admin from the group!");
        }

        // 6. Send banishment/kick notification message
        await conn.sendMessage(m.chat, {
            text: `🚫 *BANISHMENT*\n\nRemoving user from the group...`
        }, { quoted: mek });

        // 7. Execute the kick action
        await conn.groupParticipantsUpdate(m.chat, [targetUser], "remove");

        // 8. Success confirmation message
        await conn.sendMessage(m.chat, {
            text: `✅ *Successfully Banished!*\n\nTarget has been removed from the group.`
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in kick command:", error);
        await reply(`❌ An error occurred while trying to banish the user: ${error.message || error}`);
    }
}

module.exports = handleKickCommand;
