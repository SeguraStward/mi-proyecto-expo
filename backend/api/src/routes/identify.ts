import { Request, Response, Router } from 'express';

import { identifyPlantWithGemini } from '../services/geminiClient';
import { identifyPlantWithPlantId } from '../services/plantIdClient';

const router = Router();

interface IdentifyBody {
  imageBase64?: string;
}

type Provider = 'plantid' | 'gemini';

function mapErrorStatus(message: string): number {
  if (message.startsWith('Imagen invalida')) return 400;

  const upstreamStatus =
    message.match(/Plant\.id error (\d{3})/)?.[1] ??
    message.match(/Gemini error (\d{3})/)?.[1];

  if (upstreamStatus) {
    const status = Number(upstreamStatus);
    return status >= 500 ? 502 : status;
  }

  return 502;
}

async function identifyWithProvider(
  provider: Provider,
  imageBase64: string,
  plantIdApiKey?: string,
  geminiApiKey?: string
) {
  if (provider === 'plantid') {
    if (!plantIdApiKey) throw new Error('PLANT_ID_API_KEY no esta configurada');
    return identifyPlantWithPlantId(imageBase64, plantIdApiKey);
  }

  if (!geminiApiKey) throw new Error('GEMINI_API_KEY no esta configurada');
  return identifyPlantWithGemini(imageBase64, geminiApiKey);
}

router.post('/', async (req: Request<unknown, unknown, IdentifyBody>, res: Response) => {
  const { imageBase64 } = req.body ?? {};

  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return res.status(400).json({ error: 'imageBase64 es requerido' });
  }

  const plantIdApiKey = process.env.PLANT_ID_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const preferredProvider = (process.env.AI_PROVIDER ?? 'plantid').toLowerCase() as Provider;

  const hasAnyProvider = Boolean(plantIdApiKey || geminiApiKey);
  if (!hasAnyProvider) {
    return res.status(500).json({
      error: 'No hay proveedor IA configurado (PLANT_ID_API_KEY o GEMINI_API_KEY)',
    });
  }

  const providerOrder: Provider[] =
    preferredProvider === 'gemini'
      ? ['gemini', 'plantid']
      : ['plantid', 'gemini'];

  const attempted: string[] = [];

  try {
    for (const provider of providerOrder) {
      try {
        const result = await identifyWithProvider(
          provider,
          imageBase64,
          plantIdApiKey,
          geminiApiKey
        );
        return res.json(result);
      } catch (providerErr) {
        const providerMessage =
          providerErr instanceof Error ? providerErr.message : 'Error desconocido';
        attempted.push(`${provider}: ${providerMessage}`);

        if (providerMessage.startsWith('Imagen invalida')) {
          return res.status(400).json({ error: providerMessage });
        }
      }
    }

    const finalMessage =
      attempted.length > 0
        ? `Fallaron proveedores IA: ${attempted.join(' | ')}`
        : 'Error desconocido en proveedores IA';

    const status = mapErrorStatus(finalMessage);
    console.error('[identify] error:', finalMessage);
    return res.status(status).json({ error: finalMessage });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error('[identify] error:', message);
    return res.status(mapErrorStatus(message)).json({ error: message });
  }
});

export default router;
