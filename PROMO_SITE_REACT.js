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
  { id: 5, component: "SlidePilar2" },
  { id: 6, component: "SlideImpacto" },
  { id: 7, component: "SlideCierre" },
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

function DAGIconAnimated({ votes = [] }) {
  return (
    <svg width="100%" height="160" viewBox="0 0 320 160" fill="none">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Base Network */}
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

      {/* Animated Connections */}
      <path d="M40 80 L100 40 M40 80 L100 120 M100 40 L180 60 M100 120 L180 100 M180 60 L260 40 M180 100 L260 120"
            stroke="#1B6EF3" strokeWidth="1" opacity="0.1" />

      {/* Real-time Votes (Simulation) */}
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
        <div className="spec-card"><span>✓</span> NFC / PDF417 BINARY</div>
        <div className="spec-card"><span>✓</span> TANGLE RESILIENTE</div>
        <div className="spec-card"><span>✓</span> BIOMETRÍA HR</div>
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
        VER CÓDIGO EN GITHUB
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
  SlidePilar1, SlidePilar2, SlideImpacto, SlideCierre
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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;700&display=swap');

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
