const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
    {
        owner_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        accountNumber: {
            type: String,
            required: true,
            unique: true
        },

        accountType: {
            type: String,
            enum: ["Savings", "Current"],
            default: "Savings"
        },

        balance: {
            type: Number,
            default: 0
        },

        currency: {
            type: String,
            default: "NGN"
        },

        status: {
            type: String,
            enum: ["Active", "Frozen"],
            default: "Active"
        }
    }, { timestamps: true }
);


module.exports = mongoose.model("Account", accountSchema);