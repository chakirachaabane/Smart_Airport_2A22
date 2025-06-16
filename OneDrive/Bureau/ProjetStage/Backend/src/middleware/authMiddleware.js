

import jwt from 'jsonwebtoken';


export const authenticateToken = (req, res, next) => { 
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); 
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => { 
    if (err) {
      return res.sendStatus(403); 
    }

    req.user = userPayload; 

    next();
  });
};

export const authorize = (allowedRoles) => { // Retire ': string[]'
    return (req, res, next) => {
        if (!req.user) {
             console.error("❌ Authorization check failed: req.user is undefined. Is authenticateToken missing?");
            return res.sendStatus(500);
        }

        if (allowedRoles.includes(req.user.role)) {
            next();
        } else {
            return res.sendStatus(403);
        }
    };
};