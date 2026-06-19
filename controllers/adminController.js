const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const KYC = require('../models/KYC');


// Endpoint for admin to get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Endpoint for admin to freeze accounts of users
exports.freezeAccount = async (req, res) => {
    try {
        const account = await Account.findOne({
            accountNumber: req.params.accountNumber
        });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        account.status = "Frozen";

        await account.save();

        res.status(200).json({ message: "Account frozen successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Endpoint for admin to activate accounts of users
exports.activateAccount = async (req, res) => {
    try {
        const account = await Account.findOne({
            accountNumber: req.params.accountNumber
        });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        account.status = "Active";

        await account.save();

        res.status(200).json({ message: "Account activated successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Endpoint for admin to view all transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await transaction.find().populate("sender").populate("receiver");

        res.status(200).json(transactions);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Endpoint for admin to approve KYC
exports.approveKYC = async (req, res) => {
    try {
        const kyc = await KYC.findById(req.params.id);

        if (!kyc) {
            return res.status(404).json({ message: "KYC not found" });
        }

        kyc.status = "Approved";

        await kyc.save();

        res.status(200).json({ message: "KYC approved"});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Endpoint for admin to reject KYC
exports.rejectKYC = async (req, res) => {
    try {
        const kyc = await KYC.findById(req.params.id);

        if (!kyc) {
            return res.status(404).json({ message: "KYC not found" });
        }

        kyc.status = "Rejected";

        await kyc.save();

        res.status(200).json({ message: "KYC rejected" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};