import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Newspaper, Clock, ExternalLink, RefreshCw, Radio, AlertCircle, MessageSquare, Send, User, MessageSquarePlus, Globe } from "lucide-react";
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

interface ForumDiscussion {
  id: string;
  username: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function NewsView() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);

  // Subtabs configuration: 'news' | 'discussions'
  const [activeTab, setActiveTab] = useState<"news" | "discussions">("news");

  // Discussions state
  const [discussions, setDiscussions] = useState<ForumDiscussion[]>([]);
  const [loadingDiscussions, setLoadingDiscussions] = useState(false);
  const [forumUsername, setForumUsername] = useState("");
  const [forumTitle, setForumTitle] = useState("");
  const [forumContent, setForumContent] = useState("");
  const [postingDiscussion, setPostingDiscussion] = useState(false);
  const [discussionError, setDiscussionError] = useState<string | null>(null);
  const [discussionSuccess, setDiscussionSuccess] = useState(false);

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

  const fetchDiscussions = async (silent = false) => {
    if (!silent) setLoadingDiscussions(true);
    try {
      const response = await fetch("/api/discussions");
      const data = await response.json();
      if (data.success && Array.isArray(data.discussions)) {
        setDiscussions(data.discussions);
      } else {
        throw new Error("Données de discussion corrompues.");
      }
    } catch (err: any) {
      console.error("[NewsView] Error fetching discussions:", err);
    } finally {
      if (!silent) setLoadingDiscussions(false);
    }
  };

  useEffect(() => {
    // Initial fetch triggered via the TerminalLoader onComplete
    fetchNews();
    fetchDiscussions();
  }, []);

  const handleRefresh = () => {
    playBeep(450);
    if (activeTab === "news") {
      fetchNews(true);
    } else {
      fetchDiscussions();
    }
  };

  const handleSubmitDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    playBeep(580);
    setDiscussionError(null);
    setDiscussionSuccess(false);

    if (!forumUsername.trim() || !forumTitle.trim() || !forumContent.trim()) {
      setDiscussionError("Tous les champs sont requis pour l'authentification de la transmission.");
      return;
    }

    setPostingDiscussion(true);
    try {
      const response = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: forumUsername,
          title: forumTitle,
          content: forumContent,
        }),
      });

      const data = await response.json();
      if (data.success) {
        playBeep(880);
        setDiscussionSuccess(true);
        setForumTitle("");
        setForumContent("");
        // Refresh discussions
        await fetchDiscussions(true);
      } else {
        throw new Error(data.error || "Échec d'envoi.");
      }
    } catch (err: any) {
      setDiscussionError(err.message || "Erreur lors du dépôt du message.");
    } finally {
      setPostingDiscussion(false);
    }
  };

  if (loading) {
    return (
      <TerminalLoader
        onComplete={() => setLoading(false)}
        targetDataName="FLUX D'ACTUALITÉS CENTRALISÉ ET FORUM DES RÉPLICANTS"
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
              RSS & FIRESTORE DIALOGUE : ONLINE
            </div>
            <h1 className="text-xl md:text-2xl font-display font-black tracking-widest text-white uppercase flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-purple-400" />
              ACTUALITÉS DE L'UNIVERS
            </h1>
          </div>
          <p className="text-xs text-gray-400 font-mono leading-relaxed">
            COMMUNICATIONS MULTIPLEX : DERNIÈRES RECHERCHES, DEBATS SCI-FI ET DISCUSSIONS SUR LES VERSIONS ET PERSONNAGES
          </p>
        </div>

        {/* Refresh button action */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-950 border border-gray-850 hover:border-purple-500/40 text-gray-400 hover:text-white font-mono text-xs rounded-lg transition-all cursor-pointer self-start md:self-auto uppercase tracking-wider"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-purple-400 ${refreshing ? "animate-spin" : ""}`} />
          <span>{refreshing ? "Synchronisation..." : "Rafraîchir"}</span>
        </button>
      </div>

      {/* Embedded Sub-tabs to Switch between News and Forum */}
      <div className="flex border-b border-gray-900 gap-1 select-none">
        <button
          onClick={() => {
            playBeep(320);
            setActiveTab("news");
          }}
          className={`flex items-center space-x-2 px-5 py-3 text-xs font-mono uppercase tracking-widest border-t-2 border-x transition-all duration-300 cursor-pointer ${
            activeTab === "news"
              ? "bg-gray-900/40 border-t-purple-500 border-x-gray-900 text-purple-300 font-bold"
              : "border-t-transparent border-x-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>Transmissions Globales</span>
        </button>
        <button
          onClick={() => {
            playBeep(350);
            setActiveTab("discussions");
          }}
          className={`flex items-center space-x-2 px-5 py-3 text-xs font-mono uppercase tracking-widest border-t-2 border-x transition-all duration-300 cursor-pointer ${
            activeTab === "discussions"
              ? "bg-gray-900/40 border-t-purple-500 border-x-gray-900 text-purple-300 font-bold"
              : "border-t-transparent border-x-transparent text-gray-400 hover:text-white"
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Discussions Hôtel Bradbury</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "news" ? (
          <motion.div
            key="news-subtab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Status stamp banner */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-3.5 bg-gray-950/80 border border-gray-900 rounded-xl font-mono text-[10px] text-gray-500 gap-2">
              <span className="flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 text-purple-500 animate-pulse" />
                <span>RÉCEPTION SÉCURISÉE : {isCached ? "CACHÉE EN INTERNE" : "CANAL ACTIF GOOGLE NEWS FEED"}</span>
              </span>
              <span className="text-gray-600 uppercase">SYS SEC: 512-AES DIRECT_SYNC</span>
            </div>

            {errorMsg && (
              <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-4 flex items-start space-x-3 text-left">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold text-red-400 uppercase">RUPTURE DE TRANSMISSION</h4>
                  <p className="text-[11px] text-gray-400">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Articles List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article, idx) => {
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
                    transition={{ delay: idx * 0.05, duration: 0.35 }}
                    className="bg-gray-950 border border-gray-900/60 rounded-xl overflow-hidden hover:border-purple-500/30 shadow-lg group flex flex-col justify-between text-left"
                  >
                    <div className="relative aspect-[16/9] w-full bg-gray-950 overflow-hidden border-b border-gray-900">
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

                    <div className="p-5 flex-grow space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1.5 font-mono text-[9px] text-gray-500">
                          <Clock className="h-3 w-3 text-purple-500/80" />
                          <span className="uppercase">{formattedDate}</span>
                        </div>
                        <h3 className="text-white font-display font-bold text-sm leading-snug tracking-wide group-hover:text-purple-300 transition-colors uppercase">
                          {article.title}
                        </h3>
                        <p className="text-[11px] text-gray-400 font-sans leading-relaxed line-clamp-3">
                          {article.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-900/40 flex items-center justify-between">
                        <span className="text-[8px] font-mono text-gray-650 uppercase">TRANS-FEED-{idx+1}</span>
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => playBeep(520)}
                          className="flex items-center space-x-1.5 text-[10px] font-mono text-purple-400 hover:text-white font-bold tracking-wider uppercase transition-colors cursor-pointer"
                        >
                          <span>Explorer l'article</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="forum-subtab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left side: List of discussions (Col: 7 or 8) */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs uppercase mb-1">
                <MessageSquare className="h-4 w-4 text-purple-500" />
                <span>FLUX DES TERMINAUX ENREGISTRÉS ({discussions.length})</span>
              </div>

              {loadingDiscussions ? (
                <div className="flex flex-col items-center justify-center p-12 border border-gray-850 rounded-xl bg-gray-950/60 text-gray-500 text-center font-mono text-xs">
                  <RefreshCw className="h-6 w-6 animate-spin text-purple-550 mb-3" />
                  <span>DECRYTAGE DU FLUX SECURISE DE DIALOGUES...</span>
                </div>
              ) : (
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1.5 scrollbar-thin">
                  {discussions.map((disc, idx) => {
                    const discDate = new Date(disc.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit"
                    });

                    return (
                      <motion.div
                        key={disc.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                        className="bg-gray-950 border border-gray-870 hover:border-purple-500/40 p-5 rounded-xl space-y-3 shadow-md"
                      >
                        <div className="flex items-center justify-between border-b border-gray-900 pb-2">
                          <span className="flex items-center text-purple-450 font-mono text-[10px] uppercase font-bold tracking-widest gap-1.5">
                            <User className="h-3 w-3 text-purple-500" />
                            <span>{disc.username}</span>
                          </span>
                          <span className="text-[10px] font-mono text-gray-550 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{discDate}</span>
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-white font-display font-bold text-xs md:text-sm uppercase tracking-wider">
                            {disc.title}
                          </h4>
                          <p className="text-xs text-gray-300 leading-relaxed font-sans whitespace-pre-wrap">
                            {disc.content}
                          </p>
                        </div>
                        <div className="text-[8px] font-mono text-gray-650 uppercase">
                          SÉLECTION SECURE : NET-RESONANCE_ID-{disc.id.substring(0, 8)}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right side: Form to write a new announcement / comment (Col: 5) */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs uppercase mb-1">
                <MessageSquarePlus className="h-4 w-4 text-purple-500" />
                <span>OUVRIR UNE RE-TRANSMISSION</span>
              </div>

              <div className="bg-gray-950 border border-gray-900 rounded-xl p-5 space-y-4 shadow-xl">
                <p className="text-[10px] font-mono text-gray-500 uppercase leading-relaxed">
                  NOTE: Vos écrits seront partagés avec l'ensemble du réseau crypté. Veuillez respecter les codes de coordination du LAPD.
                </p>

                <form onSubmit={handleSubmitDiscussion} className="space-y-4">
                  {/* Alias */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase text-gray-400">ALIAS DE COMMUNICATEUR :</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-500" />
                      <input
                        type="text"
                        value={forumUsername}
                        onChange={(e) => setForumUsername(e.target.value)}
                        placeholder="Ex: Gaff_Origami, Deck_9..."
                        className="w-full pl-9 pr-3 py-2 bg-gray-900 border border-gray-800 focus:border-purple-500 rounded-lg text-xs text-white font-mono placeholder:text-gray-600 outline-none transition-colors"
                        maxLength={50}
                        required
                      />
                    </div>
                  </div>

                  {/* Title / Topic */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase text-gray-400">SUJET / ANNONCE :</label>
                    <input
                      type="text"
                      value={forumTitle}
                      onChange={(e) => setForumTitle(e.target.value)}
                      placeholder="Titre de votre sujet..."
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-800 focus:border-purple-500 rounded-lg text-xs text-white placeholder:text-gray-600 outline-none transition-colors font-display"
                      maxLength={120}
                      required
                    />
                  </div>

                  {/* Content / Monologue */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase text-gray-400">MONOLOGUE / TRANSMISSION :</label>
                    <textarea
                      value={forumContent}
                      onChange={(e) => setForumContent(e.target.value)}
                      placeholder="Redigez vos arguments ou réflexions ici..."
                      rows={5}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-800 focus:border-purple-500 rounded-lg text-xs text-white placeholder:text-gray-600 outline-none transition-colors font-sans resize-none"
                      maxLength={2000}
                      required
                    ></textarea>
                  </div>

                  {/* Errors / Success displays */}
                  {discussionError && (
                    <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg text-red-400 text-[10px] font-mono">
                      {discussionError}
                    </div>
                  )}

                  {discussionSuccess && (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-emerald-450 text-[10px] font-mono">
                      ✓ TRANSMISSION RÉUSSIE ET INSCRITE DANS FIRESTORE.
                    </div>
                  )}

                  {/* Button */}
                  <button
                    type="submit"
                    disabled={postingDiscussion}
                    className="w-full py-2.5 bg-purple-900/80 hover:bg-purple-850 text-white font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer border border-purple-500/30"
                  >
                    <Send className="h-3.5 w-3.5 animate-pulse" />
                    <span>{postingDiscussion ? "Dépôt en cours..." : "TRANSMETTRE LA SÉQUENCE"}</span>
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
