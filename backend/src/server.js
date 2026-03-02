require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('../models');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await db.sequelize.authenticate();
    return res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (_error) {
    return res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
