import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@100;200;300;400&display=swap');

    :root {
      --bg:    #faf6f0;
      --ink:   #3d2b1f;
      --gold:  #8b5e3c;
      --gold2: #6b4226;
      --muted: #8a6f52;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; background: var(--bg); overflow: hidden; }
    ::selection { background: var(--gold); color: var(--bg); }

    @keyframes grain {
      0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)}
      20%{transform:translate(3%,2%)} 30%{transform:translate(-1%,4%)}
      40%{transform:translate(4%,-1%)} 50%{transform:translate(-3%,1%)}
      60%{transform:translate(2%,-4%)} 70%{transform:translate(-4%,3%)}
      80%{transform:translate(1%,-2%)} 90%{transform:translate(3%,4%)}
    }
    @keyframes flicker {
      0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.85}
      94%{opacity:1} 96%{opacity:0.92} 97%{opacity:1}
    }
    @keyframes breathe {
      0%,100%{opacity:0.35;transform:scale(1)} 50%{opacity:0.55;transform:scale(1.04)}
    }
    @keyframes drift {
      0%,100%{transform:translateY(0px) rotate(0deg)}
      33%{transform:translateY(-12px) rotate(1.5deg)}
      66%{transform:translateY(6px) rotate(-1deg)}
    }

    .grain-overlay {
      position:fixed; inset:-50%; width:200%; height:200%;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-size:200px; opacity:0.055; pointer-events:none;
      animation:grain 6s steps(1) infinite; z-index:100;
    }
    .vignette {
      position:fixed; inset:0;
      background:radial-gradient(ellipse at center, transparent 30%, rgba(139,94,60,0.15) 100%);
      pointer-events:none; z-index:10;
    }
    .candle-flame { animation: flicker 4s ease-in-out infinite; }
    .glow-orb     { animation: breathe 6s ease-in-out infinite; }

    /* ── Letter stage: full-viewport scrollable centering ── */
    .letter-stage-wrap {
      position: fixed;
      inset: 0;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow-y: auto;
      padding: 2rem 1rem;
      /* custom scrollbar */
      scrollbar-width: thin;
      scrollbar-color: rgba(139,94,60,0.2) transparent;
    }
    .letter-stage-wrap::-webkit-scrollbar { width: 4px; }
    .letter-stage-wrap::-webkit-scrollbar-track { background: transparent; }
    .letter-stage-wrap::-webkit-scrollbar-thumb { background: rgba(139,94,60,0.2); border-radius: 2px; }

    .letter-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.2rem;
      /* allow shrinking on small screens but keep centered when content fits */
      min-height: min-content;
      width: 100%;
    }

    .date-field {
      background: transparent;
      border: none;
      border-bottom: 1px solid rgba(140,100,50,0.3);
      color: #8b6a3a;
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2rem, 5vw, 2.8rem);
      font-weight: 300;
      text-align: center;
      letter-spacing: 0.06em;
      outline: none;
      padding: 0.15rem 0;
      caret-color: #8b6a3a;
      transition: border-color 0.4s ease, color 0.3s ease;
      -moz-appearance: textfield;
    }
    .date-field::-webkit-inner-spin-button,
    .date-field::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    .date-field::placeholder { color: rgba(140,100,50,0.18); }
    .date-field:focus { border-color: rgba(140,100,50,0.65); }
    .date-field.err   { border-color: rgba(160,60,60,0.6); color: #b06060; }

    .open-btn {
      background: transparent;
      border: 1px solid rgba(140,100,50,0.3);
      color: rgba(140,100,50,0.55);
      font-family: 'Jost', sans-serif;
      font-weight: 200;
      font-size: 0.62rem;
      letter-spacing: 0.45em;
      text-transform: uppercase;
      padding: 0.7rem 2.2rem;
      cursor: default;
      transition: all 0.4s ease;
      border-radius: 1px;
    }
    .open-btn.ready {
      color: rgba(140,100,50,0.85);
      border-color: rgba(140,100,50,0.5);
      cursor: pointer;
    }
    .open-btn.ready:hover {
      color: #8b6a3a;
      border-color: rgba(140,100,50,0.8);
      background: rgba(140,100,50,0.05);
    }
  `}</style>
);

// ── Candle ────────────────────────────────────────────────────
function Candle({ style }) {
  return (
    <svg width="28" height="80" viewBox="0 0 28 80" fill="none" style={style}>
      <ellipse cx="14" cy="12" rx="8" ry="8" fill="rgba(139,94,60,0.15)" className="glow-orb"/>
      <path d="M14 4 C10 10 7 16 10 21 C12 24 16 24 18 21 C21 16 18 10 14 4Z" fill="#d4a855" opacity="0.9" className="candle-flame"/>
      <path d="M14 8 C12 12 11 17 13 20 C14 21.5 15 21 15.5 20 C17 17 16 12 14 8Z" fill="#f0e0a0" opacity="0.8" className="candle-flame"/>
      <line x1="14" y1="22" x2="14" y2="26" stroke="#4a3a20" strokeWidth="1.2"/>
      <rect x="8" y="26" width="12" height="48" rx="2" fill="#2a2218"/>
      <path d="M8 34 C7 36 6.5 40 7.5 42 L8 42 L8 34Z" fill="#221c12" opacity="0.8"/>
      <path d="M20 38 C21 40 21.5 45 20.5 47 L20 47 L20 38Z" fill="#221c12" opacity="0.8"/>
      <line x1="11" y1="28" x2="11" y2="60" stroke="rgba(139,94,60,0.15)" strokeWidth="1"/>
    </svg>
  );
}

// ── Stars ─────────────────────────────────────────────────────
function Stars() {
  const [pts] = useState(() =>
    Array.from({ length: 55 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 0.8 + 0.2,
      d: Math.random() * 5,
      dur: Math.random() * 4 + 3,
    }))
  );
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, overflow: "hidden" }}>
      {pts.map((s, i) => (
        <motion.div key={i}
          style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
            width: s.r * 2, height: s.r * 2, borderRadius: "50%", background: "#8b5e3c" }}
          animate={{ opacity: [0.1, 0.7, 0.1] }}
          transition={{ duration: s.dur, delay: s.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ── Sealed Envelope ───────────────────────────────────────────
function SealedEnvelope({ onOpen }) {
  const [hov, setHov]     = useState(false);
  const [crk, setCrk]     = useState(0);
  const [busy, setBusy]   = useState(false);

  function click() {
    if (busy) return;
    setBusy(true);
    setTimeout(() => setCrk(1), 80);
    setTimeout(() => setCrk(2), 210);
    setTimeout(() => setCrk(3), 390);
    setTimeout(() => onOpen(), 950);
  }

  return (
    <motion.div
      style={{ cursor: busy ? "default" : "pointer", userSelect: "none" }}
      onMouseEnter={() => !busy && setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={click}
      animate={busy ? { y: [0, -5, 2, -2, 0] } : hov ? { y: -5 } : { y: 0 }}
      transition={busy ? { duration: 0.4, times: [0, 0.2, 0.5, 0.75, 1] } : { duration: 0.5, ease: "easeOut" }}
    >
      <svg width="220" height="160" viewBox="0 0 220 160" fill="none"
        style={{
          filter: hov && !busy
            ? "drop-shadow(0 12px 40px rgba(139,94,60,0.22)) drop-shadow(0 0 1px rgba(139,94,60,0.15))"
            : "drop-shadow(0 8px 24px rgba(0,0,0,0.25))",
          transition: "filter 0.5s ease",
        }}
      >
        <rect x="2" y="40" width="216" height="116" rx="3" fill="#ede1d1" stroke="rgba(139,94,60,0.25)" strokeWidth="0.8"/>
        <path d="M2 156 L110 90 L218 156Z" fill="#d9c7ab"/>
        <path d="M2 40 L110 90 L218 40Z" fill="#e6d8c0" stroke="rgba(139,94,60,0.15)" strokeWidth="0.5"/>
        <path d="M2 40 L2 156 L110 90Z" fill="#e2d4bc" stroke="rgba(139,94,60,0.1)" strokeWidth="0.5"/>
        <path d="M218 40 L218 156 L110 90Z" fill="#e2d4bc" stroke="rgba(139,94,60,0.1)" strokeWidth="0.5"/>
        <path d="M2 40 L110 95 L218 40 L218 20 Q110 -10 2 20Z" fill="#e8dcc4" stroke="rgba(139,94,60,0.2)" strokeWidth="0.8"/>
        {[110,125,140].map(y=><line key={y} x1="20" y1={y} x2="200" y2={y} stroke="rgba(139,94,60,0.03)" strokeWidth="0.5"/>)}
        <g transform="translate(110,90)">
          <circle r="26" fill="#6b1a1a" stroke="rgba(139,94,60,0.3)" strokeWidth="0.8" opacity={crk>=1?0.7:1}/>
          <circle r="20" fill="#7a1e1e" opacity={crk>=1?0.7:1}/>
          <text x="0" y="6" textAnchor="middle" fontFamily="Cormorant Garamond,serif"
            fontSize="18" fontWeight="300" fontStyle="italic"
            fill="rgba(237,225,209,0.9)" opacity={crk>=2?0.4:1}>A</text>
          <circle r="23" fill="none" stroke="rgba(139,94,60,0.2)" strokeWidth="0.5" strokeDasharray="2 3"/>
          {crk>=1&&<motion.path d="M-6 -14 L2 -4 L-2 4 L6 16" stroke="rgba(139,94,60,0.6)" strokeWidth="0.8" fill="none"
            initial={{pathLength:0,opacity:0}} animate={{pathLength:1,opacity:1}} transition={{duration:0.15}}/>}
          {crk>=2&&<motion.path d="M8 -18 L0 -6 L5 0 L-3 14" stroke="rgba(139,94,60,0.5)" strokeWidth="0.6" fill="none"
            initial={{pathLength:0,opacity:0}} animate={{pathLength:1,opacity:1}} transition={{duration:0.12}}/>}
          {crk>=3&&[
            {d:"M-6 -14 L-20 -22 L-14 -8Z",x:-12,y:-16,r:-25,f:"#6b1a1a"},
            {d:"M8 -18 L22 -24 L16 -8Z",   x:14, y:-18,r:30, f:"#7a1e1e"},
            {d:"M18 10 L28 20 L14 22Z",    x:16, y:14, r:20, f:"#6b1a1a"},
            {d:"M-14 14 L-24 22 L-18 6Z",  x:-18,y:16, r:-18,f:"#7a1e1e"},
          ].map((p,i)=>(
            <motion.path key={i} d={p.d} fill={p.f} opacity="0.8"
              initial={{x:0,y:0,rotate:0,opacity:1}}
              animate={{x:p.x,y:p.y,rotate:p.r,opacity:0}}
              transition={{duration:0.5}}/>
          ))}
        </g>
      </svg>
    </motion.div>
  );
}

// ── Letter with Date Gate ─────────────────────────────────────
function Letter({ onUnlock }) {
  const ddRef   = useRef(null);
  const mmRef   = useRef(null);
  const yyyyRef = useRef(null);

  const [dd,   setDd]   = useState("");
  const [mm,   setMm]   = useState("");
  const [yyyy, setYyyy] = useState("");
  const [err,  setErr]  = useState(false);
  const [shake,setShake]= useState(false);
  const [going,setGoing]= useState(false);
  const [attempt, setAttempt] = useState(0);

  const allFilled = dd.length >= 1 && mm.length >= 1 && yyyy.length === 4;

  function change(setter, next, val, max) {
    const v = val.replace(/\D/g,"").slice(0, max);
    setter(v);
    setErr(false);
    if (v.length === max && next) next.current?.focus();
  }

  // Perbaikan: gunakan label untuk menentukan fokus sebelumnya
  function back(label, e) {
    if (e.key !== "Backspace") return;
    if (label === "bulan" && mm === "") ddRef.current?.focus();
    if (label === "tahun" && yyyy === "") mmRef.current?.focus();
  }

  function submit() {
    if (!allFilled || going) return;
    if (parseInt(dd, 10) === 9 && parseInt(mm, 10) === 9 && yyyy === "2006") {
      setGoing(true);
      setTimeout(() => onUnlock(), 1800);
    } else {
      setErr(true);
      setShake(true);
      setAttempt(a => a + 1);
      setTimeout(() => { setShake(false); setErr(false); setDd(""); setMm(""); setYyyy(""); ddRef.current?.focus(); }, 600);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scaleY: 0.8 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative",
        width: "min(460px, 90vw)",
        background: "#f5ede0",
        borderRadius: "2px",
        padding: "clamp(1.8rem, 5vw, 3.2rem) clamp(1.4rem, 5vw, 2.8rem)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(139,94,60,0.1)",
        transformOrigin: "top center",
      }}
    >
      {/* ruled lines */}
      {Array.from({length:13},(_,i)=>(
        <div key={i} style={{
          position:"absolute", left:"2.8rem", right:"2.8rem",
          top:`${4.2+i*1.65}rem`, height:"1px",
          background:"rgba(180,155,120,0.16)", pointerEvents:"none",
        }}/>
      ))}
      {/* red margin */}
      <div style={{
        position:"absolute", left:"3rem", top:"1.2rem", bottom:"1.2rem",
        width:"1px", background:"rgba(180,70,70,0.18)", pointerEvents:"none",
      }}/>

      <div style={{ position:"relative", zIndex:1 }}>

        {/* date & salutation */}
        <div style={{ textAlign:"center", marginBottom:"1.6rem" }}>
          <p style={{
            fontFamily:"'Jost',sans-serif", fontWeight:100,
            fontSize:"0.58rem", letterSpacing:"0.42em", textTransform:"uppercase",
            color:"rgba(110,85,55,0.45)", marginBottom:"0.9rem",
          }}>ix · ix · mmxxvi</p>
          <p style={{
            fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic",
            fontSize:"clamp(1rem,2.8vw,1.3rem)", color:"#5a4030", lineHeight:1.65,
          }}>
            Untuk yang tahu<br/>kapan ia lahir ke dunia —
          </p>
        </div>

        {/* divider */}
        <div style={{ width:"50px", height:"1px", margin:"0 auto 1.6rem", background:"rgba(180,140,80,0.3)" }}/>

        {/* body */}
        <p style={{
          fontFamily:"'Cormorant Garamond',serif", fontWeight:300,
          fontSize:"clamp(0.92rem,2vw,1.05rem)", color:"#6a5040",
          lineHeight:1.9, textAlign:"center", marginBottom:"2rem",
        }}>
          Surat ini hanya bisa dibaca<br/>
          oleh satu orang.<br/><br/>
          Buktikan bahwa kamu adalah dia —<br/>
          dengan tanggal lahirmu.
        </p>

        {/* date inputs */}
        <motion.div
          animate={shake ? { x:[-6,6,-4,4,-2,2,0] } : { x:0 }}
          transition={{ duration: 0.45 }}
          style={{
            display:"flex", alignItems:"flex-end",
            justifyContent:"center", gap:"clamp(0.6rem,2vw,1.4rem)",
            marginBottom:"0.6rem",
          }}
        >
          {[
            { ref:ddRef,   val:dd,   set:(v)=>change(setDd,  mmRef,   v, 2), ph:"DD",   w:"68px",  lbl:"Hari"  },
            { ref:mmRef,   val:mm,   set:(v)=>change(setMm,  yyyyRef, v, 2), ph:"MM",   w:"68px",  lbl:"Bulan" },
            { ref:yyyyRef, val:yyyy, set:(v)=>change(setYyyy,null,    v, 4), ph:"YYYY", w:"102px", lbl:"Tahun" },
          ].map(({ ref, val, set, ph, w, lbl }) => (
            <div key={lbl} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.45rem" }}>
              <input
                ref={ref}
                type="number"
                className={`date-field${err?" err":""}`}
                style={{ width: w }}
                placeholder={ph}
                value={val}
                onChange={e => set(e.target.value)}
                onKeyDown={e => { back(lbl.toLowerCase(), e); if (e.key==="Enter" && allFilled) submit(); }}
                inputMode="numeric"
                autoFocus={lbl==="Hari"}
              />
              <span style={{
                fontFamily:"'Jost',sans-serif", fontWeight:200,
                fontSize:"0.55rem", letterSpacing:"0.3em", textTransform:"uppercase",
                color:"rgba(140,110,70,0.45)",
              }}>{lbl}</span>
            </div>
          ))}
        </motion.div>

        {/* ── example hint ── */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"center",
          gap:"0.5rem", marginTop:"0.7rem", marginBottom:"0.3rem",
        }}>
          <div style={{ width:"24px", height:"1px", background:"rgba(180,140,80,0.2)" }}/>
          <p style={{
            fontFamily:"'Jost',sans-serif", fontWeight:200,
            fontSize:"0.52rem", letterSpacing:"0.35em", textTransform:"uppercase",
            color:"rgba(140,110,70,0.38)",
          }}>
            contoh&nbsp;·&nbsp;
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", textTransform:"none", letterSpacing:"0.05em", fontSize:"0.68rem" }}>
              01 / 01 / 2000
            </span>
          </p>
          <div style={{ width:"24px", height:"1px", background:"rgba(180,140,80,0.2)" }}/>
        </div>

        {/* error msg */}
        <AnimatePresence>
          {err && (
            <motion.p key={`e${attempt}`}
              initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              transition={{duration:0.35}}
              style={{
                fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic",
                fontSize:"0.85rem", color:"rgba(160,60,60,0.75)",
                textAlign:"center", marginTop:"0.6rem",
              }}
            >
              Bukan itu. Coba lagi.
            </motion.p>
          )}
        </AnimatePresence>

        {/* submit */}
        <div style={{ textAlign:"center", marginTop:"1.8rem" }}>
          <button
            className={`open-btn${allFilled?" ready":""}`}
            disabled={!allFilled || going}
            onClick={submit}
          >
            {going ? "membuka..." : "Buka Surat"}
          </button>
        </div>

        {going && (
          <motion.div
            initial={{ scaleX:0, opacity:0 }}
            animate={{ scaleX:1, opacity:1 }}
            transition={{ duration: 1, ease:[0.22,1,0.36,1] }}
            style={{
              marginTop:"1.5rem", height:"1px",
              background:"linear-gradient(to right,transparent,rgba(140,110,70,0.55),transparent)",
              transformOrigin:"center",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

// ── Transition ────────────────────────────────────────────────
function Transition({ on }) {
  return (
    <AnimatePresence>
      {on && (
        <motion.div key="t"
          initial={{opacity:0}} animate={{opacity:1}}
          style={{
            position:"fixed", inset:0, zIndex:999, background:"var(--bg)",
            display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"center", gap:"1.5rem",
          }}
        >
          <motion.div initial={{scaleX:0}} animate={{scaleX:1}}
            transition={{duration:1.2,delay:0.2,ease:[0.22,1,0.36,1]}}
            style={{
              width:"120px", height:"1px",
              background:"linear-gradient(to right,transparent,var(--gold),transparent)",
              transformOrigin:"center",
            }}
          />
          <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
            transition={{delay:0.6,duration:1}}
            style={{
              fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic",
              fontSize:"clamp(1.1rem,3vw,1.5rem)", color:"var(--gold)",
              letterSpacing:"0.05em", textAlign:"center",
            }}
          >
            Selamat datang, Ghitsa.
          </motion.p>
          <motion.p initial={{opacity:0}} animate={{opacity:1}}
            transition={{delay:1.2,duration:0.8}}
            style={{
              fontFamily:"'Jost',sans-serif", fontWeight:200,
              fontSize:"0.65rem", letterSpacing:"0.4em", textTransform:"uppercase",
              color:"var(--muted)",
            }}
          >
            membuka...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main ──────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const [ready,  setReady]  = useState(false);
  const [hint,   setHint]   = useState(false);
  const [stage,  setStage]  = useState("envelope"); // envelope | letter
  const [going,  setGoing]  = useState(false);

  useEffect(() => {
    setTimeout(() => setReady(true), 300);
    setTimeout(() => setHint(true),  3500);
  }, []);

  function handleOpen() { setStage("letter"); }

  function handleUnlock() {
    setGoing(true);
    setTimeout(() => navigate("/birthday"), 2400);
  }

  return (
    <>
      <FontLink />
      <div style={{
        position:"fixed", inset:0, background:"var(--bg)",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", overflow:"hidden",
      }}>
        <div className="grain-overlay"/>
        <div className="vignette"/>
        <Stars/>

        {/* ambient glow */}
        <motion.div
          style={{
            position:"absolute", width:"500px", height:"500px", borderRadius:"50%",
            background:"radial-gradient(circle,rgba(139,94,60,0.08) 0%,transparent 70%)",
            zIndex:2, pointerEvents:"none",
          }}
          animate={{scale:[1,1.08,1],opacity:[0.6,1,0.6]}}
          transition={{duration:8,repeat:Infinity,ease:"easeInOut"}}
        />

        {/* orbit rings */}
        <AnimatePresence>
          {stage==="envelope" && [420,320].map((s,i)=>(
            <motion.div key={s}
              initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              transition={{duration:1.5,delay:1.5+i*0.3}}
              style={{
                position:"absolute", width:s, height:s, borderRadius:"50%",
                border:`1px solid rgba(139,94,60,${i===0?0.07:0.05})`,
                zIndex:2, pointerEvents:"none",
              }}
            />
          ))}
        </AnimatePresence>

        {/* candles */}
        <AnimatePresence>
          {stage==="envelope" && (
            <>
              <motion.div
                initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}
                transition={{duration:1.8,delay:0.8}}
                style={{
                  position:"absolute", left:"calc(50% - 240px)", bottom:"28%",
                  zIndex:5, display:"flex", gap:"18px", alignItems:"flex-end",
                  animation:"drift 7s ease-in-out infinite",
                }}
              >
                <Candle style={{opacity:0.6,transform:"scale(0.75)"}}/>
                <Candle style={{opacity:0.8}}/>
              </motion.div>
              <motion.div
                initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}
                transition={{duration:1.8,delay:1.1}}
                style={{
                  position:"absolute", right:"calc(50% - 240px)", bottom:"28%",
                  zIndex:5, display:"flex", gap:"18px", alignItems:"flex-end",
                  animation:"drift 9s ease-in-out infinite reverse",
                }}
              >
                <Candle style={{opacity:0.8}}/>
                <Candle style={{opacity:0.5,transform:"scale(0.7)"}}/>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── ENVELOPE STAGE ── */}
        <AnimatePresence>
          {stage==="envelope" && (
            <motion.div key="env"
              initial={{opacity:0}} animate={{opacity:1}}
              exit={{opacity:0,y:-24,scale:0.95}}
              transition={{duration:0.7}}
              style={{
                position:"relative", zIndex:10,
                display:"flex", flexDirection:"column",
                alignItems:"center", textAlign:"center", padding:"2rem",
              }}
            >
              <motion.div
                initial={{opacity:0,scaleX:0}}
                animate={ready?{opacity:1,scaleX:1}:{}}
                transition={{duration:1.6,delay:0.2,ease:[0.22,1,0.36,1]}}
                style={{
                  width:"200px", height:"1px", marginBottom:"2rem",
                  background:"linear-gradient(to right,transparent,rgba(139,94,60,0.5),transparent)",
                  transformOrigin:"center",
                }}
              />
              <motion.p
                initial={{opacity:0}} animate={ready?{opacity:1}:{}}
                transition={{duration:1.4,delay:0.5}}
                style={{
                  fontFamily:"'Jost',sans-serif", fontWeight:100,
                  fontSize:"0.68rem", letterSpacing:"0.55em", textTransform:"uppercase",
                  color:"var(--muted)", marginBottom:"1.8rem",
                }}
              >
                ix · ix · mmxxvi
              </motion.p>
              <motion.h1
                initial={{opacity:0,y:30}} animate={ready?{opacity:1,y:0}:{}}
                transition={{duration:1.8,delay:0.7,ease:[0.22,1,0.36,1]}}
                style={{
                  fontFamily:"'Cormorant Garamond',serif", fontWeight:300,
                  fontSize:"clamp(1.6rem,5vw,2.8rem)", color:"var(--ink)",
                  letterSpacing:"0.08em", lineHeight:1.3, marginBottom:"0.4rem",
                }}
              >
                Sebuah surat
              </motion.h1>
              <motion.h1
                initial={{opacity:0,y:30}} animate={ready?{opacity:1,y:0}:{}}
                transition={{duration:1.8,delay:0.9,ease:[0.22,1,0.36,1]}}
                style={{
                  fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontStyle:"italic",
                  fontSize:"clamp(1.6rem,5vw,2.8rem)", color:"var(--gold2)",
                  letterSpacing:"0.08em", lineHeight:1.3, marginBottom:"2.8rem",
                }}
              >
                untukmu.
              </motion.h1>

              <motion.div
                initial={{opacity:0,y:20,scale:0.95}}
                animate={ready?{opacity:1,y:0,scale:1}:{}}
                transition={{duration:1.6,delay:1.4,ease:[0.22,1,0.36,1]}}
              >
                <SealedEnvelope onOpen={handleOpen}/>
              </motion.div>

              <AnimatePresence>
                {hint && (
                  <motion.p key="hint"
                    initial={{opacity:0,y:8}} animate={{opacity:0.65,y:0}} exit={{opacity:0}}
                    transition={{duration:1.2}}
                    style={{
                      fontFamily:"'Jost',sans-serif", fontWeight:200,
                      fontSize:"0.65rem", letterSpacing:"0.35em", textTransform:"uppercase",
                      color:"var(--muted)", marginTop:"1.8rem",
                    }}
                  >
                    sentuh untuk membuka
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.div
                initial={{opacity:0}} animate={ready?{opacity:1}:{}}
                transition={{duration:2,delay:2.2}}
                style={{marginTop:"2.5rem",display:"flex",alignItems:"center",gap:"0.8rem"}}
              >
                <div style={{width:"40px",height:"1px",background:"rgba(139,94,60,0.2)"}}/>
                <span style={{color:"rgba(139,94,60,0.35)",fontSize:"0.6rem"}}>✦</span>
                <div style={{width:"40px",height:"1px",background:"rgba(139,94,60,0.2)"}}/>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── LETTER STAGE ── */}
        <AnimatePresence>
          {stage==="letter" && (
            <div className="letter-stage-wrap">
              <div className="letter-inner">
                <motion.p
                  initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                  transition={{delay:0.5,duration:1}}
                  style={{
                    fontFamily:"'Jost',sans-serif", fontWeight:100,
                    fontSize:"0.58rem", letterSpacing:"0.5em", textTransform:"uppercase",
                    color:"var(--muted)", opacity:0.55,
                  }}
                >
                  surat telah terbuka
                </motion.p>

                <Letter onUnlock={handleUnlock}/>

                <motion.div
                  initial={{opacity:0}} animate={{opacity:1}}
                  transition={{delay:1,duration:1.2}}
                  style={{display:"flex",alignItems:"center",gap:"0.8rem"}}
                >
                  <div style={{width:"30px",height:"1px",background:"rgba(139,94,60,0.15)"}}/>
                  <span style={{color:"rgba(139,94,60,0.25)",fontSize:"0.55rem"}}>✦</span>
                  <div style={{width:"30px",height:"1px",background:"rgba(139,94,60,0.2)"}}/>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* watermark */}
        <motion.p
          initial={{opacity:0}} animate={ready?{opacity:1}:{}}
          transition={{duration:2,delay:2.5}}
          style={{
            position:"absolute", bottom:"2rem", zIndex:10,
            fontFamily:"'Jost',sans-serif", fontWeight:100,
            fontSize:"0.6rem", letterSpacing:"0.4em", textTransform:"uppercase",
            color:"var(--muted)", opacity:0.35,
          }}
        >
          Ghitsa · 2026
        </motion.p>

        <Transition on={going}/>
      </div>
    </>
  )
}