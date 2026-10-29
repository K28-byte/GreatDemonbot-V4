/**
 * Owner Command Plugin (Safe Version)
 * Sends the bot owner's contact card (vCard) to the chat.
 */

let settings;
try {
    settings = require('../settings');
} catch (e) {
    settings = {};
}

async function ownerCommand(sock, m, args, reply) {
    try {
        const from = m.key.remoteJid;

        // Fallback variables if settings.js is missing values
        const ownerName = settings.ownerName || 'Owner';
        const ownerNumber = settings.ownerNumber || '2340000000000';

        // 1. Construct vCard safely
        const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
TEL;waid=${ownerNumber}:${ownerNumber}
END:VCARD
`;

        // 2. Send the contact card to the chat
        await sock.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        }, { quoted: m });

        // Optional: Send success checkmark if you want confirmation
        // await sock.sendMessage(from, { text: '✅ Owner contact sent successfully!' }, { quoted: m });

    } catch (error) {
        console.error('Error in owner command:', error);
        await sock.sendMessage(m.key.remoteJid, { text: `⚠️ Error executing owner command: ${error.message}` }, { quoted: m });
    }
}

module.exports = ownerCommand;
