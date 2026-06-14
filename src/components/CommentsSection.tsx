import React, { useState, useEffect } from "react";
import { MessageSquare, Send, User } from "lucide-react";
import { motion } from "motion/react";

interface Comment {
  id: string;
  pageId: string;
  author: string;
  content: string;
  createdAt: string;
}

interface CommentsSectionProps {
  pageId: "film" | "versions" | "book";
}

export default function CommentsSection({ pageId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/comments?pageId=${pageId}`);
      const data = await response.json();
      if (data.success && Array.isArray(data.comments)) {
        setComments(data.comments);
      } else {
        setError("Impossible de charger les commentaires.");
      }
    } catch (err) {
      console.error("Error loading comments:", err);
      setError("Erreur réseau lors du chargement des commentaires.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Restore username if available in localStorage
    const savedName = localStorage.getItem("bladeRunner_username");
    if (savedName) {
      setAuthor(savedName);
    } else {
      // Pick a random cool sci-fi username
      const coolDefaults = [
        "KD_9_3.7",
        "Roy_Batty_CS80",
        "Leon_Kowalski",
        "Zhora_Snake",
        "Pris_Nexus6",
        "Holden_VK",
        "Rachael_X9",
        "Gaff_Origami",
        "Sebastian_Toy"
      ];
      const randomName = coolDefaults[Math.floor(Math.random() * coolDefaults.length)];
      setAuthor(randomName);
    }
    fetchComments();
  }, [pageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    if (author.length < 2 || author.length > 100) {
      setError("Le nom doit faire entre 2 et 100 caractères.");
      return;
    }
    if (content.length < 2 || content.length > 2000) {
      setError("Le commentaire doit faire entre 2 et 2000 caractères.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId, author: author.trim(), content: content.trim() })
      });
      const data = await response.json();
      if (data.success) {
        setContent("");
        localStorage.setItem("bladeRunner_username", author.trim());
        await fetchComments();
      } else {
        setError(data.error || "Échec de l'envoi du commentaire.");
      }
    } catch (err) {
      console.error("Error sending comment:", err);
      setError("Erreur de connexion.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="bg-gray-900/40 border border-gray-800/80 rounded-xl p-6 backdrop-blur space-y-6 mt-12 shadow-[0_0_20px_rgba(6,182,212,0.02)]" id={`comments-${pageId}`}>
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <div className="flex items-center space-x-3">
          <MessageSquare className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-display uppercase tracking-wider text-cyan-300">
            Terminaux de Discussion ({comments.length})
          </h2>
        </div>
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden sm:inline">
          SUB-SEC: COMMENTS_NET_{pageId.toUpperCase()}
        </span>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-500/30 text-red-400 text-xs rounded-lg p-3 font-mono">
          [ERREUR DE TERMINAL] : {error}
        </div>
      )}

      {/* Comment history list */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {loading && comments.length === 0 ? (
          <div className="text-center py-6 text-xs text-cyan-500 font-mono animate-pulse uppercase">
            &gt; CONNEXION AU PROTOCOLE DE MÉMOIRE DES ARCHIVES...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-500 font-mono italic">
            Aucune transmission enregistrée sur cette fréquence de page. Soyez le premier à poster.
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comm) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={comm.id}
                className="bg-gray-950/50 border border-cyan-500/5 hover:border-cyan-500/20 rounded-lg p-4 space-y-2 transition-all duration-300"
              >
                <div className="flex justify-between items-start text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                    <span className="text-cyan-400 font-bold">{comm.author}</span>
                    <span className="text-gray-700 text-[10px] font-light">LAPD-TERM-LOG</span>
                  </div>
                  <span className="text-gray-500 text-[10px]">{formatDate(comm.createdAt)}</span>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-sans">{comm.content}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Post comment form */}
      <form onSubmit={handleSubmit} className="border-t border-gray-800/60 pt-4 space-y-4">
        <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 block">
          &gt; NOUVELLE ENTRÉE D'ARCHIVE SUR LE COMPORTEMENT :
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1 relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-cyan-400/60" />
            <input
              type="text"
              placeholder="Identifiant..."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-gray-950/80 border border-gray-800 focus:border-cyan-500 rounded-lg py-2 pl-9 pr-3 text-xs sm:text-sm text-gray-200 placeholder-gray-600 font-mono outline-none transition-colors duration-200"
              required
            />
          </div>
          <div className="sm:col-span-2 relative flex gap-2">
            <input
              type="text"
              placeholder="Votre message pour les archives d'empathie..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 bg-gray-950/80 border border-gray-800 focus:border-cyan-500 rounded-lg py-2 px-4 text-xs sm:text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors duration-200"
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400/80 focus:outline-none font-mono text-[10px] sm:text-xs font-bold uppercase py-2 px-4 rounded-lg flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.05)] hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] shrink-0 animate-pulse-slow"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Poster</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
