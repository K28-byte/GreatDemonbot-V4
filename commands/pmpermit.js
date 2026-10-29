// pmpermit - PREMIUM PLUGIN
const fs = require('fs');
const path = require('path');

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363317747980810@newsletter',
            newsletterName: '𝐄𝐌𝐌𝐘𝐇𝐄𝐍𝐙-𝐕1',
            serverMessageId: -1
        }
    }
};

// Paths for data storage
const pmPermitConfigPath = path.join(__dirname, '../data/pmpermit.json');
const pmUsersPath = path.join(__dirname, '../data/pmUsers.json');
const premiumPath = path.join(__dirname, '../data/premium.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Function to check if user is premium
function isPremium(userId) {
    try {
        if (!fs.existsSync(premiumPath)) {
            fs.writeFileSync(premiumPath, JSON.stringify([]));
            return false;
        }
        
        const premiumUsers = JSON.parse(fs.readFileSync(premiumPath, 'utf8'));
        const userNumber = userId.split('@')[0];
        return Array.isArray(premiumUsers) && premiumUsers.includes(userNumber);
    } catch (error) {
        console.error('Error checking premium status:', error);
        return false;
    }
}

// Initialize config files
if (!fs.existsSync(pmPermitConfigPath)) {
    fs.writeFileSync(pmPermitConfigPath, JSON.stringify({ 
        enabled: false, 
        maxCount: 3 
    }, null, 2));
}

if (!fs.existsSync(pmUsersPath)) {
    fs.writeFileSync(pmUsersPath, JSON.stringify({}, null, 2));
}

// PM Permit toggle command - PREMIUM ONLY
async function pmpermitCommand(sock, chatId, msg, args) {
    try {
        const senderId = msg.key.participant || msg.key.remoteJid;
        
        // Check if user is premium or owner
        if (!isPremium(senderId) && !msg.key.fromMe) {
            await sock.sendMessage(chatId, { 
                text: '❌ Sorry, PM Permit is a premium feature only!\n\n💎 Upgrade to premium to access this command.',
                ...channelInfo
            });
            return;
        }

        // Check if sender is owner (for configuration)
        if (!msg.key.fromMe) {
            await sock.sendMessage(chatId, { 
                text: '❌ 𝐓𝐡𝐢𝐬 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐂𝐚𝐧 𝐁𝐞 𝐔𝐬𝐞𝐝 𝐎𝐧𝐥𝐲 𝐁𝐲 𝐌𝐲 𝐎𝐰𝐧𝐞𝐫 𝐎𝐧𝐥𝐲!',
                ...channelInfo
            });
            return;
        }

        let config = JSON.parse(fs.readFileSync(pmPermitConfigPath, 'utf8'));

        if (!args || args.length === 0) {
            const status = config.enabled ? 'ON' : 'OFF';
            await sock.sendMessage(chatId, {
                text: `🛡️ *PM PERMIT STATUS* (Premium Feature)\n\nStatus: ${status}\nMax Messages: ${config.maxCount}\n\n*Commands:*\n• .pmpermit on - Enable PM permit\n• .pmpermit off - Disable PM permit\n• .pmpermit 5 on - Set 5 message limit and enable\n• .pmapprove - Approve a user\n• .pmblock - Block a user`,
                ...channelInfo
            });
            return;
        }

        const arg1 = args[0].toLowerCase();
        const arg2 = args[1] ? args[1].toLowerCase() : null;

        // Handle number + on/off format (e.g., .pmpermit 5 on)
        if (!isNaN(arg1) && arg2) {
            const count = parseInt(arg1);
            if (count > 0 && count <= 10) {
                config.maxCount = count;
                if (arg2 === 'on') {
                    config.enabled = true;
                    fs.writeFileSync(pmPermitConfigPath, JSON.stringify(config, null, 2));
                    await sock.sendMessage(chatId, {
                        text: `✅ PM Permit enabled with ${count} message limit! (Premium Feature)`,
                        ...channelInfo
                    });
                } else if (arg2 === 'off') {
                    config.enabled = false;
                    fs.writeFileSync(pmPermitConfigPath, JSON.stringify(config, null, 2));
                    await sock.sendMessage(chatId, {
                        text: `❌ PM Permit disabled (limit set to ${count})`,
                        ...channelInfo
                    });
                }
            } else {
                await sock.sendMessage(chatId, {
                    text: '❌ Message count must be between 1 and 10',
                    ...channelInfo
                });
            }
            return;
        }

        // Handle on/off
        if (arg1 === 'on') {
            config.enabled = true;
            fs.writeFileSync(pmPermitConfigPath, JSON.stringify(config, null, 2));
            await sock.sendMessage(chatId, {
                text: `✅ PM Permit enabled with ${config.maxCount} message limit! (Premium Feature)`,
                ...channelInfo
            });
        } else if (arg1 === 'off') {
            config.enabled = false;
            fs.writeFileSync(pmPermitConfigPath, JSON.stringify(config, null, 2));
            await sock.sendMessage(chatId, {
                text: `❌ PM Permit disabled`,
                ...channelInfo
            });
        } else if (!isNaN(arg1)) {
            const count = parseInt(arg1);
            if (count > 0 && count <= 10) {
                config.maxCount = count;
                fs.writeFileSync(pmPermitConfigPath, JSON.stringify(config, null, 2));
                await sock.sendMessage(chatId, {
                    text: `✅ PM Permit message limit set to ${count}`,
                    ...channelInfo
                });
            } else {
                await sock.sendMessage(chatId, {
                    text: '❌ Message count must be between 1 and 10',
                    ...channelInfo
                });
            }
        } else {
            await sock.sendMessage(chatId, {
                text: '❌ Invalid command!\n\n*Usage:*\n.pmpermit on/off\n.pmpermit [number] on/off\n.pmpermit [number]',
                ...channelInfo
            });
        }

    } catch (error) {
        console.error('Error in pmpermit command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error managing PM permit: ' + error.message,
            ...channelInfo
        });
    }
}

// PM Approve command - PREMIUM ONLY
async function pmapproveCommand(sock, chatId, msg, args) {
    try {
        const senderId = msg.key.participant || msg.key.remoteJid;
        
        if (!isPremium(senderId) && !msg.key.fromMe) {
            await sock.sendMessage(chatId, { 
                text: '❌ Sorry, PM Approve is a premium feature only!\n\n💎 Upgrade to premium to access this command.',
                ...channelInfo
            });
            return;
        }

        if (!msg.key.fromMe) {
            await sock.sendMessage(chatId, { 
                text: '❌ 𝐓𝐡𝐢𝐬 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐂𝐚𝐧 𝐁𝐞 𝐔𝐬𝐞𝐝 𝐎𝐧𝐥𝐲 𝐁𝐲 𝐌𝐲 𝐎𝐰𝐧𝐞𝐫 𝐎𝐧𝐥𝐲!',
                ...channelInfo
            });
            return;
        }

        const isGroup = chatId.endsWith('@g.us');
        if (isGroup) {
            await sock.sendMessage(chatId, {
                text: '❌ This command can only be used in private chats.',
                ...channelInfo
            });
            return;
        }

        let pmUsers = JSON.parse(fs.readFileSync(pmUsersPath, 'utf8'));
        pmUsers[chatId] = { approved: true, messageCount: 0 };
        fs.writeFileSync(pmUsersPath, JSON.stringify(pmUsers, null, 2));

        await sock.sendMessage(chatId, {
            text: '✅ You have been approved! You can now message freely. (Premium Feature)',
            ...channelInfo
        });

    } catch (error) {
        console.error('Error in pmapprove command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error approving user: ' + error.message,
            ...channelInfo
        });
    }
}

// PM Block command - PREMIUM ONLY
async function pmblockCommand(sock, chatId, msg, args) {
    try {
        const senderId = msg.key.participant || msg.key.remoteJid;
        
        if (!isPremium(senderId) && !msg.key.fromMe) {
            await sock.sendMessage(chatId, { 
                text: '❌ Sorry, PM Block is a premium feature only!\n\n💎 Upgrade to premium to access this command.',
                ...channelInfo
            });
            return;
        }

        if (!msg.key.fromMe) {
            await sock.sendMessage(chatId, { 
                text: '❌ 𝐓𝐡𝐢𝐬 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐂𝐚𝐧 𝐁𝐞 𝐔𝐬𝐞𝐝 𝐎𝐧𝐥𝐲 𝐁𝐲 𝐌𝐲 𝐎𝐰𝐧𝐞𝐫 𝐎𝐧𝐥𝐲!',
                ...channelInfo
            });
            return;
        }

        const isGroup = chatId.endsWith('@g.us');
        if (isGroup) {
            await sock.sendMessage(chatId, {
                text: '❌ This command can only be used in private chats.',
                ...channelInfo
            });
            return;
        }

        await sock.updateBlockStatus(chatId, 'block');
        
        let pmUsers = JSON.parse(fs.readFileSync(pmUsersPath, 'utf8'));
        delete pmUsers[chatId];
        fs.writeFileSync(pmUsersPath, JSON.stringify(pmUsers, null, 2));

        console.log(`Blocked user: ${chatId} (Premium Feature)`);

    } catch (error) {
        console.error('Error in pmblock command:', error);
    }
}

// Handle PM permit logic - Works for premium users only
async function handlePmPermit(sock, chatId, msg, userMessage) {
    try {
        const isGroup = chatId.endsWith('@g.us');
        if (isGroup) return true;

        if (msg.key.fromMe) return true;

        const config = JSON.parse(fs.readFileSync(pmPermitConfigPath, 'utf8'));
        if (!config.enabled) return true;

        const botOwnerId = sock.user?.id || 'unknown';
        if (!isPremium(botOwnerId)) {
            return true; 
        }

        let pmUsers = JSON.parse(fs.readFileSync(pmUsersPath, 'utf8'));

        if (pmUsers[chatId] && pmUsers[chatId].approved) {
            return true;
        }

        if (!pmUsers[chatId]) {
            pmUsers[chatId] = { approved: false, messageCount: 0 };
        }

        pmUsers[chatId].messageCount++;
        const currentCount = pmUsers[chatId].messageCount;
        const remaining = config.maxCount - currentCount;

        fs.writeFileSync(pmUsersPath, JSON.stringify(pmUsers, null, 2));

        if (currentCount > config.maxCount) {
            await sock.sendMessage(chatId, {
                text: '🚫 *You have been blocked for spamming!*\n\nYou exceeded the message limit without approval. (Premium Protection)',
                ...channelInfo
            });
            
            await sock.updateBlockStatus(chatId, 'block');
            
            delete pmUsers[chatId];
            fs.writeFileSync(pmUsersPath, JSON.stringify(pmUsers, null, 2));
            
            return false;
        }

        try {
            const imagePath = path.join(__dirname, '../assets/henz.jpg');
            let messageContent;

            if (fs.existsSync(imagePath)) {
                messageContent = {
                    image: fs.readFileSync(imagePath),
                    caption: `🛡️ *PM PERMIT ACTIVATED* (Premium Feature)\n\nThank you for your message! My owner will reply shortly.\n\nYou have *${remaining}* messages left.\n\n⚠️ *Please do not spam, else you would get blocked!*\n\n_Message ${currentCount}/${config.maxCount}_\n\n💎 Protected by Premium Security`,
                    ...channelInfo
                };
            } else {
                messageContent = {
                    text: `🛡️ *PM PERMIT ACTIVATED* (Premium Feature)\n\nThank you for your message! My owner will reply shortly.\n\nYou have *${remaining}* messages left.\n\n⚠️ *Please do not spam, else you would get blocked!*\n\n_Message ${currentCount}/${config.maxCount}_\n\n💎 Protected by Premium Security`,
                    ...channelInfo
                };
            }

            await sock.sendMessage(chatId, messageContent);
        } catch (imageError) {
            await sock.sendMessage(chatId, {
                text: `🛡️ *PM PERMIT ACTIVATED* (Premium Feature)\n\nThank you for your message! My owner will reply shortly.\n\nYou have *${remaining}* messages left.\n\n⚠️ *Please do not spam, else you would get blocked!*\n\n_Message ${currentCount}/${config.maxCount}_\n\n💎 Protected by Premium Security`,
                ...channelInfo
            });
        }

        return false;

    } catch (error) {
        console.error('Error in PM permit handler:', error);
        return true;
    }
}

function isPmPermitEnabled() {
    try {
        const config = JSON.parse(fs.readFileSync(pmPermitConfigPath, 'utf8'));
        return config.enabled;
    } catch (error) {
        return false;
    }
}

module.exports = {
    pmpermitCommand,
    pmapproveCommand,
    pmblockCommand,
    handlePmPermit,
    isPmPermitEnabled
};
