const { proto } = require('@whiskeysockets/baileys');

// Internal presence tracking objects
const typingStatusMap = new Map();
const recordingStatusMap = new Map();

async function statusCommand(client, message, args, extra) {
    const senderNumber = message.key.remoteJid;
    const action = args[0] ? args[0].toLowerCase() : '';

    try {
        switch (action) {
            case 'typing':
                typingStatusMap.set(senderNumber, true);
                await sendPresenceUpdate(client, senderNumber, 'composing');
                await client.sendMessage(senderNumber, {
                    text: '✦ Status Indicator set to: *Typing*',
                    contextInfo: { quotedMessageId: message.key.id }
                });
                break;

            case 'recording':
                recordingStatusMap.set(senderNumber, true);
                await sendPresenceUpdate(client, senderNumber, 'recording');
                await client.sendMessage(senderNumber, {
                    text: '✦ Status Indicator set to: *Recording*',
                    contextInfo: { quotedMessageId: message.key.id }
                });
                break;

            case 'stop':
                typingStatusMap.delete(senderNumber);
                recordingStatusMap.delete(senderNumber);
                await client.sendPresenceUpdate('available', senderNumber);
                await client.sendMessage(senderNumber, {
                    text: '✦ All status indicators disabled.',
                    contextInfo: { quotedMessageId: message.key.id }
                });
                break;

            default:
                const helpText = [
                    '• *.status typing* - Show typing indicator',
                    '• *.status recording* - Show recording indicator',
                    '• *.status stop* - Disable all indicators'
                ].join('\n');

                await client.sendMessage(senderNumber, {
                    text: helpText
                }, { quoted: message });
                break;
        }
    } catch (error) {
        console.error('Error handling status command:', error);
        await client.sendMessage(senderNumber, {
            text: 'An error occurred while updating your status indicator.'
        }, { quoted: message });
    }
}

async function sendPresenceUpdate(sock, jid, presenceType) {
    const isTyping = presenceType === 'composing';
    const activeMap = isTyping ? typingStatusMap : recordingStatusMap;

    while (activeMap.has(jid)) {
        await sock.sendPresenceUpdate(presenceType, jid);
        // Delay interval before repeating presence signal
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    await sock.sendPresenceUpdate('available', jid);
}

module.exports = statusCommand;
