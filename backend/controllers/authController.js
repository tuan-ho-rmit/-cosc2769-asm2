import User from "../models/User.js";
import bcrypt from 'bcrypt';

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
    console.log("Plain password:", password); // check origin pw
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password to be saved:", hashedPassword); // check hashed pw

    // Create a new user object
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      dateOfBirth,
      gender,
      avatar,
    });

    // Save the user to the database
    await newUser.save();

    // check stored pw
    const savedUser = await User.findOne({ email });
    console.log("Stored hashed password:", savedUser.password);

    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (err) {
    console.error("Error registering user:", err);
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
