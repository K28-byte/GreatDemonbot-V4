module.exports = async (m, client, args) => {
    try {
        const text = args.join(' ');

        if (!text) {
            return await client.sendMessage(m.chat, { 
                text: '❌ Please provide text for the ATTP (Text to Sticker) command!\n\n*Example:* `.attp Demon Emperor`' 
            }, { quoted: m });
        }

        // Inform user that the sticker is being generated
        await client.sendMessage(m.chat, { text: '⏳ *Demon Emperor* is generating your ATTP sticker...' }, { quoted: m });

        // ATTP API endpoint (generates a rainbow/animated text sticker from text)
        const attpUrl = `https://api.lolhuman.xyz/api/attp?apikey=GataDios&text=${encodeURIComponent(text)}`;

        // Send the generated sticker directly
        await client.sendMessage(m.chat, { 
            sticker: { url: attpUrl } 
        }, { quoted: m });

    } catch (error) {
        console.error('Error in attp command:', error);
        await client.sendMessage(m.chat, { text: '❌ Failed to generate ATTP sticker. Please try again later.' }, { quoted: m });
    }
};
