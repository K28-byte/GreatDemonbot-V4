const fs = require('fs');
const path = require('path');
const { messageConfig } = require('../lib/messageConfig');

const blocklistPath = path.join(__dirname, '../database/blocklist.json');

// Ensure blocklist database exists
if (!fs.existsSync(blocklistPath)) {
    fs.mkdirSync(path.dirname(blocklistPath), { recursive: true });
    fs.writeFileSync(blocklistPath, JSON.stringify({ blocked: [] }, null, 2));
}

// Block user command
async function blockUserCommand(sock, m, chatUpdate, store) {
    try {
        if (!m || !m.chat) return;

        let targetJid = m.quoted?.sender || m.mentionedJids?.[0];

        if (!targetJid && m.body) {
            const args = m.body.trim().split(/\s+/);
            const query = args[1]?.replace(/[^0-9]/g, '');
            if (query) targetJid = query + '@s.whatsapp.net';
        }

        if (!targetJid) {
            await sock.sendMessage(m.chat, {
                text: '⚠️ *DECREE ERROR*\n\nProvide a valid target to subject to the banishment protocol.',
                ...messageConfig
            });
            return;
        }

        let db = JSON.parse(fs.readFileSync(blocklistPath, 'utf8'));
        const phoneNumber = targetJid.split('@')[0];

        if (db.blocked.includes(phoneNumber)) {
            await sock.sendMessage(m.chat, {
                text: `⚡ Target +${phoneNumber} is already sealed within the blocklist.`,
                ...messageConfig
            });
            return;
        }

        db.blocked.push(phoneNumber);
        fs.writeFileSync(blocklistPath, JSON.stringify(db, null, 2));

        await sock.sendMessage(m.chat, {
            text: `✅ *SANCTION ENFORCED*\n\nUser: +${phoneNumber}\nStatus: Blocked from the realm.`,
            ...messageConfig
        });

    } catch (error) {
        console.error('Execution failure in blockUserCommand:', error);
        await sock.sendMessage(m.chat, {
            text: `💀 An anomaly disrupted the sentencing: ${error.message}`,
            ...messageConfig
        });
    }
}

// Unblock user command
async function unblockUserCommand(sock, m, chatUpdate, store) {
    try {
        if (!m || !m.chat) return;

        let targetJid = m.quoted?.sender || m.mentionedJids?.[0];

        if (!targetJid && m.body) {
            const args = m.body.trim().split(/\s+/);
            const query = args[1]?.replace(/[^0-9]/g, '');
            if (query) targetJid = query + '@s.whatsapp.net';
        }

        if (!targetJid) {
            await sock.sendMessage(m.chat, {
                text: '⚠️ *DECREE ERROR*\n\nSpecify the target whose seal must be lifted.',
                ...messageConfig
            });
            return;
        }

        let db = JSON.parse(fs.readFileSync(blocklistPath, 'utf8'));
        const phoneNumber = targetJid.split('@')[0];

        if (!db.blocked.includes(phoneNumber)) {
            await sock.sendMessage(m.chat, {
                text: `⚡ Target +${phoneNumber} is not currently under restriction.`,
                ...messageConfig
            });
            return;
        }

        db.blocked = db.blocked.filter(num => num !== phoneNumber);
        fs.writeFileSync(blocklistPath, JSON.stringify(db, null, 2));

        await sock.sendMessage(m.chat, {
            text: `🔓 *SANCTION LIFTED*\n\nUser: +${phoneNumber}\nStatus: Restored to the realm.`,
            ...messageConfig
        });

    } catch (error) {
        console.error('Execution failure in unblockUserCommand:', error);
        await sock.sendMessage(m.chat, {
            text: `💀 An anomaly disrupted the pardon: ${error.message}`,
            ...messageConfig
        });
    }
}

// Retrieve blocklist function
function getBlocklist() {
    try {
        const data = fs.readFileSync(blocklistPath, 'utf8');
        return JSON.parse(data).blocked || [];
    } catch {
        return [];
    }
}

module.exports = {
    block: blockUserCommand,
    unblock: unblockUserCommand,
    getBlocklist: getBlocklist
};
