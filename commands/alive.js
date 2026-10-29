const fs = require('fs');
const path = require('path');
const axios = require('axios');
const os = require('os');

module.exports = async (m, client) => {
    try {
        const statusText = `
╔═══════════◇◆◇══════════╗
     ⚔️ 𝐆𝐑𝐄𝐀𝐓 𝐃𝐄𝐌𝐎𝐍 𝐁𝐎𝐓 𝐕𝟒 ⚔️
╠────────────────────────╣
║ 🟢 *Status*: Online
║ ⚙️ *Version*: 4.0.0
║ 🌍 *Mode*: Public
╠────────────────────────╣
║   *Bot Is Ready To Work*
╠────────────────────────╣
║💡 Type *.menu* to explore commands!
╚═══════════◇◆◇══════════╝`.trim();

        const imageUrl = 'https://img.sanishtech.com/u/e5f4003640d7a47530cd191b781e1f5b.jpg';
        const imagePath = path.join(os.tmpdir(), 'great_demon_alive.jpg');

        try {
            const response = await axios({
                url: imageUrl,
                responseType: 'arraybuffer'
            });
            fs.writeFileSync(imagePath, response.data);

            await client.sendMessage(m.chat, {
                image: fs.readFileSync(imagePath),
                caption: statusText
            }, { quoted: m });

        } catch (imgError) {
            await client.sendMessage(m.chat, { text: statusText }, { quoted: m });
        }

    } catch (error) {
        console.error('Error in alive command:', error);
        await client.sendMessage(m.chat, { text: '❌ Failed to load bot status.' }, { quoted: m });
    }
};
