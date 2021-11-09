const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const dotenv = require('dotenv');

const app = express();
dotenv.config({ path: './config/config.env' });
// Connect Database
connectDB();

// Define Routes
app.use('/api/admin/auth', require('./routes/api/admin/auth'));
app.use('/api/admin/conferences', require('./routes/api/admin/conferences'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/admin/conferences', require('./routes/api/admin/conferences'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
