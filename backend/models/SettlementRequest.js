const mongoose = require('mongoose');

const settlementRequestSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  amountSettled: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
  transactionsSettled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
}, { timestamps: true });

module.exports = mongoose.model('SettlementRequest', settlementRequestSchema);