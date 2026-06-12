import { z } from 'zod';

export const mundialSchema = z.object({
  nombre: z.string().min(1),
  anio: z.number().int().positive(),
  sede: z.string().min(1),
  campeon: z.string().min(1),
  subcampeon: z.string().min(1),
  goleador: z.string().min(1),
  equipos: z.number().int().positive(),
  imagen: z.string().min(1),
  slug: z.string().min(1),
  resumen: z.string().min(1),
  descripcion: z.string().min(1),
});

export const includeQuerySchema = z.object({
  include: z.enum(['full']).optional(),
});

export const searchTextSchema = z
  .string()
  .min(3, 'El texto de busqueda debe tener al menos 3 caracteres');

export const slugSchema = z.string().min(1);

export const paisSchema = z.string().min(1);
