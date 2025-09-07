import 'dotenv/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Use SQLite for local development
const sqlite = new Database('marketplace.db');

// Pass schema to drizzle for relation queries
export const db = drizzle(sqlite, { schema });
