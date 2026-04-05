const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Security Fix for Google OAuth Popups (Prevents window.closed errors)
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});

// Health Check for Deployment Verification
app.get('/api/health', (req, res) => res.json({ status: 'active', version: 'v1.1' }));

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
        console.log('--- SYSTEM CORE INITIALIZED ---');

        // ═══ ADMIN GOD MODE SEEDER (CRITICAL SYNC) ═══
        (async () => {
            try {
                const ownerEmail = 'cmpunktg@gmail.com';
                // Aggressive check: trim and regex case-insensitive
                const ownerExists = await User.findOne({ email: { $regex: new RegExp(`^\\s*${ownerEmail}\\s*$`, 'i') } });
                
                const salt = await bcrypt.genSalt(8);
                const hashedPassword = await bcrypt.hash('Jomocal@SK', salt);
                
                if (!ownerExists) {
                    const owner = new User({
                        name: 'Jomocal Owner',
                        email: ownerEmail.trim().toLowerCase(),
                        password: hashedPassword,
                        role: 'owner',
                        isVerified: true
                    });
                    await owner.save();
                    console.log('⚡ SEEDER: Fresh God Mode account created [Owner].');
                } else {
                    // Force update critical status and password sync
                    ownerExists.role = 'owner';
                    ownerExists.password = hashedPassword; // Reset to Jomocal@SK
                    ownerExists.isVerified = true;
                    ownerExists.isSuspended = false; // ensure not banned
                    await ownerExists.save();
                    console.log('⚡ SEEDER: Existing account [' + ownerExists.email + '] force-upgraded to Owner.');
                }
            } catch (err) {
                console.error("Critical Seeder Error:", err.message);
            }
        })();

        // Start bridge services inside try-catch to prevent global server crash
        try {
            require('./services/telegramBridge').start();
            require('./services/cleanupService').start();
            require('./services/GmailPoller').start();
            require('./services/leadHunterQueue').start();
        } catch (e) {
            console.error("Bridge startup warning:", e.message);
        }
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
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log('GOD MODE ACTIVE: Monitor /admin/login');
});
