const axios = require('axios');
const settings = require('../settings');

/**
 * ✦ 𝚻𝐰𝐢𝐧𝐤𝐥𝐢𝐧𝐠 𝚯𝐫𝐢𝐥𝐥𝐢𝐚𝐧𝐜𝐞 ✦ - GIF Search and Dispatch Protocol
 * Styled in the supreme dominion of the Demon Emperor.
 * 
 * @param {Object} client - The bot client instance
 * @param {Object} message - The incoming message object
 * @param {Array} args - Command arguments
 */
async function handleDemonEmperorGifCommand(client, message, args) {
    try {
        // Enforce the law: A query must be chanted to summon a visual manifestation from the Giphy abyss
        if (!args || args.length === 0) {
            await client.sendMessage(message.chat.id, {
                text: '⚠️ **[DEMON EMPEROR DECREE]**\n\n*You dare command the visual vortex without a keyword? Provide a chant or query to summon the moving images.*'
            }, { quoted: message });
            return;
        }

        const searchQuery = args.join(' ');
        const apiKey = settings.GIPHY_API || 'giphy_api_key_here'; // Fallback or settings lookup

        // Channeling spiritual energy to fetch a GIF from the Giphy matrix
        const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
            params: {
                api_key: apiKey,
                q: searchQuery,
                limit: 1,
                rating: 'g'
            }
        });

        const gifUrl = response?.data?.data?.[0]?.images?.original?.url;

        if (gifUrl) {
            // Manifesting the GIF across the realm
            await client.sendMessage(message.chat.id, {
                video: gifUrl, // Or image/document depending on client implementation, maintaining original structure logic
                caption: `🔮 **[GIF MANIFESTATION ACQUIRED]**\n\n*Here is your moving vision for "${searchQuery}"*\n\n✦ **Domain:** *Scanned under the watchful eye ofсил the Great Demon Emperor.*`
            });
        } else {
            await client.sendMessage(message.chat.id, {
                text: '🌑 **[SEALED REALM]**\n\n*No matching visions could be extracted from the Giphy abyss for your query.*'
            });
        }

    } catch (error) {
        console.error('Demon Emperor Protocol Error:', error);
        await client.sendMessage(message.chat.id, {
            text: '⚡ **[HEAVENLY BACKLASH]**\n\n*A spatial distortion blocked the GIF extraction. Try channeling the spell again later.*'
        });
    }
}

module.exports = handleDemonEmperorGifCommand;
