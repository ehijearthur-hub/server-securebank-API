const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const generateTransactionReference = require('../utils/generateTransactionReference');


// Endpoint to transfer money
exports.transferMoney = async (req, res) => {
    try {
        const {
            receiverAccountNumber,
            amount
        } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than zero" });
        }

        const senderAccount = await Account.findOne({
            owner_id: req.user._id
        });

        if (!senderAccount) {
            return res.status(404).json({ message: "Sender account not found" });
        }

        const receiverAccount = await Account.findOne({
            accountNumber: receiverAccountNumber
        });

        if (!receiver) {
            return res.status(404).json({ message: "Receiver account not found" });
        }

        if (
            senderAccount.accountNumber === receiverAccount.accountNumber
        ) {
            return res.status(400).json({ message: "Cannot transfer to your own account" });
        }

        if (senderAccount.status === "Frozen") {
            return res.status(403).json({ message: "Sender account is frozen" });
        }

        if (receiverAccount.status === "Frozen") {
            return res.status(403).json({ message: "Receiver account is frozen" });
        }

        if (amount > senderAccount.balance) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

        senderAccount.balance -= amount;

        receiverAccount.balance += amount;

        await senderAccount.save();
        await receiverAccount.save();

        await Transaction.create({ 
            sender: senderAccount.owner_id, 
            receiver: receiverAccountNumber.owner_id,
            amount,
            type: "Transfer",
            reference: generateTransactionReference()
        });

        res.status(200).json({
            message: "Transfer successful",
            senderBalance: senderAccount.balance
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Endpoint to get transaction history of user
exports.getTransactionHistory = async (req, res) => {
    try {
        const transactions = await Transaction.find({

            $or: [
                { sender: req.user._id },
                {receiver: req.user._id}
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json(transactions);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Endpoint to get a single transaction of user
exports.getTransactionById = async (req, res) => {
    try  {
        const transaction = await Transaction.findById( req.params.id );

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json(transaction);
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};