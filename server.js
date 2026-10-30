const express = require('express');
const path = require('path');
const app = express();

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets from the root directory
app.use(express.static(__dirname));

// Route 1: Serve your dashboard/pairing HTML interface on the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route 2: Explicit fallback for the /pair route if requested
app.get('/pair', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route 3: Load your pairing logic module (pair.js) which handles the /code endpoint
try {
    const pairRouter = require('./pair');
    if (typeof pairRouter === 'function' || (pairRouter && typeof pairRouter.use === 'function')) {
        app.use('/', pairRouter);
        console.log("✅ Pairing module (pair.js) loaded successfully.");
    } else {
        console.log("⚠️ pair.js was found, but it is not a valid Express router/function.");
    }
} catch (err) {
    console.log("⚠️ Notice: pair.js was not found in the root directory. Make sure it's uploaded.");
}

// Start the server using Render's dynamic port or default to 10000
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Demon Emperor server is online and listening on port ${PORT}`);
});
