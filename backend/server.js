import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import session from 'express-session';  // Added for session management
import authRoutes from './routes/authRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import postRoutes from './routes/postRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config();
const mongoURI = process.env.MONGODB_URI;
const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB connection
const connect = async () => {
  try {
    await mongoose.connect(mongoURI, {});
    console.log("MongoDB is connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

// Session middleware setup
app.use(session({
  secret: 'your-secret-key',  // Replace with your own secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Set to true if using HTTPS
}));

// Middleware
app.use(cors(corsOptions));

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api', postRoutes);
app.use('/api/users', userRoutes);


app.listen(process.env.PORT || 3000, () => {
  connect();
  console.log("Server is running on port 3000");
});
