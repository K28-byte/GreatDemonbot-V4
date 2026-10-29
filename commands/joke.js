const axios = require('axios');

async function handleJokeCommand(conn, mek, m, { reply }) {
    try {
        // Fetch joke from a public API endpoint
        const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
        
        // Format the joke setup and punchline
        const jokeText = `${response.data.setup}\n\n*${response.data.punchline}*`;

        // Send the joke back to the WhatsApp chat
        await conn.sendMessage(m.chat, {
            text: jokeText
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in joke command:", error);
        await reply(`❌ Error fetching the 😑 realm joke: ${error.message || error}`);
    }
}

module.exports = handleJokeCommand;
