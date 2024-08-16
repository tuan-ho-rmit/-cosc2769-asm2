import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import authRoutes from './routes/authRoutes.js'

dotenv.config();
const mongoURI = process.env.MONGODB_URI;
const app = express();
const corsOptions = {
    origin: true,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "skip"],
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
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});
app.use('/api/auth', authRoutes);

const posts = [
    {
      id: 1,
      content: "Nature is incredibly diverse and awe-inspiring. From the towering mountains to the deep oceans, every aspect of nature has something unique to offer. In this post, we'll explore some of the most beautiful natural landscapes on Earth.",
      author: "John Doe",
      date: "2024-08-12",
      images: [
        "/images/example.jpg",
        "/images/example.jpg",
        "/images/example.jpg",
      ]
    },
    {
      id: 2,
      content: "Technology is rapidly evolving, bringing about changes that were once thought to be science fiction. From AI and machine learning to quantum computing, let's discuss the future trends that will shape our world.",
      author: "Jane Smith",
      date: "2024-08-11",
      images: [
        "/images/example.jpg",
        "/images/example.jpg",
        "/images/example.jpg",
      ]
    },
    {
      id: 3,
      content: "Eating healthy doesn't have to be boring or difficult. In this post, we'll share some delicious and easy-to-make recipes that are both nutritious and tasty. Plus, we'll provide tips on how to maintain a balanced diet.",
      author: "Emily Brown",
      date: "2024-08-10",
      images: [
        "/images/example.jpg",
        "/images/example.jpg",
        "/images/example.jpg",
      ]
    },
    {
      id: 4,
      content: "Exercise is crucial for maintaining good health. Whether you prefer running, lifting weights, or practicing yoga, regular physical activity can help you feel better, sleep better, and reduce the risk of many chronic diseases.",
      author: "Michael Johnson",
      date: "2024-08-09",
      images: [
        "/images/example.jpg",
        "/images/example.jpg",
        "/images/example.jpg",
      ]
    },
    {
      id: 5,
      content: "Traveling opens your mind to new cultures, foods, and experiences. In this post, we'll explore some of the top travel destinations around the world that should be on every traveler's bucket list.",
      author: "Sarah Wilson",
      date: "2024-08-08",
      images: [
        "/images/example.jpg",
        "/images/example.jpg",
        "/images/example.jpg",
      ]
    },
  ];

app.get('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    const post = posts.find(p => p.id === parseInt(id));
  
    if (!post) {
      return res.status(404).send('Post not found');
    }
  
    res.json(post);
  });

app.listen(process.env.PORT || 3000, () => {
    connect();
    console.log("Server is running on port 3000");
});
