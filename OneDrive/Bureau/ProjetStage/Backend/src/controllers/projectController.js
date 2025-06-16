// Backend/src/controllers/projectController.js
import prisma from '../config/prismaClient.js';
import xlsx from 'xlsx';

// Fonction utilitaire pour convertir les dates Excel en objets Date JavaScript
const excelDateToJSDate = (excelDate) => {
    if (typeof excelDate === 'number' && excelDate > 0) {
        const jsDate = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
        return isNaN(jsDate.getTime()) ? null : jsDate;
    } else if (typeof excelDate === 'string') {
        const parsedDate = new Date(excelDate);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
    } else if (excelDate instanceof Date && !isNaN(excelDate.getTime())) {
        return excelDate;
    }
    return null;
};

export const uploadProjects = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier téléversé.' });
    }

    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: null });

        if (jsonData && jsonData.length > 0) {
            console.log("DEBUG: En-têtes lus depuis Excel:", Object.keys(jsonData[0]));
        }

        const projectsToCreate = [];
        const errors = [];

        for (const [index, row] of jsonData.entries()) {
            if (!row['Projets'] || String(row['Projets']).trim() === '') {
                errors.push(`Ligne Excel ${index + 2}: Nom du projet manquant.`);
                console.warn(`Ligne Excel ${index + 2}: Nom du projet manquant, ligne ignorée.`);
                continue;
            }
            
            let pourcentageAvanceNum = null;
            // Clé EXACTE pour l'en-tête multiligne "Pourcentage d'avancement"
            // Si le console.log ci-dessus montre une clé légèrement différente (ex: avec \r\n), ajustez ici.
            const excelHeaderForPercentage = "Pourcentage\nd'avancemen\nt"; 
            const rawPercentageValue = row[excelHeaderForPercentage];

            console.log(`DEBUG: Ligne Excel ${index + 2}, Projet "${row['Projets']}", Valeur brute pour "${excelHeaderForPercentage}":`, rawPercentageValue, `(Type: ${typeof rawPercentageValue})`);

            if (rawPercentageValue !== null && rawPercentageValue !== undefined) {
                let paString = String(rawPercentageValue).trim();
                // console.log(`  DEBUG: Valeur en chaîne (avant replace): "${paString}"`);

                if (typeof rawPercentageValue === 'number' && rawPercentageValue >= 0 && rawPercentageValue <= 1) { // Gère si Excel donne 0.2 pour 20%
                    pourcentageAvanceNum = Math.round(rawPercentageValue * 100);
                    // console.log(`  DEBUG: Converti nombre ${rawPercentageValue} en ${pourcentageAvanceNum}%`);
                } else { // Gère si Excel donne "20%" ou "20"
                    paString = paString.replace('%', ''); 
                    // console.log(`  DEBUG: Valeur en chaîne (après replace %): "${paString}"`);
                    
                    const parsedNum = parseInt(paString, 10);
                    // console.log(`  DEBUG: Résultat de parseInt: ${parsedNum}`);

                    if (!isNaN(parsedNum)) {
                        if (parsedNum >= 0 && parsedNum <= 100) {
                            pourcentageAvanceNum = parsedNum;
                            // console.log(`  DEBUG: Nombre parsé valide: ${pourcentageAvanceNum}`);
                        } else {
                            errors.push(`Ligne Excel ${index + 2}, Projet "${row['Projets']}": Pourcentage "${rawPercentageValue}" hors limites (0-100). Ignoré.`);
                            // console.warn(`  DEBUG: Pourcentage hors limites: ${parsedNum}`);
                        }
                    } else {
                        errors.push(`Ligne Excel ${index + 2}, Projet "${row['Projets']}": Format de pourcentage invalide ("${rawPercentageValue}"). Ignoré.`);
                        // console.warn(`  DEBUG: parseInt a retourné NaN pour "${paString}"`);
                    }
                }
            } else {
                // console.log(`  DEBUG: "${excelHeaderForPercentage}" est null ou undefined pour projet "${row['Projets']}".`);
            }

            const projet = {
                nomProjet: String(row['Projets']).trim(),
                validite: row['Validité'] ? String(row['Validité']) : null,
                serviceDemandeur: row['Service demandeur'] ? String(row['Service demandeur']) : null,
                demandeur: row['Demandeur'] ? String(row['Demandeur']) : null,
                societe: row['Sociétés'] ? String(row['Sociétés']) : null,
                site: row['Sites'] ? String(row['Sites']) : null,
                unite: row['Unités'] ? String(row['Unités']) : null,
                responsableRealisation: row['Responsable réalisation'] ? String(row['Responsable realisation']) : null,
                intervenant: row['Intervenant'] ? String(row['Intervenant']) : null,
                etat: row['Etat'] ? String(row['Etat']) : null,
                pourcentageAvance: pourcentageAvanceNum,
                dateDebutPrevue: excelDateToJSDate(row['Date début prévue']),
                dateFinPrevue: excelDateToJSDate(row['Date fin prévue']),
                dateDebutReelle: excelDateToJSDate(row['Date Débu']),
                dateFinReelle: excelDateToJSDate(row['Date fin']),
                priorite: row['Priorités'] ? String(row['Priorités']) : null,
                commentaires: row['Commentaires'] ? String(row['Commentaires']) : null,
            };
            // console.log(`  DEBUG: Objet 'projet' préparé pour BDD (pourcentageAvance): ${projet.pourcentageAvance} pour projet "${projet.nomProjet}"`);
            projectsToCreate.push(projet);
        }

        if (projectsToCreate.length === 0 && jsonData.length > 0) {
            return res.status(400).json({ message: 'Aucun projet valide trouvé dans le fichier Excel après traitement.', errors });
        }
        if (projectsToCreate.length === 0 && jsonData.length === 0) {
            return res.status(400).json({ message: 'Le fichier Excel est vide ou ne contient pas de données lisibles.' });
        }

        const creationResults = await prisma.project.createMany({
            data: projectsToCreate,
            skipDuplicates: true,
        });
        
        res.status(201).json({
            message: `${creationResults.count} projets importés avec succès sur ${projectsToCreate.length} projets potentiels.`,
            importedCount: creationResults.count,
            totalParsed: projectsToCreate.length,
            errors: errors.length > 0 ? errors : undefined,
        });

    } catch (error) {
        console.error("Erreur lors du traitement du fichier Excel:", error);
        res.status(500).json({ message: 'Erreur serveur lors du traitement du fichier.', error: error.message });
    }
};

export const createProject = async (req, res) => {
    try {
        const {
            nomProjet, societe, responsableRealisation, priorite, dateDebutPrevue, dateFinPrevue,
            budget, materials, materialBudget, commentaires,
            validite, serviceDemandeur, demandeur, site, unite, intervenant, etat,
            pourcentageAvance, dateDebutReelle, dateFinReelle,
            tasks
        } = req.body;

        if (!nomProjet) {
            return res.status(400).json({ message: 'Le nom du projet est requis.' });
        }

        const projectData = {
            nomProjet: String(nomProjet).trim(),
            societe: societe || null,
            responsableRealisation: responsableRealisation || null,
            priorite: priorite || null,
            commentaires: commentaires || null,
            budget: budget && !isNaN(parseFloat(budget)) ? parseFloat(budget) : null,
            materials: materials || null,
            materialBudget: materialBudget && !isNaN(parseFloat(materialBudget)) ? parseFloat(materialBudget) : null,
            validite: validite || null,
            serviceDemandeur: serviceDemandeur || null,
            demandeur: demandeur || null,
            site: site || null,
            unite: unite || null,
            intervenant: intervenant || null,
            etat: etat || 'Planifié',
            pourcentageAvance: pourcentageAvance && !isNaN(parseInt(String(pourcentageAvance))) ? parseInt(String(pourcentageAvance), 10) : 0,
            dateDebutPrevue: dateDebutPrevue ? excelDateToJSDate(dateDebutPrevue) : null,
            dateFinPrevue: dateFinPrevue ? excelDateToJSDate(dateFinPrevue) : null,
            dateDebutReelle: dateDebutReelle ? excelDateToJSDate(dateDebutReelle) : null,
            dateFinReelle: dateFinReelle ? excelDateToJSDate(dateFinReelle) : null,
        };

        const newProjectWithTasks = await prisma.$transaction(async (tx) => {
            const newProject = await tx.project.create({ data: projectData });

            if (tasks && Array.isArray(tasks) && tasks.length > 0) {
                const tasksToCreate = tasks.map(task => {
                    if (!task.nom || !task.startDate || !task.endDate) {
                        throw new Error(`Tâche invalide pour le projet "${newProject.nomProjet}": nom, startDate et endDate sont requis.`);
                    }
                    return {
                        nom: String(task.nom).trim(),
                        description: task.description || null,
                        startDate: excelDateToJSDate(task.startDate),
                        endDate: excelDateToJSDate(task.endDate),
                        progress: task.progress && !isNaN(parseInt(String(task.progress))) ? parseInt(String(task.progress), 10) : 0,
                        status: task.status || 'PENDING',
                        priority: task.priority || null,
                        assigneeId: task.assigneeId || null,
                        dependencies: task.dependencies || null,
                        projectId: newProject.id,
                    };
                });
                await tx.task.createMany({ data: tasksToCreate });
            }
            return tx.project.findUnique({
                where: { id: newProject.id },
                include: { tasks: true },
            });
        });
        res.status(201).json(newProjectWithTasks);
    } catch (error) {
        console.error("Erreur création projet avec tâches:", error);
        if (error.code === 'P2002') {
            return res.status(409).json({ message: `Erreur: Un projet avec ce nom ("${req.body.nomProjet}") existe déjà.`, details: error.meta?.target });
        }
        if (error.code === 'P2003' && error.meta?.field_name?.includes('assigneeId')) {
            return res.status(400).json({ message: `Erreur: Un ou plusieurs utilisateurs assignés aux tâches n'existent pas.` });
        }
        if (error.message.startsWith("Tâche invalide")) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erreur serveur lors de la création du projet et des tâches.', error: error.message });
    }
};

export const getProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' },
            include: { tasks: { orderBy: { startDate: 'asc' } } }
        });
        res.status(200).json(projects);
    } catch (error) {
        console.error("Erreur récupération projets:", error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des projets.', error: error.message });
    }
};

export const getProjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await prisma.project.findUnique({
            where: { id },
            include: { tasks: true }
        });
        if (!project) return res.status(404).json({ message: "Projet non trouvé" });
        res.status(200).json(project);
    } catch (error) {
        console.error(`Erreur récupération projet ${id}:`, error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

export const updateProject = async (req, res) => {
    const { id } = req.params;
    const { tasks, ...projectFields } = req.body; 
    try {
        const projectDataToUpdate = { ...projectFields };
        if (projectDataToUpdate.budget !== undefined) projectDataToUpdate.budget = projectDataToUpdate.budget ? parseFloat(projectDataToUpdate.budget) : null;
        if (projectDataToUpdate.materialBudget !== undefined) projectDataToUpdate.materialBudget = projectDataToUpdate.materialBudget ? parseFloat(projectDataToUpdate.materialBudget) : null;
        if (projectDataToUpdate.pourcentageAvance !== undefined) projectDataToUpdate.pourcentageAvance = projectDataToUpdate.pourcentageAvance ? parseInt(String(projectDataToUpdate.pourcentageAvance), 10) : null;
        ['dateDebutPrevue', 'dateFinPrevue', 'dateDebutReelle', 'dateFinReelle'].forEach(dateField => {
            if (projectDataToUpdate[dateField] !== undefined) {
                projectDataToUpdate[dateField] = excelDateToJSDate(projectDataToUpdate[dateField]);
            }
        });
        Object.keys(projectDataToUpdate).forEach(key => projectDataToUpdate[key] === undefined && delete projectDataToUpdate[key]);

        const updatedProject = await prisma.project.update({
            where: { id },
            data: projectDataToUpdate,
            include: { tasks: true }
        });
        res.status(200).json(updatedProject);
    } catch (error) {
        console.error(`Erreur mise à jour projet ${id}:`, error);
        if (error.code === 'P2025') return res.status(404).json({ message: "Projet non trouvé pour la mise à jour." });
        if (error.code === 'P2002') return res.status(409).json({ message: `Conflit: Un projet avec ce nom existe déjà.`, details: error.meta?.target });
        res.status(500).json({ message: "Erreur serveur lors de la mise à jour du projet.", error: error.message });
    }
};

export const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.project.delete({ where: { id } });
        res.status(200).json({ message: "Projet et ses tâches associées supprimés avec succès" });
    } catch (error) {
        console.error(`Erreur suppression projet ${id}:`, error);
        if (error.code === 'P2025') return res.status(404).json({ message: "Projet non trouvé pour la suppression." });
        res.status(500).json({ message: "Erreur serveur lors de la suppression du projet.", error: error.message });
    }
};

export const createTaskForProject = async (req, res) => {
    const { projectId } = req.params;
    const { nom, description, startDate, endDate, progress, status, priority, assigneeId, dependencies } = req.body;

    if (!nom || !startDate || !endDate) return res.status(400).json({ message: "Nom, date de début et date de fin de tâche sont requis." });
    if (!assigneeId) return res.status(400).json({ message: "La tâche doit être assignée à un membre." });

    try {
        const projectExists = await prisma.project.findUnique({ where: { id: projectId } });
        if (!projectExists) return res.status(404).json({ message: "Projet non trouvé." });
        if (assigneeId) {
            const assigneeExists = await prisma.user.findUnique({ where: { id: assigneeId } });
            if (!assigneeExists) return res.status(400).json({ message: `Utilisateur assigné avec ID ${assigneeId} non trouvé.` });
        }

        const newTaskData = {
            nom: String(nom).trim(),
            description: description || null,
            startDate: excelDateToJSDate(startDate),
            endDate: excelDateToJSDate(endDate),
            progress: progress && !isNaN(parseInt(String(progress))) ? parseInt(String(progress), 10) : 0,
            status: status || 'PENDING',
            priority: priority || null,
            assigneeId: assigneeId || null,
            dependencies: dependencies || null,
            projectId: projectId,
        };
        const createdTask = await prisma.task.create({ data: newTaskData });
        res.status(201).json(createdTask);
    } catch (error) {
        console.error(`Erreur création tâche pour projet ${projectId}:`, error);
        if (error.code === 'P2003' && error.meta?.field_name?.includes('assigneeId')) {
            return res.status(400).json({ message: `Erreur: Utilisateur assigné non valide.` });
        }
        res.status(500).json({ message: "Erreur serveur lors de la création de la tâche.", error: error.message });
    }
};