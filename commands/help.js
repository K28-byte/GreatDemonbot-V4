const fs = require('fs');
const path = require('path');
const os = require('os');
const settings = require('../settings');

async function rdfwrh(conn, mek, m, { q, reply, pushname }) {
    // Calculate uptime & ping
    const uptime = runtime(process.uptime());
    const ping = Date.now() - mek.timestamp * 1000;

    const menuText = `
╔═════════⍟◆⍟═════════╗
├▢ *𝗡𝗔𝗠𝗘: 🌐 𝗗𝗘𝗠𝗢𝗡 𝗘𝗠𝗣𝗘𝗥𝗢𝗥-𝗩4 👑*
├▢ *𝗢𝗪𝗡𝗘𝗥: ${settings.ownerName || 'Demon Emperor'}*
├▢ *𝗧𝗜𝗠𝗘: ${new Date().toLocaleTimeString()}*
├▢ *𝗥𝗨𝗡𝗧𝗜𝗠𝗘: ${uptime}*
├▢ *𝗣𝗜𝗡𝗚: ${ping} ms*
├▢ *𝗩𝗘𝗥𝗦𝗜𝗢𝗡: v1.0.0*
╚══════════⍟◆⍟═════════╝

┏❐═══════════════════╗
┃     ʟᴇᴀᴅᴇʀ ᴍᴇɴᴜ 🔮
╠────────────────────╣
┃⍟ .menu
┃⍟ .ping
┃⍟ .alive
┃⍟ .tts
┃⍟ .owner
┃⍟ .joke
┃⍟ .quote
┃⍟ .fact
┃⍟ .weather 
┃⍟ .news
┃⍟ .attp
┃⍟ .lyrics
┃⍟ .8ball 
┃⍟ .groupinfo
┃⍟ .admins 
┃⍟ .vv
┃⍟ .trt
┃⍟ .ss 
┃⍟ .jid
┃⍟ .runtime 
┃⍟ .uptime 
┃⍟ .staff 
┃⍟ .qrcode *[NEW]*
┃⍟ .shorturl *[NEW]*
┃⍟ .translate *[NEW]*
┗❐═══════════════════╝

┏❐═══════════════════╗
┃       𝗔𝗜 𝗠𝗘𝗡𝗨 🤖
╠────────────────────╣
┃⍟ .gpt
┃⍟ .gemini
┃⍟ .imagine
┃⍟ .flux
┃⍟ .dalle 
┗❐═══════════════════╝

┏❐═══════════════════╗
┃       𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦 ⚙️
╠────────────────────╣
┃⍟ .mode
┃⍟ .autostatus
┃⍟ .clearsession
┃⍟ .antidelete
┃⍟ .cleartmp
┃⍟ .setpp 
┃⍟ .autoreact
┃⍟ .areact *[NEW]*
┃⍟ .setbotbio *[NEW]*
┃⍟ .autotyping *[NEW]*
┃⍟ .autorecording *[NEW]*
┃⍟ .anticall *[NEW]*
┃⍟ .pmpermit *[NEW]*
┃⍟ .pmapprove *[NEW]*
┃⍟ .pmblock *[NEW]*
┃⍟ .channelreact *[NEW]*
┗❐═══════════════════╝

┏❐═══════════════════╗
┃     𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨 👬
╠────────────────────╣
┃⍟ .ban
┃⍟ .unban
┃⍟ .promote
┃⍟ .demote
┃⍟ .mute 
┃⍟ .unmute
┃⍟ .delete
┃⍟ .kick
┃⍟ .warnings
┃⍟ .warn
┃⍟ .antilink
┃⍟ .antibadword
┃⍟ .clear
┃⍟ .tag
┃⍟ .tagall
┃⍟ .chatbot
┃⍟ .resetlink
┃⍟ .welcome
┃⍟ .goodbye
┃⍟ .kickall *[NEW]*
┃⍟ .leavegc *[NEW]*
┃⍟ .add *[NEW]*
┃⍟ .setname *[NEW]*
┃⍟ .setdesc *[NEW]*
┃⍟ .revoke *[NEW]*
┃⍟ .hidetag *[NEW]*
┃⍟ .tagadmins *[NEW]*
┃⍟ .creategc *[NEW]*
┃⍟ .online *[NEW]*
┃⍟ .onlineusers *[NEW]*
┃⍟ .onlineadmins *[NEW]*
┃⍟ .onlinestats *[NEW]*
┗❐═══════════════════╝

┏❐═══════════════════╗
┃     𝗦𝗧𝗜𝗖𝗞𝗘𝗥 𝗠𝗘𝗡𝗨 ❤️‍🔥
╠────────────────────╣
┃⍟ .blur
┃⍟ .simage 
┃⍟ .sticker
┃⍟ .tgsticker
┃⍟ .meme
┃⍟ .take 
┃⍟ .emojimix
┃⍟ .s
┗❐═══════════════════╝

┏❐═══════════════════╗
┃     𝗙𝗨𝗡 𝗠𝗘𝗡𝗨 😅
╠────────────────────╣
┃⍟ .tictactoe 
┃⍟ .hangman
┃⍟ .guess 
┃⍟ .trivia
┃⍟ .answer
┃⍟ .truth
┃⍟ .dare
┃⍟ .ttt *[NEW]* 
┃⍟ .move *[NEW]* 
┃⍟ .surrender *[NEW]* 
┗❐═══════════════════╝

┏❐═══════════════════╗
┃     𝗘𝗫𝗧𝗥𝗔 𝗠𝗘𝗡𝗨 🛠
╠────────────────────╣
┃⍟ .compliment
┃⍟ .insult
┃⍟ .flirt 
┃⍟ .shayari
┃⍟ .goodnight
┃⍟ .roseday
┃⍟ .character
┃⍟ .wasted
┃⍟ .ship 
┃⍟ .simp
┃⍟ .stupid
┃⍟ .waste 
┃⍟ .gn *[NEW]* 
┃⍟ .lovenight *[NEW]* 
┃⍟ .shayri *[NEW]*
┃⍟ .itssostupid *[NEW]* 
┃⍟ .iss *[NEW]*
┗❐═══════════════════╝

┏❐═══════════════════╗
┃     𝗗𝗘𝗦𝗜𝗚𝗡 𝗠𝗘𝗡𝗨 🔱
╠────────────────────╣
┃⍟ .metallic 
┃⍟ .ice 
┃⍟ .snow
┃⍟ .impressive
┃⍟ .matrix
┃⍟ .light
┃⍟ .neon
┃⍟ .devil
┃⍟ .purple
┃⍟ .thunder
┃⍟ .leaves
┃⍟ .1917 
┃⍟ .arena
┃⍟ .hacker
┃⍟ .sand
┃⍟ .blackpink
┃⍟ .glitch
┃⍟ .fire 
┗❐═══════════════════╝

┏❐═══════════════════╗
┃   𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 𝗠𝗘𝗡𝗨 📥
╠────────────────────╣
┃⍟ .play
┃⍟ .song 
┃⍟ .instagram
┃⍟ .facebook
┃⍟ .tiktok 
┃⍟ .video
┃⍟ .ytmp4
┃⍟ .music *[NEW]*
┃⍟ .mp3 *[NEW]* 
┃⍟ .ytmp3 *[NEW]* 
┃⍟ .yts *[NEW]* 
┃⍟ .insta *[NEW]* 
┃⍟ .ig *[NEW]* 
┃⍟ .fb *[NEW]* 
┃⍟ .tt *[NEW]* 
┗❐═══════════════════╝

┏❐═══════════════════╗
┃   𝗨𝗧𝗜𝗟𝗜𝗧𝗬 & 𝗧𝗢𝗢𝗟𝗦 🛠 
╠────────────────────╣
┃⍟ .save *[Status Saver] [NEW]*
┃⍟ .savecontact *[NEW]*
┃⍟ .vcf *[NEW]* 
┃⍟ .block *[NEW]*
┃⍟ .unblock *[NEW]*
┃⍟ .pair *[NEW]*
┃⍟ .linkdevice *[NEW]* 
┃⍟ .screenshot *[NEW]*
┃⍟ .qr *[NEW]* 
┃⍟ .short *[NEW]* 
┃⍟ .del *[NEW]* 
┗❐═══════════════════╝

┏❐═══════════════════╗
┃     𝗚𝗜𝗧𝗛𝗨𝗕 𝗠𝗘𝗡𝗨 📜
╠────────────────────╣
┃⍟ .git
┃⍟ .github
┃⍟ .sc
┃⍟ .script
┃⍟ .repo
┃⍟ .gitclone
┗❐═══════════════════╝

┏❐═══════════════════╗
┃     𝗔𝗕𝗢𝗨𝗧 𝗨𝗦
╠────────────────────╣
┃  𝑚𝑢𝑙𝑡𝑖𝑑𝑒𝑣𝑖𝑐𝑒 𝑤ℎ𝑎𝑡𝑠𝑎𝑝𝑝 𝑏𝑜𝑡 ⚡ 
┃  𝑐𝑜𝑛𝑡𝑎𝑐𝑡 𝑚𝑒 :t.me/Kelvinlair
   𝐶𝑟𝑒𝑎𝑡𝑜𝑟: 𝐷𝑒𝑚𝑜𝑛 𝐸𝑚𝑝𝑒𝑟𝑜𝑟
  🌀gιтнυв:https://github.com/K28-byte
┗❐═══════════════════╝`.trim();

    try {
        const imagePath = path.join(__dirname, '../Assets/menu_image.jpg');

        if (fs.existsSync(imagePath)) {
            await conn.sendMessage(m.chat, {
                image: fs.readFileSync(imagePath),
                caption: menuText,
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        title: "🌐 𝗗𝗘𝗠𝗢𝗡 𝗘𝗠𝗣𝗘𝗥𝗢𝗥-𝗩4 👑",
                        body: "Tap to view command list",
                        thumbnail: fs.readFileSync(imagePath),
                        sourceUrl: "https://github.com",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: mek });
        } else {
            await conn.sendMessage(m.chat, {
                text: menuText,
                contextInfo: {
                    mentionedJid: [m.sender]
                }
            }, { quoted: mek });
        }
    } catch (error) {
        console.error("Error sending menu:", error);
        await reply(`❌ Error: ${error.message}`);
    }
}

function runtime(seconds) {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
}

module.exports = rdfwrh;
