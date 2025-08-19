import mysql from "mysql2/promise";
import { env } from "../config/env.js";

export const db = mysql.createConnection({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});
