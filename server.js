const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config();
const connectDB = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${con.connection.host}`);
    } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
   }
};
connectDB();

const app = express();
app.use(express.json());
app.use(cors());


// Routes 
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/account', require('./routes/accountRoutes'));
app.use('/api/transaction', require('./routes/transactionRoutes'));
app.use('/api/kyc', require('./routes/kycRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use(require('./middleware/errorMiddleware'));


app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({ success: false, error: 'Server Error' });
});

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
