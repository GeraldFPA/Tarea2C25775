import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import db from '../src/db.js';
import { mundialSchema } from '../src/schemas/validaciones.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const datosPath = path.join(__dirname, '..', 'datos', 'mundiales.json');
const mundiales = JSON.parse(fs.readFileSync(datosPath, 'utf-8'));

const insertar = db.prepare(`
  INSERT INTO mundiales (
    nombre, anio, sede, campeon, subcampeon, goleador,
    equipos, imagen, slug, resumen, descripcion
  ) VALUES (
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?
  )
`);

db.exec('DELETE FROM mundiales');

db.exec('BEGIN IMMEDIATE');

try {
  for (const registro of mundiales) {
    const validacion = mundialSchema.safeParse(registro);

    if (!validacion.success) {
      throw new Error(`Datos invalidos para ${registro.slug ?? registro.nombre}`);
    }

    const d = validacion.data;
    insertar.run(
      d.nombre,
      d.anio,
      d.sede,
      d.campeon,
      d.subcampeon,
      d.goleador,
      d.equipos,
      d.imagen,
      d.slug,
      d.resumen,
      d.descripcion
    );
  }

  db.exec('COMMIT');
} catch (error) {
  db.exec('ROLLBACK');
  throw error;
}

console.log(`Base de datos poblada con ${mundiales.length} ediciones del Mundial.`);
