import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      creator: "DINSTORE",
      source: "Pinterest Search — DINSTORE",
      status: false,
      message: "Method not allowed"
    });
  }

  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      creator: "DINSTORE",
      source: "Pinterest Search — DINSTORE",
      status: false,
      message: "Parameter query wajib diisi"
    });
  }

  try {
    const cleanQuery = query.trim();
    const searchPath = `/search/pins/?q=${encodeURIComponent(cleanQuery)}&rs=rs`;

    const payload = {
      options: {
        query: cleanQuery,
        rs: "rs",
        scope: "pins",
        redux_normalize_feed: true,
        source_url: searchPath
      },
      context: {}
    };

    const targetUrl = `https://id.pinterest.com/resource/BaseSearchResource/get/?source_url=${encodeURIComponent(searchPath)}&rs=rs&data=${encodeURIComponent(JSON.stringify(payload))}`;

    const response = await axios.get(targetUrl, {
      headers: {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "x-pinterest-appstate": "active",
        "x-pinterest-pws-handler": "www/search/[scope].js",
        "x-requested-with": "XMLHttpRequest",
        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
        "referer": "https://id.pinterest.com/",
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
      }
    });

    const data = response.data;
    const results = data.resource_response?.data?.results || [];

    if (results.length === 0) {
      return res.status(200).json({
        creator: "DINSTORE",
        source: "Pinterest Search — DINSTORE",
        status: true,
        result: []
      });
    }

    const formattedResults = results.map((pin) => ({
      id: pin.id,
      title: pin.seo_alt_text || pin.title || "No Title",
      image: pin.images?.["736x"]?.url || pin.images?.["474x"]?.url || pin.images?.["236x"]?.url || pin.images?.orig?.url || null,
      board: pin.board?.name || "-",
      username: pin.pinner?.username || "-",
      source: `https://id.pinterest.com/pin/${pin.id}/`
    })).filter((item) => item.image !== null);

    return res.status(200).json({
      creator: "DINSTORE",
      source: "Pinterest Search — DINSTORE",
      status: true,
      result: formattedResults
    });

  } catch (error) {
    console.error(error);
    const errorMessage = error.response?.data?.resource_response?.error?.message || error.message;

    return res.status(500).json({
      creator: "DINSTORE",
      source: "Pinterest Search — DINSTORE",
      status: false,
      message: errorMessage
    });
  }
}
