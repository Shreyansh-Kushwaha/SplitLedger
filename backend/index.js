require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const txnRoutes = require('./routes/transactions');
const settlementRoutes = require('./routes/settlementRequests');

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));

app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', txnRoutes);
app.use('/api/settlement-requests', settlementRoutes);

app.get('/api/health', (req, res) => res.send({ status: 'ok', service: 'SplitLedger API' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`SplitLedger backend running on port ${PORT}`);
});
