import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Shield, Database, Terminal, AlertTriangle } from "lucide-react";

interface TerminalLoaderProps {
  onComplete: () => void;
  targetDataName: string;
}

export default function TerminalLoader({ onComplete, targetDataName }: TerminalLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const rawLogs = [
    "LOG: SYSTEM INGRESS DETECTED FROM IP 10.201.92.83",
    "SYS: INITIALIZING LAPD MAINFRAME CONNECTION SECURE v8.1",
    "AUTHENTICATING DIRECTORY ACCESS SCOPES...",
    "DECROOT: DECRYPTING SHA-512 DATA ENVELOPE...",
    "READING BLOCKS [0x8f2d - 0x9a3e] FROM LAPD DISK A...",
    "INTEGRITY STATUS: SIGNATURE VERIFIED BY VEYRON CRYPTO",
    "EXTRACTING DOSSIERS AND RETROSPECTIVE INDICES...",
    "ESTABLISHING STEADY TELEMETRY WITH TYRELL CORP BACKPLANE...",
    "PARSING BIOMETRIC MATRIX AND TRANS-TEMPORAL RECONCILIATIONS...",
    "STREAM COMPLETE. PREPARING LOCAL MEMORY MAP BUFFER...",
    "DECROOT: ACCESS GRANTED. LOCAL RETRIEVAL FULLY AUTHORIZED."
  ];

  useEffect(() => {
    // Generate beep sound when progress increases
    const playBeep = () => {
      try {
        if (typeof window !== "undefined" && localStorage.getItem("bladeRunner_soundEnabled") === "false") return;
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(450 + Math.random() * 100, ctx.currentTime);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch (e) {
        // Safe to ignore
      }
    };

    let elapsed = 0;
    const duration = 2200; // 2.2 seconds simulated reading
    const intervalTime = 40;
    const steps = duration / intervalTime;

    // Distribute logs over time
    const logTimeline = rawLogs.map((log, i) => ({
      text: log,
      time: (duration / (rawLogs.length + 1)) * i + Math.random() * 80
    }));

    const timer = setInterval(() => {
      elapsed += intervalTime;
      const nextProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(nextProgress);

      // Add corresponding logs that should be visible
      const visibleLogs = logTimeline
        .filter((l) => l.time <= elapsed)
        .map((l) => l.text);
      
      setLogs((prev) => {
        if (prev.length < visibleLogs.length) {
          playBeep();
          return visibleLogs;
        }
        return prev;
      });

      if (elapsed >= duration) {
        clearInterval(timer);
        setTimeout(() => {
          onCompleteRef.current();
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Scroll to bottom when logs are updated
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="bg-black/95 text-cyan-400 font-mono p-6 md:p-10 rounded-xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden min-h-[380px] flex flex-col justify-between">
      {/* Scanline overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_97%,rgba(6,182,212,0.08)_97%)] bg-[size:100%_12px] opacity-60 pointer-events-none z-10"></div>
      
      {/* Laser flicker sweep */}
      <div className="absolute left-0 right-0 h-[2px] bg-cyan-500/20 shadow-[0_0_15px_#22d3ee] pointer-events-none z-10 animate-pulse"></div>

      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
        <div className="flex items-center space-x-2 text-xs md:text-sm">
          <Terminal className="h-4.5 w-4.5 text-cyan-500 animate-pulse" />
          <span className="font-bold uppercase tracking-widest text-[11px] md:text-xs">
            LAPD TERMINAL RX-9 // DECRYPTING DATASTREAM
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="text-[10px] uppercase font-bold text-red-500">SECURE SOURCE</span>
        </div>
      </div>

      {/* Main Terminal Output Content Area */}
      <div className="flex-grow my-4 bg-gray-950/80 rounded border border-gray-900 p-4 h-48 overflow-y-auto font-mono text-[10px] md:text-xs leading-relaxed space-y-1.5 scrollbar-thin scrollbar-thumb-cyan-950">
        <div className="text-gray-500">// INITIALIZING SECURE LAPD HANDSHAKE SEQUENCE FOR:</div>
        <div className="text-white font-bold tracking-wider text-xs border-b border-gray-900 pb-1 flex items-center space-x-2">
          <Database className="h-4 w-4 text-cyan-400" />
          <span>{targetDataName}</span>
        </div>
        
        {logs.map((log, i) => (
          <div key={i} className="text-left flex items-start space-x-1">
            <span className="text-cyan-600 shrink-0 select-none">&gt;</span>
            <span className={log.includes("GRANTE") ? "text-green-400 font-bold" : log.includes("LOG:") ? "text-gray-400" : "text-cyan-300"}>
              {log}
            </span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      {/* Bottom Loading Bar and Percentage Row */}
      <div className="space-y-4 pt-1 border-t border-cyan-500/10">
        <div className="flex justify-between items-center text-[10px] md:text-xs font-bold font-mono">
          <span className="text-cyan-500 uppercase tracking-widest animate-pulse">
            CHARGEMENT CANAL NUMÉRIQUE TRADITIONNEL DES FICHIERS...
          </span>
          <span className="text-cyan-300 font-black tracking-tight">{progress}%</span>
        </div>

        {/* Loading Bar Slider Row */}
        <div className="w-full bg-gray-950 border border-cyan-500/20 h-4 rounded-sm overflow-hidden relative p-0.5">
          <div
            className="bg-cyan-500 h-full shadow-[0_0_12px_#22d3ee] transition-all duration-100 ease-out flex items-center justify-end px-1.5"
            style={{ width: `${progress}%` }}
          >
            {progress >= 10 && (
              <span className="text-[8px] text-black font-extrabold select-none tracking-tighter">
                LAPD-SYS
              </span>
            )}
          </div>
        </div>

        {/* Action Skip prompt label */}
        <div className="flex justify-between items-center">
          <span className="text-[9px] text-gray-500 uppercase flex items-center space-x-1.5">
            <Shield className="h-3 w-3 text-cyan-800" />
            <span>ACCÈS SANS SOUVENIR IMPOSE-DIT CONFORME AUX RECOMMANDATIONS DE LA WALLACE CORP</span>
          </span>
          <button
            onClick={onComplete}
            className="text-[10px] font-bold text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-950/20 border border-gray-800 px-3 py-1 rounded transition-colors uppercase font-mono cursor-pointer"
          >
            Passer la simulation [ESC]
          </button>
        </div>
      </div>
    </div>
  );
}
