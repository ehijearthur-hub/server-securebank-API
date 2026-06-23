const mongoose = require('mongoose');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const generateTransactionReference = require('../utils/generateTransactionReference');
const sendEmail = require('../utils/sendEmail');
const { debitAlertTemplate, creditAlertTemplate } = require('../utils/emailTemplates');


// Endpoint to transfer money
exports.transferMoney = async (req, res, next) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const {
            receiverAccountNumber,
            amount: rawAmount
        } = req.body;

        const amount = Number(rawAmount);

        if (!amount || amount <= 0) {

            res.status(400);
            
            throw new Error("Amount must be greater than zero");
        }

        const senderAccount = await Account.findOne({
            owner_id: req.user._id
        }).session(session);

        if (!senderAccount) {

           res.status(404);
           
           throw new Error("Sender account not found");
        }

        const receiverAccount = await Account.findOne({
            accountNumber: receiverAccountNumber
        }).session(session);

        if (!receiverAccount) {

           res.status(404);
           
           throw new Error("Receiver account not found");
        }

        if (
            senderAccount.accountNumber === receiverAccount.accountNumber
        ) {

            res.status(400);
            
            throw new Error("Cannot transfer to your own account");
        }

        if (senderAccount.status === "Frozen") {

            res.status(403);
            
            throw new Error("Sender account is frozen");
        }

        if (receiverAccount.status === "Frozen") {

            res.status(403);
            
            throw new Error("Receiver account is frozen");
        }

        if (amount > senderAccount.balance) {
            res.status(400);
            
            throw new Error("Insufficient funds");
        }

        const reference = generateTransactionReference();

        senderAccount.balance -= amount;

        receiverAccount.balance += amount;

        await senderAccount.save({ session });
        await receiverAccount.save({ session });

        await Transaction.create(
            [{ 
            sender: senderAccount.owner_id, 
            receiver: receiverAccount.owner_id,
            amount,
            type: "Transfer",
            reference
        }],
        { session }
    );

    await session.commitTransaction();

    const senderUser = await User.findById( senderAccount.owner_id );
    const receiverUser = await User.findById( receiverAccount.owner_id );

    await sendEmail(
        senderUser.email,
        "Debit Alert",
        debitAlertTemplate(
            senderUser.firstName,
            amount,
            receiverAccount.accountNumber,
            senderAccount.balance,
            reference,
            senderAccount.currency
        )
    );

    await sendEmail(
        receiverUser.email,
        "Credit Alert",
        creditAlertTemplate(
            receiverUser.firstName,
            amount,
            senderAccount.accountNumber,
            receiverAccount.balance,
            reference,
            receiverAccount.currency
        )
    );

    

        res.status(200).json({
            message: "Transfer successful",
            senderBalance: senderAccount.balance
        });

    } catch (error) {

        await session.abortTransaction();

       next(error);

    } finally {

        session.endSession();

    }
};



// Endpoint to get transaction history of user
exports.getTransactionHistory = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({

            $or: [
                { sender: req.user._id },
                {receiver: req.user._id}
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json(transactions);

    } catch (error) {

       next(error);

    }
};



// Endpoint to get a single transaction of user
exports.getTransactionById = async (req, res, next) => {
    try  {
        const transaction = await Transaction.findById( req.params.id );

        if (!transaction) {

           res.status(404);
           
           throw new Error("Transaction not found");
        }

        res.status(200).json(transaction);
        
    } catch (error) {

        next(error);

    }
};