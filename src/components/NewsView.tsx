import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Newspaper, Clock, ExternalLink, RefreshCw, Radio, ShieldAlert, Sparkles, AlertCircle, FileText } from "lucide-react";
import TerminalLoader from "./TerminalLoader";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  link: string;
  source: string;
}

export default function NewsView() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);

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

  const fetchNews = async (showProgress = false) => {
    if (showProgress) setRefreshing(true);
    try {
      const response = await fetch("/api/news");
      if (!response.ok) {
        throw new Error("Impossible de joindre le récepteur de flux central LAPD.");
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.articles)) {
        setArticles(data.articles);
        setIsCached(!!data.cached);
        setErrorMsg(null);
      } else {
        throw new Error("Données de transmission corrompues ou incomplètes.");
      }
    } catch (err: any) {
      console.error("[NewsView] Error fetching news:", err);
      setErrorMsg(err.message || "Erreur inconnue de télémesure.");
    } finally {
      if (showProgress) setRefreshing(false);
    }
  };

  useEffect(() => {
    // Initial fetch triggered via the TerminalLoader onComplete
    fetchNews();
  }, []);

  const handleRefresh = () => {
    playBeep(450);
    fetchNews(true);
  };

  if (loading) {
    return (
      <TerminalLoader
        onComplete={() => setLoading(false)}
        targetDataName="FLUX D'ACTUALITÉS CENTRALISÉ DU CYBER-RÉSEAU LAPD (RSS SYNC)"
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
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-1 px-2.5 bg-purple-950/40 border border-purple-500/30 rounded text-purple-400 font-mono text-xs font-bold animate-pulse">
              RSS SATELLITE FEED : LIVE
            </div>
            <h1 className="text-xl md:text-2xl font-display font-black tracking-widest text-white uppercase flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-purple-400" />
              ACTUALITÉS DE L'UNIVERS
            </h1>
          </div>
          <p className="text-xs text-gray-400 font-mono leading-relaxed">
            ACCÈS MULTIPLEX : INFORMATIONS SUR LES DERNIÈRES SORTIES CINÉMA, JEUX ET PROJETS SCI-FI BLADE RUNNER
          </p>
        </div>

        {/* Refresh button action */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-950 border border-gray-850 hover:border-purple-500/40 text-gray-400 hover:text-white font-mono text-xs rounded-lg transition-all cursor-pointer self-start md:self-auto uppercase tracking-wider"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-purple-400 ${refreshing ? "animate-spin" : ""}`} />
          <span>{refreshing ? "Synchronisation..." : "Rafraîchir le flux"}</span>
        </button>
      </div>

      {/* Network Source status stamp info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-3.5 bg-gray-950/80 border border-gray-900 rounded-xl font-mono text-[10px] text-gray-500 gap-2">
        <span className="flex items-center gap-1.5">
          <Radio className="h-3.5 w-3.5 text-purple-500 animate-pulse animate-duration-2000" />
          <span>RÉPARATION SOURCE : {isCached ? "DATABASE CACHE DE SECOURS (OFFLINE)" : "CANAL ACTIF GOOGLE NEWS RSS"}</span>
        </span>
        <span className="text-gray-600 uppercase">SYS SEC: 256-BIT CRYPTED // CHRONO_ORDER_STRICT</span>
      </div>

      {/* Error state display block */}
      {errorMsg && (
        <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-4 flex items-start space-x-3 text-left">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-xs font-mono font-bold text-red-400 uppercase">RUPTURE DE TRANSMISSION SATELLITE</h4>
            <p className="text-[11px] text-gray-400 font-sans">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Articles Main Stream List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article, idx) => {
          // Format publication date beautifully
          const dateObj = new Date(article.date);
          const formattedDate = dateObj.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric"
          });

          return (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.35 }}
              className="bg-gray-950 border border-gray-900/60 rounded-xl overflow-hidden hover:border-purple-500/30 shadow-lg group flex flex-col justify-between"
            >
              {/* Image box frame */}
              <div className="relative aspect-[16/9] w-full bg-gray-900 overflow-hidden border-b border-gray-950">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter saturate-40 group-hover:saturate-85 group-hover:scale-103 transition-all duration-500 brightness-85 group-hover:brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/25 to-transparent" />

                <div className="absolute top-4 left-4 bg-purple-950/80 border border-purple-500/30 text-[8.5px] font-mono font-bold text-purple-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {article.source}
                </div>
              </div>

              {/* Text content details */}
              <div className="p-5 flex-grow text-left space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  {/* Timestamp banner */}
                  <div className="flex items-center space-x-1.5 font-mono text-[9px] text-gray-500">
                    <Clock className="h-3 w-3 text-purple-500/80" />
                    <span className="uppercase">{formattedDate}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-display font-bold text-sm leading-snug tracking-wide group-hover:text-purple-300 transition-colors uppercase">
                    {article.title}
                  </h3>

                  {/* Body description */}
                  <p className="text-[11px] text-gray-400 font-sans leading-relaxed line-clamp-3">
                    {article.description}
                  </p>
                </div>

                {/* Footer Action link */}
                <div className="pt-4 border-t border-gray-900/40 flex items-center justify-between">
                  <span className="text-[8px] font-mono text-gray-600 uppercase">SYS_REF: RSS_TRANS-{idx+1}</span>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => playBeep(520)}
                    className="flex items-center space-x-1.5 text-[10px] font-mono text-purple-400 hover:text-white font-bold tracking-wider uppercase transition-colors"
                  >
                    <span>Consulter l'article</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
