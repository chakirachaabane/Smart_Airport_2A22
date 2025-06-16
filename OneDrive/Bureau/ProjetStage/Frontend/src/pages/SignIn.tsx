import { useState } from 'react';
import { LogIn, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useToast } from '@/hooks/use-toast'; // Import useToast

export default function SignIn() {
  const navigate = useNavigate(); // Get the navigate function
  const { toast } = useToast(); // Get the toast function

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // State for selected role
  const [isLoading, setIsLoading] = useState(false); // State to show loading


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Start loading state

    // Basic client-side validation (optional, backend validation is essential)
    if (!email || !password) {
        toast({
            title: "Erreur",
            description: "Veuillez entrer votre email et votre mot de passe.",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }

    console.log('Attempting Connexion:', { email, password, role });

    try {
        // Send POST request to backend signin endpoint
        const response = await fetch('http://localhost:3000/api/auth/signin', { // <--- Backend URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Send email, password, and role in the request body
            body: JSON.stringify({ email, password, role }), // Ensure role is sent
        });

        const data = await response.json(); // Parse the JSON response

        if (response.ok) {
            // Login successful
            console.log('Connexion réussie:', data);
            toast({
                title: "Succès",
                description: data.message || "Connexion réussie.",
            });

            // Store the token (e.g., in Local Storage)
            localStorage.setItem('token', data.token);
            // Optionally store user data (excluding sensitive info like password hash)
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect to the dashboard or desired page
            navigate('/'); // Redirect to the dashboard route defined in App.tsx

        } else {
            // Login failed
            console.error('Connexion échouée:', data);
            toast({
                title: "Erreur de connexion",
                description: data.message || "Une erreur est survenue lors de la connexion.",
                variant: "destructive",
            });
        }

    } catch (error: any) {
        // Handle network errors (server down, no internet, etc.)
        console.error('Erreur lors de l\'envoi de la requête de connexion:', error);
        toast({
            title: "Erreur réseau",
            description: "Impossible de se connecter au serveur. Veuillez vérifier votre connexion.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false); // End loading state
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 to-royal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 royal-gradient rounded-full flex items-center justify-center">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-royal-900">Connexion</CardTitle>
          <p className="text-muted-foreground">Accédez à votre compte ProjectFlow</p>
        </CardHeader>
        <CardContent>
          {/* Changed form to call handleSignIn onSubmit */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required // HTML validation
                  disabled={isLoading} // Disable input while loading
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required // HTML validation
                  disabled={isLoading} // Disable input while loading
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              {/* Select for role - ensure it maps to your backend roles */}
              <Select value={role} onValueChange={setRole} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur (DSI)</SelectItem>
                  <SelectItem value="supervisor">Superviseur</SelectItem>
                  <SelectItem value="team_member">Membre d'équipe</SelectItem>
                  {/* Add 'client_contact' if applicable */}
                  <SelectItem value="client_contact">Contact Client</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit button - disabled while loading */}
            <Button type="submit" className="w-full royal-gradient text-white" disabled={isLoading}>
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Pas encore de compte? </span>
              <Link to="/signup" className="text-royal-600 hover:underline">
                S'inscrire
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}