module.exports = {
    name: 'demoninfo',
    aliases: ['dinfo', 'demoncheck'],
    description: 'Executes a secure target lookup with the signature cold Demon Emperor response.',

    async execute(sock, msg, args) {
        const remoteJid = msg.key.remoteJid;

        try {
            // Target validation
            if (!args || args.length === 0) {
                await sock.sendMessage(remoteJid, { 
                    text: '⚠️ *Usage:* `.demoninfo [target_id/username]`' 
                }, { quoted: msg });
                return;
            }

            const target = args[0];

            // Cold execution notice
            await sock.sendMessage(remoteJid, { 
                text: `❄️ Processing query for target: \`${target}\`...` 
            }, { quoted: msg });

            // Core lookup logic placeholder (hook your data retrieval here)
            const resultData = {
                id: target,
                status: 'Acquired',
                clearance: 'Restricted'
            };

            const formattedOutput = `
*╭─── 👺 𝐃𝐄𝐌𝐎𝐍 𝐄𝐌𝐏𝐄𝐑𝐎𝐑 ───*
*│ Target:* \`${resultData.id}\`
*│ Status:* ${resultData.status}
*│ Clearance:* ${resultData.clearance}
*╰─────────────────────────────*

_❄️ "The cold logic of the empire leaves no trace."_

_🔥 Follow the 𝑮𝒓𝒆𝒂𝒕 𝒅𝒆𝒎𝒐𝒏 𝒆𝒎𝒑 𝑻𝒆𝒄𝒉👺🥶 channel:_
_https://whatsapp.com/channel/0029VbEAUSw6buMNGmR1ay1y_
            `.trim();

            await sock.sendMessage(remoteJid, { text: formattedOutput }, { quoted: msg });

        } catch (error) {
            console.error('Error in demoninfo command:', error);
            await sock.sendMessage(remoteJid, { 
                text: '❄️ Target execution failed. The system remains sealed.' 
            }, { quoted: msg });
        }
    }
};
