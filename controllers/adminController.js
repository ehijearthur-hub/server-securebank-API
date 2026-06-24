const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const KYC = require('../models/KYC');
const sendEmail = require('../utils/sendEmail');
const { kycApprovedTemplate, kycRejectedTemplate } = require('../utils/emailTemplates');


// Endpoint for admin to get all users
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json(users);

    } catch (error) {

        next(error);

    }
};


// Endpoint for admin to freeze accounts of users
exports.freezeAccount = async (req, res, next) => {
    try {
        const account = await Account.findOne({
            accountNumber: req.params.accountNumber
        });

        if (!account) {

            res.status(404);
            
            throw new Error("Account not found");
        }

        account.status = "Frozen";

        await account.save();

        res.status(200).json({ message: "Account frozen successfully" });

    } catch (error) {

        next(error);

    }
};


// Endpoint for admin to activate accounts of users
exports.activateAccount = async (req, res, next) => {
    try {
        const account = await Account.findOne({
            accountNumber: req.params.accountNumber
        });

        if (!account) {
            res.status(404);
            
            throw new Error({ message: "Account not found" });
        }

        account.status = "Active";

        await account.save();

        res.status(200).json({ message: "Account activated successfully" });

    } catch (error) {

        next(error);

    }
};


// Endpoint for admin to view all transactions
exports.getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find().populate("sender").populate("receiver");

        res.status(200).json(transactions);

    } catch (error) {

        next(error);

    }
};


// Endpoint for admin to approve KYC
exports.approveKYC = async (req, res, next) => {
    try {
        const kyc = await KYC.findById(req.params.id);

        if (!kyc) {

            res.status(404);
            
            throw new Error("KYC not found");
        }

        kyc.status = "Approved";

        await kyc.save();

        const user = await User.findById( kyc.user );

        await sendEmail(
            user.email,
            "KYC Approved",
            kycApprovedTemplate(
                user.firstName
            )
        );

        res.status(200).json({ message: "KYC approved"});

    } catch (error) {

        next(error);

    }
};

// Endpoint for admin to reject KYC
exports.rejectKYC = async (req, res, next) => {
    try {
        const kyc = await KYC.findById(req.params.id);

        if (!kyc) {

            res.status(404);
            
            throw new Error("KYC not found");
        }

        kyc.status = "Rejected";

        await kyc.save();

        const user = await User.findById( kyc.user );

        await sendEmail(
            user.email,
            "KYC Rejected",
            kycRejectedTemplate(
                user.firstName
            )
        );


        res.status(200).json({ message: "KYC rejected" });

    } catch (error) {

        next(error);

    }
};