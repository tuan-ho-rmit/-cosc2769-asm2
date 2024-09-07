import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import session from 'express-session';  // Added for session management
import authRoutes from './routes/authRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import postRoutes from './routes/postRoutes.js'
import userRoutes from './routes/userRoutes.js'
import notiRoutes from './routes/notiRoutes.js'
import friendRequestRoutes from './routes/friendRequestRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import reactionRoutes from './routes/reactionRoutes.js';
import cookieParser from "cookie-parser";
import MongoStore from 'connect-mongo';

dotenv.config();
const mongoURI = process.env.MONGODB_URI;
const sessionSecret = process.env.SESSION_SECRET
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
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: mongoURI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60,
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, 
    httpOnly: true, 
  },
}));


// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notiRoutes);
app.use('/api/friendrequest', friendRequestRoutes);
app.use('/api/posts', commentRoutes);
app.use('/api', reactionRoutes); // 리액션 라우트 추가

app.listen(process.env.PORT || 3000, () => {
  connect();
  console.log("Server is running on port 3000");
});
