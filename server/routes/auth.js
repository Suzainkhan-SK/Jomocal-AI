const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

// @route   POST api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');

        user = new User({
            name,
            email,
            password,
            role,
            isVerified: false,
            verificationToken
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Seed default automations
        const defaultAutomations = [
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
        ];
        const Automation = require('../models/Automation');
        await Automation.insertMany(defaultAutomations);

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
                        Welcome to Jomocal AI! To complete your registration and unlock your business automation dashboard, please verify your email address using either link below:
                    </p>
                    <div style="text-align: center; margin-bottom: 20px;">
                        <p style="color: #4a4a4a; font-size: 14px; font-weight: bold; margin-bottom: 10px;">For Local Testing:</p>
                        <a href="${localVerifyUrl}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px; transition: background-color 0.3s;">Verify (Localhost)</a>
                    </div>
                    <div style="text-align: center; margin-bottom: 20px;">
                        <p style="color: #4a4a4a; font-size: 14px; font-weight: bold; margin-bottom: 10px;">For Deployed Production:</p>
                        <a href="${prodVerifyUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px; transition: background-color 0.3s;">Verify (Production)</a>
                    </div>
                    <p style="color: #888888; font-size: 12px; margin-top: 30px; line-height: 1.5;">
                        <strong>Localhost link:</strong><br><a href="${localVerifyUrl}" style="color: #3b82f6; word-break: break-all;">${localVerifyUrl}</a>
                        <br><br>
                        <strong>Production link:</strong><br><a href="${prodVerifyUrl}" style="color: #10b981; word-break: break-all;">${prodVerifyUrl}</a>
                    </p>
                </div>
                <p style="text-align: center; color: #888888; font-size: 12px; margin-top: 20px;">
                    © ${new Date().getFullYear()} Jomocal AI. All rights reserved.
                </p>
            </div>
        `;

        await sendEmail({
            to: user.email,
            subject: 'Verify your email - Jomocal AI',
            html: emailHtml
        });

        res.status(201).json({ msg: 'Registration successful! Please check your email to verify your account.' });

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
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        
        if (!user.isVerified) {
            return res.status(403).json({ msg: 'Please verify your email address to log in.' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '365d' }, // Professional business - 1 year token
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/auth/user
// @desc    Get authenticated user data
// @access  Private
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
