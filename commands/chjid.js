module.exports = {
    name: 'chjid',
    aliases: ['channelinfo', 'getch'],
    description: 'Extracts WhatsApp channel JID, subscriber count, and details from a channel link.',

    async execute(sock, msg, args) {
        const remoteJid = msg.key.remoteJid;

        try {
            // 1. Check if a link or code was provided
            if (!args || args.length === 0) {
                const usageText = `
📺 *CHANNEL JID EXTRACTOR*

*Usage:*
`.chjid [channel_link] - Get channel details`
`.chjid [invite_code] - Get channel info`

*Example:*
`.chjid https://whatsapp.com/channel/0029VbEAUSw6buMNGmR1ay1y`
                `.trim();
                
                await sock.sendMessage(remoteJid, { text: usageText }, { quoted: msg });
                return;
            }

            let inputArg = args[0];
            let inviteCode = inputArg;

            // 2. Extract invite code if a full URL was provided
            if (inputArg.includes('whatsapp.com/channel/')) {
                const match = inputArg.match(/whatsapp\.com\/channel\/([A-Za-z0-9]+)/);
                if (match && match[1]) {
                    inviteCode = match[1];
                }
            }

            // Construct the Newsletter JID
            const channelJid = `${inviteCode}@newsletter`;

            await sock.sendMessage(remoteJid, { text: `🔍 Fetching channel details for code: \`${inviteCode}\`...` }, { quoted: msg });

            // 3. Attempt to fetch channel metadata using Baileys built-in metadata method
            let metadata = null;
            try {
                metadata = await sock.newsletterMetadata('invite', inviteCode);
            } catch (err) {
                console.log('Could not fetch full metadata, falling back to basic JID info.');
            }

            // 4. Format the output response card
            const channelName = metadata?.name || 'Unknown Channel';
            const subscribers = metadata?.subscribersCount || 'Hidden / Unavailable';
            const description = metadata?.description || 'No description available.';
            const isVerified = metadata?.verified ? 'Yes ✅' : 'No ❌';
            const creationDate = metadata?.creationTime ? new Date(metadata.creationTime * 1000).toDateString() : 'Unknown';

            const formattedOutput = `
📺 *CHANNEL INFORMATION EXTRACTED*

🆔 *Channel JID:*
\`${channelJid}\`

📝 *Channel Name:*
${channelName}

👥 *Subscribers:*
${subscribers}

📄 *Description:*
${description}

📅 *Created:*
${creationDate}

✅ *Verified:*
${isVerified}

🔗 *Channel Link:*
https://whatsapp.com/channel/${inviteCode}

_🔥 Follow the 𝑮𝒓𝒆𝒂𝒕 𝒅𝒆𝒎𝒐𝒏 𝒆𝒎𝒑 𝑻𝒆𝒄𝒉👺🥶 channel:_
_https://whatsapp.com/channel/0029VbEAUSw6buMNGmR1ay1y_
            `.trim();

            // Send the results
            await sock.sendMessage(remoteJid, { text: formattedOutput }, { quoted: msg });
            await sock.sendMessage(remoteJid, { text: `📋 *COPY CHANNEL JID:*\n\`${channelJid}\`` }, { quoted: msg });

        } catch (error) {
            console.error('Error executing chjid command:', error);
            await sock.sendMessage(remoteJid, { 
                text: '❌ Failed to extract channel info. Make sure the link is valid or the channel is public.' 
            }, { quoted: msg });
        }
    }
};
