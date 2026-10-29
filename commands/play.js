const yts = require('yt-search');
const axios = require('axios');

async function handleYouTubeDownload(m, q, client) {
    if (!q) {
        return await client.sendMessage(m.chat, { text: 'Please provide a song name or YouTube link to download!' }, { quoted: m });
    }

    try {
        await client.sendMessage(m.chat, { text: 'Searching for your audio...' }, { quoted: m });

        // Search YouTube for the video
        const searchResults = await yts(q);
        const video = searchResults.videos[0];

        if (!video) {
            return await client.sendMessage(m.chat, { text: 'No results found for your search.' }, { quoted: m });
        }

        const videoUrl = video.url;
        const videoTitle = video.title;

        // List of public fallback API endpoints for downloading ytmp3
        const apis = [
            `https://api.davidcyriltech.my.id/youtube/mp3?url=${videoUrl}`,
            `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${videoUrl}`,
            `https://api.giftedtech.co.ke/api/download/ytmp3?apikey=gifted&url=${videoUrl}`
        ];

        let downloadData = null;

        // Try APIs sequentially until one succeeds
        for (const apiUrl of apis) {
            try {
                const response = await axios.get(apiUrl, { timeout: 15000 });
                // Adjust depending on which API structure matches your response
                if (response.data && (response.data.success || response.data.status || response.data.result)) {
                    downloadData = response.data.result || response.data.data || response.data;
                    break;
                }
            } catch (err) {
                console.log(`API failed, trying next...`);
            }
        }

        if (!downloadData || (!downloadData.download && !downloadData.dl && !downloadData.audio)) {
            return await client.sendMessage(m.chat, { text: 'All download APIs failed. Please try again later.' }, { quoted: m });
        }

        // Extract final audio download link
        const audioUrl = downloadData.download || downloadData.dl || downloadData.audio;

        // Send the audio file to chat
        await client.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: 'audio/mp4',
            fileName: `${videoTitle}.mp3`,
            ptt: false
        }, { quoted: m });

    } catch (error) {
        console.error('YouTube Downloader Error:', error);
        await client.sendMessage(m.chat, { text: 'An error occurred while processing your download.' }, { quoted: m });
    }
}

module.exports = handleYouTubeDownload;
