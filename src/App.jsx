import { useState } from 'react';

// Daftar 13 Modul lengkap
const MODULES = [
  {
    id: 'M01',
    name: 'AI',
    path: '/docs/ai',
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
    id: 'M02',
    name: 'ADMIN',
    path: '/docs/admin',
    endpoints: [
      { name: 'Admin Stats', path: '/api/admin/stats', method: 'GET', desc: 'Get server diagnostic metrics.', params: [] },
      { name: 'Server Health', path: '/api/admin/health', method: 'GET', desc: 'Check subsystem operational health.', params: [] },
      { name: 'Clear Logs', path: '/api/admin/logs', method: 'GET', desc: 'Flush active server runtime logs.', params: [] }
    ]
  },
  {
    id: 'M03',
    name: 'CACHE',
    path: '/docs/cache',
    endpoints: [
      { name: 'Get Cache', path: '/api/cache/get', method: 'GET', desc: 'Retrieve item from temporary memory store.', params: [{ key: 'key', label: 'KEY', required: true, default: 'test_key' }] },
      { name: 'Flush Cache', path: '/api/cache/flush', method: 'GET', desc: 'Clear all active memory keys.', params: [] }
    ]
  },
  {
    id: 'M04',
    name: 'DOWNLOAD',
    path: '/docs/download',
    endpoints: [
      {
        name: 'CapCut Video',
        path: '/api/download/capcut',
        method: 'GET',
        desc: 'Retrieve metadata for a CapCut video.',
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
    id: 'M05',
    name: 'FUN',
    path: '/docs/fun',
    endpoints: [
      { name: 'Random Joke', path: '/api/fun/joke', method: 'GET', desc: 'Retrieve a random tech/general joke.', params: [] },
      { name: 'Meme Generator', path: '/api/fun/meme', method: 'GET', desc: 'Fetch viral trending meme template.', params: [] },
      { name: 'Quote of Day', path: '/api/fun/quote', method: 'GET', desc: 'Get daily motivational programming quote.', params: [] }
    ]
  },
  {
    id: 'M06',
    name: 'LEADERBOARD',
    path: '/docs/leaderboard',
    endpoints: [
      { name: 'Top Users', path: '/api/leaderboard/top', method: 'GET', desc: 'Fetch top active API consumers ranking.', params: [] }
    ]
  },
  {
    id: 'M07',
    name: 'LIBRARY',
    path: '/docs/library',
    endpoints: [
      { name: 'Book Search', path: '/api/library/search', method: 'GET', desc: 'Search open-source programming books.', params: [{ key: 'q', label: 'QUERY', required: true, default: 'javascript' }] },
      { name: 'Article Feed', path: '/api/library/articles', method: 'GET', desc: 'Get latest tech literature feeds.', params: [] },
      { name: 'Glossary Lookup', path: '/api/library/glossary', method: 'GET', desc: 'Define tech terms.', params: [{ key: 'term', label: 'TERM', required: true, default: 'API' }] }
    ]
  },
  {
    id: 'M08',
    name: 'MAKER',
    path: '/docs/maker',
    endpoints: [
      { name: 'QR Code Generator', path: '/api/maker/qr', method: 'GET', desc: 'Generate custom QR code image payload.', params: [{ key: 'text', label: 'TEXT', required: true, default: 'https://dinn.my.id' }] },
      { name: 'Badge Generator', path: '/api/maker/badge', method: 'GET', desc: 'Create custom markdown shields badge.', params: [{ key: 'label', label: 'LABEL', required: true, default: 'status' }, { key: 'message', label: 'MESSAGE', required: true, default: 'online' }] }
    ]
  },
  {
    id: 'M09',
    name: 'NEWS',
    path: '/docs/news',
    endpoints: [
      { name: 'Detik News', path: '/api/news/detik', method: 'GET', desc: 'Latest breaking headlines from Detikcom.', params: [] },
      { name: 'Tech Crunch', path: '/api/news/tech', method: 'GET', desc: 'Global technology updates.', params: [] },
      { name: 'Crypto Bulletin', path: '/api/news/crypto', method: 'GET', desc: 'Real-time cryptocurrency bulletin.', params: [] },
      { name: 'RSS Stream', path: '/api/news/rss', method: 'GET', desc: 'Custom RSS parser feed.', params: [{ key: 'url', label: 'RSS URL', required: true, default: 'https://rss.cnn.com/rss/edition.rss' }] }
    ]
  },
  {
    id: 'M10',
    name: 'RANDOM',
    path: '/docs/random',
    endpoints: [
      { name: 'Random Number', path: '/api/random/number', method: 'GET', desc: 'Generate cryptographic random digit.', params: [{ key: 'max', label: 'MAX', required: false, default: '100' }] },
      { name: 'Random String', path: '/api/random/string', method: 'GET', desc: 'Generate secure random hash string.', params: [{ key: 'length', label: 'LENGTH', required: false, default: '16' }] }
    ]
  },
  {
    id: 'M11',
    name: 'SEARCH',
    path: '/docs/search',
    endpoints: [
      { name: 'Web Search', path: '/api/search/web', method: 'GET', desc: 'Query open web indices.', params: [{ key: 'query', label: 'QUERY', required: true, default: 'latest AI trends' }] },
      { name: 'Image Search', path: '/api/search/image', method: 'GET', desc: 'Find public domain pictures.', params: [{ key: 'q', label: 'KEYWORD', required: true, default: 'cyberpunk city' }] }
    ]
  },
  {
    id: 'M12',
    name: 'STALK',
    path: '/docs/stalk',
    endpoints: [
      { name: 'GitHub Stalker', path: '/api/stalk/github', method: 'GET', desc: 'Retrieve public GitHub user telemetry.', params: [{ key: 'username', label: 'USERNAME', required: true, default: 'torvalds' }] },
      { name: 'NPM Stalker', path: '/api/stalk/npm', method: 'GET', desc: 'Inspect NPM package registry stats.', params: [{ key: 'package', label: 'PACKAGE', required: true, default: 'react' }] }
    ]
  },
    {
    id: 'M13',
    name: 'TOOLS',
    path: '/docs/tools',
    endpoints: [
      { 
        name: 'Pinterest Search', 
        path: '/api/tools/pinterest', 
        method: 'GET', 
        desc: 'Cari gambar dan stok foto beresolusi tinggi dari Pinterest.', 
        params: [{ key: 'query', label: 'QUERY', required: true, default: 'albert wesker' }] 
      },
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
      }
    ]
  }


export default function App() {
  const [filter, setFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Diubah menjadi objek kosong agar semuanya tertutup secara default
  const [openModules, setOpenModules] = useState({});
  const [activeEp, setActiveEp] = useState(null);
  const [inputs, setInputs] = useState({});
  const [runs, setRuns] = useState({});
  const [activeTab, setActiveTab] = useState('PREVIEW');
  const [copiedPath, setCopiedPath] = useState(null);

  const totalEndpoints = MODULES.reduce((acc, m) => acc + m.endpoints.length, 0);

  const toggleModule = (id) => {
    setOpenModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleEndpoint = (ep) => {
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
          headers: { 'content-type': res.headers.get('content-type') || 'application/json' },
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
      {/* Sidebar Navigation Drawer */}
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>}
      <aside className={`sidebar-drawer ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-head">
          <div className="sidebar-title-group">
            <span className="sidebar-nav-lbl">NAVIGATION</span>
            <span className="sidebar-brand-lbl">DINSTORE API</span>
          </div>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <div className="sidebar-menu-list">
          <div className="sidebar-item active">
            <span className="s-icon">🏠</span>
            <span className="s-name">HOME</span>
            <span className="s-num">00</span>
          </div>
          {MODULES.map((m, idx) => (
            <div
              key={m.id}
              className="sidebar-item"
              onClick={() => {
                setOpenModules((prev) => ({ ...prev, [m.id]: true }));
                setSidebarOpen(false);
              }}
            >
              <span className="s-icon">
                {idx === 0 ? '✦' : idx === 1 ? '◆' : idx === 2 ? '▣' : idx === 3 ? '⬇' : idx === 4 ? '🎮' : idx === 5 ? '🏆' : idx === 6 ? '📚' : idx === 7 ? '🎨' : idx === 8 ? '📰' : idx === 9 ? '❖' : idx === 10 ? '🔍' : idx === 11 ? '◉' : '⌘'}
              </span>
              <span className="s-name">{m.name}</span>
              <span className="s-num">{String(idx + 1).padStart(2, '0')}</span>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <span className="sys-status-label">SYSTEM STATUS</span>
          <span className="sys-status-val">● OPERATIONAL</span>
        </div>
      </aside>

      <div className="main-viewport">
        {/* Navbar Atas */}
        <header className="header-bar">
          <div className="brand-left">
            <button className="menu-burger-btn" onClick={() => setSidebarOpen(true)}>
              ☰
            </button>
            <div className="avatar-d">D</div>
            <div className="brand-texts">
              <span className="brand-title">DINSTORE</span>
              <span className="brand-subtitle">API SYSTEM</span>
            </div>
          </div>
          <div className="online-pill">
            <span className="live-spark"></span> ONLINE
          </div>
        </header>

        {/* Hero Section Banner */}
        <section className="hero-terminal-box">
          <div className="terminal-badge">
            <span className="live-spark"></span> TERMINAL ACTIVE
          </div>
          <h1 className="hero-main-title">
            DINSTORE <span className="version-pill">3.0.0</span>
          </h1>
          <p className="hero-subtext">
            A comprehensive and user friendly API solution for modern applications.
          </p>

          <div className="stats-metric-grid">
            <div className="stat-card-box">
              <span className="stat-label-box">CATEGORIES</span>
              <span className="stat-val-box">{MODULES.length}</span>
            </div>
            <div className="stat-card-box">
              <span className="stat-label-box">ENDPOINTS</span>
              <span className="stat-val-box">{totalEndpoints}</span>
            </div>
            <div className="stat-card-box">
              <span className="stat-label-box">STATUS</span>
              <span className="stat-val-box green">ONLINE</span>
            </div>
          </div>
        </section>

        {/* Search Bar Filter */}
        <div className="filter-block">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="SEARCH ENDPOINT / CATEGORY..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        {/* Daftar Modul */}
        <div className="modules-stack">
          {MODULES.map((mod, idx) => {
            const isOpenMod = !!openModules[mod.id];
            const filteredEps = mod.endpoints.filter(
              (e) =>
                e.name.toLowerCase().includes(filter.toLowerCase()) ||
                e.path.toLowerCase().includes(filter.toLowerCase())
            );

            if (filter && filteredEps.length === 0) return null;

            return (
              <div key={mod.id} className="module-group-card">
                <div className="module-card-head" onClick={() => toggleModule(mod.id)}>
                  <div className="mod-head-left">
                    <div className="mod-icon-badge">
                      {idx === 0 ? '✦' : idx === 1 ? '◆' : idx === 2 ? '▣' : idx === 3 ? '⬇' : idx === 4 ? '🎮' : idx === 5 ? '🏆' : idx === 6 ? '📚' : idx === 7 ? '🎨' : idx === 8 ? '📰' : idx === 9 ? '❖' : idx === 10 ? '🔍' : idx === 11 ? '◉' : '⌘'}
                    </div>
                    <div>
                      <span className="mod-num-label">MODULE {String(idx + 1).padStart(2, '0')}</span>
                      <div className="mod-name-label">{mod.name}</div>
                      <span className="mod-ep-count">{mod.endpoints.length} ENDPOINTS</span>
                    </div>
                  </div>
                  <div className="mod-head-right">
                    <span className="path-text-dim">PATH {mod.path}</span>
                    <span className="open-close-txt">{isOpenMod ? 'CLOSE ↑' : 'OPEN →'}</span>
                  </div>
                </div>

                {/* Daftar Endpoints di dalam Modul */}
                {isOpenMod && (
                  <div className="endpoints-drawer-list">
                    {filteredEps.map((ep) => {
                      const isEpOpen = activeEp === ep.path;
                      const r = runs[ep.path] || {};
                      const curVals = inputs[ep.path] || {};

                      return (
                        <div key={ep.path} className={`ep-mini-card ${isEpOpen ? 'active' : ''}`}>
                          <div className="ep-mini-head" onClick={() => toggleEndpoint(ep)}>
                            <div className="ep-mini-info">
                              <span className="get-badge-green">{ep.method}</span>
                              <span className="ep-name-title">{ep.name}</span>
                              <span className="ep-route-sub">{ep.path}</span>
                            </div>
                            <span className="ep-plus-sign">{isEpOpen ? '−' : '+'}</span>
                          </div>

                          {isEpOpen && (
                            <div className="ep-playground-box">
                              <p className="ep-desc-txt">{ep.desc}</p>

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

                              {/* Response Box JSON */}
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
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
