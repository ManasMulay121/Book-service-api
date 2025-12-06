import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../common/database.connection';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { loginQueries } from '../../common/database.queries';
import {
  APIResponse,
  LoginRequest,
  User,
  LoginResponseData,
} from '../../common/api.types';

const envPath = path.resolve(__dirname, '../../../../.env');
dotenv.config({ path: envPath });

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body as LoginRequest;

    // Validate input
    if (!username || !password) {
      const response: APIResponse<null> = {
        status: 'error',
        data: null,
        error: 'Username and password are required',
      };
      res.status(400).json(response);
      return;
    }

    // Query database for user
    const result = await pool.query(loginQueries.USERQUERY, [username]);

    // Check if user exists
    if (result.rows.length === 0) {
      const response: APIResponse<null> = {
        status: 'error',
        data: null,
        error: 'Invalid credentials',
      };
      res.status(401).json(response);
      return;
    }

    const user = result.rows[0] as User;

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash || ''
    );

    if (!isPasswordValid) {
      const response: APIResponse<null> = {
        status: 'error',
        data: null,
        error: 'Invalid credentials',
      };
      res.status(401).json(response);
      return;
    }

    // Generate JWT token
    const jwtSecret = process.env.ACCESS_TOKEN_SECRET as string;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '5h';

    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment variables');
      const response: APIResponse<null> = {
        status: 'error',
        data: null,
        error: 'Server configuration error',
      };
      res.status(500).json(response);
      return;
    }

    const token = jwt.sign(
      {
        username: user.username,
      },
      jwtSecret,
      { expiresIn: jwtExpiresIn } as jwt.SignOptions
    );

    // Return success response
    const successResponse: APIResponse<LoginResponseData> = {
      status: 'success',
      data: {
        token,
        user: {
          username: user.username,
        },
      },
      error: null,
    };
    res.status(200).json(successResponse);
  } catch (error) {
    console.error('Login error:', error);
    const errorResponse: APIResponse<null> = {
      status: 'error',
      data: null,
      error: 'Internal server error',
    };
    res.status(500).json(errorResponse);
  }
};
