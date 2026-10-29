const fetch = require('node-fetch');

async function truthCommand(conn, mek, m, { from, reply }) {
    try {
        // Fetch truth data from the API
        const response = await fetch('https://api.shizo.top/api/quote/truth');

        if (!response.ok) {
            throw new Error(`Failed to fetch truth: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Extract the truth text from the response structure
        const truthText = data.result || data.quote || data.message || JSON.stringify(data);

        // Send the truth prompt to the chat
        await conn.sendMessage(from, { text: truthText }, { quoted: mek });
    } catch (error) {
        console.error('Error fetching truth:', error);
        await reply('❌ An error occurred while fetching the truth prompt.');
    }
}

module.exports = {
    truth: truthCommand
};
