import { Pool} from "pg";
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const pool = new Pool({
    connectionString : process.env.DATABASE_URL,
    host:process.env.DB_HOST,
    user : process.env.POSTGRES_USER,
    port : parseInt(process.env.DB_PORT as string, 10),
    password : process.env.POSTGRES_PASSWORD,
    database : process.env.POSTGRES_DB
})
export default pool;