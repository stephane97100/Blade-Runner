import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, ShieldAlert, Cpu, Heart, Skull, Zap, Radio, Target, Crosshair, HelpCircle, Activity } from "lucide-react";
import TerminalLoader from "./TerminalLoader";

const royPortrait = "/src/assets/images/roy_batty_portrait_1780538185101.png";
const prisPortrait = "/src/assets/images/pris_stratton_portrait_1780538204534.png";
const rachaelPortrait = "/src/assets/images/rachael_portrait_1780538221313.png";
const leonPortrait = "/src/assets/images/leon_kowalski_portrait_1780538236400.png";
const zhoraPortrait = "/src/assets/images/zhora_salome_portrait_1780538252845.png";

interface Replicant {
  id: string;
  name: string;
  serial: string;
  modelType: string;
  inceptDate: string;
  lifespan: string;
  portraitUrl: string;
  role: string;
  capabilities: string[];
  destiny: string;
  cognitiveStatus: string;
  physicalProfile: string;
  vkReadout: string;
}

const REPLICANTS_DATA: Replicant[] = [
  {
    id: "roy",
    name: "Roy Batty",
    serial: "N6MAA10816",
    modelType: "Nexus-6 (Modèle Combat Aérien / Militaire)",
    inceptDate: "08 JANV. 2016",
    lifespan: "4 Ans (Limitation génétique stricte)",
    portraitUrl: royPortrait,
    role: "Chef charismatique des réplicants fugitifs. Conçu pour le combat à haut risque dans les Colonies d'Outre-monde. Doté d'une intelligence tactique supérieure et d'une force physique dévastatrice.",
    capabilities: ["Force hors norme (A++)", "QI de niveau génie (S)", "Combat tactique rapproché", "Absence de sensation de douleur"],
    cognitiveStatus: "Instabilité croissante due aux implants de conscience émergente et à la terreur de sa propre date d'expiration.",
    physicalProfile: "1,90m, blondeur platine, constitution d'athlète olympique. Aucun défaut génétique détectable.",
    destiny: "S'éteint paisiblement sur le toit mouillé de l'immeuble Bradbury après avoir sauvé la vie de Deckard, formulant l'un de ses plus poétiques adieux : 'Tous ces moments se perdront dans le temps, comme des larmes dans la pluie.'",
    vkReadout: "Forte résistance. Réponses évasives poétiques de haut niveau. Diagnostic instantané de déviation cognitive."
  },
  {
    id: "pris",
    name: "Pris Stratton",
    serial: "N6FAB21416",
    modelType: "Nexus-6 (Modèle de Plaisance de Base / Infiltration)",
    inceptDate: "14 FÉVR. 2016",
    lifespan: "4 Ans (Limitation génétique stricte)",
    portraitUrl: prisPortrait,
    role: "Compagne de Roy Batty, conçue comme un modèle d'infiltration militaire et de divertissement. Extrêmement agile, gymnaste de génie capable d'exploiter la naïveté humaine pour s'infiltrer chez ses cibles.",
    capabilities: ["Souplesse et agilité hors norme (A)", "Infiltration psychologique", "Vitesse de réflexe accrue", "Résistance thermique élevée"],
    cognitiveStatus: "Attachement romantique obsessionnel pour Roy. Comportement erratique de poupée robotique désarticulée.",
    physicalProfile: "1,73m, maquillage théâtral façon raton-laveur, cheveux blonds ébouriffés, habileté gymnique féline.",
    destiny: "Mise à la retraite chez J.F. Sebastian par Rick Deckard après l'avoir attaqué par surprise avec des prises acrobatiques déconcertantes.",
    vkReadout: "Réponses émotionnelles de façade hautement adaptatives. Incohérence lors des stimuli moraux primaires."
  },
  {
    id: "rachael",
    name: "Rachael",
    serial: "N7FAA12419 (Expérimental HS)",
    modelType: "Nexus-7 (Prototype expérimental à mémoire humaine)",
    inceptDate: "24 MAI 2019",
    lifespan: "Illimitée (Non bridée au niveau cellulaire)",
    portraitUrl: rachaelPortrait,
    role: "Secrétaire de confiance d'Eldon Tyrell. Elle constitue le fleuron technologique de la Tyrell Corporation : un réplicant doté de souvenirs fictifs provenant de la nièce d'Eldon, l'amenant à se croire initialement humaine.",
    capabilities: ["Mémoire autobiographique implantée", "Empathie quasi-humaine", "Capacités d'adaptation émotionnelle", "Stabilité comportementale"],
    cognitiveStatus: "Trauma psychologique sévère après la découverte de son statut de machine artificielle.",
    physicalProfile: "1,70m, tailleur 1940 structuré à épaulettes, coiffure légendaire en victory rolls, élégance mélancolique.",
    destiny: "Prend la fuite dans le spinner de Deckard à la fin du film original pour vivre une vie libre, échappant pour un temps aux commanditaires de la LAPD.",
    vkReadout: "Nécessite plus de 100 questions (contre une trentaine habituellement) pour détecter de légères anomalies de réflexe de l'iris."
  },
  {
    id: "leon",
    name: "Leon Kowalski",
    serial: "N6MAC41717",
    modelType: "Nexus-6 (Manutention lourde / Élimination)",
    inceptDate: "17 AVRIL 2017",
    lifespan: "4 Ans (Limitation génétique stricte)",
    portraitUrl: leonPortrait,
    role: "Ouvrier de force utilisé pour le traitement des déchets nucléaires et la logistique minière. Moins structuré intellectuellement que Roy, mais d'une force brute brute et doté d'une totale insensibilité à la chaleur.",
    capabilities: ["Force de levage extrême (A+++)", "Haute tolérance aux radiations", "Insensibilisation à la douleur thermique", "Grande résistance physique"],
    cognitiveStatus: "Faible discernement. Obsédé par les photographies de famille factices qui lui servent d'ancrage psychologique.",
    physicalProfile: "1,85m, carrure extrêmement lourde, force colossale capable d'introduire sa main dans les conduits de liquide de refroidissement radioactifs à haute température.",
    destiny: "Tente de venger la mort de Zhora en s'attaquant physiquement à Deckard dans les rues de L.A. Retiré in extremis par Rachael d'une balle de pistolet Blaster.",
    vkReadout: "Se dérobe violemment lors des questions impliquant des émotions d'attachement familial d'enfance. Panique rapide."
  },
  {
    id: "zhora",
    name: "Zhora Salome",
    serial: "N6FAB61216",
    modelType: "Nexus-6 (Assassinat politique / Force Spéciale)",
    inceptDate: "12 JUIN 2016",
    lifespan: "4 Ans (Limitation génétique stricte)",
    portraitUrl: zhoraPortrait,
    role: "Ancienne membre des forces de combat d'outre-monde, reconvertie en danseuse exotique sous l'alias de 'Miss Salome' avec un serpent artificiel pour dissimuler ses activités secrètes à la LAPD.",
    capabilities: ["Idéalisation de combat de mêlée", "Maîtrise complète du venin et des armes", "Vitesse de fuite accrue", "Discrétion chirurgicale"],
    cognitiveStatus: "Sens de l'autonomie surdéveloppé. Haine des représentants policiers autoritaires.",
    physicalProfile: "1,75m, rousseur de braise, athlétique, tatouage de serpent. Porte un imperméable transparent futuriste.",
    destiny: "Traquée par Deckard dans les rues animées de Chinatown. Abattue par derrière lors d'une course effrénée à travers les vitrines d'un grand magasin.",
    vkReadout: "Profilage psychologique hautement trompeur. Se camoufle derrière des rôles séducteurs."
  },
  {
    id: "deckard_theory",
    name: "Rick Deckard (Hypothèse)",
    serial: "N6REPLICANT_DEV?",
    modelType: "Nexus-6 (Infiltrateur LAPD / Limite Inconnue)",
    inceptDate: "INCONNU",
    lifespan: "Inconnue (Possible code étendu)",
    portraitUrl: "https://picsum.photos/seed/deckard/300/400",
    role: "Le célèbre Blade Runner de la LAPD. De nombreux indices visuels (comme son rêve récurrent de licorne, les reflets oculaires orangés, et la licorne en origami laissée par Gaff) suggèrent qu'il pourrait lui-même être un réplicant programmé pour pourchasser ses semblables.",
    capabilities: ["Résistance physique élevée aux chocs", "Traque de cible et intuition logique", "Capacités de survie extrêmes", "Obsession du piano et des vieilles photos"],
    cognitiveStatus: "Mélancolie latente, alcoolisme secondaire, crise d'identité majeure face à ses actes de retrait.",
    physicalProfile: "1,82m, imperméable marron, allure fatiguée et visage buriné par les rudes combats sous la pluie perpétuelle.",
    destiny: "Quitte Los Angeles avec sa compagne Rachael après avoir épargné les réplicants restants, acceptant l'inconnu de sa propre condition biologique.",
    vkReadout: "Jamais officiellement testé. Hypothèse de blocage émotionnel programmé par Gaff et Bryant."
  }
];

export default function Nexus6View() {
  const [loading, setLoading] = useState(true);
  const [selectedRepl, setSelectedRepl] = useState<Replicant | null>(null);
  const [interactiveVK, setInteractiveVK] = useState(false);
  const [vkQuestionIdx, setVkQuestionIdx] = useState(0);
  const [capillaryPulse, setCapillaryPulse] = useState(60);
  const [eyeDilation, setEyeDilation] = useState(45);
  const [answers, setAnswers] = useState<string[]>([]);
  const [vkResult, setVkResult] = useState<"INCONCLUSIF" | "COGNITIVE_DRIFT_ALERT" | "CLEAR">("INCONCLUSIF");

  const vkQuestions = [
    {
      q: "Vous traversez le désert. Soudain, vous baissez les yeux et voyez une tortue qui rampe vers vous... Vous la retournez sur le dos, ses pattes s'agitent dans le vide, elle va mourir au soleil. Mais vous ne l'aidez pas. Pourquoi ?",
      options: [
        { text: "C'est quoi ce désert ? Je n'y mettrais jamais les pieds.", class: "highly-evasive" },
        { text: "Je la remettrais immédiatement sur ses pattes.", class: "normal-human" },
        { text: "Je me demande d'abord si elle est biologique ou artificielle.", class: "replicant-leaning" }
      ]
    },
    {
      q: "Vous invitez un ami à dîner. Il vante la qualité de votre repas mais vous remarquez qu'il écrase une guêpe sur la table. Quelle est votre première réaction ?",
      options: [
        { text: "Je lui demande de nettoyer la table sur-le-champ.", class: "normal-human" },
        { text: "Je reste focalisé sur le battement des ailes agonisantes.", class: "replicant-leaning" },
        { text: "Je n'invite personne chez moi. Je vis seul.", class: "highly-evasive" }
      ]
    },
    {
      q: "C'est votre anniversaire. On vous offre un portefeuille en cuir de bébé créature réelle. Que faites-vous ?",
      options: [
        { text: "Je remercie poliment mais je réclame la traçabilité de l'organisme.", class: "normal-human" },
        { text: "Je caresse doucement la texture de la peau morte pendant des heures.", class: "replicant-leaning" },
        { text: "Je déteste les cadeaux. C’est un instrument de contrôle émotionnel.", class: "highly-evasive" }
      ]
    }
  ];

  useEffect(() => {
    // Biometric eye parameters pulsing simulation
    const interval = setInterval(() => {
      setCapillaryPulse(prev => {
        const delta = Math.floor(Math.random() * 8) - 4;
        return Math.max(55, Math.min(130, prev + delta));
      });
      setEyeDilation(prev => {
        const delta = Math.floor(Math.random() * 6) - 3;
        return Math.max(30, Math.min(85, prev + delta));
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const selectReplicant = (repl: Replicant) => {
    setSelectedRepl(repl);
    setInteractiveVK(false);
    setVkQuestionIdx(0);
    setAnswers([]);
    setVkResult("INCONCLUSIF");
    // Mechanical click tones
    playBeep(220, "sine", 0.08);
    setTimeout(() => playBeep(440, "sine", 0.05), 80);
  };

  const playBeep = (freq: number, type: OscillatorType, dur: number) => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem("bladeRunner_soundEnabled") === "false") return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  };

  const selectOption = (opt: typeof vkQuestions[0]["options"][0]) => {
    playBeep(520, opt.class === "normal-human" ? "sine" : "sawtooth", 0.1);
    const nextAnswers = [...answers, opt.class];
    setAnswers(nextAnswers);

    // Dilation pupil spike based on classification
    if (opt.class === "replicant-leaning") {
      setEyeDilation(prev => Math.min(95, prev + 25));
      setCapillaryPulse(prev => Math.min(140, prev + 35));
    } else if (opt.class === "highly-evasive") {
      setEyeDilation(prev => Math.max(15, prev - 20));
      setCapillaryPulse(prev => Math.min(120, prev + 15));
    } else {
      setEyeDilation(prev => Math.max(40, Math.min(50, prev)));
      setCapillaryPulse(prev => Math.max(65, Math.min(75, prev)));
    }

    if (vkQuestionIdx < vkQuestions.length - 1) {
      setVkQuestionIdx(vkQuestionIdx + 1);
    } else {
      // Analyze results
      const replicantHits = nextAnswers.filter(a => a === "replicant-leaning").length;
      const evasiveHits = nextAnswers.filter(a => a === "highly-evasive").length;
      
      if (replicantHits >= 2 || (replicantHits >= 1 && evasiveHits >= 1)) {
        setVkResult("COGNITIVE_DRIFT_ALERT");
        playBeep(150, "sawtooth", 0.5);
      } else {
        setVkResult("CLEAR");
        playBeep(880, "sine", 0.4);
      }
    }
  };

  const resetVK = () => {
    setVkQuestionIdx(0);
    setAnswers([]);
    setVkResult("INCONCLUSIF");
    playBeep(330, "triangle", 0.15);
  };

  if (loading) {
    return (
      <TerminalLoader
        onComplete={() => setLoading(false)}
        targetDataName="ACCÈS BASES ARCHIVES TYRELL CORPORATION // SÉRIE NEXUS-6"
      />
    );
  }

  return (
    <div id="nexus6_layout_view" className="space-y-8 select-none">
      {/* Upper Title elements */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-900 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-amber-500 uppercase">
            REGISTRE REPLICANTS NEXUS-6
          </h1>
          <p className="text-gray-400 text-xs font-mono mt-1 uppercase flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-red-500 animate-pulse" />
            Statuts de Retrait // Analyse Biométrique du dôme de Tyrell
          </p>
        </div>
        <div className="bg-red-950/20 border border-red-500/10 rounded-lg px-3 py-1.5 text-right font-mono text-[9px] text-red-400">
          <span>ALERTE SÉCURITÉ LAPD : EXTRÊMEMENT DANGEREUX</span>
        </div>
      </div>

      {/* Grid of Replicants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {REPLICANTS_DATA.map((repl) => (
          <div
            key={repl.id}
            onClick={() => selectReplicant(repl)}
            className={`group bg-gray-950/65 border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1 text-left relative ${
              selectedRepl?.id === repl.id
                ? "border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.15)] bg-amber-950/20"
                : "border-gray-900 hover:border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.08)]"
            }`}
          >
            {/* Visual Scanline decorative */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Profile Image container */}
            <div className="h-72 overflow-hidden relative bg-gray-900/60 flex items-center justify-center">
              <img
                src={repl.portraitUrl}
                alt={repl.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/10 to-transparent"></div>

              {/* Status Indicator Stamp */}
              <div className="absolute top-3.5 right-3.5 flex flex-col gap-1.5 items-end">
                <span className={`text-[8.5px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border font-semibold ${
                  repl.id === "rachael"
                    ? "bg-purple-950/65 border-purple-500/40 text-purple-400"
                    : repl.id === "deckard_theory"
                    ? "bg-amber-950/60 border-amber-500/40 text-amber-500"
                    : "bg-red-950/60 border-red-500/40 text-red-400"
                }`}>
                  {repl.id === "rachael" ? "PROTO TYPE N-7" : repl.id === "deckard_theory" ? "CYBORG ?" : "NEXUS-6 SERIES"}
                </span>
              </div>

              {/* Targeting HUD Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-950/10 pointer-events-none">
                <div className="w-16 h-16 border border-dashed border-red-500/40 rounded-full flex items-center justify-center animate-spin">
                  <Crosshair className="h-6 w-6 text-red-500/70" />
                </div>
              </div>
            </div>

            {/* Replicant Specs */}
            <div className="p-4 space-y-1 border-t border-gray-900">
              <span className="text-[10px] font-mono uppercase text-gray-500 tracking-widest">{repl.serial}</span>
              <h3 className="text-base font-display font-black text-white hover:text-red-400 transition-colors uppercase">
                {repl.name}
              </h3>
              <p className="text-xs text-gray-400 font-sans line-clamp-2 leading-relaxed mt-1">
                {repl.role}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary detail section: ESPER-VOIGHT-KAMPFF ANALYSIS HUD */}
      <AnimatePresence mode="wait">
        {selectedRepl && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border border-amber-500/30 rounded-xl bg-gray-950/85 backdrop-blur-lg overflow-hidden flex flex-col lg:flex-row shadow-[0_0_25px_rgba(245,158,11,0.06)]"
          >
            {/* Left side: Detailed dossier */}
            <div className="p-6 md:p-8 lg:w-3/5 space-y-6 text-left border-b lg:border-b-0 lg:border-r border-gray-900">
              <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono text-amber-500/80 uppercase tracking-widest">RAPPORT CYBORG DE LA TYRELL CORP</span>
                  <h2 className="text-xl font-display font-black text-white uppercase tracking-wider">{selectedRepl.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedRepl(null)}
                  className="px-2 py-1 border border-gray-900 rounded text-[9px] font-mono text-gray-500 hover:text-red-400 hover:border-red-500/20 cursor-pointer"
                >
                  [ FERMER LE DOSSIER ]
                </button>
              </div>

              {/* Specification Specs List sheet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="bg-gray-900/30 border border-gray-950 p-3 rounded-lg space-y-1">
                  <span className="text-[8.5px] text-gray-500 uppercase block font-bold">NUMÉRO SÉRIE</span>
                  <span className="text-white text-xs">{selectedRepl.serial}</span>
                </div>
                <div className="bg-gray-900/30 border border-gray-950 p-3 rounded-lg space-y-1">
                  <span className="text-[8.5px] text-gray-500 uppercase block font-bold">DURÉE DE VIE</span>
                  <span className="text-red-400 text-xs font-bold">{selectedRepl.lifespan}</span>
                </div>
                <div className="bg-gray-900/30 border border-gray-950 p-3 rounded-lg space-y-1">
                  <span className="text-[8.5px] text-gray-500 uppercase block font-bold">DATE DE CONCEPTION</span>
                  <span className="text-white text-xs">{selectedRepl.inceptDate}</span>
                </div>
                <div className="bg-gray-900/30 border border-gray-950 p-3 rounded-lg space-y-1">
                  <span className="text-[8.5px] text-gray-500 uppercase block font-bold">SÉRIE / TYPE MODÈLE</span>
                  <span className="text-cyan-400 text-xs font-bold">{selectedRepl.modelType}</span>
                </div>
              </div>

              {/* Bio block & profile */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                  <Cpu className="h-3 w-3 text-cyan-400" />
                  PROFIL COGNITIF & CAPACITÉS ARCHITECTURALES
                </h4>
                <div className="p-3 bg-gray-900/20 border border-gray-900 rounded-lg space-y-3 font-sans text-xs leading-relaxed text-gray-300">
                  <p>{selectedRepl.role}</p>
                  <p className="border-t border-gray-900/60 pt-2.5 text-amber-300 italic">
                    <strong>État psychique :</strong> "{selectedRepl.cognitiveStatus}"
                  </p>
                  
                  {/* Capabilities tag grid */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedRepl.capabilities.map((cap, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded bg-gray-900 border border-gray-850 text-[9px] font-mono text-cyan-400 font-bold uppercase">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Destiny Block */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                  <Skull className="h-3 w-3 text-red-500" />
                  DESTINÉES DE FIN DE CYCLE (RETRAIT/FIN PARTIE)
                </h4>
                <div className="p-4 bg-red-950/5 border border-red-500/10 rounded-xl font-sans text-xs text-gray-300 leading-relaxed italic">
                  "{selectedRepl.destiny}"
                </div>
              </div>
            </div>

            {/* Right side: Interactive Voight-Kampff Biometric Tester */}
            <div className="p-6 md:p-8 lg:w-2/5 flex flex-col justify-between space-y-6 bg-gray-950/40 relative">
              
              {/* Scan HUD Header */}
              <div className="border-b border-gray-900 pb-3">
                <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  MODULE DE TEST VOIGHT-KAMPFF EN TEMPS RÉEL
                </span>
                <p className="text-[10px] font-sans text-gray-400 mt-1 leading-normal">
                  Évaluez la résonance du suspect à l'aide de stimuli moraux artificiels.
                </p>
              </div>

              {/* Biometric Eye Simulator graphic display */}
              <div className="relative aspect-video w-full bg-gray-900/60 border border-gray-800 rounded-xl flex flex-col items-center justify-center p-3 select-none overflow-hidden group">
                {/* Horizontal scanning laser line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/30 animate-pulse" />

                {/* Simulated Iris */}
                <div className="relative w-28 h-28 border border-gray-800 rounded-full flex items-center justify-center">
                  <div className="absolute inset-2 border border-dashed border-cyan-500/20 rounded-full animate-spin-slow" />
                  
                  {/* Glowing Pupil */}
                  <div 
                    className="rounded-full bg-gradient-to-tr from-amber-600 via-red-800 to-amber-500 flex items-center justify-center transition-all duration-700 shadow-[0_0_15px_rgba(220,38,38,0.35)]"
                    style={{ width: `${eyeDilation}%`, height: `${eyeDilation}%` }}
                  >
                    <div className="w-1/2 h-1/2 bg-black rounded-full" />
                  </div>

                  {/* Laser aiming reticle coordinates overlay */}
                  <div className="absolute inset-0 border border-red-500/10 rounded-full flex items-center justify-center">
                    <div className="w-full h-[1px] bg-red-400/10" />
                    <div className="h-full w-[1px] bg-red-400/10" />
                  </div>
                </div>

                {/* Real-time stats display bars */}
                <div className="absolute bottom-2 left-2.5 right-2.5 flex justify-between tracking-wider font-mono text-[7.5px] text-cyan-400/70">
                  <span className="flex items-center gap-1">
                    <Activity className="h-3 w-3 text-red-500 animate-pulse" />
                    IRIS PULSATION: {capillaryPulse} bpm
                  </span>
                  <span>CAPSULE EXPANSION: {eyeDilation * 2.2}%</span>
                </div>
              </div>

              {/* Questions dialogue & controls */}
              <div className="flex-grow flex flex-col justify-center space-y-4 pt-1">
                {!interactiveVK ? (
                  <div className="text-center py-6 space-y-3.5">
                    <p className="text-[11px] font-sans text-gray-400 italic">
                      "Étalonnage de la lentille ciliaire complétée. Prêt à lancer l'interrogatoire."
                    </p>
                    <button
                      onClick={() => {
                        setInteractiveVK(true);
                        resetVK();
                        playBeep(440, "sine", 0.08);
                      }}
                      className="w-full py-2.5 px-4 bg-cyan-950/40 border border-cyan-500/40 hover:bg-cyan-500/20 text-cyan-300 rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                    >
                      [ DÉBUTER INTERROGATOIRE VK ]
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {/* Progress tracking */}
                    <div className="flex justify-between items-center text-[8px] font-mono text-gray-500">
                      <span>QUESTION {vkQuestionIdx + 1} / {vkQuestions.length}</span>
                      <span className="text-amber-500/80 font-bold">V-K SCAN PROFILING active</span>
                    </div>

                    {vkResult === "INCONCLUSIF" ? (
                      <div className="space-y-3">
                        {/* Current Question text */}
                        <p className="text-xs text-gray-200 leading-normal font-sans bg-gray-900/40 p-3 rounded-lg border border-gray-900">
                          {vkQuestions[vkQuestionIdx].q}
                        </p>

                        {/* Options Buttons */}
                        <div className="space-y-2">
                          {vkQuestions[vkQuestionIdx].options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => selectOption(opt)}
                              className="w-full text-left p-2.5 bg-gray-900/60 hover:bg-gray-900 border border-gray-850 hover:border-cyan-500/35 rounded-lg text-[10.5px] text-gray-300 font-sans transition-all leading-normal cursor-pointer"
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* TEST RESULTS AREA */
                      <div className="bg-gray-900/40 p-4 border border-gray-850 rounded-lg space-y-3.5 text-center animate-fadeIn">
                        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block font-bold">VERDICT MACHINE BR-VK :</span>
                        
                        {vkResult === "COGNITIVE_DRIFT_ALERT" ? (
                          <div className="space-y-2">
                            <span className="inline-block px-3 py-1 bg-red-950 border border-red-500 text-red-400 text-xs font-mono font-extrabold tracking-widest uppercase rounded animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.25)]">
                              [ REPLICANT ASSIGNÉ // ALERTE SÉCURITÉ ]
                            </span>
                            <p className="text-[10px] text-red-300 font-sans leading-normal">
                              L'indice de dérive sémantique dépasse le seuil critique de 85%. Biométrie de l'iris incohérente lors des stimuli moraux. Mandat de retrait à émettre.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <span className="inline-block px-3 py-1 bg-emerald-950 border border-emerald-500 text-emerald-400 text-xs font-mono font-extrabold tracking-widest uppercase rounded shadow-[0_0_8px_rgba(16,185,129,0.25)]">
                              [ RÉSULTAT COGENT // HUMAIN CLEAR ]
                            </span>
                            <p className="text-[10px] text-emerald-300 font-sans leading-normal">
                              Réponses conformes au modèle moral biologique. Temps de réaction ciliaire nominal. Aucune déviation cognitive détectée.
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-1 font-mono text-[9px]">
                          <button
                            onClick={resetVK}
                            className="flex-grow py-2 border border-gray-800 rounded hover:border-cyan-500/30 text-gray-400 hover:text-cyan-300 cursor-pointer"
                          >
                            [ TEST RE-RUN ]
                          </button>
                          <button
                            onClick={() => setInteractiveVK(false)}
                            className="px-2.5 py-2 bg-gray-900 rounded border border-gray-800 text-gray-500 hover:text-white cursor-pointer"
                          >
                            RETOUR
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
