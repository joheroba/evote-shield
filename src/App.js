import React, { useState, useEffect } from "react";

/**
 * E-VOTE SHIELD: PROMO SLIDESHOW (CORPORATE & RESPONSIVE VERSION)
 * Enfoque: Transparencia, Seguridad, Respaldo Corporativo.
 */

const slides = [
  { id: 1, component: "SlideTitle", theme: "light" },
  { id: 2, component: "SlideDiagnostico", theme: "dark" },
  { id: 3, component: "SlideSolucion", theme: "light" },
  { id: 4, component: "SlideTecnologia", theme: "dark" },
  { id: 5, component: "SlidePilar1", theme: "light" },
  { id: 6, component: "SlideBlindaje", theme: "light" },
  { id: 7, component: "SlideDobleValidacion", theme: "light" },
  { id: 8, component: "SlideAuditoria", theme: "dark" },
  { id: 9, component: "SlidePilar2", theme: "light" },
  { id: 10, component: "SlideMonitor", theme: "dark" },
  { id: 11, component: "SlideAhorro", theme: "light" },
  { id: 12, component: "SlideRegistro", theme: "light" },
  { id: 13, component: "SlideImpacto", theme: "dark" },
  { id: 14, component: "SlideCierre", theme: "light" },
];

// --- ICONS & ANIMATED COMPONENTS ---

function ShieldIcon({ size = 48, animate = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{
      animation: animate ? "pulse-shield 2s infinite ease-in-out" : "none"
    }}>
      <path d="M24 4L6 12V24C6 34.5 14 44 24 46C34 44 42 34.5 42 24V12L24 4Z" fill="#1B6EF3" opacity="0.15" stroke="#1B6EF3" strokeWidth="2"/>
      <path d="M24 4L6 12V24C6 34.5 14 44 24 46C34 44 42 34.5 42 24V12L24 4Z" fill="none" stroke="#1B6EF3" strokeWidth="2.5"/>
      <path d="M16 24L21 29L32 18" stroke="#1B6EF3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function AuthorityIcon({ active = false }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="12" r="6" stroke={active ? "#22C55E" : "#cbd5e1"} strokeWidth="2"/>
      <path d="M10 32C10 26 14 22 20 22C26 22 30 26 30 32" stroke={active ? "#22C55E" : "#cbd5e1"} strokeWidth="2" strokeLinecap="round"/>
      {active && <circle cx="32" cy="12" r="4" fill="#22C55E">
        <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
      </circle>}
    </svg>
  );
}

function ServerIcon({ label, active, color }) {
  return (
    <div style={{ textAlign: "center" }}>
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
        <rect x="5" y="5" width="40" height="12" rx="2" fill={active ? color : "#f1f5f9"} stroke={active ? color : "#cbd5e1"} strokeWidth="2"/>
        <rect x="5" y="19" width="40" height="12" rx="2" fill={active ? color : "#f1f5f9"} stroke={active ? color : "#cbd5e1"} strokeWidth="2"/>
        <rect x="5" y="33" width="40" height="12" rx="2" fill={active ? color : "#f1f5f9"} stroke={active ? color : "#cbd5e1"} strokeWidth="2"/>
      </svg>
      <p style={{ fontSize: "10px", fontWeight: "bold", marginTop: "5px", color: active ? "#1e293b" : "#94a3b8" }}>{label}</p>
    </div>
  );
}

function DAGIconAnimated({ votes = [] }) {
  return (
    <svg width="100%" height="160" viewBox="0 0 320 160" fill="none">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {[
        [40, 80], [100, 40], [100, 120], [180, 60], [180, 100], [260, 40], [260, 80], [260, 120]
      ].map(([x, y], i) => (
        <g key={`node-${i}`}>
          <circle cx={x} cy={y} r="6" fill="#1B6EF3" opacity="0.2"/>
          <circle cx={x} cy={y} r="3" fill="#1B6EF3" opacity="0.4">
            <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" begin={`${i*0.5}s`} />
          </circle>
        </g>
      ))}
      <path d="M40 80 L100 40 M40 80 L100 120 M100 40 L180 60 M100 120 L180 100 M180 60 L260 40 M180 100 L260 120"
            stroke="#1B6EF3" strokeWidth="1" opacity="0.1" />
      {votes.map((v, i) => (
        <g key={`vote-${i}`}>
          <line x1={v.fromX} y1={v.fromY} x2={v.x} y2={v.y} stroke="#22C55E" strokeWidth="2" strokeDasharray="4 2">
             <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.5s" repeatCount="1" />
          </line>
          <circle cx={v.x} cy={v.y} r="8" fill="#22C55E" filter="url(#glow)">
            <animate attributeName="opacity" from="0" to="1" dur="0.3s" />
          </circle>
        </g>
      ))}
    </svg>
  );
}

// --- SLIDES ---

function SlideTitle({ visible }) {
  return (
    <div className="slide-container" style={{
      background: "radial-gradient(circle at top right, #fff 0%, #f2f2f2 100%)",
      textAlign: "center"
    }}>
      <div className="badget-red">PLAN ELECTORAL NACIONAL 2026</div>
      <h1 className="title-bold">DEMOCRACIA<br/><span style={{color: "#E8252A"}}>DIGITAL 3.0</span></h1>
      <div className="divider-red" />
      <p className="subtitle">
        Basado en el marco legal del Art. 176 y 183 de la Constitución.<br/>
        Es momento de <strong>blindar la voluntad popular</strong>.
      </p>
      <div className="scroll-indicator">AUDITORÍA EN TIEMPO REAL ↓</div>
    </div>
  );
}

function SlideDiagnostico({ visible }) {
  return (
    <div className="slide-container" style={{ background: "#111", color: "#fff" }}>
      <p className="label-blue">CONTEXTO</p>
      <h2 className="title-white">¿POR QUÉ<br/>AHORA?</h2>
      <div className="list-item">
        <div className="dot-red-pulse" />
        <div>
          <h3>FIN DEL FRAUDE EN MESA</h3>
          <p>La Tangle (DAG) reemplaza las actas manuales alterables.</p>
        </div>
      </div>
      <div className="list-item">
        <div className="dot-red-pulse" />
        <div>
          <h3>ZERO-TRUST CUSTODIA</h3>
          <p>Trazabilidad criptográfica total desde el DNI al escrutinio.</p>
        </div>
      </div>
      <div className="list-item">
        <div className="dot-red-pulse" />
        <div>
          <h3>RED DESCENTRALIZADA</h3>
          <p>Nodos auditados por JNE, ONPE y Sociedad Civil.</p>
        </div>
      </div>
    </div>
  );
}

function SlideSolucion({ visible }) {
  return (
    <div className="slide-container" style={{ background: "#fff" }}>
      <div className="shield-hero">
        <ShieldIcon size={100} animate={true} />
      </div>
      <h2 className="title-brand">E-VOTE SHIELD</h2>
      <div className="tagline">TECNOLOGÍA RESPALDADA POR LA INDUSTRIA</div>
      
      <div style={{ margin: "20px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Logo QIS con fuente SpaceAge */}
        <div className="qis-logo-container">QIS</div>
        <div style={{ 
          fontSize: "9px", 
          fontWeight: "bold", 
          color: "#1B6EF3", 
          letterSpacing: "3px",
          marginTop: "10px",
          textTransform: "uppercase"
        }}>
          Quality Informatic Solutions
        </div>
      </div>

      <div className="grid-specs">
        <div className="spec-card"><span>✓</span> D'HONDT</div>
        <div className="spec-card"><span>✓</span> PDF417 BINARY</div>
        <div className="spec-card"><span>✓</span> QUÓRUM 3-KEYS</div>
      </div>
    </div>
  );
}

function SlideTecnologia({ visible }) {
  return (
    <div className="slide-container" style={{ background: "#0F172A", color: "#fff" }}>
      <p className="label-blue">STACK TECNOLÓGICO</p>
      <h2 className="title-white" style={{fontSize: "40px", marginBottom: "30px"}}>ARQUITECTURA<br/>HÍBRIDA</h2>
      
      <div className="grid-specs" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
        <div className="tech-badge">🔥 Firebase</div>
        <div className="tech-badge">🌐 IOTA (Tangle)</div>
        <div className="tech-badge">☁️ Google Cloud</div>
        <div className="tech-badge">🐍 Python</div>
        <div className="tech-badge">📱 Kotlin</div>
        <div className="tech-badge">⚡ JavaScript / React</div>
        <div className="tech-badge">🛡️ Java (JMRTD)</div>
        <div className="tech-badge">👁️ ML Kit (OCR)</div>
      </div>
      
      <div style={{ background: "rgba(56, 189, 248, 0.1)", padding: "15px", borderRadius: "10px", border: "1px solid rgba(56, 189, 248, 0.2)" }}>
        <p style={{fontSize: "11px", color: "#cbd5e1", margin: 0, lineHeight: "1.4"}}>
          Integramos ecosistemas Cloud, Inteligencia Artificial y Web3 para garantizar un entorno soberano y de latencia cero.
        </p>
      </div>
      
      <style>{`
        .tech-badge { background: #1e293b; border: 1px solid #334155; padding: 10px; border-radius: 8px; font-size: 11px; font-weight: bold; color: #38bdf8; display: flex; align-items: center; justify-content: center; }
      `}</style>
    </div>
  );
}

function SlidePilar1({ visible }) {
  return (
    <div className="slide-container">
      <p className="label-blue">PILAR 01: IDENTIDAD</p>
      <h2 className="title-small">DNIe & DNI AZUL<br/>SOPORTE UNIVERSAL</h2>
      <div className="feature-box">
        <div className="icon-circle">NFC</div>
        <div>
          <h4>Criptografía DNIe</h4>
          <p>Validación directa desde el chip, eliminando suplantación al 100%.</p>
        </div>
      </div>
      <div className="feature-box">
        <div className="icon-circle">QR</div>
        <div>
          <h4>PDF417 Resiliente</h4>
          <p>Lectura binaria avanzada de DNI Azul, superando hologramas y ruido visual.</p>
        </div>
      </div>
    </div>
  );
}

function SlideBlindaje({ visible }) {
  const [step, setStep] = useState(0);
  const authorities = ["JNE", "ONPE", "SOCIEDAD CIVIL"];

  useEffect(() => {
    if (step < 3) {
      const timer = setTimeout(() => setStep(step + 1), 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="slide-container" style={{ background: "#f8fafc" }}>
      <p className="label-blue">SEGURIDAD NACIONAL</p>
      <h2 className="title-small" style={{fontSize: "30px"}}>NODOS GÉNESIS<br/>3 LLAVES MAESTRAS</h2>
      <p className="desc-text" style={{marginBottom: "20px"}}>Ninguna autoridad puede abrir la elección por sí sola.</p>

      <div className="auth-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "30px"
      }}>
        {authorities.map((a, i) => (
          <div key={i} style={{
            textAlign: "center", padding: "10px", borderRadius: "12px",
            background: i < step ? "#f0fdf4" : "#fff",
            border: i < step ? "2px solid #22C55E" : "1px solid #e2e8f0",
            transition: "all 0.5s ease"
          }}>
            <AuthorityIcon active={i < step} />
            <p style={{fontSize: "9px", fontWeight: "bold", marginTop: "5px"}}>{a}</p>
            <p style={{fontSize: "8px", color: i < step ? "#22C55E" : "#94a3b8"}}>
              {i < step ? "✓ FIRMADO" : "PENDIENTE"}
            </p>
          </div>
        ))}
      </div>

      <div style={{
        padding: "15px", borderRadius: "12px", background: step === 3 ? "#1B6EF3" : "#e2e8f0",
        color: step === 3 ? "#fff" : "#94a3b8", textAlign: "center", transition: "all 0.5s"
      }}>
        <p style={{fontFamily: "Bebas Neue", fontSize: "20px", margin: 0}}>
          {step === 3 ? "🔓 GÉNESIS DESBLOQUEADO" : "🔒 ESPERANDO QUÓRUM..."}
        </p>
      </div>
    </div>
  );
}

function SlideDobleValidacion({ visible }) {
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setValidating(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="slide-container" style={{ background: "#fff" }}>
      <p className="label-blue">INTEGRIDAD DEL PADRÓN</p>
      <h2 className="title-small" style={{fontSize: "32px"}}>CERO VOTOS<br/>FANTASMA</h2>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "40px 0", position: "relative" }}>
        <ServerIcon label="RENIEC" active={true} color="#1B6EF3" />
        <div style={{ flex: 1, height: "2px", background: "#e2e8f0", margin: "0 10px", position: "relative" }}>
          {validating && <div style={{
            position: "absolute", width: "10px", height: "10px", background: "#E8252A", borderRadius: "50%",
            left: 0, animation: "move-right 2s infinite ease-in-out"
          }}/>}
        </div>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: validating ? "#fef2f2" : "#22C55E", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #e2e8f0" }}>
           <span style={{fontSize: "18px"}}>{validating ? "💀" : "✅"}</span>
        </div>
        <div style={{ flex: 1, height: "2px", background: "#e2e8f0", margin: "0 10px", position: "relative" }}>
           {!validating && <div style={{
            position: "absolute", width: "10px", height: "10px", background: "#22C55E", borderRadius: "50%",
            left: 0, animation: "move-right 2s infinite ease-in-out"
          }}/>}
        </div>
        <ServerIcon label="SISTEMA" active={!validating} color="#22C55E" />
      </div>

      <div style={{ background: "#f1f5f9", padding: "15px", borderRadius: "10px" }}>
        <p style={{fontSize: "11px", color: "#475569", margin: 0}}>
          <strong>VALIDACIÓN CRUZADA:</strong> Bloqueo automático de identidades inactivas o duplicadas mediante sincronización DAG-RENIEC.
        </p>
      </div>

      <style>{`
        @keyframes move-right { 0% { left: 0%; opacity: 0; } 50% { opacity: 1; } 100% { left: 90%; opacity: 0; } }
      `}</style>
    </div>
  );
}

function SlidePilar2({ visible }) {
  const [votes, setVotes] = useState([]);
  const addVote = () => {
    const newVote = { x: 100 + Math.random() * 180, y: 40 + Math.random() * 80, fromX: 40, fromY: 80 };
    setVotes([...votes, newVote]);
    if (votes.length > 5) setVotes([]);
  };
  return (
    <div className="slide-container">
      <p className="label-green">PILAR 02: INMUTABILIDAD</p>
      <h2 className="title-small">RED TANGLE (DAG)</h2>
      <p className="desc-text">Estructura indestructible donde cada voto valida la integridad de la red entera.</p>
      <div className="dag-preview" onClick={addVote}>
        <DAGIconAnimated votes={votes} />
        <button className="btn-simulate">TOCA PARA SIMULAR VOTO</button>
      </div>
    </div>
  );
}

function SlideMonitor({ visible }) {
  const [count, setCount] = useState(1240567);
  const [logs, setLogs] = useState(["TX: 7a2f... OK", "TX: 9b1c... OK", "TX: 4e8d... OK"]);
  const [partidos, setPartidos] = useState([
    { name: "PARTIDO INNOVACIÓN", votos: 450000, color: "#1B6EF3" },
    { name: "ALIANZA TECNOLÓGICA", votos: 320000, color: "#22C55E" },
    { name: "FRENTE DIGITAL", votos: 280000, color: "#F59E0B" },
    { name: "VOTO LIBRE", votos: 190567, color: "#E8252A" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 50);
      setCount(prev => prev + increment);
      
      setPartidos(prev => {
        const newPartidos = [...prev];
        const rIndex = Math.floor(Math.random() * newPartidos.length);
        newPartidos[rIndex].votos += increment;
        return newPartidos.sort((a, b) => b.votos - a.votos);
      });

      const newHash = "TX: " + Math.random().toString(36).substring(2, 8).toUpperCase() + "... OK";
      setLogs(prev => [newHash, ...prev.slice(0, 3)]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="monitor-fullscreen" style={{ background: "#0F172A", color: "#e2e8f0", height: "100%", padding: "20px", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <div>
          <div className="live-indicator" style={{color: "#ef4444"}}>● LIVE MONITORING TANGLE</div>
          <p className="monitor-title" style={{fontSize: "24px", color: "#38BDF8"}}>ESCRUTINIO Y ASIGNACIÓN D'HONDT</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="tool-btn">📊 Estadísticas</button>
          <button className="tool-btn">🌍 Filtro Regional</button>
          <button className="tool-btn">🔍 Auditoría PKI</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", flex: 1 }}>
        
        {/* Left: Global Counter & Logs */}
        <div className="counter-box" style={{ padding: "15px", display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}>
          <p className="label-small" style={{fontSize: "11px", marginBottom: "5px"}}>VOTOS TOTALES VALIDADOS</p>
          <div className="main-counter" style={{fontSize: "36px", color: "#fff", margin: "5px 0 15px"}}>{count.toLocaleString()}</div>
          
          <p className="label-xs" style={{fontSize: "10px", marginTop: "auto", marginBottom: "5px"}}>HASHES DE AUDITORÍA EN VIVO</p>
          <div className="log-panel" style={{ padding: "10px", background: "#000", minHeight: "80px" }}>
            {logs.map((log, i) => (
              <div key={i} className="log-entry" style={{fontSize: "11px", color: "#38bdf8"}}>{log}</div>
            ))}
          </div>
        </div>

        {/* Middle: Resultados / Votos */}
        <div className="counter-box" style={{ padding: "15px", height: "100%", boxSizing: "border-box" }}>
          <p className="label-small" style={{fontSize: "11px", marginBottom: "15px"}}>TENDENCIA DE VOTACIÓN</p>
          {partidos.map((p, i) => {
            const percent = ((p.votos / count) * 100).toFixed(1);
            return (
              <div key={i} style={{marginBottom: "12px"}}>
                <div style={{display: "flex", justifyContent: "space-between", fontSize: "10px", fontWeight: "bold"}}>
                  <span>{p.name}</span>
                  <span>{percent}% ({p.votos.toLocaleString()})</span>
                </div>
                <div style={{width: "100%", background: "#1e293b", height: "6px", borderRadius: "3px", marginTop: "4px"}}>
                  <div style={{width: `${percent}%`, background: p.color, height: "100%", borderRadius: "3px", transition: "width 0.5s ease"}} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Motor D'Hondt (Curules) */}
        <div className="counter-box" style={{ padding: "15px", height: "100%", boxSizing: "border-box", overflowY: "auto" }}>
          <p className="label-small" style={{fontSize: "11px", marginBottom: "10px"}}>MOTOR D'HONDT (CURULES)</p>
          <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            
            <div style={{background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "8px"}}>
              <p style={{fontSize: "10px", color: "#94a3b8", margin: "0 0 8px"}}>SENADORES (60 escaños)</p>
              {partidos.slice(0,3).map((p, i) => {
                const escanos = Math.floor((p.votos / count) * 60);
                return (
                  <div key={i} style={{display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: "5px"}}>
                    <span style={{color: p.color}}>{p.name.substring(0,12)}...</span>
                    <span style={{fontWeight: "bold", color: "#fff"}}>{escanos} escaños</span>
                  </div>
                )
              })}
            </div>

            <div style={{background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "8px"}}>
              <p style={{fontSize: "10px", color: "#94a3b8", margin: "0 0 8px"}}>DIPUTADOS (130 escaños)</p>
              {partidos.map((p, i) => {
                const escanos = Math.floor((p.votos / count) * 130);
                return (
                  <div key={i} style={{display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: "5px"}}>
                    <span style={{color: p.color}}>{p.name.substring(0,12)}...</span>
                    <span style={{fontWeight: "bold", color: "#fff"}}>{escanos} escaños</span>
                  </div>
                )
              })}
            </div>

          </div>
        </div>

      </div>
      
      <style>{`
        .tool-btn { background: #1e293b; color: #38bdf8; border: 1px solid #334155; padding: 6px 12px; border-radius: 6px; font-size: 10px; font-weight: bold; cursor: pointer; transition: 0.2s; }
        .tool-btn:hover { background: #38bdf8; color: #0f172a; }
      `}</style>
    </div>
  );
}

function SlideAhorro({ visible }) {
  return (
    <div className="slide-container" style={{ background: "#fff" }}>
      <p className="label-green">EFICIENCIA ESTATAL</p>
      <h2 className="title-small" style={{fontSize: "36px", marginBottom: "30px"}}>-90% REDUCCIÓN<br/>DE COSTOS</h2>
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <div style={{ flex: 1, background: "#fee2e2", padding: "15px", borderRadius: "12px", border: "1px solid #fca5a5" }}>
          <p style={{ fontSize: "10px", color: "#b91c1c", fontWeight: "bold", margin: "0 0 5px" }}>MODELO TRADICIONAL</p>
          <p style={{ fontSize: "24px", fontFamily: "Bebas Neue", color: "#991b1b", margin: 0 }}>$160M USD</p>
          <ul style={{ fontSize: "9px", color: "#7f1d1d", margin: "10px 0 0", paddingLeft: "15px" }}>
            <li>Impresión de papel</li>
            <li>Logística FF.AA.</li>
            <li>Alquiler de locales</li>
          </ul>
        </div>
        
        <div style={{ flex: 1, background: "#f0fdf4", padding: "15px", borderRadius: "12px", border: "1px solid #86efac" }}>
          <p style={{ fontSize: "10px", color: "#15803d", fontWeight: "bold", margin: "0 0 5px" }}>E-VOTE SHIELD</p>
          <p style={{ fontSize: "24px", fontFamily: "Bebas Neue", color: "#166534", margin: 0 }}>$15.7M USD</p>
          <ul style={{ fontSize: "9px", color: "#14532d", margin: "10px 0 0", paddingLeft: "15px" }}>
            <li>Infraestructura Cloud</li>
            <li>Nodos Seguridad HSM</li>
            <li>Tablets en Plazas</li>
          </ul>
        </div>
      </div>

      <div className="feature-box" style={{background: "#f8fafc", border: "1px solid #e2e8f0"}}>
        <div className="icon-circle" style={{background: "#22c55e", fontSize: "20px"}}>🌱</div>
        <div>
          <h4 style={{color: "#1e293b", margin: "0 0 5px"}}>Impacto Ecológico y Social</h4>
          <p style={{fontSize: "11px", color: "#64748b", margin: 0}}>Cero deforestación por actas de papel. Ahorro de ~$145 Millones USD para el Tesoro Público con resultados en 5 minutos.</p>
        </div>
      </div>
    </div>
  );
}

function SlideRegistro({ visible }) {
  const [dni, setDni] = React.useState("");
  const [nombre, setNombre] = React.useState("");
  const [registrado, setRegistrado] = React.useState(false);

  const handleRegistro = () => {
    if (dni.length < 8 || nombre.length < 3) {
      alert("Por favor ingrese datos válidos.");
      return;
    }
    // Simulamos guardado local en el navegador para la demo de hoy
    const padron = JSON.parse(localStorage.getItem("padron_demo") || "[]");
    padron.push({ dni, nombre });
    localStorage.setItem("padron_demo", JSON.stringify(padron));
    setRegistrado(true);
  };

  return (
    <div className="slide-container" style={{ background: "#f8fafc" }}>
      <p className="label-blue">INSCRIPCIÓN ELECTORAL BETA</p>
      <h2 className="title-small" style={{fontSize: "32px", marginBottom: "10px"}}>REGÍSTRATE PARA LA PRUEBA</h2>
      <p style={{color: "#64748b", marginBottom: "30px", fontSize: "14px"}}>Ingresa tus datos para ser incluido en el padrón de prueba local.</p>
      
      {!registrado ? (
        <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "left", background: "#fff", padding: "25px", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}>
          <label style={{display: "block", fontSize: "11px", color: "#475569", marginBottom: "5px", fontWeight: "bold"}}>DNI (8 DÍGITOS)</label>
          <input 
            type="text" 
            placeholder="00000000"
            value={dni} 
            onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "15px", fontSize: "16px", boxSizing: "border-box" }}
          />
          
          <label style={{display: "block", fontSize: "11px", color: "#475569", marginBottom: "5px", fontWeight: "bold"}}>NOMBRE COMPLETO</label>
          <input 
            type="text" 
            placeholder="Ej: Juan Pérez"
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "25px", fontSize: "16px", boxSizing: "border-box" }}
          />
          
          <button 
            onClick={handleRegistro}
            style={{ width: "100%", background: "linear-gradient(135deg, #1B6EF3 0%, #0d4fc4 100%)", color: "white", padding: "15px", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer", transition: "transform 0.2s" }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            INSCRIBIRME EN EL PADRÓN
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center", padding: "40px", background: "#f0fdf4", borderRadius: "16px", border: "1px solid #bbf7d0" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎉</div>
          <h3 style={{ color: "#166534", margin: "0 0 10px" }}>¡Inscripción Exitosa!</h3>
          <p style={{ color: "#15803d", fontSize: "14px", lineHeight: "1.5" }}><b>{nombre}</b>, ya estás habilitado para votar en la prueba local con tu DNI <b>{dni}</b>.</p>
          <p style={{ fontSize: "12px", color: "#166534", marginTop: "20px", opacity: 0.7 }}>Tu identidad ha sido vinculada al nodo génesis local.</p>
        </div>
      )}
    </div>
  );
}

function SlideImpacto({ visible }) {
  return (
    <div className="slide-container" style={{ background: "linear-gradient(135deg, #1B6EF3 0%, #0d4fc4 100%)", color: "#fff" }}>
      <h2 className="title-impact">IMPACTO<br/>DIRECTO</h2>
      <div className="impact-card"><div className="impact-num">D'HONDT</div><p>Cifra repartidora calculada en tiempo real.</p></div>
      <div className="impact-card"><div className="impact-num">24h</div><p>Escrutinio final auditado el mismo día.</p></div>
      <div className="impact-card"><div className="impact-num">100%</div><p>Soberanía total del sufragio.</p></div>
    </div>
  );
}

function SlideCierre({ visible }) {
  return (
    <div className="slide-container" style={{ textAlign: "center" }}>
      <h2 className="title-final">DEMOCRACIA<br/>INVIOLABLE</h2>
      <p className="final-text">La tecnología para un Perú libre ya está aquí.</p>
      
      <div style={{ margin: "24px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="qis-logo-container">QIS</div>
        <div style={{ fontSize: "7px", fontWeight: "bold", color: "#1B6EF3", letterSpacing: "1px", marginTop: "4px" }}>QUALITY INFORMATIC SOLUTIONS SAC</div>
        <div style={{ fontSize: "10px", color: "#666", marginTop: "4px" }}>15 años liderando la tecnología en el Perú.</div>
      </div>

      <button className="cta-button" onClick={() => window.open('https://github.com/joheroba/evote-shield', '_blank')}>
        DESCARGAR APK DEMO
      </button>
      <div className="social-footer">#EVoteShield #PlanElectoral2026 #QualityInformatic</div>
    </div>
  );
}

function SlideAuditoria({ visible }) {
  return (
    <div className="slide-container" style={{ background: "#0F172A", color: "#fff" }}>
      <p className="label-blue">PROTOCOLO DE AUDITORÍA</p>
      <h2 className="title-small" style={{color: "#38BDF8", fontSize: "32px"}}>VERIFICACIÓN<br/>DESCENTRALIZADA</h2>
      <div className="feature-box" style={{background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.2)"}}>
        <div className="icon-circle" style={{background: "#38BDF8"}}>OEA</div>
        <div>
          <h4 style={{color: "#38BDF8"}}>Observadores Internacionales</h4>
          <p style={{color: "#cbd5e1"}}>Acceso de solo lectura a la Tangle para auditar firmas en tiempo real sin ver el contenido del voto.</p>
        </div>
      </div>
      <div className="feature-box" style={{background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.2)"}}>
        <div className="icon-circle" style={{background: "#38BDF8"}}>PKI</div>
        <div>
          <h4 style={{color: "#38BDF8"}}>Integridad Matemática</h4>
          <p style={{color: "#cbd5e1"}}>Cada voto es un bloque inmutable protegido por criptografía asimétrica (RSA-2048).</p>
        </div>
      </div>
      <p style={{fontSize: "10px", color: "#64748b", textAlign: "center", marginTop: "20dp"}}>
        Cumplimiento estricto del Protocolo de Auditoría Electoral 2026.
      </p>
    </div>
  );
}

// --- APP COMPONENT ---

const SLIDE_COMPONENTS = {
  SlideTitle, SlideDiagnostico, SlideSolucion, SlideTecnologia,
  SlidePilar1, SlideBlindaje, SlideDobleValidacion, SlideAuditoria, SlidePilar2, SlideMonitor, SlideAhorro, SlideRegistro, SlideImpacto, SlideCierre
};

export default function App() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  const query = new URLSearchParams(window.location.search);
  const isMonitorMode = query.get("mode") === "monitor";

  useEffect(() => {
    if (isMonitorMode) setCurrent(7);
  }, [isMonitorMode]);

  const navigate = (dir) => {
    const next = current + dir;
    if (next < 0 || next >= slides.length) return;
    setVisible(false);
    setTimeout(() => { setCurrent(next); setVisible(true); }, 200);
  };

  const SlideComp = SLIDE_COMPONENTS[slides[current].component];

  if (isMonitorMode) {
    return <div className="main-wrapper" style={{background: "#0F172A"}}><SlideMonitor visible={true} /></div>;
  }

  return (
    <div className="main-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;700&family=JetBrains+Mono&display=swap');
        
        @font-face {
          font-family: 'SpaceAge';
          src: url('/fonts/space_age.ttf') format('truetype');
        }

        .qis-logo-container {
          font-family: 'SpaceAge', sans-serif;
          font-size: 40px;
          color: #800000;
        }

        .main-wrapper { 
          background: #000; min-height: 100vh; display: flex; align-items: center; justify-content: center; 
          font-family: 'DM Sans', sans-serif; overflow: hidden;
        }

        .phone-frame { 
          width: 100%; max-width: 450px; height: 100vh; background: #fff; position: relative; 
          transition: opacity 0.3s, max-width 0.5s, height 0.5s; display: flex; flex-direction: column;
        }

        @media (min-width: 768px) {
          .phone-frame { max-width: 80%; height: 85vh; border-radius: 24px; box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
          .title-bold { font-size: 80px; }
          .title-brand { font-size: 90px; }
        }

        @media (min-width: 1920px) {
          .phone-frame { max-width: 60%; height: 80vh; }
          .title-bold { font-size: 120px; }
          .subtitle { font-size: 24px; }
        }

        .slide-container { width: 100%; height: 100%; display: flex; flex-direction: column; padding: 40px 30px; box-sizing: border-box; justify-content: center; overflow-y: auto; }
        .badget-red { background: #E8252A; color: #fff; font-size: 10px; padding: 4px 12px; border-radius: 20px; font-weight: bold; margin-bottom: 20px; align-self: center; letter-spacing: 1px; }
        .title-bold { font-family: 'Bebas Neue'; line-height: 0.9; margin: 0; color: #111; letter-spacing: 1px; }
        .title-white { font-family: 'Bebas Neue'; fontSize: 56px; line-height: 0.9; margin: 0; color: #fff; }
        .title-brand { font-family: 'Bebas Neue'; color: #1B6EF3; margin: 0; }
        .title-small { font-family: 'Bebas Neue'; fontSize: 40px; color: #111; margin: 0 0 20px; line-height: 1; }
        .title-impact { font-family: 'Bebas Neue'; fontSize: 50px; color: #fff; margin: 0 0 30px; line-height: 1; }
        .title-final { font-family: 'Bebas Neue'; fontSize: 50px; color: #111; margin: 0 0 10px; line-height: 1; }
        .divider-red { width: 60px; height: 4px; background: #E8252A; margin: 24px auto; }
        .subtitle { font-size: 16px; color: #555; line-height: 1.5; }
        .label-blue { color: #1B6EF3; font-weight: bold; font-size: 12px; letter-spacing: 3px; margin-bottom: 10px; }
        .label-green { color: #22C55E; font-weight: bold; font-size: 12px; letter-spacing: 3px; margin-bottom: 10px; }
        .list-item { display: flex; gap: 15px; margin-bottom: 25px; align-items: flex-start; }
        .list-item h3 { margin: 0; font-family: 'Bebas Neue'; font-size: 24px; color: #fff; letter-spacing: 1px; }
        .list-item p { margin: 5px 0 0; font-size: 13px; color: #aaa; }
        .dot-red-pulse { width: 12px; height: 12px; background: #E8252A; border-radius: 50%; margin-top: 6px; box-shadow: 0 0 10px #E8252A; animation: pulse-red 1.5s infinite; }
        @keyframes pulse-red { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
        .shield-hero { margin-bottom: 20px; align-self: center; }
        .tagline { font-size: 14px; font-weight: bold; color: #888; letter-spacing: 1px; margin: 10px 0 30px; }
        .grid-specs { display: flex; gap: 10px; justify-content: center; }
        .spec-card { border: 1px solid #ddd; padding: 8px 12px; border-radius: 10px; font-size: 10px; font-weight: bold; color: #555; }
        .feature-box { display: flex; gap: 15px; background: #f8faff; padding: 15px; border-radius: 15px; border: 1px solid #eef2ff; margin-bottom: 15px; }
        .icon-circle { width: 40px; height: 40px; background: #1B6EF3; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 10px; flex-shrink: 0; }
        .dag-preview { background: #f0fdf4; border: 1px dashed #22C55E; border-radius: 20px; padding: 10px; position: relative; cursor: pointer; }
        .btn-simulate { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); background: #22C55E; color: #fff; border: none; font-size: 9px; padding: 5px 10px; border-radius: 10px; font-weight: bold; pointer-events: none; }
        .monitor-header { margin-bottom: 20px; border-left: 3px solid #38BDF8; padding-left: 12px; }
        .live-indicator { font-size: 9px; font-weight: bold; animation: pulse-text 1s infinite; }
        @keyframes pulse-text { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
        .monitor-title { font-family: 'Bebas Neue'; margin: 0; letter-spacing: 1px; }
        .counter-box { background: rgba(56, 189, 248, 0.1); padding: 20px; border-radius: 15px; border: 1px solid rgba(56, 189, 248, 0.2); margin-bottom: 15px; }
        .main-counter { font-family: 'JetBrains Mono'; font-weight: bold; letter-spacing: -1px; }
        .stat-mini { flex: 1; background: rgba(56, 189, 248, 0.05); padding: 10px; border-radius: 10px; border: 1px solid rgba(56, 189, 248, 0.1); }
        .log-panel { background: #000; border-radius: 10px; padding: 15px; font-family: 'JetBrains Mono'; overflow-y: auto; }
        .log-entry { font-size: 10px; margin-bottom: 4px; border-bottom: 1px solid #1e293b; padding-bottom: 4px; }
        .cta-button { background: #1B6EF3; color: #fff; border: none; padding: 16px 32px; border-radius: 30px; font-weight: bold; font-size: 14px; cursor: pointer; box-shadow: 0 10px 20px rgba(27,110,243,0.3); transition: transform 0.2s; }
        .cta-button:active { transform: scale(0.95); }
        .social-footer { margin-top: 30px; color: #1B6EF3; font-size: 11px; font-weight: bold; letter-spacing: 1px; }
        .controls { position: absolute; bottom: 20px; left: 0; right: 0; display: flex; justify-content: center; gap: 15px; align-items: center; z-index: 10; }
        .btn-nav { background: rgba(0,0,0,0.05); border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; transition: 0.3s; color: #333; }
        .dot { width: 8px; height: 8px; background: #ddd; border-radius: 50%; transition: 0.3s; }
        .dot.active { background: #1B6EF3; width: 20px; border-radius: 10px; }
        
        .controls.dark .btn-nav { background: rgba(255,255,255,0.15); color: #fff; }
        .controls.dark .btn-nav:disabled { opacity: 0.2; }
        .controls.dark .dot { background: rgba(255,255,255,0.25); }
        .controls.dark .dot.active { background: #38BDF8; }

        @keyframes pulse-shield { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
      `}</style>
      <div className="phone-frame" style={{ opacity: visible ? 1 : 0 }}>
        <SlideComp visible={visible} />
        <div className={`controls ${slides[current].theme || 'light'}`}>
          <button className="btn-nav" onClick={() => navigate(-1)} disabled={current === 0}>←</button>
          {slides.map((_, i) => <div key={i} className={`dot ${i === current ? 'active' : ''}`} />)}
          <button className="btn-nav" onClick={() => navigate(1)} disabled={current === slides.length - 1}>→</button>
        </div>
      </div>
    </div>
  );
}
