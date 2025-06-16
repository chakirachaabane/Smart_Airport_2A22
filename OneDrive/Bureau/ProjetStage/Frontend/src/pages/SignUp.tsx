import { useState } from 'react';
import { UserPlus, User, Lock, Mail, Phone, Building, Loader2 } from 'lucide-react'; // Added Loader2 for loading state
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useToast } from '@/hooks/use-toast'; // Import useToast

export default function SignUp() {
  const navigate = useNavigate(); // Get the navigate function
  const { toast } = useToast(); // Get the toast function

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '', // Changed field name to match backend 'phoneNumber'
    company: '', // Keep for UI input, but not directly sent to /signup
    department: '',
    password: '',
    confirmPassword: '', // Keep for client-side validation
    role: '' // Ensure this maps to backend roles
  });

  const [isLoading, setIsLoading] = useState(false); // State to show loading

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true); // Start loading state

    // --- Client-side Validation ---
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.role) {
        toast({
            title: "Erreur de validation",
            description: "Veuillez remplir tous les champs obligatoires (Prénom, Nom, Email, Mot de passe, Rôle).",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        toast({
            title: "Erreur de validation",
            description: "Les mots de passe ne correspondent pas.",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }
    // TODO: Add more validation (email format, phone format, password strength, etc.)
    // --- End Client-side Validation ---

    console.log('Attempting Inscription:', formData);

    // Prepare data to send to the backend
    // Include only the fields expected by the backend /api/auth/signup endpoint
    const dataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password, // Send plain password for backend to hash
        role: formData.role,
        phoneNumber: formData.phoneNumber, // Send phoneNumber (optional)
        department: formData.department, // Send department (optional)
        // Note: 'company' (name) is not sent as backend expects 'companyId' (ID)
        // Note: 'avatarUrl', 'bio', 'skills', 'certifications', 'languages' are optional backend fields not in this form
    };


    try {
        // Send POST request to backend signup endpoint
        const response = await fetch('http://localhost:3000/api/auth/signup', { // <--- Backend URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend), // Send prepared data
        });

        const data = await response.json(); // Parse the JSON response

        if (response.ok) {
            // Signup successful
            console.log('Inscription réussie:', data);
            toast({
                title: "Succès",
                description: data.message || "Inscription réussie. Vous pouvez maintenant vous connecter.",
            });

            // Redirect to the signin page after successful registration
            navigate('/signin');

        } else {
            // Signup failed
            console.error('Inscription échouée:', data);
            toast({
                title: "Erreur d'inscription",
                description: data.message || "Une erreur est survenue lors de l'inscription.",
                variant: "destructive",
            });
        }

    } catch (error: any) {
        // Handle network errors
        console.error('Erreur lors de l\'envoi de la requête d\'inscription:', error);
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
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 royal-gradient rounded-full flex items-center justify-center">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-royal-900">Inscription</CardTitle>
          <p className="text-muted-foreground">Créez votre compte ProjectFlow</p>
        </CardHeader>
        <CardContent>
          {/* Changed form to call handleSignUp onSubmit */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  placeholder="Votre prénom"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required // HTML validation
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  placeholder="Votre nom"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required // HTML validation
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="pl-10"
                  required // HTML validation
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone" // HTML ID remains 'phone'
                    type="tel"
                    placeholder="+33 1 23 45 67 89"
                    value={formData.phoneNumber} // Value is bound to 'phoneNumber' state
                    onChange={(e) => handleChange('phoneNumber', e.target.value)} // Update 'phoneNumber' state
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Entreprise</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company"
                    placeholder="Nom de l'entreprise"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Input
                id="department"
                placeholder="IT, Marketing, Finance..."
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rôle demandé</Label>
              {/* Select for role - ensure values match backend valid roles */}
              <Select value={formData.role} onValueChange={(value) => handleChange('role', value)} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur (DSI)</SelectItem>
                  <SelectItem value="supervisor">Superviseur</SelectItem>
                  {/* Changed 'member' to 'team_member' to match backend 'validRoles' array */}
                  <SelectItem value="team_member">Membre d'équipe</SelectItem>
                   {/* Add 'client_contact' if applicable in backend */}
                  <SelectItem value="client_contact">Contact Client</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="pl-10"
                    required // HTML validation
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="pl-10"
                    required // HTML validation
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Submit button - disabled while loading */}
            <Button type="submit" className="w-full royal-gradient text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Inscription en cours...
                </>
              ) : (
                'S\'inscrire'
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Déjà un compte? </span>
              <Link to="/signin" className="text-royal-600 hover:underline">
                Se connecter
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}