import confetti from "canvas-confetti";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');
    :root {
      --bg:     #faf6f0;
      --bg2:    #f0e4d3;
      --ink:    #3d2b1f;
      --gold:   #8b5e3c;
      --gold2:  #6b4226;
      --muted:  #8a6f52;
      --border: rgba(139,94,60,0.25);
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { background: #faf6f0; }
    ::selection { background: var(--gold); color: var(--bg); }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(-2deg); }
      50%       { transform: translateY(-8px) rotate(2deg); }
    }
    @keyframes floatB {
      0%, 100% { transform: translateY(0px) rotate(3deg); }
      50%       { transform: translateY(-10px) rotate(-1deg); }
    }
    @keyframes floatC {
      0%, 100% { transform: translateY(0px) rotate(-1deg); }
      50%       { transform: translateY(-6px) rotate(3deg); }
    }
    .float-a { animation: float  4s ease-in-out infinite; }
    .float-b { animation: floatB 5s ease-in-out infinite; }
    .float-c { animation: floatC 3.5s ease-in-out infinite; }

    .thing-card {
      position: relative;
      border: 1px solid var(--border);
      border-radius: 3px;
      padding: 2.5rem 2rem;
      overflow: hidden;
      transition: border-color 0.5s ease;
    }
    .thing-card:hover { border-color: rgba(139,94,60,0.4); }
    .thing-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 80% 50%, rgba(139,94,60,0.05) 0%, transparent 65%);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    .thing-card:hover::before { opacity: 1; }

    .nav-link {
      font-family: 'Jost', sans-serif;
      font-weight: 200;
      font-size: 0.6rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: rgba(139,94,60,0.65);
      text-decoration: none;
      transition: color 0.4s ease, letter-spacing 0.4s ease;
      cursor: pointer;
      background: transparent;
      border: none;
      padding: 0;
    }
    .nav-link:hover {
      color: var(--gold);
      letter-spacing: 0.4em;
    }

    /* Angka countdown — makin kecil makin lambat */
    @keyframes pulse-gold {
      0%, 100% { text-shadow: 0 0 0px rgba(139,94,60,0); }
      50%       { text-shadow: 0 0 40px rgba(139,94,60,0.35); }
    }
    .number-arrived { animation: pulse-gold 2.5s ease-in-out infinite; }
  `}</style>
);

function Divider() {
  return (
    <div className="flex items-center gap-4 my-12 px-6 max-w-2xl mx-auto">
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      <span style={{ color: "var(--gold)", fontSize: "0.75rem" }}>✦</span>
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
    </div>
  );
}

function NavHint({ to, label }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center my-2">
      <button
        className="nav-link"
        style={{ color: "rgba(139,94,60,0.72)" }}
        onClick={() => {
          sessionStorage.setItem("birthdayScrollY", window.scrollY);
          navigate(to);
        }}
      >
        {label}
      </button>
    </div>
  );
}

function SecretTrigger() {
  const navigate  = useNavigate();
  const [hovered,   setHovered  ] = useState(false);
  const [triggered, setTriggered] = useState(false);

  function handleClick() {
    if (triggered) return;
    setTriggered(true);
    setTimeout(() => navigate("/secret-letter"), 1800);
  }

  return (
    <AnimatePresence>
      {triggered && (
        <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: "var(--bg)" }}>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.2 }}
            className="font-['Cormorant_Garamond'] italic text-center"
            style={{ color: "var(--gold)", fontSize: "clamp(1.2rem, 3vw, 1.8rem)" }}>
            u found it!
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="font-['Jost'] font-light text-xs tracking-widest mt-4"
            style={{ color: "var(--muted)" }}>
            membuka surat...
          </motion.p>
        </motion.div>
      )}
      <motion.button key="trigger"
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
        style={{ background: "transparent", border: "none", cursor: "default", padding: "4px 8px",
          color: hovered ? "var(--gold)" : "var(--muted)", fontFamily: "'Jost', sans-serif",
          fontSize: "0.75rem", letterSpacing: "0.2em", transition: "color 0.6s ease" }}
        aria-label="hidden">✦</motion.button>
    </AnimatePresence>
  );
}

const BIRTH_DATE = new Date("2006-09-09T00:00:00");

function getAge(birthDate) {
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const notYet =
    now.getMonth() < birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate());
  if (notYet) age--;
  return age;
}

// Angka umur → kata bilangan Indonesia (dipakai di puisi & teks statis
// supaya otomatis menyesuaikan tiap tahun tanpa perlu diedit manual).
function terbilang(n) {
  const satuan = ["", "satu","dua","tiga","empat","lima","enam","tujuh","delapan","sembilan"];
  if (n < 10) return satuan[n];
  if (n < 20) return (n === 10 ? "sepuluh" : n === 11 ? "sebelas" : `${satuan[n - 10]} belas`);
  if (n < 100) {
    const puluh = Math.floor(n / 10);
    const sisa  = n % 10;
    return `${satuan[puluh]} puluh${sisa ? " " + satuan[sisa] : ""}`;
  }
  return String(n);
}

function ordinal(n) {
  const j = n % 10, k = n % 100;
  if (j === 1 && k !== 11) return `${n}st`;
  if (j === 2 && k !== 12) return `${n}nd`;
  if (j === 3 && k !== 13) return `${n}rd`;
  return `${n}th`;
}

function getLastBirthday(birthDate) {
  const now = new Date();
  const candidate = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (candidate > now) candidate.setFullYear(candidate.getFullYear() - 1);
  return candidate;
}

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

// ── Willow Fireworks ──────────────────────────────────────────
function WillowFireworks({ phase }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef({ rockets: [], particles: [], rafId: null, launching: false });

  useEffect(() => {
    if (phase !== "active") return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    const s      = stateRef.current;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width  = rect.width  || window.innerWidth;
      canvas.height = rect.height || window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const COLORS = ["#6b4226","#8b5e3c","#3d2b1f","#a3714a","#5c3820","#c68a52","#4a2f1a"];

    class WillowParticle {
      constructor(x, y) {
        const angle = Math.random() * Math.PI * 2;
        const spd   = Math.random() * 4.5 + 1.5;
        this.x = x; this.y = y;
        this.vx = Math.cos(angle) * spd;
        this.vy = Math.sin(angle) * spd - 1.5;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = 1;
        this.decay = Math.random() * 0.008 + 0.006;
        this.width = Math.random() * 1.8 + 0.6;
        this.history = [];
      }
      update() {
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > 18) this.history.shift();
        this.vx *= 0.985;
        this.vy  = this.vy * 0.985 + 0.09;
        this.x  += this.vx; this.y += this.vy;
        this.alpha -= this.decay;
      }
      draw(ctx) {
        if (this.history.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 1; i < this.history.length; i++) ctx.lineTo(this.history[i].x, this.history[i].y);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = this.color; ctx.lineWidth = this.width;
        ctx.globalAlpha = this.alpha * 0.85; ctx.lineCap = "round"; ctx.stroke();
        ctx.globalAlpha = 1;
      }
      get dead() { return this.alpha <= 0; }
    }

    class Rocket {
      constructor() {
        this.x  = canvas.width * (0.1 + Math.random() * 0.8);
        this.y  = canvas.height;
        const targetY = canvas.height * (0.1 + Math.random() * 0.38);
        this.vy = -Math.sqrt(2 * 0.05 * (this.y - targetY));
        this.vx = (Math.random() - 0.5) * 1.2;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.trail = []; this.exploded = false;
      }
      update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 14) this.trail.shift();
        this.x += this.vx; this.y += this.vy; this.vy += 0.05;
        if (this.vy >= 0) this.exploded = true;
      }
      draw(ctx) {
        for (let i = 0; i < this.trail.length; i++) {
          const r = i / this.trail.length;
          ctx.beginPath();
          ctx.arc(this.trail[i].x, this.trail[i].y, 1.5 * r, 0, Math.PI * 2);
          ctx.fillStyle = this.color; ctx.globalAlpha = r * 0.9; ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      burst() {
        return Array.from({ length: 140 + Math.floor(Math.random() * 40) }, () => new WillowParticle(this.x, this.y));
      }
    }

    s.launching = true;
    let launched = 0;
    function scheduleNext() {
      if (!s.launching || launched >= 8) { s.launching = false; return; }
      s.rockets.push(new Rocket()); launched++;
      setTimeout(scheduleNext, 500 + Math.random() * 600);
    }
    scheduleNext();

    function loop() {
      ctx.fillStyle = "rgba(250,246,240,0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      s.rockets = s.rockets.filter(r => {
        r.update(); r.draw(ctx);
        if (r.exploded) { s.particles.push(...r.burst()); return false; }
        return true;
      });
      s.particles = s.particles.filter(p => { p.update(); p.draw(ctx); return !p.dead; });
      if (!s.launching && s.rockets.length === 0 && s.particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); return;
      }
      s.rafId = requestAnimationFrame(loop);
    }
    s.rafId = requestAnimationFrame(loop);
    return () => { s.launching = false; cancelAnimationFrame(s.rafId); window.removeEventListener("resize", resize); };
  }, [phase]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0, width: "100%", height: "100%", display: phase === "idle" ? "none" : "block" }} />
  );
}

// ── Hero dengan countdown 100 → 18 ───────────────────────────
function Hero() {
  const TARGET   = getAge(BIRTH_DATE);
  const START    = Math.max(40, TARGET + 20);
  const [display, setDisplay] = useState(START);
  const [done,    setDone   ] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fwPhase, setFwPhase] = useState("idle");

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);

    // Mulai countdown setelah 1 detik
    // Total angka yang harus dilewati: 100 → 18 = 82 langkah
    // Interval awal cepat, makin melambat mendekati 18
    let current = START;
    const totalSteps = START - TARGET; // 82

    function scheduleNext(step) {
      if (current <= TARGET) {
        setDisplay(TARGET);
        setDone(true);
        setTimeout(() => setFwPhase("active"), 300);
        return;
      }

      // Easing: makin dekat ke 18, makin lambat
      // progress: 0 (awal) → 1 (akhir)
      const progress = (START - current) / totalSteps;
      // interval: mulai dari 18ms (cepat) → sampai 120ms (lambat) saat mendekati 18
      const interval = 18 + Math.pow(progress, 1.8) * 200;

      setDisplay(current);
      current--;
      setTimeout(() => scheduleNext(step + 1), interval);
    }

    setTimeout(() => scheduleNext(0), 1000);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6"
      style={{ background: "var(--bg)" }}>
      <WillowFireworks phase={fwPhase} />

      {/* Noise */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px", opacity: 0.04, zIndex: 1,
      }} />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, transparent 35%, rgba(139,94,60,0.12) 100%)", zIndex: 1,
      }} />

      {/* Konten */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>

        <motion.p initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 1.2 }}
          className="text-xs tracking-[0.45em] uppercase font-['Jost'] mb-8"
          style={{ color: "var(--muted)" }}>
          9 September 2006
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-['Cormorant_Garamond'] font-light text-center leading-none mb-12"
          style={{ fontSize: "clamp(2.8rem, 9vw, 7rem)", color: "var(--ink)" }}>
          Ghitsa<br />
          <em style={{ color: "var(--gold2)" }}>{"Jahrani Hunafa"}</em>
        </motion.h1>

        {/* Angka countdown */}
        <motion.div initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.7 }}
          className="flex flex-col items-center gap-3">

          <p className="text-xs tracking-[0.3em] uppercase font-['Jost'] font-light"
            style={{ color: "var(--muted)" }}>
            genap
          </p>

          {/* Wrapper dengan fixed height supaya layout tidak loncat */}
          <div style={{ position: "relative", height: "clamp(7rem, 24vw, 15rem)", display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>

            {/* Angka yang sedang berjalan */}
            <AnimatePresence mode="popLayout">
              <motion.span
                key={display}
                initial={{ opacity: 0, y: done ? 0 : -20, scale: done ? 1 : 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: done ? 0.5 : 0.08, ease: "easeOut" }}
                className={`font-['Cormorant_Garamond'] font-light tabular-nums select-none${done ? " number-arrived" : ""}`}
                style={{
                  fontSize: "clamp(6rem, 22vw, 13rem)",
                  lineHeight: 1,
                  color: done ? "var(--gold)" : "var(--ink)",
                  letterSpacing: "-0.02em",
                  position: "absolute",
                  // Angka makin kecil semakin mendekati 18, lalu "pop" saat sampai
                  transform: done ? "scale(1)" : `scale(${0.85 + ((100 - display) / 82) * 0.15})`,
                  transition: done ? "color 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)" : "none",
                }}
              >
                {display}
              </motion.span>
            </AnimatePresence>
          </div>

          <p className="text-xs tracking-[0.3em] uppercase font-['Jost'] font-light"
            style={{ color: "var(--muted)" }}>
            tahun
          </p>
        </motion.div>

        {/* Garis bawah muncul saat done */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={done ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.3 }}
          style={{ marginTop: "4rem", width: "100%", height: "1px",
            background: "linear-gradient(to right, transparent, #6b4226 30%, #6b4226 70%, transparent)",
            transformOrigin: "center" }}
        />

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.8 }}
          className="flex flex-col items-center gap-2 mt-8">
          <span className="text-xs tracking-widest font-['Jost']" style={{ color: "var(--muted)" }}>scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-px h-8"
            style={{ background: "linear-gradient(to bottom, #6b4226, transparent)" }} />
        </motion.div>

      </div>
    </section>
  );
}

// ── Countdown sejak lahir ─────────────────────────────────────
function Countdown() {
  function calc() {
    const now = new Date();
    const years = getAge(BIRTH_DATE);
    const lastBday = getLastBirthday(BIRTH_DATE);
    const msPerDay = 86_400_000;
    const totalMs = now - lastBday;
    const days    = Math.floor(totalMs / msPerDay);
    const remainMs = totalMs - days * msPerDay;
    const hours   = Math.floor(remainMs / 3_600_000);
    const minutes = Math.floor((remainMs % 3_600_000) / 60_000);
    const seconds = Math.floor((remainMs % 60_000) / 1_000);
    return { years, days, hours, minutes, seconds };
  }

  // Lazy init: dihitung sekali saat mount, bukan lewat setState di body effect
  const [elapsed, setElapsed] = useState(() => calc());

  useEffect(() => {
    const t = setInterval(() => setElapsed(calc()), 1000);
    return () => clearInterval(t);
  }, []);

  const units = [
    { label: "Tahun", value: elapsed.years   },
    { label: "Hari",  value: elapsed.days    },
    { label: "Jam",   value: elapsed.hours   },
    { label: "Menit", value: elapsed.minutes },
    { label: "Detik", value: elapsed.seconds },
  ];

  return (
    <section className="py-24 px-6 max-w-3xl mx-auto">
      <FadeUp>
        <p className="text-xs tracking-[0.3em] uppercase font-['Jost'] mb-8 text-center" style={{ color: "var(--muted)" }}>
          Sudah hidup selama
        </p>
      </FadeUp>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
        {units.map((u, i) => (
          <FadeUp key={u.label} delay={i * 0.08}>
            <div className="flex flex-col items-center gap-2 p-3 md:p-5"
              style={{ border: "1px solid var(--border)", borderRadius: "2px" }}>
              <span className="font-['Cormorant_Garamond'] font-light tabular-nums"
                style={{ fontSize: "clamp(1.6rem, 4vw, 3rem)", color: "var(--gold)", lineHeight: 1 }}>
                {u.value ?? 0}
              </span>
              <span className="text-xs font-['Jost'] font-light tracking-widest" style={{ color: "var(--muted)" }}>
                {u.label}
              </span>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

// ── Puisi ─────────────────────────────────────────────────────
function Puisi() {
  const age = getAge(BIRTH_DATE);
  const linesFirst = [
    `${terbilang(age)[0].toUpperCase()}${terbilang(age).slice(1)} telah datang,`,
    "membawa langkahmu menuju banyak hal baru.",
    "Tetaplah jadi kamu yang ceria dan baik itu,",
    "karena dunia selalu senang melihatmu tersenyum selalu.",
    "",
    "Semoga di umur yang baru ini,",
    "hal-hal baik datang tanpa perlu kamu cari jauh.",
    "Mimpimu tumbuh satu per satu menjadi nyata,",
    "dan hatimu selalu dipenuhi bahagia.",
  ];

  const wordsSecond =
    "“Do what you can, with what you have, where you are.”"
      .split(" ");

  return (
    <section className="py-32 px-6 max-w-4xl mx-auto">
      

      {/* Puisi */}
      <div className="space-y-3 mb-28">
        {linesFirst.map((line, i) =>
          line === "" ? (
            <div key={i} className="h-4" />
          ) : (
            <FadeUp key={i} delay={i * 0.08}>
              <p
                className="font-['Cormorant_Garamond'] font-light text-center leading-relaxed"
                style={{
                  fontSize: "clamp(1.1rem, 2.5vw, 1.45rem)",
                  color: i < 4 ? "var(--ink)" : "var(--gold)",
                }}
              >
                {line}
              </p>
            </FadeUp>
          )
        )}
      </div>

      {/* Quote Section */}
      <div className="text-center max-w-5xl mx-auto">
        
        <p
          className="text-xs tracking-widest font-['Jost'] mb-12"
          style={{ color: "var(--muted)" }}
        >
          — dan satu lagi —
        </p>

        {/* Quote */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-4 max-w-4xl mx-auto leading-relaxed">
          {wordsSecond.map((word, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 20, rotateX: -30 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              viewport={{ once: true, margin: "-50px" }}
              className="font-['Cormorant_Garamond'] italic inline-block"
              style={{
              fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)",
              color: "var(--gold)",
              lineHeight: 1.5,
            }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Attribution */}
        <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        viewport={{ once: true }}
        className="flex justify-end max-w-4xl mx-auto mt-2"
        style={{ paddingRight: "10.5rem" }}
      >
          <p
            className="font-['Cormorant_Garamond'] italic"
           style={{
            color: "var(--muted)",
            fontSize: "clamp(1rem, 2vw, 1.4rem)",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
          >
            — Theodore Roosevelt
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ── Fun Facts ─────────────────────────────────────────────────
const FACTS = [
  "Dulu, orangnya ga kyk gini. Tapi sekarang, udah jauh lebih baik",
  "Belajar dari masa lalu untuk tumbuh menjadi seseorang yg lebih baik",
  "Baikkkk bangettt, selalu aja ada cerita",
  "Kadang aga ceroboh? harusnya dia sadar sih",
  "Punya empati gede banget, pertahanin!",
];

function FunFacts() {
  return (
    <section className="py-24 px-6 max-w-2xl mx-auto">
      <FadeUp>
        <p className="text-xs tracking-[0.3em] uppercase font-['Jost'] mb-12 text-center" style={{ color: "var(--muted)" }}>
          Semua hal tentang Ghitsa
        </p>
      </FadeUp>
      <div className="space-y-4">
        {FACTS.map((f, i) => (
          <FadeUp key={i} delay={i * 0.1}>
            <div className="p-6 flex gap-5 items-start"
              style={{ border: "1px solid var(--border)", borderRadius: "2px" }}>
              <span className="font-['Cormorant_Garamond'] italic flex-shrink-0"
                style={{ color: "var(--gold)", fontSize: "1.4rem" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-['Jost'] font-light leading-relaxed" style={{ color: "var(--ink)" }}>{f}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

// ── Harapan ───────────────────────────────────────────────────
const HARAPAN = [
  `Semoga di usia ${getAge(BIRTH_DATE)}, jadi anak yang makin baik, makin pinter, juga makin ceria.`,
  "Semoga mimpi-mimpi yang kamu simpen, satu per satu terwujud.",
  "Semoga kebaikan kamu selalu balik ke diri kamu sendiri.",
  "Semoga perjalanan kamu ke depan penuh dengan hal-hal yang membuatmu bangga sama diri kamu sendiri.",
];

function Harapan() {
  return (
    <section className="py-32 px-6 max-w-2xl mx-auto">
      <FadeUp>
        <p className="text-xs tracking-[0.3em] uppercase font-['Jost'] mb-16 text-center" style={{ color: "var(--muted)" }}>
          Harapan & Doa
        </p>
      </FadeUp>
      <div className="space-y-10">
        {HARAPAN.map((h, i) => (
          <FadeUp key={i} delay={i * 0.1}>
            <div className="flex gap-6 items-start">
              <span className="font-['Cormorant_Garamond'] flex-shrink-0"
                style={{ color: "var(--gold)", fontSize: "1.5rem", lineHeight: 1 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-['Jost'] font-light leading-relaxed"
                style={{ color: "var(--ink)", fontSize: "clamp(0.95rem, 2vw, 1.05rem)" }}>
                {h}
              </p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    confetti({
      particleCount: 80, spread: 70,
      origin: { y: 0.8 },
      colors: ["#8b5e3c", "#6b4226", "#c68a52", "#ffffff"],
    });
    setTimeout(() => {
      confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.75 }, colors: ["#8b5e3c", "#c68a52"] });
      confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.75 }, colors: ["#8b5e3c", "#c68a52"] });
    }, 250);
    setTimeout(() => {
      confetti({ particleCount: 40, spread: 90, origin: { x: 0.5, y: 0.7 }, startVelocity: 18, colors: ["#ffffff", "#8b5e3c"] });
    }, 500);
  }, [inView]);

  return (
    <footer ref={ref} className="py-24 px-6 text-center">
      <FadeUp>
        <p className="font-['Cormorant_Garamond'] italic mb-3"
          style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", color: "var(--gold)" }}>
          Happy {ordinal(getAge(BIRTH_DATE))} Birthday
        </p>
        <p className="text-xs tracking-[0.3em] uppercase font-['Jost'] font-light mb-1"
          style={{ color: "var(--muted)" }}>
          may u lived ur best life!
        </p>
        <SecretTrigger />
      </FadeUp>
    </footer>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
export default function Birthday() {
  useEffect(() => {
    const savedY = sessionStorage.getItem("birthdayScrollY");
    if (savedY) {
      window.scrollTo({ top: parseInt(savedY), behavior: "instant" });
      sessionStorage.removeItem("birthdayScrollY");
    }
  }, []);

  return (
    <>
      <FontLink />
      <main style={{ background: "var(--bg)" }}>
        <Hero />
        <Divider />
        <Countdown />
        <NavHint to="/18-things" label="10 hal tentang Ghitsa →" />
        <Divider />
        <Puisi />
        <Divider />
        <NavHint to="/playlist" label="dengarkan playlist-nya →" />
        <Divider />
        <FunFacts />
        <NavHint to="/polaroid" label="lihat momen-momentnya →" />
        <Divider />
        <Harapan />
        <Footer />
      </main>
    </>
  );
}