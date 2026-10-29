const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'alive',
    alias: ['bot', 'status'],
    category: 'general',
    description: 'Check if Great Demon Bot is active.',
    async execute(m, { conn, pushName }) {
        const imagePath = path.join(__dirname, '../assets/demon.jpg');
        const user = pushName || 'Warrior';

        const caption = `
╭─── ✦ 𝐆𝐑𝐄𝐀𝐓 𝐃𝐄𝐌𝐎𝐍 𝐁𝐎𝐓 𝐯𝟒 ✦ ───╮
│
│ 🌐 **Status:** Online & Active
│ ⚙️ **Version:** 4.0.0
│ 👑 **Creator:** Demon Emperor
│ 👤 **User:** ${user}
│
│ *Bot Is Ready To Serve!*
│
│ 💡 Type *.menu* to explore commands!
╰─────────────────────────────╯
> *Powered by Great Demon Bot v4*
`.trim();

        if (fs.existsSync(imagePath)) {
            await conn.sendMessage(m.chat, {
                image: fs.readFileSync(imagePath),
                caption: caption
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
        }
    }
};
