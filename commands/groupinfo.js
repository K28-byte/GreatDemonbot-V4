let handler = async (m, { conn, participants, groupMetadata }) => {
    try {
        // Fetch group metadata
        const metadata = groupMetadata || await conn.groupMetadata(m.chat);
        
        // Extract group details
        const groupId = metadata.id;
        const groupName = metadata.subject;
        const groupMembers = metadata.participants.length;
        const groupOwner = metadata.owner || metadata.participants.find(p => p.admin === 'superadmin')?.id || m.chat.split('-')[0] + '@s.whatsapp.net';
        
        // Format admins list
        const admins = metadata.participants.filter(p => p.admin);
        const adminList = admins.map((admin, i) => `${i + 1}. @${admin.id.split('@')[0]}`).join('\n');
        
        // Format group description
        const groupDesc = metadata.desc ? metadata.desc.toString() : 'No Description';

        // Construct the output message layout
        let infoMessage = `
┌── *𝐆𝐑𝐎𝐔𝐏 𝐈𝐍𝐅𝐎* 
▢ *♻️ 𝐆𝐫𝐨𝐮𝐩 𝐈𝐃:*
   • ${groupId}
▢ *🔖 𝐆𝐫𝐨𝐮𝐩 𝐍𝐚𝐦𝐞* : 
   • ${groupName}
▢ *👥 𝐆𝐫𝐨𝐮𝐩 𝐌𝐞𝐦𝐛𝐞𝐫𝐬* :
   • ${groupMembers}
▢ *🤿 𝐆𝐫𝐨𝐮𝐩 𝐎𝐰𝐧𝐞𝐫:*
   • @${groupOwner.split('@')[0]}
▢ *🕵🏻‍♂️ 𝐆𝐫𝐨𝐮𝐩 𝐀𝐝𝐦𝐢𝐧𝐬:*
${adminList}

▢ *📌 𝐆𝐫𝐨𝐮𝐩 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧* :
   • ${groupDesc}
`.trim();

        // Send message with mentions
        await conn.sendMessage(m.chat, { 
            text: infoMessage, 
            mentions: [...admins.map(a => a.id), groupOwner] 
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, 'An error occurred while fetching group information.', m);
    }
};

handler.help = ['infogroup', 'groupinfo'];
handler.tags = ['group'];
handler.command = /^(groupinfo|infogroup|ginfo)$/i;
handler.group = true;

export default handler;
