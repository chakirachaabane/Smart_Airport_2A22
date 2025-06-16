import { useState, useEffect, useMemo } from 'react';
import { Users, Plus, Search, Mail, Phone, MapPin, Calendar, Award, Star, X, Loader2, Image as ImageIcon, Book, GraduationCap, Languages as LanguagesIcon, Edit as EditIcon, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'supervisor' | 'team_member' | 'client_contact';
  phoneNumber?: string;
  position?: string;
  department?: string;
  avatarUrl?: string;
  address?: string;
  bio?: string;
  skills: string[];
  certifications: string[];
  languages: string[];
  joinDate: string;
  companyId?: string;
  name: string;
  performance?: number;
  completedTasks?: number;
  projects?: string[];
}

interface CurrentUser {
  id: string;
  role: string;
}


export default function Team() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showNewMemberDialog, setShowNewMemberDialog] = useState(false);
  const [showEditMemberDialog, setShowEditMemberDialog] = useState(false);

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const [contactForm, setContactForm] = useState({ subject: '', message: '' });

  const [newMemberForm, setNewMemberForm] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '', position: '',
    department: '', role: '', password: '', confirmPassword: '', company: '',
    avatarUrl: '', address: '', bio: '', skills: '', certifications: '', languages: '',
  });

  const [editMemberFormData, setEditMemberFormData] = useState({
    id: '',
    firstName: '', lastName: '', email: '', phoneNumber: '', position: '',
    department: '', role: '',
    avatarUrl: '', address: '', bio: '', skills: '', certifications: '', languages: '',
    password: '',
    confirmPassword: '',
  });


  const [isAddMemberLoading, setIsAddMemberLoading] = useState(false);
  const [isEditMemberLoading, setIsEditMemberLoading] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setCurrentUser({ id: parsedUser.id, role: parsedUser.role });
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        setCurrentUser(null);
      }
    }
  }, []);

  const currentUserRole = useMemo(() => currentUser?.role, [currentUser]);
  const isUserAdminOrSupervisor = useMemo(() => currentUserRole === 'admin' || currentUserRole === 'supervisor', [currentUserRole]);


  const { data: fetchedTeamMembers, isLoading: isTeamLoading, error: teamError } = useQuery<TeamMember[]>({
    queryKey: ['users', { roles: 'team_member,supervisor' }],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/users?role=team_member,supervisor', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.error("Authentication or Authorization failed for fetching team. Redirecting to signin.");
          navigate('/signin');
          throw new Error('Authentication or Authorization Required');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const formattedData = data.map((member: any) => ({
        ...member,
        skills: (member.skills && typeof member.skills === 'string' && member.skills.length > 0) ? member.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s) : (Array.isArray(member.skills) ? member.skills : []),
        certifications: (member.certifications && typeof member.certifications === 'string' && member.certifications.length > 0) ? member.certifications.split(',').map((s: string) => s.trim()).filter((s: string) => s) : (Array.isArray(member.certifications) ? member.certifications : []),
        languages: (member.languages && typeof member.languages === 'string' && member.languages.length > 0) ? member.languages.split(',').map((s: string) => s.trim()).filter((s: string) => s) : (Array.isArray(member.languages) ? member.languages : []),
        name: `${member.firstName} ${member.lastName}`
      }));

      return formattedData as TeamMember[];
    },
    staleTime: 60 * 1000,
    enabled: !!localStorage.getItem('token'),
    retry: 1,
  });


  const getRoleBadge = (role: string) => {
    const variants = { 'admin': 'destructive', 'supervisor': 'default', 'team_member': 'secondary', 'client_contact': 'outline' } as const;
    const labels = { 'admin': 'Administrateur', 'supervisor': 'Superviseur', 'team_member': 'Membre d\'équipe', 'client_contact': 'Contact Client' };
    const variant = variants[role as keyof typeof variants] || 'outline';
    const label = labels[role as keyof typeof labels] || role;
    return (<Badge variant={variant}>{label}</Badge>);
  };

  const getPerformanceColor = (performance?: number) => {
    if (performance === undefined || performance === null) return 'text-gray-600';
    if (performance >= 90) return 'text-green-600';
    if (performance >= 80) return 'text-blue-600';
    if (performance >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleContactClick = (member: TeamMember) => {
    setSelectedMember(member);
    setContactForm({ subject: `Contact: ${member.firstName} ${member.lastName}`, message: '' });
    setShowContactDialog(true);
  };

  const sendEmail = () => {
    console.log('Envoi email simulation à:', selectedMember?.email, contactForm);
    toast({ title: "Fonctionnalité en développement", description: "L'envoi d'email n'est pas encore implémenté." });
    setShowContactDialog(false);
    setContactForm({ subject: '', message: '' });
  };

  const handleEditClick = (member: TeamMember) => {
    setEditingMember(member);
    setEditMemberFormData({
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phoneNumber: member.phoneNumber || '',
      position: member.position || '',
      department: member.department || '',
      role: member.role,
      avatarUrl: member.avatarUrl || '',
      address: member.address || '',
      bio: member.bio || '',
      skills: Array.isArray(member.skills) ? member.skills.join(', ') : member.skills || '',
      certifications: Array.isArray(member.certifications) ? member.certifications.join(', ') : member.certifications || '',
      languages: Array.isArray(member.languages) ? member.languages.join(', ') : member.languages || '',
      password: '',
      confirmPassword: '',
    });
    setShowEditMemberDialog(true);
  };

  const handleEditFormChange = (field: string, value: string) => {
    setEditMemberFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateMember = async () => {
    setIsEditMemberLoading(true);

    if (!editMemberFormData.firstName || !editMemberFormData.lastName || !editMemberFormData.email || !editMemberFormData.role || !editMemberFormData.id) {
      toast({ title: "Erreur de validation", description: "Prénom, Nom, Email, et Rôle sont obligatoires.", variant: "destructive" });
      setIsEditMemberLoading(false); return;
    }

    if (editMemberFormData.password || editMemberFormData.confirmPassword) {
      if (editMemberFormData.password !== editMemberFormData.confirmPassword) {
        toast({ title: "Erreur de validation", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
        setIsEditMemberLoading(false); return;
      }
      if (editMemberFormData.password.length < 6) {
        toast({ title: "Erreur de validation", description: "Le mot de passe doit contenir au moins 6 caractères.", variant: "destructive" });
        setIsEditMemberLoading(false); return;
      }
    }

    console.log(`Attempting to update member ${editMemberFormData.id} with data:`, editMemberFormData);

    const dataToSend = {
      firstName: editMemberFormData.firstName,
      lastName: editMemberFormData.lastName,
      email: editMemberFormData.email,
      phoneNumber: editMemberFormData.phoneNumber || undefined,
      position: editMemberFormData.position || undefined,
      department: editMemberFormData.department || undefined,
      avatarUrl: editMemberFormData.avatarUrl || undefined,
      address: editMemberFormData.address || undefined,
      bio: editMemberFormData.bio || undefined,
      skills: editMemberFormData.skills || undefined,
      certifications: editMemberFormData.certifications || undefined,
      languages: editMemberFormData.languages || undefined,
      ...(editMemberFormData.password && { password: editMemberFormData.password }),
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: "Erreur", description: "Authentification requise pour modifier.", variant: "destructive" });
        navigate('/signin');
        setIsEditMemberLoading(false); return;
      }

      const response = await fetch(`http://localhost:3000/api/users/${editMemberFormData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Backend update user successful:', data);
        toast({ title: "Succès", description: data.message || 'Profil mis à jour avec succès.', });
        setShowEditMemberDialog(false);
        setEditingMember(null);
        setEditMemberFormData({
          id: '', firstName: '', lastName: '', email: '', phoneNumber: '', position: '',
          department: '', role: '', avatarUrl: '', address: '', bio: '', skills: '', certifications: '', languages: '',
          password: '', confirmPassword: '',
        });
        queryClient.invalidateQueries({ queryKey: ['users', { roles: 'team_member,supervisor' }] });

      } else {
        console.error('Backend update user failed:', data);
        let errorMessage = data.message || `Une erreur est survenue (Statut: ${response.status}).`;
        if (response.status === 401 || response.status === 403) {
          errorMessage = "Vous n'êtes pas autorisé à modifier ce profil.";
        } else if (response.status === 409 && data?.error?.includes('P2002')) {
          errorMessage = "Cet email est déjà utilisé par un autre utilisateur.";
        } else if (data?.error?.message) {
          errorMessage = data.error.message;
        } else if (data && typeof data === 'object') {
          errorMessage = JSON.stringify(data);
        } else if (data) {
          errorMessage = data;
        }
        toast({ title: "Erreur de mise à jour", description: errorMessage, variant: "destructive", });
      }

    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de la requête de mise à jour:', error);
      toast({ title: "Erreur réseau", description: "Impossible de contacter le serveur pour mettre à jour le profil.", variant: "destructive", });
    } finally {
      setIsEditMemberLoading(false);
    }
  };


  const addNewMember = async () => {
    setIsAddMemberLoading(true);

    if (!newMemberForm.firstName || !newMemberForm.lastName || !newMemberForm.email || !newMemberForm.password || !newMemberForm.role || !newMemberForm.phoneNumber) {
      toast({ title: "Erreur de validation", description: "Veuillez remplir les champs obligatoires (Prénom, Nom, Email, Mot de passe, Rôle, Téléphone).", variant: "destructive" });
      setIsAddMemberLoading(false); return;
    }
    if (newMemberForm.password !== newMemberForm.confirmPassword) {
      toast({ title: "Erreur de validation", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      setIsAddMemberLoading(false); return;
    }

    console.log('Sending new member data to backend create user endpoint:', newMemberForm);

    const dataToSend = {
      firstName: newMemberForm.firstName,
      lastName: newMemberForm.lastName,
      email: newMemberForm.email,
      password: newMemberForm.password,
      role: newMemberForm.role,
      phoneNumber: newMemberForm.phoneNumber || undefined,
      position: newMemberForm.position || undefined,
      department: newMemberForm.department || undefined,
      avatarUrl: newMemberForm.avatarUrl || undefined,
      address: newMemberForm.address || undefined,
      bio: newMemberForm.bio || undefined,
      skills: newMemberForm.skills || undefined,
      certifications: newMemberForm.certifications || undefined,
      languages: newMemberForm.languages || undefined,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: "Erreur", description: "Authentification requise pour ajouter un membre.", variant: "destructive" });
        navigate('/signin');
        setIsAddMemberLoading(false); return;
      }

      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Backend create user successful:', data);
        toast({ title: "Succès", description: `Membre ${data.user.firstName} ${data.user.lastName} créé avec succès.`, });
        setShowNewMemberDialog(false);
        setNewMemberForm({
          firstName: '', lastName: '', email: '', phoneNumber: '', position: '',
          department: '', role: '', password: '', confirmPassword: '', company: '',
          avatarUrl: '', address: '', bio: '', skills: '', certifications: '', languages: ''
        });
        queryClient.invalidateQueries({ queryKey: ['users', { roles: 'team_member,supervisor' }] });

      } else {
        console.error('Backend create user failed:', data);
        let errorMessage = data.message || `Une erreur est survenue (Statut: ${response.status}).`;
        if (response.status === 401 || response.status === 403) {
          errorMessage = "Vous n'êtes pas autorisé à effectuer cette action. Assurez-vous d'être connecté avec un rôle d'administrateur ou de superviseur.";
        } else if (response.status === 409 && data?.error?.includes('P2002')) {
          errorMessage = "Cet email est déjà utilisé.";
        } else if (data?.error?.message) {
          errorMessage = data.error.message;
        } else if (data && typeof data === 'object') {
          errorMessage = JSON.stringify(data);
        } else if (data) {
          errorMessage = data;
        }
        toast({ title: "Erreur de création", description: errorMessage, variant: "destructive", });
      }

    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de la requête de création de membre:', error);
      toast({ title: "Erreur réseau", description: "Impossible de contacter le serveur pour créer le membre.", variant: "destructive", });
    } finally { setIsAddMemberLoading(false); }
  };


  const deleteMember = async (memberId: string, memberName: string) => {
    console.log('Attempting to delete member:', memberId);
    const confirmDelete = window.confirm(`Êtes-vous sûr de vouloir supprimer le membre "${memberName}" ? Cette action est irréversible.`);
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: "Erreur", description: "Authentification requise pour supprimer.", variant: "destructive" });
        navigate('/signin');
        return;
      }

      const response = await fetch(`http://localhost:3000/api/users/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Backend delete successful:', data);
        toast({ title: "Succès", description: data.message || `Membre ${memberName} supprimé avec succès.`, });
        queryClient.invalidateQueries({ queryKey: ['users', { roles: 'team_member,supervisor' }] });
      } else {
        console.error('Backend delete failed:', data);
        let errorMessage = data.message || "Une erreur est survenue lors de la suppression.";
        if (response.status === 401 || response.status === 403) {
          errorMessage = "Vous n'êtes pas autorisé à supprimer des membres.";
        } else if (data?.error?.message) {
          errorMessage = data.error.message;
        } else if (data && typeof data === 'object') {
          errorMessage = JSON.stringify(data);
        } else if (data) {
          errorMessage = data;
        }
        toast({ title: "Erreur de suppression", description: errorMessage, variant: "destructive", });
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de la requête de suppression:', error);
      toast({ title: "Erreur réseau", description: "Impossible de contacter le serveur pour supprimer le membre.", variant: "destructive", });
    }
  };


  const filteredTeamMembers = fetchedTeamMembers?.filter(member =>
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(member.skills) && member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))) ||
    (Array.isArray(member.certifications) && member.certifications.some(cert => cert.toLowerCase().includes(searchTerm.toLowerCase()))) ||
    (Array.isArray(member.languages) && member.languages.some(lang => lang.toLowerCase().includes(searchTerm.toLowerCase())))

  ) || [];


  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-royal-900">Gestion d'Équipe</h1>
          <p className="text-muted-foreground">Gérer les membres de votre équipe</p>
        </div>
        <Dialog open={showNewMemberDialog} onOpenChange={setShowNewMemberDialog}>
          <DialogTrigger asChild><Button className="royal-gradient text-white"><Plus className="h-4 w-4 mr-2" />Nouveau Membre</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Ajouter un Nouveau Membre</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="new-firstName">Prénom</Label><Input id="new-firstName" value={newMemberForm.firstName} onChange={(e) => setNewMemberForm(prev => ({ ...prev, firstName: e.target.value }))} placeholder="Prénom" disabled={isAddMemberLoading} /></div>
              <div className="space-y-2"><Label htmlFor="new-lastName">Nom</Label><Input id="new-lastName" value={newMemberForm.lastName} onChange={(e) => setNewMemberForm(prev => ({ ...prev, lastName: e.target.value }))} placeholder="Nom" disabled={isAddMemberLoading} /></div>
              <div className="space-y-2"><Label htmlFor="new-email">Email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="new-email" type="email" value={newMemberForm.email} onChange={(e) => setNewMemberForm(prev => ({ ...prev, email: e.target.value }))} placeholder="email@exemple.com" className="pl-10" disabled={isAddMemberLoading} /></div></div>
              <div className="space-y-2"><Label htmlFor="new-phone">Téléphone</Label><div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="new-phone" value={newMemberForm.phoneNumber} onChange={(e) => setNewMemberForm(prev => ({ ...prev, phoneNumber: e.target.value }))} placeholder="+33 6 12 34 56 78" className="pl-10" disabled={isAddMemberLoading} /></div></div>
              <div className="space-y-2"><Label htmlFor="new-password">Mot de passe</Label><Input id="new-password" type="password" value={newMemberForm.password} onChange={(e) => setNewMemberForm(prev => ({ ...prev, password: e.target.value }))} placeholder="••••••••" disabled={isAddMemberLoading} /></div>
              <div className="space-y-2"><Label htmlFor="new-confirmPassword">Confirmer mot de passe</Label><Input id="new-confirmPassword" type="password" value={newMemberForm.confirmPassword} onChange={(e) => setNewMemberForm(prev => ({ ...prev, confirmPassword: e.target.value }))} placeholder="••••••••" className="pl-10" disabled={isAddMemberLoading} /></div>
              <div className="space-y-2"><Label htmlFor="new-position">Poste</Label><Input id="new-position" value={newMemberForm.position} onChange={(e) => setNewMemberForm(prev => ({ ...prev, position: e.target.value }))} placeholder="Développeur, Designer..." disabled={isAddMemberLoading} /></div>
              <div className="space-y-2"><Label htmlFor="new-department">Département</Label><Input id="new-department" value={newMemberForm.department} onChange={(e) => setNewMemberForm(prev => ({ ...prev, department: e.target.value }))} placeholder="IT, Marketing..." disabled={isAddMemberLoading} /></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="new-role">Rôle</Label><Select value={newMemberForm.role} onValueChange={(value) => setNewMemberForm(prev => ({ ...prev, role: value }))} disabled={isAddMemberLoading}><SelectTrigger id="new-role"><SelectValue placeholder="Sélectionner un rôle" /></SelectTrigger><SelectContent><SelectItem value="admin">Administrateur</SelectItem><SelectItem value="supervisor">Superviseur</SelectItem><SelectItem value="team_member">Membre d'équipe</SelectItem><SelectItem value="client_contact">Contact Client</SelectItem></SelectContent></Select></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="new-avatarUrl">URL Image de Profil</Label><div className="relative"><ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="new-avatarUrl" value={newMemberForm.avatarUrl} onChange={(e) => setNewMemberForm(prev => ({ ...prev, avatarUrl: e.target.value }))} placeholder="https://..." className="pl-10" disabled={isAddMemberLoading} /></div></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="new-address">Adresse</Label><div className="relative"><MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="new-address" value={newMemberForm.address} onChange={(e) => setNewMemberForm(prev => ({ ...prev, address: e.target.value }))} placeholder="123 Rue de l'Exemple, Ville" className="pl-10" disabled={isAddMemberLoading} /></div></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="new-bio">Biographie</Label><Textarea id="new-bio" value={newMemberForm.bio} onChange={(e) => setNewMemberForm(prev => ({ ...prev, bio: e.target.value }))} placeholder="Parlez de votre expérience..." rows={3} disabled={isAddMemberLoading} /></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="new-skills">Compétences (séparées par virgules)</Label><div className="relative"><Book className="absolute left-3 top-3 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="new-skills" value={newMemberForm.skills} onChange={(e) => setNewMemberForm(prev => ({ ...prev, skills: e.target.value }))} placeholder="React, Node.js, SQL" className="pl-10" disabled={isAddMemberLoading} /></div></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="new-certifications">Certifications (séparées par virgules)</Label><div className="relative"><GraduationCap className="absolute left-3 top-3 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="new-certifications" value={newMemberForm.certifications} onChange={(e) => setNewMemberForm(prev => ({ ...prev, certifications: e.target.value }))} placeholder="PMP, Scrum Master" className="pl-10" disabled={isAddMemberLoading} /></div></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="new-languages">Langues (séparées par virgules)</Label><div className="relative"><LanguagesIcon className="absolute left-3 top-3 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="new-languages" value={newMemberForm.languages} onChange={(e) => setNewMemberForm(prev => ({ ...prev, languages: e.target.value }))} placeholder="Français (Natif), Anglais (Courant)" className="pl-10" disabled={isAddMemberLoading} /></div></div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setShowNewMemberDialog(false)} disabled={isAddMemberLoading}>Annuler</Button>
              <Button onClick={addNewMember} className="royal-gradient text-white" disabled={isAddMemberLoading}>
                {isAddMemberLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ajout en cours...</>) : ('Ajouter Membre')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card><CardContent className="p-4"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Rechercher..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-royal-700">{filteredTeamMembers?.length ?? '...'}</div><div className="text-sm text-muted-foreground">Total Membres</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-green-700">{filteredTeamMembers?.filter(m => m.role === 'supervisor').length ?? '...'}</div><div className="text-sm text-muted-foreground">Superviseurs</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-blue-700">{filteredTeamMembers?.filter(m => m.role === 'team_member').length ?? '...'}</div><div className="text-sm text-muted-foreground">Membres d'équipe</div></CardContent></Card>
      </div>

      {isTeamLoading && (<div className="flex justify-center items-center h-32"><Loader2 className="h-8 w-8 animate-spin text-royal-600" /><span className="ml-3 text-royal-700">Chargement des équipes...</span></div>)}
      {teamError && (<div className="text-center text-red-600 p-6">Erreur lors du chargement des équipes: {teamError.message}</div>)}

      {!isTeamLoading && !teamError && filteredTeamMembers && filteredTeamMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTeamMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-16 w-16"><AvatarImage src={member.avatarUrl || undefined} alt={`${member.firstName} ${member.lastName}`} /><AvatarFallback className="royal-gradient text-white text-lg">{`${member.firstName?.[0] || ''}${member.lastName?.[0] || ''}`}</AvatarFallback></Avatar>
                    <div>
                      <CardTitle className="text-lg">{`${member.firstName} ${member.lastName}`}</CardTitle>
                      <p className="text-sm text-muted-foreground">{member.position || 'Non défini'}</p>
                      <p className="text-xs text-muted-foreground">{member.department || 'Non défini'}</p>
                    </div>
                  </div>
                  {getRoleBadge(member.role)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {((member as any).performance !== undefined && (member as any).performance !== null) && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Performance</span><span className={`text-lg font-bold ${getPerformanceColor((member as any).performance)}`}>{(member as any).performance}%</span></div>
                    <Progress value={(member as any).performance || 0} className="h-2" />
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground"><span>{(member as any).completedTasks || 0} tâches complétées</span><Star className="h-3 w-3" /></div>
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /><span className="truncate">{member.email}</span></div>
                  {member.phoneNumber && (<div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /><span>{member.phoneNumber}</span></div>)}
                  {member.address && (<div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{member.address}</span></div>)}
                  {member.joinDate && (<div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" /><span>Depuis {new Date(member.joinDate).toLocaleDateString('fr-FR')}</span></div>)}
                </div>
                {member.bio && (<div><p className="text-sm font-medium mb-2">Biographie:</p><p className="text-sm text-muted-foreground">{member.bio}</p></div>)}
                {Array.isArray(member.skills) && member.skills.length > 0 && (
                  <div><p className="text-sm font-medium mb-2">Compétences principales:</p><div className="flex flex-wrap gap-1">{member.skills.slice(0, 4).map((skill, index) => (<Badge key={index} variant="outline" className="text-xs">{skill}</Badge>))}{member.skills.length > 4 && (<Badge variant="outline" className="text-xs">+{member.skills.length - 4}</Badge>)}</div></div>
                )}
                {Array.isArray(member.certifications) && member.certifications.length > 0 && (
                  <div><p className="text-sm font-medium mb-2">Certifications:</p><div className="space-y-1">{member.certifications.slice(0, 2).map((cert, index) => (<div key={index} className="flex items-center gap-2 text-xs"><Award className="h-3 w-3 text-royal-500" /><span>{cert}</span></div>))}{member.certifications.length > 2 && (<p className="text-xs text-muted-foreground">+{member.certifications.length - 2} autres certifications</p>)}</div></div>
                )}
                {Array.isArray((member as any).projects) && (member as any).projects.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Projets assignés:</p>
                    <div className="space-y-1">
                      {(member as any).projects.map((project: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                          {project}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {Array.isArray(member.languages) && member.languages.length > 0 && (
                  <div><p className="text-sm font-medium mb-2">Langues:</p><div className="text-xs text-muted-foreground">{member.languages.join(' • ')}</div></div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" size="sm" onClick={() => handleEditClick(member)}>
                    <EditIcon className="h-3 w-3 mr-1" /> Modifier
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm" onClick={() => handleContactClick(member)}><Mail className="h-3 w-3 mr-1" />Contacter</Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteMember(member.id, `${member.firstName} ${member.lastName}`)}><X className="h-3 w-3" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !isTeamLoading && !teamError && filteredTeamMembers?.length === 0 ? (
        <div className="text-center text-muted-foreground p-6">Aucun membre d'équipe trouvé pour le filtre actuel.</div>
      ) : null}

      <Dialog open={showEditMemberDialog} onOpenChange={setShowEditMemberDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Modifier Membre : {editingMember?.name}</DialogTitle></DialogHeader>
          {editingMember && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="edit-firstName">Prénom</Label><Input id="edit-firstName" value={editMemberFormData.firstName} onChange={(e) => handleEditFormChange('firstName', e.target.value)} placeholder="Prénom" disabled={isEditMemberLoading} /></div>
              <div className="space-y-2"><Label htmlFor="edit-lastName">Nom</Label><Input id="edit-lastName" value={editMemberFormData.lastName} onChange={(e) => handleEditFormChange('lastName', e.target.value)} placeholder="Nom" disabled={isEditMemberLoading} /></div>
              <div className="space-y-2"><Label htmlFor="edit-email">Email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="edit-email" type="email" value={editMemberFormData.email} onChange={(e) => handleEditFormChange('email', e.target.value)} placeholder="email@exemple.com" className="pl-10" disabled={isEditMemberLoading} /></div></div>
              <div className="space-y-2"><Label htmlFor="edit-phone">Téléphone</Label><div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="edit-phone" value={editMemberFormData.phoneNumber} onChange={(e) => handleEditFormChange('phoneNumber', e.target.value)} placeholder="+33 6 12 34 56 78" className="pl-10" disabled={isEditMemberLoading} /></div></div>
              <div className="space-y-2"><Label htmlFor="edit-password">Nouveau mot de passe (Optionnel)</Label><div className="relative"><Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="edit-password" type="password" placeholder="••••••••" value={editMemberFormData.password} onChange={(e) => handleEditFormChange('password', e.target.value)} className="pl-10" disabled={isEditMemberLoading} /></div></div>
              <div className="space-y-2"><Label htmlFor="edit-confirmPassword">Confirmer nouveau mot de passe</Label><div className="relative"><Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="edit-confirmPassword" type="password" placeholder="••••••••" value={editMemberFormData.confirmPassword} onChange={(e) => handleEditFormChange('confirmPassword', e.target.value)} className="pl-10" disabled={isEditMemberLoading} /></div></div>
              <div className="space-y-2"><Label htmlFor="edit-position">Poste</Label><Input id="edit-position" value={editMemberFormData.position} onChange={(e) => handleEditFormChange('position', e.target.value)} placeholder="Développeur, Designer..." disabled={isEditMemberLoading} /></div>
              <div className="space-y-2"><Label htmlFor="edit-department">Département</Label><Input id="edit-department" value={editMemberFormData.department} onChange={(e) => handleEditFormChange('department', e.target.value)} placeholder="IT, Marketing..." disabled={isEditMemberLoading} /></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="edit-role">Rôle</Label><Input id="edit-role" value={getRoleBadge(editMemberFormData.role).props.children} disabled={true} className="text-muted-foreground" /></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="edit-avatarUrl">URL Image de Profil</Label><div className="relative"><ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="edit-avatarUrl" value={editMemberFormData.avatarUrl} onChange={(e) => handleEditFormChange('avatarUrl', e.target.value)} placeholder="https://..." className="pl-10" disabled={isEditMemberLoading} /></div></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="edit-address">Adresse</Label><div className="relative"><MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="edit-address" value={editMemberFormData.address} onChange={(e) => handleEditFormChange('address', e.target.value)} placeholder="123 Rue de l'Exemple, Ville" className="pl-10" disabled={isEditMemberLoading} /></div></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="edit-bio">Biographie</Label><Textarea id="edit-bio" value={editMemberFormData.bio} onChange={(e) => handleEditFormChange('bio', e.target.value)} placeholder="Parlez de votre expérience..." rows={3} disabled={isEditMemberLoading} /></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="edit-skills">Compétences (séparées par virgules)</Label><div className="relative"><Book className="absolute left-3 top-3 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="edit-skills" value={editMemberFormData.skills} onChange={(e) => handleEditFormChange('skills', e.target.value)} placeholder="React, Node.js, SQL" className="pl-10" disabled={isEditMemberLoading} /></div></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="edit-certifications">Certifications (séparées par virgules)</Label><div className="relative"><GraduationCap className="absolute left-3 top-3 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="edit-certifications" value={editMemberFormData.certifications} onChange={(e) => handleEditFormChange('certifications', e.target.value)} placeholder="PMP, Scrum Master" className="pl-10" disabled={isEditMemberLoading} /></div></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="edit-languages">Langues (séparées par virgules)</Label><div className="relative"><LanguagesIcon className="absolute left-3 top-3 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="edit-languages" value={editMemberFormData.languages} onChange={(e) => handleEditFormChange('languages', e.target.value)} placeholder="Français (Natif), Anglais (Courant)" className="pl-10" disabled={isEditMemberLoading} /></div></div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowEditMemberDialog(false)} disabled={isEditMemberLoading}>Annuler</Button>
            <Button onClick={handleUpdateMember} className="royal-gradient text-white" disabled={isEditMemberLoading}>
              {isEditMemberLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sauvegarde...</>) : ('Sauvegarder')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Contacter {selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : ''}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label htmlFor="subject">Sujet</Label><Input id="subject" value={contactForm.subject} onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))} placeholder="Sujet du message" /></div>
            <div className="space-y-2"><Label htmlFor="message">Message</Label><Textarea id="message" value={contactForm.message} onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))} placeholder="Votre message..." rows={4} /></div>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={sendEmail} className="royal-gradient text-white"><Mail className="h-4 w-4 mr-2" />Envoyer Email</Button>
            <Button variant="outline" onClick={() => setShowContactDialog(false)}>Annuler</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}