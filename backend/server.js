import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import authRoutes from './routes/authRoutes.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';

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

// //login route <- moved to authController
// app.post('/api/auth/login', async (req, res) => {
//     const { email, password } = req.body;
  
//     try {
//         const user = await User.findOne({ email });
    
//         if (!user) {
//           return res.status(400).json({ message: 'Email or password is incorrect' });
//         }
    
//         console.log("Entered password:", password); // check input pw
//         console.log("Stored hashed password:", user.password); // check saved pw
    
//         const isMatch = await bcrypt.compare(password, user.password);
    
//         if (!isMatch) {
//           console.log("Password does not match");
//           return res.status(400).json({ message: 'Email or password is incorrect' });
//         }
    
//         console.log("Password matches");
//         res.status(200).json({ message: 'Successful authentication' });
//       } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//       }
//     });



app.listen(process.env.PORT || 3000, () => {
    connect();
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
