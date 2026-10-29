const fs = require('fs');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

const messageContext = {
    key: {
        remoteJid: 'status@broadcast',
        fromMe: false,
        id: 'DEMON_EMPEROR_STATUS',
        participant: {
            remoteJid: '0@s.whatsapp.net',
            fromMe: false,
            id: '0@s.whatsapp.net',
            admin: null
        }
    }
};

async function saveStatus(client, messageInfo) {
    try {
        await client.sendMessage(messageInfo.key.remoteJid, {
            react: { text: '📤', key: messageInfo.key }
        });
    } catch (reactError) {}

    try {
        const messageContent = messageInfo.message?.extendedTextMessage?.contextInfo?.quotedMessage || messageInfo.message;
        
        if (!messageContent) {
            return await client.sendMessage(messageInfo.key.remoteJid, {
                text: '❌ Could not retrieve message content.',
            }, { quoted: messageInfo });
        }

        const senderJid = messageInfo.key.participant || messageInfo.key.remoteJid;
        const senderPhone = senderJid.split('@')[0];

        // Handle Image Status
        if (messageContent.imageMessage) {
            try {
                const stream = await downloadMediaMessage(messageContent.imageMessage, 'buffer');
                let buffer = [];
                for await (const chunk of stream) {
                    buffer.push(chunk);
                }
                const mediaBuffer = Buffer.concat(buffer);
                const caption = messageContent.imageMessage.caption || '';
                
                await client.sendMessage(messageInfo.key.remoteJid, {
                    image: mediaBuffer,
                    caption: `📸 *STATUS SAVED BY DEMON EMPEROR V4*\n\nCaption: ${caption}\n\nTime: ${new Date().toLocaleTimeString()}\n\nSaved from: +${senderPhone}`
                });
            } catch (downloadError) {
                await client.sendMessage(messageInfo.key.remoteJid, {
                    text: `📸 *STATUS SAVED BY DEMON EMPEROR V4*\n\nType: Image Status\nCaption: ${messageContent.imageMessage.caption || 'No caption'}\n\nTime: ${new Date().toLocaleTimeString()}\n\nSaved from: +${senderPhone}\n\n_Note: Image could not be downloaded but status info was saved._`
                });
            }
        } 
        // Handle Video Status
        else if (messageContent.videoMessage) {
            try {
                const stream = await downloadMediaMessage(messageContent.videoMessage, 'buffer');
                let buffer = [];
                for await (const chunk of stream) {
                    buffer.push(chunk);
                }
                const mediaBuffer = Buffer.concat(buffer);
                const caption = messageContent.videoMessage.caption || '';
                
                await client.sendMessage(messageInfo.key.remoteJid, {
                    video: mediaBuffer,
                    caption: `🎥 *STATUS SAVED BY DEMON EMPEROR V4*\n\nCaption: ${caption}\n\nTime: ${new Date().toLocaleTimeString()}\n\nSaved from: +${senderPhone}`
                });
            } catch (downloadError) {
                await client.sendMessage(messageInfo.key.remoteJid, {
                    text: `🎥 *STATUS SAVED BY DEMON EMPEROR V4*\n\nType: Video Status\nCaption: ${messageContent.videoMessage.caption || 'No caption'}\n\nTime: ${new Date().toLocaleTimeString()}\n\nSaved from: +${senderPhone}\n\n_Note: Video could not be downloaded but status info was saved._`
                });
            }
        } 
        // Handle Audio Status
        else if (messageContent.audioMessage) {
            try {
                const stream = await downloadMediaMessage(messageContent.audioMessage, 'buffer');
                let buffer = [];
                for await (const chunk of stream) {
                    buffer.push(chunk);
                }
                const mediaBuffer = Buffer.concat(buffer);
                
                await client.sendMessage(messageInfo.key.remoteJid, {
                    audio: mediaBuffer,
                    mimetype: 'audio/mp4',
                    ptt: messageContent.audioMessage.ptt || false
                });
                await client.sendMessage(messageInfo.key.remoteJid, {
                    text: `🎵 *AUDIO STATUS SAVED BY DEMON EMPEROR V4*\n\nTime: ${new Date().toLocaleTimeString()}\n\nSaved from: +${senderPhone}`
                });
            } catch (downloadError) {
                await client.sendMessage(messageInfo.key.remoteJid, {
                    text: `🎵 *STATUS SAVED BY DEMON EMPEROR V4*\n\nType: Audio Status\nTime: ${new Date().toLocaleTimeString()}\n\nSaved from: +${senderPhone}\n\n_Note: Audio could not be downloaded but status info was saved._`
                });
            }
        } 
        // Handle Sticker Status
        else if (messageContent.stickerMessage) {
            try {
                const stream = await downloadMediaMessage(messageContent.stickerMessage, 'buffer');
                let buffer = [];
                for await (const chunk of stream) {
                    buffer.push(chunk);
                }
                const mediaBuffer = Buffer.concat(buffer);
                
                await client.sendMessage(messageInfo.key.remoteJid, {
                    sticker: mediaBuffer
                });
                await client.sendMessage(messageInfo.key.remoteJid, {
                    text: `🎯 *STICKER STATUS SAVED BY DEMON EMPEROR V4*\n\nTime: ${new Date().toLocaleTimeString()}\n\nSaved from: +${senderPhone}`
                });
            } catch (downloadError) {
                await client.sendMessage(messageInfo.key.remoteJid, {
                    text: `🎯 *STATUS SAVED BY DEMON EMPEROR V4*\n\nType: Sticker Status\nTime: ${new Date().toLocaleTimeString()}\n\nSaved from: +${senderPhone}\n\n_Note: Sticker could not be downloaded but status info was saved._`
                });
            }
        } 
        // Handle Text Status
        else if (messageContent.conversation || messageContent.extendedTextMessage) {
            const textContent = messageContent.conversation || messageContent.extendedTextMessage?.text || '';
            await client.sendMessage(messageInfo.key.remoteJid, {
                text: `📝 *STATUS SAVED BY DEMON EMPEROR V4*\n\nType: Text Status\nText: "${textContent}"\n\nTime: ${new Date().toLocaleTimeString()}\n\nSaved from: +${senderPhone}`
            });
        } 
        // Handle Unknown Statuses
        else {
            await client.sendMessage(messageInfo.key.remoteJid, {
                text: `❓ *STATUS SAVED BY DEMON EMPEROR V4*\n\nType: Unknown Status\nTime: ${new Date().toLocaleTimeString()}\n\nSaved from: +${senderPhone}\n\n_Note: Status type could not be identified but was saved._`
            });
        }
    } catch (error) {
        console.error('Error processing status:', error);
        try {
            await client.sendMessage(messageInfo.key.remoteJid, {
                text: '📥 *STATUS SAVE ATTEMPT BY DEMON EMPEROR V4*\n\n_Note: Status could not be processed completely but attempt was made._'
            });
        } catch (fallbackError) {}
    }
}

module.exports = saveStatus;
