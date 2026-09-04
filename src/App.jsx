import { useState, useEffect, useRef } from 'react';

const MODULES = [
  {
    id: 'TRANSFORMER_CORE',
    name: 'MATRIX // MECHA CORE (AI)',
    endpoints: [
      {
        name: 'AUTOBOT AI // DUCKAI',
        path: '/api/ai/duckai',
        method: 'GET',
        desc: 'Core neural computation unit across multi-tier LLM architecture.',
        params: [
          { key: 'message', label: 'TRANSMISSION', required: true, default: 'What is the meaning of life?' },
          { key: 'model', label: 'NEURAL CORE', required: false, default: 'gpt-4o-mini' },
          { key: 'systemPrompt', label: 'DIRECTIVE', required: false, default: 'You are an advanced Transformer AI' }
        ]
      },
      {
        name: 'ORACLE SCROLL // BIBLE AI',
        path: '/api/ai/bibleai',
        method: 'GET',
        desc: 'Sacred text archive decoder and contextual scriptural analyzer.',
        params: [
          { key: 'question', label: 'QUERY SCRIPTURE', required: true, default: 'What is faith?' },
          { key: 'translation', label: 'CODEX TRANSLATION', required: false, default: 'ESV' }
        ]
      },
      {
        name: 'HOLO MATRIX // FLIXIER',
        path: '/api/ai/flixier',
        method: 'GET',
        desc: 'Holographic optical neural reconstruction via prompt parameters.',
        params: [{ key: 'prompt', label: 'RENDER MATRIX', required: true, default: 'Optimus mecha robot metallic glowing red eyes' }]
      }
    ]
  },
  {
    id: 'TELEMETRY_EXTRACTION',
    name: 'INTERCEPTOR // DOWNLOADERS',
    endpoints: [
      {
        name: 'CAPCUT // VECTOR RIPPER',
        path: '/api/download/capcut',
        method: 'GET',
        desc: 'Extract visual frames and raw rendering metadata streams.',
        params: [{ key: 'url', label: 'TARGET LINK', required: true, default: 'https://www.capcut.com/' }]
      },
      {
        name: 'TIKTOK // SIGNAL INTERCEPT',
        path: '/api/download/tiktok',
        method: 'GET',
        desc: 'Bypass sensory watermarks and stream direct MP4 data packets.',
        params: [{ key: 'url', label: 'PAYLOAD STREAM', required: true, default: 'https://vt.tiktok.com/' }]
      },
      {
        name: 'INSTAGRAM // MEDIA EXTRACTION',
        path: '/api/download/instagram',
        method: 'GET',
        desc: 'Scrape edge media nodes across distributed server nets.',
        params: [{ key: 'url', label: 'NETWORK NODE', required: true, default: 'https://www.instagram.com/p/' }]
      }
    ]
  },
  {
    id: 'CYBER_TOOLS',
    name: 'CYBERNETIC // SYSTEM UTILS',
    endpoints: [
      {
        name: 'CODE FORGE // AI CODER',
        path: '/api/tools/aicoder',
        method: 'GET',
        desc: 'Autonomous logic compiler and algorithm optimizer.',
        params: [{ key: 'text', label: 'ALGORITHM SPEC', required: true, default: 'binary search tree in rust' }]
      },
      {
        name: 'FIREWALL // WA SCANNER',
        path: '/api/tools/checker-ban-wa',
        method: 'GET',
        desc: 'Proactive cellular node validator and ban telemetry checker.',
        params: [{ key: 'number', label: 'SIGNAL IDENTIFIER', required: true, default: '628123456789' }]
      },
      {
        name: 'GRID SCANNER // DOMAIN INFO',
        path: '/api/tools/domaininfo',
        method: 'GET',
        desc: 'Full IP route mapping and WHOIS structural analysis.',
        params: [{ key: 'domain', label: 'IP ROUTE', required: true, default: 'google.com' }]
      }
    ]
  }
];

// Komponen Background Partikel Kotak-Kotak (Cyber Cube Matrix)
function TransformerCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generator partikel kotak (cubes)
    const cubes = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 20 + 8,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      rot: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.5 + 0.15,
      hue: Math.random() > 0.5 ? 190 : 25 // Variasi warna Cyan & Transformer Amber
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      cubes.forEach((cube) => {
        cube.x += cube.speedX;
        cube.y += cube.speedY;
        cube.rot += cube.rotSpeed;

        if (cube.x < -30) cube.x = canvas.width + 30;
        if (cube.x > canvas.width + 30) cube.x = -30;
        if (cube.y < -30) cube.y = canvas.height + 30;
        if (cube.y > canvas.height + 30) cube.y = -30;

        ctx.save();
        ctx.translate(cube.x, cube.y);
        ctx.rotate(cube.rot);

        // Render kotak sci-fi bertingkat
        ctx.strokeStyle = `hsla(${cube.hue}, 100%, 50%, ${cube.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(-cube.size / 2, -cube.size / 2, cube.size, cube.size);

        // Inti titik holografik di dalam kotak
        ctx.fillStyle = `hsla(${cube.hue}, 100%, 70%, ${cube.opacity * 0.7})`;
        ctx.fillRect(-2, -2, 4, 4);

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="transformer-bg-canvas" />;
}

export default function App() {
  const [filterText, setFilterText] = useState('');
  const [activeEpPath, setActiveEpPath] = useState('/api/ai/duckai');
  const [formInputs, setFormInputs] = useState({
    '/api/ai/duckai': { message: 'What is the meaning of life?' }
  });
  const [executionState, setExecutionState] = useState({});
  const [activeTab, setActiveTab] = useState('PREVIEW');
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

  const handleExecute = async (ep) => {
    const currentParams = formInputs[ep.path] || {};
    const queryParams = new URLSearchParams();
    Object.entries(currentParams).forEach(([k, v]) => {
      if (v !== undefined && v !== '') queryParams.append(k, v);
    });

    const targetUrl = `${ep.path}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

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
            protocol: 'CYBER-HTTP/2.0'
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

  const copyJson = (data) => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 1500);
  };

  return (
    <div className="mecha-viewport">
      <TransformerCanvas />

      <div className="mecha-interface">
        {/* HUD Top Bar */}
        <header className="mecha-navbar">
          <div className="hud-corner-tl"></div>
          <div className="hud-corner-tr"></div>

          <div className="mecha-brand">
            <div className="mecha-emblem">⬡</div>
            <div>
              <div className="mecha-title">DINSTORE // MECHATRON</div>
              <div className="mecha-sub">SYSTEM STATE: ARMED // QUANTUM ENGINE 4.0</div>
            </div>
          </div>

          <div className="mecha-status-block">
            <span className="spark-box"></span> CORE ONLINE
          </div>
        </header>

        {/* Tactical Search Filter */}
        <div className="hud-search-shell">
          <span className="hud-tag">TARGET_SCAN:</span>
          <input
            type="text"
            placeholder="SCAN CIPHER / PROTOCOL PATH..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        {/* Modules Stream */}
        <div className="hud-stream">
          {MODULES.map((module) => {
            const filteredEps = module.endpoints.filter(
              (e) =>
                e.name.toLowerCase().includes(filterText.toLowerCase()) ||
                e.path.toLowerCase().includes(filterText.toLowerCase())
            );

            if (filterText && filteredEps.length === 0) return null;

            return (
              <div key={module.id} className="hud-module-unit">
                <div className="module-banner">
                  <span className="bracket-left">[</span>
                  <span>{module.name}</span>
                  <span className="bracket-right">]</span>
                  <span className="ep-counter">{filteredEps.length} NODES</span>
                </div>

                <div className="endpoint-collection">
                  {filteredEps.map((ep) => {
                    const isOpen = activeEpPath === ep.path;
                    const exec = executionState[ep.path] || {};
                    const currentVals = formInputs[ep.path] || {};

                    return (
                      <div key={ep.path} className={`mecha-card ${isOpen ? 'active-slot' : ''}`}>
                        <div className="card-click-zone" onClick={() => toggleEndpoint(ep)}>
                          <div className="ep-badge-wrap">
                            <span className="mecha-badge">{ep.method}</span>
                            <span className="ep-route">{ep.path}</span>
                            <span className="ep-alias">{ep.name}</span>
                          </div>
                          <span className="hud-chevron">{isOpen ? '▲' : '▼'}</span>
                        </div>

                        {/* Playground Drawer */}
                        {isOpen && (
                          <div className="mecha-drawer">
                            <p className="mecha-desc">// {ep.desc}</p>

                            <div className="input-matrix">
                              {ep.params.map((p) => (
                                <div key={p.key} className="matrix-field">
                                  <label>
                                    ▶ {p.label} {p.required && <span className="neon-star">*</span>}
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
                                      <option value="ESV">ESV (ENGLISH STANDARD VERSION)</option>
                                      <option value="NIV">NIV (NEW INTERNATIONAL VERSION)</option>
                                      <option value="KJV">KJV (KING JAMES VERSION)</option>
                                      <option value="TB">TB (INDONESIAN TERJEMAHAN BARU)</option>
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

                            {/* Execute Beam Button */}
                            <button
                              type="button"
                              className="btn-mecha-execute"
                              disabled={exec.loading}
                              onClick={() => handleExecute(ep)}
                            >
                              <span className="btn-glow-bar"></span>
                              {exec.loading ? 'COMPUTING QUANTUM THREAD...' : 'EXECUTE NEURAL TRANSMISSION ⚡'}
                            </button>

                            {/* Inline Result Terminal View */}
                            {exec.data && (
                              <div className="mecha-terminal">
                                <div className="term-hud-top">
                                  <div className="term-tabs">
                                    <button
                                      className={`term-tab ${activeTab === 'PREVIEW' ? 'active' : ''}`}
                                      onClick={() => setActiveTab('PREVIEW')}
                                    >
                                      TELEMETRY PREVIEW
                                    </button>
                                    <button
                                      className={`term-tab ${activeTab === 'HEADERS' ? 'active' : ''}`}
                                      onClick={() => setActiveTab('HEADERS')}
                                    >
                                      HEADERS
                                    </button>
                                  </div>

                                  <div className="term-ctrls">
                                    {/* Copy Button */}
                                    <button
                                      className="btn-copy-cube"
                                      title="Copy Matrix JSON"
                                      onClick={() => copyJson(exec.data)}
                                    >
                                      {copyStatus ? 'COPIED ✓' : 'COPY JSON ⧉'}
                                    </button>

                                    <span className={`hud-badge-status ${exec.status === 200 ? 'status-ok' : 'status-err'}`}>
                                      [{exec.status} {exec.status === 200 ? 'OK' : 'ERR'}]
                                    </span>
                                    {exec.latency && <span className="hud-latency">{exec.latency}ms</span>}
                                  </div>
                                </div>

                                <div className="term-hud-screen">
                                  {activeTab === 'PREVIEW' ? (
                                    <pre className="matrix-code green">
                                      {JSON.stringify(exec.data, null, 2)}
                                    </pre>
                                  ) : (
                                    <pre className="matrix-code cyan">
                                      {JSON.stringify(exec.headers, null, 2)}
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
