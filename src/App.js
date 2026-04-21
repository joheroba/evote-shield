import React, { useState, useEffect } from "react";

/**
 * E-VOTE SHIELD: PROMO SLIDESHOW (MARKETING VERSION)
 * Enfoque: Impacto, Seguridad, Solución Definitiva.
 */

const slides = [
  { id: 1, component: "SlideTitle" },
  { id: 2, component: "SlideDiagnostico" },
  { id: 3, component: "SlideSolucion" },
  { id: 4, component: "SlidePilar1" },
  { id: 5, component: "SlideBlindaje" }, // Blindaje Biométrico
  { id: 6, component: "SlideDobleValidacion" }, // Nuevo Slide: Doble Validación (Padrón + Tangle)
  { id: 7, component: "SlidePilar2" },
  { id: 8, component: "SlideMonitor" },
  { id: 9, component: "SlideImpacto" },
  { id: 10, component: "SlideCierre" },
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
        {active && <circle cx="38" cy="11" r="2" fill="white"><animate attributeName="opacity" values="0;1;0" dur="0.8s" repeatCount="indefinite"/></circle>}
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
      <div className="badget-red">ESTADO DE EMERGENCIA ELECTORAL</div>
      <h1 className="title-bold">¿DÓNDE QUEDÓ<br/><span style={{color: "#E8252A"}}>TU VOTO?</span></h1>
      <div className="divider-red" />
      <p className="subtitle">
        La confianza en el sistema ha colapsado.<br/>
        Es momento de <strong>blindar la democracia</strong> con ingeniería peruana.
      </p>
      <div className="scroll-indicator">DESLIZA PARA LA REVOLUCIÓN ↓</div>
    </div>
  );
}

function SlideDiagnostico({ visible }) {
  return (
    <div className="slide-container" style={{ background: "#111", color: "#fff" }}>
      <p className="label-blue">EL PROBLEMA</p>
      <h2 className="title-white">3 PUNTOS DE<br/>QUIEBRE</h2>
      <div className="list-item">
        <div className="dot-red-pulse" />
        <div>
          <h3>FRAUDE EN MESA</h3>
          <p>Actas físicas alteradas durante el llenado manual.</p>
        </div>
      </div>
      <div className="list-item">
        <div className="dot-red-pulse" />
        <div>
          <h3>CUSTODIA CIEGA</h3>
          <p>Pérdida de trazabilidad en el traslado de material físico.</p>
        </div>
      </div>
      <div className="list-item">
        <div className="dot-red-pulse" />
        <div>
          <h3>SISTEMA CENTRALIZADO</h3>
          <p>Un solo punto de falla: Si hackean la central, cae todo.</p>
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
      <p className="tagline">TECNOLOGÍA INVIOLABLE PARA EL PERÚ</p>
      <div className="grid-specs">
        <div className="spec-card"><span>✓</span> NFC</div>
        <div className="spec-card"><span>✓</span> DAG</div>
        <div className="spec-card"><span>✓</span> BIOMETRÍA</div>
      </div>
    </div>
  );
}

function SlidePilar1({ visible }) {
  return (
    <div className="slide-container">
      <p className="label-blue">PILAR 01</p>
      <h2 className="title-small">IDENTIDAD<br/>MÁS ALLÁ DEL PAPEL</h2>
      <div className="feature-box">
        <div className="icon-circle">NFC</div>
        <div>
          <h4>Lectura de DNIe</h4>
          <p>El chip de tu DNI es una llave criptográfica única. 100% imposible de suplantar.</p>
        </div>
      </div>
      <div className="feature-box">
        <div className="icon-circle">HR</div>
        <div>
          <h4>Pulso Humano Real</h4>
          <p>Detectamos micro-vibraciones biológicas. <strong>Cero bots. Cero algoritmos falsos.</strong></p>
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
      <p className="label-blue">BLINDAJE DE SEGURIDAD</p>
      <h2 className="title-small" style={{fontSize: "30px"}}>QUÓRUM BIOMÉTRICO<br/>DE APERTURA</h2>
      <p className="desc-text" style={{marginBottom: "20px"}}>La elección solo se activa con el consenso digital de las autoridades.</p>

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
              {i < step ? "✓ DNIe + FACIAL" : "PENDIENTE"}
            </p>
          </div>
        ))}
      </div>

      <div style={{
        padding: "15px", borderRadius: "12px", background: step === 3 ? "#1B6EF3" : "#e2e8f0",
        color: step === 3 ? "#fff" : "#94a3b8", textAlign: "center", transition: "all 0.5s"
      }}>
        <p style={{fontFamily: "Bebas Neue", fontSize: "20px", margin: 0}}>
          {step === 3 ? "🔓 CÉDULA DESBLOQUEADA" : "🔒 ESPERANDO CONSENSO..."}
        </p>
      </div>

      <p style={{fontSize: "11px", marginTop: "20px", color: "#64748b", fontStyle: "italic"}}>
        Ninguna persona sola puede alterar la lista de candidatos.
      </p>
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
      <p className="label-blue">VALIDACIÓN DESCENTRALIZADA</p>
      <h2 className="title-small" style={{fontSize: "32px"}}>ARQUITECTURA DE<br/>DOBLE NODO</h2>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "40px 0", position: "relative" }}>
        <ServerIcon label="RENIEC" active={true} color="#1B6EF3" />

        <div style={{ flex: 1, height: "2px", background: "#e2e8f0", margin: "0 10px", position: "relative" }}>
          {validating && <div style={{
            position: "absolute", width: "10px", height: "10px", background: "#1B6EF3", borderRadius: "50%",
            left: 0, animation: "move-right 2s infinite ease-in-out"
          }}/>}
        </div>

        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: validating ? "#f1f5f9" : "#22C55E", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #e2e8f0" }}>
           <span style={{fontSize: "20px"}}>{validating ? "⌛" : "✅"}</span>
        </div>

        <div style={{ flex: 1, height: "2px", background: "#e2e8f0", margin: "0 10px", position: "relative" }}>
           {!validating && <div style={{
            position: "absolute", width: "10px", height: "10px", background: "#22C55E", borderRadius: "50%",
            left: 0, animation: "move-right 2s infinite ease-in-out"
          }}/>}
        </div>

        <ServerIcon label="JNE (TANGLE)" active={!validating} color="#22C55E" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", gap: "10px", opacity: validating ? 1 : 0.5 }}>
          <span style={{color: "#1B6EF3"}}>●</span>
          <p style={{fontSize: "12px"}}><strong>NODO A:</strong> Verifica que el DNI sea elegible y esté activo (No fallecido).</p>
        </div>
        <div style={{ display: "flex", gap: "10px", opacity: !validating ? 1 : 0.5 }}>
          <span style={{color: "#22C55E"}}>●</span>
          <p style={{fontSize: "12px"}}><strong>NODO B:</strong> Verifica que no exista un voto previo registrado en la red.</p>
        </div>
      </div>

      <style>{`
        @keyframes move-right {
          0% { left: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { left: 90%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function SlidePilar2({ visible }) {
  const [votes, setVotes] = useState([]);
  const addVote = () => {
    const newVote = {
      x: 100 + Math.random() * 180,
      y: 40 + Math.random() * 80,
      fromX: 40, fromY: 80
    };
    setVotes([...votes, newVote]);
    if (votes.length > 5) setVotes([]);
  };

  return (
    <div className="slide-container">
      <p className="label-green">PILAR 02</p>
      <h2 className="title-small">RED TANGLE (DAG)</h2>
      <p className="desc-text">Adiós a las bases de datos manipulables. Aquí, cada voto es un validador independiente.</p>
      <div className="dag-preview" onClick={addVote}>
        <DAGIconAnimated votes={votes} />
        <button className="btn-simulate">TOCA PARA SIMULAR VOTO</button>
      </div>
      <p className="legal-cite">Basado en el <strong>Art. 176 de la Constitución</strong>: Asegurando la expresión auténtica.</p>
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
    <div className="slide-container" style={{ background: "#0F172A", color: "#38BDF8" }}>
      <div className="monitor-header">
        <div className="live-indicator">● LIVE MONITORING</div>
        <p className="monitor-title">CENTRO DE CONTROL CIUDADANO</p>
      </div>

      <div className="counter-box">
        <p className="label-small">VOTOS REGISTRADOS (DAG)</p>
        <div className="main-counter">{count.toLocaleString()}</div>
      </div>

      <div className="stats-grid">
        <div className="stat-mini">
          <p>ESTADO RED</p>
          <span style={{color: "#22C55E"}}>ESTABLE</span>
        </div>
        <div className="stat-mini">
          <p>NODOS ACTIVOS</p>
          <span>1,240</span>
        </div>
      </div>

      <div className="log-panel">
        <p className="label-xs">FEEDS EN TIEMPO REAL (TANGLE)</p>
        {logs.map((log, i) => (
          <div key={i} className="log-entry">{log}</div>
        ))}
      </div>

      <p className="monitor-footer">Cualquier ciudadano puede ser un nodo de auditoría.</p>
    </div>
  );
}

function SlideImpacto({ visible }) {
  return (
    <div className="slide-container" style={{ background: "linear-gradient(135deg, #1B6EF3 0%, #0d4fc4 100%)", color: "#fff" }}>
      <h2 className="title-impact">IMPACTO<br/>DIRECTO</h2>
      <div className="impact-card">
        <div className="impact-num">0.0s</div>
        <p>Tiempo de escrutinio nacional. Resultados en tiempo real.</p>
      </div>
      <div className="impact-card">
        <div className="impact-num">100%</div>
        <p>Auditable por cualquier ciudadano con un smartphone.</p>
      </div>
      <div className="impact-card">
        <div className="impact-num">S/ 0</div>
        <p>Costo de traslado físico y custodia militarizada.</p>
      </div>
    </div>
  );
}

function SlideCierre({ visible }) {
  return (
    <div className="slide-container" style={{ textAlign: "center" }}>
      <h2 className="title-final">EL FUTURO ES<br/>DESCENTRALIZADO</h2>
      <p className="final-text">¿Estás listo para una democracia que nadie pueda alterar?</p>
      <button className="cta-button" onClick={() => window.open('https://github.com/', '_blank')}>
        DESCARGAR APK DEMO
      </button>
      <div className="social-footer">
        #EVoteShield #BlockchainPeru #InnovacionElectoral
      </div>
    </div>
  );
}

// --- APP COMPONENT ---

const SLIDE_COMPONENTS = {
  SlideTitle, SlideDiagnostico, SlideSolucion,
  SlidePilar1, SlideBlindaje, SlideDobleValidacion, SlidePilar2, SlideMonitor, SlideImpacto, SlideCierre
};

export default function App() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  const navigate = (dir) => {
    const next = current + dir;
    if (next < 0 || next >= slides.length) return;
    setVisible(false);
    setTimeout(() => {
      setCurrent(next);
      setVisible(true);
    }, 200);
  };

  const SlideComp = SLIDE_COMPONENTS[slides[current].component];

  return (
    <div className="main-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;700&family=JetBrains+Mono&display=swap');

        .main-wrapper {
          background: #000; min-height: 100vh; display: flex; align-items: center; justify-content: center;
          font-family: 'DM Sans', sans-serif;
        }

        .phone-frame {
          width: 360px; height: 640px; background: #fff; border-radius: 40px; overflow: hidden;
          box-shadow: 0 0 0 10px #222, 0 30px 60px rgba(0,0,0,0.5);
          position: relative; transition: opacity 0.3s;
        }

        .slide-container {
          width: 100%; height: 100%; display: flex; flex-direction: column;
          padding: 40px 30px; box-sizing: border-box; justify-content: center;
        }

        .badget-red { background: #E8252A; color: #fff; font-size: 10px; padding: 4px 12px; border-radius: 20px; font-weight: bold; margin-bottom: 20px; align-self: center; letter-spacing: 1px; }
        .title-bold { font-family: 'Bebas Neue'; fontSize: 56px; line-height: 0.9; margin: 0; color: #111; letter-spacing: 1px; }
        .title-white { font-family: 'Bebas Neue'; fontSize: 56px; line-height: 0.9; margin: 0; color: #fff; }
        .title-brand { font-family: 'Bebas Neue'; fontSize: 60px; color: #1B6EF3; margin: 0; }
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
        .spec-card span { color: #1B6EF3; }

        .feature-box { display: flex; gap: 15px; background: #f8faff; padding: 15px; border-radius: 15px; border: 1px solid #eef2ff; margin-bottom: 15px; }
        .icon-circle { width: 40px; height: 40px; background: #1B6EF3; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 10px; flex-shrink: 0; }
        .feature-box h4 { margin: 0; font-size: 16px; color: #111; }
        .feature-box p { margin: 5px 0 0; font-size: 12px; color: #666; }

        .dag-preview { background: #f0fdf4; border: 1px dashed #22C55E; border-radius: 20px; padding: 10px; position: relative; cursor: pointer; }
        .btn-simulate { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); background: #22C55E; color: #fff; border: none; font-size: 9px; padding: 5px 10px; border-radius: 10px; font-weight: bold; pointer-events: none; }

        .monitor-header { margin-bottom: 20px; border-left: 3px solid #38BDF8; padding-left: 12px; }
        .live-indicator { font-size: 9px; font-weight: bold; animation: pulse-text 1s infinite; }
        @keyframes pulse-text { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .monitor-title { font-family: 'Bebas Neue'; font-size: 22px; margin: 0; letter-spacing: 1px; }

        .counter-box { background: rgba(56, 189, 248, 0.1); padding: 20px; border-radius: 15px; border: 1px solid rgba(56, 189, 248, 0.2); margin-bottom: 15px; }
        .main-counter { font-family: 'JetBrains Mono'; font-size: 36px; font-weight: bold; letter-spacing: -1px; }
        .label-small { font-size: 10px; font-weight: bold; opacity: 0.7; margin-bottom: 5px; }

        .stats-grid { display: flex; gap: 10px; margin-bottom: 15px; }
        .stat-mini { flex: 1; background: rgba(56, 189, 248, 0.05); padding: 10px; border-radius: 10px; border: 1px solid rgba(56, 189, 248, 0.1); }
        .stat-mini p { font-size: 8px; font-weight: bold; margin: 0 0 2px; }
        .stat-mini span { font-family: 'Bebas Neue'; font-size: 18px; }

        .log-panel { background: #000; border-radius: 10px; padding: 15px; font-family: 'JetBrains Mono'; }
        .label-xs { font-size: 8px; opacity: 0.5; margin-bottom: 8px; }
        .log-entry { font-size: 10px; margin-bottom: 4px; border-bottom: 1px solid #1e293b; padding-bottom: 4px; }

        .monitor-footer { font-size: 11px; opacity: 0.6; margin-top: 20px; text-align: center; }

        .impact-card { background: rgba(255,255,255,0.1); padding: 15px; border-radius: 15px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.1); }
        .impact-num { font-family: 'Bebas Neue'; font-size: 32px; color: #fff; line-height: 1; margin-bottom: 5px; }
        .impact-card p { margin: 0; font-size: 12px; opacity: 0.8; }

        .cta-button { background: #1B6EF3; color: #fff; border: none; padding: 16px 32px; border-radius: 30px; font-weight: bold; font-size: 14px; cursor: pointer; box-shadow: 0 10px 20px rgba(27,110,243,0.3); transition: transform 0.2s; }
        .cta-button:active { transform: scale(0.95); }

        .social-footer { margin-top: 30px; color: #1B6EF3; font-size: 11px; font-weight: bold; letter-spacing: 1px; }

        .controls { position: absolute; bottom: 20px; left: 0; right: 0; display: flex; justify-content: center; gap: 15px; align-items: center; z-index: 10; }
        .btn-nav { background: rgba(0,0,0,0.05); border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-weight: bold; }
        .dot { width: 8px; height: 8px; background: #ddd; border-radius: 50%; }
        .dot.active { background: #1B6EF3; width: 20px; border-radius: 10px; }

        @keyframes pulse-shield { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
      `}</style>

      <div className="phone-frame" style={{ opacity: visible ? 1 : 0 }}>
        <SlideComp visible={visible} />

        <div className="controls">
          <button className="btn-nav" onClick={() => navigate(-1)} disabled={current === 0}>←</button>
          {slides.map((_, i) => (
            <div key={i} className={`dot ${i === current ? 'active' : ''}`} />
          ))}
          <button className="btn-nav" onClick={() => navigate(1)} disabled={current === slides.length - 1}>→</button>
        </div>
      </div>
    </div>
  );
}
