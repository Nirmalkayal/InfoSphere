const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./config/db');
const env = require('./config/env');

const externalRoutes = require('./routes/externalRoutes');
const adminRoutes = require('./routes/adminRoutes');

// connectDB(); // Moved to server.js

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRoutes = require('./routes/api');

app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => res.send('Turf Locks API'));

module.exports = app;
