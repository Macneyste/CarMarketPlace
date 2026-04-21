import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

function normalizeEmail(email = '') {
  return email.trim().toLowerCase();
}

async function signupUser(req, res) {
  const { name, email, password } = req.body;
  const trimmedName = name?.trim();
  const normalizedEmail = normalizeEmail(email);

  if (!trimmedName || !normalizedEmail || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: trimmedName,
    email: normalizedEmail,
    password: hashedPassword,
  });

  return res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
}

async function signinUser(req, res) {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  return res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
}

export { signupUser, signinUser };
