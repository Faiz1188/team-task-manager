const { Router } = require('express');
const { signup, login } = require('./auth.controller');
const { signupValidation, loginValidation } = require('./auth.validation');

const router = Router();

// POST /api/auth/signup
router.post('/signup', signupValidation, signup);

// POST /api/auth/login
router.post('/login', loginValidation, login);

module.exports = router;
