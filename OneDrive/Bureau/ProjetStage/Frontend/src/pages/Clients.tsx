
import { useState } from 'react';
import { Users, Plus, Search, Mail, Phone, MapPin, Building, Calendar, Eye, X, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const clients = [
  {
    id: '1',
    name: 'Fashion Corp',
    contactPerson: 'Oumaima Gaidi',
    email: 'Oumaima.gaidi@fashioncorp.com',
    phone: '+216 1 23 45 67 89',
    address: '123 Rue de la Mode, 75001 Paris',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    company: 'Fashion Corp',
    industry: 'Mode & Textile',
    projects: ['Site E-commerce Mode', 'App Mobile Fashion'],
    totalProjects: 5,
    activeProjects: 2,
    budget: '€125,000',
    joinDate: '2023-01-15',
    status: 'active',
    priority: 'high'
  },
  {
    id: '2',
    name: 'BankTech SA',
    contactPerson: 'Madame Islem',
    email: 'Islem.test@banktech.com',
    phone: '+216 1 98 76 54 32',
    address: '456 Avenue Financière, 92400 Courbevoie',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    company: 'BankTech SA',
    industry: 'Services Financiers',
    projects: ['App Mobile Banking', 'Système de Paiement'],
    totalProjects: 3,
    activeProjects: 1,
    budget: '€200,000',
    joinDate: '2023-03-22',
    status: 'active',
    priority: 'high'
  },
  {
    id: '3',
    name: 'Business Solutions',
    contactPerson: 'Nouha Khouildi',
    email: 'marie.laurent@business-solutions.fr',
    phone: '+216 1 98 76 54 32',
    address: '789 Boulevard Innovation, 69000 Lyon',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    company: 'Business Solutions',
    industry: 'Conseil & Services',
    projects: ['Système CRM', 'Dashboard Analytics'],
    totalProjects: 4,
    activeProjects: 0,
    budget: '€80,000',
    joinDate: '2023-02-10',
    status: 'completed',
    priority: 'medium'
  }
];

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showProjectsDialog, setShowProjectsDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  });
  const [newClientForm, setNewClientForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    industry: '',
    budget: '',
    priority: ''
  });
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'default',
      'completed': 'secondary',
      'on_hold': 'outline'
    } as const;
    
    const labels = {
      'active': 'Actif',
      'completed': 'Terminé',
      'on_hold': 'En attente'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'high': 'destructive',
      'medium': 'default',
      'low': 'secondary'
    } as const;
    
    const labels = {
      'high': 'Haute',
      'medium': 'Moyenne',
      'low': 'Basse'
    };

    return (
      <Badge variant={variants[priority as keyof typeof variants]}>
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  const handleContact = (client: any) => {
    setSelectedClient(client);
    setContactForm({
      subject: `Contact: ${client.company}`,
      message: ''
    });
    setShowContactDialog(true);
  };

  const sendEmail = () => {
    console.log('Envoi email à:', selectedClient?.email, contactForm);
    toast({
      title: "Email envoyé",
      description: `Votre message a été envoyé à ${selectedClient?.contactPerson}`,
    });
    setShowContactDialog(false);
    setContactForm({ subject: '', message: '' });
  };

  const addNewClient = () => {
    console.log('Nouveau client:', newClientForm);
    toast({
      title: "Client ajouté",
      description: `${newClientForm.company} a été ajouté avec succès`,
    });
    setShowNewClientDialog(false);
    setNewClientForm({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      company: '',
      industry: '',
      budget: '',
      priority: ''
    });
  };

  const viewProjects = (client: any) => {
    setSelectedClient(client);
    setShowProjectsDialog(true);
  };

  const deleteClient = (clientId: string) => {
    console.log('Supprimer client:', clientId);
    toast({
      title: "Client supprimé",
      description: "Le client a été supprimé avec succès",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-royal-900">Gestion des Clients</h1>
          <p className="text-muted-foreground">Gérer votre portefeuille clients</p>
        </div>
        <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
          <DialogTrigger asChild>
            <Button className="royal-gradient text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un Nouveau Client</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Entreprise</Label>
                <Input
                  id="company"
                  value={newClientForm.company}
                  onChange={(e) => setNewClientForm(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Nom de l'entreprise"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Personne de contact</Label>
                <Input
                  id="contactPerson"
                  value={newClientForm.contactPerson}
                  onChange={(e) => setNewClientForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                  placeholder="Nom du contact"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newClientForm.email}
                  onChange={(e) => setNewClientForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemple.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={newClientForm.phone}
                  onChange={(e) => setNewClientForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={newClientForm.address}
                  onChange={(e) => setNewClientForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Adresse complète"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Secteur</Label>
                <Input
                  id="industry"
                  value={newClientForm.industry}
                  onChange={(e) => setNewClientForm(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="Secteur d'activité"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  value={newClientForm.budget}
                  onChange={(e) => setNewClientForm(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="€50,000"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select value={newClientForm.priority} onValueChange={(value) => setNewClientForm(prev => ({ ...prev, priority: value }))}>
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
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={addNewClient} className="royal-gradient text-white">
                Ajouter Client
              </Button>
              <Button variant="outline" onClick={() => setShowNewClientDialog(false)}>
                Annuler
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-royal-700">{clients.length}</div>
            <div className="text-sm text-muted-foreground">Total Clients</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{clients.filter(c => c.status === 'active').length}</div>
            <div className="text-sm text-muted-foreground">Clients Actifs</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">€405,000</div>
            <div className="text-sm text-muted-foreground">Budget Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {clients.filter(client => 
          client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
        ).map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={client.avatar} alt={client.contactPerson} />
                    <AvatarFallback className="royal-gradient text-white text-lg">
                      {client.contactPerson.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{client.company}</CardTitle>
                    <p className="text-sm text-muted-foreground">{client.contactPerson}</p>
                    <p className="text-xs text-muted-foreground">{client.industry}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {getStatusBadge(client.status)}
                  {getPriorityBadge(client.priority)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{client.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Client depuis {new Date(client.joinDate).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Project Stats */}
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-royal-700">{client.totalProjects}</div>
                    <div className="text-xs text-muted-foreground">Total Projets</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-700">{client.activeProjects}</div>
                    <div className="text-xs text-muted-foreground">En Cours</div>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium">Budget: {client.budget}</div>
                </div>
              </div>

              {/* Current Projects */}
              <div>
                <p className="text-sm font-medium mb-2">Projets actuels:</p>
                <div className="space-y-1">
                  {client.projects.map((project, index) => (
                    <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                      {project}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  size="sm"
                  onClick={() => viewProjects(client)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Projets
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  size="sm"
                  onClick={() => handleContact(client)}
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Contacter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteClient(client.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contacter {selectedClient?.contactPerson}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Sujet du message"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Votre message..."
                rows={4}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={sendEmail} className="royal-gradient text-white">
              <Mail className="h-4 w-4 mr-2" />
              Envoyer Email
            </Button>
            <Button variant="outline" onClick={() => setShowContactDialog(false)}>
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Projects Dialog */}
      <Dialog open={showProjectsDialog} onOpenChange={setShowProjectsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Projets de {selectedClient?.company}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedClient?.projects.map((project: string, index: number) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{project}</h4>
                      <p className="text-sm text-muted-foreground">
                        Status: {index === 0 ? 'En cours' : 'Terminé'}
                      </p>
                    </div>
                    <Badge variant={index === 0 ? 'default' : 'secondary'}>
                      {index === 0 ? 'En cours' : 'Terminé'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
