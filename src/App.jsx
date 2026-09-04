import { useState } from 'react';

const MODULES = [
  {
    id: 'AI',
    name: 'Artificial Intelligence',
    path: '/api/ai',
    icon: '◆',
    endpoints: [
      {
        name: 'AI Duckai',
        path: '/api/ai/duckai',
        method: 'GET',
        desc: 'Multi-model inference engine',
        params: [
          { key: 'message', default: 'What is the meaning of life?' },
          { key: 'model', default: 'gpt-4o-mini' },
          { key: 'systemPrompt', default: 'You are a helpful assistant' }
        ]
      },
      {
        name: 'Bible AI',
        path: '/api/ai/bibleai',
        method: 'GET',
        desc: 'Theology and scripture explorer',
        params: [
          { key: 'question', default: 'What is faith?' },
          { key: 'translation', default: 'ESV' }
        ]
      },
      {
        name: 'Flixier AI Image',
        path: '/api/ai/flixier',
        method: 'GET',
        desc: 'Text to high-res visual render',
        params: [{ key: 'prompt', default: 'futuristic neon cyber city' }]
      },
      {
        name: 'AI Lyrics Generator',
        path: '/api/ai/lyricsgen',
        method: 'GET',
        desc: 'Structured song & poem generator',
        params: [{ key: 'title', default: 'Cyberpunk night' }]
      },
      {
        name: 'AI Chat 4',
        path: '/api/ai/ai4chat',
        method: 'GET',
        desc: 'Conversational assistant bot',
        params: [{ key: 'message', default: 'Hello AI' }]
      }
    ]
  },
  {
    id: 'DOWNLOAD',
    name: 'Media Extractor',
    path: '/api/download',
    icon: '▼',
    endpoints: [
      {
        name: 'TikTok Downloader',
        path: '/api/download/tiktok',
        method: 'GET',
        desc: 'No-watermark video fetcher',
        params: [{ key: 'url', default: 'https://vt.tiktok.com/' }]
      },
      {
        name: 'Instagram Media',
        path: '/api/download/instagram',
        method: 'GET',
        desc: 'Reel, post & image scraper',
        params: [{ key: 'url', default: 'https://www.instagram.com/p/' }]
      },
      {
        name: 'CapCut Video',
        path: '/api/download/capcut',
        method: 'GET',
        desc: 'Direct template video download',
        params: [{ key: 'url', default: 'https://www.capcut.com/' }]
      },
      {
        name: 'DramaBox Stream',
        path: '/api/download/dramabox',
        method: 'GET',
        desc: 'Short-film drama extractor',
        params: [{ key: 'url', default: '' }]
      }
    ]
  },
  {
    id: 'TOOLS',
    name: 'Utilities & News',
    path: '/api/tools',
    icon: '⚡',
    endpoints: [
      {
        name: 'AI Code Solver',
        path: '/api/tools/aicoder',
        method: 'GET',
        desc: 'Algorithm & bug refactor engine',
        params: [{ key: 'text', default: 'binary search tree python' }]
      },
      {
        name: 'Checker Ban WA',
        path: '/api/tools/checker-ban-wa',
        method: 'GET',
        desc: 'WhatsApp account status inspector',
        params: [{ key: 'number', default: '628123456789' }]
      },
      {
        name: 'Domain Inspector',
        path: '/api/tools/domaininfo',
        method: 'GET',
        desc: 'WHOIS & DNS records query',
        params: [{ key: 'domain', default: 'google.com' }]
      },
      {
        name: 'Detik Live News',
        path: '/api/news/detik',
        method: 'GET',
        desc: 'Real-time Indonesian news feed',
        params: []
      }
    ]
  }
];

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [openModule, setOpenModule] = useState('AI');
  const [activeEp, setActiveEp] = useState(null);
  const [formParams, setFormParams] = useState({});
  const [responseView, setResponseView] = useState(null);
  const [latency, setLatency] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalEndpoints = MODULES.reduce((acc, curr) => acc + curr.endpoints.length, 0);

  const handleSelectEp = (ep) => {
    if (activeEp?.path === ep.path) {
      setActiveEp(null);
      return;
    }
    setActiveEp(ep);
    const initial = {};
    ep.params.forEach((p) => {
      initial[p.key] = p.default;
    });
    setFormParams(initial);
  };

  const handleParamChange = (key, val) => {
    setFormParams((prev) => ({ ...prev, [key]: val }));
  };

  const executeApi = async (e) => {
    e.preventDefault();
    setLoading(true);
    const startTime = performance.now();

    const queryParams = new URLSearchParams();
    Object.entries(formParams).forEach(([k, v]) => {
      if (v !== undefined && v !== '') queryParams.append(k, v);
    });

    const queryString = queryParams.toString();
    const targetUrl = `${activeEp.path}${queryString ? '?' + queryString : ''}`;

    try {
      const res = await fetch(targetUrl);
      const data = await res.json();
      const endTime = performance.now();
      
      setLatency(Math.round(endTime - startTime));
      setResponseView(data);
    } catch (err) {
      setResponseView({ status: false, error: err.message });
      setLatency(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!responseView) return;
    navigator.clipboard.writeText(JSON.stringify(responseView, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="container">
      {/* Top Navbar */}
      <header className="navbar glass-panel">
        <div className="brand">
          <div className="avatar">D</div>
          <div>
            <div className="brand-title">DINSTORE</div>
            <div className="brand-sub">ENGINE 3.0.0</div>
          </div>
        </div>
        <div className="online-badge">
          <span className="pulse-dot"></span> CONNECTED
        </div>
      </header>

      {/* Hero Terminal Card */}
      <section className="hero">
        <div className="terminal-pill">
          <span>●</span> CLOUD GATEWAY ACTIVE
        </div>
        <h1 className="hero-title">
          DINSTORE <span className="glow-version">v3.0.0</span>
        </h1>
        <p className="hero-desc">
          High-performance unified API portal and developer testing environment.
        </p>

        {/* Counter Stats */}
        <div className="stats-grid">
          <div className="stat-item glass-panel">
            <span className="stat-label">MODULES</span>
            <span className="stat-value">{MODULES.length}</span>
          </div>
          <div className="stat-item glass-panel">
            <span className="stat-label">ENDPOINTS</span>
            <span className="stat-value">{totalEndpoints}</span>
          </div>
          <div className="stat-item glass-panel">
            <span className="stat-label">LATENCY</span>
            <span className="stat-value neon-green">{latency ? `${latency}ms` : 'Ready'}</span>
          </div>
        </div>
      </section>

      {/* Search Input Bar */}
      <div className="search-wrapper">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input
          type="text"
          placeholder="Type to filter endpoint or query..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Filter Pills */}
      <div className="filter-pills">
        {['ALL', 'AI', 'DOWNLOAD', 'TOOLS'].map((tag) => (
          <button
            key={tag}
            className={`filter-btn ${selectedTag === tag ? 'active' : ''}`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Endpoint Accordion Modules */}
      {MODULES.filter((m) => selectedTag === 'ALL' || m.id === selectedTag).map((m, idx) => {
        const isOpen = openModule === m.id;
        const filteredEps = m.endpoints.filter(
          (e) =>
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.path.toLowerCase().includes(search.toLowerCase())
        );

        if (search && filteredEps.length === 0) return null;

        return (
          <div key={m.id} className="module-block glass-panel">
            <div className="module-header" onClick={() => setOpenModule(isOpen ? null : m.id)}>
              <div className="module-meta">
                <span className="module-icon">{m.icon}</span>
                <div>
                  <span className="module-code">LAYER {String(idx + 1).padStart(2, '0')}</span>
                  <h3>{m.name}</h3>
                </div>
              </div>
              <span className="module-badge">{filteredEps.length} EP {isOpen ? '▲' : '▼'}</span>
            </div>

            {isOpen && (
              <div className="module-content">
                {filteredEps.map((ep) => {
                  const isSelected = activeEp?.path === ep.path;
                  return (
                    <div key={ep.path} className="endpoint-item">
                      <div className="endpoint-header" onClick={() => handleSelectEp(ep)}>
                        <div className="endpoint-left">
                          <span className="method-tag">{ep.method}</span>
                          <div>
                            <div className="ep-title">{ep.name}</div>
                            <div className="ep-route">{ep.path}</div>
                          </div>
                        </div>
                        <span style={{ color: 'var(--text-dim)' }}>{isSelected ? '✕' : '+'}</span>
                      </div>

                      {isSelected && (
                        <form onSubmit={executeApi} className="ep-playground">
                          {ep.params.map((p) => (
                            <div key={p.key} className="form-row">
                              <label>{p.key}</label>
                              {p.key === 'model' ? (
                                <select
                                  value={formParams[p.key] || 'gpt-4o-mini'}
                                  onChange={(e) => handleParamChange(p.key, e.target.value)}
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
                                  value={formParams[p.key] || 'ESV'}
                                  onChange={(e) => handleParamChange(p.key, e.target.value)}
                                >
                                  <option value="ESV">ESV (English Standard Version)</option>
                                  <option value="NIV">NIV (New International Version)</option>
                                  <option value="KJV">KJV (King James Version)</option>
                                  <option value="TB">TB (Terjemahan Baru)</option>
                                </select>
                              ) : p.key === 'message' || p.key === 'question' || p.key === 'prompt' || p.key === 'text' ? (
                                <textarea
                                  rows="2"
                                  value={formParams[p.key] || ''}
                                  onChange={(e) => handleParamChange(p.key, e.target.value)}
                                  required
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={formParams[p.key] || ''}
                                  onChange={(e) => handleParamChange(p.key, e.target.value)}
                                  required={p.key === 'url' || p.key === 'number' || p.key === 'domain'}
                                />
                              )}
                            </div>
                          ))}
                          <button type="submit" disabled={loading} className="btn-glow-submit">
                            {loading ? 'TRANSMITTING REQUEST...' : 'DISPATCH ENDPOINT →'}
                          </button>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Terminal View Output */}
      {responseView && (
        <section className="terminal-viewer">
          <div className="terminal-header">
            <div className="term-badges">
              <span>RESPONSE STREAM</span>
              {latency && <span className="latency-tag">{latency}ms</span>}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={copyToClipboard} className="btn-term-action">
                {copied ? 'COPIED!' : 'COPY'}
              </button>
              <button onClick={() => setResponseView(null)} className="btn-term-action">✕</button>
            </div>
          </div>
          <pre>{JSON.stringify(responseView, null, 2)}</pre>
        </section>
      )}
    </div>
  );
}
