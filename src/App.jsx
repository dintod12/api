import { useState } from 'react';

const MODULES = [
  {
    id: 'DOWNLOAD',
    name: 'DOWNLOADER',
    path: '/api/d',
    endpoints: [
      {
        name: 'CapCut Downloader',
        path: '/api/download/capcut',
        method: 'GET',
        desc: 'Retrieve comprehensive metadata for a CapCut video by providing its URL.',
        params: [{ key: 'url', label: 'URL', required: true, default: 'https://www.capcut.com/' }]
      },
      {
        name: 'TikTok Downloader',
        path: '/api/download/tiktok',
        method: 'GET',
        desc: 'Extract media and metadata from TikTok links without watermark.',
        params: [{ key: 'url', label: 'URL', required: true, default: 'https://vt.tiktok.com/' }]
      },
      {
        name: 'Instagram Downloader',
        path: '/api/download/instagram',
        method: 'GET',
        desc: 'Fetch Reels, posts, and carousel content from Instagram.',
        params: [{ key: 'url', label: 'URL', required: true, default: 'https://www.instagram.com/p/' }]
      },
      {
        name: 'DramaBox Downloader',
        path: '/api/download/dramabox',
        method: 'GET',
        desc: 'Retrieve DramaBox video stream details.',
        params: [{ key: 'url', label: 'URL', required: true, default: '' }]
      }
    ]
  },
  {
    id: 'AI',
    name: 'ARTIFICIAL INTELLIGENCE',
    path: '/api/ai',
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
        desc: 'Generate visual artwork from text prompts.',
        params: [{ key: 'prompt', label: 'PROMPT', required: true, default: 'futuristic neon cyber city' }]
      },
      {
        name: 'AI Lyrics Generator',
        path: '/api/ai/lyricsgen',
        method: 'GET',
        desc: 'Produce musical lyrics and song structures.',
        params: [{ key: 'title', label: 'TITLE', required: true, default: 'Cyberpunk night' }]
      }
    ]
  },
  {
    id: 'TOOLS',
    name: 'TOOLS & UTILITIES',
    path: '/api/tools',
    endpoints: [
      {
        name: 'AI Coder',
        path: '/api/tools/aicoder',
        method: 'GET',
        desc: 'Code generation and debugging engine.',
        params: [{ key: 'text', label: 'PROMPT TEXT', required: true, default: 'binary search tree in python' }]
      },
      {
        name: 'Checker Ban WA',
        path: '/api/tools/checker-ban-wa',
        method: 'GET',
        desc: 'Inspect WhatsApp number ban status.',
        params: [{ key: 'number', label: 'PHONE NUMBER', required: true, default: '628123456789' }]
      },
      {
        name: 'Domain Info',
        path: '/api/tools/domaininfo',
        method: 'GET',
        desc: 'Look up WHOIS and domain records.',
        params: [{ key: 'domain', label: 'DOMAIN NAME', required: true, default: 'google.com' }]
      },
      {
        name: 'Detik News',
        path: '/api/news/detik',
        method: 'GET',
        desc: 'Get the latest real-time headlines from Detik.',
        params: []
      }
    ]
  }
];

export default function App() {
  const [filterText, setFilterText] = useState('');
  const [activeEpPath, setActiveEpPath] = useState('/api/download/capcut');
  const [formInputs, setFormInputs] = useState({
    '/api/download/capcut': { url: 'https://www.capcut.com/' }
  });
  const [executionState, setExecutionState] = useState({});
  const [activeViewTab, setActiveViewTab] = useState('PREVIEW');
  const [copyStatus, setCopyStatus] = useState(false);

  const toggleEndpoint = (ep) => {
    if (activeEpPath === ep.path) {
      setActiveEpPath(null);
    } else {
      setActiveEpPath(ep.path);
      if (!formInputs[ep.path]) {
        const initial = {};
        ep.params.forEach((p) => {
          initial[p.key] = p.default;
        });
        setFormInputs((prev) => ({ ...prev, [ep.path]: initial }));
      }
    }
  };

  const handleInputChange = (path, key, value) => {
    setFormInputs((prev) => ({
      ...prev,
      [path]: {
        ...(prev[path] || {}),
        [key]: value
      }
    }));
  };

  const handleClear = (ep) => {
    const cleared = {};
    ep.params.forEach((p) => {
      cleared[p.key] = '';
    });
    setFormInputs((prev) => ({ ...prev, [ep.path]: cleared }));
  };

  const handleExecute = async (ep) => {
    const currentParams = formInputs[ep.path] || {};
    const queryParams = new URLSearchParams();
    Object.entries(currentParams).forEach(([k, v]) => {
      if (v !== undefined && v !== '') queryParams.append(k, v);
    });

    const queryString = queryParams.toString();
    const targetUrl = `${ep.path}${queryString ? '?' + queryString : ''}`;

    setExecutionState((prev) => ({
      ...prev,
      [ep.path]: { ...prev[ep.path], loading: true }
    }));

    const startTime = performance.now();

    try {
      const res = await fetch(targetUrl);
      const data = await res.json();
      const endTime = performance.now();

      setExecutionState((prev) => ({
        ...prev,
        [ep.path]: {
          loading: false,
          status: res.status,
          latency: Math.round(endTime - startTime),
          url: targetUrl,
          headers: {
            'content-type': res.headers.get('content-type') || 'application/json',
            status: `${res.status} ${res.statusText || 'OK'}`
          },
          data
        }
      }));
    } catch (err) {
      const endTime = performance.now();
      setExecutionState((prev) => ({
        ...prev,
        [ep.path]: {
          loading: false,
          status: 500,
          latency: Math.round(endTime - startTime),
          url: targetUrl,
          headers: { 'content-type': 'application/json' },
          data: { status: false, error: err.message }
        }
      }));
    }
  };

  const handleCopyJson = (data) => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 1500);
  };

  return (
    <div className="layout-root">
      {/* Navbar Bar */}
      <header className="top-navbar">
        <div className="nav-brand">
          <span className="brand-stripe"></span>
          <span className="brand-text">API SIPUTZX</span>
        </div>
        <div className="nav-actions">
          <button className="icon-btn" title="Toggle theme">☼</button>
          <button className="icon-btn" title="Menu">≡</button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="filter-container">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="FILTER ENDPOINTS..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {/* Accordion Categories & Endpoints */}
      <main className="endpoint-stream">
        {MODULES.map((module) => {
          const filteredEndpoints = module.endpoints.filter((ep) =>
            ep.name.toLowerCase().includes(filterText.toLowerCase()) ||
            ep.path.toLowerCase().includes(filterText.toLowerCase())
          );

          if (filterText && filteredEndpoints.length === 0) return null;

          return (
            <section key={module.id} className="module-group">
              <div className="module-legend">
                <span>{module.name}</span>
                <span className="endpoint-count">{filteredEndpoints.length} ENDPOINTS</span>
              </div>

              <div className="endpoint-list">
                {filteredEndpoints.map((ep) => {
                  const isOpen = activeEpPath === ep.path;
                  const exec = executionState[ep.path] || {};
                  const currentVals = formInputs[ep.path] || {};

                  return (
                    <div key={ep.path} className={`endpoint-card ${isOpen ? 'active' : ''}`}>
                      {/* Accordion Row */}
                      <div className="endpoint-row" onClick={() => toggleEndpoint(ep)}>
                        <div className="endpoint-meta">
                          <span className="http-badge-get">{ep.method}</span>
                          <span className="endpoint-route">{ep.path}</span>
                          <span className="endpoint-alias">{ep.name}</span>
                        </div>
                        <span className="accordion-arrow">{isOpen ? '˄' : '˅'}</span>
                      </div>

                      {/* Playground Content & Embedded Response Box */}
                      {isOpen && (
                        <div className="playground-drawer">
                          {ep.desc && <p className="endpoint-desc">{ep.desc}</p>}

                          <div className="method-selector">
                            <span className="method-pill active">GET</span>
                            <span className="method-pill disabled">POST</span>
                          </div>

                          {ep.params.length > 0 && (
                            <div className="params-wrapper">
                              <div className="params-headline">REQUEST PARAMETERS</div>

                              {ep.params.map((p) => (
                                <div key={p.key} className="input-group">
                                  <label>
                                    {p.label || p.key} {p.required && <span className="req-star">*</span>}
                                  </label>

                                  {p.key === 'model' ? (
                                    <select
                                      value={currentVals[p.key] ?? p.default}
                                      onChange={(e) => handleInputChange(ep.path, p.key, e.target.value)}
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
                                      value={currentVals[p.key] ?? p.default}
                                      onChange={(e) => handleInputChange(ep.path, p.key, e.target.value)}
                                    >
                                      <option value="ESV">ESV</option>
                                      <option value="NIV">NIV</option>
                                      <option value="KJV">KJV</option>
                                      <option value="TB">TB</option>
                                    </select>
                                  ) : (
                                    <input
                                      type="text"
                                      value={currentVals[p.key] ?? ''}
                                      placeholder={p.default}
                                      onChange={(e) => handleInputChange(ep.path, p.key, e.target.value)}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <button
                            type="button"
                            className="btn-execute"
                            disabled={exec.loading}
                            onClick={() => handleExecute(ep)}
                          >
                            {exec.loading ? 'FETCHING...' : 'EXECUTE REQUEST'}
                          </button>

                          <button
                            type="button"
                            className="btn-clear"
                            onClick={() => handleClear(ep)}
                          >
                            CLEAR
                          </button>

                          {/* Inline Response Box */}
                          {exec.data && (
                            <div className="terminal-result-block">
                              <div className="terminal-result-header">
                                <div className="result-tabs">
                                  <button
                                    className={`tab-link ${activeViewTab === 'PREVIEW' ? 'active' : ''}`}
                                    onClick={() => setActiveViewTab('PREVIEW')}
                                  >
                                    PREVIEW
                                  </button>
                                  <button
                                    className={`tab-link ${activeViewTab === 'HEADERS' ? 'active' : ''}`}
                                    onClick={() => setActiveViewTab('HEADERS')}
                                  >
                                    HEADERS
                                  </button>
                                  <button
                                    className={`tab-link ${activeViewTab === 'CURL' ? 'active' : ''}`}
                                    onClick={() => setActiveViewTab('CURL')}
                                  >
                                    CURL
                                  </button>
                                </div>

                                <div className="result-badges">
                                  {/* Copy Icon Button */}
                                  <button
                                    className="btn-icon-copy"
                                    title="Copy JSON Response"
                                    onClick={() => handleCopyJson(exec.data)}
                                  >
                                    {copyStatus ? (
                                      <span className="copied-text">✓</span>
                                    ) : (
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                      </svg>
                                    )}
                                  </button>

                                  <span className={`status-pill ${exec.status === 200 ? 'status-200' : 'status-err'}`}>
                                    {exec.status} {exec.status === 200 ? 'OK' : 'ERR'}
                                  </span>
                                  {exec.latency && (
                                    <span className="latency-text">{exec.latency}ms</span>
                                  )}
                                </div>
                              </div>

                              <div className="terminal-result-body">
                                {activeViewTab === 'PREVIEW' && (
                                  <pre className="code-green">
                                    {JSON.stringify(exec.data, null, 2)}
                                  </pre>
                                )}
                                {activeViewTab === 'HEADERS' && (
                                  <pre className="code-cyan">
                                    {JSON.stringify(exec.headers, null, 2)}
                                  </pre>
                                )}
                                {activeViewTab === 'CURL' && (
                                  <pre className="code-yellow">
                                    {`curl -X GET "${window.location.origin}${exec.url}"`}
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
            </section>
          );
        })}
      </main>
    </div>
  );
}
