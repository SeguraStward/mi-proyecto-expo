import { z } from 'zod';

export const plantEditSchema = z.object({
  nickname: z
    .string()
    .min(1, 'Nombre requerido')
    .max(40, 'Maximo 40 caracteres'),
  wateringFrequencyDays: z
    .string()
    .regex(/^\d+$/, 'Debe ser un numero')
    .transform(Number)
    .pipe(z.number().int().min(1, 'Minimo 1 dia').max(365, 'Maximo 365 dias')),
  sunlight: z
    .string()
    .min(1, 'Campo requerido'),
  humidity: z
    .string()
    .max(50)
    .optional()
    .default(''),
  soilType: z
    .string()
    .max(50)
    .optional()
    .default(''),
  pruningSeason: z
    .string()
    .max(50)
    .optional()
    .default(''),
  currentHeightCm: z
    .string()
    .regex(/^\d*\.?\d*$/, 'Debe ser un numero')
    .optional()
    .default('')
    .transform((v) => (v === '' ? undefined : Number(v)))
    .pipe(z.number().min(0).optional()),
  potSizeCm: z
    .string()
    .regex(/^\d*\.?\d*$/, 'Debe ser un numero')
    .optional()
    .default('')
    .transform((v) => (v === '' ? undefined : Number(v)))
    .pipe(z.number().min(0).optional()),
});

export type PlantEditFormData = z.infer<typeof plantEditSchema>;
export type PlantEditFormInput = z.input<typeof plantEditSchema>;

export const plantCreateSchema = z.object({
  nickname: z
    .string()
    .min(1, 'Nombre requerido')
    .max(40, 'Maximo 40 caracteres'),
  commonName: z
    .string()
    .min(1, 'Nombre comun requerido')
    .max(60),
  scientificName: z
    .string()
    .max(80)
    .optional()
    .default(''),
  wateringFrequencyDays: z
    .string()
    .regex(/^\d+$/, 'Debe ser un numero')
    .transform(Number)
    .pipe(z.number().int().min(1).max(365)),
  sunlight: z
    .string()
    .min(1, 'Campo requerido'),
  humidity: z
    .string()
    .max(50)
    .optional()
    .default(''),
  soilType: z
    .string()
    .max(50)
    .optional()
    .default(''),
});

export type PlantCreateFormData = z.infer<typeof plantCreateSchema>;
export type PlantCreateFormInput = z.input<typeof plantCreateSchema>;
