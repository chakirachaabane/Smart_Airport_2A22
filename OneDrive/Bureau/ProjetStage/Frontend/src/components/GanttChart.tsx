
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'completed' | 'in_progress' | 'delayed' | 'pending';
  assignee: string;
  dependencies?: string[];
}

interface GanttChartProps {
  tasks: Task[];
  projectStartDate: string;
  projectEndDate: string;
  title?: string;
}

export function GanttChart({ tasks, projectStartDate, projectEndDate, title = "Diagramme de Gantt" }: GanttChartProps) {
  const { timelineData, totalDays } = useMemo(() => {
    const start = new Date(projectStartDate);
    const end = new Date(projectEndDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const timelineData = tasks.map(task => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      const taskDuration = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24));
      const startOffset = Math.ceil((taskStart.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const widthPercentage = (taskDuration / totalDays) * 100;
      const leftPercentage = (startOffset / totalDays) * 100;
      
      return {
        ...task,
        startOffset,
        duration: taskDuration,
        widthPercentage,
        leftPercentage
      };
    });
    
    return { timelineData, totalDays };
  }, [tasks, projectStartDate, projectEndDate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'delayed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'completed': 'secondary',
      'in_progress': 'default',
      'delayed': 'destructive',
      'pending': 'outline'
    } as const;

    const labels = {
      'completed': 'Terminé',
      'in_progress': 'En cours',
      'delayed': 'En retard',
      'pending': 'En attente'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  // Generate timeline header (weeks/months)
  const generateTimelineHeader = () => {
    const weeks = [];
    const start = new Date(projectStartDate);
    
    for (let i = 0; i < totalDays; i += 7) {
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() + i);
      weeks.push({
        week: Math.floor(i / 7) + 1,
        date: weekStart.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        left: (i / totalDays) * 100
      });
    }
    
    return weeks;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline Header */}
          <div className="relative h-8 bg-muted/30 rounded">
            {generateTimelineHeader().map((week, index) => (
              <div
                key={index}
                className="absolute top-0 h-full flex items-center text-xs font-medium text-muted-foreground px-2"
                style={{ left: `${week.left}%` }}
              >
                S{week.week}
              </div>
            ))}
          </div>

          {/* Tasks */}
          <div className="space-y-3">
            {timelineData.map((task) => (
              <div key={task.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {getStatusIcon(task.status)}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm truncate">{task.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {task.assignee} • {task.duration} jours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(task.status)}
                    <span className="text-xs text-muted-foreground min-w-fit">
                      {task.progress}%
                    </span>
                  </div>
                </div>
                
                {/* Task Timeline Bar */}
                <div className="relative h-6 bg-muted/30 rounded">
                  <div
                    className={`absolute top-0 h-full rounded ${getStatusColor(task.status)} opacity-80`}
                    style={{
                      left: `${task.leftPercentage}%`,
                      width: `${task.widthPercentage}%`
                    }}
                  >
                    {/* Progress indicator */}
                    <div
                      className="h-full bg-white/30 rounded-l"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  
                  {/* Task dates */}
                  <div
                    className="absolute top-0 h-full flex items-center text-xs font-medium text-white px-2"
                    style={{
                      left: `${task.leftPercentage}%`,
                      width: `${task.widthPercentage}%`
                    }}
                  >
                    <span className="truncate">
                      {new Date(task.startDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} - 
                      {new Date(task.endDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Delayed tasks notification */}
                {task.status === 'delayed' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-800 font-medium">
                        Tâche en retard - Notification envoyée à l'équipe
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-xs">Terminé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-xs">En cours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-xs">En retard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span className="text-xs">En attente</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
