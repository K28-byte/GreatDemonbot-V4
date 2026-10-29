const fs = require('fs');
const path = require('path');

const settingPath = path.join(__dirname, '../database/autorecording.json');

module.exports = async (m, client, args) => {
    try {
        // Ensure database directory exists
        const dir = path.dirname(settingPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Load existing settings
        let settings = {};
        if (fs.existsSync(settingPath)) {
            settings = JSON.parse(fs.readFileSync(settingPath, 'utf8'));
        }

        const action = args[0] ? args[0].toLowerCase() : '';
        const isEnabled = settings[m.chat] || false;
        const currentStatus = isEnabled ? 'Enabled 🟢' : 'Disabled 🔴';

        // If no argument provided, show current status & usage
        if (!action) {
            return await client.sendMessage(m.chat, {
                text: `🎤 *𝐀𝐔𝐓𝐎-𝐑𝐄𝐂𝐎𝐑𝐃𝐈𝐍𝐆 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*\n\nCurrent status: ${currentStatus}\n\n*Usage:* \`.autorecording on\` | \`.autorecording off\`\n\n*Example:* \`.autorecording on\``
            }, { quoted: m });
        }

        if (action === 'on') {
            settings[m.chat] = true;
            fs.writeFileSync(settingPath, JSON.stringify(settings, null, 2));
            return await client.sendMessage(m.chat, {
                text: `✅ Auto-recording has been successfully *enabled* for this chat.`
            }, { quoted: m });
        } 
        
        if (action === 'off') {
            settings[m.chat] = false;
            fs.writeFileSync(settingPath, JSON.stringify(settings, null, 2));
            return await client.sendMessage(m.chat, {
                text: `❌ Auto-recording has been successfully *disabled* for this chat.`
            }, { quoted: m });
        }

        // Invalid option fallback
        return await client.sendMessage(m.chat, {
            text: `❌ Invalid option!\n\n*Usage:* \`.autorecording on\` | \`.autorecording off\`\n\n*Example:* \`.autorecording on\``
        }, { quoted: m });

    } catch (error) {
        console.error('Error in autorecording command:', error);
        await client.sendMessage(m.chat, {
            text: `❌ Failed to update settings: ${error.message}`
        }, { quoted: m });
    }
};
