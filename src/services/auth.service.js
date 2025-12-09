const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createRfidCard } = require('./rfid.service');

const loginService = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user || !user.is_active) throw new Error('Invalid credentials');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_SECRET_EXPIRES_IN.trim() }
  );

  const refreshToken = jwt.sign(
    { userId: user.id }, 
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRES_IN.trim() }
  );

  await prisma.token.updateMany({
    where: { user_id: user.id, is_revoked: false },
    data: { is_revoked: true }
  });

  const decoded = jwt.decode(refreshToken);
  const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;

  await prisma.token.create({
    data: {
      token: refreshToken,
      user_id: user.id,
      expires_at: expiresAt,
      is_revoked: false,
      is_expired: false,
      token_type: 'BEARER'
    }
  });

  return { accessToken, refreshToken };
};

const registerService = async (name, email, password, role = 'user', rfidCard = null) => {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Name is required and must be a non-empty string');
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new Error('Password is required and must be at least 6 characters');
  }

  const existingUser = await prisma.users.findUnique({ where: { email: email } });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.users.create({
    data: {
      name: name.trim(),
      email: email,
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

const refreshTokenService = async (token) => {
  const storedToken = await prisma.token.findUnique({ where: { token } });
  if (!storedToken || storedToken.is_revoked || storedToken.is_expired) {
    throw new Error('Invalid refresh token');
  }
  
  if (storedToken.expires_at < new Date()) {
    await prisma.token.update({
      where: { token },
      data: { is_expired: true }
    });
    throw new Error('Refresh token expired');
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await prisma.users.findUnique({ where: { id: decoded.userId } });
  if (!user) {
    throw new Error('User not found');
  }
  const newAccessToken = jwt.sign(
    { userId: user.id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );
  return { accessToken: newAccessToken };
}

const logoutService = async (refreshToken) => {
  const storedToken = await prisma.token.findUnique({ where: { token: refreshToken } });
  if (!storedToken) {
    throw new Error('Refresh token not found');
  }
  await prisma.token.update({
    where: { token: refreshToken },
    data: { is_revoked: true }
  });
  return { success: true };
};

const getProfileService = async (userId) => {
  return await prisma.users.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, is_active: true, created_at: true }
  });
};

module.exports = { 
  loginService, 
  registerService, 
  refreshTokenService,
  logoutService, 
  getProfileService 
};