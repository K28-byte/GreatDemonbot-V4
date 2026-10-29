/**
 * De-obfuscated Multi-Plugin Module
 * Customised for the Demon Emperor
 */

const fs = require('fs');
const axios = require('axios');
const isAdmin = require('../lib/isAdmin');

// Helper response handler
const sendReply = async (sock, m, text, options = {}) => {
    return await sock.sendMessage(m.key.remoteJid, { text, ...options }, { quoted: m });
};

// 1. Change Group Name (Qaw6kpR)
async function groupName(sock, m, mek, args, reply) {
    try {
        const from = m.key.remoteJid;
        if (!m.isGroup) return reply('❌ This command can only be used in groups!');

        const groupMetadata = await sock.groupMetadata(from);
        const adminCheck = await isAdmin(sock, from, m.sender, groupMetadata);

        if (!adminCheck.isSenderAdmin) return reply('❌ You must be a Group Admin to use this command!');
        if (!adminCheck.isBotAdmin) return reply('❌ Bot needs to be an Admin to execute this command!');

        const newName = args.join(' ');
        if (!newName) return reply('❌ Please provide a new group name!');

        await sock.groupUpdateSubject(from, newName);
        await reply(`✅ Group name changed successfully by order of the Demon Emperor to: *${newName}*`);
    } catch (error) {
        await reply(`⚠️ Error updating group name: ${error.message}`);
    }
}

// 2. Update Group Description (TH6I0Z)
async function groupDesc(sock, m, mek, args, reply) {
    try {
        const from = m.key.remoteJid;
        if (!m.isGroup) return reply('❌ This command can only be used in groups!');

        const groupMetadata = await sock.groupMetadata(from);
        const adminCheck = await isAdmin(sock, from, m.sender, groupMetadata);

        if (!adminCheck.isSenderAdmin) return reply('❌ You must be a Group Admin to use this command!');
        if (!adminCheck.isBotAdmin) return reply('❌ Bot needs to be an Admin to execute this command!');

        const newDesc = args.join(' ');
        if (!newDesc) return reply('❌ Please provide a new description!');

        await sock.groupUpdateDescription(from, newDesc);
        await reply(`✅ Group description updated successfully under the Demon Emperor's decree!`);
    } catch (error) {
        await reply(`⚠️ Error updating group description: ${error.message}`);
    }
}

// 3. Group Settings Manager (Wa6kuRZ)
async function groupSettings(sock, m, mek, args, reply) {
    try {
        const from = m.key.remoteJid;
        if (!m.isGroup) return reply('❌ This command can only be used in groups!');

        const groupMetadata = await sock.groupMetadata(from);
        const adminCheck = await isAdmin(sock, from, m.sender, groupMetadata);

        if (!adminCheck.isSenderAdmin) return reply('❌ You must be a Group Admin to use this command!');
        if (!adminCheck.isBotAdmin) return reply('❌ Bot needs to be an Admin to execute this command!');

        const action = args[0] ? args[0].toLowerCase() : '';
        if (action === 'lock') {
            await sock.groupSettingUpdate(from, 'announcement');
            await reply('🔒 *Group closed by the Demon Emperor!* Only admins can send messages now.');
        } else if (action === 'unlock') {
            await sock.groupSettingUpdate(from, 'not_announcement');
            await reply('🔓 *Group opened by the Demon Emperor!* All participants can send messages now.');
        } else {
            await reply('❌ Usage: `.gpset lock` or `.gpset unlock`');
        }
    } catch (error) {
        await reply(`⚠️ Error updating group settings: ${error.message}`);
    }
}

// 4. Admin Alert / Tag Admins (r2q1ZQG / sjs3SE)
async function tagAdmins(sock, m, mek, args, reply) {
    try {
        const from = m.key.remoteJid;
        if (!m.isGroup) return reply('❌ This command can only be used in groups!');

        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants;
        const admins = participants.filter(p => p.admin !== null);

        let text = `📢 *DEMON EMPEROR'S ADMIN ALERT*\n\n${args.join(' ') || 'Attention Admins, report immediately!'}\n\n*Admins:*\n`;
        let mentions = [];

        admins.forEach((admin, index) => {
            text += `${index + 1}. @${admin.id.split('@')[0]}\n`;
            mentions.push(admin.id);
        });

        await sock.sendMessage(from, { text, mentions });
    } catch (error) {
        await reply(`⚠️ Error tagging admins: ${error.message}`);
    }
}

// 5. Website Screenshot (ZcHTLj)
async function ssWeb(sock, m, mek, args, reply) {
    try {
        const from = m.key.remoteJid;
        const url = args[0];

        if (!url) return reply('❌ Please provide a valid website URL (e.g., https://google.com)');
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return reply('❌ URL must start with http:// or https://');
        }

        await reply('📸 *Capturing website surveillance, please wait...*');

        const screenshotUrl = `https://api.screenshotmachine.com/?key=demo&url=${encodeURIComponent(url)}&dimension=1024x768`;
        const response = await axios.get(screenshotUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);

        await sock.sendMessage(from, {
            image: buffer,
            caption: `📸 *Demon Emperor Web Surveillance*\n\nURL: ${url}\nTime: ${new Date().toLocaleString()}`
        });
    } catch (error) {
        await reply(`⚠️ Failed to capture screenshot: ${error.message}`);
    }
}

// 6. QR Code Generator (FQHMCGL)
async function qrCode(sock, m, mek, args, reply) {
    try {
        const from = m.key.remoteJid;
        const text = args.join(' ');

        if (!text) return reply('❌ Please provide text or a link to convert into a QR Code!');

        await reply('🔲 *Forging QR Code...*');

        const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`;
        const response = await axios.get(qrApi, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);

        await sock.sendMessage(from, {
            image: buffer,
            caption: `🔲 *Demon Emperor QR Code*\n\nText: ${text}\nScan to reveal`
        });
    } catch (error) {
        await reply(`⚠️ Error generating QR Code: ${error.message}`);
    }
}

// 7. URL Shortener (R7F49r)
async function shortUrl(sock, m, mek, args, reply) {
    try {
        const from = m.key.remoteJid;
        const longUrl = args[0];

        if (!longUrl) return reply('❌ Please provide a URL to shorten!');
        if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
            return reply('❌ URL must start with http:// or https://');
        }

        await reply('🔗 *Compressing link length...*');

        const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`;
        const response = await axios.get(apiUrl);

        if (response.data) {
            await reply(`🔗 *URL Shortened Successfully*\n\n*Original:* ${longUrl}\n\n*Shortened:* ${response.data}`);
        } else {
            throw new Error('Invalid response from API');
        }
    } catch (error) {
        await reply(`⚠️ Error shortening URL: ${error.message}`);
    }
}

// 8. Language Translator (t5dr1X)
async function translateText(sock, m, mek, args, reply) {
    try {
        const from = m.key.remoteJid;
        if (!args || args.length < 2) {
            return reply('❌ Usage: `.tr <lang_code> <text>`\nExample: `.tr es Hello how are you?`');
        }

        const targetLang = args[0].toLowerCase();
        const textToTranslate = args.slice(1).join(' ');

        await reply('🌐 *Translating across realms...*');

        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=auto|${targetLang}`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.responseData) {
            const translatedText = response.data.responseData.translatedText;
            await reply(`🌐 *Demon Emperor Translation*\n\n*Original:* ${textToTranslate}\n*Translated:* ${translatedText}\n*Language:* ${targetLang.toUpperCase()}`);
        } else {
            throw new Error('Translation failed');
        }
    } catch (error) {
        await reply(`⚠️ Error translating text: ${error.message}`);
    }
}

// Exporting functions back to the bot runner
module.exports = {
    groupname: groupName,
    groupdesc: groupDesc,
    groupsetting: groupSettings,
    tagadmins: tagAdmins,
    ssweb: ssWeb,
    qrcode: qrCode,
    shorturl: shortUrl,
    translate: translateText
};
