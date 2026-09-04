import { useState } from 'react';

const MODULES = [
  {
    id: 'DOWNLOAD',
    name: 'MEDIA DOWNLOADER',
    endpoints: [
      {
        name: 'CapCut Video',
        path: '/api/download/capcut',
        method: 'GET',
        desc: 'Download template dan video CapCut tanpa ribet.',
        params: [{ key: 'url', label: 'URL', required: true, default: 'https://www.capcut.com/' }]
      },
      {
        name: 'TikTok Video',
        path: '/api/download/tiktok',
        method: 'GET',
        desc: 'Download video TikTok tanpa watermark secara cepat.',
        params: [{ key: 'url', label: 'URL', required: true, default: 'https://vt.tiktok.com/' }]
      },
      {
        name: 'Instagram Media',
        path: '/api/download/instagram',
        method: 'GET',
        desc: 'Unduh reels, video, dan postingan Instagram.',
        params: [{ key: 'url', label: 'URL', required: true, default: 'https://www.instagram.com/p/' }]
      },
      {
        name: 'DramaBox Stream',
        path: '/api/download/dramabox',
        method: 'GET',
        desc: 'Ekstrak video streaming dari DramaBox.',
        params: [{ key: 'url', label: 'URL', required: true, default: '' }]
      }
    ]
  },
  {
    id: 'AI',
    name: 'ARTIFICIAL INTELLIGENCE',
    endpoints: [
      {
        name: 'AI Duckai',
        path: '/api/ai/duckai',
        method: 'GET',
        desc: 'Multi-model artificial intelligence query engine.',
        params: [
          { key: 'message', label: 'MESSAGE', required: true, default: 'What is the meaning of life?' },
          { key: 'model', label: 'MODEL', required: false, default: 'gpt-4o-mini' },
          { key: 'systemPrompt', label: 'SYSTEM PROMPT', required: false, default: 'You are a helpful assistant' }
        ]
      },
      {
        name: 'Bible AI',
        path: '/api/ai/bibleai',
        method: 'GET',
        desc: 'Eksplorasi teologi dan referensi kitab suci.',
        params: [
          { key: 'question', label: 'QUESTION', required: true, default: 'What is faith?' },
          { key: 'translation', label: 'TRANSLATION', required: false, default: 'ESV' }
        ]
      },
      {
        name: 'Flixier AI Image',
        path: '/api/ai/flixier',
        method: 'GET',
        desc: 'Render gambar artistik melalui perintah teks.',
        params: [{ key: 'prompt', label: 'PROMPT', required: true, default: 'cyberpunk neon futuristic city' }]
      },
      {
        name: 'AI Lyrics Generator',
        path: '/api/ai/lyricsgen',
        method: 'GET',
        desc: 'Buat lirik lagu secara otomatis dan kreatif.',
        params: [{ key: 'title', label: 'TITLE', required: true, default: 'Cyberpunk night' }]
      },
      {
        name: 'AI Chat (ai4chat)',
        path: '/api/ai/ai4chat',
        method: 'GET',
        desc: 'Asisten obrolan interaktif.',
        params: [{ key: 'message', label: 'MESSAGE', required: true, default: 'Hello AI' }]
      }
    ]
  },
  {
    id: 'TOOLS',
    name: 'TOOLS & UTILITIES',
    endpoints: [
      {
        name: 'AI Coder',
        path: '/api/tools/aicoder',
        method: 'GET',
        desc: 'Penyelesai kode pemrograman dan debugger cerdas.',
        params: [{ key: 'text', label: 'TEXT', required: true, default: 'binary search tree in python' }]
      },
      {
        name: 'Checker Ban WA',
        path: '/api/tools/checker-ban-wa',
        method: 'GET',
        desc: 'Periksa status blokir atau aktif nomor WhatsApp.',
        params: [{ key: 'number', label: 'PHONE NUMBER', required: true, default: '628123456789' }]
      },
      {
        name: 'Domain Info',
        path: '/api/tools/domaininfo',
        method: 'GET',
        desc: 'Cek informasi DNS dan rekaman WHOIS domain.',
        params: [{ key: 'domain', label: 'DOMAIN', required: true, default: 'google.com' }]
      },
      {
        name: 'Detik News',
        path: '/api/news/detik',
        method: 'GET',
        desc: 'Berita aktual pilihan dari portal Detik.',
        params: []
      }
    ]
  }
];

export default function App() {
  const [filter, setFilter] = useState('');
  const [activeEp, setActiveEp] = useState('/api/download/capcut');
  const [inputs, setInputs] = useState({
    '/api/download/capcut': { url: 'https://www.capcut.com/' }
  });
  const [runs, setRuns] = useState({});
  const [activeTab, setActiveTab] = useState('PREVIEW');
  const [copiedPath, setCopiedPath] = useState(null);

  const toggle = (ep) => {
    if (activeEp === ep.path) {
      setActiveEp(null);
    } else {
      setActiveEp(ep.path);
      if (!inputs[ep.path]) {
        const init = {};
        ep.params.forEach((p) => {
          init[p.key] = p.default;
        });
        setInputs((prev) => ({ ...prev, [ep.path]: init }));
      }
    }
  };

  const setParam = (path, key, val) => {
    setInputs((prev) => ({
      ...prev,
      [path]: { ...(prev[path] || {}), [key]: val }
    }));
  };

  const execute = async (ep) => {
    const curParams = inputs[ep.path] || {};
    const qs = new URLSearchParams();
    Object.entries(curParams).forEach(([k, v]) => {
      if (v !== undefined && v !== '') qs.append(k, v);
    });

    const targetUrl = `${ep.path}${qs.toString() ? '?' + qs.toString() : ''}`;

    setRuns((prev) => ({
      ...prev,
      [ep.path]: { ...prev[ep.path], loading: true }
    }));

    const start = performance.now();

    try {
      const res = await fetch(targetUrl);
      const data = await res.json();
      const end = performance.now();

      setRuns((prev) => ({
        ...prev,
        [ep.path]: {
          loading: false,
          status: res.status,
          latency: Math.round(end - start),
          url: targetUrl,
          headers: {
            'content-type': res.headers.get('content-type') || 'application/json'
          },
          data
        }
      }));
    } catch (err) {
      const end = performance.now();
      setRuns((prev) => ({
        ...prev,
        [ep.path]: {
          loading: false,
          status: 500,
          latency: Math.round(end - start),
          url: targetUrl,
          headers: { 'content-type': 'application/json' },
          data: { status: false, error: err.message }
        }
      }));
    }
  };

  const copyJson = (path, data) => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 1500);
  };

  return (
    <div className="app-shell">
      <div className="main-viewport">
        {/* Navbar ala Sidownload */}
        <header className="header-bar">
          <div className="brand-group">
            <div className="brand-logo-box">S</div>
            <div className="brand-texts">
              <span className="brand-title">SIDOWNLOAD</span>
              <span className="brand-subtitle">FAST • SIMPLE • FREE</span>
            </div>
          </div>
          <a href="#endpoints-section" className="doc-btn">
            DOC ↗
          </a>
        </header>

        {/* Hero Section ala Gambar */}
        <section className="hero-section">
          <div className="hero-badge">
            <span className="live-spark"></span> MEDIA DOWNLOADER
          </div>
          <h1 className="hero-headline">
            Download Video <br />
            & Audio <span className="highlight-green">Tanpa Ribet</span>
          </h1>
          <p className="hero-desc">
            Download media favorit kamu dengan cepat, sederhana, dan gratis.
          </p>

          {/* Floating Icon Badges Preview */}
          <div className="hero-preview-cluster">
            <div className="preview-bubble tiktok">🎵</div>
            <div className="preview-phone-mockup">
              <div className="mockup-top">SIDOWNLOAD</div>
              <div className="mockup-play-btn">▶</div>
            </div>
            <div className="preview-bubble ig">📸</div>
            <div className="preview-bubble spot">🟢</div>
          </div>
        </section>

        {/* Filter / Search Endpoint */}
        <div id="endpoints-section" className="filter-block">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="CARI ENDPOINT API..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        {/* Endpoint Modules */}
        <div className="modules-stack">
          {MODULES.map((mod) => {
            const filteredEps = mod.endpoints.filter((e) =>
              e.name.toLowerCase().includes(filter.toLowerCase()) ||
              e.path.toLowerCase().includes(filter.toLowerCase())
            );

            if (filter && filteredEps.length === 0) return null;

            return (
              <div key={mod.id} className="module-group">
                <div className="module-label">
                  <span>{mod.name}</span>
                  <span className="module-counter">{filteredEps.length} ENDPOINTS</span>
                </div>

                <div className="endpoints-flow">
                  {filteredEps.map((ep) => {
                    const isOpen = activeEp === ep.path;
                    const r = runs[ep.path] || {};
                    const curVals = inputs[ep.path] || {};

                    return (
                      <div key={ep.path} className={`ep-card ${isOpen ? 'expanded' : ''}`}>
                        <div className="ep-card-head" onClick={() => toggle(ep)}>
                          <div className="ep-info">
                            <span className="get-tag">{ep.method}</span>
                            <span className="ep-path-txt">{ep.path}</span>
                            <span className="ep-alias-txt">{ep.name}</span>
                          </div>
                          <span className="arrow-sym">{isOpen ? '˄' : '˅'}</span>
                        </div>

                        {isOpen && (
                          <div className="ep-body">
                            <p className="ep-desc-txt">{ep.desc}</p>

                            <div className="method-toggles">
                              <span className="m-pill active">GET</span>
                              <span className="m-pill muted">POST</span>
                            </div>

                            {ep.params.length > 0 && (
                              <div className="params-area">
                                <span className="params-header-txt">REQUEST PARAMETERS</span>
                                {ep.params.map((p) => (
                                  <div key={p.key} className="form-item">
                                    <label>
                                      {p.label} {p.required && <span className="req-point">*</span>}
                                    </label>
                                    {p.key === 'model' ? (
                                      <select
                                        value={curVals[p.key] ?? p.default}
                                        onChange={(e) => setParam(ep.path, p.key, e.target.value)}
                                      >
                                        <option value="gpt-4o-mini">gpt-4o-mini</option>
                                        <option value="claude-3-5-haiku-latest">claude-3-5-haiku-latest</option>
                                        <option value="meta-llama/Llama-4-Scout-17B-16E-Instruct">meta-llama/Llama-4-Scout-17B-16E-Instruct</option>
                                        <option value="mistralai/Mistral-Small-24B-Instruct-2501">mistralai/Mistral-Small-24B-Instruct-2501</option>
                                        <option value="openai/gpt-oss-120b">openai/gpt-oss-120b</option>
                                        <option value="gpt-5-mini">gpt-5-mini</option>
                                      </select>
                                    ) : p.key === 'translation' ? (
                                      <select
                                        value={curVals[p.key] ?? p.default}
                                        onChange={(e) => setParam(ep.path, p.key, e.target.value)}
                                      >
                                        <option value="ESV">ESV</option>
                                        <option value="NIV">NIV</option>
                                        <option value="KJV">KJV</option>
                                        <option value="TB">TB</option>
                                      </select>
                                    ) : (
                                      <input
                                        type="text"
                                        value={curVals[p.key] ?? ''}
                                        placeholder={p.default}
                                        onChange={(e) => setParam(ep.path, p.key, e.target.value)}
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            <button
                              type="button"
                              className="btn-exec"
                              disabled={r.loading}
                              onClick={() => execute(ep)}
                            >
                              {r.loading ? 'PROSES DOWNLOAD...' : 'EXECUTE REQUEST'}
                            </button>

                            {/* Response Box Tepat di Bawah Endpoint */}
                            {r.data && (
                              <div className="response-box">
                                <div className="response-box-head">
                                  <div className="tabs-cluster">
                                    <button
                                      className={`tab-btn ${activeTab === 'PREVIEW' ? 'active' : ''}`}
                                      onClick={() => setActiveTab('PREVIEW')}
                                    >
                                      PREVIEW
                                    </button>
                                    <button
                                      className={`tab-btn ${activeTab === 'HEADERS' ? 'active' : ''}`}
                                      onClick={() => setActiveTab('HEADERS')}
                                    >
                                      HEADERS
                                    </button>
                                    <button
                                      className={`tab-btn ${activeTab === 'CURL' ? 'active' : ''}`}
                                      onClick={() => setActiveTab('CURL')}
                                    >
                                      CURL
                                    </button>
                                  </div>

                                  <div className="head-right-actions">
                                    <button
                                      className="copy-trigger"
                                      title="Copy JSON Response"
                                      onClick={() => copyJson(ep.path, r.data)}
                                    >
                                      {copiedPath === ep.path ? (
                                        <span className="copied-flag">✓</span>
                                      ) : (
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                      )}
                                    </button>

                                    <span className={`status-tag ${r.status === 200 ? 'ok' : 'err'}`}>
                                      {r.status} {r.status === 200 ? 'OK' : 'ERR'}
                                    </span>
                                    {r.latency && <span className="latency-lbl">{r.latency}ms</span>}
                                  </div>
                                </div>

                                <div className="response-box-body">
                                  {activeTab === 'PREVIEW' && (
                                    <pre className="code-green">
                                      {JSON.stringify(r.data, null, 2)}
                                    </pre>
                                  )}
                                  {activeTab === 'HEADERS' && (
                                    <pre className="code-cyan">
                                      {JSON.stringify(r.headers, null, 2)}
                                    </pre>
                                  )}
                                  {activeTab === 'CURL' && (
                                    <pre className="code-yellow">
                                      {`curl -X GET "${window.location.origin}${r.url}"`}
                                    </pre>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
