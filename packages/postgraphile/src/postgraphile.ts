import { postgraphile } from 'postgraphile';
import dotenv from 'dotenv';
import path from 'path';
import options from './graphile.config.js';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
const DATABASE_URL = `postgres://admin:admin@localhost:5433/appdb`;
export const pgl = postgraphile(DATABASE_URL, 'public', options);
