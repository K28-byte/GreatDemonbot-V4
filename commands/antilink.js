const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../database/antilink.json');

// Ensure database folder and file exist
if (!fs.existsSync(path.dirname(configPath))) {
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
}
if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({ status: false, action: 'delete' }, null, 2));
}

const getAntiLinkConfig = () => {
    try {
        const data = JSON.parse(fs.readFileSync(configPath));
        return data;
    } catch (e) {
        return { status: false, action: 'delete' };
    }
};

const saveAntiLinkConfig = (config) => {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
};

module.exports = {
    // 1. Command handler for .antilink on/off/set
    command: async (m, client, args) => {
        const config = getAntiLinkConfig();
        const query = args[0] ? args[0].toLowerCase() : '';
        const subQuery = args[1] ? args[1].toLowerCase() : '';

        if (!query) {
            const statusText = `🛡️ *DEMON EMPEROR - ANTI-LINK*\n\n` +
                `Status: ${config.status ? 'Enabled 🟢' : 'Disabled 🔴'}\n` +
                `Action: ${config.action}\n\n` +
                `*Usage:*\n` +
                `- .antilink on\n` +
                `- .antilink off\n` +
                `- .antilink set delete | kick | warn`;
            return await client.sendMessage(m.chat, { text: statusText }, { quoted: m });
        }

        if (query === 'on') {
            config.status = true;
            saveAntiLinkConfig(config);
            await client.sendMessage(m.chat, { text: '✅ Anti-Link has been successfully *Enabled*.' }, { quoted: m });
        } else if (query === 'off') {
            config.status = false;
            saveAntiLinkConfig(config);
            await client.sendMessage(m.chat, { text: '❌ Anti-Link has been successfully *Disabled*.' }, { quoted: m });
        } else if (query === 'set') {
            if (!['delete', 'kick', 'warn'].includes(subQuery)) {
                return await client.sendMessage(m.chat, { text: '❌ Invalid action! Choose: `delete`, `kick`, or `warn`.' }, { quoted: m });
            }
            config.action = subQuery;
            saveAntiLinkConfig(config);
            await client.sendMessage(m.chat, { text: `✅ Anti-Link action set to *${subQuery}*.` }, { quoted: m });
        } else {
            await client.sendMessage(m.chat, { text: '❌ Invalid option! Use `.antilink` for usage instructions.' }, { quoted: m });
        }
    },

    // 2. Message scanner listener for links
    handleMessage: async (client, m) => {
        const config = getAntiLinkConfig();
        if (!config.status) return;

        // Skip if message is from owner/bot or has no body text
        if (!m.body || m.key.fromMe) return;

        const text = m.body;
        // Regex patterns for links
        const linkPatterns = [
            /chat\.whatsapp\.com\/[A-Za-z0-9]{20,}/i,
            /wa\.me\/channel\/[A-Za-z0-9]{20,}/i,
            /t\.me\/[A-Za-z0-9_]+/i,
            /https?:\/\/[^\s]+/i
        ];

        const containsLink = linkPatterns.some(pattern => pattern.test(text));
        if (!containsLink) return;

        try {
            // Delete the message containing the link
            await client.sendMessage(m.chat, { delete: m.key });

            // Apply configured action
            if (config.action === 'warn') {
                await client.sendMessage(m.chat, {
                    text: `⚠️ *WARNING*: @${m.sender.split('@')[0]}, sending links is not allowed here!`,
                    mentions: [m.sender]
                });
            } else if (config.action === 'kick') {
                await client.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
                await client.sendMessage(m.chat, {
                    text: `👢 *REMOVED*: @${m.sender.split('@')[0]} was kicked for sending links.`,
                    mentions: [m.sender]
                });
            }
        } catch (error) {
            console.error('Error in anti-link handler:', error);
        }
    }
};
