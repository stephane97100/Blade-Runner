import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { actorsData } from "../data/bladeRunnerData";
import { Actor } from "../types";
import { Sparkles, Eye, ShieldAlert, Crosshair, Volume2, Database, ShieldX, Star } from "lucide-react";
import TerminalLoader from "./TerminalLoader";

interface ActorsViewProps {
  initialActorId?: string | null;
  onClearInitialActorId?: () => void;
}

export default function ActorsView({ initialActorId, onClearInitialActorId }: ActorsViewProps) {
  const [loading, setLoading] = useState(true);
  const [actors, setActors] = useState<Actor[]>(actorsData);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [esperPhase, setEsperPhase] = useState<"none" | "calculating" | "zooming" | "enhanced">("none");
  const [esperCoords, setEsperCoords] = useState({ x: 0, y: 0 });
  const [noiseVal, setNoiseVal] = useState<string>("0.000");

  // Ratings states
  const [allRatings, setAllRatings] = useState<{ [key: string]: { average: number; count: number } }>({});
  const [userId, setUserId] = useState("");
  const [userHoveredStar, setUserHoveredStar] = useState<number | null>(null);

  // Plays a retro mechanical synth beep using Web Audio API
  const playSynthBeep = (freq: number, type: OscillatorType, duration: number) => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem("bladeRunner_soundEnabled") === "false") return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context may be blocked by policy, fail silently
    }
  };

  const triggerEsperScan = (actor: Actor) => {
    playSynthBeep(180, "sawtooth", 0.15);
    setSelectedActor(actor);
    setEsperPhase("calculating");
    
    // Simulate flickering coordinates
    let steps = 0;
    const interval = setInterval(() => {
      setEsperCoords({
        x: Math.floor(Math.random() * 800) + 100,
        y: Math.floor(Math.random() * 800) + 100
      });
      setNoiseVal((Math.random() * 0.999).toFixed(3));
      playSynthBeep(440 + Math.random() * 200, "square", 0.04);
      steps++;
      if (steps > 15) {
        clearInterval(interval);
        setEsperCoords({ x: actor.coordinates.x, y: actor.coordinates.y });
        setEsperPhase("zooming");
        
        // Sequence phase 2: zoom, play deep scan synth sweeping beeps
        playSynthBeep(330, "sine", 0.4);
        setTimeout(() => {
          setEsperPhase("enhanced");
          playSynthBeep(880, "sine", 0.3);
        }, 1200);
      }
    }, 80);
  };

  const closeEsper = () => {
    setSelectedActor(null);
    setEsperPhase("none");
  };

  // Status Badge Colors helper
  const getStatusBadge = (status: Actor["status"]) => {
    switch (status) {
      case "Réplicant":
        return "bg-red-950/80 border border-red-500/60 text-red-400";
      case "Humain":
        return "bg-emerald-950/80 border border-emerald-500/60 text-emerald-400";
      default:
        return "bg-yellow-950/80 border border-yellow-500/60 text-yellow-500";
    }
  };

  // Fetch dynamic actors list from server API
  const fetchActors = async () => {
    try {
      const response = await fetch("/api/actors");
      const data = await response.json();
      if (data.success && data.items) {
        setActors(data.items);
      }
    } catch (err) {
      console.error("[ActorsView] Error fetching actors:", err);
    }
  };

  // Grab ratings and construct userId on mount
  const fetchRatings = async () => {
    try {
      const response = await fetch("/api/ratings");
      const data = await response.json();
      if (data.success && data.ratings) {
        setAllRatings(data.ratings);
      }
    } catch (err) {
      console.error("[ActorsView] Error fetching ratings:", err);
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
    fetchActors();
  }, []);

  // Control from external trigger (e.g., Search Clicked)
  useEffect(() => {
    if (initialActorId) {
      const match = actors.find((a) => a.id === initialActorId);
      if (match) {
        // Trigger ESPER after loader completes
        if (!loading) {
          triggerEsperScan(match);
          if (onClearInitialActorId) onClearInitialActorId();
        }
      }
    }
  }, [initialActorId, loading, actors]);

  const handleStarRatingClick = async (targetId: string, ratingVal: number) => {
    if (!userId) return;
    try {
      playSynthBeep(700, "sine", 0.15);
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetId,
          targetType: "character",
          rating: ratingVal,
          userId
        })
      });
      const data = await response.json();
      if (data.success) {
        await fetchRatings();
      }
    } catch (err) {
      console.error("[ActorsView] Error submitting rating:", err);
    }
  };

  if (loading) {
    return (
      <TerminalLoader
        onComplete={() => setLoading(false)}
        targetDataName="FICHIERS DE SUSPECTS LAPD & ENREGISTREMENTS PHOTOS ESPER"
      />
    );
  }

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
          LES ACTEURS ET DOSSIERS LAPD
        </h1>
        <p className="text-gray-400 text-[11px] font-mono mt-1 uppercase">
          Sélectionnez un dossier de suspect ci-dessous pour lancer l'analyseur photographique <strong className="text-cyan-400 font-bold uppercase tracking-widest font-display">ESPER</strong> et attribuer votre notation.
        </p>
      </div>

      {/* Grid of Actors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {actors.map((actor) => {
          const ratingInfo = allRatings[actor.id] || { average: 0, count: 0 };
          return (
            <div
              key={actor.id}
              onClick={() => triggerEsperScan(actor)}
              className="group bg-gray-950 border border-gray-800 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transform hover:-translate-y-1 text-left flex flex-col justify-between"
            >
              {/* Portrait box */}
              <div className="h-64 overflow-hidden relative border-b border-gray-800">
                <img
                  src={actor.portraitUrl}
                  alt={actor.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
                
                {/* Overlay Crosshair targeting ESPER scan */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 border border-dashed border-cyan-400 rounded-full flex items-center justify-center animate-spin-slow">
                    <Crosshair className="h-5 w-5 text-cyan-400" />
                  </div>
                </div>

                {/* Status on visual label */}
                <div className={`absolute top-3 right-3 text-[10px] uppercase font-mono px-2 py-0.5 rounded ${getStatusBadge(actor.status)}`}>
                  {actor.status}
                </div>
              </div>

              {/* Actor basic info */}
              <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">{actor.character}</span>
                  <h3 className="text-base font-display font-bold text-white uppercase group-hover:text-cyan-300 transition-colors">
                    {actor.name}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                    {actor.role}
                  </p>
                </div>

                {/* Display Average rating stars on the card */}
                <div className="pt-3 border-t border-gray-900/40 flex items-center justify-between text-[10px] font-mono text-gray-500">
                  <span className="flex items-center gap-1">
                    <Star className={`h-3.5 w-3.5 ${ratingInfo.count > 0 ? "fill-cyan-400 text-cyan-400" : "text-gray-600"}`} />
                    <span className={ratingInfo.count > 0 ? "text-cyan-300 font-bold" : ""}>
                      {ratingInfo.count > 0 ? `${ratingInfo.average} / 5` : "SANS NOTE"}
                    </span>
                  </span>
                  <span>{ratingInfo.count > 0 ? `${ratingInfo.count} VOTE(S)` : "0 VOTE"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ESPER Interactive Viewport Overlay Modal */}
      <AnimatePresence>
        {selectedActor && (
          <div className="fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-md overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-5xl bg-gray-900 border border-cyan-500/30 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.25)] relative"
            >
              {/* Scanline CRT overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_97%,rgba(6,182,212,0.06)_97%)] bg-[size:100%_12px] opacity-60 pointer-events-none"></div>

              {/* Header block with red alerts */}
              <div className="bg-gray-950 border-b border-cyan-500/20 px-6 py-4 flex items-center justify-between text-cyan-400 relative z-10">
                <div className="flex items-center space-x-2">
                  <Crosshair className="h-5 w-5 animate-pulse text-red-400" />
                  <span className="font-display font-black tracking-widest uppercase text-xs md:text-sm lg:text-base">
                    ESP SYSTEM ANALYZER // V09-TRACK
                  </span>
                </div>
                <button
                  onClick={closeEsper}
                  className="font-mono text-[10px] md:text-xs text-red-400 hover:text-red-300 border border-red-500/35 px-3 py-1 rounded bg-red-950/20 transition-colors uppercase cursor-pointer font-bold"
                >
                  Fermer la console
                </button>
              </div>

              {/* Grid content container */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                
                {/* Visual Viewport Frame (cols: 6) */}
                <div className="lg:col-span-6 aspect-[4/3] bg-black border border-gray-800 rounded-lg overflow-hidden relative shadow-inner">
                  {esperPhase === "calculating" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-cyan-950/25 z-20 font-mono text-cyan-400 font-bold text-center p-4">
                      <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-full animate-pulse mb-3">
                        <Crosshair className="h-8 w-8 text-cyan-400" />
                      </div>
                      <span className="text-xs uppercase tracking-widest animate-pulse font-black text-white">RECONTRIBUTION GÉOMÉTRIQUE</span>
                      <p className="text-[10px] text-cyan-500/80 mt-1 uppercase">GRID REF DETECTED: X{esperCoords.x} Y{esperCoords.y}</p>
                      <p className="text-[10px] text-cyan-550 mt-1">INTENSITÉ DE BRUIT : {noiseVal} db</p>
                    </div>
                  )}

                  {esperPhase === "zooming" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-cyan-950/30 z-20 font-mono text-cyan-400 font-bold text-center whitespace-nowrap">
                      <span className="text-cyan-300 animate-ping">● ZOOM AUTOMATIQUE DE SELECTION ●</span>
                      <p className="text-[9px] uppercase tracking-wider text-gray-500 mt-2">ALINÉATION DES CRISTAUX DE SILICIUM EXTREME</p>
                    </div>
                  )}

                  {/* Main display based on enhanced status */}
                  <div className={`w-full h-full relative flex items-center justify-center transition-all duration-300 overflow-hidden ${esperPhase === "enhanced" ? "" : "filter blur-sm brightness-50"}`}>
                    <img
                      src={selectedActor.archivalRepresentation}
                      alt={selectedActor.character}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-[1200ms] ease-in-out"
                      style={{
                        transformOrigin: `${(selectedActor.coordinates.x / 600) * 100}% ${(selectedActor.coordinates.y / 400) * 100}%`,
                        transform: esperPhase === "enhanced" 
                          ? `scale(${selectedActor.coordinates.zoom || 3.5})` 
                          : esperPhase === "zooming" 
                            ? "scale(1.8) rotate(0.5deg)" 
                            : "scale(1)"
                      }}
                    />

                    {/* Camera crosshair targeting indicators */}
                    <div className="absolute top-8 left-8 text-cyan-400 font-mono text-xs">
                      [L=092 R=849]
                    </div>
                    <div className="absolute top-8 right-8 text-cyan-400 font-mono text-xs">
                      [F=0.48 db]
                    </div>
                    <div className="absolute bottom-8 left-8 text-cyan-400 font-mono text-[10px]">
                      GRID COORD: X{selectedActor.coordinates.x} • Y{selectedActor.coordinates.y}
                    </div>

                    {/* Laser scanning lines over image */}
                    <div className="absolute inset-0">
                      <div className="scanline-element"></div>
                    </div>
                  </div>

                  {/* Overlaid Corner Sights */}
                  <div className="absolute inset-4 pointer-events-none border border-cyan-500/10 rounded-sm">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
                  </div>
                </div>

                {/* Actor Profile Detailed Dossier (cols: 6) */}
                <div className="lg:col-span-6 space-y-6 flex flex-col justify-between text-left">
                  {esperPhase !== "enhanced" ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border border-dashed border-gray-850 bg-gray-950/40 rounded-lg text-gray-500 h-full">
                      <Database className="h-8 w-8 text-cyan-900 mb-2 animate-bounce" />
                      <p className="text-xs font-mono uppercase tracking-widest text-cyan-800">EN ATTENTE DU SIGNAL DE RE-CONSTRUCTION</p>
                      <p className="text-[10px] text-gray-750 mt-1 uppercase">L'image brute est en cours d'alignement géométrique par le sous-processeur graphique.</p>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-5"
                    >
                      {/* Character and actor names */}
                      <div className="space-y-1 pb-3 border-b border-gray-850">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold bg-cyan-950/60 px-2.5 py-0.5 rounded inline-block">
                          SUSPECT IDENTIFIÉ
                        </span>
                        <h2 className="text-2xl font-display font-black text-white uppercase tracking-wider leading-none">
                          {selectedActor.character}
                        </h2>
                        <p className="text-xs font-mono text-gray-400">
                          INTERPRÈTE : <span className="text-white font-bold">{selectedActor.name}</span>
                        </p>
                      </div>

                      {/* Interactive Rating Component */}
                      <div className="p-3.5 bg-cyan-955/15 border border-cyan-500/15 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="uppercase text-cyan-400 tracking-wider font-bold">NOTATION DE L'UNITÉ (1-5 ÉTOILES) :</span>
                          <span className="text-gray-500">
                            {allRatings[selectedActor.id]
                              ? `${allRatings[selectedActor.id].average} / 5 (${allRatings[selectedActor.id].count} vote(s))`
                              : "AUCUNE NOTE"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => {
                              const isLit = userHoveredStar !== null ? star <= userHoveredStar : star <= (allRatings[selectedActor.id]?.average || 0);
                              return (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => handleStarRatingClick(selectedActor.id, star)}
                                  onMouseEnter={() => setUserHoveredStar(star)}
                                  onMouseLeave={() => setUserHoveredStar(null)}
                                  className="p-1 text-cyan-500/40 hover:text-cyan-400 transition-colors cursor-pointer"
                                >
                                  <Star className={`h-5 w-5 ${isLit ? "fill-cyan-400 text-cyan-300" : "text-gray-700 font-light"}`} />
                                </button>
                              );
                            })}
                          </div>
                          <span className="text-[10px] font-mono text-cyan-500/80 uppercase">
                            {userHoveredStar ? `Noter ${userHoveredStar} étoiles` : "Cliquez sur une étoile"}
                          </span>
                        </div>
                      </div>

                      {/* Status / Role row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-950 p-3 rounded-lg border border-gray-850">
                          <span className="text-[9px] uppercase font-mono tracking-widest text-gray-500 block">Classification</span>
                          <span className={`block text-xs font-bold font-display uppercase tracking-wider mt-1 ${
                            selectedActor.status === "Réplicant" ? "text-red-400" :
                            selectedActor.status === "Humain" ? "text-emerald-400" : "text-yellow-500"
                          }`}>
                            {selectedActor.status}
                          </span>
                        </div>
                        <div className="bg-gray-950 p-3 rounded-lg border border-gray-850">
                          <span className="text-[9px] uppercase font-mono tracking-widest text-gray-500 block">Rôle LAPD / Statut</span>
                          <span className="block text-xs font-semibold text-cyan-300 truncate mt-1">
                            {selectedActor.role}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <h4 className="text-[10px] uppercase font-mono tracking-widest text-gray-400 border-b border-gray-850 pb-1">
                          Notice Biologique et Psychologique :
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed font-sans">
                          {selectedActor.description}
                        </p>
                      </div>

                      {/* Secret / Controversy dossier info */}
                      <div className="p-3 bg-red-95) bg-red-950/20 border border-red-500/20 rounded-lg space-y-1 text-left">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-red-400 font-bold block">
                          CONFIDENTIEL LAPD // INDICE CRITIQUE :
                        </span>
                        <p className="text-[11px] text-gray-300 leading-relaxed italic">
                          {selectedActor.secretInfo}
                        </p>
                      </div>

                      {/* Key quote */}
                      <div className="border-l-2 border-cyan-400 pl-4 py-1 italic text-xs text-cyan-205">
                        "{selectedActor.keyQuote}"
                      </div>
                    </motion.div>
                  )}

                  {/* Terminal Footer status info */}
                  <div className="text-[9px] font-mono text-gray-500 border-t border-gray-850 pt-3 flex justify-between uppercase shrink-0">
                    <span>UNITÉ SYSTÈME: ESPER-RECONSTRUCTION-MAIN-LAPD</span>
                    <span>STATUT TRANSMISSION : DECLASSIFIÉ</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
