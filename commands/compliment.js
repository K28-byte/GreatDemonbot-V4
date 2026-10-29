const fs = require('fs');
const path = require('path');

/**
 * Cleanup Utility Module
 * Periodically scans a specified directory and removes files to free up space or clear session caches.
 */
class CleanupService {
    constructor(targetDirectory, intervalMinutes = 5) {
        this.targetDirectory = targetDirectory;
        this.intervalMinutes = intervalMinutes;
        this.timer = null;
    }

    /**
     * Starts the background cleanup interval.
     */
    start() {
        if (this.timer) return;
        
        const intervalMs = this.intervalMinutes * 60 * 1000;
        this.timer = setInterval(() => {
            this.cleanDirectory();
        }, intervalMs);

        console.log(`[CleanupService] Started. Cleaning "${this.targetDirectory}" every ${this.intervalMinutes} minutes.`);
    }

    /**
     * Stops the background cleanup interval.
     */
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            console.log('[CleanupService] Stopped.');
        }
    }

    /**
     * Executes the file removal process inside the target directory.
     */
    cleanDirectory() {
        try {
            if (!fs.existsSync(this.targetDirectory)) {
                return { success: false, message: 'Directory does not exist.' };
            }

            const files = fs.readdirSync(this.targetDirectory);
            let removedCount = 0;

            for (const file of files) {
                const filePath = path.join(this.targetDirectory, file);
                const stats = fs.statSync(filePath);

                // If it's a file, delete it
                if (stats.isFile()) {
                    fs.unlinkSync(filePath);
                    removedCount++;
                }
            }

            console.log(`[CleanupService] Successfully removed ${removedCount} temporary files.`);
            return { success: true, removedCount };
        } catch (error) {
            console.error('[CleanupService] Error during cleanup execution:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = CleanupService;
