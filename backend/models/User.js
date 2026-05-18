const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        // Password optional for Google Auth users
    },
    googleId: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'superadmin'],
        default: 'user'
    },
    companyDetails: {
        companyName: String,
        taxId: String,
        address: String,
        website: String
    },
}, {
    timestamps: true
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    if (!this.password) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
