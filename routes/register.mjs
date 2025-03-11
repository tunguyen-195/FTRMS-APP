import express from 'express';
import { registerUser } from '../controllers/nonUserRegister.mjs';
import { forwardAuthenticated } from '../middleware/auth.mjs';

const router = express.Router();

router.get('/', forwardAuthenticated, (req, res) => {
  res.render('register', { title: 'Đăng Ký' });
});

router.post('/', forwardAuthenticated, registerUser);

export default router;
