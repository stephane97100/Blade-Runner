import { useState, useEffect, useRef } from "react";
import { Terminal, Activity, HardDrive, History, RefreshCw, AlertTriangle } from "lucide-react";

interface VKSession {
  id: string;
  verdict: "HUMAIN" | "REPLICANT";
  analysis: string;
  answers: any[];
  createdAt: string;
}

export default function DiagnosticConsole() {
  const [activeTab, setActiveTab] = useState<"logs" | "vk_history">("logs");
  const [logs, setLogs] = useState<string[]>([
    "SYS: INITIALISANT LE TERMINAL DIAGNOSTIQUE DU LAPD v8.4...",
    "OK : CANAUX DE CORRÉLATION COGATIVE PRÊTS",
    "OK : SYNTH-BEEP DU COMPILATEUR LOCALISÉ ET ADAPTÉ"
  ]);
  const [isOnline, setIsOnline] = useState(true);
  const [vkHistory, setVkHistory] = useState<VKSession[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

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

  // Fetch Firestore status & Voight-Kampff history
  const checkConnectivity = async () => {
    try {
      const response = await fetch("/api/health");
      if (response.ok) {
        const data = await response.json();
        setIsOnline(!!data.firestoreOnline);
      } else {
        setIsOnline(false);
      }
    } catch (e) {
      setIsOnline(false);
    }
  };

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch("/api/voight-kampff/history");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setVkHistory(data.items || []);
        }
      }
    } catch (err) {
      console.error("[DiagnosticConsole] History fetch error:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    // Initial check and queries
    checkConnectivity();
    fetchHistory();

    // Setup periodic polling for online status (every 8 seconds)
    const connInterval = setInterval(checkConnectivity, 8000);

    // Setup periodic polling for history (every 15 seconds) to keep aligned
    const histInterval = setInterval(fetchHistory, 15000);

    // Listen to real-time custom events when a user completes a VK test on-screen
    const handleVKComplete = () => {
      fetchHistory();
      // Auto switch tab to VK history to witness their indexed log immediately!
      setActiveTab("vk_history");
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString("fr-FR")}] SYS: NOUVEAU TEST VOIGHT-KAMPFF INDEXÉ AVEC SUCCÈS`
      ]);
    };
    window.addEventListener("vk-test-completed", handleVKComplete);

    return () => {
      clearInterval(connInterval);
      clearInterval(histInterval);
      window.removeEventListener("vk-test-completed", handleVKComplete);
    };
  }, []);

  // System logs simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
      const timestamp = new Date().toLocaleTimeString("fr-FR", { hour12: false });
      setLogs((prev) => {
        const next = [...prev, `[${timestamp}] ${randomMsg}`];
        if (next.length > 25) next.shift(); // Keep logs clean
        return next;
      });
    }, 5000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, []);

  // Auto scroll down logs
  useEffect(() => {
    if (containerRef.current && activeTab === "logs") {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, activeTab]);

  const handleManualSync = () => {
    checkConnectivity();
    fetchHistory();
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString("fr-FR")}] USER: RE-SYNCHRONISATION MANUELLE DE LA BASE DE DONNÉES ENCOURS`
    ]);
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short"
      }).toUpperCase() + " @ " + date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
    } catch (e) {
      return "DATETIME INFRA";
    }
  };

  return (
    <div id="diagnostic_console_outer" className="bg-gray-950/90 border border-gray-900 rounded-lg p-3 font-mono text-[9px] text-cyan-500/80 w-full relative overflow-hidden backdrop-blur-md transition-all duration-300">
      
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-900 pb-2 mb-2 select-none gap-2">
        
        {/* Left Side: Tabs */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab("logs")}
            className={`flex items-center space-x-1.5 px-2 py-1 rounded transition-all cursor-pointer ${
              activeTab === "logs"
                ? "bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold"
                : "border border-transparent text-gray-500 hover:text-cyan-400"
            }`}
          >
            <Terminal className="h-2.5 w-2.5" />
            <span className="text-[8px] uppercase tracking-wider">SYSTEM LOGS</span>
          </button>

          <button
            onClick={() => setActiveTab("vk_history")}
            className={`flex items-center space-x-1.5 px-2 py-1 rounded transition-all cursor-pointer ${
              activeTab === "vk_history"
                ? "bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold"
                : "border border-transparent text-gray-500 hover:text-cyan-400"
            }`}
          >
            <History className="h-2.5 w-2.5" />
            <span className="text-[8px] uppercase tracking-wider">INDEX SESSIONS VK ({vkHistory.length})</span>
          </button>

          <button
            onClick={handleManualSync}
            className="p-1 text-gray-600 hover:text-cyan-400 transition-colors cursor-pointer"
            title="Rafraîchir les services"
          >
            <RefreshCw className="h-2.5 w-2.5" />
          </button>
        </div>

        {/* Right Side Status Panel */}
        <div className="flex items-center justify-between sm:justify-end space-x-4 text-[7.5px] text-gray-500">
          <span className="flex items-center space-x-1">
            <HardDrive className="h-2.5 w-2.5" />
            <span>SYSDEB: READY</span>
          </span>

          {/* Connection condition check warning */}
          {isOnline ? (
            <span className="flex items-center space-x-1 font-bold text-green-500">
              <Activity className="h-2.5 w-2.5 animate-pulse" />
              <span>CONNECTIVITÉ : NOMINALE</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 font-bold text-red-500 bg-red-950/50 border border-red-500/30 px-1.5 py-0.5 rounded animate-pulse">
              <AlertTriangle className="h-2.5 w-2.5 text-red-400" />
              <span>CONNEXION PERDUE (FIRESTORE OFFLINE)</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Terminal View Frame */}
      {activeTab === "logs" ? (
        /* LOG VIEW STREAM */
        <div
          ref={containerRef}
          className="h-[85px] overflow-y-auto space-y-1 scrollbar-none text-left select-text"
        >
          {logs.map((log, i) => (
            <div key={i} className="flex items-start space-x-1">
              <span className="text-cyan-600/60 select-none">&gt;&gt;</span>
              <span className={log.includes("OK") || log.includes("COMPLETED") || log.includes("INDEXÉ") ? "text-green-400/80" : "text-cyan-400/80"}>
                {log}
              </span>
            </div>
          ))}
        </div>
      ) : (
        /* VOIGHT-KAMPFF SESSIONS INDEX */
        <div className="h-[85px] overflow-y-auto scrollbar-none space-y-1.5 text-left">
          {isLoadingHistory && vkHistory.length === 0 ? (
            <div className="text-gray-600 flex items-center justify-center h-full space-x-1.5 select-none animate-pulse">
              <RefreshCw className="h-3 w-3 animate-spin text-cyan-500/50" />
              <span>ACCÈS HISTORIQUE FIRESTORE...</span>
            </div>
          ) : vkHistory.length === 0 ? (
            <div className="text-gray-600 flex items-center justify-center h-full select-none">
              <span>AUCUNE SESSION DE TEST DE VOIGHT-KAMPFF INDEXÉE DANS LA BASE DE DONNÉES</span>
            </div>
          ) : (
            vkHistory.map((session) => {
              const isExpanded = expandedSessionId === session.id;
              return (
                <div
                  key={session.id}
                  className="border border-gray-900 hover:border-cyan-500/20 rounded p-1.5 bg-gray-950/40 transition-colors cursor-pointer"
                  onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-cyan-600 text-[8px] tracking-wide">
                        ID: {session.id.toUpperCase()}
                      </span>
                      <span className="text-gray-500 text-[8px]">
                        {formatTimestamp(session.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <span className={`text-[8.5px] font-bold tracking-widest uppercase px-1.5 py-0.2 rounded border ${
                        session.verdict === "HUMAIN"
                          ? "text-emerald-400 border-emerald-500/20 bg-emerald-950/30 shadow-[0_0_5px_rgba(16,185,129,0.1)]"
                          : "text-red-400 border-red-500/20 bg-red-950/30 shadow-[0_0_5px_rgba(239,68,68,0.1)] animate-pulse"
                      }`}>
                        [ {session.verdict} ]
                      </span>
                      <span className="text-[7.5px] text-gray-500 select-none">
                        {isExpanded ? "▲ PLIER" : "▼ RAPP"}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Report Area */}
                  {isExpanded && (
                    <div className="mt-1.5 pt-1.5 border-t border-gray-900 text-[8px] text-gray-400 leading-normal space-y-1.5 animate-fadeIn">
                      <p className="text-cyan-300 font-medium">RAPPORT D'ANALYSE DE L'EXAMINATEUR :</p>
                      <p className="whitespace-pre-line text-gray-300 italic">
                        "{session.analysis}"
                      </p>
                      {session.answers && session.answers.length > 0 && (
                        <div className="bg-gray-950 p-1.5 rounded border border-gray-900/80 space-y-0.5 font-sans">
                          <p className="font-mono text-[7px] text-gray-500 uppercase tracking-widest pb-0.5 border-b border-gray-900">REPONSES SELECTIONNEES :</p>
                          {session.answers.map((ans: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-[7px] text-gray-500">
                              <span className="truncate max-w-[200px]">{ans.scenario}</span>
                              <span className={ans.type === "replicant-leaning" ? "text-red-400" : ans.type === "highly-evasive" ? "text-amber-400" : "text-green-400"}>
                                {ans.type || "normale"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
