// src/routes/projectRoutes.js
import { Router } from 'express';
import multer from 'multer';
import {
    uploadProjects,
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    createTaskForProject
} from '../controllers/projectController.js'; // Assurez-vous d'utiliser .js si type:module
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(authenticateToken);

router.post('/upload', upload.single('excelFile'), uploadProjects);
router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:projectId/tasks', createTaskForProject);


export default router;