import * as path from 'path';
import * as dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { APIResponse } from '../../common/api.types';

const envPath = path.resolve(__dirname, '../../../../.env');
dotenv.config({ path: envPath });

export interface AuthRequest extends Request {
  user?: {
    username: string;
  };
}

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      const response: APIResponse<null> = {
        status: 'error',
        data: null,
        error: 'Access token required',
      };
      res.status(401).json(response);
      return;
    }

    const jwtSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!jwtSecret) {
      const response: APIResponse<null> = {
        status: 'error',
        data: null,
        error: 'Server configuration error',
      };
      res.status(500).json(response);
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as { username: string };
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT auth middleware error:', error);
    const response: APIResponse<null> = {
      status: 'error',
      data: null,
      error: 'Invalid or expired token',
    };
    res.status(403).json(response);
  }
};
