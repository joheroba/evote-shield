import React, { useState, useEffect } from "react";

/**
 * E-VOTE SHIELD: PROMO SLIDESHOW (CORPORATE & RESPONSIVE VERSION)
 * Enfoque: Transparencia, Seguridad, Respaldo Corporativo.
 */

const slides = [
  { id: 1, component: "SlideTitle" },
  { id: 2, component: "SlideDiagnostico" },
  { id: 3, component: "SlideSolucion" },
  { id: 4, component: "SlidePilar1" },
  { id: 5, component: "SlideBlindaje" },
  { id: 6, component: "SlideDobleValidacion" },
  { id: 7, component: "SlideAuditoria" },
  { id: 8, component: "SlidePilar2" },
  { id: 9, component: "SlideMonitor" },
  { id: 10, component: "SlideImpacto" },
  { id: 11, component: "SlideCierre" },
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
        {/* QIS High-Fidelity Vector Logo */}
        <svg width="140" height="45" viewBox="0 0 140 45" fill="none" style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.1))" }}>
          {/* Letter Q */}
          <path d="M35 22.5C35 30.5 29.5 37 22.5 37C15.5 37 10 30.5 10 22.5C10 14.5 15.5 8 22.5 8C29.5 8 35 14.5 35 22.5ZM32 32L40 40" stroke="#800000" strokeWidth="5" strokeLinecap="round"/>
          {/* Letter I */}
          <path d="M55 8V37" stroke="#800000" strokeWidth="5" strokeLinecap="round"/>
          {/* Letter S */}
          <path d="M100 8H80C75 8 75 15 80 18C85 21 95 24 100 27C105 30 105 37 100 37H80" stroke="#800000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
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
  const [logs, setLogs] = useState(["TX: 7a2f... Validada", "TX: 9b1c... Validada", "TX: 4e8d... Validada"]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 10));
      const newHash = "TX: " + Math.random().toString(36).substring(2, 6) + "... Validada";
      setLogs(prev => [newHash, ...prev.slice(0, 2)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="monitor-fullscreen" style={{ background: "#0F172A", color: "#38BDF8", height: "100%", padding: "40px" }}>
      <div className="monitor-header">
        <div className="live-indicator">● LIVE MONITORING</div>
        <p className="monitor-title" style={{fontSize: "36px"}}>CONTROL CIUDADANO GLOBAL</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginTop: "40px" }}>
        <div className="counter-box" style={{ padding: "40px" }}>
          <p className="label-small" style={{fontSize: "14px"}}>VOTOS EN RED (TANGLE)</p>
          <div className="main-counter" style={{fontSize: "72px"}}>{count.toLocaleString()}</div>
          <div className="stats-grid" style={{marginTop: "30px"}}>
            <div className="stat-mini"><p>D'HONDT STATUS</p><span style={{color: "#22C55E", fontSize: "24px"}}>ACTIVO</span></div>
            <div className="stat-mini"><p>NODOS</p><span style={{fontSize: "24px"}}>35 PKI</span></div>
          </div>
        </div>

        <div className="log-panel" style={{ padding: "30px" }}>
          <p className="label-xs" style={{fontSize: "12px"}}>HASHES DE AUDITORÍA</p>
          {logs.map((log, i) => (
            <div key={i} className="log-entry" style={{fontSize: "18px", padding: "10px 0"}}>{log}</div>
          ))}
        </div>
      </div>
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
        <svg width="100" height="32" viewBox="0 0 140 45" fill="none">
          <path d="M35 22.5C35 30.5 29.5 37 22.5 37C15.5 37 10 30.5 10 22.5C10 14.5 15.5 8 22.5 8C29.5 8 35 14.5 35 22.5ZM32 32L40 40" stroke="#800000" strokeWidth="5" strokeLinecap="round"/>
          <path d="M55 8V37" stroke="#800000" strokeWidth="5" strokeLinecap="round"/>
          <path d="M100 8H80C75 8 75 15 80 18C85 21 95 24 100 27C105 30 105 37 100 37H80" stroke="#800000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
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
  SlideTitle, SlideDiagnostico, SlideSolucion,
  SlidePilar1, SlideBlindaje, SlideDobleValidacion, SlideAuditoria, SlidePilar2, SlideMonitor, SlideImpacto, SlideCierre
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
        .btn-nav { background: rgba(0,0,0,0.05); border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; }
        .dot { width: 8px; height: 8px; background: #ddd; border-radius: 50%; }
        .dot.active { background: #1B6EF3; width: 20px; border-radius: 10px; }
        @keyframes pulse-shield { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
      `}</style>
      <div className="phone-frame" style={{ opacity: visible ? 1 : 0 }}>
        <SlideComp visible={visible} />
        <div className="controls">
          <button className="btn-nav" onClick={() => navigate(-1)} disabled={current === 0}>←</button>
          {slides.map((_, i) => <div key={i} className={`dot ${i === current ? 'active' : ''}`} />)}
          <button className="btn-nav" onClick={() => navigate(1)} disabled={current === slides.length - 1}>→</button>
        </div>
      </div>
    </div>
  );
}
