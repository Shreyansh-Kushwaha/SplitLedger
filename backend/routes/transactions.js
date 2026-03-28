const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/transactions
router.post('/', auth, async (req, res) => {
  try {
    const { toUserId, amount, description, date, type } = req.body;
    if (!toUserId || !amount || !date || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!['lent', 'borrowed'].includes(type)) {
      return res.status(400).json({ message: 'Type must be lent or borrowed' });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(404).json({ message: 'Target user not found' });

    const fromUserId = req.user.id;
    const fromUser = await User.findById(fromUserId);
    if (!fromUser) return res.status(404).json({ message: 'Current user not found' });

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return res.status(400).json({ message: 'Invalid date' });

    let originUser = fromUserId;
    let destinationUser = toUserId;
    if (type === 'borrowed') {
      originUser = toUserId;
      destinationUser = fromUserId;
    }

    const transaction = new Transaction({
      fromUser: originUser,
      toUser: destinationUser,
      amount: Number(amount),
      description: description || '',
      date: parsedDate,
      status: 'pending',
    });

    await transaction.save();

    res.status(201).json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /api/transactions
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {
      $or: [{ fromUser: req.user.id }, { toUser: req.user.id }],
    };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email');

    const totalLent = transactions.reduce((sum, tx) => {
      if (tx.fromUser._id.toString() === req.user.id) {
        return sum + tx.amount;
      }
      return sum;
    }, 0);

    const totalBorrowed = transactions.reduce((sum, tx) => {
      if (tx.toUser._id.toString() === req.user.id) {
        return sum + tx.amount;
      }
      return sum;
    }, 0);

    res.json({ totalLent, totalBorrowed, transactions });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PATCH /api/transactions/:id/settle
router.patch('/:id/settle', auth, async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });

    if (tx.fromUser.toString() !== req.user.id && tx.toUser.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    tx.status = 'settled';
    await tx.save();

    res.json(tx);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(400).json({ message: 'Invalid transaction id' });
    res.status(500).send('Server error');
  }
});

module.exports = router;
