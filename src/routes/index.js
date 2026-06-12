import fs from 'node:fs';
import { Router } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const destino = path.join(__dirname, '..', '..', 'public', 'imagenes');

router.get('/', (_req, res) => {
  res.json({
    nombre: 'API Copa Mundial FIFA',
    version: '1.0.0',
    descripcion:
      'API REST con informacion sobre ediciones del Mundial de la FIFA',
    rutas: {
      inicio: 'GET /',
      listar: 'GET /mundiales',
      listarCompleto: 'GET /mundiales?include=full',
      detalle: 'GET /mundial/:slug',
      campeon: 'GET /campeon/:pais',
      aleatorio: 'GET /random',
      buscar: 'GET /search/:text',
      imagenes: 'GET /imagenes/*',
    },
    codigos: {
      200: 'OK - La peticion fue exitosa y se devuelven datos',
      400: 'Bad Request - La validacion de entrada (zod) fallo',
      404: 'Not Found - No existe el recurso solicitado o la ruta no esta definida',
    },
  });
});

router.get('/imagenes/*', (req, res) => {
  const archivo = String(req.params[0]).trim();
  const rutaImagen = path.join(destino, archivo);
  const rutaRelativa = path.relative(destino, rutaImagen);
  const extension = path.extname(rutaImagen).toLowerCase();
  const extensionesPermitidas = new Set(['.jpg', '.jpeg', '.png', '.avif', '.webp', '.gif']);

  if (
    !archivo ||
    rutaRelativa.startsWith('..') ||
    path.isAbsolute(rutaRelativa) ||
    !extensionesPermitidas.has(extension)
  ) {
    return res.status(404).json({ error: 'Imagen no encontrada' });
  }

  if (!fs.existsSync(rutaImagen)) {
    return res.status(404).json({ error: 'Imagen no encontrada' });
  }

  res.sendFile(rutaImagen, (error) => {
    if (error && !res.headersSent) {
      res.status(404).json({ error: 'Imagen no encontrada' });
    }
  });
});

export default router;
