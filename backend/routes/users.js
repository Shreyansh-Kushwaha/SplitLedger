const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/users/search?query=foo
router.get('/search', auth, async (req, res) => {
  const query = (req.query.query || '').trim();
  if (!query) return res.json([]);

  const regex = new RegExp(query, 'i');
  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    _id: { $ne: req.user.id },
  }).select('-password');

  res.json(users);
});

module.exports = router;
