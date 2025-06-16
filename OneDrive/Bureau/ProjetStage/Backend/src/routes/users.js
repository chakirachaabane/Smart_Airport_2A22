import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorize } from '../middleware/authMiddleware.js';
import bcrypt from 'bcrypt';

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", authenticateToken, authorize(['admin', 'supervisor', 'team_member', 'client_contact']), async (req, res) => {
  try {
    const roleQueryParam = req.query.role;
    let where = {};

    if (roleQueryParam && typeof roleQueryParam === 'string') {
        const rolesArray = roleQueryParam.split(',').map(role => role.trim()).filter(role => role);
        if (rolesArray.length > 0) {
            where = {
                role: {
                    in: rolesArray
                }
            };
        }
    } else if (roleQueryParam && Array.isArray(roleQueryParam)) { // Handle case if Express parses it as an array
         const rolesArray = roleQueryParam.map(String).map(role => role.trim()).filter(role => role);
         if (rolesArray.length > 0) {
             where = {
                 role: {
                     in: rolesArray
                 }
             };
         }
    }


    const users = await prisma.user.findMany({
        where: where,
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            phoneNumber: true,
            position: true,
            department: true,
            companyId: true,
            joinDate: true,
            avatarUrl: true,
            address: true,
            bio: true,
            skills: true,
            certifications: true,
            languages: true,
        },
    });

    const usersFormattedForFrontend = users.map(user => ({
       ...user,
       skills: (user.skills && typeof user.skills === 'string' && user.skills.length > 0) ? user.skills.split(',').map(s => s.trim()).filter(s => s) : (Array.isArray(user.skills) ? user.skills : []),
       certifications: (user.certifications && typeof user.certifications === 'string' && user.certifications.length > 0) ? user.certifications.split(',').map(s => s.trim()).filter(s => s) : (Array.isArray(user.certifications) ? user.certifications : []),
       languages: (user.languages && typeof user.languages === 'string' && user.languages.length > 0) ? user.languages.split(',').map(s => s.trim()).filter(s => s) : (Array.isArray(user.languages) ? user.languages : []),
       name: `${user.firstName} ${user.lastName}`
    }));


    res.status(200).json(usersFormattedForFrontend);

  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});


router.post("/", authenticateToken, authorize(['admin', 'supervisor']), async (req, res) => {
    const SALT_ROUNDS = 10;

    const { firstName, lastName, email, password, role, phoneNumber, position, department, companyId, avatarUrl, address, bio, skills, certifications, languages } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      console.log('❌ Create user validation failed: Missing required fields.');
      res.status(400).json({ message: 'Missing required fields: firstName, lastName, email, password, role.' });
      return;
    }

    const validRoles = ['admin', 'supervisor', 'team_member', 'client_contact'];
     if (!validRoles.includes(role)) {
         console.log('❌ Create user validation failed: Invalid role specified:', role);
         res.status(400).json({ message: `Invalid role. Allowed roles are: ${validRoles.join(', ')}.` });
         return;
     }


    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
         console.log('❌ Create user failed: Email already in use:', email);
        res.status(409).json({ message: 'Email already in use.' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      const newUser = await prisma.user.create({
        data: {
          firstName, lastName, email, passwordHash, role,
          phoneNumber: phoneNumber || undefined,
          position: position || undefined,
          department: department || undefined,
          companyId: companyId || undefined,
          avatarUrl: avatarUrl || undefined,
          address: address || undefined,
          bio: bio || undefined,
          skills: skills || undefined,
          certifications: certifications || undefined,
          languages: languages || undefined,
        },
        select: {
            id: true, firstName: true, lastName: true, email: true, role: true, phoneNumber: true,
            position: true, department: true, companyId: true, joinDate: true, avatarUrl: true, bio: true,
            skills: true, certifications: true, languages: true,
        },
      });

      console.log(`✅ User created by admin: ${newUser.email} (${newUser.role}). ID: ${newUser.id}`);
      res.status(201).json({ message: 'User created successfully.', user: newUser });

    } catch (error) {
      console.error('❌ Error creating user by admin:', error);
      res.status(500).json({ message: 'Internal server error during user creation.', error: error.message });
    }
});
router.put("/:id", authenticateToken, authorize(['admin', 'supervisor', 'team_member', 'client_contact']), async (req, res) => {
    const { id } = req.params; // ID de l'utilisateur à modifier
    const userIdMakingRequest = req.user.id; // ID de l'utilisateur connecté
    const userRoleMakingRequest = req.user.role; // Rôle de l'utilisateur connecté

    const { firstName, lastName, email, phoneNumber, position, department, companyId, avatarUrl, address, bio, skills, certifications, languages, password } = req.body;

    if (userIdMakingRequest !== id && !['admin', 'supervisor'].includes(userRoleMakingRequest)) {
        console.log(`❌ Authorization failed: User ${userIdMakingRequest} (${userRoleMakingRequest}) attempted to update user ${id}.`);
        return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce profil." });
    }

    try {
      const userToUpdate = await prisma.user.findUnique({ where: { id: id } });
      if (!userToUpdate) {
        console.log(`❌ Update user failed: User ${id} not found.`);
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }

      const updateData = {
          firstName: firstName || undefined, // Send undefined if not provided, Prisma will ignore it
          lastName: lastName || undefined,
          email: email || undefined,
          phoneNumber: phoneNumber || undefined, // Use undefined instead of null for Prisma update
          position: position || undefined,
          department: department || undefined,
          companyId: companyId || undefined,
          avatarUrl: avatarUrl || undefined,
          address: address || undefined,
          bio: bio || undefined,
          skills: skills || undefined,
          certifications: certifications || undefined,
          languages: languages || undefined,
          // role: (currentUserRole === 'admin' && req.body.role) ? req.body.role : undefined, // Example for role update by admin
      };

       if (password) {
           const SALT_ROUNDS = 10;
           updateData.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
       }

      const updatedUser = await prisma.user.update({
        where: { id: id },
        data: updateData,
        select: {
            id: true, firstName: true, lastName: true, email: true, role: true, phoneNumber: true,
            position: true, department: true, companyId: true, joinDate: true, avatarUrl: true, bio: true,
            address: true, skills: true, certifications: true, languages: true,
        },
      });

      console.log(`✅ User updated successfully: ID ${updatedUser.id} by User ID ${userIdMakingRequest}`);
      res.status(200).json({ message: 'Profil mis à jour avec succès.', user: updatedUser });

    } catch (error) {
      console.error('❌ Error updating user:', error);
       if (error.code === 'P2002') {
          return res.status(409).json({ message: 'Cet email est déjà utilisé par un autre utilisateur.', error: error.message });
       }
      res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du profil.', error: error.message });
    }
});



router.delete("/:id", authenticateToken, authorize(['admin']), async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({ where: { id: id } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.id === req.user.id) {
             return res.status(400).json({ message: "Cannot delete your own user account via this endpoint" });
        }

        await prisma.user.delete({ where: { id: id } });

        console.log(`✅ User deleted: ID ${id} by User ID ${req.user.id} (${req.user.role})`);
        res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        console.error("❌ Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
});


export default router;