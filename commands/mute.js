/**
 * Mute Command Plugin
 * Mutes a WhatsApp group for a specified number of minutes.
 */

const isAdmin = require('../lib/isAdmin');

async function muteCommand(sock, m, args, reply) {
    try {
        const from = m.key.remoteJid;
        
        // 1. Validate that the command is used in a group
        if (!m.isGroup) {
            return await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' }, { quoted: m });
        }

        const groupMetadata = await sock.groupMetadata(from);
        const adminCheck = await isAdmin(sock, from, m.sender, groupMetadata);

        // 2. Check admin permissions
        if (!adminCheck.isSenderAdmin) {
            return await sock.sendMessage(from, { text: '❌ You must be a Group Admin to use this command!' }, { quoted: m });
        }
        if (!adminCheck.isBotAdmin) {
            return await sock.sendMessage(from, { text: '❌ Bot needs to be an Admin to execute this command!' }, { quoted: m });
        }

        // 3. Parse mute duration (in minutes)
        const durationMinutes = parseInt(args[0]);
        if (isNaN(durationMinutes) || durationMinutes <= 0) {
            return await sock.sendMessage(from, { text: '❌ Please provide a valid number of minutes!\nExample: `.mute 10`' }, { quoted: m });
        }

        await sock.sendMessage(from, { text: `Attempting to mute the group for ${durationMinutes} minutes.` }, { quoted: m });

        // 4. Lock the group (Announcement mode: only admins can send messages)
        await sock.groupSettingUpdate(from, 'announcement');
        await sock.sendMessage(from, { text: `The group has been muted for ${durationMinutes} minutes.` });

        // 5. Calculate milliseconds and set a timer to unlock the group automatically
        const durationMs = durationMinutes * 60 * 1000;

        setTimeout(async () => {
            try {
                // Open the group back up (Not announcement mode: everyone can send messages)
                await sock.groupSettingUpdate(from, 'not_announcement');
                await sock.sendMessage(from, { text: '🔓 *Time is up!* The group has been unmuted automatically.' });
            } catch (err) {
                console.error('Error unmuting group automatically:', err);
            }
        }, durationMs);

    } catch (error) {
        console.error('Error in mute command:', error);
        await sock.sendMessage(m.key.remoteJid, { text: `⚠️ Error executing mute command: ${error.message}` }, { quoted: m });
    }
}

module.exports = muteCommand;
