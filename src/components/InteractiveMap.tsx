import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Crosshair, MapPin, Map, Database, Info, Shield, Compass, Navigation as NavIcon, HelpCircle } from "lucide-react";

interface LocationData {
  id: string;
  name: string;
  coords: { x: number; y: number }; // Percentage values for SVG grid placement
  catId: string;
  description: string;
  lore: string;
  importance: string;
  visualUrl: string;
}

export default function InteractiveMap() {
  const [mapMode, setMapMode] = useState<"film" | "game">("film");
  const [selectedLocId, setSelectedLocId] = useState<string>("bradbury");
  const [hoveredLocId, setHoveredLocId] = useState<string | null>(null);

  // Filter sound trigger
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
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (_) {}
  };

  const filmLocations: LocationData[] = [
    {
      id: "bradbury",
      name: "Le Bradbury Building",
      coords: { x: 45, y: 65 },
      catId: "LOC-FLM-01",
      description: "Immeuble historique du centre-ville à l'architecture ouverte spectaculaire où vit J.F. Sebastian avec ses jouets génétiques.",
      lore: "C'est le théâtre du dénouement légendaire entre Rick Deckard et Roy Batty sous de lourdes trombes d'eau. C'est ici que Roy déclame son testament philosophique sur 'les larmes dans la pluie' avant sa désactivation.",
      importance: "Lieu du duel existentiel final et résidence de Sebastian.",
      visualUrl: "/src/assets/images/regenerated_image_1780371256633.jpg"
    },
    {
      id: "tyrell",
      name: "L'Empire Tyrell (Pyramides)",
      coords: { x: 80, y: 25 },
      catId: "LOC-FLM-02",
      description: "Deux pyramides colossales de type mésoaméricain qui dominent l'horizon industriel pollué à la périphérie est de Los Angeles.",
      lore: "Siège de la Tyrell Corporation et résidence suprême du créateur divin Eldon Tyrell. Rick Deckard s'y rend en préambule de son enquête pour tester la réplicante Nexus-6 Rachael avec le test d'empathie Voight-Kampff.",
      importance: "Trône de la direction corporatiste et lieu de la mort d'Eldon Tyrell.",
      visualUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "lapd",
      name: "Quartier Général du LAPD",
      coords: { x: 25, y: 40 },
      catId: "LOC-FLM-03",
      description: "Un immense bloc architectural futuriste où siègent les forces répressives du LAPD et la division spéciale des Blade Runners.",
      lore: "Deckard y rencontre le cynique capitaine Bryant et le mystérieux inspecteur Gaff qui trace des origamis révélateurs. C'est le point de départ de l'ordre de mission officiel d'élimination du groupe Nexus-6 infiltré.",
      importance: "Centre de commandement tactique et d'analyse Voight-Kampff.",
      visualUrl: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "animoid",
      name: "Animoid Row (Marché Noir)",
      coords: { x: 30, y: 75 },
      catId: "LOC-FLM-04",
      description: "Un marché de rue étouffant, dense et enveloppé de vapeur artificielle, spécialisé dans la génétique et la reproduction d'animaux synthétiques.",
      lore: "Pourchassant le seul indice à sa disposition, Deckard y fait analyser une écaille de serpent artificielle trouvée dans la baignoire d'un suspect, ce qui le mène sur les traces de Zhora au bar de danse exotique.",
      importance: "Quartier marchand populaire d'échange de contrebande trans-biologique.",
      visualUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "deckard_apt",
      name: "Appartement de Deckard",
      coords: { x: 15, y: 20 },
      catId: "LOC-FLM-05",
      description: "Une suite exiguë située au 97ème étage d'un gratte-ciel résidentiel brutaliste, inspirée de la Ennis House de Frank Lloyd Wright.",
      lore: "Un espace mélancolique où Deckard s'isole pour boire, examiner de vieilles photos sépia en noir et blanc, et jouer doucement du piano. C'est également là que Rachael cherche refuge et découvre sa propre nature artificielle.",
      importance: "Refuge psychologique de Deckard et sanctuaire du couple Deckard-Rachael.",
      visualUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=600"
    }
  ];

  const gameLocations: LocationData[] = [
    {
      id: "mccoy_apt",
      name: "Appartement de Ray McCoy",
      coords: { x: 18, y: 15 },
      catId: "LOC-GAME-01",
      description: "Le repaire personnel du détective Ray McCoy, équipé d'un balcon brumeux donnant sur les panneaux publicitaires rotatifs.",
      lore: "Un sanctuaire critique où McCoy s'occupe de son chien Maggie et met en service son boîtier de contrôle. C'est le premier point d'amarrage visuel du chef-d'œuvre de Westwood Studios.",
      importance: "Base privée et logis du protagoniste virtuel Ray McCoy.",
      visualUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "lapd_crimes",
      name: "LAPD Crimes Unit & ESPER",
      coords: { x: 30, y: 35 },
      catId: "LOC-GAME-02",
      description: "L'étage d'investigation tactique doté de terminaux informatiques et du supercalculateur d'extraction d'images ESPER.",
      lore: "McCoy y analyse ses clichés argentiques en 3D pour révéler les indices et les visages cachés dans l'ombre. C'est l'emplacement des discussions tendues avec Crystal Steele et le lieutenant Guzza.",
      importance: "Centre névralgique d'exploitation des indices et briefing des enquêtes.",
      visualUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "runciter",
      name: "Runciter's Luxury Animals",
      coords: { x: 50, y: 55 },
      catId: "LOC-GAME-03",
      description: "Une animalerie exclusive de la haute bourgeoisie vendant des spécimens biologiques ou synthétiques hors de prix.",
      lore: "L'épicentre du tout premier acte de sabotage perpétré par le groupe de réplicants rebelles Nexus-6 renégats mené par Clovis, initiant ainsi l'enquête policière interactive de McCoy.",
      importance: "Lieu du crime initial et premier jeu de preuves ADN.",
      visualUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "china_bar",
      name: "Le China Bar",
      coords: { x: 65, y: 70 },
      catId: "LOC-GAME-04",
      description: "Un stand de nourriture rapide d'inspiration asiatique sous de continuelles averses d'eaux usées.",
      lore: "C'est ici que McCoy interroge Gordo Frizz, le truculent chef cuisinier réplicant à l'humour cynique. Le lieu abrite d'importants dialogues cruciaux et des bifurcations de choix moraux dictant la fin de la partie.",
      importance: "Zone d'espionnage et de capture du suspect Gordo Frizz.",
      visualUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "howie_lab",
      name: "Howie Lee's Biotech Lab",
      coords: { x: 78, y: 48 },
      catId: "LOC-GAME-05",
      description: "Un laboratoire biotechnologique exigu où l'on cultive des yeux et des composants organiques oculaires pour l'exportation spatiale.",
      lore: "Un lieu de secrets sordides détenu par Howie Lee, l'ingénieur oculaire travaillant en sous-traitance pour la Tyrell. McCoy y découvre de nombreuses manipulations cruciales sur l'ADN réplicant Nexus.",
      importance: "Laboratoire de génie bio-oculaire secret.",
      visualUrl: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=600"
    }
  ];

  const activeLocations = mapMode === "film" ? filmLocations : gameLocations;
  const selectedLoc = activeLocations.find(l => l.id === selectedLocId) || activeLocations[0];

  useEffect(() => {
    // Reset selection when changing maps
    const firstLoc = mapMode === "film" ? "bradbury" : "mccoy_apt";
    setSelectedLocId(firstLoc);
    playBeep(320);
  }, [mapMode]);

  return (
    <div className="bg-gray-900/60 border border-gray-800/80 rounded-xl p-5 md:p-6 backdrop-blur space-y-6">
      
      {/* Title & Toggle Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Map className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg md:text-xl font-display uppercase tracking-widest text-cyan-300">
              Cartographie Tactique 2D
            </h2>
          </div>
          <p className="text-[11px] text-gray-400 font-mono">
            SYS_SECTOR : DE-GLOW VECTORS // VISUALISATION GÉOGRAPHIQUE DE LOS ANGELES 2019
          </p>
        </div>

        {/* Map Select Button Toggle */}
        <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setMapMode("film")}
            className={`px-3 py-1.5 rounded text-[10px] md:text-xs font-display font-bold tracking-wider transition-all uppercase cursor-pointer ${
              mapMode === "film"
                ? "bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                : "text-gray-500 hover:text-gray-300 border border-transparent"
            }`}
          >
            Secteur Film (LAPD)
          </button>
          <button
            onClick={() => setMapMode("game")}
            className={`px-3 py-1.5 rounded text-[10px] md:text-xs font-display font-bold tracking-wider transition-all uppercase cursor-pointer ${
              mapMode === "game"
                ? "bg-amber-950/40 text-amber-300 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                : "text-gray-500 hover:text-gray-300 border border-transparent"
            }`}
          >
            Secteur Jeu Westwood
          </button>
        </div>
      </div>

      {/* Main Map Box Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: SVB Grid Map Sector (7 columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="relative bg-gray-950 rounded-xl border border-gray-850 p-3 overflow-hidden aspect-[4/3] flex items-center justify-center select-none shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
            
            {/* Ambient grid design lines */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_55%,rgba(9,10,12,0.95)_100%)] pointer-events-none z-10" />
            
            {/* Scanning radar line overlay sweep animation */}
            <div className={`absolute top-0 bottom-0 w-[1.5px] pointer-events-none z-10 opacity-35 bg-gradient-to-b from-transparent via-cyan-400 to-transparent left-0 animate-grid-sweep`} 
                 style={{ animationDuration: "6s", animationIterationCount: "infinite", animationTimingFunction: "linear" }} />

            {/* Tactical Compass Overlay Decoration */}
            <div className="absolute top-4 left-4 text-cyan-500/20 font-mono text-[8.5px] flex items-center space-x-1 pointer-events-none uppercase">
              <Compass className="h-3.5 w-3.5 animate-spin-slow" />
              <span>RADAR_SWEEP_7A_SCAN</span>
            </div>

            <div className="absolute bottom-4 right-4 text-gray-600 font-mono text-[8px] pointer-events-none text-right uppercase">
              <p>LOS ANGELES 2019 DOWNTOWN SECTOR</p>
              <p>GPS REF: 34.0522° N, 118.2437° W</p>
            </div>

            {/* Radar Circular rings decoration */}
            <div className="absolute w-[80%] h-[80%] border border-cyan-500/5 rounded-full pointer-events-none"></div>
            <div className="absolute w-[50%] h-[50%] border border-cyan-500/5 rounded-full pointer-events-none"></div>
            <div className="absolute w-[20%] h-[20%] border border-cyan-500/5 rounded-full pointer-events-none"></div>

            {/* MAIN SVG VECTOR GRAPHICS */}
            <svg
              className="absolute inset-0 w-full h-full p-4"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Grid matrix lines */}
              <defs>
                <pattern id="tactical-matrix" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(6, 182, 212, 0.04)" strokeWidth="0.5" />
                </pattern>
                <pattern id="amber-matrix" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(245, 158, 11, 0.04)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill={mapMode === "film" ? "url(#tactical-matrix)" : "url(#amber-matrix)"} />

              {/* Simulated streets, rivers and canals lines matching science fiction maps */}
              <path d="M 10,10 L 90,90" fill="none" stroke={mapMode === "film" ? "rgba(6, 182, 212, 0.08)" : "rgba(245, 158, 11, 0.08)"} strokeWidth="2.5" />
              <path d="M 10,80 L 90,20" fill="none" stroke={mapMode === "film" ? "rgba(6, 182, 212, 0.08)" : "rgba(245, 158, 11, 0.08)"} strokeWidth="1.5" strokeDasharray="3,3" />
              
              {/* L.A. Acidic River Vector line */}
              <path d="M 40,5 C 45,35 55,65 60,95" fill="none" stroke={mapMode === "film" ? "rgba(6, 182, 212, 0.15)" : "rgba(245, 158, 11, 0.15)"} strokeWidth="3" />

              {/* Active Location Target Crosshairs (converging to the selected position) */}
              {selectedLoc && (
                <g>
                  {/* Vertical coordinate indicator */}
                  <line 
                    x1={selectedLoc.coords.x} y1="0" 
                    x2={selectedLoc.coords.x} y2="100" 
                    stroke={mapMode === "film" ? "rgba(6, 182, 212, 0.25)" : "rgba(245, 158, 11, 0.25)"} 
                    strokeWidth="0.5" 
                    strokeDasharray="2,2" 
                  />
                  {/* Horizontal coordinate indicator */}
                  <line 
                    x1="0" y1={selectedLoc.coords.y} 
                    x2="100" y2={selectedLoc.coords.y} 
                    stroke={mapMode === "film" ? "rgba(6, 182, 212, 0.25)" : "rgba(245, 158, 11, 0.25)"} 
                    strokeWidth="0.5" 
                    strokeDasharray="2,2" 
                  />
                </g>
              )}
            </svg>

            {/* Interactive location indicators positioned absolutely over the container representation */}
            {activeLocations.map((loc) => {
              const active = selectedLocId === loc.id;
              const hovered = hoveredLocId === loc.id;
              const colorClass = mapMode === "film" ? "text-cyan-400" : "text-amber-400";
              const bgColor = mapMode === "film" ? "bg-cyan-500" : "bg-amber-500";
              const ringColor = mapMode === "film" ? "rgba(6,182,212,0.4)" : "rgba(245,158,11,0.4)";

              return (
                <div
                  key={loc.id}
                  style={{ left: `${loc.coords.x}%`, top: `${loc.coords.y}%` }}
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 z-20 group"
                  onClick={() => {
                    setSelectedLocId(loc.id);
                    playBeep(440);
                  }}
                  onMouseEnter={() => setHoveredLocId(loc.id)}
                  onMouseLeave={() => setHoveredLocId(null)}
                >
                  {/* Outer pulsating echo circle ring */}
                  <div
                    className={`absolute -inset-4 rounded-full transition-all duration-300 ${
                      active ? "animate-ping opacity-60" : "opacity-0 group-hover:opacity-30"
                    }`}
                    style={{ backgroundColor: ringColor }}
                  />

                  {/* Core glow button */}
                  <div
                    className={`p-1.5 rounded-full border transition-all duration-300 relative shadow-[0_0_12px_rgba(0,0,0,0.8)] ${
                      active
                        ? `${bgColor} border-white text-black scale-125`
                        : hovered
                        ? `${bgColor} border-transparent text-black`
                        : "bg-gray-950/90 border-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    <Crosshair className={`h-3 w-3 ${active ? "animate-spin-slow" : ""}`} />
                  </div>

                  {/* Micro hover indicator badge */}
                  <div className={`absolute left-1/2 -top-8 -translate-x-1/2 bg-gray-950/90 border border-gray-800 text-[9px] uppercase font-mono px-2 py-0.5 rounded whitespace-nowrap shadow-lg pointer-events-none transition-all duration-200 z-30 ${
                    hovered || active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                  }`}>
                    {loc.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick interactive buttons bar */}
          <div className="flex flex-wrap gap-2">
            {activeLocations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  setSelectedLocId(loc.id);
                  playBeep(400);
                }}
                className={`px-3 py-1 bg-gray-950 border text-[10px] font-mono rounded tracking-tight transition-all uppercase cursor-pointer ${
                  selectedLocId === loc.id
                    ? mapMode === "film"
                      ? "text-cyan-400 border-cyan-400/40 bg-cyan-950/20"
                      : "text-amber-400 border-amber-400/40 bg-amber-950/20"
                    : "text-gray-500 border-gray-900 hover:text-gray-300 hover:border-gray-800"
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Informational Context Panel (5 columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLoc.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-gray-950/90 border border-gray-850 rounded-xl p-5 flex flex-col justify-between h-full space-y-4"
            >
              <div className="space-y-4">
                {/* Header info bar */}
                <div className="flex items-center justify-between border-b border-gray-900 pb-2">
                  <div className="flex items-center space-x-1.5 font-mono text-[9px] text-gray-500">
                    <Shield className="h-3 w-3" />
                    <span className="font-bold">{selectedLoc.catId}</span>
                  </div>
                  <span className={`text-[8px] uppercase font-mono px-2 py-0.5 rounded-full border ${
                    mapMode === "film"
                      ? "bg-cyan-950/30 border-cyan-500/20 text-cyan-400"
                      : "bg-amber-950/30 border-amber-500/20 text-amber-400"
                  }`}>
                    ARCHIVE OK
                  </span>
                </div>

                {/* Picture Frame */}
                <div className="h-32 rounded-lg overflow-hidden border border-gray-900 relative">
                  <img
                    src={selectedLoc.visualUrl}
                    alt={selectedLoc.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter saturate-60 brightness-90 hover:saturate-100 transition-all duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent h-12" />
                  <div className="absolute bottom-2 left-2 bg-black/70 border border-gray-900 px-2 py-0.5 rounded text-[8px] font-mono text-gray-400 uppercase">
                    SECTEUR CORRÉLATIF VISUEL
                  </div>
                </div>

                {/* Description texts */}
                <div className="space-y-2">
                  <h3 className={`text-base font-display font-semibold tracking-wide uppercase ${
                    mapMode === "film" ? "text-cyan-300" : "text-amber-300"
                  }`}>
                    {selectedLoc.name}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {selectedLoc.description}
                  </p>
                </div>

                {/* Scene analysis or gameplay importance */}
                <div className="bg-gray-900/40 border border-gray-900 rounded p-3 space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-white tracking-widest block font-bold">
                    IMPORTANCE CINÉMATOGRAPHIQUE / JEU :
                  </span>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    {selectedLoc.lore}
                  </p>
                </div>
              </div>

              {/* Specs footer */}
              <div className="pt-3 border-t border-gray-900 flex justify-between items-center text-[9px] font-mono text-gray-500">
                <span className="flex items-center space-x-1 uppercase">
                  <Info className="h-3 w-3 text-gray-600" />
                  <span>CIBLE : {selectedLoc.importance.substring(0, 35)}...</span>
                </span>
                <span className="tracking-tighter">GRID_REF: {selectedLoc.coords.x} - {selectedLoc.coords.y}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
