const axios = require('axios');

/**
 * ✦ 𝚻𝐰𝐢𝐧𝐤𝐥𝐢𝐧𝐠 𝚯𝐫𝐢𝐥𝐥𝐢𝐚𝐧𝐜𝐞 ✦ - Profile Picture Retrieval Protocol
 * Styled in the supreme dominion of the Demon Emperor.
 * 
 * @param {Object} client - The bot client instance
 * @param {Object} message - The incoming message object
 * @param {Array} args - Command arguments
 */
async function handleDemonEmperorGetPp(client, message, args) {
    try {
        // Enforce the law: Must reply to a mortal to peer into their avatar realm
        if (!message.reply_to_message) {
            await client.sendMessage(message.chat.id, {
                text: '⚠️ **[DEMON EMPEROR DECREE]**\n\n*You dare summon the avatar mirror into the empty void? Reply to a target\'s message to unveil their true visage.*'
            }, { quoted: message });
            return;
        }

        const targetUser = message.reply_to_message.from;
        let profilePhotos;

        try {
            // Scan the ethereal matrix for the user's profile manifestations
            profilePhotos = await client.getUserProfilePhotos(targetUser.id, { limit: 1 });
        } catch (err) {
            profilePhotos = null;
        }

        if (profilePhotos && profilePhotos.total_count > 0) {
            // Extract the supreme resolution artifact
            const fileId = profilePhotos.photos[0][0].file_id;
            const file = await client.getFile(fileId);
            const filePath = file.file_path;
            const fileUrl = `https://api.telegram.org/file/bot${client.token}/${filePath}`;

            // Manifest the image across the realm
            await client.sendMessage(message.chat.id, {
                photo: fileUrl,
                caption: `🔮 **[AVATAR MANIFESTATION ACQUIRED]**\n\n✦ **Target:** @${targetUser.username || targetUser.first_name || 'Anonymous Soul'}\n✦ **Domain:** *Scanned under the watchful eye of the Great Demon Emperor.*`
            }, { quoted: message });

        } else {
            await client.sendMessage(message.chat.id, {
                text: '🌑 **[SEALED REALM]**\n\n*This soul has concealed their avatar behind absolute heavenly restrictions or possesses no reflection in this mirror.*'
            }, { quoted: message });
        }

    } catch (error) {
        console.error('Demon Emperor Protocol Error:', error);
        await client.sendMessage(message.chat.id, {
            text: '⚡ **[HEAVENLY BACKLASH]**\n\n*A spatial distortion blocked the extraction. Try again once the spiritual qi stabilizes.*'
        }, { quoted: message });
    }
}

module.exports = handleDemonEmperorGetPp;
