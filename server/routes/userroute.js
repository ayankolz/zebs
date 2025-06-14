import express from 'express';
import { con } from '../utils/db.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();
import { authenticateToken } from '../middleware/authenticateToken.js';


// POST /auth/register
router.post('/register', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    try {
        // Check if user exists
        const [existing] = await con.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.json({ success: false, message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        await con.promise().query(
            'INSERT INTO users (firstname, lastname, email, password, created_date) VALUES (?, ?, ?, ?, NOW())',
            [firstname, lastname, email, hashedPassword]
        );

        return res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});



router.post("/Login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Retrieve the hashed password from the database based on the email
    const sqlSelect = 'SELECT email, password FROM users WHERE email = ?';

    con.query(sqlSelect, [email], (error, results) => {
        if (error) {
            console.error('Error retrieving user from database:', error);
            return res.status(500).json({ loginStatus: false, error: 'Internal server error' });
        }

        if (results.length === 0) {
            // User not found
            return res.json({ loginStatus: false, error: "Wrong email or password" });
        }

        const user = results[0];
        const hashedPassword = user.password;

        // Compare the entered password with the hashed password from the database
        bcrypt.compare(password, hashedPassword, async (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ loginStatus: false, error: 'Internal server error' });
            }

            if (!isMatch) {
                // Passwords don't match
                return res.json({ loginStatus: false, error: "Wrong email or password" });
            }

                // Return successful login response with access token and refresh token
                const responseData = {
                    loginStatus: true,
                };
                res.json(responseData); // Send the response only once
            });
        });
    });


router.post("/logout", async (req, res) => {
    try {
        // Perform any server-side cleanup here if needed (optional)

        return res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ success: false, message: "Failed to logout. Please try again later." });
    }
});


const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
    }
});

const generateResetToken = () => {
    return Math.random().toString(36).substr(2); // Example token format: "n1fw8d"
};

const insertResetToken = (email, resetToken, expiryTime) => {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO tokens (email, reset_token, expiry_time) VALUES (?, ?, ?)";
        const values = [email, resetToken, expiryTime];
        con.query(query, values, (error, results) => {
            if (error) {
                console.error('Error inserting reset token into database:', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

router.post('/send-reset-token', async (req, res) => {
    try {
        const { email } = req.body;

        // Query the database to get the user's email
        const sql = "SELECT email FROM users WHERE email = ?";
        con.query(sql, [email], async (error, results) => {
            if (error) {
                console.error('Error querying database:', error);
                return res.status(500).json({ success: false, error: 'Database query error' });
            }

            // If no user with the given email is found in the database
            if (results.length === 0) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            // User email found, proceed to send reset link email
            const resetToken = generateResetToken(); // Generate reset token
            const expiryTime = new Date(); // Set expiry time for the reset token (e.g., current time + 1 hour)
            expiryTime.setHours(expiryTime.getHours() + 1); // Example: Expiry time is 1 hour from now
            await insertResetToken(email, resetToken, expiryTime); // Insert reset token into the database

            // Email content
            const mailOptions = {
                from: process.env.MY_EMAIL,
                to: email,
                subject: 'Password Reset Link',
                text: `Click the following link to reset your password: http://localhost:3000/reset-password/${resetToken}. use within an hour`
            };

            // Send the reset link email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ success: false, error: 'Failed to send reset link email' });
                } else {
                    return res.json({ success: true, message: 'Reset link sent to your email' });
                }
            });
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

const verifyResetToken = async (resetToken) => {
    return new Promise((resolve, reject) => {
        // Query the database to check if the reset token exists and if it's valid
        const sql = "SELECT * FROM tokens WHERE reset_token = ? AND expiry_time > NOW()";
        con.query(sql, [resetToken], (error, results) => {
            if (error) {
                console.error('Error verifying reset token:', error);
                return reject(error); // Reject the promise if there's an error
            }
            // If a matching token is found and it's not expired, resolve with true
            if (results.length > 0) {
                return resolve(true);
            } else {
                // If no matching token is found or it's expired, resolve with false
                return resolve(false);
            }
        });
    });
};

router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        
        // Verify the reset token against the stored tokens in the database
        const isValidToken = await verifyResetToken(token);
        
        if (isValidToken) {
            // Hash the new password before storing it in the database
            bcrypt.hash(newPassword, 10, async (err, hashedPassword) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    return res.status(500).json({ success: false, error: 'Internal server error' });
                }
                
            // Update the password associated with the email corresponding to the reset token in the database
            const sql = `
                UPDATE users 
                SET password = ? 
                WHERE email = (SELECT email FROM (SELECT email FROM tokens WHERE reset_token = ?) AS temp)
            `;
            const values = [hashedPassword, token];

            con.query(sql, values, (error, results) => {
                if (error) {
                    console.error('Error updating password in database:', error);
                    return res.status(500).json({ success: false, error: 'Internal server error' });
                }
                
                // Check if any rows were affected by the update query
                if (results.affectedRows === 0) {
                    // No rows were updated, indicating that no user was found with the given reset token
                    return res.status(404).json({ success: false, error: 'User not found' });
                }

                // Password updated successfully
                return res.status(200).json({ success: true, message: 'Password updated successfully' });
            });

            });
        } else {
            // If the token is invalid or expired, send a JSON response with error message
            res.status(400).json({ success: false, error: 'Invalid or expired token' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

router.post('/change-password/:email', authenticateToken, async (req, res) => {
    try {
        const { email } = req.params;
        const { newPassword } = req.body;
        // Hash the new password before storing it in the database
        bcrypt.hash(newPassword, 10, async (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ success: false, error: 'Internal server error' });
            }

            // Update the password associated with the email in the database
            const sql = `
                UPDATE usersform
                SET password = ? 
                WHERE email = ? 
            `;
            const values = [hashedPassword, email];

            con.query(sql, values, (error, results) => {
                if (error) {
                    console.error('Error updating password in database:', error);
                    return res.status(500).json({ success: false, error: 'Internal server error' });
                }

                // Check if any rows were affected by the update query
                if (results.affectedRows === 0) {
                    // No rows were updated, indicating that no user was found with the given email
                    return res.status(404).json({ success: false, error: 'User not found' });
                }

                // Password updated successfully
                return res.status(200).json({ success: true, message: 'Password updated successfully' });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

router.get('/account/:email', (req, res) => {
    const userEmail = req.params.email;

    con.query('SELECT * FROM users', (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const filteredResult = result.filter(user => user.email === userEmail);
        res.json(filteredResult);
    });
});


export { router as userRouter };