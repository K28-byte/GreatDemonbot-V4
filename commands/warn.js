const fs = require('fs');
const path = require('path');
const isAdmin = require('../lib/isAdmin');

async function warnCommand(conn, mek, m, { from, quoted, reply, isOwner }) {
    try {
        // 1. Check if bot and sender have admin permissions
        // (Implementation depends on your framework's isAdmin helper)
        
        // 2. Identify target user (quoted message or mentioned user)
        const targetUser = quoted ? quoted.sender : m.mentionedJid?.[0];
        if (!targetUser) {
            return reply('⚠️ Please reply to a user or tag them to issue a warning.');
        }

        // 3. Define path for warning data storage
        const dbPath = path.join(__dirname, '../database/warnings.json');
        let warningsData = {};

        if (fs.existsSync(dbPath)) {
            warningsData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        }

        // Initialize group/user warning record if it doesn't exist
        if (!warningsData[from]) warningsData[from] = {};
        if (!warningsData[from][targetUser]) warningsData[from][targetUser] = 0;

        // Increment warning count
        warningsData[from][targetUser] += 1;
        const currentWarnings = warningsData[from][targetUser];
        const maxWarnings = 3;

        fs.writeFileSync(dbPath, JSON.stringify(warningsData, null, 2));

        // 4. Send Warning Alert Message
        const warningMsg = `
*『 𝐖𝐀𝐑𝐍𝐈𝐍𝐆 𝐀𝐋𝐄𝐑𝐓 』*

👤 *Warned User:* @${targetUser.split('@')[0]}
⚠️ *Warning Count:* ${currentWarnings}/${maxWarnings}
👑 *Warned By:* @${m.sender.split('@')[0]}
📅 *Date:* ${new Date().toLocaleDateString()}
        `.trim();

        await conn.sendMessage(from, { text: warningMsg, mentions: [targetUser, m.sender] }, { quoted: mek });

        // 5. Auto-Kick if threshold is reached
        if (currentWarnings >= maxWarnings) {
            // Reset warnings for user after kick
            warningsData[from][targetUser] = 0;
            fs.writeFileSync(dbPath, JSON.stringify(warningsData, null, 2));

            // Small delay before kicking
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Remove user from group
            await conn.groupParticipantsUpdate(from, [targetUser], 'remove');

            const kickMsg = `*『 𝐀𝐔𝐓𝐎-𝐊𝐈𝐂𝐊 』*\n\n@${targetUser.split('@')[0]} has been removed from the group after receiving ${maxWarnings} warnings! ⚠️`;
            await conn.sendMessage(from, { text: kickMsg, mentions: [targetUser] });
        }

    } catch (error) {
        console.error('Error in warn command:', error);
        await reply(`❌ An error occurred: ${error.message}`);
    }
}

module.exports = warnCommand;
