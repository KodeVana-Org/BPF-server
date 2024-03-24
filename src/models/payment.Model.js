const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },

    name: {
        type: String,
    },

    amount: Number,

    paymentStatus: {
        type: String,
        enum:['success', 'fail', 'pending'],
        default:'pending'
    },

    stripeCustomerId: {
        type: String,
        required: true,
        unique: true
    },

    timestamp: 
    { type: Date, default: Date.now }
})


const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;