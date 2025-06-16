
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';

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

interface ProjectChartProps {
  projects: Project[];
}

export const ProjectChart: React.FC<ProjectChartProps> = ({ projects }) => {
  // Fonction pour valider et nettoyer les valeurs numériques
  const sanitizeNumber = (value: any): number => {
    const num = Number(value);
    return isNaN(num) || !isFinite(num) ? 0 : num;
  };

  const statusData = [
    {
      name: 'Terminés',
      value: projects.filter(p => p.status === 'terminé').length,
      color: '#10B981'
    },
    {
      name: 'En Cours',
      value: projects.filter(p => p.status === 'en_cours').length,
      color: '#3B82F6'
    },
    {
      name: 'Bloqués',
      value: projects.filter(p => p.status === 'bloqué').length,
      color: '#EF4444'
    },
    {
      name: 'En Retard',
      value: projects.filter(p => p.status === 'retard').length,
      color: '#F97316'
    }
  ];

  // Nettoyer les données de progression avec validation
  const progressData = projects
    .filter(project => project && project.name) // Filtrer les projets valides
    .map(project => ({
      name: project.name.length > 15 ? project.name.substring(0, 15) + '...' : project.name,
      progress: sanitizeNumber(project.progress),
      budget: sanitizeNumber(project.budget)
    }))
    .filter(item => item.progress >= 0 && item.progress <= 100); // S'assurer que la progression est dans une plage valide

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-royal-blue-200 rounded-lg shadow-lg">
          <p className="font-medium text-royal-blue-800">{label}</p>
          <p className="text-royal-blue-600">
            {`Progression: ${sanitizeNumber(payload[0].value)}%`}
          </p>
          {payload[0].payload.budget && (
            <p className="text-muted-foreground text-sm">
              {`Budget: ${(sanitizeNumber(payload[0].payload.budget) / 1000).toFixed(0)}K€`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-royal-blue-200 rounded-lg shadow-lg">
          <p className="font-medium text-royal-blue-800">{payload[0].name}</p>
          <p className="text-royal-blue-600">
            {`Nombre: ${sanitizeNumber(payload[0].value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Vérifier s'il y a des données valides pour afficher les graphiques
  const hasValidData = progressData.length > 0;
  const hasStatusData = statusData.some(item => item.value > 0);

  return (
    <Card className="shadow-lg border-royal-blue-200">
      <CardHeader>
        <CardTitle className="text-royal-blue-700">Statut des Projets</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasValidData && !hasStatusData ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucune donnée disponible pour afficher les graphiques.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique en secteurs */}
            {hasStatusData && (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData.filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.filter(item => item.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value, entry: any) => (
                        <span style={{ color: entry.color }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Graphique de progression */}
            {hasValidData && (
              <div className="h-64">
                <h4 className="text-sm font-medium text-royal-blue-700 mb-4">Progression par Projet</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData} layout="horizontal" margin={{ left: 60 }}>
                    <XAxis 
                      type="number" 
                      domain={[0, 100]} 
                      tickFormatter={(value) => `${sanitizeNumber(value)}%`}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      tick={{ fontSize: 12 }} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="progress" 
                      fill="hsl(var(--royal-blue-500))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
