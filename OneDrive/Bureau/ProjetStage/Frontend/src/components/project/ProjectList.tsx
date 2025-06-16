
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  company: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  team: number;
  teamMembers: string[];
}

interface ProjectListProps {
  projects: Project[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'terminé':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'en_cours':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'bloqué':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'retard':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'terminé':
      return 'Terminé';
    case 'en_cours':
      return 'En Cours';
    case 'bloqué':
      return 'Bloqué';
    case 'retard':
      return 'En Retard';
    default:
      return status;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatBudget = (budget: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(budget);
};

export const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <Card className="shadow-lg border-royal-blue-200 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-royal-blue-700">Liste des Projets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucun projet trouvé avec les filtres sélectionnés.</p>
            </div>
          ) : (
            projects.map((project, index) => (
              <div
                key={project.id}
                className="p-6 border border-royal-blue-100 rounded-lg hover:shadow-md transition-all duration-300 hover:border-royal-blue-300 bg-gradient-to-r from-white to-royal-blue-50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  {/* Nom et société */}
                  <div className="lg:col-span-3">
                    <h3 className="font-semibold text-royal-blue-800 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {project.company}
                    </p>
                  </div>

                  {/* Statut */}
                  <div className="lg:col-span-2">
                    <Badge 
                      className={`${getStatusColor(project.status)} font-medium`}
                      variant="outline"
                    >
                      {getStatusLabel(project.status)}
                    </Badge>
                  </div>

                  {/* Progression */}
                  <div className="lg:col-span-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-royal-blue-700">
                          Progression
                        </span>
                        <span className="text-sm font-bold text-royal-blue-600">
                          {project.progress}%
                        </span>
                      </div>
                      <Progress 
                        value={project.progress} 
                        className="h-2"
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="lg:col-span-2">
                    <div className="text-sm space-y-1">
                      <div className="text-muted-foreground">
                        Début: {formatDate(project.startDate)}
                      </div>
                      <div className="text-muted-foreground">
                        Fin: {formatDate(project.endDate)}
                      </div>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="lg:col-span-2">
                    <div className="text-sm space-y-1">
                      <div className="font-medium text-royal-blue-700">
                        {formatBudget(project.budget)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-1">
                    <Button
                      size="sm"
                      className="w-full bg-royal-blue-600 hover:bg-royal-blue-700 text-white"
                    >
                      Voir
                    </Button>
                  </div>

                  {/* Équipe - Nouvelle ligne complète */}
                  <div className="lg:col-span-12 mt-4 pt-4 border-t border-royal-blue-100">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2 text-royal-blue-700">
                        <Users className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Équipe ({project.team} membre{project.team > 1 ? 's' : ''})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.teamMembers.map((member, memberIndex) => (
                          <Badge 
                            key={memberIndex} 
                            variant="secondary" 
                            className="bg-royal-blue-50 text-royal-blue-700 border-royal-blue-200"
                          >
                            {member}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
