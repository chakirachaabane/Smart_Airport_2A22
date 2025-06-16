
import { useState } from 'react';
import { Trophy, Plus, Calendar, MapPin, Users, Star, Award, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const events = [
  {
    id: '1',
    title: 'Prix de la Meilleure Équipe - Q2 2024',
    description: 'Récompense pour l\'équipe ayant livré le plus de projets avec qualité',
    date: '2024-06-15',
    time: '14:00',
    location: 'Salle de conférence principale',
    type: 'award',
    status: 'upcoming',
    winner: null,
    participants: ['Équipe Alpha', 'Équipe Beta', 'Équipe Gamma'],
    prize: 'Bonus équipe + Certificat'
  },
  {
    id: '2',
    title: 'Célébration Projet E-commerce',
    description: 'Fête de fin de projet pour célébrer le succès du site e-commerce',
    date: '2024-06-20',
    time: '18:00',
    location: 'Restaurant Le Gourmet',
    type: 'celebration',
    status: 'upcoming',
    winner: 'Équipe Alpha',
    participants: ['Marie Dubois', 'Alice Moreau', 'Bob Durand'],
    prize: 'Dîner d\'équipe'
  },
  {
    id: '3',
    title: 'Concours Innovation - Mai 2024',
    description: 'Concours mensuel d\'innovation et de créativité',
    date: '2024-05-30',
    time: '16:00',
    location: 'Espace Innovation',
    type: 'competition',
    status: 'completed',
    winner: 'Jean Martin',
    participants: ['Jean Martin', 'Sophie Laurent', 'David Chen'],
    prize: 'iPad Pro + Formation'
  }
];

const topPerformers = [
  {
    name: 'Marie Dubois',
    avatar: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop&crop=face',
    points: 1250,
    achievements: ['Leader du mois', 'Projet parfait', 'Mentor excellent'],
    rank: 1
  },
  {
    name: 'Jean Martin',
    avatar: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop&crop=face',
    points: 1180,
    achievements: ['Innovation', 'Délais respectés', 'Collaboration'],
    rank: 2
  },
  {
    name: 'Alice Moreau',
    avatar: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=100&h=100&fit=crop&crop=face',
    points: 1120,
    achievements: ['Code qualité', 'Formation équipe', 'Créativité'],
    rank: 3
  }
];

export default function Events() {
  const [showNewEvent, setShowNewEvent] = useState(false);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'award': return Trophy;
      case 'celebration': return Gift;
      case 'competition': return Award;
      default: return Calendar;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'upcoming': 'default',
      'ongoing': 'secondary',
      'completed': 'outline'
    } as const;

    const labels = {
      'upcoming': 'À venir',
      'ongoing': 'En cours',
      'completed': 'Terminé'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-600 bg-yellow-100';
      case 2: return 'text-gray-600 bg-gray-100';
      case 3: return 'text-orange-600 bg-orange-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-royal-900">Événements & Récompenses</h1>
          <p className="text-muted-foreground">Célébrez les succès et récompensez l'excellence</p>
        </div>
        <Button 
          className="royal-gradient text-white"
          onClick={() => setShowNewEvent(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Événement
        </Button>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Top Performers du Mois
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topPerformers.map((performer) => (
              <div key={performer.name} className="text-center">
                <div className="relative mb-4">
                  <Avatar className="h-20 w-20 mx-auto">
                    <AvatarImage src={performer.avatar} alt={performer.name} />
                    <AvatarFallback>
                      {performer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankColor(performer.rank)}`}>
                    {performer.rank}
                  </div>
                </div>
                <h3 className="font-semibold text-lg">{performer.name}</h3>
                <p className="text-royal-600 font-medium">{performer.points} points</p>
                <div className="flex flex-wrap gap-1 mt-2 justify-center">
                  {performer.achievements.map((achievement, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {achievement}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event) => {
          const EventIcon = getEventIcon(event.type);
          return (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 royal-gradient rounded-lg flex items-center justify-center">
                      <EventIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        {getStatusBadge(event.status)}
                      </div>
                      <p className="text-muted-foreground mb-3">{event.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{event.date} à {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-muted-foreground" />
                          <span>{event.prize}</span>
                        </div>
                      </div>

                      {event.winner && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm">
                            <strong className="text-green-800">Gagnant:</strong> {event.winner}
                          </p>
                        </div>
                      )}

                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Participants:</p>
                        <div className="flex flex-wrap gap-1">
                          {event.participants.map((participant, index) => (
                            <Badge key={index} variant="outline">
                              {participant}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* New Event Form */}
      {showNewEvent && (
        <Card>
          <CardHeader>
            <CardTitle>Créer un nouvel événement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Titre de l'événement" className="p-2 border rounded-md" />
              <select className="p-2 border rounded-md">
                <option value="">Type d'événement</option>
                <option value="award">Récompense</option>
                <option value="celebration">Célébration</option>
                <option value="competition">Concours</option>
              </select>
              <input type="date" className="p-2 border rounded-md" />
              <input type="time" className="p-2 border rounded-md" />
            </div>
            <input placeholder="Lieu" className="w-full p-2 border rounded-md" />
            <textarea placeholder="Description" rows={3} className="w-full p-2 border rounded-md" />
            <input placeholder="Prix/Récompense" className="w-full p-2 border rounded-md" />
            <div className="flex gap-2">
              <Button className="royal-gradient text-white">
                Créer l'Événement
              </Button>
              <Button variant="outline" onClick={() => setShowNewEvent(false)}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
