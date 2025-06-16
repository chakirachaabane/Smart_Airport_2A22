
import { useState } from 'react';
import { Video, Calendar, Clock, Users, Plus, Search, Phone, Camera, Mic, MicOff, CameraOff, Share2, MessageSquare, X, Settings } from 'lucide-react';
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

const meetings = [
  {
    id: '1',
    title: 'Réunion Équipe Développement',
    description: 'Point hebdomadaire sur l\'avancement des projets',
    date: '2024-06-12',
    time: '14:00',
    duration: '1h30',
    type: 'team',
    status: 'scheduled',
    organizer: 'Marie Dubois',
    organizerAvatar: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop&crop=face',
    participants: [
      { name: 'Alice Moreau', avatar: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=100&h=100&fit=crop&crop=face', status: 'accepted' },
      { name: 'Bob Durand', avatar: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=100&h=100&fit=crop&crop=face', status: 'pending' },
      { name: 'Jean Martin', avatar: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop&crop=face', status: 'accepted' }
    ],
    meetingLink: 'https://meet.company.com/room/dev-team-weekly',
    agenda: ['Revue Sprint', 'Blocages techniques', 'Prochaines étapes', 'Questions diverses'],
    room: 'Salle de conférence A',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Présentation Client Fashion Corp',
    description: 'Démonstration de la nouvelle fonctionnalité e-commerce',
    date: '2024-06-13',
    time: '10:00',
    duration: '2h',
    type: 'client',
    status: 'scheduled',
    organizer: 'Sophie Martin',
    organizerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    participants: [
      { name: 'Marie Dubois', avatar: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop&crop=face', status: 'accepted' },
      { name: 'Alice Moreau', avatar: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=100&h=100&fit=crop&crop=face', status: 'accepted' }
    ],
    meetingLink: 'https://meet.company.com/room/client-demo',
    agenda: ['Présentation des nouvelles fonctionnalités', 'Test utilisateur en direct', 'Feedback client', 'Prochaines étapes'],
    room: 'En ligne',
    priority: 'high'
  },
  {
    id: '3',
    title: 'Formation Sécurité',
    description: 'Session de formation sur les bonnes pratiques de sécurité',
    date: '2024-06-14',
    time: '09:00',
    duration: '3h',
    type: 'training',
    status: 'scheduled',
    organizer: 'Admin System',
    organizerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    participants: [],
    meetingLink: 'https://meet.company.com/room/security-training',
    agenda: ['Introduction à la sécurité', 'Mots de passe forts', 'Phishing et protection', 'Quiz final'],
    room: 'Salle de formation',
    priority: 'medium'
  }
];

export default function Meetings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewMeetingDialog, setShowNewMeetingDialog] = useState(false);
  const [showMeetingDetails, setShowMeetingDetails] = useState<string | null>(null);
  const [showJoinMeeting, setShowJoinMeeting] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [newMeetingForm, setNewMeetingForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    type: '',
    participants: '',
    agenda: '',
    room: ''
  });
  const { toast } = useToast();

  const getTypeBadge = (type: string) => {
    const variants = {
      'team': 'default',
      'client': 'destructive',
      'training': 'secondary'
    } as const;
    
    const labels = {
      'team': 'Équipe',
      'client': 'Client',
      'training': 'Formation'
    };

    return (
      <Badge variant={variants[type as keyof typeof variants]}>
        {labels[type as keyof typeof labels]}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'scheduled': 'default',
      'ongoing': 'destructive',
      'completed': 'secondary',
      'cancelled': 'outline'
    } as const;
    
    const labels = {
      'scheduled': 'Programmée',
      'ongoing': 'En cours',
      'completed': 'Terminée',
      'cancelled': 'Annulée'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const addNewMeeting = () => {
    console.log('Nouvelle réunion:', newMeetingForm);
    toast({
      title: "Réunion créée",
      description: `La réunion "${newMeetingForm.title}" a été programmée`,
    });
    setShowNewMeetingDialog(false);
    setNewMeetingForm({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: '',
      type: '',
      participants: '',
      agenda: '',
      room: ''
    });
  };

  const joinMeeting = (meeting: any) => {
    setShowJoinMeeting(meeting.id);
    toast({
      title: "Connexion à la réunion",
      description: `Vous rejoignez "${meeting.title}"`,
    });
  };

  const leaveMeeting = () => {
    setShowJoinMeeting(null);
    toast({
      title: "Réunion quittée",
      description: "Vous avez quitté la réunion",
    });
  };

  const viewDetails = (meetingId: string) => {
    setShowMeetingDetails(meetingId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-royal-900">Réunions</h1>
          <p className="text-muted-foreground">Gérer vos réunions et visioconférences</p>
        </div>
        <Dialog open={showNewMeetingDialog} onOpenChange={setShowNewMeetingDialog}>
          <DialogTrigger asChild>
            <Button className="royal-gradient text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Réunion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Programmer une Nouvelle Réunion</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={newMeetingForm.title}
                  onChange={(e) => setNewMeetingForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre de la réunion"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newMeetingForm.description}
                  onChange={(e) => setNewMeetingForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de la réunion"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newMeetingForm.date}
                  onChange={(e) => setNewMeetingForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Heure</Label>
                <Input
                  id="time"
                  type="time"
                  value={newMeetingForm.time}
                  onChange={(e) => setNewMeetingForm(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durée</Label>
                <Input
                  id="duration"
                  value={newMeetingForm.duration}
                  onChange={(e) => setNewMeetingForm(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="1h30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={newMeetingForm.type} onValueChange={(value) => setNewMeetingForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type de réunion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team">Équipe</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="training">Formation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="participants">Participants (emails séparés par des virgules)</Label>
                <Input
                  id="participants"
                  value={newMeetingForm.participants}
                  onChange={(e) => setNewMeetingForm(prev => ({ ...prev, participants: e.target.value }))}
                  placeholder="alice@exemple.com, bob@exemple.com"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="agenda">Ordre du jour</Label>
                <Textarea
                  id="agenda"
                  value={newMeetingForm.agenda}
                  onChange={(e) => setNewMeetingForm(prev => ({ ...prev, agenda: e.target.value }))}
                  placeholder="Point 1, Point 2, Point 3..."
                  rows={3}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="room">Salle/Lieu</Label>
                <Input
                  id="room"
                  value={newMeetingForm.room}
                  onChange={(e) => setNewMeetingForm(prev => ({ ...prev, room: e.target.value }))}
                  placeholder="Salle A, En ligne, etc."
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={addNewMeeting} className="royal-gradient text-white">
                Programmer Réunion
              </Button>
              <Button variant="outline" onClick={() => setShowNewMeetingDialog(false)}>
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
            <div className="text-2xl font-bold text-royal-700">{meetings.length}</div>
            <div className="text-sm text-muted-foreground">Total Réunions</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{meetings.filter(m => m.status === 'scheduled').length}</div>
            <div className="text-sm text-muted-foreground">Programmées</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">2</div>
            <div className="text-sm text-muted-foreground">Aujourd'hui</div>
          </CardContent>
        </Card>
      </div>

      {/* Meetings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {meetings.filter(meeting => 
          meeting.title.toLowerCase().includes(searchTerm.toLowerCase())
        ).map((meeting) => (
          <Card key={meeting.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={meeting.organizerAvatar} alt={meeting.organizer} />
                    <AvatarFallback className="royal-gradient text-white">
                      {meeting.organizer.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{meeting.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">Par {meeting.organizer}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {getTypeBadge(meeting.type)}
                  {getStatusBadge(meeting.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{meeting.description}</p>

              {/* Meeting Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(meeting.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{meeting.time} ({meeting.duration})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{meeting.participants.length} participants</span>
                </div>
              </div>

              {/* Participants Avatars */}
              <div className="flex -space-x-2">
                {meeting.participants.slice(0, 3).map((participant, index) => (
                  <Avatar key={index} className="h-8 w-8 border-2 border-white">
                    <AvatarImage src={participant.avatar} alt={participant.name} />
                    <AvatarFallback className="text-xs">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {meeting.participants.length > 3 && (
                  <div className="h-8 w-8 rounded-full bg-muted border-2 border-white flex items-center justify-center text-xs">
                    +{meeting.participants.length - 3}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1 royal-gradient text-white" 
                  size="sm"
                  onClick={() => joinMeeting(meeting)}
                >
                  <Video className="h-3 w-3 mr-1" />
                  Rejoindre
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  size="sm"
                  onClick={() => viewDetails(meeting.id)}
                >
                  Détails
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Meeting Details Dialog */}
      <Dialog open={!!showMeetingDetails} onOpenChange={() => setShowMeetingDetails(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de la Réunion</DialogTitle>
          </DialogHeader>
          {(() => {
            const meeting = meetings.find(m => m.id === showMeetingDetails);
            if (!meeting) return null;
            
            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Informations</h3>
                    <p><strong>Titre:</strong> {meeting.title}</p>
                    <p><strong>Organisateur:</strong> {meeting.organizer}</p>
                    <p><strong>Date:</strong> {new Date(meeting.date).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Heure:</strong> {meeting.time}</p>
                    <p><strong>Durée:</strong> {meeting.duration}</p>
                    <p><strong>Lieu:</strong> {meeting.room}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Participants</h3>
                    <div className="space-y-2">
                      {meeting.participants.map((participant, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={participant.avatar} alt={participant.name} />
                            <AvatarFallback className="text-xs">
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{participant.name}</span>
                          <Badge variant={participant.status === 'accepted' ? 'secondary' : 'outline'} className="text-xs">
                            {participant.status === 'accepted' ? 'Accepté' : 'En attente'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{meeting.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Ordre du jour</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {meeting.agenda.map((item, index) => (
                      <li key={index} className="text-sm">{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={() => joinMeeting(meeting)} className="royal-gradient text-white">
                    <Video className="h-4 w-4 mr-2" />
                    Rejoindre la Réunion
                  </Button>
                  <Button variant="outline" onClick={() => setShowMeetingDetails(null)}>
                    Fermer
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Join Meeting Dialog */}
      <Dialog open={!!showJoinMeeting} onOpenChange={() => setShowJoinMeeting(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Réunion en cours</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Video Preview */}
            <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
              <div className="text-white text-center">
                <Camera className="h-24 w-24 mx-auto mb-4 opacity-50" />
                <p>Aperçu de votre caméra</p>
                <p className="text-sm opacity-75">La vidéo sera activée lors de la connexion</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button
                variant={isMuted ? "destructive" : "outline"}
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                variant={isCameraOff ? "destructive" : "outline"}
                size="icon"
                onClick={() => setIsCameraOff(!isCameraOff)}
              >
                {isCameraOff ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2 justify-center">
              <Button className="royal-gradient text-white">
                Démarrer la Réunion
              </Button>
              <Button variant="destructive" onClick={leaveMeeting}>
                <X className="h-4 w-4 mr-2" />
                Quitter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
