const fs = require('fs');
const path = require('path');

// Define path for storing member message statistics database
const dbPath = path.join(__dirname, '..', 'database', 'topmembers.json');

// Helper function to read database
function readDatabase() {
    if (fs.existsSync(dbPath)) {
        try {
            const data = fs.readFileSync(dbPath, 'utf8');
            return JSON.parse(data);
        } catch (e) {
            return {};
        }
    }
    return {};
}

// Helper function to write/update database
function saveDatabase(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Function to track and increment message counts for users in chats
function trackMemberActivity(m) {
    const db = readDatabase();
    const chatId = m.chat || m.remoteJid;
    const senderId = m.sender || m.participant;

    if (!chatId || !senderId) return;

    if (!db[chatId]) {
        db[chatId] = {};
    }

    if (!db[chatId][senderId]) {
        db[chatId][senderId] = 0;
    }

    db[chatId][senderId] += 1;
    saveDatabase(db);
}

// Function to generate and display the leaderboard
async function topMembersCommand(conn, mek, m, { from, reply }) {
    const db = readDatabase();
    const chatData = db[from] || {};

    // Sort members by message count in descending order
    const sortedMembers = Object.entries(chatData)
        .sort(([, aCount], [, bCount]) => bCount - aCount)
        .slice(0, 10); // Top 10 members

    if (sortedMembers.length === 0) {
        return reply('📊 *No message activity recorded yet in this chat.*');
    }

    let leaderboardText = '🏆 *Top Active Members Leaderboard* 🏆\n\n';
    
    sortedMembers.forEach(([userId, count], index) => {
        const username = userId.split('@')[0];
        leaderboardText += `${index + 1}. @${username} — ${count} messages\n`;
    });

    // Send leaderboard message with proper mentions
    return conn.sendMessage(from, {
        text: leaderboardText,
        mentions: sortedMembers.map(([userId]) => userId)
    }, { quoted: mek });
}

module.exports = {
    track: trackMemberActivity,
    topmembers: topMembersCommand
};
