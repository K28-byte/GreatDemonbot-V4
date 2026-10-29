const fs = require('fs');
const path = require('path');
const isAdmin = require('../lib/isAdmin'); // Assuming your admin check helper

async function warningsCommand(conn, mek, m, { from, quoted, reply }) {
    try {
        // 1. Determine target user (quoted user, mentioned user, or sender if none specified)
        const targetUser = quoted ? quoted.sender : (m.mentionedJid?.[0] || m.sender);

        // 2. Define path to warnings database
        const dbPath = path.join(__dirname, '../database/warnings.json');

        // 3. Check if database exists
        if (!fs.existsSync(dbPath)) {
            return await conn.sendMessage(from, { text: `User has 0 warning(s).` }, { quoted: mek });
        }

        const warningsData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

        // 4. Retrieve warning count for the group and target user
        const groupWarnings = warningsData[from] || {};
        const userWarnings = groupWarnings[targetUser] || 0;

        // 5. Send status report
        const reportMsg = `User has ${userWarnings} warning(s).`;
        await conn.sendMessage(from, { text: reportMsg }, { quoted: mek });

    } catch (error) {
        console.error('Error in warnings command:', error);
        await reply(`❌ An error occurred: ${error.message}`);
    }
}

module.exports = warningsCommand;
