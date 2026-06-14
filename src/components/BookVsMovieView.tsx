import { useState } from "react";
import { motion } from "motion/react";
import { bookDifferences } from "../data/bladeRunnerData";
import { BookOpen, Film, RefreshCw, HelpCircle, Gamepad } from "lucide-react";
import CommentsSection from "./CommentsSection";

const differenceImages = [
  {
    url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1200",
    desc: "L'abîme métaphysique du Mercerisme face au vide spirituel industriel de Los Angeles 2019."
  },
  {
    url: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1200",
    desc: "Le hibou factice et la faune artificielle de la Tyrell Corporation, symbole du statut d'empathie."
  },
  {
    url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200",
    desc: "Rick Deckard, le détective fatigué et désabusé, solitaire sous son trenchcoat anachronique."
  },
  {
    url: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=1200",
    desc: "Les colonies Off-World et l'espoir d'exfiltration des androïdes en fin de cycle de vie."
  },
  {
    url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200",
    desc: "Les ruelles d'Animoid Row submergées sous la pluie noire de novembre et les fumées de vapeur."
  }
];

export default function BookVsMovieView() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase">
          LE FILM VS LE LIVRE
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Analyse des contrastes fondamentaux entre le long métrage de Ridley Scott et le chef-d'œuvre littéraire d'origine de Philip K. Dick : <strong>"Do Androids Dream of Electric Sheep?" (1968)</strong>.
        </p>
      </div>

      <div className="space-y-6">
        {bookDifferences.map((diff, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/20 hover:bg-gray-900/50"
          >
            {/* Thematic archival banner illustration */}
            <div className="w-full h-44 relative overflow-hidden border-b border-gray-800">
              <img 
                src={differenceImages[idx]?.url} 
                alt={differenceImages[idx]?.desc} 
                className="w-full h-full object-cover opacity-45 transition-transform duration-700 ease-out"
                style={{
                  transform: hoveredIdx === idx ? "scale(1.05) translateY(-2px)" : "scale(1) translateY(0)"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent"></div>
              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                <span className="text-[10px] font-mono text-cyan-400 bg-black/75 px-2 py-1 rounded border border-cyan-500/10 uppercase tracking-widest">
                  {differenceImages[idx]?.desc}
                </span>
                <span className="text-[9px] font-mono text-gray-500 uppercase hidden sm:block">Archive ID: LIB-FILM-00{idx + 1}</span>
              </div>
            </div>

            {/* Header Column banner */}
            <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 px-6 py-3 border-b border-gray-800 flex justify-between items-center">
              <span className="font-display text-sm font-bold tracking-widest text-white uppercase">
                {idx + 1}. {diff.topic}
              </span>
              <span className="text-[10px] font-mono text-cyan-500 font-bold tracking-wider">
                RAPPORT SUR LA TRADUCTION DE L'UNIVERS
              </span>
            </div>

            {/* Split panel: Book vs Movie */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Novel */}
              <div className="p-6 border-b md:border-b-0 md:border-r border-gray-800/60 relative">
                <div className="flex items-center space-x-2 text-cyan-500/80 mb-3">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">
                    Livre de Philip K. Dick (1968)
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {diff.bookVersion}
                </p>
              </div>

              {/* Film adaptation */}
              <div className="p-6 relative">
                <div className="flex items-center space-x-2 text-yellow-500/80 mb-3">
                  <Film className="h-4 w-4" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">
                    Adaptation de Ridley Scott (1982)
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {diff.movieVersion}
                </p>
              </div>

            </div>

            {/* Bottom Thematic Impact summary block */}
            <div className="bg-cyan-950/20 px-6 py-4 border-t border-gray-800/50 flex items-start space-x-3">
              <RefreshCw className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0 animate-spin-slow" />
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase font-mono tracking-widest text-cyan-400 font-bold block">
                  CONSEQUENCES SUR L'ŒUVRE ET RÉSULTAT THÉMATIQUE :
                </span>
                <p className="text-xs text-gray-400 leading-relaxed italic">
                  {diff.thematicImpact}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Westwood 1997 Point-and-click retro game */}
      <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-black rounded-xl border border-amber-500/20 overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.05)] relative p-6 md:p-8 space-y-6">
        <div className="absolute top-0 right-0 h-40 w-44 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.06),transparent_70%)] pointer-events-none"></div>

        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800 pb-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-950/40 border border-amber-500/30 rounded-lg text-amber-400">
              <Gamepad className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white tracking-widest uppercase">
                Le troisième pilier : Le jeu vidéo de Westwood (1997)
              </h2>
              <p className="text-xs text-amber-500/80 font-mono tracking-wider">
                WESTWOOD STUDIOS // POINT-AND-CLICK ADVENTURE MASTERPIECE
              </p>
            </div>
          </div>
          <span className="bg-amber-950/80 border border-amber-500/40 text-amber-400 text-[10px] font-mono px-3 py-1 uppercase rounded tracking-widest self-start md:self-center">
            SYS: RETRO-EXE 16-BIT
          </span>
        </div>

        {/* Row layout with graphic + text content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Westwood Details */}
          <div className="lg:col-span-7 space-y-4">
            <p className="text-gray-350 text-sm leading-relaxed">
              Considéré par les critiques comme l'une des plus fidèles et innovatrices adaptations de l'histoire du jeu vidéo, le jeu d'aventure point-and-click <strong className="text-white">"Blade Runner" (1997)</strong> par Westwood Studios se déroule parallèlement aux événements du film de Ridley Scott.
            </p>
            <p className="text-gray-350 text-sm leading-relaxed">
              Vous y incarnez le détective <strong className="text-amber-400">Ray McCoy</strong>, un autre agent de l'unité des Blade Runners du LAPD, chargé de traquer un groupe de réplicants suspects coupables d'avoir massacré des animaux vivants dans un luxueux zoo urbain artificiel de la rue de Chinatown.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-gray-950/80 p-4 rounded-lg border border-gray-850 space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold block">INTÉGRATION CHRONOLOGIQUE PARALLÈLE</span>
                <p className="text-xs text-gray-400 leading-normal">
                  McCoy explore les mêmes décors somptueux de Los Angeles (bâtiment Tyrell, appartement de Sebastian, animoir du marché noir) et interagit avec des personnages clés du film (Gaff, Rachael, J.F. Sebastian, Dr. Eldon Tyrell) avec les doublages de voix originaux des acteurs.
                </p>
              </div>

              <div className="bg-gray-950/80 p-4 rounded-lg border border-gray-850 space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold block">INNOVATION TECHNIQUE ET VOXELS</span>
                <p className="text-xs text-gray-400 leading-normal">
                  Écrit sans accélération 3D obligatoire, le moteur de Westwood exploitait des voxels 3D révolutionnaires pré-calculés, un éclairage atmosphérique volumétrique de fumée et une simulation météorologique et d'IA autonome en temps réel.
                </p>
              </div>
            </div>
          </div>

          {/* Graphical side panel with dynamic code blocks & theme image */}
          <div className="lg:col-span-5 relative space-y-4">
            <div className="relative rounded-xl overflow-hidden border border-amber-500/15 bg-gray-950 h-52">
              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600"
                alt="Westwood studio point and click screen"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-60 filter saturate-50 contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent"></div>
              
              {/* Voxel/Pixel art layout stamp */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(251,191,36,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
              
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[10px] font-mono text-amber-500 bg-black/80 px-3 py-1.5 rounded border border-amber-500/20">
                <span>INTÉGRITÉ LOGICIEL : OK</span>
                <span>FÉV. 1997</span>
              </div>
            </div>

            {/* Crucial mechanic: Random Identity assignment */}
            <div className="bg-amber-950/10 border border-amber-500/20 rounded-lg p-4 space-y-1 text-xs">
              <span className="font-mono text-amber-400 font-bold block uppercase tracking-wider">IDENTITÉS ALÉATOIRES & FINS MULTIPLES (12 FINS)</span>
              <p className="text-gray-400 leading-relaxed">
                Le génie absolu du jeu réside dans sa rejouabilité mécanique : au tout début de chaque partie, un générateur de nombres aléatoires détermine lesquels des suspects (y compris Ray McCoy lui-même !) sont réellement des réplicants et lesquels sont humains, altérant dynamiquement l'enquête et déclenchant des fins d'exfiltration ou de retrait radicalement différentes.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Section Commentaires pour le Livre vs le Film */}
      <CommentsSection pageId="book" />
    </motion.div>
  );
}
