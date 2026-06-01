import { useState, useEffect, useRef } from "react";
import { Terminal, Shield, Activity, HardDrive } from "lucide-react";

export default function DiagnosticConsole() {
  const [logs, setLogs] = useState<string[]>([
    "SYS: INITIALISANT LE TERMINAL DIAGNOSTIQUE DU LAPD v8.4...",
    "OK : CANAUX DE CORRÉLATION COGATIVE PRÊTS",
    "OK : SYNTH-BEEP DU COMPILATEUR LOCALISÉ ET ADAPTÉ"
  ]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const mockPhrases = [
    "ANALYZING LAPD DATASTREAM — SYNC OK",
    "BIOMETRIC PATTERN CHECK — IRIS DELTA: 0.041%",
    "SYNTH-BEEP MODULE FULLY STANDBY",
    "SCANNING RETRO-DIAGNOSTIC MATRIX SECTORS...",
    "REPLICANT COGNITIVE DRIFT AT 0.12% — SECURE LIMITS",
    "PRE-PROCESSING LORE INDEX DATASETS — CACHE INTACT",
    "VOIGHT-KAMPFF SENSORS CALIBRATION COMPLETED",
    "INTERROGATION EMULATOR CORRELATION ENGINE LIVE",
    "WALLACE CORP DATANODE CONNECTED via VPN-SECURE",
    "RETRIEVING HISTORICAL MEMORY IMPLANTS (SERIES/BOOKS)",
    "SYS TEMP: 41.2°C // FAN SPEED: 4800 RPM // STATUS: STABLE",
    "TYRELL MAINFRAME ENVELOPE ROUTING ACTIVE",
    "DECRYPTING NEW POLICE SUSPECT REPLICANTS DOSSIERS"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
      const timestamp = new Date().toLocaleTimeString("fr-FR", { hour12: false });
      setLogs((prev) => {
        const next = [...prev, `[${timestamp}] ${randomMsg}`];
        if (next.length > 25) next.shift(); // Keep logs clean
        return next;
      });
    }, 4500 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  // Audio-scroll to bottom of diagnostic screen naturally
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-gray-950/90 border border-gray-900 rounded-lg p-3 font-mono text-[9px] text-cyan-500/80 w-full relative overflow-hidden backdrop-blur-md">
      {/* Decorative tiny frame labels */}
      <div className="flex items-center justify-between border-b border-gray-900 pb-1.5 mb-2 select-none">
        <div className="flex items-center space-x-2">
          <Terminal className="h-3 w-3 text-cyan-400 animate-pulse" />
          <span className="font-semibold tracking-wider text-white uppercase text-[8px]">
            LAPD CONSOLE DE DIAGNOSTIC AUTOMATIQUE
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[7.5px] text-gray-500">
          <span className="flex items-center space-x-1">
            <HardDrive className="h-2.5 w-2.5" />
            <span>SYSDEB: ACTIVE</span>
          </span>
          <span className="flex items-center space-x-1 font-bold text-green-500">
            <Activity className="h-2.5 w-2.5 animate-pulse" />
            <span>CONNECTIVERIE : NOMINALE</span>
          </span>
        </div>
      </div>

      {/* Scrolling Log Stream */}
      <div
        ref={containerRef}
        className="h-[75px] overflow-y-auto space-y-1 scrollbar-none text-left select-text"
      >
        {logs.map((log, i) => (
          <div key={i} className="flex items-start space-x-1">
            <span className="text-cyan-600/60 select-none">&gt;&gt;</span>
            <span className={log.includes("OK") || log.includes("COMPLETED") ? "text-green-400/80" : "text-cyan-400/80"}>
              {log}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
