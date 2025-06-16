
import { FileText, Download, Calendar, Filter, TrendingUp, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const projectData = [
  { month: 'Jan', completed: 12, inProgress: 8, delayed: 2 },
  { month: 'Fév', completed: 15, inProgress: 10, delayed: 1 },
  { month: 'Mar', completed: 18, inProgress: 12, delayed: 3 },
  { month: 'Avr', completed: 14, inProgress: 15, delayed: 2 },
  { month: 'Mai', completed: 20, inProgress: 11, delayed: 1 },
  { month: 'Jun', completed: 16, inProgress: 14, delayed: 4 }
];

const teamPerformance = [
  { name: 'Équipe A', productivity: 92, satisfaction: 88 },
  { name: 'Équipe B', productivity: 85, satisfaction: 91 },
  { name: 'Équipe C', productivity: 78, satisfaction: 85 },
  { name: 'Équipe D', productivity: 95, satisfaction: 93 }
];

const projectStatus = [
  { name: 'Terminés', value: 65, color: '#10B981' },
  { name: 'En cours', value: 28, color: '#3B82F6' },
  { name: 'En retard', value: 7, color: '#EF4444' }
];

const chartConfig = {
  completed: { label: "Terminés", color: "#10B981" },
  inProgress: { label: "En cours", color: "#3B82F6" },
  delayed: { label: "En retard", color: "#EF4444" },
  productivity: { label: "Productivité", color: "#8B5CF6" },
  satisfaction: { label: "Satisfaction", color: "#F59E0B" }
};

export default function Reports() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-royal-900">Rapports et Analyses</h1>
          <p className="text-muted-foreground">Analyses détaillées des performances et statistiques</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button className="royal-gradient text-white">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux de Réussite</p>
                <p className="text-2xl font-bold text-green-600">94.2%</p>
                <p className="text-xs text-green-600">+2.1% ce mois</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Projets Livrés</p>
                <p className="text-2xl font-bold text-royal-600">127</p>
                <p className="text-xs text-royal-600">+8 ce mois</p>
              </div>
              <FileText className="h-8 w-8 text-royal-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Équipes Actives</p>
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-xs text-blue-600">+1 ce mois</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Temps Moyen</p>
                <p className="text-2xl font-bold text-orange-600">24j</p>
                <p className="text-xs text-orange-600">-3j ce mois</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects Overview Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution des Projets</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completed" fill="var(--color-completed)" />
                <Bar dataKey="inProgress" fill="var(--color-inProgress)" />
                <Bar dataKey="delayed" fill="var(--color-delayed)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance des Équipes</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={teamPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="productivity" stroke="var(--color-productivity)" strokeWidth={2} />
                <Line type="monotone" dataKey="satisfaction" stroke="var(--color-satisfaction)" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Statuts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {projectStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {projectStatus.map((status) => (
                <div key={status.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-sm">{status.name}</span>
                  </div>
                  <span className="text-sm font-medium">{status.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Rapports Récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Rapport Mensuel - Mai 2024', date: '2024-06-01', status: 'Généré', type: 'Mensuel' },
                { name: 'Analyse Performance Équipes', date: '2024-05-28', status: 'En cours', type: 'Performance' },
                { name: 'Rapport Projet E-commerce', date: '2024-05-25', status: 'Généré', type: 'Projet' },
                { name: 'Statistiques Trimestrielles', date: '2024-05-20', status: 'Généré', type: 'Trimestriel' }
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-muted-foreground">{report.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={report.status === 'Généré' ? 'secondary' : 'default'}>
                      {report.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
