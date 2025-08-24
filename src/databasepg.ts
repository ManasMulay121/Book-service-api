import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: parseInt(process.env.DB_PORT as string, 10),
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
export default pool;
