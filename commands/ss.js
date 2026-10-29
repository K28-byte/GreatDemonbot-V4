const fetch = require('node-fetch');

async function iJMj72(client, message, args, extra) {
    // Check if the command was invoked without arguments (e.g. just ".ss")
    if (!args || args.length === 0) {
        return client.sendMessage(message.from, {
            text: `*SCREENSHOT*\n\n*.ss <url>*\n*.ssweb <url>*\n*.screenshot <url>*\n\nTake a screenshot of any website\n\nExample:\n.ss https://google.com\n.ssweb https://google.com\n.screenshot https://google.com`
        });
    }

    try {
        // Extract target URL from arguments
        const targetUrl = args[0];
        
        // Construct the screenshot API URL
        const apiUrl = `https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(targetUrl)}&theme=light&device=desktop`;

        // Fetch the screenshot from the endpoint
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        // Get the image buffer
        const imageBuffer = await response.buffer();

        // Send the screenshot image back to the user
        await client.sendMessage(message.from, {
            image: imageBuffer,
            caption: `Screenshot of: ${targetUrl}`
        }, { quoted: message });

    } catch (error) {
        console.error("Error capturing screenshot:", error);
        await client.sendMessage(message.from, {
            text: "Failed to take a screenshot. Please try again later or check the URL."
        }, { quoted: message });
    }
}

module.exports = {
    ss: iJMj72
};
