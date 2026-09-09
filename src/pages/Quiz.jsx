// src/pages/Quiz.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUESTIONS = [
  {
    question: "Ghitsa lahir tanggal berapa?",
    options: ["9 September 2006", "9 September 2007", "10 September 2006", "8 September 2006"],
    correct: 0,
  },
  {
    question: "Apa warna favorit Ghitsa?",
    options: ["Hitam", "Putih", "Biru", "Pink"],
    correct: 2,
  },
  {
    question: "Hobi Ghitsa di waktu luang?",
    options: ["Membaca", "Menulis puisi", "Mendengarkan musik", "Semua benar"],
    correct: 3,
  },
  {
    question: "Ghitsa lebih cocok disebut...",
    options: ["Ekstrovert", "Introvert", "Ambivert", "Tergantung suasana"],
    correct: 1,
  },
  {
    question: "Minuman favorit Ghitsa?",
    options: ["Kopi", "Teh", "Jus jeruk", "Air putih"],
    correct: 1,
  },
];

export default function Quiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleAnswer = (idx) => {
    setSelected(idx);
    const isCorrect = idx === QUESTIONS[currentQ].correct;
    setFeedback(isCorrect ? "✅ Benar!" : "❌ Kurang tepat nih...");

    setTimeout(() => {
      const newAnswers = [...answers, isCorrect];
      setAnswers(newAnswers);
      setSelected(null);
      setFeedback(null);

      if (currentQ + 1 < QUESTIONS.length) {
        setCurrentQ(currentQ + 1);
      } else {
        setShowResult(true);
      }
    }, 1200);
  };

  const score = answers.filter((a) => a === true).length;
  const reset = () => {
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
    setSelected(null);
    setFeedback(null);
  };

  if (showResult) {
    let message = "";
    if (score === QUESTIONS.length) message = "Wow! Kamu sahabat sejati Ghitsa! 💛";
    else if (score >= 3) message = "Cukup kenal! Mungkin perlu lebih sering ngobrol. 😊";
    else message = "Ayo lebih dekat lagi dengan Ghitsa! Semangat! 🌟";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 px-6 max-w-lg mx-auto"
      >
        <h2 className="font-['Cormorant_Garamond'] text-3xl mb-4" style={{ color: "var(--gold)" }}>
          Skor Kamu: {score} / {QUESTIONS.length}
        </h2>
        <p className="font-['Jost'] text-lg mb-8" style={{ color: "var(--ink)" }}>
          {message}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 text-sm tracking-wide uppercase font-['Jost']"
          style={{ border: "1px solid var(--gold)", color: "var(--gold)", background: "transparent" }}
        >
          Ulang Quiz
        </button>
      </motion.div>
    );
  }

  return (
    <div className="py-12 px-6 max-w-lg mx-auto">
      <div className="mb-8 text-center">
        <span className="text-xs tracking-[0.3em] uppercase font-['Jost']" style={{ color: "var(--muted)" }}>
          Pertanyaan {currentQ + 1} / {QUESTIONS.length}
        </span>
      </div>

      <motion.h3
        key={currentQ}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="font-['Cormorant_Garamond'] text-2xl text-center mb-8"
        style={{ color: "var(--ink)" }}
      >
        {QUESTIONS[currentQ].question}
      </motion.h3>

      <div className="space-y-3">
        {QUESTIONS[currentQ].options.map((opt, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswer(idx)}
            disabled={selected !== null}
            className="w-full p-4 text-left font-['Jost'] transition-all"
            style={{
              border: selected === idx ? "2px solid var(--gold)" : "1px solid rgba(201,169,110,0.3)",
              background: selected === idx ? "rgba(201,169,110,0.1)" : "transparent",
              color: "var(--ink)",
              borderRadius: "2px",
            }}
          >
            {opt}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center mt-6 font-['Jost'] text-sm"
            style={{ color: "var(--gold)" }}
          >
            {feedback}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}