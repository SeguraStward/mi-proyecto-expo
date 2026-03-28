import { z } from 'zod';

export const userProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Minimo 2 caracteres')
    .max(30, 'Maximo 30 caracteres'),
  bio: z
    .string()
    .max(200, 'Maximo 200 caracteres')
    .optional()
    .default(''),
  instagram: z
    .string()
    .regex(/^[a-zA-Z0-9._]*$/, 'Usuario de Instagram invalido')
    .max(30, 'Maximo 30 caracteres')
    .optional()
    .default(''),
  whatsapp: z
    .string()
    .regex(/^\+?[0-9]*$/, 'Numero invalido')
    .max(20, 'Maximo 20 caracteres')
    .optional()
    .default(''),
  country: z
    .string()
    .max(50, 'Maximo 50 caracteres')
    .optional()
    .default(''),
  province: z
    .string()
    .max(50, 'Maximo 50 caracteres')
    .optional()
    .default(''),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
