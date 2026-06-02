import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";
import Navigation, { NavTab } from "./components/Navigation";
import FilmView from "./components/FilmView";
import GalleryView from "./components/GalleryView";
import VersionsView from "./components/VersionsView";
import BookVsMovieView from "./components/BookVsMovieView";
import MakingOfView from "./components/MakingOfView";
import ActorsView from "./components/ActorsView";
import ContactView from "./components/ContactView";
import VoightKampffView from "./components/VoightKampffView";
import DevenusView from "./components/DevenusView";
import SuiteView from "./components/SuiteView";
import DiagnosticConsole from "./components/DiagnosticConsole";
import { Eye, Shield, Radio, Menu, Clock, Volume2, VolumeX, Music, SlidersHorizontal } from "lucide-react";

export type FilterPreset = "standard" | "sepia" | "cyberpunk" | "vintage";


// Synthesizer running continuous low-frequency lo-fi ambient drone
class AmbientDrone {
  private ctx: AudioContext | null = null;
  private oscs: OscillatorNode[] = [];
  private filter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private gain: GainNode | null = null;

  start() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      
      this.gain = this.ctx.createGain();
      this.gain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.gain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 2.5); // Fades in beautifully
      
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.Q.setValueAtTime(3.5, this.ctx.currentTime);
      this.filter.frequency.setValueAtTime(125, this.ctx.currentTime);

      // Low frequency notes model for dark, industrial drone space (C1, G1, C2)
      const pitches = [65.41, 98.00, 130.81];
      pitches.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        osc.type = idx % 2 === 0 ? "sawtooth" : "triangle";
        // Distinct micro-detuning creates gorgeous chorusing/pulsing
        osc.frequency.setValueAtTime(freq + (idx * 0.22 - 0.22), this.ctx!.currentTime);
        osc.connect(this.filter!);
        osc.start();
        this.oscs.push(osc);
      });

      // Ultra-slow LFO sweep simulation
      this.lfo = this.ctx.createOscillator();
      this.lfo.type = "sine";
      this.lfo.frequency.setValueAtTime(0.07, this.ctx.currentTime); // ~14 seconds cycle

      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.setValueAtTime(40, this.ctx.currentTime); // +/- 40Hz range sweep

      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.filter.frequency);
      this.lfo.start();

      this.filter.connect(this.gain);
      this.gain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Ambient AudioContext denied or failed:", e);
    }
  }

  stop() {
    try {
      if (this.gain && this.ctx) {
        const cur = this.ctx.currentTime;
        this.gain.gain.setValueAtTime(this.gain.gain.value, cur);
        this.gain.gain.exponentialRampToValueAtTime(0.001, cur + 1.0); // Smooth 1-second decay
        
        const activeOscs = [...this.oscs];
        if (this.lfo) activeOscs.push(this.lfo);
        
        setTimeout(() => {
          activeOscs.forEach(o => {
            try { o.stop(); } catch(err) {}
          });
          try { this.ctx?.close(); } catch(err) {}
        }, 1100);
      }
    } catch (e) {
      console.error(e);
    }
    this.oscs = [];
    this.ctx = null;
    this.lfo = null;
    this.gain = null;
    this.filter = null;
  }
}

export default function App() {
  const [currentTab, setTab] = useState<NavTab>("film");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [systemTime, setSystemTime] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bladeRunner_soundEnabled");
      return saved !== "false";
    }
    return true;
  });
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const droneRef = useRef<AmbientDrone | null>(null);
  const [filterPreset, setFilterPreset] = useState<FilterPreset>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bladeRunner_filterPreset");
      return (saved as FilterPreset) || "standard";
    }
    return "standard";
  });

  const filterPresetsList: { id: FilterPreset; label: string; info: string }[] = [
    { id: "standard", label: "STANDARD", info: "Original LAPD" },
    { id: "sepia", label: "SEPIA NEO-NOIR", info: "Poussière rétro" },
    { id: "cyberpunk", label: "CYBERPUNK CHROME", info: "Chrome néon contrasté" },
    { id: "vintage", label: "B&W VINTAGE REEL", info: "Grayscale 1982 noir" }
  ];

  const cycleFilterPreset = () => {
    const currentIndex = filterPresetsList.findIndex(p => p.id === filterPreset);
    const nextIndex = (currentIndex + 1) % filterPresetsList.length;
    const nextPreset = filterPresetsList[nextIndex].id;
    setFilterPreset(nextPreset);
    if (typeof window !== "undefined") {
      localStorage.setItem("bladeRunner_filterPreset", nextPreset);
    }
    playConfirmBeep(soundEnabled);
  };

  const toggleAmbient = () => {
    const nextVal = !ambientEnabled;
    setAmbientEnabled(nextVal);
    
    if (nextVal) {
      if (!droneRef.current) {
        droneRef.current = new AmbientDrone();
      }
      droneRef.current.start();
    } else {
      if (droneRef.current) {
        droneRef.current.stop();
        droneRef.current = null;
      }
    }
    
    playConfirmBeep(soundEnabled);
  };

  useEffect(() => {
    return () => {
      if (droneRef.current) {
        droneRef.current.stop();
      }
    };
  }, []);

  // Updates real-time UTC clock in typical military console formatting
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(
        now.toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "2-digit" }).toUpperCase() +
        " // " +
        now.toLocaleTimeString("fr-FR", { hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const playConfirmBeep = (enabled: boolean) => {
    if (!enabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    if (typeof window !== "undefined") {
      localStorage.setItem("bladeRunner_soundEnabled", String(nextVal));
    }
    playConfirmBeep(nextVal);
  };

  // Renders the correct view matching state
  const renderContent = () => {
    switch (currentTab) {
      case "film":
        return <FilmView />;
      case "galerie":
        return <GalleryView />;
      case "versions":
        return <VersionsView />;
      case "book":
        return <BookVsMovieView />;
      case "makingof":
        return <MakingOfView />;
      case "actors":
        return <ActorsView />;
      case "devenus":
        return <DevenusView />;
      case "suite":
        return <SuiteView />;
      case "contact":
        return <ContactView />;
      case "vk":
        return <VoightKampffView />;
      default:
        return <FilmView />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col crt-effect relative selection:bg-cyan-500/30 selection:text-white filter-${filterPreset}`}>
      {/* Visual cyber-rain background overlay */}
      <div className="absolute inset-0 cyber-rain z-0 pointer-events-none opacity-40"></div>

      {/* Top LAPD Mainframe Terminal Header Navbar */}
      <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur border-b border-cyan-500/10 h-16 px-6 flex items-center justify-between select-none shrink-0">
        
        {/* Brand Left corner */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flicker-effect shadow-[0_0_10px_rgba(6,182,212,0.15)]">
            <Shield className="h-4.5 w-4.5" />
          </div>
          <div>
            <h1 className="text-sm font-display font-black tracking-widest text-white leading-none uppercase">
              BLADE RUNNER
            </h1>
            <span className="text-[9px] font-mono tracking-widest uppercase text-cyan-500">
              LAPD MAIN RESECTION
            </span>
          </div>
        </div>

        {/* Right side container: Sound Toggle, Desktop Stats, and Mobile triggers */}
        <div className="flex items-center space-x-3 md:space-x-5">
          {/* Time and stats Indicators Desktop */}
          <div className="hidden md:flex items-center space-x-6 text-[10px] font-mono text-gray-500">
            <div className="flex items-center space-x-1.5 text-cyan-400">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span className="uppercase tracking-widest font-semibold text-[9px]">DIAGNOSTIC : COHÉRENCE OK</span>
            </div>
            <div className="flex items-center space-x-1.5 border-l border-gray-800 pl-6 text-gray-400">
              <Clock className="h-3.5 w-3.5 text-cyan-500/70" />
              <span>{systemTime}</span>
            </div>
          </div>

          {/* Cinematic Filter Toggle */}
          <button
            onClick={cycleFilterPreset}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 border rounded-lg font-mono text-[9px] md:text-[10px] uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              filterPreset !== "standard"
                ? "bg-purple-950/40 border-purple-500/40 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                : "bg-gray-900 border-gray-800 text-gray-500 hover:text-gray-400 hover:border-gray-700"
            }`}
            title={`Cycle de gradation de couleur: ${filterPresetsList.find(p => p.id === filterPreset)?.info}`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="font-bold">
              {filterPresetsList.find(p => p.id === filterPreset)?.label}
            </span>
          </button>

          {/* Low-frequency ambient synth drone track sound controller */}
          <button
            onClick={toggleAmbient}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 border rounded-lg font-mono text-[9px] md:text-[10px] uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              ambientEnabled
                ? "bg-amber-950/40 border-amber-500/40 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)] animate-pulse"
                : "bg-gray-900 border-gray-800 text-gray-500 hover:text-gray-400 hover:border-gray-700"
            }`}
            title={ambientEnabled ? "Couper l'ambiance sonore" : "Activer l'ambiance sonore de fond"}
          >
            <Music className={`h-3.5 w-3.5 ${ambientEnabled ? "text-amber-400 animate-spin [animation-duration:12s]" : "text-gray-500"}`} />
            <span className="font-bold">{ambientEnabled ? "DRONE ON" : "DRONE OFF"}</span>
          </button>

          {/* Tactical Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 border rounded-lg font-mono text-[9px] md:text-[10px] uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              soundEnabled
                ? "bg-cyan-950/40 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                : "bg-gray-900 border-gray-800 text-gray-500"
            }`}
            title={soundEnabled ? "Couper l'audio de l'interface" : "Activer l'audio de l'interface"}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
                <span className="font-bold">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5 text-gray-500" />
                <span className="font-semibold">AUDIO MUTÉ</span>
              </>
            )}
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-cyan-500/30 cursor-pointer flex items-center justify-center"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Desktop Main Dashboard Framework */}
      <div className="flex-grow flex relative z-10 z-index-10 max-w-7xl w-full mx-auto">
        {/* Nav list sidebar */}
        <Navigation
          currentTab={currentTab}
          setTab={setTab}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Main interactive terminal dashboard box with built-in Diagnostic Console */}
        <main className="flex-grow p-6 md:p-8 lg:p-10 overflow-x-hidden min-w-0 flex flex-col justify-between space-y-6">
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              <div key={currentTab} className="h-full">
                {renderContent()}
              </div>
            </AnimatePresence>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-900/40 w-full shrink-0">
            <DiagnosticConsole />
          </div>
        </main>
      </div>
    </div>
  );
}
