export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      status: false,
      creator: "DINSTORE",
      message: "Method tidak diizinkan",
      error: {
        code: "METHOD_NOT_ALLOWED"
      }
    });
  }

  const {
    message,
    model = "gpt-4o-mini",
    systemPrompt = "You are a helpful assistant"
  } = req.query;

  // Validasi message
  if (!message || !String(message).trim()) {
    return res.status(400).json({
      status: false,
      creator: "DINSTORE",
      message: "Parameter message wajib diisi",
      error: {
        code: "MISSING_MESSAGE"
      }
    });
  }

  const params = new URLSearchParams({
    message: String(message),
    model: String(model),
    systemPrompt: String(systemPrompt)
  });

  const providerUrl =
    `https://api.siputzx.my.id/api/ai/duckai?${params.toString()}`;

  try {
    const response = await fetch(providerUrl, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });

    let result;

    try {
      result = await response.json();
    } catch {
      return res.status(502).json({
        status: false,
        creator: "DINSTORE",
        message: "Provider mengembalikan response yang tidak valid",
        error: {
          code: "INVALID_PROVIDER_RESPONSE"
        }
      });
    }

    /*
     * Provider HTTP error
     */
    if (!response.ok) {
      return res.status(502).json({
        status: false,
        creator: "DINSTORE",
        message: "Layanan AI sedang mengalami gangguan",
        error: {
          code: "PROVIDER_ERROR",
          status: response.status
        }
      });
    }

    /*
     * Provider mengembalikan status false
     */
    if (result?.status === false) {
      return res.status(502).json({
        status: false,
        creator: "DINSTORE",
        message: "Layanan AI gagal memproses permintaan",
        error: {
          code: "AI_PROCESSING_ERROR"
        }
      });
    }

    /*
     * Ambil data provider
     */
    const providerData = result?.data || {};

    /*
     * Response resmi DINSTORE
     */
    return res.status(200).json({
      status: true,
      creator: "DINSTORE",
      data: {
        message: providerData.message ?? "",
        model: providerData.model ?? model,
        metadata: providerData.metadata ?? null
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    /*
     * Semua error internal disembunyikan
     */
    console.error("DINSTORE DuckAI Error:", error);

    return res.status(500).json({
      status: false,
      creator: "DINSTORE",
      message: "Terjadi kesalahan pada server DINSTORE",
      error: {
        code: "INTERNAL_SERVER_ERROR"
      },
      timestamp: new Date().toISOString()
    });
  }
}
