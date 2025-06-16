
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prismaClient.js'; 
import 'dotenv/config';

const SALT_ROUNDS = 10;

// --- Logique d'Inscription (Sign Up) ---

export const signup = async (req, res) => {
   const { firstName, lastName, email, password, role, phoneNumber, position, department, companyId, avatarUrl, bio, skills, certifications, languages } = req.body;

   if (!firstName || !lastName || !email || !password || !role) {
     console.log('❌ Signup validation failed: Missing required fields.');
     res.status(400).json({ message: 'Missing required fields: firstName, lastName, email, password, role.' });
     return;
   }

   const validRoles = ['admin', 'supervisor', 'team_member', 'client_contact'];
    if (!validRoles.includes(role)) {
        console.log('❌ Signup validation failed: Invalid role specified:', role);
        res.status(400).json({ message: `Invalid role. Allowed roles are: ${validRoles.join(', ')}.` });
        return;
    }

   try {
     const existingUser = await prisma.user.findUnique({
       where: { email },
     });

     if (existingUser) {
        console.log('❌ Signup failed: Email already in use:', email);
       res.status(409).json({ message: 'Email already in use.' });
       return;
     }

     const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

     const newUser = await prisma.user.create({
       data: {
         firstName,
         lastName,
         email,
         passwordHash,
         role,
         phoneNumber,
         position,
         department,
         companyId,
         avatarUrl,
         bio,
         skills: skills, // OK si schéma String[], ou convertissez si String?
         certifications: certifications, // OK si schéma String[], ou convertissez si String?
         languages: languages , // OK si schéma String[], ou convertissez si String?
       },
       select: { // Gardez les champs à retourner
         id: true, firstName: true, lastName: true, email: true, role: true, phoneNumber: true,
         position: true, department: true, companyId: true, joinDate: true, avatarUrl: true, bio: true,
         skills: true, certifications: true, languages: true, // Le type réel sera celui de la BD (JSON ou String)
       },
     });

     console.log(`✅ User created successfully: ${newUser.email} (${newUser.role}). ID: ${newUser.id}`);
     res.status(201).json({ message: 'User created successfully.', user: newUser });

   } catch (error) { // En JS pur, le type 'any' n'est pas nécessaire ici
     console.error('❌ Signup error:', error);
     res.status(500).json({ message: 'Internal server error during signup.', error: error.message });
   }
};

// --- Logique de Connexion (Sign In) ---
export const signin = async (req, res) => {
   const { email, password, role } = req.body;

   if (!email || !password) {
     console.log('❌ Signin validation failed: Email and password are required.');
     res.status(400).json({ message: 'Email and password are required.' });
     return;
   }

   try {
     const user = await prisma.user.findUnique({
       where: { email },
     });

     if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
       console.log(`❌ Signin failed for email "${email}": Invalid credentials.`);
       res.status(401).json({ message: 'Invalid credentials.' });
       return;
     }

  

     const token = jwt.sign(
       { id: user.id, role: user.role },
       process.env.JWT_SECRET, // Pas besoin de 'as string' en JS
       { expiresIn: '1d' }
     );

     console.log(`✅ Signin successful for user: ${user.email} (${user.role}). ID: ${user.id}. Token generated.`);

     res.status(200).json({
       message: 'Login successful.',
       token,
       user: { // Informations basiques
         id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role,
         avatarUrl: user.avatarUrl, companyId: user.companyId, phoneNumber: user.phoneNumber, position: user.position,
         department: user.department, joinDate: user.joinDate, bio: user.bio, skills: user.skills,
         certifications: user.certifications, languages: user.languages,
       },
     });


   } catch (error) { // En JS pur, le type 'any' n'est pas nécessaire
     console.error('❌ Signin error:', error);
     res.status(500).json({ message: 'Internal server error during signin.', error: error.message });
   }
};
