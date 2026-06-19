const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const generateTransactionReference = require('../utils/generateTransactionReference');


// Endpoint to get account details
exports.getAccount = async (req, res) => {
    try {
        const account = await Account.findOne({
            owner_id: req.user._id
        }).populate(
            "owner_id",
            "firstName lastName email"
        );

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.status(200).json(account);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Endpoint to get account balance
exports.getBalance = async (req, res) => {
    try {
        const account = await Account.findOne({
            owner_id: req.user._id
        });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.status(200).json({
            balance: account.balance,
            currency: account.currency
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Endpoint to deposit money 
exports.deposit = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than zero" })
        }

        const account = await Account.findOne({
            owner_id: req.user._id
        });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        if (account.status === "Frozen") {
            return res.status(403).json({ message: "Account is frozen" })
        }

        account.balance += amount;

        await account.save();

        await Transaction.create({
            receiver: req.user._id,

            amount,

            reference: generateTransactionReference(),

            type: "Deposit"
        });

        res.status(200).json({
            message: "Deposit successful",
            balance: account.balance
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Endpoint to withdraw money
exports.withdraw = async (req, res) => {
    try { 
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than zero" })
        }

        const account = await Account.findOne({
            owner_id: req.user._id
        });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        if (account.status === "Frozen") {
            return res.status(403).json({ message: "Account is frozen" });
        }

        if (amount > account.balance) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

        account.balance -= amount;

        await account.save();

        await Transaction.create({
            sender: req.user._id,

            amount,

            reference: generateTransactionReference(),

            type: "Withdrawal"
        });

        res.status(200).json({
            message: "Withdrawal successful",
            balance: account.balance
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};