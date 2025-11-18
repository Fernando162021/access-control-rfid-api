const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const { validateEmail, validateId } = require('../utils/validators');
const { createRfidCard } = require('./rfid.service');

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const validatedEmail = validateEmail(email);

  const user = await prisma.users.findUnique({ where: { email: validatedEmail } });
  if (!user || !user.is_active) {
    throw new Error('Invalid credentials');
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('Invalid credentials');
  }
  return user;
};

const registerUser = async (name, email, password, role = 'user', rfidCard = null) => {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Name is required and must be a non-empty string');
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new Error('Password is required and must be at least 6 characters');
  }
  const validatedEmail = validateEmail(email);
  const existingUser = await prisma.users.findUnique({ where: { email: validatedEmail } });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.users.create({
    data: {
      name: name.trim(),
      email: validatedEmail,
      password: hashedPassword,
      role,
    }
  });
  let rfidCardData = null;
  if (rfidCard) {
    rfidCardData = await createRfidCard(rfidCard, user.id);
  }
  return { user, rfidCard: rfidCardData };
};

const getUserProfile = async (userId) => {
  const validatedId = validateId(userId, 'User ID');
  
  return await prisma.users.findUnique({
    where: { id: validatedId },
    select: { id: true, name: true, email: true, role: true, is_active: true, created_at: true }
  });
};

module.exports = { loginUser, getUserProfile, registerUser };
