import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Terminal, Mail, User, Info, CheckCircle2 } from "lucide-react";

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatusMsg({ type: "error", text: "Veuillez remplir tous les champs du formulaire." });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStatusMsg({
          type: "success",
          text: `Message transmis avec succès à l'examinateur de contact : steeve97113@hotmail.com`
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatusMsg({
          type: "error",
          text: data.error || "Une erreur est survenue lors de l'enregistrement de l'appel."
        });
      }
    } catch (err) {
      setStatusMsg({
        type: "error",
        text: "Échec de connexion au serveur de transmission du LAPD."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          PAGE CONTACT // TRANSMISSION SECURISEE
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Utilisez ce console cryptée de routage pour transmettre vos réquisitions ou requêtes directement à l'adresse désignée.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Card: Info and specs (cols: 5) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-gray-900/60 to-gray-950/40 border border-gray-800 rounded-xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 border-b border-gray-800 pb-3">
              <Terminal className="h-5 w-5 text-cyan-400" />
              <h2 className="text-sm font-display font-bold uppercase tracking-widest text-cyan-300">
                Spécifications de Routage
              </h2>
            </div>

            <div className="space-y-4 text-xs text-gray-400 leading-relaxed font-mono">
              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-gray-500 font-bold uppercase text-[9px] block">DESTINATAIRE ARCHIVÉ :</span>
                  <span className="text-cyan-300 font-bold select-all">steeve97113@hotmail.com</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Info className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-gray-500 font-bold uppercase text-[9px] block">ROUTAGE ACTIF :</span>
                  <p className="text-[10px]">Chaque message est encapsulé dans une trame de stockage puis consigné dans la base de données cloud Firestore de sécurité de l'application.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Aesthetic Terminal Output graphic */}
          <div className="bg-black/80 rounded-lg p-4 border border-cyan-500/10 font-mono text-[10px] text-gray-500 space-y-1">
            <p className="text-cyan-400">$ NC CONNECT steeve97113@hotmail.com</p>
            <p className="text-gray-600">Connecting to mail gateway server...</p>
            <p className="text-emerald-500">GATEWAY ESTABLISHED: ENCRYPT SHA-256</p>
            <p className="text-gray-600">IP LOGGED: 127.0.0.1 // PROXIMITY LAPD</p>
          </div>
        </div>

        {/* Right card: Message Form (cols: 7) */}
        <div className="lg:col-span-7 bg-gray-900/40 border border-gray-800 rounded-xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden">
          {/* Scanline pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_96%,rgba(6,182,212,0.02)_96%)] bg-[size:100%_16px] pointer-events-none"></div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block font-bold">
                Votre Nom ou Identifiant :
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  required
                  placeholder="Rick Deckard / Nexus suspect ID..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-950/80 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500/80 transition-colors"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block font-bold">
                Adresse électronique de retour :
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  required
                  placeholder="votre_adresse@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-950/80 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500/80 transition-colors"
                />
              </div>
            </div>

            {/* Message Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block font-bold">
                Contenu de la Réquisition :
              </label>
              <textarea
                required
                rows={5}
                placeholder="Décrivez votre message, vos doutes métaphysiques, ou vos questions sur l'unité ou la programmation réplicante..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-gray-950/80 border border-gray-800 rounded-lg p-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500/80 transition-colors resize-y min-h-[120px]"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Submission status feedback notifications */}
              <div className="flex-grow">
                <AnimatePresence mode="wait">
                  {statusMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className={`text-xs p-3 rounded border font-mono ${
                        statusMsg.type === "success"
                          ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400"
                          : "bg-red-950/40 border-red-500/40 text-red-400"
                      }`}
                    >
                      {statusMsg.type === "success" && <CheckCircle2 className="h-4 w-4 inline mr-2 align-middle" />}
                      <span className="align-middle">{statusMsg.text}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-display font-medium uppercase tracking-widest text-xs px-5 py-3 rounded-lg border border-cyan-400/40 transition-colors cursor-pointer flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span> TRANSMISSION...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span> TRANSMETTRE</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </motion.div>
  );
}
