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
    .max(50, 'Maximo 50 caracteres')
    .optional()
    .default(''),
  soilType: z
    .string()
    .max(50, 'Maximo 50 caracteres')
    .optional()
    .default(''),
  pruningSeason: z
    .string()
    .max(50, 'Maximo 50 caracteres')
    .optional()
    .default(''),
  currentHeightCm: z
    .string()
    .regex(/^\d*\.?\d*$/, 'Debe ser un numero')
    .optional()
    .default('')
    .transform((v) => (v === '' ? undefined : Number(v)))
    .pipe(z.number().min(0, 'Debe ser positivo').optional()),
  potSizeCm: z
    .string()
    .regex(/^\d*\.?\d*$/, 'Debe ser un numero')
    .optional()
    .default('')
    .transform((v) => (v === '' ? undefined : Number(v)))
    .pipe(z.number().min(0, 'Debe ser positivo').optional()),
});

export type PlantEditFormData = z.infer<typeof plantEditSchema>;

/** Input type before transforms (all strings for TextInput). */
export type PlantEditFormInput = z.input<typeof plantEditSchema>;
