import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface CompanyData {
  name: string;
  projects: any[];
  totalProjects: number;
  totalBudget: number;
  averageProgress: number;
  totalTeamMembers: number;
}

interface CompanyChartsProps {
  companies: CompanyData[];
}

export const CompanyCharts: React.FC<CompanyChartsProps> = ({ companies }) => {
  // Couleurs vibrantes et variées pour les graphiques
  const vibrantColors = [
    '#FF6B6B', // Rouge corail
    '#4ECDC4', // Turquoise
    '#45B7D1', // Bleu ciel
    '#96CEB4', // Vert menthe
    '#FECA57', // Jaune doré
    '#FF9FF3', // Rose magenta
    '#54A0FF', // Bleu royal
    '#5F27CD', // Violet
    '#00D2D3', // Cyan
    '#FF9F43'  // Orange
  ];

  // Couleur spéciale pour les retards
  const delayColor = '#FF3838'; // Rouge vif pour les retards

  // Données pour le graphique de budget par société avec indication des retards
  const budgetData = companies.map((company, index) => {
    const delayedProjects = company.projects.filter(p => p.status === 'retard').length;
    const completedProjects = company.projects.filter(p => p.status === 'terminé').length;
    const inProgressProjects = company.projects.filter(p => p.status === 'en_cours').length;
    const blockedProjects = company.projects.filter(p => p.status === 'bloqué').length;

    return {
      name: company.name.length > 15 ? company.name.substring(0, 15) + '...' : company.name,
      budget: company.totalBudget / 1000, // En milliers
      terminés: completedProjects,
      enCours: inProgressProjects,
      bloqués: blockedProjects,
      retards: delayedProjects,
      color: vibrantColors[index % vibrantColors.length]
    };
  });

  // Données pour le graphique de progression avec mise en évidence des retards
  const progressData = companies.map((company, index) => {
    const delayedProjects = company.projects.filter(p => p.status === 'retard').length;
    return {
      name: company.name.length > 15 ? company.name.substring(0, 15) + '...' : company.name,
      progression: Math.round(company.averageProgress),
      equipe: company.totalTeamMembers,
      retards: delayedProjects,
      hasDelays: delayedProjects > 0,
      color: vibrantColors[index % vibrantColors.length]
    };
  });

  // Données pour le graphique en secteurs des équipes avec nouvelles couleurs
  const teamData = companies.map((company, index) => ({
    name: company.name,
    value: company.totalTeamMembers,
    color: vibrantColors[index % vibrantColors.length]
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className={`${entry.dataKey === 'retards' ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
              {`${entry.name}: ${entry.value}${entry.dataKey === 'budget' ? 'K€' : entry.dataKey === 'progression' ? '%' : ''}`}
              {entry.dataKey === 'retards' && entry.value > 0 && ' ⚠️'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{payload[0].name}</p>
          <p className="text-gray-600">
            {`Équipe: ${payload[0].value} membre${payload[0].value > 1 ? 's' : ''}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <h2 className="text-2xl font-bold text-royal-blue-800">Analyse par Société</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des projets par statut avec couleurs vibrantes */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-700 flex items-center gap-2">
              Statut des Projets par Société
              <span className="text-sm font-normal text-red-600">
                (🔴 = Retards)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetData} margin={{ left: 20, right: 20 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="terminés" fill="#4ECDC4" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="enCours" fill="#45B7D1" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="bloqués" fill="#FECA57" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="retards" fill={delayColor} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Graphique Budget par Société avec couleurs vibrantes */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-700">Budget par Société (K€)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetData} margin={{ left: 20, right: 20 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tickFormatter={(value) => `${value}K€`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="budget"
                    radius={[4, 4, 0, 0]}
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Graphique Progression Moyenne avec indication des retards */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-700 flex items-center gap-2">
              Progression Moyenne
              <span className="text-sm font-normal text-red-600">
                (Points rouges = Retards)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData} margin={{ left: 20, right: 20 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="progression"
                    stroke="#FF6B6B"
                    strokeWidth={3}
                    dot={(props: any) => {
                      const hasDelays = progressData[props.index]?.hasDelays;
                      return (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={hasDelays ? 8 : 6}
                          fill={hasDelays ? delayColor : progressData[props.index]?.color || "#FF6B6B"}
                          stroke={hasDelays ? "#fff" : progressData[props.index]?.color || "#FF6B6B"}
                          strokeWidth={2}
                        />
                      );
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Graphique Répartition des Équipes avec couleurs vibrantes */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-700">Répartition des Équipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={teamData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {teamData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
