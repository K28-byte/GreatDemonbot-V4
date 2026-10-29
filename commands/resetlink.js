const { isAdmin } = require('../lib/isAdmin');

async function l2e9kO(kXfWU4, MjoiPZK, o4kdWR0) {
    try {
        const chIDjh = await kXfWU4.groupMetadata(MjoiPZK);
        const NXOjDzj = chIDjh.participants.find(member => member.id === kXfWU4.user.id);
        
        if (!NXOjDzj || !NXOjDzj.admin) {
            await kXfWU4.sendMessage(MjoiPZK, { text: '❌ Make sure the bot is an admin!' });
            return;
        }

        const U7cTQuj = await kXfWU4.groupRevokeInvite(MjoiPZK);
        await kXfWU4.sendMessage(MjoiPZK, {
            text: `✅ Group link has been successfully reset\n\n📌 New link:\nhttps://chat.whatsapp.com/${U7cTQuj}`
        });
    } catch (error) {
        console.error('Error in reset link command:', error);
        await kXfWU4.sendMessage(MjoiPZK, { text: '❌ Failed to reset group link.' });
    }
}

module.exports = l2e9kO;
