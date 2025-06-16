
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
}

interface ProjectStatsProps {
  projects: Project[];
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({ projects }) => {
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'terminé').length;
  const ongoingProjects = projects.filter(p => p.status === 'en_cours').length;
  const blockedProjects = projects.filter(p => p.status === 'bloqué').length;
  const delayedProjects = projects.filter(p => p.status === 'retard').length;
  
  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
  const averageProgress = totalProjects > 0 ? projects.reduce((sum, project) => sum + project.progress, 0) / totalProjects : 0;
  const totalTeamMembers = projects.reduce((sum, project) => sum + project.team, 0);

  const stats = [
    {
      title: 'Total Projets',
      value: totalProjects.toString(),
      description: 'Projets actifs',
      color: 'bg-royal-blue-600',
      textColor: 'text-white'
    },
    {
      title: 'Terminés',
      value: completedProjects.toString(),
      description: `${totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0}% du total`,
      color: 'bg-green-500',
      textColor: 'text-white'
    },
    {
      title: 'En Cours',
      value: ongoingProjects.toString(),
      description: `${totalProjects > 0 ? Math.round((ongoingProjects / totalProjects) * 100) : 0}% du total`,
      color: 'bg-blue-500',
      textColor: 'text-white'
    },
    {
      title: 'Bloqués',
      value: blockedProjects.toString(),
      description: `${totalProjects > 0 ? Math.round((blockedProjects / totalProjects) * 100) : 0}% du total`,
      color: 'bg-red-500',
      textColor: 'text-white'
    },
    {
      title: 'En Retard',
      value: delayedProjects.toString(),
      description: `${totalProjects > 0 ? Math.round((delayedProjects / totalProjects) * 100) : 0}% du total`,
      color: 'bg-orange-500',
      textColor: 'text-white'
    },
    {
      title: 'Budget Total',
      value: `${(totalBudget / 1000).toFixed(0)}K€`,
      description: 'Budget alloué',
      color: 'bg-royal-blue-500',
      textColor: 'text-white'
    },
    {
      title: 'Progression Moy.',
      value: `${averageProgress.toFixed(0)}%`,
      description: 'Avancement global',
      color: 'bg-royal-blue-400',
      textColor: 'text-white'
    },
    {
      title: 'Équipe Totale',
      value: totalTeamMembers.toString(),
      description: 'Membres actifs',
      color: 'bg-royal-blue-700',
      textColor: 'text-white'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-in">
      {stats.map((stat, index) => (
        <Card 
          key={stat.title} 
          className="shadow-lg border-royal-blue-200 hover:shadow-xl transition-all duration-300 hover:scale-105"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardContent className="p-6">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.color} mb-4`}>
              <span className={`text-lg font-bold ${stat.textColor}`}>
                {stat.value.charAt(0)}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-royal-blue-800">{stat.value}</p>
              <p className="text-sm font-medium text-royal-blue-700">{stat.title}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
