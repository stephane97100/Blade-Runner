import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { productionSecrets } from "../data/bladeRunnerData";
import { Archive, Play, X, ChevronLeft, ChevronRight, Eye, Film, Image as ImageIcon, Laptop } from "lucide-react";

export default function MakingOfView() {
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);
  const [selectedVideoIdx, setSelectedVideoIdx] = useState<number>(0);

  const archivalPhotos = [
    {
      id: "set-1",
      title: "Construction du Spinner en taille réelle",
      artist: "Gene Winfield & Syd Mead",
      desc: "Ridley Scott inspecte la maquette métallique fonctionnelle du Spinner construite par le légendaire customiseur de voitures Gene Winfield. Plus de 25 véhicules futuristes ont été entièrement fabriqués et conduits sur le plateau.",
      url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200",
      date: "Août 1981"
    },
    {
      id: "set-2",
      title: "Le dédale de maquettes de Los Angeles",
      artist: "Crew d'Effets Spéciaux Douglas Trumbull",
      desc: "L'équipe d'effets visuels manipulant les pyramides miniatures colossales de la Tyrell Corporation. Ces objets massifs mesuraient jusqu'à 3 mètres de haut, enrichis de milliers de câbles de fibres optiques pour simuler de minuscules fenêtres éclairées en conditions réelles.",
      url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1200",
      date: "Mai 1981"
    },
    {
      id: "set-3",
      title: "Atmosphère fumante d'Animoid Row",
      artist: "Département Scénographie Warner Bros Studios",
      desc: "L'édification des décors humides de la rue Animoid Row sur le fameux plateau extérieur 'The New York Street' de Warner Bros. Des tuyaux projetaient de la fumée en continu et d'immenses rampes d'arrosage créaient des trombes d'eau froides.",
      url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200",
      date: "Novembre 1981"
    },
    {
      id: "set-4",
      title: "Ridley Scott dirigeant Harrison Ford",
      artist: "Ridley Scott, Réalisateur",
      desc: "Instant volé où Ridley Scott mime le placement de la main d'Harrison Ford avant d'allumer le projecteur bleu à travers les fumées de vapeur d'eau d'Animoid Row. Un tournage réputé éreintant.",
      url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1200",
      date: "Juin 1981"
    },
    {
      id: "set-5",
      title: "Le costume de Pris et son fard sombre",
      artist: "Maquillage et Coiffure",
      desc: "Daryl Hannah (Pris) posant dans sa tenue punk iconique entre deux prises de combat acrobatique. Sa perruque et son trait d'aérographe noir ont été inspirés du look punk révolutionnaire des soirées de Londres.",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200",
      date: "Juillet 1981"
    },
    {
      id: "set-6",
      title: "L'œil géant en superposition rétro",
      artist: "Photographie Matting",
      desc: "Conception du mémorable gros plan d'ouverture montrant la réflexion de la ville de Los Angeles enflammée dans l'iris. Obtenu entièrement par transparence optique physique sans aucune retouche numérique par ordinateur.",
      url: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=1200",
      date: "Octobre 1981"
    }
  ];

  const archiveVideos = [
    {
      id: "vid-1",
      title: "Coulisses historiques (Featurette de 1982)",
      source: "https://www.youtube.com/embed/V-UzYm9XvLg",
      duration: "9:15",
      desc: "La featurette de promotion officielle capturée sur le plateau en 1982, incluant des interviews exclusives de Harrison Ford, Ridley Scott et Sean Young dans l'ambiance humide des décors."
    },
    {
      id: "vid-2",
      title: "La Conception Révolutionnaire des FX",
      source: "https://www.youtube.com/embed/UNpA_A78Z7A",
      duration: "21:40",
      desc: "Rapport d'archives passionnant sur la création des effets matériels de Douglas Trumbull sur l'éclairage de LA, la modélisation à l'échelle et les techniques d'expositions multiples."
    },
    {
      id: "vid-3",
      title: "Réflexions de Philip K. Dick sur l'adaptation",
      source: "https://www.youtube.com/embed/_q9e2YicT38",
      duration: "4:32",
      desc: "L'une des ultimes interviews de l'auteur avant son décès brutal en 1982, exultant de joie face aux images tests montrées par Ridley Scott, estimant qu'elles correspondaient exactement à son imaginaire."
    }
  ];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIdx !== null) {
      setSelectedImageIdx((selectedImageIdx + 1) % archivalPhotos.length);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIdx !== null) {
      setSelectedImageIdx((selectedImageIdx - 1 + archivalPhotos.length) % archivalPhotos.length);
    }
  };

  const activeVideo = archiveVideos[selectedVideoIdx] || archiveVideos[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12 pb-10 text-left"
    >
      {/* Hero Banner del Tournage */}
      <div className="relative h-[250px] rounded-xl overflow-hidden border border-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.12)] flex items-end p-8 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1200')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent"></div>
        <div className="absolute top-4 right-4 bg-cyan-950/85 border border-cyan-400/50 text-cyan-400 text-xs px-3 py-1 font-display tracking-widest rounded uppercase">
          LAPD FILE: BEHIND-SET-1982
        </div>
        <div className="relative z-10 space-y-1">
          <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white uppercase">
            COULISSES & PROCÉDÉS TECHNIQUES
          </h1>
          <p className="text-gray-300 max-w-2xl text-xs md:text-sm leading-relaxed">
            Pénétrez dans l'ambiance électrique et brumeuse des plateaux de Warner Bros, où Ridley Scott et son équipe ont repoussé les limites des effets pratiques hollywoodiens.
          </p>
        </div>
      </div>

      {/* SECTION 1: GALERIE D'IMAGES INTERACTIVES */}
      <div className="space-y-6">
        <div className="border-b border-gray-800 pb-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ImageIcon className="h-5 w-5 text-cyan-400 animate-pulse-slow" />
            <h2 className="text-xl font-display uppercase tracking-wider text-cyan-300">
              Galerie d'Images Interactives d'Archives
            </h2>
          </div>
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden sm:inline">
            ARCHIVE-SERIES: IMG-GLR-1982
          </span>
        </div>
        <p className="text-gray-400 text-sm max-w-3xl">
          Cliquez sur les clichés restaurés ci-dessous pour ouvrir les fiches descriptives détaillant la technologie matérielle et artisanale employée sur les plateaux de tournage.
        </p>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {archivalPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              onClick={() => setSelectedImageIdx(index)}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden cursor-pointer group relative flex flex-col justify-between"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={photo.url}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 saturate-[0.85] contrast-[1.1]"
                />
                <div className="absolute inset-0 bg-neutral-900/40 opacity-70 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
                
                {/* Hover actions overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-cyan-950/40">
                  <div className="p-3 bg-gray-950/90 rounded-full border border-cyan-400/50 text-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <Eye className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400 font-semibold uppercase">
                  <span>{photo.artist}</span>
                  <span className="text-gray-500">{photo.date}</span>
                </div>
                <h3 className="text-sm font-display font-bold text-white group-hover:text-cyan-300 transition-colors duration-200 uppercase tracking-wide truncate">
                  {photo.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SECTION 2: EXTRAITS VIDÉO & FEATURETTES */}
      <div className="space-y-6">
        <div className="border-b border-gray-800 pb-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Film className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-display uppercase tracking-wider text-purple-300">
              Cabinet d'Extraits Vidéo & Documentaires
            </h2>
          </div>
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden sm:inline">
            ARCHIVE-SERIES: VID-LBY-1982
          </span>
        </div>
        <p className="text-gray-400 text-sm max-w-3xl">
          Sélectionnez l'une des bandes d'archives restaurées pour lancer la lecture du terminal vidéo interactif.
        </p>

        {/* Video Player + Playlists Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Terminal Player (cols: 7) */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div className="relative rounded-xl border border-gray-800 bg-gray-950 overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.05)]">
              {/* Retro monitor scanning line style overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-10"></div>
              
              <div className="aspect-video w-full bg-black relative">
                <iframe
                  src={activeVideo.source}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0 absolute inset-0 z-0"
                ></iframe>
              </div>

              {/* Status footer bar */}
              <div className="bg-gray-900/60 border-t border-gray-800/80 px-4 py-3 flex items-center justify-between font-mono text-[10px] text-gray-400">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="uppercase text-green-400 font-bold">TERMINAL DE LECTURE ACTIF</span>
                </div>
                <span>DURÉE DE TRANSMISSION : {activeVideo.duration}</span>
              </div>
            </div>

            {/* Video description */}
            <div className="p-4 bg-purple-950/5 border border-purple-500/10 rounded-lg space-y-1">
              <h3 className="text-xs font-mono uppercase text-purple-400 font-bold block tracking-wider">
                SYNOPSIS DU DOCUMENTAIRE :
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {activeVideo.desc}
              </p>
            </div>
          </div>

          {/* Playlist Selector (cols: 5) */}
          <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block border-b border-gray-800 pb-1 font-bold">
                Bandes Magnétiques disponibles :
              </span>
              {archiveVideos.map((video, idx) => {
                const isSelected = idx === selectedVideoIdx;
                return (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideoIdx(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-start space-x-3 group relative overflow-hidden cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-950/40 via-blue-950/20 to-gray-900 border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                        : "bg-gray-900/30 border-gray-800 hover:border-purple-500/30 hover:bg-gray-900/60"
                    }`}
                  >
                    <div className="p-2 ml-0.5 mt-0.5 bg-gray-950 rounded-lg border border-gray-800 shrink-0 text-purple-400">
                      <Play className={`h-4 w-4 ${isSelected ? "animate-pulse" : ""}`} />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className="text-purple-400 font-bold uppercase tracking-wider">DOC-ID: 1982-VID-0{idx + 1}</span>
                        <span className="text-gray-500">{video.duration}</span>
                      </div>
                      <h4 className="text-xs font-semibold font-display text-white tracking-wide uppercase truncate">
                        {video.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 truncate leading-snug font-sans">
                        {video.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Technical Specs Folder Stamp */}
            <div className="bg-gray-950/70 border border-gray-800 rounded-lg p-4 font-mono text-[10px] text-gray-500 space-y-2 mt-4">
              <div className="flex items-center space-x-2 text-cyan-500/60 font-semibold mb-1">
                <Laptop className="h-3.5 w-3.5" />
                <span>SPECIFICATIONS DE REPRODUCTION ANALOGIQUE</span>
              </div>
              <p className="leading-relaxed">
                Reproduction par modulation de phase vidéo composite NTSC d'époque. Flux audio monophonique original échantillonné à partir d'une bande de transfert master stéréo analogique 1982.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* SECTION 3: TEXTES SECRETS EXISTANTS */}
      <div className="space-y-6">
        <div className="border-b border-gray-800 pb-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Archive className="h-5 w-5 text-cyan-400" />
            <h2 className="text-xl font-display uppercase tracking-wider text-cyan-300">
              L'Archive des Secrets de Tournage
            </h2>
          </div>
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden sm:inline">
            ARCHIVE-SERIES: GEN-SEC-1982
          </span>
        </div>

        {/* Existing grid of secrets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {productionSecrets.map((secret, idx) => (
            <div
              key={idx}
              className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden backdrop-blur flex flex-col justify-between hover:border-cyan-500/20 transition-all duration-300"
            >
              {/* Image Header */}
              <div
                className="h-40 bg-cover bg-center relative border-b border-gray-800/80 group overflow-hidden"
                style={{ backgroundImage: `url('${secret.imageUrl || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800" }')` }}
              >
                <div className="absolute inset-0 bg-neutral-900/60 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
                
                <div className="absolute top-3 left-3 bg-cyan-950/90 border border-cyan-400/50 text-cyan-400 text-[9px] px-2 py-0.5 font-mono tracking-widest uppercase rounded">
                  DOC-REG: {secret.category}
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-sm sm:text-base font-display font-bold text-white tracking-wide uppercase leading-tight drop-shadow-md">
                    {secret.title}
                  </h3>
                </div>
              </div>

              {/* Content body */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  {secret.content}
                </p>

                <div className="border-t border-gray-800/60 pt-3 flex items-center justify-between text-[10px] font-mono text-gray-500">
                  <span className="flex items-center space-x-1.5 uppercase tracking-wider">
                    <Archive className="h-3 w-3 text-cyan-500/40" />
                    <span>L.A. DEPT ARCHIVE // 1982</span>
                  </span>
                  <span className="text-cyan-500/30 font-semibold uppercase font-bold">
                    CONFIDENTIEL
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IMAGE VIEW MODAL */}
      <AnimatePresence>
        {selectedImageIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImageIdx(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <button
              onClick={() => setSelectedImageIdx(null)}
              className="absolute top-4 right-4 p-2.5 bg-gray-950/80 hover:bg-gray-900 text-white rounded-full border border-gray-800 cursor-pointer transition-colors duration-200 z-10"
            >
              <X className="h-5 w-5" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-gray-950 border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col md:flex-row relative cursor-default"
            >
              {/* Image box with navigation */}
              <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] md:h-auto">
                <img
                  src={archivalPhotos[selectedImageIdx].url}
                  alt={archivalPhotos[selectedImageIdx].title}
                  referrerPolicy="no-referrer"
                  className="max-h-[60vh] object-contain w-full"
                />
                
                {/* Previous Button */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-950/80 hover:bg-gray-900 border border-gray-800 text-white rounded-full cursor-pointer transition-colors duration-200"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {/* Next Button */}
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-gray-950/80 hover:bg-gray-900 border border-gray-800 text-white rounded-full cursor-pointer transition-colors duration-200"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Description sidebar */}
              <div className="w-full md:w-80 p-6 bg-gray-950 border-t md:border-t-0 md:border-l border-gray-900/80 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest border-b border-gray-900 pb-1">
                    <span>INDEX DE TOURNAGE</span>
                    <span>1982-GLR-0{selectedImageIdx + 1}</span>
                  </div>
                  
                  <div className="space-y-1 text-left">
                    <h3 className="text-lg font-display font-black text-white uppercase tracking-tight leading-tight">
                      {archivalPhotos[selectedImageIdx].title}
                    </h3>
                    <span className="text-[10px] font-mono text-gray-500 uppercase block font-semibold">Artiste/Auteur ou Conception de :</span>
                    <span className="text-xs text-cyan-300 font-mono block uppercase">{archivalPhotos[selectedImageIdx].artist}</span>
                  </div>

                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed text-left font-sans text-justify">
                    {archivalPhotos[selectedImageIdx].desc}
                  </p>
                </div>

                <div className="text-[9px] font-mono text-gray-600 border-t border-gray-900 pt-3 flex justify-between items-center">
                  <span>DATE DE PRISE : {archivalPhotos[selectedImageIdx].date}</span>
                  <span className="text-cyan-500/20 uppercase font-black tracking-widest">LAPD ARCHIVE</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
