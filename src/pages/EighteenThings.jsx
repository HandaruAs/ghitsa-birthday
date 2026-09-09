// src/pages/EighteenThings.jsx
import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
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
    body { background: #faf6f0; margin: 0; }
    ::selection { background: var(--gold); color: var(--bg); }
  `}</style>
);

const THINGS = [
  "Orangnya Baik",
  "Seru juga buat diajak ngobrol",
  "Ekstrovert? baru tau akhir akhir ini sih",
  "Ceroboh, ilangin cerobohnya.",
  "ga malu untuk merasa tertinggal dengan orang lain",
  "gabisa bedain kiri kanan...",
  "well dressed, somehow semua warna masuk di dia",
  "dia berubah banget sekarang, jadi lebih baik",
  "sayang semua orang",
  "selera musiknya oke juga",
];

// ── Floating ornament digits in background ────────────────────
function BackgroundNumber({ number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        right: "-0.05em",
        top: "-0.15em",
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 300,
        fontSize: "clamp(5rem, 12vw, 9rem)",
        lineHeight: 1,
        color: "rgba(139,94,60,0.05)",
        letterSpacing: "-0.05em",
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 0,
      }}
    >
      {String(number).padStart(2, "0")}
    </span>
  );
}

// ── Single item ───────────────────────────────────────────────
function Item({ index, text }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  const isLast = index === THINGS.length - 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "1.6rem 1.4rem 1.6rem 1.8rem",
        borderBottom: isLast ? "none" : "1px solid var(--border)",
        transition: "background 0.5s ease",
        background: hovered ? "rgba(139,94,60,0.06)" : "transparent",
        cursor: "default",
      }}
    >
      {/* Subtle left accent line on hover */}
      <motion.div
        animate={{ scaleY: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          position: "absolute",
          left: 0,
          top: "20%",
          bottom: "20%",
          width: "2px",
          background: "var(--gold2)",
          transformOrigin: "top",
          borderRadius: "1px",
        }}
      />

      <BackgroundNumber number={index} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "1.2rem", alignItems: "flex-start" }}>
        {/* Index */}
        <motion.span
          animate={{ color: hovered ? "#8b5e3c" : "#8a6f52" }}
          transition={{ duration: 0.4 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
            lineHeight: 1.5,
            minWidth: "2.2rem",
            flexShrink: 0,
          }}
        >
          {String(index).padStart(2, "0")}
        </motion.span>

        {/* Thin vertical rule */}
        <div
          style={{
            width: "1px",
            background: "var(--border)",
            alignSelf: "stretch",
            flexShrink: 0,
            marginTop: "3px",
          }}
        />

        {/* Text */}
        <motion.p
          animate={{ color: hovered ? "#3d2b1f" : "rgba(61,43,31,0.78)" }}
          transition={{ duration: 0.4 }}
          style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: isLast ? 300 : 200,
            fontSize: isLast ? "clamp(0.95rem, 2vw, 1.05rem)" : "clamp(0.88rem, 1.8vw, 0.98rem)",
            lineHeight: 1.7,
            letterSpacing: "0.015em",
            color: isLast ? "var(--gold)" : undefined,
            fontStyle: isLast ? "italic" : "normal",
            margin: 0,
          }}
        >
          {text}
        </motion.p>
      </div>
    </motion.div>
  );
}

// ── Progress bar (scroll-driven) ──────────────────────────────
function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "1px",
        background: "var(--gold2)",
        transformOrigin: "left",
        scaleX,
        zIndex: 100,
        opacity: 0.6,
      }}
    />
  );
}

// ── Back button ───────────────────────────────────────────────
function BackButton() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => navigate("/birthday")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "0.5rem 0",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        fontFamily: "'Jost', sans-serif",
        fontWeight: 200,
        fontSize: "0.62rem",
        letterSpacing: "0.32em",
        textTransform: "uppercase",
        color: hovered ? "var(--gold)" : "var(--muted)",
        transition: "color 0.4s ease",
      }}
    >
      <motion.span
        animate={{ x: hovered ? -3 : 0 }}
        transition={{ duration: 0.3 }}
      >
        ←
      </motion.span>
      kembali
    </button>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
export default function EighteenThings() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <>
      <FontLink />
      <ReadingProgress />

      {/* Noise texture overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
          opacity: 0.04,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <main
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            padding: "3.5rem 1.5rem 0",
          }}
        >
          <BackButton />

          {/* Label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 200,
              fontSize: "0.6rem",
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginTop: "2.5rem",
              marginBottom: "1.2rem",
            }}
          >
            edisi ulang tahun ke-20
          </motion.p>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "clamp(2.4rem, 7vw, 4.2rem)",
              lineHeight: 1.05,
              color: "var(--ink)",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            10 Hal tentang<br />
            <em style={{ color: "var(--gold2)" }}>Ghitsa</em>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 200,
              fontSize: "0.85rem",
              color: "var(--muted)",
              marginTop: "1rem",
              letterSpacing: "0.04em",
              lineHeight: 1.6,
            }}
          >
            hal-hal kecil yang bikin dia jadi dia.
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              marginTop: "2.5rem",
              height: "1px",
              background: "linear-gradient(to right, transparent, var(--gold2) 40%, var(--gold2) 60%, transparent)",
              transformOrigin: "left",
            }}
          />
        </div>

        {/* ── List ── */}
        <div
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            padding: "0.5rem 1.5rem 5rem",
          }}
        >
          {THINGS.map((thing, i) => (
            <Item key={i} index={i + 1} text={thing} />
          ))}

          {/* Footer ornament */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            style={{
              textAlign: "center",
              marginTop: "3.5rem",
              paddingTop: "2.5rem",
              borderTop: "1px solid var(--border)",
            }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
                color: "var(--gold)",
                opacity: 0.7,
              }}
            >
              — and there's more —
            </span>
          </motion.div>
        </div>
      </main>
    </>
  );
}