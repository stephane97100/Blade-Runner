import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Grid, Eye, Maximize2, X, RotateCcw, Image, Tag, HardDrive, ShieldAlert, Sparkles, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import TerminalLoader from "./TerminalLoader";

interface GalleryItem {
  id: string;
  title: string;
  category: "vaisseaux" | "villes" | "personnages";
  medium: string;
  artist: string;
  date: string;
  catalogId: string;
  description: string;
  technicalSpec: string;
  imageUrl: string;
}

export default function GalleryView() {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "vaisseaux" | "villes" | "personnages">("all");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  // Interface Beep Synchronized
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

  const galleryList: GalleryItem[] = [
    // --- Vaisseaux ---
    {
      id: "spinner-police",
      title: "Le Spinner Policier Nexus",
      category: "vaisseaux",
      medium: "Crayon, Aérographe et Gouache sur carton",
      artist: "Syd Mead (Concept Designer)",
      date: "Octobre 1980",
      catalogId: "ART-VES-001",
      description: "Le Spinner est le véhicule de patrouille volant emblématique du LAPD. Capable de décollage vertical (VTOL) grâce à des réacteurs intégrés dans les essieux avant, il est conçu avec un châssis profilé bleu-nuit et des portes ciseaux transparentes afin d'offrir une visibilité au sol maximale.",
      technicalSpec: "Propulsion VTOL de 4ème génération // Double turbine arrière à combustion hydrogène // Blindage composites polymères.",
      imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "tyrell-shuttle",
      title: "Navette Exécutive de la Tyrell",
      category: "vaisseaux",
      medium: "Acrylique et Gouache sur canson",
      artist: "Syd Mead",
      date: "Janvier 1981",
      catalogId: "ART-VES-002",
      description: "Une navette géométrique blindée de très grand luxe réservée aux déplacements privés du Dr. Eldon Tyrell et des cadres exécutifs supérieurs. Sa silhouette polygonale brute évoque directement l'architecture mésoaméricaine des pyramides d'entreprise.",
      technicalSpec: "Système de stabilisation anti-gravité de soute // Revêtement réflectif thermo-absorbant // Liaison satellite quantum chiffrée.",
      imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "garbage-scow",
      title: "Benne de Collecte Industrielle",
      category: "vaisseaux",
      medium: "Feutre et marqueurs noirs",
      artist: "Production Sketch",
      date: "Mai 1981",
      catalogId: "ART-VES-003",
      description: "Esquisse conceptuelle d'un cargo de transport de déchets lourds volant au-dessus des mégalopoles vers les gigantesques décharges de San Diego. Son design est délibérément asymétrique, rouillé, empoussiéré, s'alignant sur l'esthétique 'futur usé'.",
      technicalSpec: "Capacité de charge de soute: 2200 tonnes métriques // Générateurs d'ions basse altitude // Système de compactage moléculaire intégré.",
      imageUrl: "https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "cargo-carrier",
      title: "Cargo Interstellaire Centaurus",
      category: "vaisseaux",
      medium: "Croquis de storyboarding technique",
      artist: "Mentor Huebner",
      date: "Août 1980",
      catalogId: "ART-VES-004",
      description: "Grand dessin d'étude représentant le lancement d'un immense transporteur minéralier interplanétaire depuis le port spatial orbital terrestre en direction des colonies Off-World du Centaure.",
      technicalSpec: "Moteurs à fusion continue de deutérium // Soute cryogénique sous haute pression // Équipage de maintenance autonome cyborg.",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
    },

    // --- Villes ---
    {
      id: "industrial-la",
      title: "Los Angeles - Enfers Industriels",
      category: "villes",
      medium: "Huile sur toile grand format",
      artist: "Sherman Labby",
      date: "Novembre 1980",
      catalogId: "ART-ENV-001",
      description: "Une peinture d'ambiance à l'échelle monumentale décrivant la scène d'ouverture mythique du film: de gigantesques cheminées d'usines crachant des bouffées de flammes dans la nuit, sous de lourdes trombes de pluies acides de novembre.",
      technicalSpec: "Étude d'ambiance colorimétrique // Palette dominante : bleu de cobalt carbonisé, orange de cadmium, noir terreux.",
      imageUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "bradbury-interior",
      title: "La Cour d'Honneur du Bradbury",
      category: "villes",
      medium: "Dessin au fusain et craie blanche",
      artist: "Production Team",
      date: "Mars 1981",
      catalogId: "ART-ENV-002",
      description: "Un croquis architectural minutieux détaillant la verrière géante, les ferronneries art-nouveau de l'ascenseur en cage d'oiseau et les coursives d'angle baignées dans de sombres clair-obscurs nébuleux propres au genre néo-noir.",
      technicalSpec: "Configuration de caméra: Objectif anamorphique 35mm // Configuration d'éclairage : projecteurs horizontaux à arc au carbone.",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "animoid-market",
      title: "Les Brumes d'Animoid Row",
      category: "villes",
      medium: "Aquarelle et encre de Chine",
      artist: "Mentor Huebner",
      date: "Décembre 1980",
      catalogId: "ART-ENV-003",
      description: "Esquisse vibrante du marché aux animaux artificiels. Les étals débordent de cages lumineuses où s'agitent des serpents, hiboux et poissons artificiels, au milieu d'une foule oppressante d'immigrés asiatiques et de policiers en patrouille.",
      technicalSpec: "Rendu atmosphérique à la vapeur dense // Perspective centrale fuyante // Contraste néon chaud / froid.",
      imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "offworld-dome",
      title: "Colonie Extérieure 'Off-World'",
      category: "villes",
      medium: "Gouache et aérographe sur panneau",
      artist: "Syd Mead",
      date: "Février 1981",
      catalogId: "ART-ENV-004",
      description: "Une des rares planches illustrant un complexe résidentiel d'habitation colonial extraterrestre sous un double coucher de soleil rougeoyant, contrastant avec l'oppression étouffante de la Terre.",
      technicalSpec: "Structure pressurisée auto-portante géodésique // Protecteurs magnétiques de radiation planétaire.",
      imageUrl: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=800"
    },

    // --- Personnages ---
    {
      id: "deckard-coat",
      title: "Rick Deckard - Recherche de Silhouette",
      category: "personnages",
      medium: "Crayons de couleur et feutres de dessin",
      artist: "Charles Knode (Costumier)",
      date: "Septembre 1980",
      catalogId: "ART-CHR-001",
      description: "Recherche originale de costumes pour le personnage principal incarné par Harrison Ford. Le dessin insiste sur le grand trenchcote brun imperméable, le col relevé et l'assemblage de vestes de tweed désuètes à motifs écossais.",
      technicalSpec: "Étiquette : Style 'Hard-Boiled Detective' d'époque d'après-guerre modernisé par une coupe ample rétro.",
      imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "roy-batty-concept",
      title: "Roy Batty - Le Chef Rebelle",
      category: "personnages",
      medium: "Encre, feutre et gouache",
      artist: "Charles Knode",
      date: "Novembre 1980",
      catalogId: "ART-CHR-002",
      description: "Étude esthétique décrivant l'énergie menaçante et la beauté plastique de Roy Batty, le Replicant Nexus-6 d'élite à la chevelure platine, vêtu de son grand manteau de cuir brillant clouté aux épaules.",
      technicalSpec: "Texte additionnel : 'The Aryan Superman of biotechnology, both poetic and lethal.'",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "rachael-shoulder",
      title: "Rachael - Silhouette Structurée Vintage",
      category: "personnages",
      medium: "Crayon graphite et lavis d'encre",
      artist: "Charles Knode",
      date: "Janvier 1981",
      catalogId: "ART-CHR-003",
      description: "Croquis de conception pour le tailleur de Rachael. Épaules ultra-rembourrées géométriques typiques du style de créatrices des années 1940 (Adonis/Schiaparelli), coiffure en chignon banane sculptural sans fioritures superflues, représentant l'intemporalité des réplicants.",
      technicalSpec: "Tissus étudiés: laine brodée croisée lourde noire // maquillage porcelaine contrasté.",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "pris-makeup",
      title: "Pris - Le Camouflage Punk",
      category: "personnages",
      medium: "Croquis rapide aux crayons gras de couleur",
      artist: "Production Makeup Design",
      date: "Avril 1981",
      catalogId: "ART-CHR-004",
      description: "Projet de maquillage pour la réplicante de plaisir incarnée par Daryl Hannah. Détaillant le masque noir pulvérisé à l'aérographe autour des yeux, inspiré du mouvement punk et new-wave, ainsi que sa célèbre perruque blonde échevelée.",
      technicalSpec: "Application fard noir gras rasant // Rouge à lèvres cerise sombre métallique.",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const filteredItems = selectedCategory === "all"
    ? galleryList
    : galleryList.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <TerminalLoader
        onComplete={() => setLoading(false)}
        targetDataName="ARCHIVES D'ART CONCEPTUEL & CROQUIS DE PRODUCTION DE SYD MEAD"
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
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-1 px-2.5 bg-cyan-950/40 border border-cyan-500/30 rounded text-cyan-400 font-mono text-xs font-bold animate-pulse">
              COLLECTION SYD MEAD & HISTOIRE
            </div>
            <h1 className="text-xl md:text-2xl font-display font-black tracking-widest text-white uppercase flex items-center gap-2">
              <Grid className="h-5 w-5 text-cyan-400" />
              GALERIE D'ART CONCEPTUEL
            </h1>
          </div>
          <p className="text-xs text-gray-400 font-mono leading-relaxed">
            ACCÈS CENTRALISÉ AUX ENREGISTREMENTS GRAPHIQUES, STORYBOARDS HISTORIQUES ET PROJETS DE DÉCORS (1982)
          </p>
        </div>

        {/* Category switcher navbar menu */}
        <div className="flex flex-wrap gap-1.5 bg-gray-950/80 p-1 rounded-lg border border-gray-900">
          {[
            { id: "all", label: "TOUT" },
            { id: "vaisseaux", label: "VAISSEAUX / SPINNERS" },
            { id: "villes", label: "VILLES / DÉCORS" },
            { id: "personnages", label: "PERSONNAGES" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id as any);
                playBeep(380);
              }}
              className={`px-3 py-1.5 rounded font-display text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                  : "text-gray-500 hover:text-gray-300 border border-transparent"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid gallery display card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            layoutId={`card-${item.id}`}
            onClick={() => {
              setActiveItem(item);
              playBeep(480);
            }}
            className="group cursor-pointer bg-gray-950 border border-gray-900 rounded-xl overflow-hidden hover:border-cyan-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] flex flex-col justify-between"
          >
            {/* Visual Frame */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-900 border-b border-gray-950">
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter saturate-40 group-hover:saturate-100 group-hover:scale-105 transition-all duration-500 brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent opacity-80" />

              {/* Float code tag */}
              <div className="absolute top-3 left-3 bg-black/80 border border-gray-900 text-gray-500 text-[8px] font-mono px-2 py-0.5 rounded uppercase">
                {item.catalogId}
              </div>

              {/* Hover screen zoom button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                <div className="bg-cyan-500 text-black font-mono font-bold text-xs uppercase px-4.5 py-2 rounded-lg flex items-center space-x-1 border border-white shadow-lg">
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>OUVRIR L'ARCHIVE</span>
                </div>
              </div>
            </div>

            {/* Description Text Zone */}
            <div className="p-4 space-y-1.5 text-left">
              <span className="text-[9px] uppercase font-mono tracking-widest text-cyan-400 font-bold block">
                {item.category === "vaisseaux" ? "MODÈLE & PROPULSION" : item.category === "villes" ? "ZONE URBAINE METRO" : "SUJET BIO-SYNTHÈSE"}
              </span>
              <h3 className="text-white font-display font-bold text-sm leading-tight tracking-wide group-hover:text-cyan-300 transition-colors uppercase">
                {item.title}
              </h3>
              <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed font-sans">
                {item.description}
              </p>
              
              <div className="pt-2 border-t border-gray-900/40 flex items-center justify-between text-[9px] font-mono text-gray-650">
                <span>By: {item.artist.split(" (")[0]}</span>
                <span className="text-gray-500 font-bold flex items-center gap-1">
                  EXPLORER <ArrowUpRight className="h-2.5 w-2.5" />
                </span>
              </div>
            </div>

          </motion.div>
        ))}
      </div>

      {/* LIGHTBOX OVERLAY EXPANDER */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              layoutId={`card-${activeItem.id}`}
              className="bg-gray-950 rounded-2xl border border-cyan-500/30 overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 shadow-[0_0_50px_rgba(6,182,212,0.25)] scrollbar-none relative"
            >
              {/* Scanline texture */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_97%,rgba(6,182,212,0.03)_97%)] bg-[size:100%_15px] opacity-40 pointer-events-none z-10"></div>

              {/* Image Frame Left (7 cols) */}
              <div className="md:col-span-7 bg-black flex flex-col justify-center relative min-h-[300px] md:min-h-[480px]">
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter saturate-80"
                />
                
                {/* Visual labels overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent p-5">
                  <span className="bg-black/80 border border-gray-800 text-[9px] text-cyan-400 font-mono tracking-widest px-3 py-1 uppercase rounded">
                    ENREGISTREMENT SYD MEAD // CLICHÉ ANALOGIQUE ACTIF
                  </span>
                </div>
              </div>

              {/* Data Specifications Specs sheet Right (5 cols) */}
              <div className="md:col-span-5 p-6 flex flex-col justify-between space-y-6 text-left border-t md:border-t-0 md:border-l border-gray-900 relative">
                
                {/* Top Close button inside frame */}
                <button
                  onClick={() => {
                    setActiveItem(null);
                    playBeep(340);
                  }}
                  className="absolute top-4 right-4 p-1.5 bg-gray-900 rounded-lg border border-gray-800 text-gray-405 hover:text-white hover:border-red-500/40 hover:bg-red-950/20 cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      INDEX CATALOGUE : {activeItem.catalogId}
                    </span>
                  </div>

                  <h2 className="text-lg md:text-xl font-display font-black tracking-wide text-white uppercase leading-snug">
                    {activeItem.title}
                  </h2>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-300 leading-relaxed font-sans">
                      {activeItem.description}
                    </p>
                  </div>

                  <div className="bg-gray-900/40 border border-gray-900 rounded p-3 space-y-1 font-mono text-[9px]">
                    <span className="text-white font-bold tracking-widest uppercase block mb-1">
                      MÉTA-DONNÉES DE SCÉNOGRAPHIE :
                    </span>
                    <p className="text-gray-400"><strong className="text-gray-500">MÉDIUM :</strong> {activeItem.medium}</p>
                    <p className="text-gray-400"><strong className="text-gray-500">CONCEPTEUR :</strong> {activeItem.artist}</p>
                    <p className="text-gray-400"><strong className="text-gray-500">PRODUIT EN :</strong> {activeItem.date}</p>
                  </div>

                  <div className="border border-cyan-500/20 bg-cyan-950/15 p-3 rounded space-y-1">
                    <span className="text-[9px] font-mono font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3" /> SPÉCIFICATIONS TECHNIQUES :
                    </span>
                    <p className="text-[9.5px] text-cyan-300/80 leading-relaxed font-mono">
                      {activeItem.technicalSpec}
                    </p>
                  </div>
                </div>

                {/* Footer buttons close */}
                <div className="pt-4 border-t border-gray-900 flex items-center justify-between text-[9px] font-mono text-gray-600">
                  <span className="uppercase font-bold tracking-tighter">SECURSECURE DB_SYS</span>
                  <button
                    onClick={() => {
                      setActiveItem(null);
                      playBeep(340);
                    }}
                    className="px-4 py-1.5 bg-gray-950 hover:bg-cyan-950 hover:text-cyan-400 border border-gray-800 hover:border-cyan-500/30 font-bold rounded text-[10px] uppercase transition-colors cursor-pointer"
                  >
                    FERMER LE DOSSIER
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
