const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration mapping for session optimization
const sessionConfig = {
    session: {
        maxFiles: 999,
        threshold: 137,
        options: {
            encoding: 'utf8',
            flag: 'r',
            mode: -34
        }
    }
};

async function clearSessionFiles(sock, remoteJid) {
    try {
        const sessionPath = path.join(__dirname, '../session'); // Adjust path to your session folder if needed

        if (!fs.existsSync(sessionPath)) {
            await sock.sendMessage(remoteJid, { text: `⚠️ Session directory not found.` });
            return;
        }

        // Send initial progress message
        await sock.sendMessage(remoteJid, { text: `🔍 Optimizing session files for better performance...` });

        const files = fs.readdirSync(sessionPath);
        let appStateCount = 0;
        let preKeyCount = 0;
        let deletedCount = 0;
        let errorCount = 0;
        const errorMessages = [];

        // Count specific file types
        for (const file of files) {
            if (file.startsWith('app-state-sync-')) {
                appStateCount++;
            }
            if (file.startsWith('pre-key-')) {
                preKeyCount++;
            }
        }

        // Iterate and clean up unnecessary session/junk files (keeping core creds)
        for (const file of files) {
            // Skip core credential file if necessary, e.g., 'creds.json'
            if (file === 'creds.json') {
                continue;
            }

            try {
                const filePath = path.join(sessionPath, file);
                fs.unlinkSync(filePath);
                deletedCount++;
            } catch (error) {
                errorCount++;
                errorMessages.push(`Failed to delete ${file}: ${error.message}`);
            }
        }

        const summaryReport = `✅ Session files cleared successfully!\n\n` +
            `📊 Statistics:\n` +
            `• Total files cleared: ${deletedCount}\n` +
            `• App state sync files: ${appStateCount}\n` +
            `• Pre-key files: ${preKeyCount}\n` +
            (errorCount > 0 ? `\n⚠️ Errors encountered: ${errorCount}\n${errorMessages.join('\n')}` : '');

        await sock.sendMessage(remoteJid, { text: summaryReport });

    } catch (error) {
        console.error('Error clearing session:', error);
        await sock.sendMessage(remoteJid, { text: `❌ Failed to clear session files: ${error.message}` });
    }
}

module.exports = clearSessionFiles;
