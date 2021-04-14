import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'; // We want to decode our JWT

interface UserPayload {
  id: string;
  email: string
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

// We want to figure out if a user is logged in and if he's
// than extract out of that payload and set it on req.currentUser 
export const currentUser = (
  req: Request,
  res: Response, 
  next:NextFunction) => {
                              
    if (!req.session?.jwt) {// checking if there's no session or if there's no jwt prop
      return next();
    } 

    try {
      const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
      req.currentUser = payload;
    }
    catch (err) {}

    next();
};


