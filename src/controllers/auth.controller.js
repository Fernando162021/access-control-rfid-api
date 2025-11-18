const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');
const { loginUser, getUserProfile, registerUser } = require('../services/auth.service');
const { create } = require('domain');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ token });
  } catch (err) {
    next(new UnauthorizedError(err.message));
  }
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role, rfidCard } = req.body;
    const result = await registerUser(name, email, password, role, rfidCard);
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        rfidCard: result.rfidCard,
        createdAt: result.user.created_at
      }
    });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await getUserProfile(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { 
    login, 
    register, 
    getProfile 
};
