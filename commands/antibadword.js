const fs = require('fs');
const path = require('path');

// Path to store anti-badword settings per group
const dbPath = path.join(__dirname, '../database/badwords.json');

// Ensure database file exists
if (!fs.existsSync(dbPath)) {
    // Make sure database folder exists
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify({}));
}

// List of default blocked words (you can customize or add more)
const defaultBadWords = ['badword1', 'badword2', 'fool', 'idiot'];

module.exports = {
    name: 'antibadword',
    alias: ['antislur', 'badword'],
    category: 'group',
    description: 'Enable or disable the anti-badword filter in the group.',
    async execute(m, { conn, args, isAdmins, isBotAdmins, prefix }) {
        // Ensure command is used in a group
        if (!m.isGroup) {
            return await conn.sendMessage(m.chat, { text: '⚠️ *This command can only be used inside groups, Warrior!*' }, { quoted: m });
        }

        // Check if user is admin
        if (!isAdmins) {
            return await conn.sendMessage(m.chat, { text: '❌ *Only group administrators can configure the anti-badword filter.*' }, { quoted: m });
        }

        const action = args[0]?.toLowerCase();
        
        // Read current database
        let db = {};
        try {
            db = JSON.parse(fs.readFileSync(dbPath));
        } catch (e) {
            db = {};
        }

        if (!db[m.chat]) {
            db[m.chat] = { enabled: false, words: defaultBadWords };
        }

        if (action === 'on') {
            db[m.chat].enabled = true;
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            await conn.sendMessage(m.chat, { 
                text: '🛡️ *Anti-Badword filter has been successfully ENABLED for this group.*' 
            }, { quoted: m });
            
        } else if (action === 'off') {
            db[m.chat].enabled = false;
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            await conn.sendMessage(m.chat, { 
                text: '⚠️ *Anti-Badword filter has been DISABLED for this group.*' 
            }, { quoted: m });
            
        } else {
            const status = db[m.chat].enabled ? '🟢 ENABLED' : '🔴 DISABLED';
            await conn.sendMessage(m.chat, {
                text: `╭─── ✦ **ANTI-BADWORD SYSTEM** ✦ ───╮\n│\n│ 📊 **Status:** ${status}\n│\n│ ⚙️ **Usage:**\n│ ➢ \`${prefix}antibadword on\`\n│ ➢ \`${prefix}antibadword off\`\n│\n╰─────────────────────────────╯`
            }, { quoted: m });
        }
    }
};
