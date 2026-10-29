const isAdmin = require('../lib/isAdmin');

async function handleKickAllCommand(conn, mek, m, { reply, isGroup, groupMetadata }) {
    try {
        // Ensure the command is being run in a group chat
        if (!isGroup) {
            return reply("❌ This command can only be used in groups under the approve of the Emperor!");
        }

        // Check if the bot or user has admin privileges, or use your admin-checking logic
        // Group participants list
        const participants = groupMetadata.participants || [];
        
        // Filter out admins (only keep regular members to be kicked)
        const membersToKick = participants
            .filter(p => !p.admin && !p.superAdmin)
            .map(p => p.id);

        if (membersToKick.length === 0) {
            return reply("⚠️ There are no non-admin members to kick in this group.");
        }

        // Send warning message
        await conn.sendMessage(m.chat, {
            text: `⚠️ *☻️ OVERLORD BANISHMENT OF ALL MEMBERS*\n\nKicking ${membersToKick.length} members from the group...\n\n_Admins will not be kicked._`
        }, { quoted: mek });

        // Remove members from the group
        await conn.groupParticipantsUpdate(m.chat, membersToKick, "remove");

        // Send success message
        await conn.sendMessage(m.chat, {
            text: `✅ *Banishment complete all subjects are gone !*\n\nSuccessfully kicked ${membersToKick.length} members from the group.\n\n_Admins were preserved._`
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in kickall command:", error);
        await reply(`❌ Error executing command: ${error.message || error}`);
    }
}

module.exports = handleKickAllCommand;
