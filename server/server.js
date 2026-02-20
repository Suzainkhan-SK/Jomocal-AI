const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'https://jomocal-frontend.onrender.com',
        'http://localhost:5173', // Vite default dev server
        'http://localhost:3000'  // Alternative dev port
    ],
    credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected');

        // Start the Telegram Polling Bridge for local development
        const telegramBridge = require('./services/telegramBridge');
        telegramBridge.start();

        // Start cleanup service
        const cleanupService = require('./services/cleanupService');
        cleanupService.start();

        // Start Gmail Poller
        const gmailPoller = require('./services/GmailPoller');
        gmailPoller.start();
    })
    .catch(err => console.log('MongoDB Connection Error:', err));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/automations', require('./routes/automations'));
app.use('/api/integrations', require('./routes/integrations'));
app.use('/api/oauth', require('./routes/oauth'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/settings', require('./routes/settings'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
