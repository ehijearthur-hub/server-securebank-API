const User = require('../models/User');
const Account = require('../models/Account');
const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const generateAccountNumber = require("../utils/generateAccountNumber");
const sendEmail = require('../utils/sendEmail');
const { welcomeTemplate, forgotPasswordTemplate } = require('../utils/emailTemplates');



// Endpoint to register users
exports.registerUser = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            password
        } = req.body;

        if (!firstName || !lastName || !email || !phoneNumber || !password) {
            res.status(400);
            throw new Error("All fields are required");
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error("User already exists");
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password: hashedPassword
        });

        const accountNumber = await generateAccountNumber();
        
        const account = await Account.create({
            owner_id: user._id,
            accountNumber
        });

        await sendEmail(
            user.email,
            "Welcome to SecureBank",
            welcomeTemplate(
                user.firstName,
                account.accountNumber
            )
        );

        res.status(201).json({
            message: "Account created successfully",
            token: generateToken(user._id),
            user,
            account
        });

    } catch (error) {

        next(error);

    }
};


// Endpoint to log in users
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400);
            throw new Error("Email and password are required");
        }

        const user = await User.findOne({ email }).select("+password");
        
        if (!user) {
            res.status(401);
            throw new Error("Invalid credentials");
        }

        const isMatch = await bcryptjs.compare(
            password, 
            user.password
        );

        if (!isMatch) {
            res.status(401);
            throw new Error("Invalid credentials");
        }

        res.status(200).json({
            message: "Login successful",
            token: generateToken(user._id)
        });

        } catch (error) {

            next(error);
    }

};


// Endpoint for forgotten password
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400);
            throw new Error("Email is required");
        }

        const user = await User.findOne({ email });

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

// This will generate a random reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

// This will hash the token before saving it
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

// To save hashed token and expiry
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Basically 10 minutes

        await user.save();

// Reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await sendEmail(
            user.email,
            "SecureBank Password Reset",
            forgotPasswordTemplate(
                user.firstName,
                resetUrl
            )
        );

        res.status(200).json({
            message: "Password reset instructions sent to your email"
        });

    } catch (error) {

        next(error);

    }
};


// Endpoint to reset password
exports.resetPassword = async (req, res, next) => {
    try {

        const { token } = req.params;

        const { password } = req.body;

        if (!password) {
            res.status(400);
            throw new Error("New password is required");
        }

// Hash the token received from the URL
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

        const user = await User.findOne({

            resetPasswordToken: hashedToken,

            resetPasswordExpires: {$gt: Date.now()}
        }).select("+resetPasswordToken");

        if (!user) {
            res.status(400);
            throw new Error("Invalid or expired password reset token");
        }

// Hash the new password
        const hashedPassword = await bcryptjs.hash( password, 10 );

        user.password = hashedPassword;

// Remove reset token
        user.resetPasswordToken = undefined;

        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({
            message: "Password reset successful"
        });
    } catch (error) {

        next(error);

    }
};


// Endpoint to log out users
exports.logoutUser = async (req, res) => {
    res.status(200).json({ message: "Logout successful" });
};


// Endpoint to get logged-in user's details back. This isn't necessary but useful for testing whether JWT middleware works
exports.getProfile = async (req, res) => {
    res.status(200).json(req.user);
};