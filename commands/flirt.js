const fetch = require('node-fetch');

/**
 * Handles fetching and sending a flirt quote.
 * 
 * @param {Object} client - The bot client instance
 * @param {Object} message - The incoming message object
 * @param {Array} args - Command arguments
 */
async function handleFlirtQuoteCommand(client, message, args) {
    try {
        const apiKey = 'YOUR_API_KEY';
        const response = await fetch(`https://api.shizo.top/api/quote/flirt?apikey=${apiKey}`);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const quote = data.quote || data.result || 'No quote found.';

        await client.sendMessage(message.from, {
            text: quote
        }, { quoted: message });

    } catch (error) {
        console.error('Error executing flirt quote command:', error);
        await client.sendMessage(message.from, {
            text: '❌ Failed to retrieve a flirt quote. Please try again later.'
        }, { quoted: message });
    }
}

module.exports = handleFlirtQuoteCommand;
