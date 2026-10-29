/**
 * WhatsApp Pairing Code Plugin
 * Generates and sends an 8-digit pairing code for WhatsApp multi-device linking.
 */

const { phoneNumber } = require('../settings'); // Adjust according to your settings structure
// Or if phone number is provided via args/arguments:

async function pairCommand(sock, m, args, reply) {
    try {
        const from = m.key.remoteJid;

        // Ensure user provided a phone number
        const targetNumber = args[0] ? args[0].replace(/\D/g, '') : '';
        if (!targetNumber) {
            return await sock.sendMessage(from, { text: '❌ Please provide a valid phone number for pairing!\n\n*Example:* `.pair 234xxxxxxxxxx`' }, { quoted: m });
        }

        // Request pairing code from Baileys socket
        // Note: requestPairingCode is natively supported in @whiskeysockets/baileys v6+
        let code = '';
        if (typeof sock.requestPairingCode === 'function') {
            code = await sock.requestPairingCode(targetNumber);
        } else {
            return await sock.sendMessage(from, { text: '❌ Pairing code feature is not supported by this bot instance/version.' }, { quoted: m });
        }

        // Format code neatly (e.g., ABC1-XYZ2 format if desired, or plain code)
        const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;

        const responseText = `✅ *PAIRING CODE GENERATED*\n\n` +
            `📱 *Number:* +${targetNumber}\n` +
            `🔢 *Code:* \`${formattedCode}\`\n\n` +
            `*Follow these steps:*\n` +
            `1. Open WhatsApp on your phone\n` +
            `2. Go to Linked Devices\n` +
            `3. Tap on Link a Device\n` +
            `4. Tap "Link with phone number instead"\n` +
            `5. Enter the 8-digit code above`;

        await sock.sendMessage(from, { text: responseText }, { quoted: m });

    } catch (error) {
        console.error('Error generating pairing code:', error);
        await sock.sendMessage(m.key.remoteJid, { text: `⚠️ Error generating pairing code: ${error.message}` }, { quoted: m });
    }
}

module.exports = pairCommand;
