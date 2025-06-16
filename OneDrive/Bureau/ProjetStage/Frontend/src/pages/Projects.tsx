// src/pages/Projects.tsx
import React, { useState } from 'react';
import { Plus, Download, FileText as FileIconLucide, Search, Calendar, Users, Eye, UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GanttChart } from '@/components/GanttChart';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project, User, GanttTaskForDisplay, ProjectTaskCreateData, TaskDisplayStatus } from '@/types';

const API_BASE_URL = 'http://localhost:3000/api';

const fetchProjects = async (): Promise<Project[]> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/projects`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      window.location.href = '/signin';
      throw new Error('Authentification requise ou non autorisée.');
    }
    throw new Error('Impossible de récupérer les projets');
  }
  const projectsFromApi: Project[] = await response.json();
  return projectsFromApi.map(p => ({
    ...p,
    dateDebutPrevue: p.dateDebutPrevue ? new Date(p.dateDebutPrevue).toISOString().split('T')[0] : undefined,
    dateFinPrevue: p.dateFinPrevue ? new Date(p.dateFinPrevue).toISOString().split('T')[0] : undefined,
    dateDebutReelle: p.dateDebutReelle ? new Date(p.dateDebutReelle).toISOString().split('T')[0] : undefined,
    dateFinReelle: p.dateFinReelle ? new Date(p.dateFinReelle).toISOString().split('T')[0] : undefined,
    tasks: p.tasks ? p.tasks.map(t => ({
      ...t,
      startDate: t.startDate ? new Date(t.startDate).toISOString().split('T')[0] : '',
      endDate: t.endDate ? new Date(t.endDate).toISOString().split('T')[0] : '',
    })) : [],
  }));
};

const createNewProjectAPI = async (projectData: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>> & { tasks?: ProjectTaskCreateData[] }): Promise<Project> => {
  const token = localStorage.getItem('token');
  const dataToSend: any = {
    ...projectData,
    budget: projectData.budget !== undefined && projectData.budget !== null ? parseFloat(String(projectData.budget)) : null,
    materialBudget: projectData.materialBudget !== undefined && projectData.materialBudget !== null ? parseFloat(String(projectData.materialBudget)) : null,
    pourcentageAvance: projectData.pourcentageAvance !== undefined && projectData.pourcentageAvance !== null ? parseInt(String(projectData.pourcentageAvance), 10) : null,
    dateDebutPrevue: projectData.dateDebutPrevue ? new Date(projectData.dateDebutPrevue).toISOString() : null,
    dateFinPrevue: projectData.dateFinPrevue ? new Date(projectData.dateFinPrevue).toISOString() : null,
    dateDebutReelle: projectData.dateDebutReelle ? new Date(projectData.dateDebutReelle).toISOString() : null,
    dateFinReelle: projectData.dateFinReelle ? new Date(projectData.dateFinReelle).toISOString() : null,
  };

  if (projectData.tasks) {
    dataToSend.tasks = projectData.tasks.map(task => {
      const { assigneeName, ...taskData } = task;
      return {
        ...taskData,
        startDate: taskData.startDate ? new Date(taskData.startDate).toISOString() : null,
        endDate: taskData.endDate ? new Date(taskData.endDate).toISOString() : null,
        progress: taskData.progress !== undefined ? parseInt(String(taskData.progress)) : 0,
        assigneeId: taskData.assigneeId || null,
      };
    });
  }

  Object.keys(dataToSend).forEach(key => {
    const typedKey = key as keyof typeof dataToSend;
    if (dataToSend[typedKey] === undefined) delete dataToSend[typedKey];
  });

  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(dataToSend),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Impossible de créer le projet');
  }
  return response.json();
};

const uploadExcelAPI = async (file: File): Promise<any> => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('excelFile', file);
  const response = await fetch(`${API_BASE_URL}/projects/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Impossible de téléverser le fichier Excel");
  }
  return response.json();
};

const createTaskForProjectAPI = async (projectId: string, taskData: ProjectTaskCreateData): Promise<ProjectTaskCreateData> => {
  const token = localStorage.getItem('token');
  const dataToSend = {
    ...taskData,
    startDate: taskData.startDate ? new Date(taskData.startDate).toISOString() : null,
    endDate: taskData.endDate ? new Date(taskData.endDate).toISOString() : null,
    progress: taskData.progress !== undefined ? parseInt(String(taskData.progress)) : 0,
  };
  const { assigneeName, ...payload } = dataToSend;

  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Impossible de créer la tâche pour le projet');
  }
  return response.json();
};


export default function Projects() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedProjectsForDownload, setSelectedProjectsForDownload] = useState<string[]>([]);
  const [showGanttForProject, setShowGanttForProject] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState<Project | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);

  const initialProjectFormValues: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>> & { tasks: ProjectTaskCreateData[] } = {
    nomProjet: '', societe: undefined, responsableRealisation: undefined, priorite: 'Moyenne',
    dateDebutPrevue: '', dateFinPrevue: '', budget: undefined, materials: undefined,
    materialBudget: undefined, commentaires: undefined, validite: 'VALIDE', serviceDemandeur: undefined,
    demandeur: undefined, site: undefined, unite: undefined, intervenant: undefined, etat: 'Planifié',
    pourcentageAvance: 0, dateDebutReelle: '', dateFinReelle: '', tasks: [],
  };
  const [createProjectForm, setCreateProjectForm] = useState(initialProjectFormValues);

  const initialSingleTaskState: ProjectTaskCreateData = {
    nom: '', startDate: '', endDate: '', assigneeId: '',
    assigneeName: '', status: 'PENDING', priority: 'Moyenne', progress: 0,
  };
  const [currentTaskEntry, setCurrentTaskEntry] = useState<ProjectTaskCreateData>(initialSingleTaskState);
  const [newTaskForExistingProject, setNewTaskForExistingProject] = useState<ProjectTaskCreateData>(initialSingleTaskState);


  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['usersForTaskAssignment'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users?role=team_member,supervisor`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Impossible de récupérer les utilisateurs');
      const usersData: any[] = await response.json();
      return usersData.map(u => ({ ...u, name: u.name || `${u.firstName} ${u.lastName}` })) as User[];
    },
  });

  const { data: projectsFromAPI = [], isLoading, isError, error } = useQuery<Project[], Error>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const createProjectMutation = useMutation<Project, Error, Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>> & { tasks: ProjectTaskCreateData[] }>({
    mutationFn: createNewProjectAPI,
    onSuccess: (data) => {
      toast({ title: "Projet créé", description: `Le projet "${data.nomProjet}" et ses tâches ont été créés.` });
      setShowCreateForm(false);
      setCreateProjectForm(initialProjectFormValues);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message || "Impossible de créer le projet.", variant: "destructive" });
    },
  });

  const uploadExcelMutation = useMutation<any, Error, File>({
    mutationFn: uploadExcelAPI,
    onSuccess: (data) => {
      toast({ title: "Importation réussie", description: data.message || `${data.importedCount} projets importés.` });
      setShowImportForm(false);
      setExcelFile(null);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (err) => {
      toast({ title: "Erreur d'importation", description: err.message || "Erreur inconnue.", variant: "destructive" });
    }
  });

  const addTaskToProjectMutation = useMutation<ProjectTaskCreateData, Error, { projectId: string; taskData: ProjectTaskCreateData }>({
    mutationFn: ({ projectId, taskData }) => createTaskForProjectAPI(projectId, taskData),
    onSuccess: (newTaskData, variables) => {
      toast({ title: "Tâche ajoutée", description: `La tâche "${newTaskData.nom}" a été ajoutée au projet.` });
      setNewTaskForExistingProject(initialSingleTaskState);
      queryClient.setQueryData(['projects'], (oldData: Project[] | undefined) =>
        oldData?.map(project =>
          project.id === variables.projectId
            ? { ...project, tasks: [...(project.tasks || []), newTaskData] }
            : project
        )
      );
      if (showProjectDetails && showProjectDetails.id === variables.projectId) {
        setShowProjectDetails(prev => prev ? { ...prev, tasks: [...(prev.tasks || []), newTaskData] } : null);
      }
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message || "Impossible d'ajouter la tâche.", variant: "destructive" });
    },
  });

  const handleCreateFormChange = (field: keyof Omit<typeof initialProjectFormValues, 'tasks'>, value: string) => {
    if (field === 'budget' || field === 'materialBudget' || field === 'pourcentageAvance') {
      const numericValue = value === '' ? undefined : (field === 'pourcentageAvance' ? parseInt(value, 10) : parseFloat(value));
      if (value === '' || (numericValue !== undefined && !isNaN(numericValue))) {
        if (field === 'pourcentageAvance' && numericValue !== undefined && (numericValue < 0 || numericValue > 100)) return;
        setCreateProjectForm(prev => ({ ...prev, [field]: numericValue as any }));
      }
    } else {
      setCreateProjectForm(prev => ({ ...prev, [field]: value as any }));
    }
  };

  const handleCurrentTaskEntryChange = (field: keyof ProjectTaskCreateData, value: string | number | undefined) => {
    setCurrentTaskEntry(prev => ({ ...prev, [field]: value }));
  };

  const handleNewTaskForExistingProjectChange = (field: keyof ProjectTaskCreateData, value: string | number | undefined) => {
    setNewTaskForExistingProject(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTaskToForm = () => {
    if (!currentTaskEntry.nom || !currentTaskEntry.startDate || !currentTaskEntry.endDate) {
      toast({ title: "Erreur", description: "Nom, date de début et date de fin de tâche requis.", variant: "destructive" });
      return;
    }
    if (!currentTaskEntry.assigneeId) {
      toast({ title: "Erreur", description: "Veuillez assigner la tâche à un membre.", variant: "destructive" });
      return;
    }
    const assignee = users.find(u => u.id === currentTaskEntry.assigneeId);
    setCreateProjectForm(prev => ({
      ...prev,
      tasks: [...prev.tasks, { ...currentTaskEntry, assigneeName: assignee ? assignee.name : 'Assignation invalide' }],
    }));
    setCurrentTaskEntry(initialSingleTaskState);
  };

  const handleRemoveTaskFromForm = (index: number) => {
    setCreateProjectForm(prev => ({ ...prev, tasks: prev.tasks.filter((_, i) => i !== index) }));
  };

  const handleCreateProjectSubmit = () => {
    if (!createProjectForm.nomProjet) {
      toast({ title: "Erreur", description: "Le nom du projet est obligatoire.", variant: "destructive" });
      return;
    }
    const tasksToSubmit = createProjectForm.tasks.map(({ assigneeName, ...task }) => task);
    if (tasksToSubmit.some(task => !task.assigneeId)) {
      toast({ title: "Erreur", description: "Toutes les tâches ajoutées doivent être assignées.", variant: "destructive" });
      return;
    }
    createProjectMutation.mutate({ ...createProjectForm, tasks: tasksToSubmit });
  };

  const handleSubmitTaskForExistingProject = () => {
    if (!showProjectDetails || !showProjectDetails.id) {
      toast({ title: "Erreur", description: "Aucun projet sélectionné pour ajouter la tâche.", variant: "destructive" });
      return;
    }
    if (!newTaskForExistingProject.nom || !newTaskForExistingProject.startDate || !newTaskForExistingProject.endDate) {
      toast({ title: "Erreur", description: "Nom, date de début et date de fin de tâche requis.", variant: "destructive" });
      return;
    }
    if (!newTaskForExistingProject.assigneeId) {
      toast({ title: "Erreur", description: "Veuillez assigner la tâche à un membre.", variant: "destructive" });
      return;
    }
    addTaskToProjectMutation.mutate({ projectId: showProjectDetails.id, taskData: newTaskForExistingProject });
  };

  const handleExcelFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) setExcelFile(event.target.files[0]);
    else setExcelFile(null);
  };
  const handleImportProjectSubmit = () => {
    if (excelFile) uploadExcelMutation.mutate(excelFile);
    else toast({ title: "Aucun fichier", description: "Veuillez sélectionner un fichier Excel.", variant: "destructive" });
  };

  const getStatusBadge = (status?: Project['etat']): JSX.Element => {
    if (!status) return <Badge variant="outline">Non défini</Badge>;
    const statusLower = status.toLowerCase();
    let variant: "default" | "secondary" | "outline" | "destructive" = "outline";
    if (statusLower.includes('cours') || statusLower.includes('planifié')) variant = 'default';
    else if (statusLower.includes('terminé') || statusLower.includes('cloturé')) variant = 'secondary';
    else if (statusLower.includes('bloqué')) variant = 'destructive';
    return <Badge variant={variant}>{status}</Badge>;
  };
  const getPriorityBadge = (priority?: Project['priorite']): JSX.Element => {
    if (!priority) return <Badge variant="outline">Non défini</Badge>;
    const priorityLower = priority.toLowerCase();
    let variant: "destructive" | "default" | "secondary" = "secondary";
    if (priorityLower.includes('haute')) variant = 'destructive';
    else if (priorityLower.includes('moyenne') || priorityLower.includes('modérée')) variant = 'default';
    return <Badge variant={variant}>{priority}</Badge>;
  };

  const filteredAndSortedProjects = projectsFromAPI
    .filter(project => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = project.nomProjet.toLowerCase().includes(searchLower) ||
        (project.societe || '').toLowerCase().includes(searchLower) ||
        (project.demandeur || '').toLowerCase().includes(searchLower) ||
        (project.responsableRealisation || '').toLowerCase().includes(searchLower);
      const projectEtatLower = (project.etat || '').toLowerCase();
      const projectPriorityLower = (project.priorite || '').toLowerCase();
      const matchesStatus = statusFilter === 'all' || projectEtatLower === statusFilter.toLowerCase();
      const matchesPriority = priorityFilter === 'all' || projectPriorityLower === priorityFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  const handleProjectSelectForDownload = (projectId: string, checked: boolean | "indeterminate") => {
    const isChecked = checked === true;
    setSelectedProjectsForDownload(prev => isChecked ? [...prev, projectId] : prev.filter(id => id !== projectId));
  };
  const handleSelectAllForDownload = (checked: boolean | "indeterminate") => {
    if (checked === true) setSelectedProjectsForDownload(filteredAndSortedProjects.map(p => p.id));
    else setSelectedProjectsForDownload([]);
  };
  const downloadSelectedProjects = () => {
    toast({ title: "Info", description: `Téléchargement de ${selectedProjectsForDownload.length} projet(s) non implémenté.` });
  };

  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-royal-600"></div><span className="ml-3">Chargement des projets...</span></div>;
  if (isError && error) return <div className="text-red-600 text-center p-4">Erreur: {error.message}</div>;

  const renderCreateFormFields = () => (<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4">
    <div className="space-y-1 md:col-span-2"><Label htmlFor="create-nomProjet">Nom du projet *</Label><Input id="create-nomProjet" value={createProjectForm.nomProjet || ''} onChange={(e) => handleCreateFormChange('nomProjet', e.target.value)} placeholder="Nom du projet" className="border-blue-500 ring-1 ring-blue-500 focus:ring-blue-700" /></div>
    <div className="space-y-1"><Label htmlFor="create-societe">Client (Société)</Label><Input id="create-societe" value={createProjectForm.societe || ''} onChange={(e) => handleCreateFormChange('societe', e.target.value)} placeholder="Nom du client" /></div>
    <div className="space-y-1"><Label htmlFor="create-responsableRealisation">Responsable réalisation</Label><Input id="create-responsableRealisation" value={createProjectForm.responsableRealisation || ''} onChange={(e) => handleCreateFormChange('responsableRealisation', e.target.value)} placeholder="Nom du responsable" /></div>
    <div className="space-y-1"><Label htmlFor="create-demandeur">Demandeur</Label><Input id="create-demandeur" value={createProjectForm.demandeur || ''} onChange={(e) => handleCreateFormChange('demandeur', e.target.value)} placeholder="Nom du demandeur" /></div>
    <div className="space-y-1"><Label htmlFor="create-intervenant">Intervenant</Label><Input id="create-intervenant" value={createProjectForm.intervenant || ''} onChange={(e) => handleCreateFormChange('intervenant', e.target.value)} placeholder="Nom de l'intervenant" /></div>
    <div className="space-y-1"><Label htmlFor="create-priorite">Priorité</Label><Select value={createProjectForm.priorite} onValueChange={(value) => handleCreateFormChange('priorite', value as Project['priorite'])}><SelectTrigger id="create-priorite"><SelectValue /></SelectTrigger><SelectContent>{(['Haute', 'Moyenne', 'Modérée', 'Basse'] as const).map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
    <div className="space-y-1"><Label htmlFor="create-etat">État</Label><Select value={createProjectForm.etat} onValueChange={(value) => handleCreateFormChange('etat', value as Project['etat'])}><SelectTrigger id="create-etat"><SelectValue /></SelectTrigger><SelectContent>{(['Planifié', 'En cours', 'Terminé', 'Cloturé', 'Bloqué', 'En attente'] as const).map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
    <div className="space-y-1"><Label htmlFor="create-dateDebutPrevue">Date de début (prévue)</Label><Input id="create-dateDebutPrevue" type="date" value={createProjectForm.dateDebutPrevue || ''} onChange={(e) => handleCreateFormChange('dateDebutPrevue', e.target.value)} /></div>
    <div className="space-y-1"><Label htmlFor="create-dateFinPrevue">Date de fin (prévue)</Label><Input id="create-dateFinPrevue" type="date" value={createProjectForm.dateFinPrevue || ''} onChange={(e) => handleCreateFormChange('dateFinPrevue', e.target.value)} /></div>
    <div className="space-y-1"><Label htmlFor="create-budget">Budget (€)</Label><Input id="create-budget" type="number" value={createProjectForm.budget === undefined ? '' : String(createProjectForm.budget)} onChange={(e) => handleCreateFormChange('budget', e.target.value)} placeholder="Ex: 50000" step="0.01" /></div>
    <div className="space-y-1"><Label htmlFor="create-materials">Matériaux utilisés</Label><Input id="create-materials" value={createProjectForm.materials || ''} onChange={(e) => handleCreateFormChange('materials', e.target.value)} placeholder="Ex: Béton, Bois, Fer..." /></div>
    <div className="space-y-1 md:col-span-2"><Label htmlFor="create-materialBudget">Budget matériaux (TND)</Label><Input id="create-materialBudget" type="number" value={createProjectForm.materialBudget === undefined ? '' : String(createProjectForm.materialBudget)} onChange={(e) => handleCreateFormChange('materialBudget', e.target.value)} placeholder="Ex: 5000" step="0.01" /></div>
    <div className="space-y-1"><Label htmlFor="create-validite">Validité</Label><Select value={createProjectForm.validite} onValueChange={(value) => handleCreateFormChange('validite', value as Project['validite'])}><SelectTrigger id="create-validite"><SelectValue /></SelectTrigger><SelectContent>{(['VALIDE', 'NON VALIDE'] as const).map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
    <div className="space-y-1"><Label htmlFor="create-serviceDemandeur">Service demandeur</Label><Input id="create-serviceDemandeur" value={createProjectForm.serviceDemandeur || ''} onChange={(e) => handleCreateFormChange('serviceDemandeur', e.target.value)} placeholder="Service demandeur" /></div>
    <div className="space-y-1"><Label htmlFor="create-site">Site</Label><Input id="create-site" value={createProjectForm.site || ''} onChange={(e) => handleCreateFormChange('site', e.target.value)} placeholder="Site" /></div>
    <div className="space-y-1"><Label htmlFor="create-unite">Unité</Label><Input id="create-unite" value={createProjectForm.unite || ''} onChange={(e) => handleCreateFormChange('unite', e.target.value)} placeholder="Unité" /></div>
    <div className="space-y-1"><Label htmlFor="create-pourcentageAvance">Pourcentage d'avance (%)</Label><Input id="create-pourcentageAvance" type="number" value={String(createProjectForm.pourcentageAvance ?? '')} onChange={(e) => handleCreateFormChange('pourcentageAvance', e.target.value)} placeholder="Ex: 75" min="0" max="100" /></div>
    <div className="space-y-1"><Label htmlFor="create-dateDebutReelle">Date de début (réelle)</Label><Input id="create-dateDebutReelle" type="date" value={createProjectForm.dateDebutReelle || ''} onChange={(e) => handleCreateFormChange('dateDebutReelle', e.target.value)} /></div>
    <div className="space-y-1"><Label htmlFor="create-dateFinReelle">Date de fin (réelle)</Label><Input id="create-dateFinReelle" type="date" value={createProjectForm.dateFinReelle || ''} onChange={(e) => handleCreateFormChange('dateFinReelle', e.target.value)} /></div>
    <div className="space-y-1 md:col-span-2"><Label htmlFor="create-commentaires">Commentaires (Description)</Label><Textarea id="create-commentaires" value={createProjectForm.commentaires || ''} onChange={(e) => handleCreateFormChange('commentaires', e.target.value)} placeholder="Description détaillée ou commentaires..." rows={3} /></div>
  </div>);

  const renderTaskEntryForm = () => (
    <div className="mt-6 pt-4 border-t">
      <h3 className="text-lg font-semibold mb-3">Ajouter des Tâches au Projet</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-md mb-4 bg-slate-50">
        <div className="space-y-1 lg:col-span-3"><Label htmlFor="task-nom">Nom de la tâche *</Label><Input id="task-nom" value={currentTaskEntry.nom} onChange={(e) => handleCurrentTaskEntryChange('nom', e.target.value)} placeholder="Nom de la tâche" /></div>
        <div className="space-y-1"><Label htmlFor="task-startDate">Date de début *</Label><Input id="task-startDate" type="date" value={currentTaskEntry.startDate} onChange={(e) => handleCurrentTaskEntryChange('startDate', e.target.value)} /></div>
        <div className="space-y-1"><Label htmlFor="task-endDate">Date de fin *</Label><Input id="task-endDate" type="date" value={currentTaskEntry.endDate} onChange={(e) => handleCurrentTaskEntryChange('endDate', e.target.value)} /></div>
        <div className="space-y-1"><Label htmlFor="task-assigneeId">Assigner à *</Label><Select value={currentTaskEntry.assigneeId || ''} onValueChange={(value) => handleCurrentTaskEntryChange('assigneeId', value)}><SelectTrigger id="task-assigneeId"><SelectValue placeholder="Sélectionner un membre" /></SelectTrigger><SelectContent>{users.map(user => (<SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>))}</SelectContent></Select></div>
        <div className="space-y-1"><Label htmlFor="task-priority">Priorité Tâche</Label><Select value={currentTaskEntry.priority || 'Moyenne'} onValueChange={(value) => handleCurrentTaskEntryChange('priority', value as ProjectTaskCreateData['priority'])}><SelectTrigger id="task-priority"><SelectValue /></SelectTrigger><SelectContent>{(['Haute', 'Moyenne', 'Basse'] as const).map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-1"><Label htmlFor="task-status">Statut Tâche</Label><Select value={currentTaskEntry.status || 'PENDING'} onValueChange={(value) => handleCurrentTaskEntryChange('status', value as ProjectTaskCreateData['status'])}><SelectTrigger id="task-status"><SelectValue /></SelectTrigger><SelectContent>{(['PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'DELAYED'] as const).map(opt => <SelectItem key={opt} value={opt}>{opt.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-1"><Label htmlFor="task-progress">Progression Tâche (%)</Label><Input id="task-progress" type="number" min="0" max="100" value={String(currentTaskEntry.progress ?? 0)} onChange={(e) => handleCurrentTaskEntryChange('progress', parseInt(e.target.value))} /></div>
        <div className="lg:col-span-3"><Button type="button" onClick={handleAddTaskToForm} size="sm" variant="outline"><Plus className="h-4 w-4 mr-2" /> Ajouter cette tâche au projet</Button></div>
      </div>
      {createProjectForm.tasks.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className="font-medium">Tâches à créer avec le projet :</h4>
          {createProjectForm.tasks.map((task, index) => (
            <div key={index} className="flex justify-between items-center p-2 border rounded-md text-sm bg-white">
              <div><span className="font-semibold">{task.nom}</span> ({task.startDate} - {task.endDate}){task.assigneeName && <span className="ml-2 text-xs text-muted-foreground">Assigné à: {task.assigneeName}</span>}</div>
              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveTaskFromForm(index)} className="text-red-500 hover:text-red-700 h-7 w-7"><X className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const convertProjectTasksToGanttTasks = (project?: Project | null): GanttTaskForDisplay[] => {
    if (!project) return [];
    const tasksSource = project.tasks && project.tasks.length > 0 ? project.tasks : [];

    if (tasksSource.length > 0) {
      return tasksSource.map(task => {
        const assigneeUser = users.find(u => u.id === task.assigneeId);
        let displayStatus: TaskDisplayStatus = 'pending';
        if (task.status) {
          const statusLower = task.status.toLowerCase();
          if (statusLower === 'completed') displayStatus = 'completed';
          else if (statusLower.includes('progress') || statusLower === 'review') displayStatus = 'in_progress';
          else if (statusLower === 'delayed') displayStatus = 'delayed';
        }
        return {
          id: task.id || `task-${project.id}-${Math.random().toString(16).slice(2)}`,
          name: task.nom,
          startDate: task.startDate,
          endDate: task.endDate,
          progress: task.progress || 0,
          status: displayStatus,
          assignee: assigneeUser ? assigneeUser.name : (task.assigneeName || 'Non assigné'),
          dependencies: task.dependencies ? task.dependencies.split(',').map(d => d.trim()) : undefined,
        };
      });
    }
    if (project.dateDebutPrevue && project.dateFinPrevue) {
      let projectDisplayStatus: TaskDisplayStatus = 'pending';
      const etatLower = (project.etat || '').toLowerCase();
      if (etatLower.includes('terminé') || etatLower.includes('cloturé')) projectDisplayStatus = 'completed';
      else if (etatLower.includes('bloqué')) projectDisplayStatus = 'delayed';
      else if (etatLower.includes('cours') || etatLower.includes('planifié')) projectDisplayStatus = 'in_progress';

      return [{
        id: project.id, name: project.nomProjet,
        startDate: project.dateDebutPrevue, endDate: project.dateFinPrevue,
        progress: project.pourcentageAvance || 0,
        status: projectDisplayStatus,
        assignee: project.responsableRealisation || "N/A"
      }];
    }
    return [];
  };

  const renderProjectDetailsDialog = () => {
    if (!showProjectDetails) return null;
    const ganttTasksForDetails = convertProjectTasksToGanttTasks(showProjectDetails);
    let projectOverallProgress = showProjectDetails.pourcentageAvance || 0;
    if (showProjectDetails.tasks && showProjectDetails.tasks.length > 0) {
      const totalProgress = showProjectDetails.tasks.reduce((sum, task) => sum + (task.progress || 0), 0);
      projectOverallProgress = Math.round(totalProgress / showProjectDetails.tasks.length);
    }

    return (
      <Dialog open={!!showProjectDetails} onOpenChange={() => setShowProjectDetails(null)}>
        <DialogContent className="max-w-5xl max-h-[95vh] flex flex-col">
          <DialogHeader><DialogTitle>Détails du Projet: {showProjectDetails.nomProjet}</DialogTitle></DialogHeader>
          <div className="flex-grow overflow-y-auto pr-2 space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card><CardHeader><CardTitle>Informations Générales</CardTitle></CardHeader><CardContent className="space-y-2 text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1"><p><strong>Société:</strong> {showProjectDetails.societe || 'N/A'}</p><p><strong>Demandeur:</strong> {showProjectDetails.demandeur || 'N/A'}</p><p><strong>Serv. Demandeur:</strong> {showProjectDetails.serviceDemandeur || 'N/A'}</p><p><strong>Resp. Réalisation:</strong> {showProjectDetails.responsableRealisation || 'N/A'}</p><p><strong>Intervenant:</strong> {showProjectDetails.intervenant || 'N/A'}</p><p><strong>Site:</strong> {showProjectDetails.site || 'N/A'}</p><p><strong>Unité:</strong> {showProjectDetails.unite || 'N/A'}</p><div className="flex items-center gap-1"><strong>État:</strong> {getStatusBadge(showProjectDetails.etat)}</div><div className="flex items-center gap-1"><strong>Priorité:</strong> {getPriorityBadge(showProjectDetails.priorite)}</div><p><strong>Validité:</strong> {showProjectDetails.validite || 'N/A'}</p></CardContent></Card>
              <Card><CardHeader><CardTitle>Dates & Progression Globale</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><p><strong>Début Prévu:</strong> {showProjectDetails.dateDebutPrevue || 'N/A'}</p><p><strong>Fin Prévue:</strong> {showProjectDetails.dateFinPrevue || 'N/A'}</p><p><strong>Début Réel:</strong> {showProjectDetails.dateDebutReelle || 'N/A'}</p><p><strong>Fin Réelle:</strong> {showProjectDetails.dateFinReelle || 'N/A'}</p><div className="mt-2"><Label>Avancement Global: {projectOverallProgress}%</Label><Progress value={projectOverallProgress} className="h-3 mt-1" /></div></CardContent></Card>
            </div>
            <Card><CardHeader><CardTitle>Budget & Matériaux</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><p><strong>Budget Total (€):</strong> {showProjectDetails.budget?.toLocaleString() ?? 'N/A'}</p><p><strong>Matériaux:</strong> {showProjectDetails.materials || 'N/A'}</p><p><strong>Budget Matériaux (TND):</strong> {showProjectDetails.materialBudget?.toLocaleString() ?? 'N/A'}</p></CardContent></Card>
            {showProjectDetails.commentaires && (<Card><CardHeader><CardTitle>Commentaires</CardTitle></CardHeader><CardContent><p className="text-sm whitespace-pre-wrap">{showProjectDetails.commentaires}</p></CardContent></Card>)}

            <Card>
              <CardHeader><div className="flex justify-between items-center"><CardTitle>Tâches du Projet</CardTitle></div></CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 border rounded-md mb-4 bg-slate-50">
                  <h4 className="text-md font-semibold mb-3">Ajouter une nouvelle tâche à ce projet</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1 lg:col-span-3"><Label htmlFor="new-task-ex-nom">Nom *</Label><Input id="new-task-ex-nom" value={newTaskForExistingProject.nom} onChange={(e) => handleNewTaskForExistingProjectChange('nom', e.target.value)} /></div>
                    <div className="space-y-1"><Label htmlFor="new-task-ex-startDate">Début *</Label><Input id="new-task-ex-startDate" type="date" value={newTaskForExistingProject.startDate} onChange={(e) => handleNewTaskForExistingProjectChange('startDate', e.target.value)} /></div>
                    <div className="space-y-1"><Label htmlFor="new-task-ex-endDate">Fin *</Label><Input id="new-task-ex-endDate" type="date" value={newTaskForExistingProject.endDate} onChange={(e) => handleNewTaskForExistingProjectChange('endDate', e.target.value)} /></div>
                    <div className="space-y-1"><Label htmlFor="new-task-ex-assigneeId">Assigner à *</Label><Select value={newTaskForExistingProject.assigneeId || ''} onValueChange={(value) => handleNewTaskForExistingProjectChange('assigneeId', value)}><SelectTrigger><SelectValue placeholder="Choisir membre" /></SelectTrigger><SelectContent>{users.filter(user => user.role === 'team_member').map(user => (<SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>))}</SelectContent></Select></div>
                    <div className="space-y-1"><Label htmlFor="new-task-ex-priority">Priorité</Label><Select value={newTaskForExistingProject.priority || 'Moyenne'} onValueChange={(v) => handleNewTaskForExistingProjectChange('priority', v as ProjectTaskCreateData['priority'])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(['Haute', 'Moyenne', 'Basse'] as const).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-1"><Label htmlFor="new-task-ex-status">Statut</Label><Select value={newTaskForExistingProject.status || 'PENDING'} onValueChange={(v) => handleNewTaskForExistingProjectChange('status', v as ProjectTaskCreateData['status'])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(['PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'DELAYED'] as const).map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-1"><Label htmlFor="new-task-ex-progress">Prog. (%)</Label><Input id="new-task-ex-progress" type="number" min="0" max="100" value={String(newTaskForExistingProject.progress ?? 0)} onChange={(e) => handleNewTaskForExistingProjectChange('progress', parseInt(e.target.value))} /></div>
                    <div className="lg:col-span-3 mt-2"><Button size="sm" onClick={handleSubmitTaskForExistingProject} disabled={addTaskToProjectMutation.isPending}>{addTaskToProjectMutation.isPending ? "Ajout..." : "Ajouter la Tâche"}</Button></div>
                  </div>
                </div>
                {(showProjectDetails.tasks && showProjectDetails.tasks.length > 0) ? (
                  showProjectDetails.tasks.map(task => {
                    const assigneeUser = users.find(u => u.id === task.assigneeId);
                    return (<div key={task.id || task.nom} className="p-3 border rounded text-sm bg-white shadow-sm"><div className="flex justify-between items-start"><div><p className="font-semibold text-base">{task.nom}</p><p className="text-xs text-muted-foreground">Du {task.startDate} au {task.endDate}</p><p className="text-xs text-muted-foreground">Assigné à: {assigneeUser ? assigneeUser.name : (task.assigneeName || 'N/A')}</p><p className="text-xs text-muted-foreground">Statut: {task.status} - Priorité: {task.priority || 'N/A'}</p></div></div><div className="flex items-center gap-2 mt-1.5"><Label className="text-xs">Progression:</Label><Progress value={task.progress || 0} className="h-2.5 flex-grow" /><span className="text-xs font-medium">{task.progress || 0}%</span></div></div>);
                  })
                ) : (<p className="text-muted-foreground italic">Aucune tâche détaillée pour ce projet.</p>)}
              </CardContent>
            </Card>
            {(ganttTasksForDetails.length > 0) && (
              <Card><CardHeader><CardTitle>Chronologie (Gantt)</CardTitle></CardHeader><CardContent>
                <GanttChart tasks={ganttTasksForDetails} projectStartDate={showProjectDetails.dateDebutPrevue || ganttTasksForDetails[0]?.startDate || new Date().toISOString()} projectEndDate={showProjectDetails.dateFinPrevue || ganttTasksForDetails.slice(-1)[0]?.endDate || new Date().toISOString()} title="" />
              </CardContent></Card>
            )}
          </div>
          <DialogFooter className="mt-auto pt-4 border-t"><Button variant="outline" onClick={() => setShowProjectDetails(null)}>Fermer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h1 className="text-2xl md:text-3xl font-bold text-royal-900">Gestion des Projets</h1><p className="text-muted-foreground">Créer, gérer et suivre vos projets</p></div>
        {selectedProjectsForDownload.length > 0 && (<Button onClick={downloadSelectedProjects} className="bg-royal-600 hover:bg-royal-700 text-white self-start sm:self-center"><Download className="h-4 w-4 mr-2" /> Télécharger ({selectedProjectsForDownload.length})</Button>)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer transition-all duration-200 border-dashed border-2 hover:border-royal-300 hover:bg-royal-50/30" onClick={() => { setCreateProjectForm(initialProjectFormValues); setCurrentTaskEntry(initialSingleTaskState); setShowCreateForm(true); }}><CardContent className="p-6 text-center flex flex-col items-center justify-center h-full"><div className="w-16 h-16 mb-4 royal-gradient rounded-full flex items-center justify-center"> <Plus className="h-8 w-8 text-white" /> </div><h3 className="text-lg font-semibold mb-2">Créer un Nouveau Projet</h3><p className="text-sm text-muted-foreground">Partir de zéro et configurer.</p></CardContent></Card>
        <Card className="cursor-pointer transition-all duration-200 border-royal-200 hover:border-royal-300 hover:bg-royal-50/30" onClick={() => { setExcelFile(null); setShowImportForm(true); }}><CardContent className="p-6 text-center flex flex-col items-center justify-center h-full"><div className="w-16 h-16 mb-4 royal-gradient rounded-full flex items-center justify-center"> <UploadCloud className="h-8 w-8 text-white" /> </div><h3 className="text-lg font-semibold mb-2">Importer depuis Excel</h3><p className="text-sm text-muted-foreground">Télécharger un fichier Excel.</p></CardContent></Card>
        <Card className="cursor-pointer transition-all duration-200 border-beige-200 hover:border-beige-300 hover:bg-beige-50/30" onClick={() => toast({ title: "Info", description: "Fonctionnalité à venir." })}><CardContent className="p-6 text-center flex flex-col items-center justify-center h-full"><div className="w-16 h-16 mb-4 royal-gradient rounded-full flex items-center justify-center"> <FileIconLucide className="h-8 w-8 text-white" /> </div><h3 className="text-lg font-semibold mb-2">Depuis un Template</h3><p className="text-sm text-muted-foreground">Utiliser un modèle prédéfini.</p></CardContent></Card>
      </div>
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl max-h-[95vh] flex flex-col">
          <DialogHeader><DialogTitle>Créer un Nouveau Projet</DialogTitle></DialogHeader>
          <div className="flex-grow overflow-y-auto pr-2">{renderCreateFormFields()}{renderTaskEntryForm()}</div>
          <DialogFooter className="mt-auto pt-4 border-t"><Button variant="outline" onClick={() => setShowCreateForm(false)}>Annuler</Button><Button onClick={handleCreateProjectSubmit} disabled={createProjectMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white">{createProjectMutation.isPending ? 'Enregistrement...' : 'Enregistrer Projet'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showImportForm} onOpenChange={setShowImportForm}>
        <DialogContent><DialogHeader><DialogTitle>Importer des Projets depuis Excel</DialogTitle></DialogHeader><div className="space-y-4 py-4"><Label htmlFor="excel-upload">Fichier Excel (.xlsx, .xls)</Label><Input id="excel-upload" type="file" accept=".xlsx, .xls" onChange={handleExcelFileChange} />{excelFile && <p className="text-sm text-muted-foreground">Fichier sélectionné: {excelFile.name}</p>}</div><DialogFooter><Button variant="outline" onClick={() => { setShowImportForm(false); setExcelFile(null); }}>Annuler</Button><Button onClick={handleImportProjectSubmit} disabled={!excelFile || uploadExcelMutation.isPending} className="bg-royal-600 hover:bg-royal-700 text-white">{uploadExcelMutation.isPending ? 'Importation...' : 'Importer'}</Button></DialogFooter></DialogContent>
      </Dialog>
      {renderProjectDetailsDialog()}
      <Card>
        <CardHeader><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><CardTitle className="flex-shrink-0">Liste des Projets ({filteredAndSortedProjects.length})</CardTitle><div className="flex items-center gap-2 flex-shrink-0"><Checkbox id="select-all" onCheckedChange={handleSelectAllForDownload} checked={filteredAndSortedProjects.length > 0 && selectedProjectsForDownload.length === filteredAndSortedProjects.length ? true : (selectedProjectsForDownload.length > 0 ? "indeterminate" : false)} /><Label htmlFor="select-all" className="text-sm text-muted-foreground whitespace-nowrap">Sélectionner tout</Label></div></div></CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6"><div className="relative flex-grow"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Rechercher (nom, société, demandeur...)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-full" /></div><div className="flex flex-col sm:flex-row gap-4 lg:w-auto"><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Statut" /></SelectTrigger><SelectContent><SelectItem value="all">Tous les statuts</SelectItem>{(['Planifié', 'En cours', 'Terminé', 'Cloturé', 'Bloqué', 'En attente'] as const).map(s => <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>)}</SelectContent></Select><Select value={priorityFilter} onValueChange={setPriorityFilter}><SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Priorité" /></SelectTrigger><SelectContent><SelectItem value="all">Toutes priorités</SelectItem>{(['Haute', 'Moyenne', 'Modérée', 'Basse'] as const).map(p => <SelectItem key={p} value={p.toLowerCase()}>{p}</SelectItem>)}</SelectContent></Select></div></div>
          {filteredAndSortedProjects.length === 0 && !isLoading && (<div className="text-center py-10 text-muted-foreground"><FileIconLucide className="mx-auto h-12 w-12 opacity-50" /><p className="mt-4">Aucun projet ne correspond à vos critères de recherche.</p></div>)}
          <div className="space-y-4">
            {filteredAndSortedProjects.map((project) => (
              <div key={project.id}>
                <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 ease-in-out bg-white">
                  <div className="flex items-start sm:items-center justify-between mb-3 flex-col sm:flex-row gap-3 sm:gap-2"><div className="flex items-center gap-3 flex-grow min-w-0"><Checkbox checked={selectedProjectsForDownload.includes(project.id)} onCheckedChange={(checked) => handleProjectSelectForDownload(project.id, checked)} /><Avatar className="h-10 w-10 flex-shrink-0"><AvatarFallback className="bg-royal-100 text-royal-700 font-semibold">{project.nomProjet?.substring(0, 2).toUpperCase() || 'P'}</AvatarFallback></Avatar><div className="flex-grow min-w-0"><h3 className="font-semibold text-lg truncate" title={project.nomProjet}>{project.nomProjet}</h3><p className="text-sm text-muted-foreground truncate">{project.societe || 'N/A'} - Resp: {project.responsableRealisation || 'N/A'}</p></div></div><div className="flex items-center gap-2 flex-wrap self-start sm:self-center mt-2 sm:mt-0">{getStatusBadge(project.etat)}{getPriorityBadge(project.priorite)}</div></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm mb-3"><div><p className="text-xs text-muted-foreground">Début Prévu</p><p className="font-medium">{project.dateDebutPrevue || 'N/A'}</p></div><div><p className="text-xs text-muted-foreground">Fin Prévue</p><p className="font-medium">{project.dateFinPrevue || 'N/A'}</p></div><div><p className="text-xs text-muted-foreground">Demandeur</p><p className="font-medium">{project.demandeur || 'N/A'}</p></div><div><p className="text-xs text-muted-foreground">Validité</p><p className="font-medium">{project.validite || 'N/A'}</p></div></div>
                  <div className="mt-3"><div className="flex justify-between text-sm mb-1 items-center"><span className="text-xs text-muted-foreground">Avancement</span><span className="font-semibold text-royal-700">{project.pourcentageAvance ?? 0}%</span></div><Progress value={project.pourcentageAvance ?? 0} className="h-2.5" /></div>
                  <div className="flex gap-2 mt-4 justify-end"><Button variant="ghost" size="sm" className="text-royal-600 hover:bg-royal-100" onClick={() => setShowGanttForProject(showGanttForProject === project.id ? null : project.id)}><Calendar className="h-4 w-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Gantt</span></Button><Button variant="ghost" size="sm" className="text-royal-600 hover:bg-royal-100" onClick={() => setShowProjectDetails(project)}><Eye className="h-4 w-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Détails</span></Button></div>
                </div>
                {showGanttForProject === project.id && (<div className="mt-2 p-3 border rounded-md bg-gray-50 shadow-inner"><GanttChart tasks={convertProjectTasksToGanttTasks(project)} projectStartDate={project.dateDebutPrevue || convertProjectTasksToGanttTasks(project)[0]?.startDate || new Date().toISOString()} projectEndDate={project.dateFinPrevue || convertProjectTasksToGanttTasks(project).slice(-1)[0]?.endDate || new Date().toISOString()} title="" /></div>)}
              </div>))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}