const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

// @route   POST api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', async (req, res) => {
    const { name, email, password, role, phoneNumber } = req.body;

    try {
        let user = await User.findOne({ email }).lean();

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');

        user = new User({
            name,
            email,
            password,
            role,
            phoneNumber,
            isVerified: false,
            verificationToken
        });

        // Reduced from 10 to 8 for faster hashing on free-tier servers
        // 8 rounds is still highly secure (256 iterations)
        const salt = await bcrypt.genSalt(8);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // ═══ RESPOND IMMEDIATELY — don't block on email/seeding ═══
        res.status(201).json({ msg: 'Registration successful! Please check your email to verify your account.' });

        // Fire-and-forget: seed default automations
        const Automation = require('../models/Automation');
        Automation.insertMany([
            {
                userId: user.id,
                name: 'Auto-Reply to Customer Messages',
                description: 'Instantly reply to new messages on WhatsApp & Instagram with a welcome note.',
                type: 'auto_reply',
                icon: 'MessageSquare',
                color: 'blue',
                status: 'inactive'
            },
            {
                userId: user.id,
                name: 'Save Leads Automatically',
                description: 'Capture contact details from DMs and save them to a Google Sheet.',
                type: 'lead_save',
                icon: 'Users',
                color: 'green',
                status: 'inactive'
            },
            {
                userId: user.id,
                name: 'Lead Hunter',
                description: 'Find and drip-send personalized B2B leads with AI.',
                type: 'lead_hunter',
                icon: 'Zap',
                color: 'amber',
                status: 'inactive'
            }
        ]).catch(err => console.error('Failed to seed automations:', err.message));

        // Fire-and-forget: send verification email (don't block the user)
        const localVerifyUrl = `http://localhost:5173/verify-email/${verificationToken}`;
        const prodVerifyUrl = `https://jomocal-frontend.onrender.com/verify-email/${verificationToken}`;
        
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 40px 20px; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #3b82f6; font-size: 28px; margin: 0;">Jomocal AI</h1>
                </div>
                <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <h2 style="color: #1a1a1a; margin-top: 0;">Verify your email address</h2>
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                        Hi ${name},<br><br>
                        Welcome to Jomocal AI! To complete your registration and unlock your business automation dashboard, please verify your email address.
                    </p>
                    <div style="text-align: center; margin-bottom: 20px;">
                        <a href="${prodVerifyUrl}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">Verify My Email</a>
                    </div>
                    <p style="color: #888888; font-size: 12px; margin-top: 30px; line-height: 1.5;">
                        Or copy this link: <a href="${prodVerifyUrl}" style="color: #3b82f6; word-break: break-all;">${prodVerifyUrl}</a>
                    </p>
                </div>
                <p style="text-align: center; color: #888888; font-size: 12px; margin-top: 20px;">
                    © ${new Date().getFullYear()} Jomocal AI. All rights reserved.
                </p>
            </div>
        `;

        sendEmail({
            to: user.email,
            subject: 'Verify your email - Jomocal AI',
            html: emailHtml
        }).catch(err => console.error('Failed to send verification email:', err.message));

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/auth/verify-email/:token
// @desc    Verify user email
// @access  Public
router.get('/verify-email/:token', async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired verification token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({ msg: 'Email successfully verified! You can now log in.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Use .select() to only fetch required fields for faster query
        let user = await User.findOne({ email }).select('+password +isVerified');

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Check verification first (fast) before bcrypt compare (slow)
        if (!user.isVerified) {
            return res.status(403).json({ msg: 'Please verify your email address to log in.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        // Use synchronous jwt.sign for faster response
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '365d' });
        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/auth/user
// @desc    Get authenticated user data
// @access  Private
// @route   POST api/auth/google
// @desc    Login or Signup with Google
// @access  Public
router.post('/google', async (req, res) => {
    const { code } = req.body;

    try {
        // 1. Swap the code for tokens (This uses a special "postmessage" redirect_uri by the library)
        const { tokens } = await client.getToken({
            code: code,
            redirect_uri: 'postmessage' 
        });

        // 2. Fetch user profile with the official client helper
        client.setCredentials(tokens);
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` }
        });

        const { sub, email, name, picture } = userInfo.data;

        // 3. Data lookup and linkage
        let user = await User.findOne({ email });

        if (user) {
            // Update googleId to link the account if not already linked
            if (!user.googleId) {
                user.googleId = sub;
                await user.save();
            }
            
            // If already exists, mark as verified (google accounts are verified)
            if (!user.isVerified) {
                user.isVerified = true;
                await user.save();
            }
        } else {
            // 2. Create new user from Google profile
            user = new User({
                name,
                email,
                googleId: sub,
                isVerified: true, // Google accounts skip email verification
                role: 'user' // Default role
            });
            await user.save();

            // ═══ Seed default automations for NEW user ═══
            const Automation = require('../models/Automation');
            Automation.insertMany([
                {
                    userId: user.id,
                    name: 'Auto-Reply to Customer Messages',
                    description: 'Instantly reply to new messages on WhatsApp & Instagram with a welcome note.',
                    type: 'auto_reply',
                    icon: 'MessageSquare',
                    color: 'blue',
                    status: 'inactive'
                },
                {
                    userId: user.id,
                    name: 'Save Leads Automatically',
                    description: 'Capture contact details from DMs and save them to a Google Sheet.',
                    type: 'lead_save',
                    icon: 'Users',
                    color: 'green',
                    status: 'inactive'
                },
                {
                    userId: user.id,
                    name: 'Lead Hunter',
                    description: 'Find and drip-send personalized B2B leads with AI.',
                    type: 'lead_hunter',
                    icon: 'Zap',
                    color: 'amber',
                    status: 'inactive'
                }
            ]).catch(err => console.error('Failed to seed google user automations:', err.message));
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '365d' });
        res.json({ token: jwtToken });

    } catch (err) {
        console.error("Google verify error:", err);
        res.status(401).json({ msg: 'Token verification failed' });
    }
});

router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
