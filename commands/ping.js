const os = require('os');

module.exports = {
    name: 'ping',
    alias: ['p'],
    category: 'main',
    desc: 'Check bot latency and system status',
    async execute(sock, m, { text, reply }) {
        try {
            const startTime = Date.now();
            
            // Send initial ping response message
            const initialMsg = await reply('Pinging...');
            
            const endTime = Date.now();
            const latency = endTime - startTime;

            // Gather system uptime & memory metrics
            const uptimeSeconds = process.uptime();
            const hours = Math.floor(uptimeSeconds / 3600);
            const minutes = Math.floor((uptimeSeconds % 3600) / 60);
            const seconds = Math.floor(uptimeSeconds % 60);
            const uptimeFormatted = `${hours}h ${minutes}m ${seconds}s`;

            const totalMem = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
            const freeMem = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);

            // Construct branded output for the Demon Emperor
            let responseText = `┌───⊷ *DEMON EMPEROR* \n`;
            responseText += `▢ *Latency:* ${latency} ms\n`;
            responseText += `▢ *Uptime:* ${uptimeFormatted}\n`;
            responseText += `▢ *RAM Free:* ${freeMem} GB / ${totalMem} GB\n`;
            responseText += `▢ *Platform:* ${os.platform()} (${os.arch()})\n`;
            responseText += `└──────────────`;

            // Send results
            await sock.sendMessage(m.chat, { text: responseText }, { quoted: m });

        } catch (error) {
            console.error('Error executing ping command:', error);
            await reply('An error occurred while checking the ping.');
        }
    }
};
