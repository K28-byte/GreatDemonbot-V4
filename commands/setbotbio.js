/**
 * Bot Bio Setting Script - DEMON EMPEROR V4
 * Allows updating the WhatsApp bot's profile status/bio dynamically via command.
 */
const fs = require('fs');
const path = require('path');

const botConfig = {
    name: 'DEMON EMPEROR V4',
    version: '4.0'
};

const settingsFilePath = path.join(__dirname, '../database/bot_bio.json');

// Ensure database directory exists
if (!fs.existsSync(path.dirname(settingsFilePath))) {
    fs.mkdirSync(path.dirname(settingsFilePath), { recursive: true });
}

async function setBotBio(client, messageInfo, args) {
    try {
        const senderJid = messageInfo.key.remoteJid;
        const newBio = args.join(' ').trim();

        if (!newBio) {
            return await client.sendMessage(senderJid, {
                text: `📝 *DEMON EMPEROR V4 - BOT BIO SETTINGS*\n\nWhere is the new bio text?\n*Example:* .setbotbio DEMON EMPEROR V4 is online ❤️‍🔥\n\nTo reset to default bio, use:\n.setbotbio default`
            }, { quoted: messageInfo });
        }

        if (newBio.toLowerCase() === 'default') {
            const defaultBio = 'DEMON EMPEROR V4 | Active';
            await client.updateProfileStatus(defaultBio);
            
            fs.writeFileSync(settingsFilePath, JSON.stringify({ bio: defaultBio, updated: new Date() }, null, 2));

            return await client.sendMessage(senderJid, {
                text: `✅ *Bot bio reset to default successfully!*\n\nBio: ${defaultBio}`
            }, { quoted: messageInfo });
        }

        // Update the actual WhatsApp account profile status/bio
        await client.updateProfileStatus(newBio);

        // Save locally
        fs.writeFileSync(settingsFilePath, JSON.stringify({ bio: newBio, updated: new Date() }, null, 2));

        await client.sendMessage(senderJid, {
            text: `✅ *Success in changing the bio of bot's number*\n\nNew Bio: ${newBio}\nStatus: Active (DEMON EMPEROR V4)`
        }, { quoted: messageInfo });

    } catch (error) {
        console.error('Error updating bot bio:', error);
        await client.sendMessage(messageInfo.key.remoteJid, {
            text: `❌ *Error updating bio:* ${error.message}`
        }, { quoted: messageInfo });
    }
}

module.exports = setBotBio;
