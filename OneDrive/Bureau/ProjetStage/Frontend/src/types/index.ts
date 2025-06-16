// src/types/index.ts

// --- Types Utilisateur ---
export interface User {
  id: string;
  name: string;
  firstName?: string; // Pour la cohérence avec le backend User model
  lastName?: string;  // Pour la cohérence avec le backend User model
  email: string;
  role: 'admin' | 'supervisor' | 'team_member' | 'client_contact'; // Ajout de client_contact
  avatar?: string;
  department?: string; // Rendu optionnel si ce n'est pas toujours présent
  position?: string;   // Rendu optionnel
  phone?: string;
  joinDate?: string;
}

// --- Types Projet ---
export interface Project {
  id: string;
  nomProjet: string;
  societe?: string | null;
  responsableRealisation?: string | null;
  priorite?: 'Haute' | 'Moyenne' | 'Modérée' | 'Basse' | null; // Ajout de null pour optionnel
  dateDebutPrevue?: string | null; // Format YYYY-MM-DD pour les inputs
  dateFinPrevue?: string | null;
  budget?: number | null;
  materials?: string | null;
  materialBudget?: number | null;
  commentaires?: string | null;
  validite?: 'VALIDE' | 'NON VALIDE' | null;
  serviceDemandeur?: string | null;
  demandeur?: string | null;
  site?: string | null;
  unite?: string | null;
  intervenant?: string | null;
  etat?: 'Planifié' | 'En cours' | 'Terminé' | 'Cloturé' | 'Bloqué' | 'En attente' | null;
  pourcentageAvance?: number | null;
  dateDebutReelle?: string | null;
  dateFinReelle?: string | null;
  createdAt?: string;
  updatedAt?: string; // Ajouté pour la cohérence avec Prisma
  tasks?: ProjectTaskCreateData[]; // Pour les tâches récupérées avec un projet
}

// --- Types Tâche ---

export type TaskDisplayStatus = 'completed' | 'in_progress' | 'delayed' | 'pending';

// Pour les données de tâche envoyées/reçues de l'API lors de la création/modification
export interface ProjectTaskCreateData {
  id?: string;
  nom: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  progress?: number;
  // Correspond à TaskStatusPrisma du backend
  status?: 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'DELAYED';
  priority?: 'Haute' | 'Moyenne' | 'Basse' | null;
  assigneeId?: string | null;
  assigneeName?: string; // Pour l'UI, non envoyé au backend
  dependencies?: string | null; // Chaîne d'IDs de tâches, ex: "id1,id2"
}

// Pour l'affichage des tâches dans le diagramme de Gantt
export interface GanttTaskForDisplay {
  id: string;
  name: string;
  startDate: string; // Doit être un format que le Gantt peut parser (Date object ou ISO string)
  endDate: string;
  progress: number;
  status: TaskDisplayStatus;
  assignee: string;
  dependencies?: string[]; // Tableau d'IDs de tâches
}


// --- Autres Types (basés sur votre deuxième ensemble de types) ---

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  address?: string;
  projects: string[]; // IDs des projets associés
}

// Ce type "Task" est plus détaillé que ProjectTaskCreateData,
// il pourrait représenter une tâche déjà existante dans la base de données.
export interface Task {
  id: string;
  projectId: string;
  title: string; // Similaire à 'nom' dans ProjectTaskCreateData
  description?: string; // Rendu optionnel
  assignedTo?: string[]; // Tableau d'IDs d'utilisateurs
  status: 'todo' | 'in_progress' | 'review' | 'completed'; // Différent de TaskDisplayStatus et TaskStatusPrisma
  priority: 'low' | 'medium' | 'high'; // Différent de ProjectTaskCreateData['priority']
  startDate: string;
  endDate: string;
  estimatedHours?: number; // Rendu optionnel
  actualHours?: number;    // Rendu optionnel
  dependencies?: string[]; // Tableau d'IDs
  isDelayed?: boolean;     // Rendu optionnel
}


export interface Comment {
  id: string;
  projectId: string;
  userId: string;
  content: string;
  timestamp: string;
  parentId?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'project_update' | 'task_assigned' | 'deadline_approaching' | 'delay_alert' | 'meeting_scheduled';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  projectId?: string;
  taskId?: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  projectId?: string;
  organizerId: string;
  participants: string[];
  startTime: string;
  endTime: string;
  type: 'zoom' | 'teams' | 'in_person';
  meetingLink?: string;
  agenda: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'award' | 'milestone' | 'training' | 'meeting';
  date: string;
  participants: string[];
  prize?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  // Si Task est le type détaillé, Omit est correct.
  // Si c'est pour créer des tâches, peut-être un type plus simple.
  tasks: Omit<Task, 'id' | 'projectId'>[];
  estimatedDuration: number;
  requiredSkills: string[];
}

export interface Activity {
  id: string;
  type: 'project_created' | 'task_completed' | 'milestone_reached' | 'delay_reported';
  message: string;
  timestamp: string;
  userId: string;
  projectId?: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  delayedProjects: number;
  totalTeamMembers: number;
  averageProgress: number;
  upcomingDeadlines: number;
  recentActivities: Activity[];
}