import { Router } from 'express';
import { resolveGeminiEndpoint } from '../services/geminiResolver';

const router = Router();

// Test Gemini API Key connectivity and status
router.post('/test', async (req, res) => {
  try {
    const apiKey =
      (req.headers['x-gemini-api-key'] as string) ||
      req.body?.apiKey ||
      process.env.GEMINI_API_KEY;

    if (!apiKey || !apiKey.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng nhập Gemini API Key trước khi kiểm tra.',
      });
    }

    const cleanKey = apiKey.trim();

    // Dynamically resolve active model and endpoint
    const endpoint = await resolveGeminiEndpoint(cleanKey);

    // Call Gemini API with a lightweight test request
    const response = await fetch(endpoint.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: 'Respond with exactly the word "CONNECTED" to verify API connection.',
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 10,
        },
      }),
    });

    if (!response.ok) {
      const errData: any = await response.json().catch(() => ({}));
      const errorMsg =
        errData?.error?.message ||
        `Lỗi từ máy chủ Google (Mã lỗi: ${response.status} - ${response.statusText})`;

      return res.status(response.status).json({
        success: false,
        error: errorMsg,
      });
    }

    const data: any = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    return res.json({
      success: true,
      message: `Kết nối Google Gemini thành công! Đang sử dụng mô hình ${endpoint.model} (${endpoint.apiVersion}).`,
      model: endpoint.model,
      response: reply,
    });
  } catch (err: any) {
    console.error('Error testing Gemini API key:', err);
    return res.status(500).json({
      success: false,
      error:
        err.message ||
        'Không thể kết nối đến máy chủ Google AI. Vui lòng kiểm tra lại đường truyền mạng.',
    });
  }
});

export default router;
