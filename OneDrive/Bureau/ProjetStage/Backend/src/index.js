// src/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/users.js'; // <-- AJOUTEZ CETTE LIGNE
import { authenticateToken } from './middleware/authMiddleware.js';
import projectRoutes from './routes/projectRoutes.js';
// TODO: Importer d'autres fichiers de routes... en ajoutant .js

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:8081',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// TODO: Ajouter d'autres middlewares globaux
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
// TODO: Monter d'autres fichiers de routes

app.get('/', (req, res) => {
  res.send('ProjectFlow Backend is running!');
});

// TODO: Ajouter des middlewares de gestion d'erreurs

app.listen(port, () => {
  console.log(`🚀 ProjectFlow Backend server running on port ${port}`);
  console.log(`⚙️  Access Auth API at http://localhost:${port}/api/auth`);
  console.log(`⚙️  Access Project API at http://localhost:${port}/api/projects`);
});