// src/pages/PolaroidWall.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    body { background: var(--bg); margin: 0; }
    ::selection { background: var(--gold); color: var(--bg); }
  `}</style>
);

// ── DATA STRIPS ───────────────────────────────────────────────
const STRIPS = [
  {
    id: 1,
    emoji: "🎀",
    moment: "hmmmm, kayaknya dia lagi di taman deh",
    rotate: -5,
    photos: [
      { src: "/photos/foto1.png",  caption: "✨" },
      { src: "/photos/foto2.png",  caption: "🤎" },
      { src: "/photos/foto3.png",  caption: "🐱" },
    ],
  },
  {
    id: 2,
    emoji: "🌸",
    moment: "masuk juga warna outfit lo gue liat-liat",
    rotate: 4,
    photos: [
      { src: "/photos/foto4.png",  caption: "💧" },
      { src: "/photos/foto5.png",  caption: "🌹" },
      { src: "/photos/foto6.png", caption: "🌿" },
    ],
  },
  {
    id: 3,
    emoji: "🎉",
    moment: "kayaknya foto depan rumah? gatau lagi deh udah lama banget ga kesana",
    rotate: -3,
    photos: [
      { src: "/photos/foto7.png", caption: "📸" },
      { src: "/photos/foto8.png",  caption: "🏫" },
      { src: "/photos/foto9.png", caption: "😄" },
    ],
  },
  {
    id: 4,
    emoji: "🦋",
    moment: "Random photos nya si ghitsaa",
    rotate: 5,
    photos: [
      { src: "/photos/foto15.png",  caption: "🌹" },
      { src: "/photos/foto13.png",  caption: "📸" },
      { src: "/photos/foto14.png", caption: "🤍" },
    ],
  },
];

// ── Bintang dekoratif kiri & kanan ───────────────────────────
const STAR_DATA = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  // 14 kiri, 14 kanan
  side: i < 14 ? "left" : "right",
  // posisi dalam area samping (0-100%)
  top: 4 + ((i % 14) * 6.8) + (Math.sin(i * 1.7) * 3),
  offset: 10 + Math.abs(Math.sin(i * 2.3)) * 55, // px dari tepi layar
  size: 0.45 + (i % 3) * 0.22,   // rem, variasi ukuran
  delay: (i * 0.38) % 4,
  duration: 2.8 + (i % 5) * 0.6,
  char: i % 5 === 0 ? "✦" : i % 5 === 1 ? "·" : i % 5 === 2 ? "✦" : i % 5 === 3 ? "✧" : "·",
}));

function StarField() {
  return (
    <>
      {STAR_DATA.map(s => (
        <motion.span
          key={s.id}
          style={{
            position: "fixed",
            [s.side]: `${s.offset}px`,
            top: `${s.top}%`,
            fontSize: `${s.size}rem`,
            color: "var(--gold)",
            pointerEvents: "none",
            zIndex: 5,
            userSelect: "none",
            lineHeight: 1,
          }}
          animate={{ opacity: [0.08, 0.45, 0.08] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {s.char}
        </motion.span>
      ))}
    </>
  );
}

// ── BACK BUTTON ───────────────────────────────────────────────
function BackButton() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => navigate("/birthday")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "transparent", border: "none", cursor: "pointer",
        padding: "0.5rem 0", display: "flex", alignItems: "center", gap: "0.6rem",
        fontFamily: "'Jost', sans-serif", fontWeight: 200,
        fontSize: "0.62rem", letterSpacing: "0.32em", textTransform: "uppercase",
        color: hovered ? "var(--gold)" : "var(--muted)", transition: "color 0.4s ease",
      }}
    >
      <motion.span animate={{ x: hovered ? -3 : 0 }} transition={{ duration: 0.3 }}>←</motion.span>
      kembali
    </button>
  );
}

// ── STRIP STYLES ──────────────────────────────────────────────
const STRIP_STYLES = [
  { left: true,  rotate: -8,  ty: 0   },
  { left: false, rotate:  5,  ty: 20  },
  { left: true,  rotate: -2,  ty: -10 },
  { left: false, rotate:  10, ty: 15  },
];

// ── STRIP CARD ────────────────────────────────────────────────
function StripCard({ strip, index }) {
  const [lightbox, setLightbox] = useState(null);
  const sty = STRIP_STYLES[index % STRIP_STYLES.length];
  const xIn = sty.left ? -80 : 80;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: xIn }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "flex",
          flexDirection: sty.left ? "row" : "row-reverse",
          alignItems: "center",
          gap: "clamp(1rem, 3vw, 2.5rem)",
          width: "100%",
        }}
      >
        {/* Strip fisik */}
        <motion.div
          whileHover={{ rotate: 0, y: -10, scale: 1.06 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            flexShrink: 0,
            width: "clamp(90px, 11vw, 125px)",
            rotate: `${sty.rotate}deg`,
            translateY: `${sty.ty}px`,
            filter: "drop-shadow(0 14px 36px rgba(0,0,0,0.25))",
          }}
        >
          <div style={{ background: "#f5f0e8", borderRadius: "2px", padding: "6px 6px 4px" }}>
            <div style={{
              background: "var(--gold2)", margin: "-6px -6px 5px", padding: "4px 7px",
              borderRadius: "2px 2px 0 0",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{
                fontFamily: "'Jost', sans-serif", fontWeight: 200,
                fontSize: "0.38rem", letterSpacing: "0.28em", textTransform: "uppercase",
                color: "#f5f0e8",
              }}>booth</span>
              <span style={{ fontSize: "0.52rem" }}>{strip.emoji}</span>
            </div>

            {strip.photos.map((photo, pi) => (
              <motion.div
                key={pi}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.22 }}
                onClick={() => setLightbox(photo)}
                style={{
                  marginBottom: pi < strip.photos.length - 1 ? "3px" : 0,
                  overflow: "hidden", cursor: "zoom-in",
                  aspectRatio: "1", background: "#ede1d1",
                }}
              >
                <img
                  src={photo.src} alt={photo.caption}
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "cover", display: "block",
                    filter: "grayscale(10%) contrast(1.05) brightness(0.92)",
                    transition: "filter 0.5s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.filter = "grayscale(0%) contrast(1.08) brightness(1)"}
                  onMouseLeave={e => e.currentTarget.style.filter = "grayscale(10%) contrast(1.05) brightness(0.92)"}
                  onError={e => {
                    e.target.style.display = "none";
                    const p = e.target.parentNode;
                    p.style.minHeight = "60px";
                    p.style.display = "flex";
                    p.style.alignItems = "center";
                    p.style.justifyContent = "center";
                    const s = document.createElement("span");
                    s.textContent = "foto";
                    s.style.cssText = "color:rgba(107,66,38,0.4);font-family:'Cormorant Garamond';font-size:0.55rem;font-style:italic;";
                    p.appendChild(s);
                  }}
                />
              </motion.div>
            ))}

            <div style={{ paddingTop: "5px", paddingBottom: "2px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: "3px", marginBottom: "4px" }}>
                {[0,1,2].map(d => (
                  <div key={d} style={{ width: "2.5px", height: "2.5px", borderRadius: "50%", background: "rgba(26,22,18,0.15)" }} />
                ))}
              </div>
              <p style={{
                fontFamily: "'Jost', sans-serif", fontWeight: 200,
                fontSize: "0.36rem", letterSpacing: "0.15em",
                color: "rgba(26,22,18,0.28)", margin: 0, textTransform: "uppercase",
              }}>09 · 09 · 2026</p>
            </div>
          </div>
        </motion.div>

        {/* Deskripsi momen */}
        <div style={{
          flex: 1,
          textAlign: sty.left ? "left" : "right",
          paddingLeft: sty.left ? "0.5rem" : 0,
          paddingRight: sty.left ? 0 : "0.5rem",
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
            fontSize: "0.72rem", color: "var(--gold2)",
            margin: "0 0 0.6rem", letterSpacing: "0.08em",
          }}>
            {String(index + 1).padStart(2, "0")} {strip.emoji}
          </p>

          <div style={{
            marginBottom: "0.75rem",
            display: "flex", flexDirection: "column", gap: "0.22rem",
            alignItems: sty.left ? "flex-start" : "flex-end",
          }}>
            {strip.photos.map((photo, pi) => (
              <span key={pi} style={{
                fontFamily: "'Jost', sans-serif", fontWeight: 200,
                fontSize: "0.56rem", letterSpacing: "0.14em",
                color: "var(--muted)", textTransform: "uppercase",
              }}>
                {photo.caption}
              </span>
            ))}
          </div>

          <div style={{
            width: "24px", height: "1px",
            background: "rgba(139,94,60,0.4)",
            marginBottom: "0.75rem",
            marginLeft: sty.left ? 0 : "auto",
          }} />

          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
            fontSize: "clamp(0.9rem, 1.6vw, 1.05rem)",
            color: "var(--ink)", opacity: 0.78,
            lineHeight: 1.8, margin: 0, letterSpacing: "0.01em",
          }}>
            {strip.moment}
          </p>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 99,
              background: "rgba(26,22,18,0.9)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "2rem", cursor: "zoom-out",
            }}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              style={{ maxWidth: "380px", width: "100%" }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{
                background: "#f5f0e8", padding: "12px 12px 8px",
                borderRadius: "2px", boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
              }}>
                <div style={{
                  background: "var(--gold2)", margin: "-12px -12px 10px",
                  padding: "6px 10px", borderRadius: "2px 2px 0 0",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <span style={{
                    fontFamily: "'Jost', sans-serif", fontWeight: 200,
                    fontSize: "0.45rem", letterSpacing: "0.3em", textTransform: "uppercase",
                    color: "#f5f0e8",
                  }}>photobooth</span>
                  <span style={{ fontSize: "0.72rem" }}>{strip.emoji}</span>
                </div>
                <img
                  src={lightbox.src} alt={lightbox.caption}
                  style={{ width: "100%", objectFit: "cover", display: "block", borderRadius: "1px" }}
                />
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
                  fontSize: "0.88rem", color: "#6b5e52",
                  textAlign: "center", margin: "8px 0 2px", letterSpacing: "0.04em",
                }}>
                  {lightbox.caption}
                </p>
              </div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              style={{
                fontFamily: "'Jost', sans-serif", fontWeight: 200,
                fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase",
                color: "rgba(232,220,208,0.5)", marginTop: "1.5rem",
              }}
            >klik di luar untuk tutup</motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
export default function PolaroidWall() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <>
      <FontLink />

      <div aria-hidden="true" style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px", opacity: 0.04,
      }} />

      <main style={{ minHeight: "100vh", background: "var(--bg)", position: "relative", zIndex: 1 }}>
        <StarField />

        {/* Header */}
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "3.5rem 1.5rem 0" }}>
          <BackButton />

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            style={{
              fontFamily: "'Jost', sans-serif", fontWeight: 200,
              fontSize: "0.6rem", letterSpacing: "0.42em", textTransform: "uppercase",
              color: "var(--muted)", marginTop: "2.5rem", marginBottom: "1rem",
            }}
          >
            a collection of moments
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
              fontSize: "clamp(2.4rem, 7vw, 4.2rem)", lineHeight: 1.05,
              color: "var(--ink)", margin: 0,
            }}
          >
            Photobooth<br />
            <em style={{ color: "var(--gold2)" }}>Ghitsa</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            style={{
              fontFamily: "'Jost', sans-serif", fontWeight: 200,
              fontSize: "0.85rem", color: "var(--muted)",
              marginTop: "1rem", letterSpacing: "0.04em", lineHeight: 1.7,
            }}
          >

          </motion.p>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.9 }}
            style={{
              marginTop: "2rem", height: "1px",
              background: "linear-gradient(to right, transparent, var(--gold2) 40%, var(--gold2) 60%, transparent)",
              transformOrigin: "left",
            }}
          />

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
            style={{
              fontFamily: "'Jost', sans-serif", fontWeight: 200,
              fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase",
              color: "rgba(139,94,60,0.75)", marginTop: "1rem", textAlign: "right",
            }}
          >
            ketuk foto untuk memperbesar
          </motion.p>
        </div>

        {/* Strip list */}
        <div style={{
          maxWidth: "680px", margin: "0 auto",
          padding: "4rem 1.5rem 5rem",
          display: "flex", flexDirection: "column",
          gap: "clamp(3rem, 6vw, 4.5rem)",
        }}>
          {STRIPS.map((strip, i) => (
            <StripCard key={strip.id} strip={strip} index={i} />
          ))}
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", alignItems: "center", gap: "1rem",
          maxWidth: "400px", margin: "0 auto", padding: "0 1.5rem 0",
        }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          <span style={{ color: "var(--gold)", fontSize: "0.6rem" }}>✦</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.2 }}
          style={{ textAlign: "center", padding: "2.5rem 1.5rem 5rem" }}
        >
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
            fontSize: "clamp(1rem, 2.2vw, 1.15rem)",
            color: "var(--gold)", opacity: 0.6,
          }}>
            — setiap strip, setiap tawa, setiap momen —
          </p>
        </motion.div>
      </main>
    </>
  );
}