const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'settled'], default: 'pending' },
  settledAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
