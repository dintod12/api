export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      creator: "DINSTORE",
      source: "DuckAI — DINSTORE",
      status: false,
      message: "Method not allowed"
    });
  }

  const { message = '', model = 'gpt-4o-mini', systemPrompt = 'You are a helpful assistant' } = req.query;

  if (!message) {
    return res.status(400).json({
      creator: "DINSTORE",
      source: "DuckAI — DINSTORE",
      status: false,
      message: "Parameter message wajib diisi"
    });
  }

  try {
    const target = new URL("https://api.siputzx.my.id/api/ai/duckai");
    target.searchParams.set("message", message);
    target.searchParams.set("model", model);
    target.searchParams.set("systemPrompt", systemPrompt);

    const response = await fetch(target.toString());
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { data: text };
    }

    const isSuccess = response.ok && (data.status === true || data.status === "true");
    const rawResult = data.result ?? data.data ?? data;

    // Bersihkan atribut pihak ketiga jika ada di dalam result
    let cleanedResult = typeof rawResult === 'object' && rawResult !== null ? { ...rawResult } : { data: rawResult };
    delete cleanedResult.creator;
    delete cleanedResult.source;

    return res.status(response.status).json({
      creator: "DINSTORE",
      source: "DuckAI — DINSTORE",
      status: isSuccess,
      result: cleanedResult
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      creator: "DINSTORE",
      source: "DuckAI — DINSTORE",
      status: false,
      message: "Gagal menghubungi provider"
    });
  }
}
