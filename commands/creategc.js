const moment = require('moment-timezone');

/**
 * Handles group creation commands for a WhatsApp bot.
 * Creates a group, adds initial members (if provided), generates an invite link, 
 * sets a description, and sends a formatted notification card.
 * 
 * @param {Object} client - The WhatsApp bot client (e.g., Baileys sock)
 * @param {Object} message - The incoming message object
 * @param {Object} chatData - Data containing group name, timezone, and initial participants
 */
async function handleGroupCreation(client, message, chatData) {
    try {
        // 1. Prepare initial participants (defaults to empty array if none provided)
        // chatData.participants should be an array of WhatsApp user JIDs (e.g., ['2348012345678@s.whatsapp.net'])
        const participants = chatData.participants || [];

        // 2. Create the WhatsApp group chat with a name and participants
        const groupMetadata = await client.groupCreate(chatData.name, participants);
        
        // 3. Set a group description (optional)
        if (chatData.description) {
            await client.groupUpdateDescription(groupMetadata.id, chatData.description);
        }

        // 4. Generate an invite link for the newly created group
        const inviteCode = await client.groupInviteCode(groupMetadata.id);
        
        // 5. Format the creation timestamp using timezone
        const creationTime = moment(groupMetadata.creation * 1000)
            .tz(chatData.timezone || 'Africa/Lagos')
            .format('YYYY-MM-DD HH:mm:ss');

        // 6. Construct the output notification message card
        const responseMessage = `     「 *Group Created Successfully* 」

▸ *Name* : ${chatData.name}
▸ *Owner* : @${groupMetadata.owner.split('@')[0]}
▸ *Creation* : ${creationTime}

*Group Link:*
https://chat.whatsapp.com/${inviteCode}
        `;

        // 7. Send the formatted message back to the chat, mentioning the owner
        await client.sendMessage(message.from, {
            text: responseMessage,
            mentions: [groupMetadata.owner],
        }, { quoted: message });

    } catch (createError) {
        console.error('Error creating group chat:', createError);
        await client.sendMessage(message.from, {
            text: '❌ Failed to create the group chat. Please check if I have admin privileges or if the participant numbers are valid.',
        }, { quoted: message });
    }
}

module.exports = {
    handleGroupCreation
};
