const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Main page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Pairing page route
app.get('/pair', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Or whichever HTML file handles your pairing interface
});

// Load your pairing router logic from pair.js
const pairRouter = require('./pair');
if (typeof pairRouter === 'function') {
    app.use('/', pairRouter);
}

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
