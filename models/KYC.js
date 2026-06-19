const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        documentType: {
            type: String,
            enum:  [
                "National ID",
                "Passport",
                "Driver's License"
            ],
            required: true
        },

        documentUrl: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Approved",
                "Rejected"
            ],
            default: "Pending"
        }
    }, { timestamps: true }
);


module.exports = mongoose.model("KYC", kycSchema);