const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../database/anticall.json');

// Ensure database folder and file exist
if (!fs.existsSync(path.dirname(configPath))) {
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
}
if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({ status: false }, null, 2));
}

const getAntiCallStatus = () => {
    try {
        const data = JSON.parse(fs.readFileSync(configPath));
        return data.status;
    } catch (e) {
        return false;
    }
};

const setAntiCallStatus = (status) => {
    fs.writeFileSync(configPath, JSON.stringify({ status }, null, 2));
};

module.exports = {
    // Command handler for .anticall on/off
    command: async (m, client, args) => {
        const isEnabled = getAntiCallStatus();
        const query = args[0] ? args[0].toLowerCase() : '';

        if (!query) {
            const statusText = `📵 *ANTI-CALL SETTINGS*\n\nCurrent status: ${isEnabled ? 'Enabled 🟢' : 'Disabled 🔴'}\n\nPlease choose an option to enable or disable anticall.\n\n*Usage:*\n- .anticall on  : Enable Anti-Call\n- .anticall off : Disable Anti-Call\n\n*Example:* .anticall on`;
            return await client.sendMessage(m.chat, { text: statusText }, { quoted: m });
        }

        if (query === 'on') {
            setAntiCallStatus(true);
            await client.sendMessage(m.chat, { text: '✅ Anti-Call has been successfully *Enabled*. Incoming calls will be automatically rejected.' }, { quoted: m });
        } else if (query === 'off') {
            setAntiCallStatus(false);
            await client.sendMessage(m.chat, { text: '❌ Anti-Call has been successfully *Disabled*.' }, { quoted: m });
        } else {
            await client.sendMessage(m.chat, { text: '❌ Invalid option!\n\nUse `.anticall on` or `.anticall off`.' }, { quoted: m });
        }
    },

    // Call event listener function
    handleCall: async (client, call) => {
        if (!getAntiCallStatus()) return;

        const callerId = call.from || call[0]?.from;
        if (!callerId) return;

        try {
            await client.rejectCall(call.id, call.from);
            await client.sendMessage(callerId, { 
                text: '📵 *AUTOREJECT*: Calls are currently disabled on this bot. Please do not call!' 
            });
            console.log(`📵 Rejected call from: ${callerId.split('@')[0]}`);
        } catch (error) {
            console.error('Failed to reject call:', error);
        }
    }
};
