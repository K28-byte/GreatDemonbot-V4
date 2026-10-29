const fs = require('fs');
const path = require('path');

// Database path for storing auto-typing configuration
const configPath = path.join(__dirname, '../database/autotyping.json');

// Ensure database directory and file exist safely
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify({ status: false }, null, 2));
}

async function autoTypingModule(sock, m, chatUpdate, store) {
    try {
        if (!m || !m.chat) return;

        const body = m.body || m.text || '';
        const args = body.trim().split(/\s+/);
        const command = args[0]?.toLowerCase();
        
        // Read current status from JSON database securely
        let dbData;
        try {
            dbData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        } catch {
            dbData = { status: false };
        }
        
        // Command handler: .autotyping
        if (command === '.autotyping') {
            const action = args[1]?.toLowerCase();

            if (!action) {
                const currentStatus = dbData.status ? 'ENABLED' : 'DISABLED';
                await sock.sendMessage(m.chat, {
                    text: `✦ 𝚻𝐰𝐢𝐧𝐤𝐥𝐢𝐧𝐠 𝚯𝐫𝐢𝐥𝐥𝐢𝐚𝐧𝐜𝐞 ✦\n\n[ 𝕬𝖀𝕿𝕺-𝕿𝖄𝕻𝕴𝕹𝕲 𝕾𝕯𝕾 ]\n\nStatus: ${currentStatus}\n\nCommand: .autotyping <on | off>`
                });
                return;
            }

            if (action === 'on') {
                dbData.status = true;
                fs.writeFileSync(configPath, JSON.stringify(dbData, null, 2));
                await sock.sendMessage(m.chat, { text: '⚡ Auto-typing protocol activated. Silence is broken.' });
                return;
            }

            if (action === 'off') {
                dbData.status = false;
                fs.writeFileSync(configPath, JSON.stringify(dbData, null, 2));
                await sock.sendMessage(m.chat, { text: '🌑 Auto-typing protocol deactivated. Shadows restored.' });
                return;
            }

            await sock.sendMessage(m.chat, {
                text: '⚠️ Invalid decree. Use `.autotyping on` or `.autotyping off`.'
            });
            return;
        }

        // Automatic Typing Presence Logic
        if (dbData.status && !m.key.fromMe) {
            try {
                await sock.presenceSubscribe(m.chat);
                await sock.sendPresenceUpdate('composing', m.chat);
            } catch (err) {
                console.error('Presence transmission failed:', err);
            }
        }

    } catch (error) {
        console.error('Core anomaly detected in autoTypingModule:', error);
    }
}

module.exports = {
    handler: autoTypingModule,
    config: autoTypingModule,
    status: async () => {
        try {
            const dbData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            return dbData.status;
        } catch {
            return false;
        }
    }
};
