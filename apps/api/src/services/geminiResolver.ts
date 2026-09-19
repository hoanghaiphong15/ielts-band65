const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.6-pro',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-pro',
];

let cachedResolution: {
  key: string;
  model: string;
  apiVersion: string;
  timestamp: number;
} | null = null;

/**
 * Dynamically resolves the best active Gemini model and API version for the provided API key.
 * Defaults to gemini-3.6-flash on stable v1 endpoint.
 */
export async function resolveGeminiEndpoint(apiKey: string): Promise<{
  url: string;
  model: string;
  apiVersion: string;
}> {
  const cleanKey = apiKey.trim();
  const now = Date.now();

  // Return cached resolution if valid for 1 hour
  if (
    cachedResolution &&
    cachedResolution.key === cleanKey &&
    now - cachedResolution.timestamp < 3600000
  ) {
    return {
      url: `https://generativelanguage.googleapis.com/${cachedResolution.apiVersion}/models/${cachedResolution.model}:generateContent?key=${cleanKey}`,
      model: cachedResolution.model,
      apiVersion: cachedResolution.apiVersion,
    };
  }

  // Query Google API for active models supported by this key
  for (const version of ['v1', 'v1beta']) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/${version}/models?key=${cleanKey}`
      );
      if (res.ok) {
        const data: any = await res.json();
        const models: Array<{ name: string; supportedGenerationMethods?: string[] }> =
          data?.models || [];
        const supported = models.filter((m) =>
          m.supportedGenerationMethods?.includes('generateContent')
        );

        // 1. Match against preferred candidates (gemini-3.6-flash prioritized)
        for (const candidate of CANDIDATE_MODELS) {
          const match = supported.find(
            (m) => m.name === `models/${candidate}` || m.name.endsWith(candidate)
          );
          if (match) {
            cachedResolution = {
              key: cleanKey,
              model: candidate,
              apiVersion: version,
              timestamp: now,
            };
            return {
              url: `https://generativelanguage.googleapis.com/${version}/models/${candidate}:generateContent?key=${cleanKey}`,
              model: candidate,
              apiVersion: version,
            };
          }
        }

        // 2. Find any 3.6 or flash model
        const v36Model = supported.find((m) => m.name.includes('3.6'));
        if (v36Model) {
          const name = v36Model.name.replace(/^models\//, '');
          cachedResolution = {
            key: cleanKey,
            model: name,
            apiVersion: version,
            timestamp: now,
          };
          return {
            url: `https://generativelanguage.googleapis.com/${version}/models/${name}:generateContent?key=${cleanKey}`,
            model: name,
            apiVersion: version,
          };
        }

        const flashModel = supported.find((m) => m.name.includes('flash'));
        if (flashModel) {
          const name = flashModel.name.replace(/^models\//, '');
          cachedResolution = {
            key: cleanKey,
            model: name,
            apiVersion: version,
            timestamp: now,
          };
          return {
            url: `https://generativelanguage.googleapis.com/${version}/models/${name}:generateContent?key=${cleanKey}`,
            model: name,
            apiVersion: version,
          };
        }

        // 3. Fallback to any supported generation model
        if (supported.length > 0) {
          const name = supported[0].name.replace(/^models\//, '');
          cachedResolution = {
            key: cleanKey,
            model: name,
            apiVersion: version,
            timestamp: now,
          };
          return {
            url: `https://generativelanguage.googleapis.com/${version}/models/${name}:generateContent?key=${cleanKey}`,
            model: name,
            apiVersion: version,
          };
        }
      }
    } catch {
      // Continue to next version check
    }
  }

  // Default fallback: gemini-3.6-flash on stable v1
  return {
    url: `https://generativelanguage.googleapis.com/v1/models/gemini-3.6-flash:generateContent?key=${cleanKey}`,
    model: 'gemini-3.6-flash',
    apiVersion: 'v1',
  };
}
