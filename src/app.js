import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import indexRouter from './routes/index.js';
import mundialesRouter from './routes/mundiales.js';
import { rutaNoEncontrada } from './middleware/errores.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());

app.use(indexRouter);
app.use(mundialesRouter);

app.use(rutaNoEncontrada);

export default app;
