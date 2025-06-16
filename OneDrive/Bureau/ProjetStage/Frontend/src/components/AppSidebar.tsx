
import { 
  BarChart3, 
  FolderOpen, 
  MessageSquare, 
  Calendar, 
  Users, 
  Settings, 
  User,
  Trophy,
  FileText,
  Bell,
  Building,
 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: "Tableau de Bord",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Projets",
    url: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
  },
 {
  title: "Projets par Société",
  url: "/ProjectManagement",
  icon: Building,
},

  {
    title: "Équipe",
    url: "/team",
    icon: Users,
  },
   {
    title: "Tasks",
    url: "/tasks",
    icon: Users,
  },
  {
    title: "Forums",
    url: "/forums",
    icon: MessageSquare,
  },
  {
    title: "Réunions",
    url: "/meetings",
    icon: Calendar,
  },
  {
    title: "Événements",
    url: "/events",
    icon: Trophy,
  },
  {
    title: "Rapports",
    url: "/reports",
    icon: FileText,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
];

const settingsItems = [
  {
    title: "Profil",
    url: "/profile",
    icon: User,
  },
  {
    title: "Paramètres",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 royal-gradient rounded-lg flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-sidebar-foreground">ProjectFlow</h2>
            <p className="text-sm text-sidebar-foreground/70">Dashboard Pro</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                        location.pathname === item.url
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Compte</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                        location.pathname === item.url
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="bg-sidebar-accent rounded-lg p-3">
          <p className="text-xs text-sidebar-foreground/70 text-center">
            Version 2.0 • Société Enterprise
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
