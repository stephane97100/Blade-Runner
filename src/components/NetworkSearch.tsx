import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, ChevronRight, CornerDownLeft, Eye, Book, Film, Sliders, ArrowUpRight, Cpu } from "lucide-react";
import { actorsData, filmVersions, bookDifferences, productionSecrets } from "../data/bladeRunnerData";
import { Actor, FilmVersion, BookDifference, ProductionSecret } from "../types";

interface SearchResult {
  id: string;
  type: "actor" | "version" | "book" | "tournage";
  title: string;
  subtitle: string;
  snippet: string;
  rawData: any;
}

interface NetworkSearchProps {
  onSelectActor: (actorId: string) => void;
  onNavigateTab: (tabId: string) => void;
}

export default function NetworkSearch({ onSelectActor, onNavigateTab }: NetworkSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);
  const [allSearchResults, setAllSearchResults] = useState<SearchResult[]>([]);
  const [showResultsModal, setShowResultsModal] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Play audio frequency
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

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute matches as query changes
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const matches: SearchResult[] = [];

    // 1. Search Actors
    actorsData.forEach((actor) => {
      if (
        actor.name.toLowerCase().includes(lowerQuery) ||
        actor.character.toLowerCase().includes(lowerQuery) ||
        actor.role.toLowerCase().includes(lowerQuery) ||
        actor.description.toLowerCase().includes(lowerQuery)
      ) {
        matches.push({
          id: `actor-${actor.id}`,
          type: "actor",
          title: actor.name,
          subtitle: `Personnage: ${actor.character} (${actor.role})`,
          snippet: actor.description,
          rawData: actor
        });
      }
    });

    // 2. Search Film Versions
    filmVersions.forEach((version) => {
      if (
        version.title.toLowerCase().includes(lowerQuery) ||
        version.description.toLowerCase().includes(lowerQuery) ||
        version.year.includes(lowerQuery) ||
        version.keyDifferences.some((diff) => diff.toLowerCase().includes(lowerQuery))
      ) {
        matches.push({
          id: `version-${version.id}`,
          type: "version",
          title: version.title,
          subtitle: `Version Cinéma (${version.year})`,
          snippet: version.description,
          rawData: version
        });
      }
    });

    // 3. Search Book Differences
    bookDifferences.forEach((book, idx) => {
      if (
        book.topic.toLowerCase().includes(lowerQuery) ||
        book.bookVersion.toLowerCase().includes(lowerQuery) ||
        book.movieVersion.toLowerCase().includes(lowerQuery) ||
        book.thematicImpact.toLowerCase().includes(lowerQuery)
      ) {
        matches.push({
          id: `book-${idx}`,
          type: "book",
          title: book.topic,
          subtitle: "Livre vs Film • Différence Thématique",
          snippet: book.thematicImpact,
          rawData: book
        });
      }
    });

    // 4. Search Tournage/Secrets
    productionSecrets.forEach((sec, idx) => {
      if (
        sec.title.toLowerCase().includes(lowerQuery) ||
        sec.category.toLowerCase().includes(lowerQuery) ||
        sec.content.toLowerCase().includes(lowerQuery)
      ) {
        matches.push({
          id: `tournage-${idx}`,
          type: "tournage",
          title: sec.title,
          subtitle: `Production • Déclassification ${sec.category}`,
          snippet: sec.content,
          rawData: sec
        });
      }
    });

    setSuggestions(matches.slice(0, 6)); // Limit suggestions
    setAllSearchResults(matches);
  }, [query]);

  const handleSuggestionClick = (item: SearchResult) => {
    playBeep(480);
    setSelectedItem(item);
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    playBeep(620);
    setShowSuggestions(false);
    setShowResultsModal(true);
  };

  const clearSearch = () => {
    playBeep(350);
    setQuery("");
    setSuggestions([]);
  };

  const handleActionClick = (item: SearchResult) => {
    playBeep(740);
    setSelectedItem(null);
    setShowResultsModal(false);

    if (item.type === "actor") {
      onNavigateTab("acteurs");
      setTimeout(() => {
        onSelectActor(item.rawData.id);
      }, 300);
    } else if (item.type === "version") {
      onNavigateTab("versions");
    } else if (item.type === "book") {
      onNavigateTab("livre_vs_film");
    } else if (item.type === "tournage") {
      onNavigateTab("tournage");
    }
  };

  return (
    <div className="relative w-full max-w-xs md:max-w-sm" ref={searchContainerRef}>
      {/* Search Bar Input Form */}
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-cyan-500/60" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            playBeep(380);
            setShowSuggestions(true);
          }}
          placeholder="RECHERCHE GLOBALE LAPD..."
          className="w-full bg-cyan-950/25 border border-cyan-500/25 focus:border-cyan-400 text-xs text-white placeholder:text-cyan-500/40 pl-9 pr-8 py-2 rounded-lg outline-none transition-colors duration-300 uppercase font-mono tracking-widest text-left"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2 top-2 hover:text-white text-cyan-500/60 p-0.5 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {/* Live Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute z-50 left-0 right-0 mt-1.5 bg-gray-950 border border-cyan-500/20 rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(6,182,212,0.15)] text-left"
          >
            <div className="p-2 border-b border-gray-900 bg-gray-950 flex items-center justify-between text-[10px] font-mono tracking-widest text-cyan-500/80">
              <span className="flex items-center gap-1">
                <Cpu className="h-3 w-3 animate-pulse" />
                <span>SUGGESTIONS MAINFRAME</span>
              </span>
              <span>ENTER POUR TOUT VOIR</span>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-gray-900">
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full px-4 py-2.5 hover:bg-cyan-955/20 text-left flex items-start gap-2.5 transition-colors cursor-pointer group"
                >
                  <div className="mt-1">
                    {item.type === "actor" && <Cpu className="h-3.5 w-3.5 text-cyan-400" />}
                    {item.type === "version" && <Film className="h-3.5 w-3.5 text-purple-400" />}
                    {item.type === "book" && <Book className="h-3.5 w-3.5 text-emerald-400" />}
                    {item.type === "tournage" && <Sliders className="h-3.5 w-3.5 text-amber-400" />}
                  </div>
                  <div className="font-mono text-[11px] leading-relaxed truncate">
                    <span className="block text-white font-bold group-hover:text-cyan-300 truncate">
                      {item.title}
                    </span>
                    <span className="block text-gray-505 text-[9px] uppercase tracking-wider truncate">
                      {item.subtitle}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Deep Item Inspection Overlay */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-gray-950 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.2)] text-left flex flex-col"
            >
              {/* Terminal Title */}
              <div className="px-5 py-3 border-b border-gray-900 bg-cyan-950/20 flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 tracking-wider font-bold truncate">
                  ANALYSE DOSSIER // TYPE: {selectedItem.type.toUpperCase()}
                </span>
                <button
                  onClick={() => {
                    playBeep(320);
                    setSelectedItem(null);
                  }}
                  className="p-1 hover:text-white text-gray-400 cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Terminal Body */}
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-black text-white uppercase tracking-wider leading-none">
                    {selectedItem.title}
                  </h3>
                  <span className="inline-block text-[10px] font-mono text-cyan-400/85 tracking-widest uppercase">
                    {selectedItem.subtitle}
                  </span>
                </div>

                <div className="p-4 bg-gray-900/60 border border-gray-870/50 rounded-xl font-sans text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedItem.snippet}
                </div>

                {/* Sub-fields depending on types */}
                {selectedItem.type === "actor" && (
                  <div className="text-left font-mono text-[10px] border-t border-gray-900/40 pt-3 space-y-1.5 text-gray-400">
                    <span className="block">DÉTENTEUR : RÔLE DE <strong className="text-cyan-300">{selectedItem.rawData.character}</strong></span>
                    <span className="block">STATUT CENTRAL : {selectedItem.rawData.status}</span>
                  </div>
                )}

                {selectedItem.type === "version" && (
                  <div className="text-left font-mono text-[10px] border-t border-gray-900/40 pt-3 space-y-1 text-gray-405">
                    <span className="block">DURÉE TOTALE : {selectedItem.rawData.duration}</span>
                    <span className="block">ASPECT CRITIQUE : {selectedItem.rawData.importance}</span>
                  </div>
                )}

                {selectedItem.type === "book" && (
                  <div className="text-left text-[11px] border-t border-gray-900/40 pt-3 space-y-2 text-gray-300">
                    <div>
                      <strong className="block font-mono text-[9px] text-emerald-400">DANS LE LIVRE :</strong>
                      <p>{selectedItem.rawData.bookVersion}</p>
                    </div>
                    <div>
                      <strong className="block font-mono text-[9px] text-purple-400">DANS LE FILM :</strong>
                      <p>{selectedItem.rawData.movieVersion}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 bg-gray-900/20 border-t border-gray-900 flex items-center justify-end gap-3 font-mono text-xs">
                <button
                  onClick={() => {
                    playBeep(320);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer hover:bg-gray-900 rounded-lg text-xs"
                >
                  Fermer
                </button>
                <button
                  onClick={() => handleActionClick(selectedItem)}
                  className="px-5 py-2 bg-cyan-950/40 border border-cyan-500/35 hover:bg-cyan-500 hover:text-black font-bold text-cyan-400 rounded-lg flex items-center gap-1.5 transition-all text-xs cursor-pointer"
                >
                  <span>{selectedItem.type === "actor" ? "ALIMENTER ESPER ANALYZER" : "NAVIGUER RE-SELECTION"}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: All Search Results Overlay */}
      <AnimatePresence>
        {showResultsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-gray-950 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.25)] flex flex-col h-[600px]"
            >
              {/* Header inside Modal */}
              <div className="px-6 py-4 border-b border-gray-900 bg-cyan-950/20 flex items-center justify-between shrink-0">
                <span className="text-[10px] font-mono text-cyan-400 tracking-widest font-black uppercase">
                  RECHERCHE MAINFRAME LAPD • RÉSULTATS POUR : "{query.toUpperCase()}"
                </span>
                <button
                  onClick={() => {
                    playBeep(320);
                    setShowResultsModal(false);
                  }}
                  className="p-1 hover:text-white text-gray-400 cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* List of results */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4">
                {allSearchResults.length === 0 ? (
                  <div className="text-center py-20 font-mono text-xs text-gray-500 space-y-2">
                    <p className="tracking-widest text-red-400 font-bold">RECHERCHE INFRACTUEUSE (SYS-NULL)</p>
                    <p>Aucune correspondance trouvée sur les serveurs déclassifiés.</p>
                  </div>
                ) : (
                  allSearchResults.map((result) => (
                    <div
                      key={result.id}
                      className="p-4 bg-gray-905 border border-gray-900 rounded-xl hover:border-cyan-505/30 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 select-text text-left"
                    >
                      <div className="space-y-1.5 max-w-xl">
                        <span className={`inline-block text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          result.type === "actor" ? "bg-cyan-950 text-cyan-400 border border-cyan-500/20" :
                          result.type === "version" ? "bg-purple-950 text-purple-400 border border-purple-500/20" :
                          result.type === "book" ? "bg-emerald-905 text-emerald-450 border border-emerald-500/20" :
                          "bg-amber-950 text-amber-400 border border-amber-500/20"
                        }`}>
                          {result.type === "actor" ? "Acteur / Personnage" :
                           result.type === "version" ? "Version du Film" :
                           result.type === "book" ? "Livre vs Film" :
                           "Secrets de Production"}
                        </span>
                        <h4 className="text-white font-display font-medium text-sm leading-snug">
                          {result.title}
                        </h4>
                        <span className="block text-[10px] text-gray-550 font-mono uppercase">
                          {result.subtitle}
                        </span>
                        <p className="text-[11px] text-gray-450 leading-relaxed font-sans line-clamp-2">
                          {result.snippet}
                        </p>
                      </div>

                      <button
                        onClick={() => handleActionClick(result)}
                        className="py-1.5 px-3 border border-cyan-500/20 hover:border-cyan-400 text-cyan-400 hover:text-white font-mono text-[10px] rounded-lg tracking-widest uppercase transition-all flex items-center gap-1 shrink-0 self-start md:self-center cursor-pointer font-bold"
                      >
                        Consulter
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Total results summary footer */}
              <div className="px-6 py-3 border-t border-gray-900 bg-gray-900/30 flex justify-between items-center text-[9px] font-mono text-gray-500 tracking-wider shrink-0">
                <span>RÉSULTATS DE CORRESPONDANCE : {allSearchResults.length} UNITÉS</span>
                <span>CODE DE SÉCURITÉ : REG-ANALYST_SEC_7</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
