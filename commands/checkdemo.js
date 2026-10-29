module.exports = {
    name: 'checkdemon',
    aliases: ['demoncheck'],
    description: 'Displays profile details and the Great Demon Emp Tech channel link.',

    async execute(sock, msg, args) {
        const remoteJid = msg.key.remoteJid;

        try {
            // Example data (replace or hook up to your lookup function)
            const profileInfo = {
                id: args[0] || '1337',
                name: 'Demon Emperor',
                followers: '1,450',
                status: 'Active',
                verified: true
            };

            const formattedOutput = `
*╭─── 👺 𝑮𝒓𝒆𝒂𝒕 𝒅𝒆𝒎𝒐𝒏 𝒆𝒎𝒑 ───*
*│ Target ID:* ${profileInfo.id}
*│ Name:* ${profileInfo.name}
*│ Followers:* ${profileInfo.followers}
*│ Status:* ${profileInfo.status}
*│ Verified:* ${profileInfo.verified ? 'Yes ✅' : 'No ❌'}
*╰────────────────────────────*

_🔥 Follow the 𝑮𝒓𝒆𝒂𝒕 𝒅𝒆𝒎𝒐𝒏 𝒆𝒎𝒑 𝑻𝒆𝒄𝒉👺🥶 channel:_
_https://whatsapp.com/channel/0029VbEAUSw6buMNGmR1ay1y_`.trim();

            await sock.sendMessage(remoteJid, { text: formattedOutput }, { quoted: msg });

        } catch (error) {
            console.error('Error executing command:', error);
            await sock.sendMessage(remoteJid, { text: '⚠️ An error occurred while running the command.' }, { quoted: msg });
        }
    }
};
