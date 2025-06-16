
import { useState } from 'react';
import { MessageSquare, Plus, Search, Send, Reply, Heart, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

const forumTopics = [
  {
    id: '1',
    title: 'Mise à jour du système CRM - Questions techniques',
    category: 'Technique',
    author: 'Marie Dubois',
    authorAvatar: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop&crop=face',
    replies: 12,
    lastReply: '2024-06-10 14:30',
    likes: 8,
    isResolved: false
  },
  {
    id: '2',
    title: 'Réunion équipe développement - Mercredi 15h',
    category: 'Réunion',
    author: 'Jean Martin',
    authorAvatar: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop&crop=face',
    replies: 5,
    lastReply: '2024-06-10 10:15',
    likes: 3,
    isResolved: true
  },
  {
    id: '3',
    title: 'Nouvelle fonctionnalité e-commerce - Feedback',
    category: 'Feedback',
    author: 'Alice Moreau',
    authorAvatar: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=100&h=100&fit=crop&crop=face',
    replies: 18,
    lastReply: '2024-06-10 16:45',
    likes: 15,
    isResolved: false
  }
];

const categories = ['Tous', 'Technique', 'Réunion', 'Feedback', 'Annonce'];

export default function Forums() {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewTopic, setShowNewTopic] = useState(false);

  const getCategoryBadge = (category: string) => {
    const variants = {
      'Technique': 'default',
      'Réunion': 'secondary',
      'Feedback': 'outline',
      'Annonce': 'destructive'
    } as const;

    return (
      <Badge variant={variants[category as keyof typeof variants] || 'default'}>
        {category}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-royal-900">Forums de Discussion</h1>
          <p className="text-muted-foreground">Échangez avec votre équipe et partagez vos idées</p>
        </div>
        <Button 
          className="royal-gradient text-white"
          onClick={() => setShowNewTopic(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Sujet
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Topic Form */}
      {showNewTopic && (
        <Card>
          <CardHeader>
            <CardTitle>Créer un nouveau sujet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Titre du sujet" />
            <select className="w-full p-2 border rounded-md">
              <option>Sélectionner une catégorie</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Textarea placeholder="Contenu de votre message..." rows={4} />
            <div className="flex gap-2">
              <Button className="royal-gradient text-white">
                <Send className="h-4 w-4 mr-2" />
                Publier
              </Button>
              <Button variant="outline" onClick={() => setShowNewTopic(false)}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Forum Topics */}
      <div className="space-y-4">
        {forumTopics.map((topic) => (
          <Card key={topic.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={topic.authorAvatar} alt={topic.author} />
                    <AvatarFallback>
                      {topic.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg hover:text-royal-600 cursor-pointer">
                        {topic.title}
                      </h3>
                      {topic.isResolved && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Résolu
                        </Badge>
                      )}
                      {getCategoryBadge(topic.category)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Par {topic.author}</span>
                      <span>{topic.replies} réponses</span>
                      <span>{topic.likes} likes</span>
                      <span>Dernière réponse: {topic.lastReply}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Reply className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
