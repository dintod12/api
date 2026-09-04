export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      creator: "DINSTORE",
      source: "TikTok — DINSTORE",
      status: false,
      message: "Method not allowed"
    });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      creator: "DINSTORE",
      source: "TikTok — DINSTORE",
      status: false,
      message: "Parameter url wajib diisi"
    });
  }

  try {
    const target = new URL("https://api.azbry.com/api/download/tiktok");
    target.searchParams.set("url", url);

    const response = await fetch(target.toString());
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { data: text };
    }

    const isSuccess = response.ok && (data.status === true || data.status === "true");

    // Ambil isi result mentah dari provider
    const rawResult = data.result ?? data;

    // Bersihkan properti creator/source/debug bawaan provider jika ada
    const cleanedResult = typeof rawResult === 'object' && rawResult !== null ? { ...rawResult } : { data: rawResult };
    delete cleanedResult.creator;
    delete cleanedResult.source;
    delete cleanedResult.debug;

    return res.status(response.status).json({
      creator: "DINSTORE",
      source: "TikTok — DINSTORE",
      status: isSuccess,
      result: cleanedResult
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      creator: "DINSTORE",
      source: "TikTok — DINSTORE",
      status: false,
      message: "Gagal menghubungi provider"
    });
  }
}
