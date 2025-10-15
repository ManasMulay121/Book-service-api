import { NextFunction, Request, Response } from 'express';

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const VALID_API_KEY = process.env.API_KEY;
    const token = req.headers['x-api-key'];
    console.log('Auth middleware - API key received:', token);
    console.log('Auth middleware - Expected API key:', VALID_API_KEY);
    if (!token) {
      console.log('Auth middleware - No API key provided');
      res.status(401).json({
        status: 'error',
        data: null,
        error: 'Please provide api key',
      });
      return;
    }
    if (token != VALID_API_KEY) {
      console.log('Auth middleware - Invalid API key');
      res.status(403).json({
        status: 'error',
        data: null,
        error: 'Invalid api key',
      });
      return;
    }
    console.log('Auth middleware - API key validated successfully');
    next();
  } catch (error) {
    console.log('Middleware auth error : ', error);
    res.status(500).json({
      status: 'error',
      data: null,
      error: 'Internal Server error',
    });
  }
};
