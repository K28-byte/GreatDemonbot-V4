const fetch = require('node-fetch');

async function handleLyricsCommand(conn, mek, m, { reply, args }) {
    try {
        // Get the song title/query from the command arguments
        const query = args.join(' ');
        if (!query) {
            return reply("❌ Please provide a song name! Example: `.lyrics Blinding Lights`");
        }

        // Fetch lyrics from the public API
        const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(query)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            return reply(`❌ Sorry, I couldn't find any lyrics for "${query}".`);
        }

        const data = await response.json();

        if (!data.lyrics) {
            return reply(`❌ Sorry, I couldn't find any lyrics for "${query}".`);
        }

        // Format and send the lyrics message
        const lyricsMessage = `🎵 *𝐒𝐎𝐍𝐆 𝐋𝐘𝐑𝐈𝐂𝐒* 🎶\n\n` +
                              `▢ *𝐐𝐔𝐄𝐑𝐘:* ${query}\n\n` +
                              `📜 *𝐋𝐘𝐑𝐈𝐂𝐒:*\n${data.lyrics}\n\n` +
                              `𝐸𝑛𝑗𝑜𝑦 𝑦𝑜𝑢𝑟 𝑠𝑒𝑙𝑓! 🎧 🎶`;

        await conn.sendMessage(m.chat, { text: lyricsMessage }, { quoted: mek });

    } catch (error) {
        console.error("Error fetching lyrics:", error);
        await reply(`❌ An error occurred while fetching the lyrics.`);
    }
}

module.exports = handleLyricsCommand;
