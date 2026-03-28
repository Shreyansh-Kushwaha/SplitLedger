require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const txnRoutes = require('./routes/transactions');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', txnRoutes);

app.get('/api/health', (req, res) => res.send({ status: 'ok', service: 'SplitLedger API' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SplitLedger backend running on port ${PORT}`);
});
