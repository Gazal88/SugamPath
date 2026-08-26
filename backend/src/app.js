const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const locationRoutes = require('./routes/locationRoutes');
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();                    // ← app must be created FIRST

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());


app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/locations', locationRoutes); // ← THEN you can use it
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

module.exports = app;