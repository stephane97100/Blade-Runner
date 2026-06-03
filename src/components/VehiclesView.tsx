import { useState, useRef, MouseEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Maximize2, ZoomIn, ZoomOut, Check, ChevronRight, Eye, RefreshCw, Layers, Sliders, Shield, AlertTriangle } from "lucide-react";
import TerminalLoader from "./TerminalLoader";

interface Vehicle {
  id: string;
  name: string;
  category: "Spécification Volante (VTOL)" | "Unité de Surface" | "Transport Spatial";
  description: string;
  lore: string;
  visualUrl: string;
  specs: {
    maxSpeed: string;
    propulsion: string;
    armor: string;
    crew: string;
    length: string;
    weapons?: string;
  };
}

const VEHICLES_DATABASE: Vehicle[] = [
  {
    id: "lapd-spinner",
    name: "LAPD Spinner (Standard Model)",
    category: "Spécification Volante (VTOL)",
    description: "Le Spinner est le véhicule de patrouille volant emblématique utilisé par le département de police de Los Angeles pour surveiller la mégapole et traquer les réplicants hors-la-loi.",
    lore: "Capable de circuler au sol comme une voiture classique, il utilise une propulsion aérodynamique verticale (VTOL) pour s'élever au-dessus du trafic étouffant de Los Angeles. Ses portes s'ouvrent en ciseaux, et le plancher du cockpit intègre des trappes transparentes pour permettre une visibilité au sol absolue lors des patrouilles.",
    visualUrl: "https://images.unsplash.com/photo-1533560224143-69661558f11b?auto=format&fit=crop&q=80&w=800",
    specs: {
      maxSpeed: "450 km/h (Mégapole) // 850 km/h (Altitude libre)",
      propulsion: "Turbines ioniques jumelles et propulseurs d'air pressurisés",
      armor: "Blindage polycarbonate et alliage de titane allégé",
      crew: "2 Officiers LAPD",
      length: "5.4 Mètres",
      weapons: "Émetteur de décharges IEM, canons laser d'interception à focalisation courte"
    }
  },
  {
    id: "peugeot-spinner",
    name: "Brutalist Spinner (Modèle 2049)",
    category: "Spécification Volante (VTOL)",
    description: "Un spinner à trois roues d'apparence anguleuse et minimaliste conçu pour affronter les conditions climatiques extrêmes et acides du milieu du XXIe siècle.",
    lore: "Ce modèle de spinner se distingue par un design brutaliste agressif et asymétrique. Ses vitres teintées en noir et ses panneaux de carbone renforcé protègent l'habitacle contre les tempêtes de sable radioactif d'outre-marge, comme dans le secteur de Las Vegas ou les décharges d'Orphanage à San Diego.",
    visualUrl: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=800",
    specs: {
      maxSpeed: "520 km/h (Mode volant)",
      propulsion: "Cellules à fusion froide et réacteurs orientables asymétriques",
      armor: "Matériaux composites carbone-fibres auto-réparateurs",
      crew: "1 Pilote + 1 Passager",
      length: "4.8 Mètres",
      weapons: "Scanner thermique longue distance, charges de démolition orbitales guidées"
    }
  },
  {
    id: "deckard-sedan",
    name: "Deckard's Ground Sedan (DeLorean Concept)",
    category: "Unité de Surface",
    description: "La voiture terrestre classique de Rick Deckard, solide et blindée, dotée de phares de repérage et de grilles de traitement antibruit.",
    lore: "Conçue à l'origine comme voiture de patrouille policière de surface banalisée, elle possède une suspension hydraulique ajustable robuste et d'épais pare-chocs conçus pour résister aux impacts à haute vitesse sous le bitume glissant de Los Angeles. Son habitacle est austère, dominé par des cadrans de détection analogiques rouges obsolètes.",
    visualUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800",
    specs: {
      maxSpeed: "220 km/h",
      propulsion: "Moteur rotatif à haute compression d'hydrocarbures synthétiques",
      armor: "Plaques de plomb pare-balles de niveau 4",
      crew: "1 Pilote + 1 Passager",
      length: "4.9 Mètres",
      weapons: "Aucune intégrée (Armements optionnels de coffre d'intervention)"
    }
  },
  {
    id: "sebastian-van",
    name: "Sebastian's Mobile Diagnostic Lab",
    category: "Unité de Surface",
    description: "La camionnette utilitaire cabossée et modifiée par J.F. Sebastian pour collecter des pièces médicales et transporter ses prototypes génétiques à travers les quartiers industriels.",
    lore: "Un vieux modèle de transport blindé reconverti en laboratoire ambulant autonome. Sebastian l'utilise pour maintenir temporairement l'homéostasie de ses petits jouets génétiques lors de ses déplacements. Le véhicule est encombré d'oscilloscopes cathodiques et d'outils de micro-ingénierie biologique.",
    visualUrl: "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=800",
    specs: {
      maxSpeed: "140 km/h",
      propulsion: "Hélice de combustion diesel hybride hautement filtrée",
      armor: "Tôle d'acier galvanisée de récupération",
      crew: "1 Conducteur + Animaux de compagnie génétiques",
      length: "5.8 Mètres"
    }
  },
  {
    id: "tyrell-shuttle",
    name: "Tyrell Executive Shuttle (V-10)",
    category: "Transport Spatial",
    description: "Un navette de transport spatial lourd à l'esthétique dorée et géométrique, réservée à la haute direction de la Tyrell Corporation.",
    lore: "Cette merveille technologique intègre des quartiers d'habitation complets avec de confortables banquettes impériales en velours pour les longs transferts vers les colonies d'outre-monde (Off-world colonies). Elle utilise des propulseurs plasmiques de pointe pour échapper à la pesanteur terrestre de manière presque imperceptible.",
    visualUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800",
    specs: {
      maxSpeed: "Mach 4.5 (Entrée atmosphérique) // Hyperpropulsion (Orbital)",
      propulsion: "Quatre réacteurs plasmiques à confinement magnétique",
      armor: "Plaques céramiques thermorésistantes plaquées titane-or",
      crew: "2 Pilotes Androids + 6 Passagers VIP",
      length: "14.2 Mètres"
    }
  }
];

export default function VehiclesView() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/vehicles")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.items && data.items.length > 0) {
          setItems(data.items);
          setSelectedVehicle(data.items[0]);
        }
      })
      .catch(err => console.error("Error loading vehicles:", err));
  }, []);

  // Play beep sound effect
  const playBeep = (freq: number) => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem("bladeRunner_soundEnabled") === "false") return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (_) {}
  };

  const handleVehicleSelect = (v: Vehicle) => {
    playBeep(480);
    setSelectedVehicle(v);
    setZoomLevel(1);
    setOffset({ x: 0, y: 0 });
  };

  // Magnifier Zoom calculations on Hover / Drag
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (zoomLevel <= 1 || !containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const cursorX = e.clientX - left;
    const cursorY = e.clientY - top;

    // Center offset based on cursor position relative to center
    const pctX = (cursorX / width) - 0.5;
    const pctY = (cursorY / height) - 0.5;

    // Limit translation distance based on zoom factor
    const maxX = (width * (zoomLevel - 1)) / 2;
    const maxY = (height * (zoomLevel - 1)) / 2;

    setOffset({
      x: -pctX * maxX * 2,
      y: -pctY * maxY * 2
    });
  };

  const handleZoomIn = () => {
    playBeep(550);
    setZoomLevel(prev => Math.min(prev + 0.3, 2.5));
  };

  const handleZoomOut = () => {
    playBeep(420);
    setZoomLevel(prev => Math.max(prev - 0.3, 1));
    if (zoomLevel <= 1.3) setOffset({ x: 0, y: 0 });
  };

  const handleResetZoom = () => {
    playBeep(350);
    setZoomLevel(1);
    setOffset({ x: 0, y: 0 });
  };

  if (loading || !selectedVehicle || items.length === 0) {
    return (
      <TerminalLoader
        onComplete={() => setLoading(false)}
        targetDataName="SECTION_DÉCLASSIFIÉE : SCHÉMAS ET VÉHICULES DU LAPD & TYRELL"
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
      {/* View Header Bar */}
      <div className="border-b border-gray-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-1 px-2.5 bg-cyan-950/40 border border-cyan-500/30 rounded text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest animate-pulse">
            CLASSIFICATION : DECLASSIFIED
          </div>
          <h1 className="text-xl md:text-2xl font-display font-black tracking-widest text-white uppercase flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            VÉHICULES DU FUTUR
          </h1>
        </div>
        <p className="text-xs text-gray-400 font-mono leading-relaxed mt-1 uppercase">
          Analyseur visuel interactif des navettes VTOL, spinners de surface et modules inter-médias du LAPD
        </p>
      </div>

      {/* Main interactive grid area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left selector menu buttons */}
        <div className="lg:col-span-4 space-y-4">
          <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase block">
            SÉLECTIONNER UN MODÈLE :
          </span>

          <div className="space-y-2.5">
            {items.map((v) => {
              const active = v.id === selectedVehicle.id;
              return (
                <button
                  key={v.id}
                  onClick={() => handleVehicleSelect(v)}
                  className={`w-full flex flex-col items-start px-4 py-3.5 border text-left rounded-xl transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                    active
                      ? "bg-cyan-950/30 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.05)] text-white"
                      : "bg-gray-950 border-gray-900/40 text-gray-400 hover:text-white hover:border-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-display uppercase tracking-widest font-black">
                      {v.name}
                    </span>
                    <ChevronRight className={`h-4 w-4 text-cyan-500 transition-transform ${active ? "translate-x-1" : "group-hover:translate-x-0.5"}`} />
                  </div>
                  <span className="text-[9px] font-mono text-gray-500 mt-1 uppercase">
                    {v.category}
                  </span>

                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 flicker-effect" />
                  )}
                </button>
              );
            })}
          </div>

          {/* HUD Tech specs stamp */}
          <div className="border border-cyan-500/10 bg-cyan-950/5 rounded-xl p-4 space-y-3 leading-normal">
            <div className="flex items-center space-x-2 text-cyan-400">
              <Shield className="h-4 w-4" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase">INSPECTION STATS DE VÉHICULE</span>
            </div>
            <p className="text-[10.5px] text-gray-400 font-sans leading-relaxed">
              Survolez le module visuel central pour déclencher le scanner thermique. Utilisez les commandes de zoom pour décrypter le niveau d'usure des réacteurs ioniques de surface.
            </p>
          </div>
        </div>

        {/* Right detailed specifications and interactive zooming viewer */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Visuel / Photo Panel with zoom interface */}
          <div className="bg-gray-950 border border-gray-900 rounded-xl overflow-hidden shadow-2xl relative">
            <div className="p-3 bg-gray-950/80 border-b border-gray-900 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] font-mono text-red-400 tracking-wider font-bold">LIVE TELEMETRY MONITOR // ZOOM: {(zoomLevel * 100).toFixed(0)}%</span>
              </div>

              {/* Zoom action controls */}
              <div className="flex items-center space-x-1 bg-gray-900 border border-gray-800 rounded-lg p-0.5">
                <button
                  onClick={handleZoomOut}
                  title="Zoom Arrière"
                  className="p-1 px-2.5 text-gray-400 hover:text-white hover:bg-gray-850 rounded font-mono text-xs transition-colors cursor-pointer"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <div className="h-3 w-[1px] bg-gray-850 mx-1" />
                <button
                  onClick={handleResetZoom}
                  title="Réinitialiser"
                  className="p-1 px-1.5 text-[9px] font-mono text-gray-400 hover:text-white hover:bg-gray-850 rounded transition-colors uppercase tracking-widest cursor-pointer"
                >
                  1x
                </button>
                <div className="h-3 w-[1px] bg-gray-850 mx-1" />
                <button
                  onClick={handleZoomIn}
                  title="Zoom Avant"
                  className="p-1 px-2.5 text-gray-400 hover:text-white hover:bg-gray-850 rounded font-mono text-xs transition-colors cursor-pointer"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Micro zoom image content display and mouse tracker */}
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                if (zoomLevel > 1) {
                  // Keep offset but smoothly guide
                }
              }}
              className="relative aspect-[16/10] overflow-hidden bg-black select-none cursor-crosshair"
            >
              <img
                src={selectedVehicle.visualUrl}
                alt={selectedVehicle.name}
                referrerPolicy="no-referrer"
                style={{
                  transform: `scale(${zoomLevel}) translate(${offset.x / zoomLevel}px, ${offset.y / zoomLevel}px)`,
                  transition: isHovered ? "none" : "transform 0.4s ease-out"
                }}
                className="w-full h-full object-cover filter saturate-40 hover:saturate-85 transition-all duration-300 pointer-events-none"
              />

              {/* Technical scanline grid overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_6px_100%] pointer-events-none opacity-45" />

              {/* Magnifier guide text */}
              {zoomLevel > 1 && (
                <div className="absolute bottom-3 left-3 bg-red-950/80 border border-red-500/30 text-[8px] font-mono text-red-300 px-2 py-1 rounded uppercase tracking-widest pointer-events-none animate-pulse">
                  GLISSER POUR INSPECTER LES SOUDURES
                </div>
              )}
            </div>

            {/* Slider zoom bar control */}
            <div className="p-3 bg-gray-950/80 border-t border-gray-900 flex items-center space-x-4">
              <span className="text-[9px] font-mono text-gray-500 uppercase shrink-0">INTENSITÉ DU SCAN</span>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.1"
                value={zoomLevel}
                onChange={(e) => {
                  setZoomLevel(parseFloat(e.target.value));
                  if (parseFloat(e.target.value) === 1) setOffset({ x: 0, y: 0 });
                }}
                className="w-full h-1 bg-gray-900 rounded-lg appearance-none cursor-ew-resize accent-cyan-500"
              />
              <span className="text-[10px] font-mono text-cyan-400 font-bold shrink-0">X{zoomLevel.toFixed(1)}</span>
            </div>
          </div>

          {/* Vehicle Information & Specifications Sheet Container */}
          <div className="bg-gray-950 border border-gray-900 rounded-xl p-6 text-left space-y-6">
            
            <div className="space-y-2">
              <span className="text-[9px] font-mono font-bold text-cyan-500 uppercase tracking-widest block">
                DOSSIER TECHNIQUE :
              </span>
              <h2 className="text-xl font-display font-black tracking-widest text-white uppercase">
                {selectedVehicle.name}
              </h2>
              <p className="text-xs text-cyan-200/90 font-sans leading-relaxed">
                {selectedVehicle.description}
              </p>
            </div>

            <div className="border-t border-gray-900 pt-5 space-y-3">
              <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                CONTEXTE LORE ET DÉPLOIEMENT :
              </span>
              <p className="text-[11.5px] text-gray-400 font-sans leading-relaxed">
                {selectedVehicle.lore}
              </p>
            </div>

            {/* Specifications Key Value Grid */}
            <div className="border-t border-gray-900 pt-5 space-y-4">
              <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                SPÉCIFICATIONS D'APPRÊTAGE D'INGÉNIERIE :
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-gray-900/40 p-3 border border-gray-900/30 rounded-lg space-y-1">
                  <span className="block text-[8px] font-mono text-gray-500 uppercase">PROPULSION CYBERNÉTIQUE</span>
                  <span className="text-[11px] font-mono text-cyan-300 font-bold">{selectedVehicle.specs.propulsion}</span>
                </div>

                <div className="bg-gray-900/40 p-3 border border-gray-900/30 rounded-lg space-y-1">
                  <span className="block text-[8px] font-mono text-gray-500 uppercase">VITESSE LIMITATION_MAX</span>
                  <span className="text-[11px] font-mono text-cyan-300 font-bold">{selectedVehicle.specs.maxSpeed}</span>
                </div>

                <div className="bg-gray-900/40 p-3 border border-gray-900/30 rounded-lg space-y-1">
                  <span className="block text-[8px] font-mono text-gray-500 uppercase">MATÉRIAU COQUE ET BLINDAGE</span>
                  <span className="text-[11px] font-mono text-cyan-300 font-bold">{selectedVehicle.specs.armor}</span>
                </div>

                <div className="bg-gray-900/40 p-3 border border-gray-900/30 rounded-lg space-y-1">
                  <span className="block text-[8px] font-mono text-gray-500 uppercase">UNITÉ D'ÉQUIPAGE REQUIS</span>
                  <span className="text-[11px] font-mono text-cyan-300 font-bold">{selectedVehicle.specs.crew}</span>
                </div>

                <div className="bg-gray-900/40 p-3 border border-gray-900/30 rounded-lg space-y-1">
                  <span className="block text-[8px] font-mono text-gray-500 uppercase">LONGUEUR RELEVÉE</span>
                  <span className="text-[11px] font-mono text-cyan-300 font-bold">{selectedVehicle.specs.length}</span>
                </div>

                {selectedVehicle.specs.weapons && (
                  <div className="bg-gray-900/40 p-3 border border-gray-900/30 rounded-lg space-y-1 md:col-span-1">
                    <span className="block text-[8px] font-mono text-gray-500 uppercase">SYSTÈME D'ARMEMENT EMBARQUÉ</span>
                    <span className="text-[11px] font-mono text-red-300 font-bold uppercase">{selectedVehicle.specs.weapons}</span>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>

      </div>
    </motion.div>
  );
}
