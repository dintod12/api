import { useState, useEffect } from 'react';

const STORE_KEY = 'dinstore_data_history';

const MODULES = [
  {
    id: 'M01',
    name: 'AI',
    path: '/api/ai',
    endpoints: [
      {
        name: 'AI Duckai',
        path: '/api/ai/duckai',
        method: 'GET',
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
        params: [
          { key: 'question', default: 'What is faith?' },
          { key: 'translation', default: 'ESV' }
        ]
      },
      {
        name: 'Flixier AI Image',
        path: '/api/ai/flixier',
        method: 'GET',
        params: [{ key: 'prompt', default: 'cyberpunk neon warrior' }]
      },
      {
        name: 'AI Lyrics Generator',
        path: '/api/ai/lyricsgen',
        method: 'GET',
        params: [{ key: 'title', default: 'Cyberpunk night' }]
      },
      {
        name: 'AI Chat (ai4chat)',
        path: '/api/ai/ai4chat',
        method: 'GET',
        params: [{ key: 'message', default: 'Hello AI' }]
      }
    ]
  },
  {
    id: 'M02',
    name: 'DOWNLOAD',
    path: '/api/download',
    endpoints: [
      {
        name: 'TikTok Downloader',
        path: '/api/download/tiktok',
        method: 'GET',
        params: [{ key: 'url', default: 'https://vt.tiktok.com/' }]
      },
      {
        name: 'Instagram Media',
        path: '/api/download/instagram',
        method: 'GET',
        params: [{ key: 'url', default: 'https://www.instagram.com/p/' }]
      },
      {
        name: 'CapCut Video',
        path: '/api/download/capcut',
        method: 'GET',
        params: [{ key: 'url', default: 'https://www.capcut.com/template-detail/' }]
      },
      {
        name: 'DramaBox Streaming',
        path: '/api/download/dramabox',
        method: 'GET',
        params: [{ key: 'url', default: '' }]
      }
    ]
  },
  {
    id: 'M03',
    name: 'TOOLS & NEWS',
    path: '/api/tools',
    endpoints: [
      {
        name: 'AI Coder',
        path: '/api/tools/aicoder',
        method: 'GET',
        params: [{ key: 'text', default: 'bubble sort in python' }]
      },
      {
        name: 'Checker Ban WA',
        path: '/api/tools/checker-ban-wa',
        method: 'GET',
        params: [{ key: 'number', default: '628123456789' }]
      },
      {
        name: 'Domain Info',
        path: '/api/tools/domaininfo',
        method: 'GET',
        params: [{ key: 'domain', default: 'google.com' }]
      },
      {
        name: 'Detik News',
        path: '/api/news/detik',
        method: 'GET',
        params: []
      }
    ]
  }
];

export default function App() {
  const [search, setSearch] = useState('');
  const [openModule, setOpenModule] = useState('M01');
  const [activeEp, setActiveEp] = useState(null);
  const [formParams, setFormParams] = useState({});
  const [responseView, setResponseView] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [vault, setVault] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) {
      try {
        setVault(JSON.parse(saved));
      } catch {
        setVault([]);
      }
    }
  }, []);

  const totalEndpoints = MODULES.reduce((acc, curr) => acc + curr.endpoints.length, 0);

  const handleSelectEp = (ep) => {
    if (activeEp?.path === ep.path) {
      setActiveEp(null);
      return;
    }
    setActiveEp(ep);
    const initialParams = {};
    ep.params.forEach((p) => {
      initialParams[p.key] = p.default;
    });
    setFormParams(initialParams);
  };

  const handleParamChange = (key, value) => {
    setFormParams((prev) => ({ ...prev, [key]: value }));
  };

  const executeApi = async (e) => {
    e.preventDefault();
    setLoading(true);

    const queryParams = new URLSearchParams();
    Object.entries(formParams).forEach(([k, v]) => {
      if (v !== undefined && v !== '') queryParams.append(k, v);
    });

    const queryString = queryParams.toString();
    const targetUrl = `${activeEp.path}${queryString ? '?' + queryString : ''}`;

    try {
      const res = await fetch(targetUrl);
      const data = await res.json();
      setResponseView(data);

      const entry = {
        id: Date.now(),
        name: activeEp.name,
        path: activeEp.path,
        time: new Date().toLocaleTimeString(),
        data
      };
      const updatedVault = [entry, ...vault];
      setVault(updatedVault);
      localStorage.setItem(STORE_KEY, JSON.stringify(updatedVault));
    } catch (err) {
      setResponseView({ status: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!responseView) return;
    navigator.clipboard.writeText(JSON.stringify(responseView, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const clearStorage = () => {
    localStorage.removeItem(STORE_KEY);
    setVault([]);
    setResponseView(null);
  };

  return (
    <div className="container">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="brand">
          <div className="avatar">D</div>
          <div>
            <div className="brand-title">DINSTORE</div>
            <div className="brand-sub">API SYSTEM</div>
          </div>
        </div>
        <div className="online-badge">
          <span className="dot"></span> ONLINE
        </div>
      </header>

      {/* Hero Stats Section */}
      <div className="hero">
        <div className="pill">
          <span className="dot"></span> TERMINAL ACTIVE
        </div>
        <h1 className="hero-title">
          DINSTORE <span className="version">3.0.0</span>
        </h1>
        <p className="hero-desc">
          A comprehensive and user friendly API solution for modern applications.
        </p>

        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">CATEGORIES</span>
            <span className="stat-value">{MODULES.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">ENDPOINTS</span>
            <span className="stat-value">{totalEndpoints}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">STATUS</span>
            <span className="stat-value green">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="SEARCH ENDPOINT / CATEGORY..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Modules List */}
      {MODULES.map((m, idx) => {
        const isOpen = openModule === m.id;
        const filteredEps = m.endpoints.filter(
          (e) =>
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.path.toLowerCase().includes(search.toLowerCase())
        );

        if (search && filteredEps.length === 0) return null;

        return (
          <div key={m.id} className="module-card">
            <div className="module-header" onClick={() => setOpenModule(isOpen ? null : m.id)}>
              <div className="module-info">
                <span className="icon-diamond">◆</span>
                <div>
                  <span className="module-tag">MODULE {String(idx + 1).padStart(2, '0')}</span>
                  <h3>{m.name}</h3>
                  <span className="module-sub">{m.endpoints.length} ENDPOINTS</span>
                </div>
              </div>
              <span className="toggle-btn">{isOpen ? 'CLOSE ↑' : 'OPEN ↓'}</span>
            </div>

            {isOpen && (
              <div className="module-body">
                <div className="path-label">
                  PATH: <code>{m.path}</code>
                </div>

                {filteredEps.map((ep) => {
                  const isSelected = activeEp?.path === ep.path;
                  return (
                    <div key={ep.path} className="endpoint-item">
                      <div className="endpoint-header" onClick={() => handleSelectEp(ep)}>
                        <div className="endpoint-title">
                          <span className="badge-get">{ep.method}</span>
                          <span className="ep-name">{ep.name}</span>
                          <span className="ep-path">{ep.path}</span>
                        </div>
                        <span className="expand-icon">{isSelected ? '−' : '+'}</span>
                      </div>

                      {isSelected && (
                        <form onSubmit={executeApi} className="playground-box">
                          {ep.params.map((p) => (
                            <div key={p.key} className="form-field">
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
                          <button type="submit" disabled={loading} className="btn-run">
                            {loading ? 'EXECUTING...' : 'RUN REQUEST'}
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

      {/* Terminal View Response */}
      {responseView && (
        <div className="terminal-viewer">
          <div className="terminal-header">
            <span>JSON TERMINAL RESPONSE</span>
            <div className="terminal-actions">
              <button onClick={copyToClipboard} className="btn-copy">
                {copied ? 'COPIED!' : 'COPY'}
              </button>
              <button onClick={() => setResponseView(null)} className="btn-close-term">✕</button>
            </div>
          </div>
          <pre>{JSON.stringify(responseView, null, 2)}</pre>
        </div>
      )}

      {/* Persistent Vault / History */}
      <div className="module-card">
        <div className="module-header">
          <div className="module-info">
            <span className="icon-diamond red">◆</span>
            <div>
              <span className="module-tag">LOCAL DINSTORE</span>
              <h3>Stored History</h3>
              <span className="module-sub">{vault.length} ITEMS SAVED</span>
            </div>
          </div>
          {vault.length > 0 && (
            <button className="clear-btn" onClick={clearStorage}>WIPE</button>
          )}
        </div>
        <div className="history-list">
          {vault.length === 0 ? (
            <div className="empty-hint">Belum ada response yang disimpan ke vault</div>
          ) : (
            vault.map((item) => (
              <div key={item.id} className="history-item" onClick={() => setResponseView(item.data)}>
                <span className="badge-get">SAVED</span>
                <span className="h-name">{item.name}</span>
                <span className="h-time">{item.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
