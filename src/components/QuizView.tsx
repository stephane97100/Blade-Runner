import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, CheckCircle2, XCircle, ArrowRight, RefreshCw, Eye, ShieldAlert, BookOpen, Clock, Play } from "lucide-react";
import TerminalLoader from "./TerminalLoader";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  imageUrl: string;
  quote?: string;
}

const BLADE_RUNNER_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Quel modèle de réplicant est au centre de l'enquête de Rick Deckard dans le film de 1982 ?",
    options: ["Nexus-4", "Nexus-6", "Nexus-7", "Nexus-8"],
    correctAnswerIndex: 1,
    explanation: "Ce sont les androïdes de génération Nexus-6 de la Tyrell Corporation, dotés d'une force surhumaine et d'une intelligence équivalente à leurs créateurs, qui se sont révoltés dans les colonies Off-World et se cachent à Los Angeles.",
    imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800",
    quote: "Physiquement, ils sont presque impossibles à distinguer d'un être humain."
  },
  {
    id: 2,
    text: "Quelle est la durée de vie programmée pour les réplicants de type Nexus-6 pour éviter qu'ils ne développent leur propre empathie ?",
    options: ["2 ans", "4 ans", "10 ans", "Illimitée"],
    correctAnswerIndex: 1,
    explanation: "La Tyrell Corporation a mis en place un dispositif de sécurité biologique limitant leur espérance de vie à exactement quatre ans. Cela les empêche d'accumuler suffisamment d'expérience émotionnelle pour contourner leurs limites psychophysiques.",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800",
    quote: "La lumière qui brûle deux fois plus vite brûle deux fois moins longtemps."
  },
  {
    id: 3,
    text: "Quel test d'empathie est utilisé par l'unité des Blade Runners pour identifier les réplicants suspects ?",
    options: ["Le Test Turing", "Le Test de Voight-Kampff", "L'Épreuve psychologique de Rorschach", "La Grille d'évaluation Schüfftan"],
    correctAnswerIndex: 1,
    explanation: "Le test de Voight-Kampff mesure les réactions physiologiques involontaires (fluctuations capillaires, rythme respiratoire et dilatation de la pupille) en réponse à des questions dérangeantes impliquant généralement la souffrance d'animaux.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    quote: "Capteur oculaire actif... Posez le scénario de la tortue sur le dos."
  },
  {
    id: 4,
    text: "Dans quelle ville et en quelle année commence l'intrigue du premier film phare de Ridley Scott ?",
    options: ["Los Angeles en Novembre 2019", "Neo-Tokyo en Décembre 2021", "San Francisco en Septembre 2033", "Las Vegas en Octobre 2049"],
    correctAnswerIndex: 0,
    explanation: "L'introduction cultissime nous plonge dans un Los Angeles de Novembre 2019 futuriste et pluvieux, dominé par d'immenses cheminées industrielles crachant des flammes et des panneaux publicitaires monumentaux.",
    imageUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=800",
    quote: "LOS ANGELES // NOVEMBRE 2019"
  },
  {
    id: 5,
    text: "Quel animal sous forme d'origami plié en papier Deckard trouve-t-il au sol à la fin du film, prouvant que Gaff connaît ses rêves ?",
    options: ["Un mouton", "Un hibou", "Une licorne", "Un serpent"],
    correctAnswerIndex: 2,
    explanation: "L'origami de licorne laissé par Gaff est un des indices les plus débattus du cinéma : il suggère que les rêves secrets de Rick Deckard (qui rêve d'une licorne blanche) sont enregistrés dans ses dossiers de fabrication de réplicant.",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
    quote: "C'est dommage qu'elle ne doive pas vivre. Mais qui vit, après tout ?"
  },
  {
    id: 6,
    text: "Quelle est l'ultime phrase prononcée par Roy Batty à Deckard sur le toit du Bradbury avant sa mort d'obsolescence ?",
    options: [
      "« C'est une dure chose que de vivre dans la peur. »",
      "« J'ai vu des choses que vous, humains, ne pourriez croire. »",
      "« Tous ces moments se perdront dans le temps, comme des larmes dans la pluie... Le temps de mourir. »",
      "« J'ai fait des choses douteuses, mais rien dont l'homme de la création ne doive avoir honte. »"
    ],
    correctAnswerIndex: 2,
    explanation: "La tirade des « Larmes dans la pluie » (Tears in rain), en partie improvisée par Rutger Hauer, exprime la détresse existentielle des réplicants et leur passion de vivre. Elle constitue le sommet poétique absolu du film de science-fiction.",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
    quote: "Tous ces moments se perdront dans le temps... comme des larmes dans la pluie."
  }
];

export default function QuizView() {
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<"intro" | "playing" | "summary">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = BLADE_RUNNER_QUESTIONS[currentQuestionIndex];

  // Helper Beep Sound Generator
  const playTacticalBeep = (freq: number, duration = 0.08, type: OscillatorType = "sine") => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem("bladeRunner_soundEnabled") === "false") return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (_) {}
  };

  const handleStartQuiz = () => {
    playTacticalBeep(650, 0.15);
    setGameState("playing");
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setIsAnswered(false);
    setScore(0);
  };

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswerIndex(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
      playTacticalBeep(880, 0.12); // Short pleasant high beep
    } else {
      playTacticalBeep(220, 0.25, "sawtooth"); // Low warning buzz
    }
  };

  const handleNextQuestion = () => {
    playTacticalBeep(540, 0.08);
    if (currentQuestionIndex + 1 < BLADE_RUNNER_QUESTIONS.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswerIndex(null);
      setIsAnswered(false);
    } else {
      setGameState("summary");
      playTacticalBeep(780, 0.2, "sine");
    }
  };

  // Compute final diagnosis evaluation text and profile ranking
  const getDiagnosis = () => {
    const total = BLADE_RUNNER_QUESTIONS.length;
    const ratio = score / total;

    if (ratio === 1) {
      return {
        rank: "BLADE RUNNER D'ÉLITE - NIVEAU CAPITAINE",
        statusColor: "text-cyan-400 border-cyan-500/30 bg-cyan-950/20",
        bgImage: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800",
        description: "Votre degré de discernement et votre parfaite connaissance des dossiers de la Tyrell Corporation dépassent les standards requis. Vous décelez les anomalies Nexus-6 à la volée. Gaff vous-même vous laisserait une licorne d'or au pas de votre porte."
      };
    } else if (ratio >= 0.65) {
      return {
        rank: "INSPECTEUR QUALIFIÉ DU SQUAD LAPD",
        statusColor: "text-purple-400 border-purple-500/30 bg-purple-950/20",
        bgImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
        description: "Excellente analyse tactique globale. Vos connaissances de la filmographie de Ridley Scott et de l'univers dystopique sont acérées. Des heures de re-visionnages de la version Final Cut vous ont consolidé."
      };
    } else if (ratio >= 0.35) {
      return {
        rank: "SÉLECTION PROBATOIRE : ALERTE SYSTÈME LIMBIQUE",
        statusColor: "text-amber-400 border-amber-500/30 bg-amber-950/20",
        bgImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800",
        description: "Vos scores de cohérence oculaire et conceptuelle oscillent dangereusement. Vous confondez parfois les licornes avec des chouettes de synthèse. Une formation accélérée de recyclage oculaire au bureau central est recommandée."
      };
    } else {
      return {
        rank: "SUSPECT IDENTIFIÉ NEXUS - ORDRE RETRAIT IMMÉDIAT",
        statusColor: "text-red-400 border-red-500/30 bg-red-950/20",
        bgImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
        description: "Vos réponses manquent cruellement d'alignement avec les registres officiels. Les capteurs de Voight-Kampff s'affolent : votre lueur oculaire rouge est désormais confirmée. Veuillez rester immobile, une unité de retrait de Blade Runners est en transit vers vos coordonnées."
      };
    }
  };

  if (loading) {
    return (
      <TerminalLoader
        onComplete={() => setLoading(false)}
        targetDataName="SCRIPT_EVAL_TACTICAL_QUIZ_v1.09"
      />
    );
  }

  const diagnosis = getDiagnosis();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="space-y-6 text-left max-w-4xl mx-auto"
      id="interactive-quiz-view-root"
    >
      {/* HUD Header Banner */}
      <div className="flex items-center space-x-3.5 border-b border-gray-900 pb-5">
        <div className="p-2 bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 rounded-lg flicker-effect shrink-0">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-display font-black tracking-widest text-white uppercase">
            ÉVEIL DE MÉMOIRE : INTERACTIVE QUIZ
          </h1>
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
            ÉVALUATION DE SÉCURITÉ DE L'EXAMINATEUR - CONNAISSANCES CRITIQUES SUR L'UNIVERS DE BLADE RUNNER (1982)
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* State 1: Intro Frame */}
        {gameState === "intro" && (
          <motion.div
            key="quiz-intro"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-950 border border-gray-900 rounded-2xl overflow-hidden shadow-2xl relative"
          >
            <div className="relative aspect-[21/9] w-full bg-gray-900 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1200"
                alt="Blade Runner Intro Banner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-50 saturate-50 contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent" />
              <div className="absolute top-4 left-4 bg-cyan-950/80 border border-cyan-500/30 text-[9px] font-mono font-bold text-cyan-400 px-3 py-1 rounded-full uppercase tracking-wider">
                PROTOCOLE LAPD_REF: QUIZ-777
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-5">
              <div className="space-y-2">
                <h2 className="text-base font-display font-bold text-cyan-400 uppercase tracking-widest">
                  CONSCRIPTION INTEL : PROUVEZ VOTRE HUMANITÉ
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Bienvenue à la console d'évaluation interactive de l'unité LAPD. Ce test comporte {BLADE_RUNNER_QUESTIONS.length} questions critiques à choix multiples tirées de l'enquête originale de Rick Deckard et des indices de fabrication des Nexus-6. 
                  Chaque bonne réponse consolidera vos fichiers d'autorisation d'accès. Chaque échec augmentera votre seuil de déviation de l'appareil de Voight-Kampff.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] font-mono text-gray-400">
                <div className="flex items-center space-x-2.5 p-3 bg-gray-900/40 border border-gray-900 rounded-lg">
                  <ShieldAlert className="h-4.5 w-4.5 text-purple-400 shrink-0" />
                  <span>Seuil de validation : 65% correct ou plus</span>
                </div>
                <div className="flex items-center space-x-2.5 p-3 bg-gray-900/40 border border-gray-900 rounded-lg">
                  <Clock className="h-4.5 w-4.5 text-cyan-400 shrink-0" />
                  <span>Aucune pénalité de temps // Réalisez le quiz sereinement</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStartQuiz}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-950 to-purple-950 hover:from-cyan-900 hover:to-purple-900 border border-cyan-500/30 text-cyan-300 hover:text-white font-display text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)] cursor-pointer hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]"
                >
                  <Play className="h-4 w-4" />
                  <span>LANCER LE PROTOCOLE DE QUIZ</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* State 2: Active Playing Game */}
        {gameState === "playing" && (
          <motion.div
            key={`quiz-item-${currentQuestionIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.28 }}
            className="space-y-6"
          >
            {/* HUD Question Counter Progress */}
            <div className="bg-gray-950 border border-gray-900/80 p-4 rounded-xl flex items-center justify-between font-mono text-xs text-gray-400 gap-4">
              <span>QUESTION : {currentQuestionIndex + 1} SUR {BLADE_RUNNER_QUESTIONS.length}</span>
              
              <div className="flex-grow max-w-xs bg-gray-900 rounded-full h-2 overflow-hidden mx-4">
                <div 
                  className="bg-cyan-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                  style={{ width: `${((currentQuestionIndex) / BLADE_RUNNER_QUESTIONS.length) * 100}%` }}
                />
              </div>

              <span>SCORE ACTUEL : {score} / {currentQuestionIndex}</span>
            </div>

            {/* Question Card Box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gray-950 border border-gray-900 rounded-2xl overflow-hidden p-6">
              {/* Left Column: Visual representations Theme */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-900 border border-gray-900/60 shadow-lg">
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Question visual themed"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter saturate-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent" />
                </div>

                {currentQuestion.quote && (
                  <div className="p-3.5 bg-gray-900/30 border-l-2 border-purple-500/50 rounded-r-lg font-mono text-[10.5px] text-purple-300 italic leading-relaxed">
                    « {currentQuestion.quote} »
                  </div>
                )}
              </div>

              {/* Right Column: Choices Options list */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <h3 className="text-white font-display font-medium text-sm md:text-base leading-relaxed tracking-wide uppercase text-left">
                    {currentQuestion.text}
                  </h3>

                  <div className="space-y-2.5">
                    {currentQuestion.options.map((option, idx) => {
                      // Determine custom styles and icons based on answered state
                      let optionStyle = "border-gray-900 bg-gray-900/30 text-gray-300 hover:bg-gray-900/70 hover:border-cyan-500/30 cursor-pointer";
                      let suffixIcon = null;

                      if (isAnswered) {
                        const isCorrectOption = idx === currentQuestion.correctAnswerIndex;
                        const isSelectedOption = idx === selectedAnswerIndex;

                        if (isCorrectOption) {
                          optionStyle = "border-green-500/50 bg-green-950/20 text-green-300";
                          suffixIcon = <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />;
                        } else if (isSelectedOption) {
                          optionStyle = "border-red-500/50 bg-red-950/20 text-red-300";
                          suffixIcon = <XCircle className="h-4 w-4 text-red-400 shrink-0" />;
                        } else {
                          optionStyle = "border-gray-950 bg-gray-950/50 text-gray-500 opacity-60 pointer-events-none";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswered}
                          onClick={() => handleAnswerSelect(idx)}
                          className={`w-full text-left px-5 py-3.5 border rounded-xl text-xs font-sans tracking-wide transition-all flex items-center justify-between ${optionStyle}`}
                        >
                          <span className="flex items-center space-x-3 text-left">
                            <span className="font-mono font-bold text-[10px] uppercase text-cyan-500/70">
                              [{String.fromCharCode(65 + idx)}]
                            </span>
                            <span>{option}</span>
                          </span>
                          {suffixIcon}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question Feedback explanation & Next Button */}
                <AnimatePresence>
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gray-900/50 border border-gray-900 rounded-xl space-y-3"
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest block">RAPPEL DE TRANSFERT D'ARCHIVE :</span>
                        <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                          {currentQuestion.explanation}
                        </p>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={handleNextQuestion}
                          className="flex items-center space-x-1.5 px-4.5 py-2 bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-900/30 text-cyan-300 hover:text-white font-mono text-[10.5px] font-black uppercase tracking-widest rounded-lg cursor-pointer transition-colors"
                        >
                          <span>{currentQuestionIndex + 1 === BLADE_RUNNER_QUESTIONS.length ? "Rapport final" : "Suivant"}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* State 3: Summary diagnostic view */}
        {gameState === "summary" && (
          <motion.div
            key="quiz-summary"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-950 border border-gray-900 rounded-2xl overflow-hidden shadow-2xl relative"
          >
            {/* Themed backdrop for score */}
            <div className="relative aspect-[21/9] w-full bg-gray-900 overflow-hidden">
              <img
                src={diagnosis.bgImage}
                alt="Evaluation Result context"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-45 saturate-40 contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/35 to-transparent" />
              
              {/* Score badge centering */}
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-cyan-400/80 uppercase">SCORE D'ALIGNEMENT</span>
                <div className="text-4xl md:text-5xl font-display font-black text-white tracking-widest flicker-effect">
                  {score} / {BLADE_RUNNER_QUESTIONS.length}
                </div>
                <span className="text-[9px] font-mono text-gray-500 uppercase">
                  Taux de réussite : {Math.round((score / BLADE_RUNNER_QUESTIONS.length) * 100)}%
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* Diagnosis box */}
              <div className={`p-4 border-l-4 rounded-r-xl space-y-1.5 ${diagnosis.statusColor}`}>
                <div className="flex items-center space-x-2">
                  <Award className="h-4.5 w-4.5 shrink-0" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest leading-none">
                    DIAGNOSTIC LAPD : {diagnosis.rank}
                  </span>
                </div>
                <p className="text-[11.5px] leading-relaxed font-sans text-gray-300">
                  {diagnosis.description}
                </p>
              </div>

              {/* Statistics & details recap */}
              <div className="space-y-2.5">
                <span className="text-[9px] font-mono font-bold tracking-widest text-gray-500 uppercase px-1">
                  PARAMÈTRES ANALYTIQUES CONDUITS :
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-[11px] font-mono text-gray-400">
                  <div className="p-3 bg-gray-900/30 border border-gray-900 rounded-xl space-y-1">
                    <span className="text-gray-500 uppercase text-[9px]">ID CONSOLE</span>
                    <span className="block text-white">#LAPD-VK-{Math.floor(1000 + Math.random() * 9000)}-Q</span>
                  </div>
                  <div className="p-3 bg-gray-900/30 border border-gray-900 rounded-xl space-y-1">
                    <span className="text-gray-500 uppercase text-[9px]">DIAGNOSTIC TEMPS</span>
                    <span className="block text-white">CHRONOS_OK // SECURE</span>
                  </div>
                  <div className="p-3 bg-gray-900/30 border border-gray-900 rounded-xl space-y-1">
                    <span className="text-gray-500 uppercase text-[9px]">INTÉGRITÉ SYSTÈME</span>
                    <span className="block text-white">
                      {score >= 4 ? "HUMAIN CERTIFIÉ" : "REPLICANT RETIRÉ OK"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-gray-900/50 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleStartQuiz}
                  className="flex items-center justify-center space-x-2 px-5 py-3 bg-cyan-950/40 hover:bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 hover:text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer grow text-center"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>RELANCER LE PROTOCOLE</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
