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

//login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
  
      if (!user) {
          return res.status(400).json({ message: 'Email or password is incorrect' });
      }
  
      console.log("Entered password:", password); // check input pw
      console.log("Stored hashed password:", user.password); // check saved pw
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
          console.log("Password does not match");
          return res.status(400).json({ message: 'Email or password is incorrect' });
      }
  
      console.log("Password matches");
      res.status(200).json({ message: 'Successful authentication' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
};
