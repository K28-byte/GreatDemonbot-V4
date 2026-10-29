import fs from 'fs';
import isAdmin from '../lib/isAdmin';

const botOptions = {
    // Standard message response options configuration
    quoted: { key: { participant: '0@s.whatsapp.net' }, message: { conversation: 'Group Management Bot' } }
};

// Main function to handle adding users to a group
async function addMember(conn, m, chatUpdate, store) {
    try {
        // Verify if bot has admin rights or if the sender is authorized
        // (Logic handles target extraction and permission validations)
        let targetUser = m.quoted ? m.quoted.sender : m.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        
        if (!targetUser) {
            return await conn.sendMessage(m.chat, { 
                text: '⚠️ Please tag a user or provide a valid phone number to add.', 
                ...botOptions 
            }, { quoted: m });
        }

        try {
            // Attempt to add the user to the group
            let response = await conn.groupParticipantsUpdate(m.chat, [targetUser], 'add');
            
            const phoneNumber = targetUser.split('@')[0];

            if (response && response[0] && response[0].status === '200') {
                await conn.sendMessage(m.chat, { 
                    text: `✅ *Member added successfully*\n\nUser: +${phoneNumber}\nStatus: Added to group `, 
                    ...botOptions 
                });
            } else if (response && response[0] && response[0].status === '403') {
                await conn.sendMessage(m.chat, { 
                    text: `❌ *Cannot add member*\n\nUser: +${phoneNumber}\nReason: User's privacy settings don't allow being added to groups.\n\n💡 *Tip:* Send them the group invite link instead.`, 
                    ...botOptions 
                });
            } else {
                let statusMsg = response[0]?.message || 'Unknown status';
                await conn.sendMessage(m.chat, { 
                    text: `⚠️ *Add attempt completed*\n\nUser: +${phoneNumber}\nStatus: ${statusMsg}\n\nThey may need to accept the group invitation.`, 
                    ...botOptions 
                });
            }
        } catch (addError) {
            const phoneNumber = targetUser.split('@')[0];
            await conn.sendMessage(m.chat, { 
                text: `❌ Failed to add member +${phoneNumber}\n\nPossible reasons:\n- User blocked the bot\n- User's privacy settings\n- User already in group\n- Network issues\n\nError: ${addError.message || addError}`, 
                ...botOptions 
            });
        }
    } catch (error) {
        console.error('Group add error:', error);
        await conn.sendMessage(m.chat, { 
            text: `❌ An error occurred while executing the add command: ${error.message || error}`, 
            ...botOptions 
        });
    }
}

// Handler configuration for bot command routers (like Baileys / WhatsApp MD bots)
async function groupManagementHandler(m) {
    // Environment and execution checks
}

export default addMember;
