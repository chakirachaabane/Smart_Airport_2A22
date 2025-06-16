import { useState } from 'react';
import {
  Plus, MoreHorizontal, Clock, User, Calendar, AlertCircle, CheckCircle2, LucideIcon, FileText // Import FileText for new columns
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee?: {
    name: string;
    avatar: string;
  };
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: ColumnType; // Use ColumnType for status
  createdAt: string;
  labels: string[];
}

// Define available static column types
type StaticColumnType = 'todo' | 'in_progress' | 'review' | 'done';
// ColumnType can be one of the static types or any string for dynamic columns
type ColumnType = StaticColumnType | string;


interface Column {
  id: ColumnType;
  title: string;
  // Icon is optional for dynamic columns, but we'll assign a default
  icon?: LucideIcon;
  tasks: Task[];
}

// Mapping of static column IDs to their icons
const staticColumnIcons: Record<StaticColumnType, LucideIcon> = {
  todo: AlertCircle,
  in_progress: Clock,
  review: User,
  done: CheckCircle2,
};

// Mapping of static column IDs to their colors
const staticColumnColors: Record<StaticColumnType, string> = {
  todo: 'bg-blue-100 text-blue-600',
  in_progress: 'bg-amber-100 text-amber-600',
  review: 'bg-purple-100 text-purple-600',
  done: 'bg-green-100 text-green-600',
};


export default function TaskBoard() {
  const { toast } = useToast();
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: 'À Faire',
      icon: AlertCircle,
      tasks: [
        {
          id: '1',
          title: 'Planifier la réunion de lancement',
          description: 'Organiser une réunion pour démarrer le projet avec toute l\'équipe.',
          assignee: {
            name: 'Marie Dubois',
            avatar: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop&crop=face',
          },
          dueDate: '2024-06-25',
          priority: 'high',
          status: 'todo',
          createdAt: '2024-06-10',
          labels: ['Réunion', 'Planning']
        },
        {
          id: '2',
          title: 'Définir les objectifs du sprint',
          description: 'Établir les objectifs clairs pour le prochain sprint de deux semaines.',
          priority: 'medium',
          status: 'todo',
          createdAt: '2024-06-11',
          labels: ['Sprint', 'Planning']
        }
      ]
    },
    {
      id: 'in_progress',
      title: 'En Cours',
      icon: Clock,
      tasks: [
        {
          id: '3',
          title: 'Développer le module de paiement',
          description: 'Créer le module de paiement sécurisé avec Stripe.',
          assignee: {
            name: 'Thomas Martin',
            avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop&crop=face',
          },
          dueDate: '2024-06-20',
          priority: 'high',
          status: 'in_progress',
          createdAt: '2024-06-05',
          labels: ['Backend', 'Paiement']
        }
      ]
    },
    {
      id: 'review',
      title: 'En Révision',
      icon: User,
      tasks: [
        {
          id: '4',
          title: 'Revoir la UI du tableau de bord',
          description: 'Vérifier les designs et les interactions du tableau de bord.',
          assignee: {
            name: 'Sophie Laurent',
            avatar: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=100&h=100&fit=crop&crop=face',
          },
          dueDate: '2024-06-15',
          priority: 'medium',
          status: 'review',
          createdAt: '2024-06-08',
          labels: ['UI/UX', 'Design']
        }
      ]
    },
    {
      id: 'done',
      title: 'Terminé',
      icon: CheckCircle2,
      tasks: [
        {
          id: '5',
          title: 'Configurer l\'environnement de développement',
          description: 'Mettre en place Docker et les environnements de développement pour l\'équipe.',
          assignee: {
            name: 'Jean Martin',
            avatar: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop&crop=face',
          },
          priority: 'low',
          status: 'done',
          createdAt: '2024-06-01',
          labels: ['DevOps', 'Setup']
        }
      ]
    }
  ]);

  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  // State for Task Form
  const [taskFormVisible, setTaskFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo', // Default status is 'todo'
    labels: []
  });
  const [labelInput, setLabelInput] = useState('');


  // State for Add Column Form
  const [addColumnFormVisible, setAddColumnFormVisible] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');


  const currentProject = useState({
    id: '1',
    title: 'Site E-commerce Mode'
  })[0]; // Simplified state usage


  // --- Drag and Drop Handlers ---
  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (columnId: ColumnType) => {
    if (draggedTask) {
      // Prevent dropping a task back into its original column if no changes occurred
      if (draggedTask.status === columnId) {
         setDraggedTask(null);
         return;
      }

      // Remove from original column
      const updatedColumns = columns.map(column => ({
        ...column,
        tasks: column.tasks.filter(task => task.id !== draggedTask.id)
      }));

      // Find the target column and add the task
      const targetColumnIndex = updatedColumns.findIndex(column => column.id === columnId);

      if (targetColumnIndex > -1) {
         // Create a new task object with the updated status
         const updatedTask = {
           ...draggedTask,
           status: columnId
         };

         // Add the updated task to the target column's tasks array
         updatedColumns[targetColumnIndex].tasks.push(updatedTask);

         setColumns(updatedColumns);
         setDraggedTask(null);

         const targetColumn = updatedColumns[targetColumnIndex];
         toast({
           title: "Tâche déplacée",
           description: `${draggedTask.title} a été déplacé vers ${targetColumn.title}`
         });

      } else {
        // Should not happen if columnId is valid
         console.error(`Target column with id ${columnId} not found.`);
         setDraggedTask(null); // Clear dragged state anyway
      }
    }
  };


  // --- Task Management Handlers ---
  const handleTaskFormOpen = (task?: Task) => {
     if (task) {
       setEditingTask(task);
       // When opening for edit, pre-fill the new task state with the task's details
       // This is a common pattern if using the same form state for both new/edit
       // But since we have separate states (newTask vs editingTask), we just set editingTask
       setLabelInput(''); // Clear label input when opening form
     } else {
       setNewTask({ // Reset for new task
         title: '',
         description: '',
         priority: 'medium',
         status: 'todo', // Default to 'todo' for new tasks via the header button
         labels: []
       });
       setLabelInput(''); // Clear label input when opening form
       setTaskFormVisible(true);
     }
  }

  const handleEditTask = (task: Task) => {
     setEditingTask(task);
     setLabelInput(''); // Clear label input for editing
  }

  const addNewTask = () => {
    if (!newTask.title) {
      toast({
        title: "Erreur",
        description: "Le titre de la tâche est requis",
        variant: "destructive"
      });
      return;
    }

    // Ensure status is a valid ColumnType
    const targetColumn = columns.find(column => column.id === newTask.status);
    if (!targetColumn) {
       toast({
         title: "Erreur",
         description: "Tableau de destination invalide",
         variant: "destructive"
       });
       return;
    }


    const task: Task = {
      id: Date.now().toString(), // Simple unique ID
      title: newTask.title,
      description: newTask.description || '',
      priority: newTask.priority || 'medium',
      status: newTask.status,
      createdAt: new Date().toISOString().split('T')[0], // Current date
      labels: newTask.labels || [],
      assignee: newTask.assignee, // Assignee and dueDate might be added later
      dueDate: newTask.dueDate
    };

    const updatedColumns = columns.map(column => {
      if (column.id === task.status) {
        return {
          ...column,
          tasks: [...column.tasks, task]
        };
      }
      return column;
    });

    setColumns(updatedColumns);
    setTaskFormVisible(false);
    setNewTask({ // Reset form state
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      labels: []
    });
    setLabelInput(''); // Reset label input
    toast({
      title: "Tâche ajoutée",
      description: `${task.title} a été ajouté à la liste des tâches`
    });
  };

  const updateTask = () => {
    if (!editingTask) return;

    // Validate title exists
    if (!editingTask.title) {
       toast({
         title: "Erreur",
         description: "Le titre de la tâche est requis",
         variant: "destructive"
       });
       return;
    }

    const updatedColumns = columns.map(column => {
       // Check if the task is in this column
       const taskIndex = column.tasks.findIndex(task => task.id === editingTask.id);

       if (taskIndex > -1) {
         // If status changed, remove from this column
         if (column.id !== editingTask.status) {
            return {
               ...column,
               tasks: column.tasks.filter(task => task.id !== editingTask.id)
            };
         }
         // If status is the same, update the task in place
         return {
            ...column,
            tasks: column.tasks.map(task =>
               task.id === editingTask.id ? { ...editingTask } : task
            )
         };
       }
       return column;
    });

    // If status changed, add the task to the new column
    const targetColumnIndex = updatedColumns.findIndex(column => column.id === editingTask.status);
    if (targetColumnIndex > -1 && !updatedColumns[targetColumnIndex].tasks.find(task => task.id === editingTask!.id)) {
         updatedColumns[targetColumnIndex].tasks.push({...editingTask});
    }


    setColumns(updatedColumns);
    setEditingTask(null);
    setLabelInput(''); // Reset label input
    toast({
      title: "Tâche mise à jour",
      description: `Les modifications de "${editingTask.title}" ont été enregistrées`
    });
  };

  const deleteTask = (taskId: string) => {
    const updatedColumns = columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => task.id !== taskId)
    }));

    setColumns(updatedColumns);
    toast({
      title: "Tâche supprimée",
      description: "La tâche a été supprimée avec succès"
    });
  };

  const addLabel = () => {
    if (!labelInput.trim()) return;

    if (editingTask) {
      // Check if label already exists to prevent duplicates
      if (!editingTask.labels.includes(labelInput.trim())) {
        setEditingTask({
          ...editingTask,
          labels: [...editingTask.labels, labelInput.trim()]
        });
      }
    } else {
      // Check if label already exists for new task
      if (!(newTask.labels || []).includes(labelInput.trim())) {
        setNewTask({
          ...newTask,
          labels: [...(newTask.labels || []), labelInput.trim()]
        });
      }
    }
    setLabelInput(''); // Clear input after adding
  };

  const removeLabel = (label: string) => {
    if (editingTask) {
      setEditingTask({
        ...editingTask,
        labels: editingTask.labels.filter(l => l !== label)
      });
    } else {
      setNewTask({
        ...newTask,
        labels: (newTask.labels || []).filter(l => l !== label)
      });
    }
  };


  // --- Column Management Handlers ---
  const handleAddNewColumn = () => {
      if (!newColumnTitle.trim()) {
         toast({
           title: "Erreur",
           description: "Le titre du tableau est requis.",
           variant: "destructive"
         });
         return;
      }

      // Generate a unique ID (simple timestamp-based)
      const newColumnId = newColumnTitle.trim().toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

      // Check if an ID derived from title already exists (unlikely with timestamp, but good practice)
      if (columns.some(col => col.id === newColumnId)) {
          toast({
            title: "Erreur",
            description: "Un tableau avec ce titre existe déjà (ou ID collision).",
            variant: "destructive"
          });
          return;
      }


      const newColumn: Column = {
         id: newColumnId,
         title: newColumnTitle.trim(),
         icon: FileText, // Assign a default icon for new columns
         tasks: []
      };

      setColumns([...columns, newColumn]); // Add new column to the end
      setAddColumnFormVisible(false); // Close dialog
      setNewColumnTitle(''); // Reset input field

      toast({
         title: "Tableau ajouté",
         description: `Le tableau "${newColumn.title}" a été ajouté.`,
      });
  }


  // --- Helper Functions ---
  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200'; // Should not happen
    }
  };

  const getTaskCount = (columnId: ColumnType) => {
    const column = columns.find(col => col.id === columnId);
    return column ? column.tasks.length : 0;
  };

  const getColumnIconColor = (columnId: ColumnType) => {
     // Use static colors for known types, default for dynamic
     return staticColumnColors[columnId as StaticColumnType] || 'bg-gray-100 text-gray-600';
  }


  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-royal-900">Tableau des Tâches</h1>
          <p className="text-muted-foreground">Gérez vos tâches efficacement dans un style Trello</p>
        </div>
        <div className="flex gap-2"> {/* Container for buttons */}
          <Button onClick={() => setAddColumnFormVisible(true)} variant="outline"> {/* Button for Add Column */}
            <Plus className="mr-2 h-4 w-4" /> Ajouter un Tableau
          </Button>
          <Button onClick={() => handleTaskFormOpen()} className="royal-gradient text-white"> {/* Button for Add Task */}
            <Plus className="mr-2 h-4 w-4" /> Nouvelle Tâche
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{currentProject.title} - Tableau des Tâches</CardTitle>
            <div className="flex gap-2">
              {/* Filter by member - Keep as is or remove if not functional */}
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par membre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les membres</SelectItem>
                  {/* Populate with actual assignees if needed */}
                  <SelectItem value="marie">Marie Dubois</SelectItem>
                  <SelectItem value="thomas">Thomas Martin</SelectItem>
                  <SelectItem value="sophie">Sophie Laurent</SelectItem>
                </SelectContent>
              </Select>
              {/* Filter by priority - Keep as is */}
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les priorités</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Use dynamic grid columns based on the number of columns */}
          {/* Or stick to a fixed number like 4 and allow scrolling */}
          {/* Let's stick to 4 for now, or potentially add more classes for >4 */}
          <div className={`grid grid-cols-${Math.min(columns.length, 4)} md:grid-cols-4 gap-4 overflow-x-auto pb-4`}>
            {columns.map(column => {
               // Determine the icon for the column
               const ColumnIcon = staticColumnIcons[column.id as StaticColumnType] || column.icon || FileText; // Default to FileText if no icon provided
               const columnColor = getColumnIconColor(column.id);

               return (
                <div
                  key={column.id}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200 min-w-[280px]" // Add min-width for scroll behavior
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(column.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 flex items-center justify-center rounded-full ${columnColor}`}>
                        <ColumnIcon className="h-3.5 w-3.5" />
                      </div>
                      <h3 className="font-medium">{column.title}</h3>
                      <Badge variant="outline" className="ml-2">{getTaskCount(column.id)}</Badge>
                    </div>
                    {/* Column Dropdown Menu (optional - can add delete/edit column) */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                         <DropdownMenuLabel>{column.title}</DropdownMenuLabel>
                         <DropdownMenuSeparator />
                         {/* Add column specific actions here if needed */}
                         <DropdownMenuItem className="text-red-600" disabled={Object.keys(staticColumnIcons).includes(column.id)}>
                            Supprimer le Tableau
                         </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3">
                    {column.tasks.map(task => (
                      <div
                        key={task.id}
                        className="bg-white p-3 rounded-md border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        onClick={() => handleEditTask(task)} // Open edit dialog on click
                      >
                        <div className="flex justify-between">
                          <h4 className="font-semibold mb-1">{task.title}</h4>
                          {/* Task Dropdown Menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditTask(task); }}> {/* Stop propagation to prevent click opening edit dialog twice */}
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                                className="text-red-600"
                              >
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {task.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                        )}

                        {task.labels.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {task.labels.map((label, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                                {label}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between items-center mt-2">
                          <Badge className={`${getPriorityColor(task.priority)} border`}>
                            {task.priority === 'high' ? 'Haute' :
                              task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </Badge>

                          <div className="flex items-center gap-2">
                            {task.dueDate && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                {task.dueDate}
                              </div>
                            )}

                            {task.assignee && (
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Task button within each column */}
                    <Button
                      onClick={() => {
                          setNewTask(prev => ({...prev, status: column.id})); // Set default status to this column
                          setLabelInput(''); // Clear label input
                          setTaskFormVisible(true); // Open the task form
                      }}
                      variant="ghost"
                      className="w-full border border-dashed border-gray-300 bg-transparent hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Ajouter une tâche
                    </Button>
                  </div>
                </div>
            )})}
          </div>
        </CardContent>
      </Card>

      {/* Dialog: New Task Form */}
      {/* This dialog is now used for both general new tasks (defaults to 'todo')
          and tasks added from within a specific column (pre-fills status) */}
      <Dialog open={taskFormVisible} onOpenChange={setTaskFormVisible}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nouvelle tâche</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
             {/* Column Select Field */}
            <div className="space-y-2">
              <Label htmlFor="task-status">Tableau</Label>
               <Select
                  value={newTask.status}
                  onValueChange={(value: ColumnType) => setNewTask({ ...newTask, status: value })}
               >
                  <SelectTrigger id="task-status">
                     <SelectValue placeholder="Sélectionner un tableau" />
                  </SelectTrigger>
                  <SelectContent>
                     {columns.map(column => (
                        <SelectItem key={column.id} value={column.id}>{column.title}</SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                placeholder="Titre de la tâche"
                value={newTask.title || ''} // Ensure value is never null/undefined
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description de la tâche"
                value={newTask.description || ''} // Ensure value is never null/undefined
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select
                  value={newTask.priority || 'medium'} // Default value if undefined
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value as 'low' | 'medium' | 'high' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Haute</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="low">Basse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Date d'échéance</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate || ''} // Ensure value is never null/undefined
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
               {/* Add Assignee Select here if needed */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="labels">Étiquettes</Label>
              <div className="flex gap-2">
                <Input
                  id="labels"
                  placeholder="Ajouter une étiquette"
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLabel(); }}} // Add label on Enter key
                />
                <Button type="button" variant="outline" onClick={addLabel}>Ajouter</Button>
              </div>
              {(newTask.labels || []).length > 0 && ( // Ensure labels is an array
                <div className="flex flex-wrap gap-2 mt-2">
                  {(newTask.labels || []).map((label, idx) => (
                    <Badge key={idx} variant="outline" className="flex gap-1 items-center">
                      {label}
                      <button
                        onClick={() => removeLabel(label)}
                        className="text-xs bg-gray-200 rounded-full h-4 w-4 flex items-center justify-center hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskFormVisible(false)}>Annuler</Button>
            <Button onClick={addNewTask} className="royal-gradient text-white">Créer la tâche</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Edit Task Form */}
      <Dialog open={!!editingTask} onOpenChange={(open) => {
         if (!open) {
            setEditingTask(null);
            setLabelInput(''); // Clear label input on close
         }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier la tâche</DialogTitle>
          </DialogHeader>

          {editingTask && (
            <div className="space-y-4">
               {/* Column Select Field for editing */}
               <div className="space-y-2">
                 <Label htmlFor="edit-task-status">Tableau</Label>
                  <Select
                     value={editingTask.status}
                     onValueChange={(value: ColumnType) => setEditingTask({ ...editingTask, status: value })}
                  >
                     <SelectTrigger id="edit-task-status">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        {columns.map(column => (
                           <SelectItem key={column.id} value={column.id}>{column.title}</SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

              <div className="space-y-2">
                <Label htmlFor="edit-title">Titre</Label>
                <Input
                  id="edit-title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priorité</Label>
                  <Select
                    value={editingTask.priority}
                    onValueChange={(value) => setEditingTask({ ...editingTask, priority: value as 'low' | 'medium' | 'high' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Haute</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="low">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-dueDate">Date d'échéance</Label>
                  <Input
                    id="edit-dueDate"
                    type="date"
                    value={editingTask.dueDate || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                  />
                </div>
                 {/* Add Assignee Select here for editing if needed */}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-labels">Étiquettes</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-labels"
                    placeholder="Ajouter une étiquette"
                    value={labelInput}
                    onChange={(e) => setLabelInput(e.target.value)}
                     onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLabel(); }}} // Add label on Enter key
                  />
                  <Button type="button" variant="outline" onClick={addLabel}>Ajouter</Button>
                </div>
                {editingTask.labels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editingTask.labels.map((label, idx) => (
                      <Badge key={idx} variant="outline" className="flex gap-1 items-center">
                        {label}
                        <button
                          onClick={() => removeLabel(label)}
                          className="text-xs bg-gray-200 rounded-full h-4 w-4 flex items-center justify-center hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTask(null)}>Annuler</Button>
            <Button onClick={updateTask} className="royal-gradient text-white">Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Dialog: Add New Column Form */}
      <Dialog open={addColumnFormVisible} onOpenChange={setAddColumnFormVisible}>
        <DialogContent className="max-w-sm"> {/* Make dialog slightly smaller */}
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau tableau</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-column-title">Titre du tableau</Label>
              <Input
                id="new-column-title"
                placeholder="Ex: En Test, À Valider..."
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                 onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddNewColumn(); }}} // Add column on Enter key
              />
            </div>
             {/* Could add an icon select here later if desired */}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setAddColumnFormVisible(false); setNewColumnTitle(''); }}>Annuler</Button>
            <Button onClick={handleAddNewColumn} className="royal-gradient text-white">Créer le tableau</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}