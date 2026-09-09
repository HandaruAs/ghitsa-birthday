import { Routes, Route, Navigate } from "react-router-dom";
// Ubah "landing" menjadi "Landing" agar konsisten (PascalCase)
import Landing from "./pages/Landing"; 
import Birthday from "./pages/Birthday";
import Quiz from "./pages/Quiz";
import EighteenThings from "./pages/EighteenThings";
import SecretLetter from "./pages/SecretLetter";
import Playlist from "./pages/Playlist";
import PolaroidWall from "./pages/PolaroidWall";

export default function App() {
  return (
    <Routes>
      {/* Main routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/birthday" element={<Birthday />} />
      
      {/* New interactive features */}
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/18-things" element={<EighteenThings />} />
      <Route path="/secret-letter" element={<SecretLetter />} />
      <Route path="/playlist" element={<Playlist />} />
      <Route path="/polaroid" element={<PolaroidWall />} />
      
      {/* Fallback route (jika URL salah) */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}