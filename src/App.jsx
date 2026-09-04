import { useState } from 'react';

const MODULES = [
  {
    id: 'AI',
    name: 'AI MODULE',
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
        desc: 'Explore theological and scripture references.',
        params: [
          { key: 'question', label: 'QUESTION', required: true, default: 'What is faith?' },
          { key: 'translation', label: 'TRANSLATION', required: false, default: 'ESV' }
        ]
      },
      {
        name: 'Flixier AI Image',
        path: '/api/ai/flixier',
        method: 'GET',
        desc: 'Render artwork matrices via text prompt.',
        params: [{ key: 'prompt', label: 'PROMPT', required: true, default: 'transformer mecha cyber robot' }]
      },
      {
        name: 'AI Lyrics Generator',
        path: '/api/ai/lyricsgen',
        method: 'GET',
        desc: 'Generate lyrics and rhythmic poems.',
        params: [{ key: 'title', label: 'TITLE', required: true, default: 'Cyberpunk night' }]
      },
      {
        name: 'AI Chat (ai4chat)',
        path: '/api/ai/ai4chat',
        method: 'GET',
        desc: 'Direct conversation AI interface.',
        params: [{ key: 'message', label: 'MESSAGE', required: true, default: 'Hello AI' }]
      }
    ]
  },
  {
    id: 'DOWNLOAD',
    name: 'DOWNLOADER MODULE',
    endpoints: [
      {
        name: 'CapCut Video',
        path: '/api/download/capcut',
        method: 'GET',
        desc: 'Retrieve comprehensive metadata for a CapCut video by providing its URL.',
        params: [{ key: 'url', label: 'URL', required: true, default: 'https://www.capcut.com/' }]
      },
      {
        name: 'TikTok Video',
        path: '/api/download/tiktok',
        method: 'GET',
        desc: 'Download media without watermark from TikTok.',
        params: [{ key: 'url', label: 'URL', required: true, default: 'https://vt.tiktok.com/' }]
      },
      {
        name: 'Instagram Media',
        path: '/api/download/instagram',
        method: 'GET',
        desc: 'Scrape Instagram video, reel, and image content.',
        params: [{ key: 'url', label: 'URL', required: true, default: 'https://www.instagram.com/p/' }]
      },
      {
        name: 'DramaBox Video',
        path: '/api/download/dramabox',
        method: 'GET',
        desc: 'Extract DramaBox stream details.',
        params: [{ key: 'url', label: 'URL', required: true, default: '' }]
      }
    ]
  },
  {
    id: 'TOOLS',
    name: 'TOOLS & NEWS MODULE',
    endpoints: [
      {
        name: 'AI Coder',
        path: '/api/tools/aicoder',
        method: 'GET',
        desc: 'Algorithm code solver and debugger.',
        params: [{ key: 'text', label: 'TEXT', required: true, default: 'binary search tree in python' }]
      },
      {
        name: 'Checker Ban WA',
        path: '/api/tools/checker-ban-wa',
        method: 'GET',
        desc: 'Verify if a WhatsApp number is banned or active.',
        params: [{ key: 'number', label: 'PHONE NUMBER', required: true, default: '628123456789' }]
      },
      {
        name: 'Domain Info',
        path: '/api/tools/domaininfo',
        method: 'GET',
        desc: 'WHOIS and DNS domain records inquiry.',
        params: [{ key: 'domain', label: 'DOMAIN', required: true, default: 'google.com' }]
      },
      {
        name: 'Detik News',
        path: '/api/news/detik',
        method: 'GET',
        desc: 'Latest breaking headlines from Detikcom.',
        params: []
      }
    ]
  }
];

export default function App() {
  const [filter, setFilter] = useState('');
  const [activeEp, setActiveEp] = useState('/api/ai/duckai');
  const [inputs, setInputs] = useState({
    '/api/ai/duckai': { message: 'What is the meaning of life?' }
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
        {/* Navbar */}
        <header className="header-bar">
          <div className="brand-group">
            <span className="brand-dot"></span>
            <span className="brand-title">API SIPUTZX // DINSTORE</span>
          </div>
          <div className="status-pill">
            <span className="live-spark"></span> ONLINE
          </div>
        </header>

        {/* Filter */}
        <div className="filter-block">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="FILTER ENDPOINTS..."
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
                              {r.loading ? 'COMPUTING STREAM...' : 'EXECUTE REQUEST'}
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
