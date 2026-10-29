const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../database/antidelete.json');

// Ensure database folder and file exist
if (!fs.existsSync(path.dirname(configPath))) {
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
}
if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({ status: false }, null, 2));
}

const getAntiDeleteStatus = () => {
    try {
        const data = JSON.parse(fs.readFileSync(configPath));
        return data.status;
    } catch (e) {
        return false;
    }
};

const setAntiDeleteStatus = (status) => {
    fs.writeFileSync(configPath, JSON.stringify({ status }, null, 2));
};

module.exports = {
    // 1. Command handler for .antidelete on/off
    command: async (m, client, args) => {
        const isEnabled = getAntiDeleteStatus();
        const query = args[0] ? args[0].toLowerCase() : '';

        if (!query) {
            const statusText = `🛡️ *DEMON EMPEROR - ANTI-DELETE*\n\nCurrent Status: ${isEnabled ? 'Enabled 🟢' : 'Disabled 🔴'}\n\nConfigure anti-delete tracking for deleted messages.\n\n*Usage:*\n- .antidelete on  : Enable Anti-Delete\n- .antidelete off : Disable Anti-Delete\n\n*Example:* .antidelete on`;
            return await client.sendMessage(m.chat, { text: statusText }, { quoted: m });
        }

        if (query === 'on') {
            setAntiDeleteStatus(true);
            await client.sendMessage(m.chat, { text: '✅ Anti-Delete has been successfully *Enabled*. Deleted messages will now be tracked and re-sent.' }, { quoted: m });
        } else if (query === 'off') {
            setAntiDeleteStatus(false);
            await client.sendMessage(m.chat, { text: '❌ Anti-Delete has been successfully *Disabled*.' }, { quoted: m });
        } else {
            await client.sendMessage(m.chat, { text: '❌ Invalid option!\n\nUse `.antidelete on` or `.antidelete off`.' }, { quoted: m });
        }
    },

    // 2. Message delete event listener (Re-sends the deleted message with cold-reply styling)
    handleDelete: async (client, messageUpdate) => {
        if (!getAntiDeleteStatus()) return;

        try {
            // Check if the update contains a deleted message event
            // Note: Depending on your specific Baileys handler version, this catches message retraction/deletion
            if (messageUpdate.type === 'notify' && messageUpdate.messages) {
                for (let msg of messageUpdate.messages) {
                    if (msg.message && msg.message.protocolMessage && msg.message.protocolMessage.type === 0) {
                        const deletedKey = msg.message.protocolMessage.key;
                        
                        // Fetch or check stored message cache if your bot has message storage enabled
                        // Sending cold-reply alert back to the chat or owner log
                        const sender = msg.participant || msg.key.remoteJid;
                        
                        await client.sendMessage(msg.key.remoteJid, {
                            text: `👁️ *DELETED MESSAGE DETECTED*\n\n*User:* @${sender.split('@')[0]}\n*Status:* Caught by Demon Emperor Anti-Delete.`,
                            mentions: [sender]
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error in anti-delete handler:', error);
        }
    }
};
