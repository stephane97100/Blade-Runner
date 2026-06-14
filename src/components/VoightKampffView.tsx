import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { vkQuestions } from "../data/bladeRunnerData";
import { VKQuestion } from "../types";
import { Eye, Heart, Activity, Terminal, ShieldAlert, BadgeCheck, HelpCircle, RefreshCw } from "lucide-react";

export default function VoightKampffView() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [eyeDilation, setEyeDilation] = useState(1.0); // 0.6 to 1.8
  const [heartRate, setHeartRate] = useState(72);      // bpm
  const [testPhase, setTestPhase] = useState<"intro" | "testing" | "analyzing" | "result">("intro");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [verdict, setVerdict] = useState<"HUMAIN" | "REPLICANT" | null>(null);
  const [analysisText, setAnalysisText] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const pendingDataRef = useRef<any>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "CHARGEUR SYSTEME : VOIGHT-KAMPFF MK-II",
    "ENSEMBLE DE BIOCAPTEURS : PRÊTS ET ÉTALONNÉS",
    "EN ATTENTE DU COMMENCEMENT DE L'INTERROGATOIRE..."
  ]);

  // Typewriter effect state
  const [typedScenario, setTypedScenario] = useState("");
  
  // Reticle positioning states
  const [reticlePos, setReticlePos] = useState({ x: 150, y: 150 });
  const [isMouseInside, setIsMouseInside] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastMousePos = useRef({ x: 150, y: 150 });
  const smoothMousePos = useRef({ x: 150, y: 150 });
  const angleRef = useRef(0);

  // Eyelid blinking states
  const [isBlinking, setIsBlinking] = useState(false);

  // Custom persistent Web Audio synthesizer nodes
  const ambientSynthRef = useRef<{
    ctx: AudioContext;
    droneOsc: OscillatorNode;
    filter: BiquadFilterNode;
    lfo: OscillatorNode;
    gain: GainNode;
  } | null>(null);

  const testRunning = testPhase === "testing";

  // Adds a terminal log line dynamically
  const addLog = (msg: string) => {
    setTerminalLogs((prev) => [...prev.slice(-8), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Sound sweep using Audio Context (safe, fails silently if blocked by user interaction)
  const beep = (freq: number, type: OscillatorType = "sine", duration: number = 0.08) => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem("bladeRunner_soundEnabled") === "false") return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  // Quick retro mechanical click for typing or interactions
  const playTypewriterClick = () => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem("bladeRunner_soundEnabled") === "false") return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200 + Math.random() * 600, ctx.currentTime);
      gain.gain.setValueAtTime(0.003, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.008);
    } catch (_) {}
  };

  // BACKGROUND RETRO SYNTH POWER DRONE
  const startAmbientSynth = () => {
    try {
      if (typeof window === "undefined" || localStorage.getItem("bladeRunner_soundEnabled") === "false") return;
      if (ambientSynthRef.current) return; // already running

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Slow resonant saw-wave oscillator imitating VK motor
      const droneOsc = ctx.createOscillator();
      droneOsc.type = "sawtooth";
      droneOsc.frequency.setValueAtTime(65, ctx.currentTime); // Low resonant B note

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(140, ctx.currentTime);
      filter.Q.setValueAtTime(10, ctx.currentTime);

      // Low frequency oscillator sweeping filter for real wet analog texture
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.25, ctx.currentTime); // Slow 4 seconds sweep
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(45, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.03, ctx.currentTime); // Low volume background layer

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      droneOsc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      lfo.start();
      droneOsc.start();

      ambientSynthRef.current = { ctx, droneOsc, filter, lfo, gain };
      addLog("MODULE AMBIENT ANALOGIQUE SYSTÈME BRANCHÉ");
    } catch (e) {
      console.warn("Unable to start ambient synth:", e);
    }
  };

  const adjustAmbientSynthFrequency = (freq: number) => {
    try {
      if (ambientSynthRef.current) {
        // Slide filter and base frequency smoothly on critical events
        const ctx = ambientSynthRef.current.ctx;
        ambientSynthRef.current.droneOsc.frequency.exponentialRampToValueAtTime(freq, ctx.currentTime + 0.8);
        ambientSynthRef.current.filter.frequency.exponentialRampToValueAtTime(freq * 2.5, ctx.currentTime + 0.8);
      }
    } catch (_) {}
  };

  const stopAmbientSynth = () => {
    try {
      if (ambientSynthRef.current) {
        ambientSynthRef.current.droneOsc.stop();
        ambientSynthRef.current.lfo.stop();
        ambientSynthRef.current.ctx.close();
        ambientSynthRef.current = null;
        addLog("DÉCONNEXION DE LA FRÉQUENCE DU SYNTHÉTISEUR DE MOTORISATION");
      }
    } catch (_) {}
  };

  // Run cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbientSynth();
    };
  }, []);

  // Trigger typewriter printing whenever currentIdx changes
  useEffect(() => {
    if (testPhase !== "testing") return;
    const scenarioText = vkQuestions[currentIdx]?.scenario || "";
    setTypedScenario("");
    
    let i = 0;
    const typingInterval = setInterval(() => {
      setTypedScenario(scenarioText.substring(0, i + 1));
      i++;
      if (i % 2 === 0) {
        playTypewriterClick();
      }
      if (i >= scenarioText.length) {
        clearInterval(typingInterval);
      }
    }, 15);

    // Occasional eyeball blinks on question transitions
    triggerBlink();

    return () => clearInterval(typingInterval);
  }, [currentIdx, testPhase]);

  const triggerBlink = () => {
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 240);
  };

  // Randomized blinking loop
  useEffect(() => {
    if (!testRunning) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        triggerBlink();
        addLog("SÉQUENCE D'OBSTRUCTION VISUELLE : SILLON CILACTIF");
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [testRunning]);

  // Reticle positioning scanning track
  useEffect(() => {
    let animId: number;
    const update = () => {
      let targetX = lastMousePos.current.x;
      let targetY = lastMousePos.current.y;

      const rect = containerRef.current?.getBoundingClientRect();
      const w = rect ? rect.width : 320;
      const h = rect ? rect.height : 360;

      if (!isMouseInside) {
        // Continuous automatic patrolling scanning if user mouse is not inside
        const t = Date.now() / 1500;
        targetX = w / 2 + Math.cos(t) * (w * 0.32);
        targetY = h / 2 + Math.sin(t * 2) * (h * 0.22);
      }

      // Smooth interpolation
      smoothMousePos.current.x += (targetX - smoothMousePos.current.x) * 0.08;
      smoothMousePos.current.y += (targetY - smoothMousePos.current.y) * 0.08;

      angleRef.current = (angleRef.current + 1.5) % 360;

      setReticlePos({
        x: smoothMousePos.current.x,
        y: smoothMousePos.current.y
      });

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [isMouseInside]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    lastMousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const isScanningWarning = testPhase === "testing" || testPhase === "analyzing" || (testPhase === "result" && verdict === "REPLICANT");

  // Simulates small tremors or movements in eye and sensors in real-time
  useEffect(() => {
    if (!testRunning) return;
    const interval = setInterval(() => {
      // Small randomized pupil trembling
      const baseDilation = currentIdx === 0 ? 1.0 : (currentIdx === 1 ? 1.3 : (currentIdx === 2 ? 0.7 : (currentIdx === 3 ? 1.5 : 1.1)));
      const tremble = (Math.random() - 0.5) * 0.12;
      setEyeDilation(Math.max(0.5, Math.min(2.0, baseDilation + tremble)));

      // Small randomized pulse fluctuations
      const basePulse = currentIdx === 0 ? 70 : (currentIdx === 1 ? 88 : (currentIdx === 2 ? 74 : (currentIdx === 3 ? 98 : 82)));
      const pulseTremble = Math.floor((Math.random() - 0.5) * 6);
      setHeartRate(basePulse + pulseTremble);

      // Play faint heartbeat click randomly matching speed
      beep(110, "sine", 0.015);

      if (Math.random() > 0.8) {
        const logMsgs = [
          "MOUVEMENT CAPILLAIRE INDUCTIF IDENTIFIÉ",
          "SURSAUT ALVÉOLAIRE DE GRANDEUR INFIME DETECTÉ",
          "VARIATION THERMOGRAPHIQUE LOCALE SYNAPTIQUE",
          "DIAL INVERSION IRIS DEGRÉ TRÈS LÉGER"
        ];
        addLog(logMsgs[Math.floor(Math.random() * logMsgs.length)]);
      }
    }, 1100);

    return () => clearInterval(interval);
  }, [testRunning, currentIdx]);

  const handleStart = () => {
    startAmbientSynth();
    beep(440, "sine", 0.25);
    setAnswers([]);
    setCurrentIdx(0);
    setTestPhase("testing");
    setTerminalLogs([
      "TENSION DU SENSOR OPHTALMIQUE ACTIVE",
      "MONITORS DE RYTHME CARDIAQUE FIXÉS SUR LE SUJET",
      "DÉBUT DU DIALOGUE DE SÉANCE..."
    ]);
  };

  const handleSelectOption = (question: VKQuestion, option: any) => {
    // Collect output info
    const newAnswer = {
      scenario: question.scenario,
      text: option.text,
      description: option.description,
      suggestedAIType: option.suggestedAIType
    };
    
    beep(490, "sine", 0.12);
    // Increase drone depth frequency briefly for dramatic tension
    adjustAmbientSynthFrequency(85);

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    // Trigger physical impact alerts on options selection
    if (option.suggestedAIType === "replicant-leaning") {
      setEyeDilation(0.6); // Tremendous contraction
      setHeartRate(110);    // Accelerating
      addLog("ALERTE : COHÉRENCE RESPIRATOIRE FROIDE - TENSION RECORD");
    } else if (option.suggestedAIType === "highly-evasive") {
      setEyeDilation(1.7); // Dilated
      setHeartRate(55);     // Suspicious slows
      addLog("ALERTE : REPONSE ÉVASIVE - ESQUIVE DU CADRE LOGIQUE");
    } else {
      setEyeDilation(1.1); // Organic normal
      setHeartRate(78);
      addLog("NORMALITE : TRACE D'EMPATHIE ENREGISTRÉE");
    }

    if (currentIdx + 1 < vkQuestions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Analyze stage trigger
      triggerServerAnalysis(updatedAnswers);
    }
  };

  const triggerServerAnalysis = async (finalAnswers: any[]) => {
    setTestPhase("analyzing");
    setScanProgress(0);
    pendingDataRef.current = null;
    
    // Shift the analog drone synthesizer extremely high to outline high-security computing
    adjustAmbientSynthFrequency(130);

    addLog("SYNTHÈSE DES ANALYSES SANGUINES ET OCULAIRES EN COURS...");
    addLog("APPEL AU SYSTEME DE COMPARAISON NEURONALE DU LAPD...");

    let elapsedMs = 0;
    const durationMs = 10000; // 10 seconds total loading
    const tickInterval = 100; // Increment every 100ms for smooth progress bar animation
    
    const scanInterval = setInterval(() => {
      elapsedMs += tickInterval;
      const progress = Math.min(100, Math.floor((elapsedMs / durationMs) * 100));
      setScanProgress(progress);
      
      // Simulate real-time erratic physical response feedback on the scanner machine while studying
      setEyeDilation(0.8 + Math.sin(elapsedMs / 400) * 0.35);
      setHeartRate(Math.floor(82 + Math.sin(elapsedMs / 250) * 15));
      beep(180 + progress * 4.5, "sine", 0.012);

      if (elapsedMs % 1000 === 0) {
        const secs = 10 - (elapsedMs / 1000);
        const scanMsgs = [
          "COMPARAISON SÉQUENTIELLE DU COPAIN DE L'IRIS...",
          "BALAYAGE SPECTROGRAPHIQUE CAPILLAIRE...",
          "VÉRIFICATION DES VALEURS DU SYSTEME LIMBIQUE...",
          "ALGORITHME DE CORRELULATION DES SECTIONS PATRE...",
          "CONFRONTATION DES DONNÉES D'EMPATHIE EN DIRECT...",
          "MOTEUR ANALYTIQUE DE LA TYRELL CORP ACCÉDÉ..."
        ];
        if (secs > 0) {
          addLog(`${scanMsgs[Math.floor(Math.random() * scanMsgs.length)]} (T-MINUS: ${Math.ceil(secs)}s)`);
        }
      }

      if (elapsedMs >= durationMs) {
        clearInterval(scanInterval);
        if (pendingDataRef.current) {
          applyResults(pendingDataRef.current);
        } else {
          addLog("ATTENTE FINALISATION DU SIGNAL DU SERVEUR CENTRAL...");
        }
      }
    }, tickInterval);

    try {
      const response = await fetch("/api/voight-kampff/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        pendingDataRef.current = data;
        // If 10 seconds have already passed, apply results immediately
        if (elapsedMs >= durationMs) {
          applyResults(data);
        }
      } else {
        clearInterval(scanInterval);
        setTestPhase("intro");
        stopAmbientSynth();
        alert(data.error || "Une erreur est survenue.");
      }
    } catch (err) {
      clearInterval(scanInterval);
      setTestPhase("intro");
      stopAmbientSynth();
      alert("Impossible de joindre le serveur analytique d'interrogatoire.");
    }
  };

  const applyResults = (data: any) => {
    setVerdict(data.verdict);
    setAnalysisText(data.analysis);
    setTestPhase("result");
    setIsRevealing(true);
    
    stopAmbientSynth();

    // Dispatch global window event to update DiagnosticConsole index in real-time
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("vk-test-completed"));
    }
    
    // Series of futuristic biometric locking tones
    beep(580, "sine", 0.08);
    setTimeout(() => beep(680, "sine", 0.08), 120);
    setTimeout(() => beep(780, "sine", 0.18), 240);
    
    // Hold reveal screen for 2.2 seconds for dramatic retro suspense
    setTimeout(() => {
      beep(data.verdict === "HUMAIN" ? 840 : 140, "sawtooth", 0.5);
      setIsRevealing(false);
    }, 2200);
  };

  const resetAll = () => {
    stopAmbientSynth();
    beep(280, "sine", 0.1);
    setTestPhase("intro");
    setVerdict(null);
    setAnalysisText("");
    setTerminalLogs([
      "CHARGEUR SYSTEME : VOIGHT-KAMPFF MK-II",
      "ENSEMBLE DE BIOCAPTEURS : PRÊTS ET ÉTALONNÉS",
      "EN ATTENTE DU COMMENCEMENT DE L'INTERROGATOIRE..."
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 text-left"
    >
      {/* Intro descriptive card */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase">
          TEST DE VOIGHT-KAMPFF
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          L'instrument d'évaluation psychologique conçu pour mesurer la dilatation de l'iris et démasquer les réplicants Nexus rebelles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Eye scanner machine graphic HUD (cols: 5) */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsMouseInside(true)}
          onMouseLeave={() => setIsMouseInside(false)}
          className={`lg:col-span-5 bg-black rounded-xl border overflow-hidden p-5 flex flex-col justify-between space-y-6 relative min-h-[350px] transition-colors duration-500 ${
            isScanningWarning 
              ? "border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.06)]" 
              : "border-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.05)]"
          }`}
        >
          {/* Aesthetic grid overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-950/20 pointer-events-none"></div>
          <div className={`absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none ${
            isScanningWarning ? "opacity-20 bg-[linear-gradient(to_right,rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(239,68,68,0.03)_1px,transparent_1px)]" : ""
          }`}></div>

          {/* Laser Scanning Beam Sweep */}
          {testRunning && (
            <motion.div
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="absolute left-0 right-0 h-0.5 bg-red-500/60 shadow-[0_0_12px_#ef4444] z-10 pointer-events-none"
            />
          )}

          {/* Machine Header title bar */}
          <div className="relative z-10 flex items-center justify-between border-b border-gray-800 pb-3">
            <span className={`text-[10px] uppercase font-mono tracking-widest font-bold block ${
              isScanningWarning ? "text-red-400" : "text-cyan-400"
            }`}>
              VK-BIOMETRIC DISPLAY SYSTEM {testRunning ? "// LIVE_SCAN" : ""}
            </span>
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${testRunning ? "bg-red-500 animate-ping" : "bg-cyan-500"}`}></span>
              <span className="text-[8px] font-mono text-gray-500 uppercase">
                {testRunning ? "SÉLECTION ACTIVE" : "VEILLE"}
              </span>
            </div>
          </div>

          {/* Interactive Eye Visualization */}
          <div className="relative flex-grow flex items-center justify-center p-4">
            <div className={`relative w-48 h-48 rounded-full border-2 flex items-center justify-center transition-all duration-500 bg-gradient-to-b from-gray-950 to-neutral-950 overflow-hidden ${
              isScanningWarning ? "border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.15)]" : "border-gray-800 shadow-[0_0_30px_rgba(6,182,212,0.1)]"
            }`}>
              
              {/* Eye sclera outline */}
              <div className="absolute w-44 h-28 rounded-[80%_80%] border border-gray-800 bg-gray-950/80 flex items-center justify-center overflow-hidden relative">
                
                {/* Eyelids closing blinks */}
                <motion.div
                  animate={{ height: isBlinking ? "52%" : "0%" }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-0 left-0 right-0 bg-neutral-950 z-20 border-b border-cyan-500/30"
                />
                <motion.div
                  animate={{ height: isBlinking ? "52%" : "0%" }}
                  transition={{ duration: 0.12 }}
                  className="absolute bottom-0 left-0 right-0 bg-neutral-950 z-20 border-t border-cyan-500/30"
                />

                {/* Iris ring */}
                <motion.div
                  animate={{
                    borderColor: testPhase === "result" && verdict === "REPLICANT" ? "rgba(239, 68, 68, 0.6)" : "rgba(6, 182, 212, 0.4)",
                    backgroundColor: testPhase === "result" && verdict === "REPLICANT" ? "rgba(220, 38, 38, 0.1)" : "rgba(6, 182, 212, 0.05)"
                  }}
                  className="w-24 h-24 rounded-full border-4 border-cyan-400 flex items-center justify-center relative shadow-[inset_0_0_15px_rgba(6,182,212,0.2)]"
                >
                  
                  {/* Dynamic Pupil */}
                  <motion.div
                    animate={{
                      scale: eyeDilation,
                      backgroundColor: testPhase === "result" && verdict === "REPLICANT" ? "#dc2626" : "#000000"
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="w-10 h-10 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.4)] relative flex items-center justify-center"
                  >
                    {/* Glowing crimson optical reflection center */}
                    <div className="w-2 h-2 bg-red-500 absolute rounded-full top-2 left-2 animate-pulse shadow-[0_0_10px_#ef4444]"></div>
                  </motion.div>

                  {/* Iris capillary muscle threads */}
                  <div className="absolute inset-0 border border-t-red-500/20 border-b-cyan-500/10 rounded-full animate-spin-slow pointer-events-none"></div>
                </motion.div>
                
              </div>

              {/* Aiming Crosshair Overlay */}
              <div className="absolute inset-0 border-2 border-dashed border-red-500/15 pointer-events-none rounded-full flex items-center justify-center">
                <div className="w-10 h-[1px] bg-red-500/30"></div>
                <div className="h-10 w-[1px] bg-red-500/30"></div>
              </div>
            </div>

            {/* Dynamic visual numbers */}
            {testRunning && (
              <div className="absolute top-2 left-2 font-mono text-[9px] text-cyan-500 space-y-1 bg-black/80 p-2 rounded border border-gray-800">
                <p>IRIS-VAL: {(eyeDilation * 100).toFixed(1)}%</p>
                <p>PUPIL-TRM: {Math.abs(Math.sin(eyeDilation)).toFixed(4)}</p>
                <p>TENS-VAL: 14.8/8</p>
              </div>
            )}
          </div>

          {/* Machine physical metric widgets */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-800/80">
            <div className="bg-gray-950 p-2.5 rounded border border-gray-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[8px] font-mono uppercase tracking-wider text-gray-500 block">RYTHME INTÉRIEUR</span>
                <span className="text-sm font-display font-bold text-white font-mono">{heartRate} <span className="text-[9px] text-gray-400 font-normal">BPM</span></span>
              </div>
              <Heart className={`h-6 w-6 text-red-500 ${testRunning ? "animate-heartbeat" : "opacity-30"}`} />
            </div>

            <div className="bg-gray-950 p-2.5 rounded border border-gray-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[8px] font-mono uppercase tracking-wider text-gray-500 block">CAPILLAIRE</span>
                <span className="text-sm font-display font-semibold text-white font-mono">{testRunning ? "8.4" : "0.0"} <span className="text-[8px] text-gray-400 font-normal">MV</span></span>
              </div>
              <Activity className={`h-6 w-6 text-cyan-400 ${testRunning ? "animate-pulse" : "opacity-30"}`} />
            </div>
          </div>

          {/* Dynamic SVG scanning reticle overlay */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            <svg className="w-full h-full absolute inset-0">
              <defs>
                <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Horizontal / Vertical crosshair guides */}
              <line 
                x1="0" 
                y1={reticlePos.y} 
                x2="100%" 
                y2={reticlePos.y} 
                stroke={isScanningWarning ? "rgba(239, 68, 68, 0.25)" : "rgba(6, 182, 212, 0.2)"} 
                strokeWidth="1" 
                strokeDasharray="4,4" 
              />
              <line 
                x1={reticlePos.x} 
                y1="0" 
                x2={reticlePos.x} 
                y2="100%" 
                stroke={isScanningWarning ? "rgba(239, 68, 68, 0.25)" : "rgba(6, 182, 212, 0.2)"} 
                strokeWidth="1" 
                strokeDasharray="4,4" 
              />

              {/* Reticle targeting cursor */}
              <g transform={`translate(${reticlePos.x}, ${reticlePos.y})`}>
                <circle 
                  cx="0" 
                  cy="0" 
                  r="16" 
                  fill="none" 
                  stroke={isScanningWarning ? "rgba(239, 68, 68, 0.6)" : "rgba(6, 182, 212, 0.5)"} 
                  strokeWidth="1.5" 
                  strokeDasharray="5,3" 
                  className="animate-spin-slow"
                />
                
                {/* Outer Bracket notches */}
                <circle 
                  cx="0" 
                  cy="0" 
                  r="24" 
                  fill="none" 
                  stroke={isScanningWarning ? "#f87171" : "#22d3ee"} 
                  strokeWidth="0.8" 
                  strokeDasharray="14,14" 
                  filter={isScanningWarning ? "url(#glow-red)" : "url(#glow-cyan)"}
                />

                <line 
                  x1="-30" 
                  y1="0" 
                  x2="-18" 
                  y2="0" 
                  stroke={isScanningWarning ? "#dc2626" : "#06b6d4"} 
                  strokeWidth="1.5" 
                />
                <line 
                  x1="18" 
                  y1="0" 
                  x2="30" 
                  y2="0" 
                  stroke={isScanningWarning ? "#dc2626" : "#06b6d4"} 
                  strokeWidth="1.5" 
                />
                <line 
                  x1="0" 
                  y1="-30" 
                  x2="0" 
                  y2="-18" 
                  stroke={isScanningWarning ? "#dc2626" : "#06b6d4"} 
                  strokeWidth="1.5" 
                />
                <line 
                  x1="0" 
                  y1="18" 
                  x2="0" 
                  y2="30" 
                  stroke={isScanningWarning ? "#dc2626" : "#06b6d4"} 
                  strokeWidth="1.5" 
                />

                {/* Pinpoint optical focal point */}
                <circle 
                  cx="0" 
                  cy="0" 
                  r="3.5" 
                  fill={isScanningWarning ? "#ef4444" : "#06b6d4"} 
                  className="animate-pulse"
                />

                {/* Floating telemetry panel hanging next to high-tech cursor */}
                <g transform="translate(44, -12)">
                  <rect 
                    x="-4" 
                    y="-8" 
                    width="96" 
                    height="42" 
                    rx="3" 
                    fill="rgba(0, 0, 0, 0.8)" 
                    stroke={isScanningWarning ? "rgba(239, 68, 68, 0.35)" : "rgba(6, 182, 212, 0.25)"} 
                    strokeWidth="1"
                  />
                  <text x="2" y="3" fill={isScanningWarning ? "#fca5a5" : "#67e8f9"} fontSize="7" fontFamily="monospace" letterSpacing="0.2">
                    SYS_X_Y: {Math.floor(reticlePos.x).toString().padStart(3, '0')}, {Math.floor(reticlePos.y).toString().padStart(3, '0')}
                  </text>
                  <text x="2" y="12" fill="rgba(255, 255, 255, 0.7)" fontSize="7" fontFamily="monospace">
                    PHASE: {testPhase.toUpperCase()}
                  </text>
                  <text x="2" y="21" fill={isScanningWarning ? "#fca5a5" : "#22d3ee"} fontSize="7" fontFamily="monospace" fontWeight="bold">
                    PUP_DIL: {(eyeDilation * 100).toFixed(0)}%
                  </text>
                  <text x="2" y="30" fill="#9ca3af" fontSize="6" fontFamily="monospace">
                    RATE: {heartRate} BPM
                  </text>
                </g>
              </g>
            </svg>
          </div>

        </div>

        {/* Right Column: Interaction controller screen (cols: 7) */}
        <div className="lg:col-span-7 bg-gray-900/40 border border-gray-800 rounded-xl p-6 md:p-8 flex flex-col justify-between min-h-[420px] backdrop-blur relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {/* Phase 1: Intro stage */}
            {testPhase === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5 my-auto text-center py-6"
              >
                <div className="w-16 h-16 rounded-full bg-cyan-950/60 border border-cyan-400/30 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                  <Terminal className="h-7 w-7 text-cyan-400" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider">
                    Lancer la simulation d'Interrogatoire
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm max-w-md mx-auto leading-relaxed text-center">
                    Installez le sujet face au capteur optique. L'appareil de Voight-Kampff va mesurer la dilatation involontaire de son iris face à un questionnaire scénarisé hautement émotionnel afin de révéler sa nature métaphysique profonde.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleStart}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-display font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-lg border border-cyan-400/40 cursor-pointer shadow-[0_3px_12px_rgba(6,182,212,0.2)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    DÉBUTER LE DIALOGUE DE TEST
                  </button>
                </div>
              </motion.div>
            )}

            {/* Phase 2: Active Testing Questions */}
            {testPhase === "testing" && (
              <motion.div
                key="testing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 flex flex-col justify-between h-full"
              >
                {/* Question index indicator */}
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
                    Scénario {currentIdx + 1} sur {vkQuestions.length}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">
                    DIFFICULTÉ PHYSIQUE : ÉMULATION
                  </span>
                </div>

                {/* Scenario details statement with dynamic letter typewriter effect */}
                <div className="space-y-3">
                  <p className="text-sm md:text-base text-gray-100 font-medium leading-relaxed bg-gray-950/70 p-4 border border-cyan-500/10 rounded-lg selection:bg-cyan-500/20 font-mono shadow-[0_0_15px_rgba(6,182,212,0.02)] min-h-[90px]">
                    &gt; "{typedScenario}"
                    <span className="animate-pulse font-extrabold text-cyan-400 text-sm ml-0.5">_</span>
                  </p>
                </div>

                {/* Option selector buttons with staggered reveal variants */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
                  }} 
                  className="space-y-3 pt-4"
                >
                  {vkQuestions[currentIdx].options.map((opt, oIdx) => (
                    <motion.button
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      key={oIdx}
                      onClick={() => handleSelectOption(vkQuestions[currentIdx], opt)}
                      className="w-full text-left p-3.5 rounded-lg border border-gray-800 bg-gray-950/30 hover:bg-cyan-950/20 hover:border-cyan-500/50 text-xs text-gray-300 hover:text-white transition-all cursor-pointer font-sans block leading-normal space-y-1 group"
                    >
                      <span className="text-cyan-400 group-hover:text-cyan-300 font-bold uppercase block text-[10px] tracking-wider">
                        OPTION {String.fromCharCode(65 + oIdx)} :
                      </span>
                      <span>{opt.text}</span>
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Phase 3: Analyzing results (loading state, beautiful 10-second scan animation) */}
            {testPhase === "analyzing" && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 my-auto text-center py-4 flex flex-col justify-center h-full w-full"
              >
                {/* Advanced biometrics scan circles */}
                <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 border border-cyan-500/10 rounded-full"></div>
                  <div className="absolute inset-2 border border-dashed border-cyan-500/20 rounded-full animate-spin"></div>
                  <div className="absolute inset-4 border-2 border-red-500/20 rounded-full animate-pulse"></div>
                  
                  {/* Sweep scan bar overlay */}
                  <motion.div 
                    animate={{
                      top: ["0%", "100%", "0%"]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut"
                    }}
                    className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_10px_#22d3ee] z-20"
                  ></motion.div>

                  {/* Percentage content */}
                  <span className="text-xl font-mono text-cyan-400 font-bold tracking-tighter">
                    {scanProgress}%
                  </span>
                </div>

                <div className="space-y-2 max-w-sm mx-auto">
                  <span className="text-[10px] font-mono uppercase text-cyan-500 font-bold tracking-widest block animate-pulse">
                    &gt; EXÉCUTION DE SÉQUENCE D'ANALYSE GLOBALE...
                  </span>
                  
                  {/* Visual simulated progress segment bar */}
                  <div className="w-full h-1.5 bg-gray-950 border border-gray-800 rounded overflow-hidden">
                    <motion.div 
                      className="h-full bg-cyan-500" 
                      style={{ width: `${scanProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Phase 4: Results Display */}
            {testPhase === "result" && (
              <AnimatePresence mode="wait">
                {isRevealing ? (
                  <motion.div
                    key="revealing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6 text-center my-auto py-10 flex flex-col items-center justify-center relative w-full h-full"
                  >
                    {/* Laser calibration line scanning down */}
                    <motion.div
                      animate={{
                        top: ["0%", "100%"]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.1,
                        ease: "linear"
                      }}
                      className={`absolute left-0 right-0 h-[3px] z-30 opacity-80 shadow-[0_0_12px_rgba(255,255,255,1)] ${
                        verdict === "REPLICANT"
                          ? "bg-red-500 shadow-red-500/85"
                          : "bg-emerald-400 shadow-emerald-400/85"
                      }`}
                    />

                    {/* Zebra security pattern overlay */}
                    <div className="absolute inset-0 bg-zebra-pattern opacity-5 pointer-events-none" />

                    {/* Pulsing biometrics feedback */}
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        borderColor: verdict === "REPLICANT" ? ["rgba(239, 68, 68, 0.2)", "rgba(239, 68, 68, 0.8)", "rgba(239, 68, 68, 0.2)"] : ["rgba(16, 185, 129, 0.2)", "rgba(16, 185, 129, 0.8)", "rgba(16, 185, 129, 0.2)"]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        ease: "easeInOut"
                      }}
                      className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mb-4 ${
                        verdict === "REPLICANT"
                          ? "bg-red-950/40 text-red-400"
                          : "bg-emerald-950/40 text-emerald-400"
                      }`}
                    >
                      <Activity className="h-8 w-8 animate-pulse" />
                    </motion.div>

                    <div className="space-y-3 text-center relative z-10 max-w-sm">
                      <h4 className={`text-sm font-mono font-black uppercase tracking-widest ${
                        verdict === "REPLICANT" ? "text-red-400 animate-pulse" : "text-emerald-400 animate-pulse"
                      }`}>
                        {verdict === "REPLICANT" ? "⚠️ MENACE DE CLASSE 6 DÉTECTÉE // NEXUS INTRUSION" : "✓ HOMEOSTASIE EMBRYONNAIRE CONFORME // HUMAIN"}
                      </h4>
                      <p className="text-[10px] font-mono text-gray-400 leading-relaxed uppercase select-none text-center">
                        TRANSMISSION SÉCURISÉE VERS LE CAPTURE FLUX CENTRAL DU LAPD... VEUILLEZ PATIENTER PENDANT LA FINALISATION...
                      </p>
                    </div>

                    {/* Live retro tracking codes ticker under */}
                    <div className="mt-5 font-mono text-[8px] text-gray-500 flex space-x-4 uppercase border border-gray-850 bg-gray-950/80 p-1.5 px-3 rounded">
                      <span className="animate-pulse">IP: 10.201.92.83</span>
                      <span className="text-red-500/80">LOCK: {Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
                      <span className="text-cyan-400">CHRONO: SEC-APPROVED</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-left"
                  >
                    {/* Visual verdict block */}
                    <div className={`p-5 rounded-lg border text-center relative overflow-hidden ${
                      verdict === "REPLICANT"
                        ? "bg-red-950/30 border-red-500/40 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                        : "bg-emerald-950/30 border-emerald-500/40 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                    }`}>
                      <div className="absolute top-2 right-2 text-[9px] font-mono text-gray-500 tracking-widest">
                        CODE IDENTIFICATEUR LAPD
                      </div>
                      
                      {verdict === "REPLICANT" ? (
                        <div className="space-y-1">
                          <ShieldAlert className="h-8 w-8 text-red-500 mx-auto" />
                          <h3 className="text-xl md:text-2xl font-display font-black tracking-widest uppercase">
                            VERDICT : REPLICANT NEXUS-6
                          </h3>
                          <p className="text-[10px] font-mono tracking-wide text-red-400">
                            EMPATHIE INSUFFISANTE • INSTRUCTION EXÉCUTIVE : RETRAIT IMMÉDIAT RECOMMANDÉ
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <BadgeCheck className="h-8 w-8 text-emerald-500 mx-auto" />
                          <h3 className="text-xl md:text-2xl font-display font-black tracking-widest uppercase">
                            VERDICT : CLASSE HUMAINE
                          </h3>
                          <p className="text-[10px] font-mono tracking-wide text-emerald-400">
                            EMPATHIE CORRECTE EXPÉRIMENTÉE • UNITÉ BIOLOGIQUE AUTILISÉE ET LIBRE
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Narrative Diagnostic Typewriter Block */}
                    <div className="space-y-2">
                      <span className="text-[9px] uppercase font-mono tracking-widest text-gray-400 block border-b border-gray-800 pb-1">
                        RAPPORT OFFICIEL DE SÉANCE D'INTERROGATOIRE :
                      </span>
                      
                      {/* Typewriter feedback block */}
                      <div className="bg-black/60 border border-gray-800 rounded-lg p-5 font-mono text-xs text-gray-300 leading-relaxed max-h-[220px] overflow-y-auto whitespace-pre-line custom-scrollbar">
                        {analysisText}
                      </div>
                    </div>

                    {/* Reset button Action */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={resetAll}
                        className="bg-gray-800 hover:bg-gray-700 text-white font-mono text-xs uppercase tracking-widest px-4 py-2.5 rounded border border-gray-700 flex items-center space-x-2 cursor-pointer transition-colors"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>SYNCHRONISER NOUVEAU SUJET</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

          </AnimatePresence>

          {/* Bottom Live terminal outputs ticker logs */}
          <div className="border-t border-gray-800/80 pt-4 mt-6">
            <span className="text-[9px] uppercase font-mono tracking-widest text-cyan-500/70 block mb-2 flex items-center space-x-1 font-bold">
              <Terminal className="h-3 w-3 animate-pulse-slow" />
              <span>TERMINAL SECURISÉ DE TEST : SENSEURS LIVE</span>
            </span>
            <div className="bg-black/70 rounded p-3 font-mono text-[9px] text-gray-400 space-y-1 select-none overflow-hidden h-20 uppercase">
              {terminalLogs.map((log, idx) => (
                <p key={idx} className="truncate select-none">{log}</p>
              ))}
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
