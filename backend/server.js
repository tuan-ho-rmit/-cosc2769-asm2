import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const mongoURI = process.env.MONGODB_URI;
const app = express();

const corsOptions = {
    origin: true,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};

// MongoDB connection
const connect = async () => {
    try {
        await mongoose.connect(mongoURI, {});
        console.log("MongoDB is connected");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
    }
};

// Middleware
app.use(express.json({ limit: '50mb' })); // Increase the body size limit for large image uploads
app.use(cors(corsOptions));

// Routes
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});
app.use('/api/auth', authRoutes);

app.listen(process.env.PORT || 3000, () => {
    connect();
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
