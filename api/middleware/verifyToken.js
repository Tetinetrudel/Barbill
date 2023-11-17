import jwt from 'jsonwebtoken';
import { errorHandler } from './errorHandler.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization

  if (!authHeader?.startsWith('Bearer ')) {
      return next(errorHandler(401, `Vous n'êtes pas autorisé`))
  }

  const token = authHeader.split(' ')[1]

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, 'Accès interdit'));

    req.user = user;
    next();
  });
}