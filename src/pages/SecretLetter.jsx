// src/pages/SecretLetter.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   FONT & CSS VARS  (sama persis dengan Birthday)
───────────────────────────────────────────── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&family=Dancing+Script:wght@400;500&display=swap');
    :root {
      --bg:     #faf6f0;
      --bg2:    #f0e4d3;
      --ink:    #3d2b1f;
      --gold:   #8b5e3c;
      --gold2:  #6b4226;
      --muted:  #8a6f52;
      --border: rgba(139,94,60,0.25);
      --paper:  #ede1d1;
      --paper2: #e2d4bc;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { background: #faf6f0; margin: 0; }
    ::selection { background: var(--gold); color: var(--bg); }

    /* lilin berkedip */
    @keyframes flicker {
      0%,100% { opacity: 1;   transform: scaleY(1)   translateX(0); }
      25%      { opacity: .85; transform: scaleY(.96) translateX(1px); }
      50%      { opacity: .92; transform: scaleY(1.02) translateX(-1px); }
      75%      { opacity: .88; transform: scaleY(.98) translateX(0.5px); }
    }
    .flicker { animation: flicker 1.8s ease-in-out infinite; }

    /* partikel debu */
    @keyframes dust {
      0%   { transform: translateY(0) translateX(0) scale(1); opacity: .6; }
      100% { transform: translateY(-60px) translateX(var(--dx, 10px)) scale(0); opacity: 0; }
    }
    .dust { animation: dust 3s ease-out infinite; }

    /* wax seal pulse */
    @keyframes sealPulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(180,60,60,0); }
      50%      { box-shadow: 0 0 16px 4px rgba(180,60,60,0.25); }
    }
    .seal-pulse { animation: sealPulse 2.5s ease-in-out infinite; }

    /* cursor blink */
    @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
    .blink { animation: blink 1s step-end infinite; }

    /* paper crinkle on hover */
    .letter-paper {
      transition: box-shadow 0.6s ease;
    }
    .letter-paper:hover {
      box-shadow: 0 32px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(139,94,60,0.15) !important;
    }

    /* envelope flap */
    .flap-closed { transform-origin: top center; transform: rotateX(0deg); }
    .flap-open   { transform-origin: top center; transform: rotateX(-180deg); }
  `}</style>
);

/* ─────────────────────────────────────────────
   PARTICLES  (debu mengambang di background)
───────────────────────────────────────────── */
function DustParticles() {
  const [particles] = useState(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      top:  `${10 + Math.random() * 80}%`,
      size: `${2 + Math.random() * 3}px`,
      delay: `${Math.random() * 4}s`,
      duration: `${2.5 + Math.random() * 2}s`,
      dx: `${(Math.random() - 0.5) * 30}px`,
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {particles.map(p => (
        <div key={p.id} className="dust absolute rounded-full"
          style={{
            left: p.left, top: p.top,
            width: p.size, height: p.size,
            background: "rgba(139,94,60,0.3)",
            animationDelay: p.delay,
            animationDuration: p.duration,
            "--dx": p.dx,
          }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CANDLE  (lilin kecil dekoratif)
───────────────────────────────────────────── */
function Candle({ style = {} }) {
  return (
    <div className="flex flex-col items-center" style={style}>
      {/* nyala */}
      <div className="flicker relative" style={{ marginBottom: "-2px" }}>
        {/* outer glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "24px", height: "24px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,94,60,0.35) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* flame shape */}
        <svg width="12" height="20" viewBox="0 0 12 20">
          <path d="M6 0 C6 0 11 8 11 13 C11 17 9 20 6 20 C3 20 1 17 1 13 C1 8 6 0 6 0Z"
            fill="url(#flameGrad)" />
          <defs>
            <radialGradient id="flameGrad" cx="50%" cy="80%" r="60%">
              <stop offset="0%"  stopColor="#fff9e6" />
              <stop offset="40%" stopColor="#f0c060" />
              <stop offset="100%" stopColor="#c9601a" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      {/* batang */}
      <div style={{ width: "8px", height: "40px", background: "linear-gradient(to bottom, #e8d8b0, #c4a870)", borderRadius: "3px" }} />
      {/* alas */}
      <div style={{ width: "14px", height: "4px", background: "#8a6a30", borderRadius: "2px", marginTop: "1px" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   WAX SEAL
───────────────────────────────────────────── */
function WaxSeal({ onClick, broken }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={broken ? {} : { scale: 1.08 }}
      whileTap={broken ? {} : { scale: 0.94 }}
      className={`relative cursor-pointer flex items-center justify-center seal-pulse`}
      style={{
        width: "64px", height: "64px", borderRadius: "50%",
        background: "radial-gradient(circle at 40% 35%, #c0504a, #7a1f1a)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.15)",
        userSelect: "none",
      }}
      animate={broken ? { scale: [1, 1.2, 0.8, 1.1, 0.9, 1], rotate: [0, -8, 8, -4, 4, 0], opacity: [1, 1, 1, 1, 0.7, 0] }
                       : {}}
      transition={broken ? { duration: 0.6, ease: "easeOut" } : {}}
    >
      {/* Motif */}
      <svg width="36" height="36" viewBox="0 0 36 36" style={{ opacity: 0.9 }}>
        <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fill: "#f5d0cc", fontStyle: "italic" }}>
          F
        </text>
        <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(245,208,204,0.3)" strokeWidth="1" />
      </svg>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   ENVELOPE
───────────────────────────────────────────── */
function Envelope({ onOpen }) {
  const [sealBroken, setSealBroken] = useState(false);
  const [flapOpen,   setFlapOpen  ] = useState(false);
  const [letterRise, setLetterRise ] = useState(false);

  function handleBreakSeal() {
    if (sealBroken) return;
    setSealBroken(true);
    setTimeout(() => setFlapOpen(true),   400);
    setTimeout(() => setLetterRise(true), 900);
    setTimeout(() => { onOpen(); }, 1800);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Label hint */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="font-['Jost'] font-light text-xs tracking-[0.35em] uppercase"
        style={{ color: "var(--muted)" }}
      >
        sebuah surat ditemukan
      </motion.p>

      {/* Envelope body */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
        style={{ width: "clamp(260px, 50vw, 380px)", height: "clamp(180px, 35vw, 260px)" }}
      >
        {/* Envelope back */}
        <div className="absolute inset-0 rounded-sm"
          style={{
            background: "linear-gradient(160deg, #ede1d1 0%, #e2d4bc 100%)",
            border: "1px solid rgba(139,94,60,0.3)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
          }}
        />

        {/* Diagonal lines (envelope pattern) */}
        <svg className="absolute inset-0 w-full h-full rounded-sm" style={{ opacity: 0.08 }}>
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="#8b5e3c" strokeWidth="1" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="#8b5e3c" strokeWidth="1" />
        </svg>

        {/* Flap (top triangle) */}
        <motion.div
          className="absolute left-0 right-0 top-0 overflow-hidden"
          style={{
            height: "50%",
            transformOrigin: "top center",
            perspective: "600px",
          }}
          animate={flapOpen ? { rotateX: -160 } : { rotateX: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg width="100%" height="100%" viewBox="0 0 380 130" preserveAspectRatio="none">
            <polygon points="0,0 380,0 190,130"
              fill="#e6d8c0" stroke="rgba(139,94,60,0.25)" strokeWidth="1" />
          </svg>
        </motion.div>

        {/* Letter peeking out */}
        <AnimatePresence>
          {letterRise && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: -30, opacity: 1 }}
              exit={{}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-4 right-4 bottom-4"
              style={{
                height: "70%",
                background: "linear-gradient(to bottom, #ede1d1, #e2d4bc)",
                border: "1px solid rgba(139,94,60,0.25)",
                borderRadius: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="font-['Cormorant_Garamond'] italic"
                style={{ color: "rgba(107,66,38,0.55)", fontSize: "1.1rem", letterSpacing: "0.1em" }}>
                untuk Ghitsa
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wax seal — center of envelope */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>
          <div className="relative flex flex-col items-center gap-2">
            <WaxSeal onClick={handleBreakSeal} broken={sealBroken} />
            {!sealBroken && (
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="font-['Jost'] font-light"
                style={{ color: "var(--muted)", fontSize: "0.6rem", letterSpacing: "0.2em" }}
              >
                pecahkan segel
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Candles kiri kanan */}
      <div className="flex gap-32 mt-2">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <Candle />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <Candle />
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TYPEWRITER — per-karakter dengan variable speed
───────────────────────────────────────────── */
function Typewriter({ text, onDone }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx >= text.length) { onDone?.(); return; }
    const ch = text[idx];
    // Jeda lebih panjang di titik, koma, newline
    const delay = ch === "\n" ? 120 : ch === "." || ch === "," ? 80 : ch === " " ? 28 : 32;
    const t = setTimeout(() => setIdx(i => i + 1), delay);
    return () => clearTimeout(t);
  }, [idx, text, onDone]);

  return (
    <span className="font-['Jost'] font-light whitespace-pre-line leading-[1.95] text-sm"
      style={{ color: "var(--ink)" }}>
      {text.slice(0, idx)}
      {idx < text.length && <span className="blink" style={{ color: "var(--gold)", fontWeight: 300 }}>|</span>}
    </span>
  );
}

/* ─────────────────────────────────────────────
   LETTER PAPER  (setelah amplop terbuka)
───────────────────────────────────────────── */
const PARAGRAPHS = [
  "Untuk Ghitsa,",
  "Di usia yang ke-20 ini, cuma pengen bilang...",
  "Thanks for being such a genuine person - kind, sweet, and cheerful. u have to know that kalau ada orang yang selalu nungguin cerita - cerita darimu",
  "Juga semoga di usia kamu yang ke-20 ini, kamu makin menjadi orang yang lebih percaya diri, penyayang, dan tidak takut untuk mencoba hal baru",
  "Satu hal lagi, it was a pleasure knowing you. may ur life ahead be filled with joy, love, and all the things that make you proud.",
  "Once again, Happy birthday Ghitsa.\n\n— from ur bro",
];

// Gabung semua jadi satu string dengan separator
const FULL_TEXT = PARAGRAPHS.join("\n\n");

function LetterPaper() {
  const [typingDone, setTypingDone] = useState(false);
  const [showSig,    setShowSig   ] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typingDone) setTimeout(() => setShowSig(true), 400);
  }, [typingDone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-xl mx-auto relative"
    >
      {/* Paper texture */}
      <div className="letter-paper relative p-10 md:p-14"
        style={{
          background: "linear-gradient(160deg, #ede1d1 0%, #e2d4bc 100%)",
          border: "1px solid rgba(139,94,60,0.28)",
          borderRadius: "3px",
          boxShadow: "0 24px 70px rgba(0,0,0,0.18), 0 0 0 1px rgba(139,94,60,0.1)",
        }}
      >
        {/* Corner ornament kiri atas */}
        <svg className="absolute top-4 left-4" width="28" height="28" viewBox="0 0 28 28" style={{ opacity: 0.3 }}>
          <path d="M2 26 L2 2 L26 2" fill="none" stroke="#8b5e3c" strokeWidth="1" />
          <circle cx="2" cy="2" r="2" fill="#8b5e3c" />
        </svg>
        {/* Corner ornament kanan bawah */}
        <svg className="absolute bottom-4 right-4" width="28" height="28" viewBox="0 0 28 28" style={{ opacity: 0.3 }}>
          <path d="M26 2 L26 26 L2 26" fill="none" stroke="#8b5e3c" strokeWidth="1" />
          <circle cx="26" cy="26" r="2" fill="#8b5e3c" />
        </svg>

        {/* Label */}
        <p className="font-['Jost'] font-light text-xs tracking-[0.35em] uppercase mb-8 text-center"
          style={{ color: "var(--muted)" }}>
          surat rahasia ✦
        </p>

        {/* Garis dekoratif atas */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px" style={{ background: "rgba(139,94,60,0.25)" }} />
          <span style={{ color: "rgba(139,94,60,0.45)", fontSize: "0.6rem" }}>✦</span>
          <div className="flex-1 h-px" style={{ background: "rgba(139,94,60,0.25)" }} />
        </div>

        {/* Teks typewriter */}
        <div className="min-h-[320px]">
          <Typewriter text={FULL_TEXT} onDone={() => setTypingDone(true)} />
        </div>

        {/* Garis dekoratif bawah */}
        <AnimatePresence>
          {typingDone && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-3 mt-8"
              style={{ transformOrigin: "left" }}
            >
              <div className="flex-1 h-px" style={{ background: "rgba(139,94,60,0.25)" }} />
              <span style={{ color: "rgba(139,94,60,0.45)", fontSize: "0.6rem" }}>✦</span>
              <div className="flex-1 h-px" style={{ background: "rgba(139,94,60,0.25)" }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tanda tangan dekoratif */}
        <AnimatePresence>
          {showSig && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mt-6 text-center"
            >
              <p className="font-['Dancing_Script'] text-2xl" style={{ color: "var(--gold2)" }}>
                with all pleasure
              </p>
              <p className="font-['Jost'] font-light text-xs tracking-widest mt-2"
                style={{ color: "var(--muted)" }}>
                9 September 2026
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tombol kembali */}
      <AnimatePresence>
        {showSig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex justify-center mt-8"
          >
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: "instant" }); navigate("/birthday"); }}
              className="font-['Jost'] font-light text-xs tracking-[0.3em] uppercase transition-all duration-500"
              style={{ color: "var(--muted)", background: "transparent", border: "none", cursor: "pointer" }}
              onMouseEnter={e => e.target.style.color = "var(--gold)"}
              onMouseLeave={e => e.target.style.color = "var(--muted)"}
            >
              ← kembali
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function SecretLetter() {
  const [phase, setPhase] = useState("envelope"); // "envelope" | "letter"

  return (
    <>
      <FontLink />
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 py-24"
        style={{ background: "var(--bg)" }}>

        {/* Noise texture */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px", opacity: 0.04, zIndex: 0,
        }} />

        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at center, rgba(139,94,60,0.08) 0%, transparent 65%)",
          zIndex: 0,
        }} />

        {/* Partikel debu */}
        <DustParticles />

        {/* Konten utama */}
        <div className="relative w-full max-w-2xl" style={{ zIndex: 2 }}>
          <AnimatePresence mode="wait">
            {phase === "envelope" ? (
              <motion.div key="env" exit={{ opacity: 0, y: -40, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center">
                <Envelope onOpen={() => setTimeout(() => setPhase("letter"), 200)} />
              </motion.div>
            ) : (
              <motion.div key="letter" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}>
                <LetterPaper />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </>
  );
}