
import { BarChart3, FolderOpen, Users, Clock, TrendingUp, AlertTriangle, Calendar, Target } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from 'recharts';

const projectsData = [
  { name: 'Site E-commerce', progress: 85, status: 'En cours', priority: 'high', endDate: '2024-07-15' },
  { name: 'App Mobile Banking', progress: 60, status: 'En cours', priority: 'high', endDate: '2024-08-20' },
  { name: 'Système CRM', progress: 95, status: 'Presque terminé', priority: 'medium', endDate: '2024-06-30' },
  { name: 'Dashboard Analytics', progress: 40, status: 'En cours', priority: 'low', endDate: '2024-09-10' },
];

const recentActivities = [
  { message: 'Nouveau projet "Site E-commerce" créé', time: 'Il y a 2h', type: 'project' },
  { message: 'Tâche "Design UI" terminée', time: 'Il y a 4h', type: 'task' },
  { message: 'Réunion d\'équipe programmée', time: 'Il y a 6h', type: 'meeting' },
  { message: 'Rapport mensuel généré', time: 'Hier', type: 'report' },
];

// Nouvelles données pour les graphiques avancés
const quarterlyData = [
  {
    trimestre: 'T1', // Janvier, Février, Mars
    projets: 45,     // 12 + 15 + 18
    revenus: 282000, // 85000 + 92000 + 105000
    equipes: 10      // max(8, 9, 10)
  },
  {
    trimestre: 'T2', // Avril, Mai, Juin
    projets: 50,     // 14 + 20 + 16
    revenus: 311000, // 98000 + 118000 + 95000
    equipes: 12      // max(11, 12, 12)
  }
];


const performanceData = [
  { week: 'S1', productivite: 88, qualite: 92, delais: 85 },
  { week: 'S2', productivite: 92, qualite: 89, delais: 90 },
  { week: 'S3', productivite: 85, qualite: 94, delais: 88 },
  { week: 'S4', productivite: 94, qualite: 91, delais: 95 }
];

const departmentData = [
  { name: 'Développement', value: 45, color: '#3B82F6' },
  { name: 'Design', value: 25, color: '#10B981' },
  { name: 'Marketing', value: 20, color: '#F59E0B' },
  { name: 'Support', value: 10, color: '#EF4444' }
];

const chartConfig = {
  projets: { label: "Projets", color: "#3B82F6" },
  revenus: { label: "Revenus", color: "#10B981" },
  equipes: { label: "Équipes", color: "#F59E0B" },
  productivite: { label: "Productivité", color: "#8B5CF6" },
  qualite: { label: "Qualité", color: "#06B6D4" },
  delais: { label: "Délais", color: "#84CC16" }
};

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-royal-900">Tableau de Bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de vos projets et performances</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Projets Totaux"
          value={127}
          change="+12%"
          changeType="positive"
          icon={FolderOpen}
        />
        <StatCard
          title="Projets Actifs"
          value={89}
          change="+5%"
          changeType="positive"
          icon={BarChart3}
        />
        <StatCard
          title="Membres d'Équipe"
          value={156}
          change="+8"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Taux de Réussite"
          value="94.2%"
          change="+3%"
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      {/* Advanced Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Mensuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <AreaChart data={quarterlyData}>
                <defs>
                  <linearGradient id="colorProjets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-projets)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-projets)" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="projets" stroke="var(--color-projets)" fillOpacity={1} fill="url(#colorProjets)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* KPI Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Tendances KPI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="productivite" stroke="var(--color-productivite)" strokeWidth={3} />
                <Line type="monotone" dataKey="qualite" stroke="var(--color-qualite)" strokeWidth={3} />
                <Line type="monotone" dataKey="delais" stroke="var(--color-delais)" strokeWidth={3} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Projets en Cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectsData.map((project, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{project.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={project.priority === 'high' ? 'destructive' : 
                                project.priority === 'medium' ? 'default' : 'secondary'}
                      >
                        {project.priority === 'high' ? 'Haute' : 
                         project.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{project.endDate}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{project.status}</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Répartition Équipes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {departmentData.map((dept) => (
                <div key={dept.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: dept.color }}
                    />
                    <span className="text-sm">{dept.name}</span>
                  </div>
                  <span className="text-sm font-medium">{dept.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analyse Revenus et Projets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="trimestre" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar yAxisId="left" dataKey="projets" fill="var(--color-projets)" />
                <Bar yAxisId="right" dataKey="revenus" fill="var(--color-revenus)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Activités Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-royal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Métriques Rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-royal-600">42</div>
                <div className="text-sm text-muted-foreground">Réunions ce mois</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">98.5%</div>
                <div className="text-sm text-muted-foreground">Disponibilité système</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">147</div>
                <div className="text-sm text-muted-foreground">Tâches complétées</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">23min</div>
                <div className="text-sm text-muted-foreground">Temps réponse moyen</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Alertes de Retard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <div>
                <p className="font-medium">Projet: App Mobile Banking</p>
                <p className="text-sm text-muted-foreground">Retard de 3 jours sur la tâche "Intégration API"</p>
              </div>
              <Badge variant="destructive">Urgent</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <div>
                <p className="font-medium">Projet: Site E-commerce</p>
                <p className="text-sm text-muted-foreground">Date limite approche dans 2 jours</p>
              </div>
              <Badge variant="outline">Attention</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
