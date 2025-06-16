import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ProjectStats } from '@/components/project/ProjectStats';
import { ProjectChart } from '@/components/project/ProjectChart';
import { ProjectList } from '@/components/project/ProjectList';
import { CompanyCharts } from '@/components/project/CompanyCharts';
import { Search, Filter, Plus, Eye, Sparkles, TrendingUp } from 'lucide-react';

// Données d'exemple avec équipes
const companies = [
  'Toutes les sociétés',
  'TechCorp Solutions',
  'Innovation Labs',
  'Digital Dynamics',
  'Future Systems'
];

const projects = [
  {
    id: 1,
    name: 'Plateforme E-commerce',
    company: 'TechCorp Solutions',
    status: 'terminé',
    progress: 100,
    startDate: '2024-01-15',
    endDate: '2024-05-20',
    budget: 85000,
    team: 6,
    teamMembers: ['Alice Martin', 'Bob Durand', 'Claire Lefebvre', 'David Moreau', 'Emma Bernard', 'François Petit']
  },
  {
    id: 2,
    name: 'Application Mobile',
    company: 'Innovation Labs',
    status: 'en_cours',
    progress: 75,
    startDate: '2024-03-01',
    endDate: '2024-07-15',
    budget: 120000,
    team: 8,
    teamMembers: ['Sophie Laurent', 'Marc Dubois', 'Julie Simon', 'Pierre Michel', 'Camille Roux', 'Antoine Leroy', 'Manon Garcia', 'Thomas Lopez']
  },
  {
    id: 3,
    name: 'Système CRM',
    company: 'Digital Dynamics',
    status: 'bloqué',
    progress: 45,
    startDate: '2024-02-10',
    endDate: '2024-06-30',
    budget: 95000,
    team: 5,
    teamMembers: ['Nicolas Fournier', 'Isabelle Bonnet', 'Julien Moreau', 'Céline Girard', 'Olivier Martin']
  },
  {
    id: 4,
    name: 'Site Web Corporate',
    company: 'Future Systems',
    status: 'retard',
    progress: 60,
    startDate: '2024-01-20',
    endDate: '2024-04-30',
    budget: 45000,
    team: 3,
    teamMembers: ['Amélie Durand', 'Romain Lefevre', 'Lucie Moreau']
  },
  {
    id: 5,
    name: 'API Gateway',
    company: 'TechCorp Solutions',
    status: 'en_cours',
    progress: 30,
    startDate: '2024-04-01',
    endDate: '2024-08-15',
    budget: 75000,
    team: 4,
    teamMembers: ['Vincent Bernard', 'Nathalie Petit', 'Florian Rousseau', 'Caroline Blanc']
  },
  {
    id: 6,
    name: 'Dashboard Analytics',
    company: 'Innovation Labs',
    status: 'en_cours',
    progress: 85,
    startDate: '2024-02-15',
    endDate: '2024-06-01',
    budget: 90000,
    team: 6,
    teamMembers: ['Maxime Dubois', 'Laura Simon', 'Kévin Michel', 'Sarah Roux', 'Guillaume Leroy', 'Marine Garcia']
  }
];

const ProjectManagement = () => {
  const [selectedCompany, setSelectedCompany] = useState('Toutes les sociétés');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredProjects = projects.filter(project => {
    const matchesCompany = selectedCompany === 'Toutes les sociétés' || project.company === selectedCompany;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCompany && matchesSearch;
  });

  // Données pour les graphiques par société
  const companyData = companies.slice(1).map(company => {
    const companyProjects = projects.filter(p => p.company === company);
    return {
      name: company,
      projects: companyProjects,
      totalProjects: companyProjects.length,
      totalBudget: companyProjects.reduce((sum, p) => sum + p.budget, 0),
      averageProgress: companyProjects.length > 0 ? companyProjects.reduce((sum, p) => sum + p.progress, 0) / companyProjects.length : 0,
      totalTeamMembers: companyProjects.reduce((sum, p) => sum + p.team, 0)
    };
  });

  const handleAddProject = () => {
    setIsAddDialogOpen(true);
    console.log('Ouverture du formulaire d\'ajout de projet');
  };

  const handleViewAnalytics = () => {
    setIsViewDialogOpen(true);
    console.log('Ouverture des analyses avancées');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-blue-50 to-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête avec boutons innovants */}
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-royal-blue-800">Gestion des sociétés</h1>
              <p className="text-muted-foreground mt-2">
                Tableau de bord pour le suivi et la gestion des projets par société
              </p>
            </div>
            <div className="flex gap-3">
              {/* Bouton Voir - Analyses Avancées */}
              <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={handleViewAnalytics}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    <Sparkles className="w-4 h-4 mr-1" />
                    Analyses
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-purple-700">
                      <TrendingUp className="w-5 h-5" />
                      Analyses Avancées des Projets
                    </DialogTitle>
                  </DialogHeader>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="border-purple-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-purple-600">Taux de Réussite Global</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-purple-700">
                            {Math.round((projects.filter(p => p.status === 'terminé').length / projects.length) * 100)}%
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-pink-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-pink-600">Budget Total Engagé</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-pink-700">
                            {(projects.reduce((sum, p) => sum + p.budget, 0) / 1000000).toFixed(1)}M€
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>• Projets en retard nécessitent une attention immédiate</p>
                      <p>• Performance globale des équipes satisfaisante</p>
                      <p>• Recommandation: Optimiser les processus pour réduire les blocages</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Bouton Ajouter - Nouveau Projet */}
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={handleAddProject}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    <Sparkles className="w-4 h-4 mr-1" />
                    Nouveau Projet
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-emerald-700">
                      <Plus className="w-5 h-5" />
                      Créer un Nouveau Projet
                    </DialogTitle>
                  </DialogHeader>
                  <div className="p-4 space-y-4">
                    <Input placeholder="Nom du projet" />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une société" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.slice(1).map((company) => (
                          <SelectItem key={company} value={company}>
                            {company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input type="number" placeholder="Budget (€)" />
                    <Input type="date" placeholder="Date de début" />
                    <Input type="date" placeholder="Date de fin" />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        Créer le Projet
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border shadow-sm">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher un projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-full sm:w-64">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statistiques */}
        <ProjectStats projects={filteredProjects} />

        {/* Graphiques par société */}
        <CompanyCharts companies={companyData} />

        {/* Graphiques généraux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in">
          <ProjectChart projects={filteredProjects} />
          <Card className="shadow-lg border-royal-blue-200">
            <CardHeader>
              <CardTitle className="text-royal-blue-700">Répartition par Société</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {companies.slice(1).map((company) => {
                  const companyProjects = filteredProjects.filter(p => p.company === company);
                  const count = companyProjects.length;
                  const percentage = filteredProjects.length > 0 ? (count / filteredProjects.length) * 100 : 0;
                  
                  return (
                    <div key={company} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{company}</span>
                        <Badge variant="secondary" className="bg-royal-blue-100 text-royal-blue-800">
                          {count} projet{count > 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="w-full bg-royal-blue-100 rounded-full h-2">
                        <div
                          className="bg-royal-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des projets */}
        <ProjectList projects={filteredProjects} />
      </div>
    </div>
  );
};

export default ProjectManagement;
