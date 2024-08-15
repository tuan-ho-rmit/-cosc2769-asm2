import User from "../models/User.js";
import bcrypt from 'bcryptjs';

// Handle user registration
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, dateOfBirth, gender, avatar } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object with the Base64 image
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      dateOfBirth,
      gender,
      avatar, // Store the Base64 image string directly in MongoDB
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// Handle fetching users (for testing purposes)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users', error: err.message });
  }
};
