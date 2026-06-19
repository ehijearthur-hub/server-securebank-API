const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        amount: {
            type: Number,
            required: true
        },

        reference: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: [
                "Deposit",
                "Withdrawal",
                "Transfer"
            ],
            required: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Completed",
                "Failed"
            ],
            default: "Completed"
        }
    }, { timestamps: true }
);


module.exports = mongoose.model("Transaction", transactionSchema);