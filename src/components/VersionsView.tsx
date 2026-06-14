import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { filmVersions } from "../data/bladeRunnerData";
import { Film, CheckCircle, Flame, Star, StarOff } from "lucide-react";
import CommentsSection from "./CommentsSection";

const versionImages: Record<string, { url: string; label: string }> = {
  workprint: {
    url: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=800",
    label: "Numérisation brute analogique (Workprint)"
  },
  us_theatrical: {
    url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=800",
    label: "Le 'Happy Ending' imposé des forêts vertes"
  },
  international_theatrical: {
    url: "https://images.unsplash.com/photo-1505673542670-a5e3ff5b14a3?auto=format&fit=crop&q=80&w=800",
    label: "Violence viscérale accrue dans les ruelles sombres"
  },
  directors_cut: {
    url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800",
    label: "Le rêve transcendantal de la licorne blanche"
  },
  final_cut: {
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    label: "Restauration 4K ultime et perfection numérique"
  }
};

export default function VersionsView() {
  const [selectedId, setSelectedId] = useState(filmVersions[4].id); // Default to Final Cut

  // Sound capability
  const playBeep = () => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem("bladeRunner_soundEnabled") === "false") return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (_) {}
  };

  // State hooks for ratings
  const [allRatings, setAllRatings] = useState<{ [key: string]: { average: number; count: number } }>({});
  const [userId, setUserId] = useState("");
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const fetchRatings = async () => {
    try {
      const response = await fetch("/api/ratings");
      const data = await response.json();
      if (data.success && data.ratings) {
        setAllRatings(data.ratings);
      }
    } catch (err) {
      console.error("[VersionsView] Error fetching ratings:", err);
    }
  };

  useEffect(() => {
    let uId = localStorage.getItem("bladeRunner_userId");
    if (!uId) {
      uId = "user_" + Math.random().toString(36).substring(2, 12);
      localStorage.setItem("bladeRunner_userId", uId);
    }
    setUserId(uId);
    fetchRatings();
  }, []);

  const handleRatingSubmit = async (versionId: string, ratingValue: number) => {
    if (!userId) return;
    try {
      playBeep();
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetId: versionId,
          targetType: "version",
          rating: ratingValue,
          userId
        })
      });
      const data = await response.json();
      if (data.success) {
        await fetchRatings();
      }
    } catch (err) {
      console.error("[VersionsView] Error casting rating:", err);
    }
  };

  const selectedVersion = filmVersions.find((v) => v.id === selectedId) || filmVersions[4];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-left border-b border-gray-900 pb-4">
        <h1 className="text-2xl md:text-3xl font-display font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase leading-none">
          LES VERSIONS DU FILM
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          L'histoire mouvementée de la production de Ridley Scott a donné naissance à 5 versions distinctes. Donnez votre avis et notez-les.
        </p>
      </div>

      {/* Grid selector + detail layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Selector (cols: 5) */}
        <div className="lg:col-span-5 space-y-3">
          {filmVersions.map((version) => {
            const isSelected = version.id === selectedId;
            const rates = allRatings[version.id] || { average: 0, count: 0 };
            return (
              <button
                key={version.id}
                onClick={() => {
                  playBeep();
                  setSelectedId(version.id);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-start space-x-3 group relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-gray-900 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "bg-gray-900/30 border-gray-800 hover:border-cyan-500/30 hover:bg-gray-900/60"
                }`}
              >
                {/* Accent glow on selected */}
                {isSelected && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400"></div>
                )}
                
                <Film className={`h-5 w-5 mt-0.5 shrink-0 transition-colors ${isSelected ? "text-cyan-400" : "text-gray-400 group-hover:text-cyan-300"}`} />
                
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-950/80 border border-gray-850 text-gray-400">
                        {version.year}
                      </span>
                      <span className="text-xs font-mono text-gray-500">
                        {version.duration}
                      </span>
                    </div>

                    {/* Mini rating indicator on sidebar */}
                    <div className="flex items-center space-x-1 font-mono text-[9px] text-cyan-450">
                      <Star className={`h-3 w-3 ${rates.count > 0 ? "fill-cyan-400 text-cyan-455" : "text-gray-700"}`} />
                      <span>{rates.count > 0 ? rates.average : "—"}</span>
                    </div>
                  </div>
                  <h3 className={`text-xs md:text-sm font-semibold font-display tracking-wide transition-colors ${isSelected ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
                    {version.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Window (cols: 7) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedVersion.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900/40 border border-gray-800/80 rounded-xl p-6 md:p-8 space-y-6 backdrop-blur-md relative overflow-hidden h-full flex flex-col justify-between"
            >
              {/* Scanline grid texture inside detail window */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_95%,rgba(6,182,212,0.03)_95%)] bg-[size:100%_24px] pointer-events-none"></div>

              <div className="space-y-6">
                {/* Header info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800 pb-4 gap-4 text-left">
                  <div>
                    <h2 className="text-lg md:text-xl font-display font-bold text-white tracking-widest uppercase">
                      {selectedVersion.title}
                    </h2>
                    <span className="text-xs font-mono text-cyan-400 mt-1 block">
                      PROJECTION : {selectedVersion.year} • DURÉE : {selectedVersion.duration}
                    </span>
                  </div>
                  <div className="bg-cyan-950/60 border border-cyan-400/40 px-3 py-1 rounded text-center shrink-0">
                    <span className="block text-[9px] uppercase font-mono tracking-widest text-cyan-400 text-left md:text-center">NOTE DU RAPPORT</span>
                    <span className="text-xs font-display font-semibold text-white">
                      {allRatings[selectedVersion.id] ? `${allRatings[selectedVersion.id].average} / 5` : "SANS NOTE"}
                    </span>
                  </div>
                </div>

                {/* Star-Rating Interactivity Widget */}
                <div className="p-4 bg-cyan-955/10 border border-cyan-500/15 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                  <div className="space-y-0.5">
                    <strong className="block font-mono text-[9px] text-cyan-400 tracking-wider uppercase font-bold">ATTRIBUER UNE NOTE EXISTENTIELLE :</strong>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {allRatings[selectedVersion.id]?.count || 0} avis collectés sur ce rapport de mission.
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const isStarsGoldVal = hoveredStar !== null ? starVal <= hoveredStar : starVal <= (allRatings[selectedVersion.id]?.average || 0);
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => handleRatingSubmit(selectedVersion.id, starVal)}
                          onMouseEnter={() => setHoveredStar(starVal)}
                          onMouseLeave={() => setHoveredStar(null)}
                          className="p-1 hover:text-cyan-400 text-cyan-500/30 transition-colors cursor-pointer"
                        >
                          <Star className={`h-5 w-5 ${isStarsGoldVal ? "fill-cyan-400 text-cyan-300" : "text-gray-700"}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Archivage visuel spécifique à la version */}
                <div className="relative h-44 rounded-xl overflow-hidden border border-gray-800/80 bg-gray-950">
                  <img
                    src={versionImages[selectedVersion.id]?.url}
                    alt={selectedVersion.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 bg-black/80 border border-cyan-500/20 px-2 py-1 rounded text-[10px] font-mono text-cyan-400 text-left">
                    {versionImages[selectedVersion.id]?.label}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed text-left font-sans">
                  {selectedVersion.description}
                </p>

                {/* Differences */}
                <div className="space-y-3 text-left">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block border-b border-gray-800/40 pb-1">
                    Différences Majeures détectées :
                  </span>
                  <ul className="space-y-2.5">
                    {selectedVersion.keyDifferences.map((diff, index) => (
                      <li key={index} className="flex items-start space-x-2.5 text-xs text-gray-300 font-sans">
                        <CheckCircle className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
                        <span>{diff}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Significance/Legacy note */}
              <div className="mt-8 pt-4 border-t border-gray-800/60 flex items-start space-x-3 bg-gray-950/40 p-4 rounded-lg border border-cyan-500/5 text-left">
                <Flame className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-yellow-500 block">IMPACT ET SIGNIFICATION HISTORIQUE :</span>
                  <p className="text-xs text-gray-400 italic">
                    {selectedVersion.importance}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Section Commentaires pour les différentes versions */}
      <CommentsSection pageId="versions" />
    </motion.div>
  );
}
