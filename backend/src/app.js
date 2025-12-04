const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./config/db');
const env = require('./config/env');

const externalRoutes = require('./routes/externalRoutes');
const adminRoutes = require('./routes/adminRoutes');

connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', externalRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => res.send('Turf Locks API'));

module.exports = app;
