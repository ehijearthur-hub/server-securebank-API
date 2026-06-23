const User = require('../models/User');
const Account = require('../models/Account');
const bcryptjs = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const generateAccountNumber = require("../utils/generateAccountNumber");
const sendEmail = require('../utils/sendEmail');
const { welcomeTemplate } = require('../utils/emailTemplates');



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


// Endpoint to log out users
exports.logoutUser = async (req, res) => {
    res.status(200).json({ message: "Logout successful" });
};


// Endpoint to get logged-in user's details back. This isn't necessary but useful for testing whether JWT middleware works
exports.getProfile = async (req, res) => {
    res.status(200).json(req.user);
};