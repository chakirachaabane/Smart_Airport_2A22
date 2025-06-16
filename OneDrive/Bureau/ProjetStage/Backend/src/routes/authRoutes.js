
import express from 'express';
const router = express.Router();


import { signin, signup } from '../controllers/authController.js';

// Route pour l'inscription (POST /api/auth/signup)
router.post('/signup', signup);

// Route pour la connexion (POST /api/auth/signin)
router.post('/signin', signin);


export default router;