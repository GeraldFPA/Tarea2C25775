import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'datos', 'mundiales.db');

const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS mundiales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    anio INTEGER NOT NULL UNIQUE,
    sede TEXT NOT NULL,
    campeon TEXT NOT NULL,
    subcampeon TEXT NOT NULL,
    goleador TEXT NOT NULL,
    equipos INTEGER NOT NULL,
    imagen TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    resumen TEXT NOT NULL,
    descripcion TEXT NOT NULL
  )
`);

export default db;
