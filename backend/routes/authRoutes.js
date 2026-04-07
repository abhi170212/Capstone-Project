const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser,
  requestPasswordReset,
  resetPassword,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/reset-password-request', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.put('/change-password', protect, changePassword);

module.exports = router;
