import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/userModel.js';

const googleClient = new OAuth2Client();

function normalizeEmail(email = '') {
  return email.trim().toLowerCase();
}

function buildAuthResponse(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || '',
    authProvider: user.authProvider,
  };
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
    authProvider: 'local',
  });

  return res.status(201).json(buildAuthResponse(user));
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

  if (!user.password) {
    res.status(401);
    throw new Error('This account uses Google sign-in. Continue with Google.');
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  return res.status(200).json(buildAuthResponse(user));
}

async function googleAuthUser(req, res) {
  const { credential } = req.body;
  const audience =
    process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '';

  if (!credential) {
    res.status(400);
    throw new Error('Google credential is required');
  }

  if (!audience) {
    res.status(500);
    throw new Error('Google OAuth is not configured on the server');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience,
  });

  const payload = ticket.getPayload();

  if (!payload?.email || payload.email_verified !== true) {
    res.status(401);
    throw new Error('Google account email could not be verified');
  }

  const normalizedEmail = normalizeEmail(payload.email);
  const googleId = payload.sub;
  const displayName = payload.name?.trim() || normalizedEmail.split('@')[0];
  const avatar = payload.picture || '';

  let user = await User.findOne({
    $or: [{ googleId }, { email: normalizedEmail }],
  });

  if (!user) {
    user = await User.create({
      name: displayName,
      email: normalizedEmail,
      googleId,
      avatar,
      authProvider: 'google',
    });
  } else {
    user.googleId = user.googleId || googleId;
    user.avatar = avatar || user.avatar;

    if (!user.name) {
      user.name = displayName;
    }

    if (user.authProvider !== 'local') {
      user.authProvider = 'google';
    }

    await user.save();
  }

  return res.status(200).json(buildAuthResponse(user));
}

export { signupUser, signinUser, googleAuthUser };
