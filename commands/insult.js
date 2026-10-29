const { delay } = require('@whiskeysockets/baileys');

// List of playful insults / banter lines
const insultList = [
    "you have the kind of face that makes people want to invent a time machine just to avoid meeting you.",
    "is your brain on airplane mode today, or is this just your default setting?",
    "you bring everyone so much joy... when you leave the room.",
    "if common sense was currency, you'd be filing for bankruptcy.",
    "you're proof that evolution can go in reverse."
];

async function handleInsultCommand(conn, mek, m, { reply }) {
    try {
        // Determine the target user (either quoted message sender or mentioned user)
        const quoted = mek.msg?.contextInfo?.quotedMessage;
        const mentionedJid = mek.msg?.contextInfo?.mentionedJid?.[0];
        
        let targetUser = mentionedJid || quoted?.participant || mek.key.participant || mek.chat;

        if (!targetUser) {
            return reply("❌ Please tag someone or reply to their message to use this command under the rule of the Emperor.");
        }

        // Pick a random insult
        const randomInsult = insultList[Math.floor(Math.random() * insultList.length)];
        const username = targetUser.split('@')[0];

        // Send the insult tagging the user
        await conn.sendMessage(m.chat, {
            text: `Hey @${username}, ${randomInsult}`,
            mentions: [targetUser]
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in insult command:", error);
        await reply(`❌ Error executing command: ${error.message || error}`);
    }
}

module.exports = handleInsultCommand;
