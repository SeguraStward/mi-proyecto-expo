import { Request, Response, Router } from 'express';

import { identifyPlantWithPlantId } from '../services/plantIdClient';

const router = Router();

interface IdentifyBody {
  imageBase64?: string;
}

router.post('/', async (req: Request<unknown, unknown, IdentifyBody>, res: Response) => {
  const { imageBase64 } = req.body ?? {};

  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return res.status(400).json({ error: 'imageBase64 es requerido' });
  }

  const apiKey = process.env.PLANT_ID_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'PLANT_ID_API_KEY no esta configurada' });
  }

  try {
    const result = await identifyPlantWithPlantId(imageBase64, apiKey);
    return res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error('[identify] error:', message);

    if (message.startsWith('Imagen invalida')) {
      return res.status(400).json({ error: message });
    }

    const upstreamStatus = message.match(/Plant\.id error (\d{3})/)?.[1];
    if (upstreamStatus) {
      const status = Number(upstreamStatus);
      const mappedStatus = status >= 500 ? 502 : status;
      return res.status(mappedStatus).json({ error: message });
    }

    return res.status(502).json({ error: message });
  }
});

export default router;
