const fs = require('fs');
const path = require('path');

// Database path for storing auto-status configuration
const dbPath = path.join(__dirname, '../database/autostatus.json');

// Ensure database directory and file exist
if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify({ status: false }, null, 2));
}

async function autoStatusModule(sock, m, chatUpdate, store) {
    try {
        const body = m.body || m.text || '';
        const command = body.trim().split()[0]?.toLowerCase();
        
        // Read current status from JSON database
        let dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        
        // Command handler: .autostatus
        if (command === '.autostatus') {
            const args = body.trim().split(/\s+/).slice(1);
            const action = args[0]?.toLowerCase();

            if (!action) {
                const currentStatus = dbData.status ? 'Enabled' : 'Disabled';
                await sock.sendMessage(m.chat, {
                    text: `🔄 *AUTO STATUS VIEW*\n\nCurrent status: ${currentStatus}\n\nUse:\n.autostatus on - Enable auto status view\n.autostatus off - Disable auto status view`
                });
                return;
            }

            if (action === 'on') {
                dbData.status = true;
                fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
                await sock.sendMessage(m.chat, { text: '✅ Auto status view has been **enabled**.' });
                return;
            }

            if (action === 'off') {
                dbData.status = false;
                fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
                await sock.sendMessage(m.chat, { text: '❌ Auto status view has been **disabled**.' });
                return;
            }
        }

        // Automatic Status Viewing Logic (runs if enabled in db)
        if (dbData.status) {
            // Check for incoming status updates
            if (m.message && m.key && m.key.remoteJid === 'status@broadcast') {
                try {
                    await sock.readMessages([m.key]);
                    console.log(`✅ Viewed status from: ${m.pushName || m.sender}`);
                } catch (err) {
                    console.error('Error viewing status:', err);
                }
            }
        }

    } catch (error) {
        console.error('Error in autoStatusModule:', error);
    }
}

module.exports = {
    handler: autoStatusModule
};
