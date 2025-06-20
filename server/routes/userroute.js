import express from 'express';
import { db } from '../db.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { authenticateToken } from '../middleware/authenticateToken.js';

dotenv.config();
const router = express.Router();

// Nodemailer config
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
    }
});

// REGISTER
router.post('/register', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    try {
        const usersCollection = db.collection('users');
        const existing = await usersCollection.findOne({ email });

        if (existing) {
            return res.json({ success: false, message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await usersCollection.insertOne({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            created_date: new Date()
        });

        return res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return res.json({ loginStatus: false, error: "Wrong email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ loginStatus: false, error: "Wrong email or password" });
        }

        return res.json({ loginStatus: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ loginStatus: false, error: 'Internal server error' });
    }
});

// LOGOUT (dummy since token system not implemented)
router.post("/logout", (req, res) => {
    res.status(200).json({ success: true, message: "Logout successful" });
});

// Password Reset Token Generator
const generateResetToken = () => Math.random().toString(36).substr(2);

// Insert Reset Token into DB
const insertResetToken = async (email, resetToken, expiryTime) => {
    await db.collection('tokens').insertOne({
        email,
        reset_token: resetToken,
        expiry_time: expiryTime
    });
};

// SEND RESET TOKEN
router.post('/send-reset-token', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const resetToken = generateResetToken();
        const expiryTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await insertResetToken(email, resetToken, expiryTime);

        const mailOptions = {
            from: process.env.MY_EMAIL,
            to: email,
            subject: 'Password Reset Link',
            text: `Click the following link to reset your password: http://localhost:3000/reset-password/${resetToken}. Use within an hour.`
        };

        await transporter.sendMail(mailOptions);
        return res.json({ success: true, message: 'Reset link sent to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// VERIFY RESET TOKEN
const verifyResetToken = async (resetToken) => {
    const tokenDoc = await db.collection('tokens').findOne({
        reset_token: resetToken,
        expiry_time: { $gt: new Date() }
    });
    return tokenDoc ? tokenDoc : null;
};

// RESET PASSWORD
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const tokenDoc = await verifyResetToken(token);
        if (!tokenDoc) {
            return res.status(400).json({ success: false, error: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.collection('users').updateOne(
            { email: tokenDoc.email },
            { $set: { password: hashedPassword } }
        );

        return res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// CHANGE PASSWORD
router.post('/change-password/:email', authenticateToken, async (req, res) => {
    const { email } = req.params;
    const { newPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const result = await db.collection('users').updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        return res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// GET ACCOUNT DETAILS
router.get('/account/:userEmail', async (req, res) => {
    const { userEmail } = req.params;
    try {
        const user = await db.collection('users').findOne({ userEmail }, { projection: { password: 0 } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export { router as userRouter };
