import { Router } from 'express';
import db from '../db.js';
import {
  includeQuerySchema,
  searchTextSchema,
  slugSchema,
  paisSchema,
} from '../schemas/validaciones.js';
import { enviarError, manejarErroresZod } from '../middleware/errores.js';

const router = Router();

function resumirMundial(mundial) {
  return {
    nombre: mundial.nombre,
    anio: mundial.anio,
    slug: mundial.slug,
    campeon: mundial.campeon,
    imagen: mundial.imagen,
  };
}

function formatearMundial(mundial, completo = false) {
  const base = {
    nombre: mundial.nombre,
    anio: mundial.anio,
    sede: mundial.sede,
    campeon: mundial.campeon,
    subcampeon: mundial.subcampeon,
    goleador: mundial.goleador,
    equipos: mundial.equipos,
    imagen: mundial.imagen,
    slug: mundial.slug,
  };

  if (completo) {
    return {
      ...base,
      resumen: mundial.resumen,
      descripcion: mundial.descripcion,
    };
  }

  return resumirMundial(mundial);
}

router.get('/mundiales', (req, res) => {
  const validacion = includeQuerySchema.safeParse(req.query);

  if (!validacion.success) {
    return manejarErroresZod(res, validacion);
  }

  const completo = validacion.data.include === 'full';
  const filas = db
    .prepare('SELECT * FROM mundiales ORDER BY anio DESC')
    .all();

  res.json(filas.map((mundial) => formatearMundial(mundial, completo)));
});

router.get('/mundial/:slug', (req, res) => {
  const validacion = slugSchema.safeParse(req.params.slug);

  if (!validacion.success) {
    return manejarErroresZod(res, validacion);
  }

  const mundial = db
    .prepare('SELECT * FROM mundiales WHERE slug = ?')
    .get(validacion.data);

  if (!mundial) {
    return enviarError(res, 404, 'Mundial no encontrado');
  }

  res.json(formatearMundial(mundial, true));
});

router.get('/campeon/:pais', (req, res) => {
  const validacion = paisSchema.safeParse(req.params.pais);

  if (!validacion.success) {
    return manejarErroresZod(res, validacion);
  }

  const filas = db
    .prepare(
      `SELECT slug FROM mundiales
       WHERE campeon LIKE ? COLLATE NOCASE
       ORDER BY anio DESC`
    )
    .all(validacion.data);

  res.json(filas.map((fila) => fila.slug));
});

router.get('/random', (_req, res) => {
  const mundial = db
    .prepare('SELECT * FROM mundiales ORDER BY RANDOM() LIMIT 1')
    .get();

  res.json(formatearMundial(mundial, true));
});

router.get('/search/:text', (req, res) => {
  const validacion = searchTextSchema.safeParse(req.params.text);

  if (!validacion.success) {
    return manejarErroresZod(res, validacion);
  }

  const termino = `%${validacion.data}%`;
  const filas = db
    .prepare(
      `SELECT * FROM mundiales
       WHERE nombre LIKE ? COLLATE NOCASE
          OR sede LIKE ? COLLATE NOCASE
          OR campeon LIKE ? COLLATE NOCASE
          OR subcampeon LIKE ? COLLATE NOCASE
          OR goleador LIKE ? COLLATE NOCASE
          OR resumen LIKE ? COLLATE NOCASE
          OR descripcion LIKE ? COLLATE NOCASE
       ORDER BY anio DESC`
    )
    .all(termino, termino, termino, termino, termino, termino, termino);

  res.json(filas.map((mundial) => formatearMundial(mundial, true)));
});

export default router;
