const fetch = require('node-fetch');

/**
 * Handles the "dare" command for a chat bot.
 * Fetches a random dare quote from an external API and sends it to the chat.
 * 
 * @param {Object} client - The bot client instance
 * @param {Object} message - The incoming message object
 */
async function handleDareCommand(client, message) {
    try {
        const apiKey = "YOUR_API_KEY_HERE"; // Placeholder for the obfuscated API key/reference
        const apiUrl = `https://api.shizo.top/api/quote/dare?apikey=${apiKey}`;

        // Fetch a random dare quote from the API
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const dareText = data.quote; // Adjust property name based on API schema

        // Send the dare quote back to the user/chat
        await client.sendMessage(message.from, {
            text: dareText
        }, { quoted: message });

    } catch (error) {
        console.error('Error fetching dare quote:', error);
        await client.sendMessage(message.from, {
            text: `❌ Failed to fetch a dare quote. Error: ${error.message}`
        }, { quoted: message });
    }
}

module.exports = {
    dare: handleDareCommand
};
