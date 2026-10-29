
const fs = require('fs');

// Word bank for the game
const wordBank = ['python', 'javascript', 'whatsapp', 'developer', 'telegram'];

// In-memory store to track active games per chat/user
let activeGames = {};

/**
 * Starts a new word guessing game session for the chat.
 */
function startGame(conn, m, chatUpdate, store) {
    try {
        const chatId = m.chat;

        if (activeGames[chatId]) {
            return conn.sendMessage(chatId, { text: '⚠️ A game is already active in this chat! Guess a letter or wait for it to end.' });
        }

        // Pick a random word from the word bank
        const secretWord = wordBank[Math.floor(Math.random() * wordBank.length)];
        
        // Initialize the masked word progress (e.g., "_ _ _ _ _ _")
        const maskedProgress = secretWord.split('').map(() => '_');

        activeGames[chatId] = {
            word: secretWord,
            masked: maskedProgress,
            guessedLetters: [],
            wrongAttempts: 0,
            maxTries: 6
        };

        const displayProgress = maskedProgress.join(' ');

        return conn.sendMessage(chatId, { 
            text: `🎮 *Word Guessing Game Started!*\n\nWord: ${displayProgress}\n\nTries left: 6\n\nReply with a single letter to make a guess!` 
        });
    } catch (error) {
        console.error('Start game error:', error);
    }
}

/**
 * Processes a player's letter guess.
 */
function handleGuess(conn, m, chatUpdate, store) {
    try {
        const chatId = m.chat;
        const messageText = m.text ? m.text.trim().toLowerCase() : '';

        // Check if a game is active
        if (!activeGames[chatId]) {
            return; // No active game, ignore text
        }

        // Ensure the input is a single letter guess
        if (messageText.length !== 1 || !/[a-z]/.test(messageText)) {
            return;
        }

        let game = activeGames[chatId];
        const letter = messageText;

        // Check if letter was already guessed
        if (game.guessedLetters.includes(letter)) {
            return conn.sendMessage(chatId, { text: `⚠️ You already guessed "${letter}". Try another letter.` });
        }

        game.guessedLetters.push(letter);

        // Check if the letter is in the word
        if (game.word.includes(letter)) {
            // Reveal correct letters in the mask
            for (let i = 0; i < game.word.length; i++) {
                if (game.word[i] === letter) {
                    game.masked[i] = letter;
                }
            }

            const currentProgress = game.masked.join(' ');

            // Check if the user has won (no more underscores)
            if (!game.masked.includes('_')) {
                delete activeGames[chatId];
                return conn.sendMessage(chatId, { text: `🎉 Congratulations! You successfully guessed the word: *${game.word}*` });
            }

            return conn.sendMessage(chatId, { text: `✅ Good guess!\n\nWord: ${currentProgress}` });
        } else {
            // Wrong guess increment
            game.wrongAttempts += 1;
            const remainingTries = game.maxTries - game.wrongAttempts;

            if (game.wrongAttempts >= game.maxTries) {
                delete activeGames[chatId];
                return conn.sendMessage(chatId, { text: `❌ Game over! You ran out of tries.\n\nThe word was: *${game.word}*` });
            }

            return conn.sendMessage(chatId, { text: `❌ Wrong guess! You have ${remainingTries} tries left.` });
        }
    } catch (error) {
        console.error('Handle guess error:', error);
    }
}

module.exports = {
    startGame,
    handleGuess
};
