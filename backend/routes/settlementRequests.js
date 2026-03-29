const express = require('express');
const SettlementRequest = require('../models/SettlementRequest');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/settlement-requests
router.post('/', auth, async (req, res) => {
  try {
    const { toUserId, amount } = req.body;
    if (!toUserId || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(404).json({ message: 'Target user not found' });

    const fromUserId = req.user.id;
    if (fromUserId === toUserId) {
      return res.status(400).json({ message: 'Cannot settle with yourself' });
    }

    const settlementRequest = new SettlementRequest({
      fromUser: fromUserId,
      toUser: toUserId,
      amount: Number(amount),
    });

    await settlementRequest.save();

    res.status(201).json(settlementRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /api/settlement-requests
router.get('/', auth, async (req, res) => {
  try {
    const requests = await SettlementRequest.find({
      $or: [{ fromUser: req.user.id }, { toUser: req.user.id }],
    })
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PATCH /api/settlement-requests/:id/confirm
router.patch('/:id/confirm', auth, async (req, res) => {
  try {
    const request = await SettlementRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Settlement request not found' });

    if (request.toUser.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    // Find pending transactions between the users
    const transactions = await Transaction.find({
      $or: [
        { fromUser: request.fromUser, toUser: request.toUser },
        { fromUser: request.toUser, toUser: request.fromUser },
      ],
      status: 'pending',
    }).sort({ date: 1 }); // Oldest first

    const totalPendingInDB = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    if (totalPendingInDB === 0) {
      return res.status(400).json({ message: 'No pending transactions available between users' });
    }

    let remainingAmount = request.amount;
    let settledAmount = 0;
    const settledIds = [];

    for (const tx of transactions) {
      if (remainingAmount <= 0) break;

      if (remainingAmount >= tx.amount) {
        // Fully settle this transaction
        tx.status = 'settled';
        await tx.save();
        settledIds.push(tx._id);
        settledAmount += tx.amount;
        remainingAmount -= tx.amount;
      } else {
        // Partially settle this transaction via split
        const partial = remainingAmount;
        const remainder = tx.amount - partial;

        tx.amount = remainder;
        await tx.save();

        const settledTx = new Transaction({
          fromUser: tx.fromUser,
          toUser: tx.toUser,
          amount: partial,
          description: tx.description ? `${tx.description} (partial settled)` : 'Partial settlement',
          date: tx.date,
          status: 'settled',
        });
        await settledTx.save();

        settledIds.push(settledTx._id);
        settledAmount += partial;
        remainingAmount = 0;
      }
    }

    if (settledAmount === 0) {
      return res.status(400).json({ message: 'Not enough pending transactions to settle through this request' });
    }

    request.status = 'confirmed';
    request.transactionsSettled = settledIds;
    request.amountSettled = settledAmount;
    await request.save();

    res.json({
      ...request.toObject(),
      amountSettled,
      amountRemaining: Math.max(0, request.amount - settledAmount),
    });
  } catch (err) {
    console.error('Confirm settlement error:', err);
    if (err.kind === 'ObjectId') return res.status(400).json({ message: 'Invalid request id' });
    res.status(500).json({ message: 'Internal server error during settlement confirmation' });
  }
});

// PATCH /api/settlement-requests/:id/reject
router.patch('/:id/reject', auth, async (req, res) => {
  try {
    const request = await SettlementRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Settlement request not found' });

    if (request.toUser.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    request.status = 'rejected';
    await request.save();

    res.json(request);
  } catch (err) {
    console.error('Reject settlement error:', err);
    if (err.kind === 'ObjectId') return res.status(400).json({ message: 'Invalid request id' });
    res.status(500).json({ message: 'Internal server error during settlement rejection' });
  }
});

module.exports = router;