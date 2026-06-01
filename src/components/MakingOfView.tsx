import { motion } from "motion/react";
import { productionSecrets } from "../data/bladeRunnerData";
import { HelpCircle, Archive, ClipboardList, PenTool } from "lucide-react";

export default function MakingOfView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Hero Banner del Tournage */}
      <div className="relative h-[250px] rounded-xl overflow-hidden border border-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.12)] flex items-end p-8 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1200')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent"></div>
        <div className="absolute top-4 right-4 bg-cyan-950/85 border border-cyan-400/50 text-cyan-400 text-xs px-3 py-1 font-display tracking-widest rounded uppercase">
          LAPD FILE: BEHIND-SET-1982
        </div>
        <div className="relative z-10 space-y-1">
          <h1 className="text-2xl md:text-4xl font-display font-black tracking-tight text-white uppercase">
            COULISSES & PROCÉDÉS TECHNIQUES
          </h1>
          <p className="text-gray-300 max-w-2xl text-xs md:text-sm leading-relaxed">
            Pénétrez dans l'ambiance électrique et brumeuse des plateaux de Warner Bros, où Ridley Scott et son équipe ont repoussé les limites des effets pratiques hollywoodiens.
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-xl md:text-2xl font-display font-bold tracking-wider text-cyan-400 uppercase">
          L'ARCHIVE DES SECRETS DE TOURNAGE
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          L'historique du projet, le choix crucial du réalisateur, le casting légendaire de Rick Deckard et les secrets techniques d'un film devenu culte.
        </p>
      </div>

      {/* Grid of Secrets styled beautifully as folders/archives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {productionSecrets.map((secret, idx) => {
          return (
            <div
              key={idx}
              className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden backdrop-blur flex flex-col justify-between"
            >
              {/* Image Header with styled title overlay */}
              <div
                className="h-40 bg-cover bg-center relative border-b border-gray-800/80 group overflow-hidden"
                style={{ backgroundImage: `url('${secret.imageUrl || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800" }')` }}
              >
                {/* Visual lens reflection layer */}
                <div className="absolute inset-0 bg-neutral-900/60 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
                
                {/* Top category pill */}
                <div className="absolute top-3 left-3 bg-cyan-950/90 border border-cyan-400/50 text-cyan-400 text-[9px] px-2 py-0.5 font-mono tracking-widest uppercase rounded">
                  DOC-REG: {secret.category}
                </div>

                {/* Bottom title text overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-base font-display font-bold text-white tracking-wide uppercase leading-tight drop-shadow-md">
                    {secret.title}
                  </h3>
                </div>
              </div>

              {/* Text content block */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <p className="text-gray-300 text-xs leading-relaxed">
                  {secret.content}
                </p>

                {/* Internal layout stamp tag */}
                <div className="border-t border-gray-800/60 pt-3 flex items-center justify-between text-[10px] font-mono text-gray-500">
                  <span className="flex items-center space-x-1.5 uppercase tracking-wider">
                    <Archive className="h-3 w-3 text-cyan-500/40" />
                    <span>L.A. DEPT ARCHIVE // 1982</span>
                  </span>
                  <span className="text-cyan-500/30 font-semibold uppercase">
                    CONFIDENTIEL
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
