const jwt = require('jsonwebtoken');
const { loginService, registerService, refreshTokenService, logoutService, getProfileService } = require('../services/auth.service');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const tokens = await loginService(email, password);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role, rfidCard } = req.body;
    const result = await registerService(name, email, password, role, rfidCard);
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

const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    const newTokens = await refreshTokenService(token);
    res.json(newTokens);
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { token } = req.body;
    const result = await logoutService(token);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await getProfileService(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { 
    login, 
    register,
    refreshToken,
    logout,
    getProfile 
};
