const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "Your first name is required"],
            minlength: 2,
            maxlength: 30,
            trim: true
        },

        lastName: {
            type: String,
            required: [true, "Your last name is required"],
            minlength: 2,
            maxlength: 30,
            trim: true
        },

        email: {
            type: String,
            required: [true, "Your email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Invalid email"
            ]
        },

        phoneNumber: {
            type: String,
            required: [true, "Your phone number is required"],
            validate: {
                validator: function(value) {
                    return /^\+?\d{10,15}$/.test(value);
                },
                message: "Invalid phone number"
            }
        },

        password: {
            type: String,
            required: [true, "A password is required"],
            minlength: 6,
            select: false
        },

        role: {
            type: String,
            enum: ["Customer", "Admin"],
            default: "Customer"
        },

        isFrozen: {
            type: Boolean,
            default: false
        }
    }, { timestamps: true }
)


module.exports = mongoose.model("User", userSchema);