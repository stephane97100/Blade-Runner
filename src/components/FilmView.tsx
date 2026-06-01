import { motion } from "motion/react";
import { Film, Eye, ShieldAlert, Zap, Globe, Sparkles, Camera } from "lucide-react";

export default function FilmView() {
  const themes = [
    {
      icon: <Eye className="h-6 w-w text-cyan-400" />,
      title: "La nature de l'Humanité",
      desc: "Qu'est-ce qui nous rend humains ? Blade Runner explore le statut existentiel des réplicants, qui développent des souvenirs implantés, de la nostalgie et une authentique peur de mourir, s'avérant parfois plus sensibles que leurs créateurs humains."
    },
    {
      icon: <ShieldAlert className="h-6 w-6 text-red-400" />,
      title: "La Dystopie Corporatiste",
      desc: "La Tyrell Corporation domine l'économie d'un Los Angeles asphyxié, vivant sous de sombres trombes d'eaux perpétuelles et des slogans publicitaires géants. Elle incarne la dérive d'une technologie au service d'un capitalisme sans limites morales."
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-400" />,
      title: "L'Esthétique Cyberpunk & Néo-Noir",
      desc: "Fusionnant le détective privé cynique de l'âge noir d'Hollywood avec la haute technologie future. Blade Runner a mis au point un design retro-futuriste inédit : des néons fumants, de la pluie acide continue, du brouillard et des gratte-ciels colossaux."
    },
    {
      icon: <Globe className="h-6 w-6 text-purple-400" />,
      title: "La Musique Mythique de Vangelis",
      desc: "Les nappes de synthétiseurs analogiques Yamaha CS-80 de Vangelis apportent un lyrisme mélancolique, transformant ce thriller de science-fiction en une tragédie grecque poétique et intemporelle."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      {/* Hero Banner */}
      <div className="relative h-[300px] rounded-xl overflow-hidden border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-end p-8 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1200')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent"></div>
        <div className="absolute top-4 right-4 bg-cyan-950/80 border border-cyan-400/50 text-cyan-400 text-xs px-3 py-1 font-display tracking-widest rounded uppercase">
          LAPD FILE: 1982-SYNOP
        </div>
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 uppercase">
            BLADE RUNNER (1982)
          </h1>
          <p className="text-gray-300 max-w-2xl text-sm md:text-base">
            Réalisé par <span className="text-cyan-400 font-semibold">Ridley Scott</span>, adapté du chef-d'œuvre littéraire de Philip K. Dick, Blade Runner a défini l'âge d'or esthétique du cinéma de science-fiction dystopique.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Synopsis */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900/50 border border-gray-800/80 rounded-xl p-6 backdrop-blur space-y-4">
            <div className="flex items-center space-x-3 border-b border-gray-800 pb-3">
              <Film className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-display uppercase tracking-wider text-cyan-300">
                Synopsis Officiel
              </h2>
            </div>
            <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
              <p>
                En <span className="text-white font-semibold">Novembre 2019</span> à Los Angeles, la Terre est devenue une mégalopole étouffante, polluée et surpeuplée. La technologie permet la création de <span className="text-cyan-400 font-semibold">Réplicants</span> — des androïdes biologiques physiologiquement identiques aux humains, mais conçus avec une force physique accrue et une durée de vie limitée à quatre ans. Ces créations de la puissante <span className="text-cyan-400">Tyrell Corporation</span> sont reléguées aux travaux forcés ou militaires dans les violentes colonies d'exploration spatiales.
              </p>
              <p>
                Après une mutinerie sanglante dans une mine spatiale, un commando de quatre réplicants Nexus-6 d'élite, mené par le redoutable et poétique <span className="text-red-400 font-medium">Roy Batty</span>, parvient à s'échapper pour infiltrer clandestinement la Terre. Leur but : trouver leur créateur, le Docteur Eldon Tyrell, pour exiger une extension de leur durée d'existence.
              </p>
              <p>
                <span className="text-cyan-400 font-medium">Rick Deckard</span>, inspecteur retraité blasé et froid du département spécial de la police (les <span className="text-yellow-400">Blade Runners</span>), est rappelé par la force de sa retraite par le commandant Bryant. Sa mission : traquer, identifier (à l'aide de l'appareil de test d'empathie Voight-Kampff) et "retirer" (exécuter) impitoyablement ces évadés.
              </p>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Date de Sortie", value: "25 Juin 1982" },
              { label: "Réalisateur", value: "Ridley Scott" },
              { label: "Compositeur", value: "Vangelis (CS-80)" },
              { label: "Budget", value: "28 Millions USD" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-gray-950/70 border border-cyan-500/10 rounded-lg p-3 text-center animate-pulse-slow">
                <span className="block text-[10px] uppercase font-mono text-gray-500 tracking-wider font-semibold">{stat.label}</span>
                <span className="text-xs font-display font-medium text-cyan-400 block mt-1">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Galerie d'Images Archivées */}
          <div className="bg-gray-900/50 border border-gray-800/80 rounded-xl p-6 backdrop-blur space-y-4">
            <div className="flex items-center space-x-3 border-b border-gray-800 pb-3">
              <Camera className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-display uppercase tracking-wider text-cyan-300">
                Images de Scénographie & d'Archives
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: "Los Angeles 2019",
                  url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
                  desc: "La mégalopole rétro-futuriste étouffée par les brumes acides et illuminée de néons monumentaux."
                },
                {
                  title: "Le Cœur Biométrique",
                  url: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=400",
                  desc: "La pupille humaine capturée par le capteur de Voight-Kampff, révélant les micro-émotions empathiques."
                },
                {
                  title: "Les Larmes dans la Pluie",
                  url: "https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?auto=format&fit=crop&q=80&w=400",
                  desc: "L'apothéose poétique sous la pluie torrentielle de Los Angeles, symbolisant l'éphémère destin des réplicants."
                }
              ].map((img, i) => (
                <div key={i} className="group relative rounded-lg overflow-hidden border border-gray-850 bg-gray-950 flex flex-col justify-between">
                  <div className="h-28 overflow-hidden relative">
                    <img src={img.url} alt={img.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-cyan-400 block font-bold">{img.title}</span>
                    <p className="text-[10px] text-gray-450 leading-snug">{img.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Key Themes */}
        <div className="space-y-6">
          <div className="bg-gray-900/50 border border-gray-800/80 rounded-xl p-6 backdrop-blur space-y-4">
            <div className="flex items-center space-x-3 border-b border-gray-800 pb-3">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h2 className="text-xl font-display uppercase tracking-wider text-purple-300">
                Thématiques d'Ambiance
              </h2>
            </div>
            
            <div className="space-y-5">
              {themes.map((theme, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="p-2 bg-gray-950 rounded-lg border border-gray-800 shrink-0 mt-0.5">
                    {theme.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold font-display text-white tracking-wide">{theme.title}</h3>
                    <p className="text-xs text-gray-400 leading-snug">{theme.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
