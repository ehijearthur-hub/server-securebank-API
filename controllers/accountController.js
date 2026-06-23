const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const generateTransactionReference = require('../utils/generateTransactionReference');
const sendEmail = require('../utils/sendEmail');
const { depositTemplate, withdrawalTemplate } = require('../utils/emailTemplates');

// Endpoint to get account details
exports.getAccount = async (req, res, next) => {
    try {
        const account = await Account.findOne({
            owner_id: req.user._id
        }).populate(
            "owner_id",
            "firstName lastName email"
        );

        if (!account) {

            res.status(404);
            
            throw new Error("Account not found");
        }

        res.status(200).json(account);

    } catch (error) {

        next(error);

    }
};


// Endpoint to get account balance
exports.getBalance = async (req, res, next) => {
    try {
        const account = await Account.findOne({
            owner_id: req.user._id
        });

        if (!account) {

            res.status(404);
            
            throw new Error("Account not found");
        }

        res.status(200).json({
            balance: account.balance,
            currency: account.currency
        });

    } catch (error) {

        next(error);

    }
};


// Endpoint to deposit money 
exports.deposit = async (req, res, next) => {
    try {
        let { amount } = req.body;
        amount = Number(amount);

        if (!amount || amount <= 0) {

            res.status(400);
            
            throw new Error("Amount must be greater than zero")
        }

        const account = await Account.findOne({
            owner_id: req.user._id
        });

        if (!account) {

            res.status(404);
            
            throw new Error("Account not found");
        }

        if (account.status === "Frozen") {

            res.status(403);
            
            throw new Error("Account is frozen");
        }

        const reference = generateTransactionReference();

        account.balance += amount;

        await account.save();

        await Transaction.create({
            receiver: req.user._id,

            amount,

            reference,

            type: "Deposit"
        });

        await sendEmail(
            req.user.email,
            "Deposit Alert",
            depositTemplate(
                req.user.firstName,
                amount,
                account.balance,
                account.currency
            )
        );

        res.status(200).json({
            message: "Deposit successful",
            balance: account.balance
        });

    } catch (error) {

        next(error);

    }
};


// Endpoint to withdraw money
exports.withdraw = async (req, res, next) => {
    try { 
        let { amount } = req.body;
        amount = Number(amount);

        if (!amount || amount <= 0) {

            res.status(400);
            
            throw new Error("Amount must be greater than zero")
        }

        const account = await Account.findOne({
            owner_id: req.user._id
        });

        if (!account) {

            res.status(404);
            
            throw new Error("Account not found");
        }

        if (account.status === "Frozen") {

            res.status(403);
            
            throw new Error("Account is frozen");
        }

        if (amount > account.balance) {

            res.status(400);
            
            throw new Error("Insufficient funds");
        }

        const reference = generateTransactionReference();

        account.balance -= amount;

        await account.save();

        await Transaction.create({
            sender: req.user._id,

            amount,

            reference,

            type: "Withdrawal"
        });

        await sendEmail(
            req.user.email,
            "Withdrawal Alert",
            withdrawalTemplate(
                req.user.firstName,
                amount,
                account.balance,
                account.currency
            )
        );

        res.status(200).json({
            message: "Withdrawal successful",
            balance: account.balance
        });

    } catch (error) {

        next(error);

    }
};