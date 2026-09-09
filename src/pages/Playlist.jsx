// src/pages/Playlist.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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

    /* Sembunyikan scrollbar Spotify iframe */
    .spotify-wrap iframe {
      border-radius: 0 !important;
    }
  `}</style>
);

// ── Data lagu ─────────────────────────────────────────────────
// spotifyId: buka Spotify web → kanan lagu → Share → Copy link → ambil ID setelah /track/
const SONGS = [
  {
    title: "Lebih Dari",
    artist: "Alkateri",
    note: "for ur past",
    reason: "Biar kamu harus lebih dari yg sebelumnya",
    spotifyId: "6bgnRv0S4pMyukpOr4LFkG?si=086ca982340d4bb4", // ← ganti dengan ID benar jika berbeda
  },
  {
    title: "Pastikan Riuh Akhiri Malammu",
    artist: "Perunggu",
    note: "-",
    reason: "Gaada sih, ini lagu favoritku aja",
    spotifyId: "5WneI3C3L3R01ctnMzymbf?si=204a14e2acaf4732",
  },
  {
    title: "Bayangkan Jika Kita Tidak Menyerah",
    artist: "Hindia",
    note: "jangan pernah menyerah!",
    reason: "mau besok lebih buruk dari hari ini, jangan pernah nyerah!",
    spotifyId: "3QZgiXw3VyeSfFnhY7zpj1?si=8e876df1dc3542cf",
  },
  {
    title: "Gemilang",
    artist: "Perunggu",
    note: "for your bright future",
    reason: "Buat masa depanmu yang gemilang, ea.",
    spotifyId: "7EPJbZ3UygY2fqhOdqOSaT?si=c62b276b7f414ff9",
  },
  {
    title: "Evaluasi",
    artist: "Hindia",
    note: "for your self-reflective soul",
    reason: "Karena kamu tipe orang yang selalu ingin jadi versi lebih baik dari diri sendiri.",
    spotifyId: "2dIBMHByUGcNPzmYBJ6OAj?si=8656c124d09e4000",
  },
  {
    title: "Monokrom",
    artist: "Tulus",
    note: "for your nostalgic moments",
    reason: "Karena kamu udah ngelewatin banyak pahit manisnya hidup.",
    spotifyId: "4GfK1qOF3uBWidbPlTCQRL?si=a40cc9341f3b4020",
  },
  {
    title: "Semua Orang Pernah Sakit Hati",
    artist: "Lomba Sihir",
    note: "-",
    reason: "Sedikit mengingat masa lalu, tapi kamu harus tetep maju",
    spotifyId: "0lAwrV80YlQCGeqPtMIQjB?si=ba5931abe87643ab",
  },
  {
    title: "Kabar Bahagia",
    artist: "Rumah Sakit",
    note: "kabar bahagiamu",
    reason: "Karena diakhir nanti, akan selalu ada kabar bahagia yg menantimu",
    spotifyId: "6ne24uxM9G8RtBlPy4fPRd?si=b846947128894495",
  },
];

// ── Reading progress bar ──────────────────────────────────────
function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      style={{
        position: "fixed", top: 0, left: 0, right: 0,
        height: "1px", background: "var(--gold2)",
        transformOrigin: "left", scaleX, zIndex: 100, opacity: 0.6,
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

// ── Spotify Player (muncul di bawah lagu yang diklik) ─────────
function SpotifyEmbed({ trackId }) {
  return (
    <motion.div
      className="spotify-wrap"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 80 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ overflow: "hidden", marginTop: "0.8rem", paddingLeft: 0, paddingRight: 0 }}
    >
      <iframe
        key={trackId} // key berubah → iframe reload → autoplay
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0&autoplay=1`}
        width="100%"
        height="80"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{
          borderRadius: "4px",
          display: "block",
        }}
      />
    </motion.div>
  );
}

// ── Song card ─────────────────────────────────────────────────
function SongCard({ song, index, isOpen, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      style={{
        position: "relative", overflow: "hidden",
        borderBottom: "1px solid var(--border)",
        padding: "1.4rem 0",
        cursor: "pointer",
      }}
    >
      {/* Hover bg */}
      <motion.div
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(139,94,60,0.06)",
          pointerEvents: "none",
        }}
      />

      {/* Left accent line */}
      <motion.div
        animate={{ scaleY: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: "absolute", left: 0, top: "15%", bottom: "15%",
          width: "2px", background: "var(--gold2)",
          transformOrigin: "top", borderRadius: "1px",
        }}
      />

      <div style={{ paddingLeft: "1rem", position: "relative", zIndex: 1 }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", flex: 1, minWidth: 0 }}>
            {/* Nomor */}
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic", fontSize: "0.9rem",
              color: isOpen ? "var(--gold)" : "var(--muted)",
              flexShrink: 0, transition: "color 0.4s ease", minWidth: "1.8rem",
            }}>
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Judul + Artis */}
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
                fontSize: "clamp(1.1rem, 2.8vw, 1.35rem)",
                color: isOpen ? "var(--ink)" : "rgba(61,43,31,0.85)",
                margin: 0, lineHeight: 1.2, transition: "color 0.4s ease",
              }}>
                {song.title}
              </p>
              <p style={{
                fontFamily: "'Jost', sans-serif", fontWeight: 200,
                fontSize: "0.68rem", letterSpacing: "0.18em",
                color: "var(--muted)", margin: "0.25rem 0 0", textTransform: "uppercase",
              }}>
                {song.artist}
              </p>
            </div>
          </div>

          {/* Note tag */}
          <motion.span
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: "'Jost', sans-serif", fontWeight: 200,
              fontSize: "0.58rem", letterSpacing: "0.2em",
              color: "var(--muted)", flexShrink: 0, whiteSpace: "nowrap",
            }}
          >
            {song.note}
          </motion.span>

          {/* Chevron */}
          <motion.span
            animate={{ rotate: isOpen ? 90 : 0, color: isOpen ? "var(--gold)" : "var(--muted)" }}
            transition={{ duration: 0.35 }}
            style={{ fontSize: "0.7rem", flexShrink: 0, fontFamily: "sans-serif" }}
          >
            ›
          </motion.span>
        </div>

        {/* Expanded: alasan + Spotify player */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: "0.9rem" }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              {/* Alasan */}
              <div style={{ paddingLeft: "2.8rem", display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                <span style={{ color: "var(--gold)", fontSize: "0.6rem", marginTop: "0.2rem", flexShrink: 0 }}>✦</span>
                <p style={{
                  fontFamily: "'Jost', sans-serif", fontWeight: 200,
                  fontSize: "0.88rem", color: "rgba(61,43,31,0.75)",
                  lineHeight: 1.7, margin: 0, letterSpacing: "0.01em",
                }}>
                  {song.reason}
                </p>
              </div>

              {/* Spotify embed — autoplay via key + autoplay=1 */}
              <SpotifyEmbed trackId={song.spotifyId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
export default function Playlist() {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  function handleToggle(i) {
    setOpenIndex(prev => (prev === i ? null : i));
  }

  return (
    <>
      <FontLink />
      <ReadingProgress />

      {/* Noise texture */}
      <div aria-hidden="true" style={{
        position: "fixed", inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px", opacity: 0.04, pointerEvents: "none", zIndex: 0,
      }} />

      <main style={{ minHeight: "100vh", background: "var(--bg)", position: "relative", zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "3.5rem 1.5rem 0" }}>
          <BackButton />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            style={{
              fontFamily: "'Jost', sans-serif", fontWeight: 200,
              fontSize: "0.6rem", letterSpacing: "0.42em", textTransform: "uppercase",
              color: "var(--muted)", marginTop: "2.5rem", marginBottom: "1.2rem",
            }}
          >
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
              fontSize: "clamp(2.4rem, 7vw, 4.2rem)", lineHeight: 1.05,
              color: "var(--ink)", margin: 0, letterSpacing: "-0.01em",
            }}
          >
            Soundtrack untuk<br />
            <em style={{ color: "var(--gold2)" }}>Ghitsa</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            style={{
              fontFamily: "'Jost', sans-serif", fontWeight: 200,
              fontSize: "0.85rem", color: "var(--muted)",
              marginTop: "1rem", letterSpacing: "0.04em", lineHeight: 1.6,
            }}
          >
            lagu-lagu yang cocok banget buat kamu.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              marginTop: "2.5rem", height: "1px",
              background: "linear-gradient(to right, transparent, var(--gold2) 40%, var(--gold2) 60%, transparent)",
              transformOrigin: "left",
            }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
            style={{
              fontFamily: "'Jost', sans-serif", fontWeight: 200,
              fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase",
              color: "rgba(139,94,60,0.5)", marginTop: "1.2rem", textAlign: "right",
            }}
          >
            ketuk untuk memutar & membaca alasannya
          </motion.p>
        </div>

        {/* ── Song list ── */}
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0.5rem 1.5rem 5rem" }}>
          {SONGS.map((song, i) => (
            <SongCard
              key={i}
              song={song}
              index={i}
              isOpen={openIndex === i}
              onClick={() => handleToggle(i)}
            />
          ))}

          {/* Footer ornament */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            style={{
              textAlign: "center", marginTop: "3.5rem",
              paddingTop: "2.5rem", borderTop: "1px solid var(--border)",
            }}
          >
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
              color: "var(--gold)", opacity: 0.7,
            }}>
              — semoga lagunya cocok —
            </span>
          </motion.div>
        </div>
      </main>
    </>
  );
}