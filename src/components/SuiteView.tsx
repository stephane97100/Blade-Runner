import { useState } from "react";
import { motion } from "motion/react";
import { Film, BookOpen, Gamepad, Tv, BookCopy, Sparkles, MapPin, ChevronRight, Calendar } from "lucide-react";
import TerminalLoader from "./TerminalLoader";

interface MediaItem {
  id: string;
  title: string;
  type: "cinema" | "series" | "roman" | "comics" | "jeu";
  year: string;
  creator: string;
  description: string;
  lorePlacement: string;
  image: string;
  details?: string;
}

export default function SuiteView() {
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all");

  const mediaList: MediaItem[] = [
    {
      id: "br2049",
      title: "Blade Runner 2049",
      type: "cinema",
      year: "2017",
      creator: "Denis Villeneuve",
      description: "Trente ans après les événements du premier film, un nouveau blade runner, l'officier K (Ryan Gosling) du LAPD, découvre un secret enfoui depuis longtemps qui menace de plonger ce qui reste de la société dans le chaos. Cette découverte le conduit à traquer Rick Deckard (Harrison Ford), disparu depuis trois décennies.",
      lorePlacement: "Se déroule en l'an 2049, soit 30 ans après le chef-d'œuvre de 1982. Élucide de manière magistrale le destin de Rachael et le mystère de la descendance des réplicants.",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
      details: "Production majestueuse récompensée par 2 Oscars (Meilleure photographie pour Roger Deakins et Meilleurs effets visuels). Un prodige visuel salué unanimement."
    },
    {
      id: "blackout",
      title: "Blade Runner Black Out 2022 (Court-métrage)",
      type: "cinema",
      year: "2017",
      creator: "Shinichiro Watanabe (Réalisateur de Cowboy Bebop)",
      description: "Magnifique court-métrage d'animation japonais de 15 minutes retraçant les événements destructeurs du 'Grand Black Out' de 2022. Des réplicants rebelles organisent une explosion électromagnétique géante au-dessus de Los Angeles, détruisant toutes les bases de données et coupant l'électricité de la côte ouest.",
      lorePlacement: "Se situe en 2022. Explique pourquoi les archives électroniques du LAPD sont introuvables et pourquoi la Tyrell Corp a fait faillite suite à la prohibition absolue des réplicants.",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=600",
      details: "Bande-son formidable par Flying Lotus. Animation traditionnelle fusionnée avec de la CGI atmosphérique noire."
    },
    {
      id: "prequelshorts",
      title: "2036: Nexus Dawn & 2048: Nowhere to Run",
      type: "cinema",
      year: "2017",
      creator: "Luke Scott",
      description: "Deux courts-métrages officiels sous forme de prélude. Le premier dévoile Niander Wallace (Jared Leto) introduisant son nouveau modèle Nexus-9 parfaitement obéissant devant les législateurs en 2036. Le second suit Sapper Morton (Dave Bautista), un réplicant réfugié, tentant de protéger des humains avant d'être repéré par la police.",
      lorePlacement: "Se déroulent en 2036 et 2048. Ponts indispensables pavant la route vers l'ouverture du film Blade Runner 2049.",
      image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "jeter2",
      title: "Blade Runner 2: L'horizon de l'humain",
      type: "roman",
      year: "1995",
      creator: "K.W. Jeter (Ami intime de Philip K. Dick)",
      description: "L'une des premières suites officielles écrites en accord avec les ayants droit. Deckard vit reclus en Oregon avec Rachael, conservée dans une caisse cryogénique pour prolonger son existence. Sarah Tyrell, l'héritière de l'empire Tyrell, le recrute pour traquer un 'sixième réplicant' mystérieux.",
      lorePlacement: "Se déroule directement après le film. Corrige et réconcilie de nombreux détails contradictoires issus du roman de Dick et du film de Scott.",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
      details: "Écrit par le pionnier littéraire qui a popularisé le terme de genre 'Steampunk'. Une intrigue sombre d'une grande fidélité paranoïaque."
    },
    {
      id: "jeter3",
      title: "Blade Runner 3: Replicant Night & 4: Eye and Talon",
      type: "roman",
      year: "1996 — 2000",
      creator: "K.W. Jeter",
      description: "Dans le troisième opus, Deckard quitte la Terre à bord d'un cargo pour tenter d'échapper au cartel des réplicateurs et de comprendre l'origine profonde de ses implants de mémoire. Le quatrième livre bascule sur le personnage de Iris, une blade runner féminine spécialisée dans la récupération d'yeux biométriques volés.",
      lorePlacement: "Pousse l'univers étendu vers l'espace profond et les colonies spatiales ('Off-World colonies'), riches en environnements corporatifs glauques.",
      image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "blacklotus",
      title: "Blade Runner: Black Lotus (Série d'animation)",
      type: "series",
      year: "2021",
      creator: "Shinji Aramaki & Kenji Kamiyama",
      description: "Une série d'animation CGI composée de 13 épisodes se déroulant à Los Angeles. On y suit Elle, une jeune réplicante d'abord amnésique qui se réveille dotée de capacités de combat meurtrières incroyables. Munie d'un tatouage de lotus noir, elle traque les hommes d'affaires responsables d'une chasse à l'homme barbare.",
      lorePlacement: "Se situe en l'an 2032. Comprend des apparitions de personnages canoniques, notamment Doc Badger et les dirigeants de la Wallace Corporation.",
      image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=600",
      details: "Produit par Alcon Television Group et diffusé sur Adult Swim / Crunchyroll. Prolonge le lore transmédia officiel."
    },
    {
      id: "br2099",
      title: "Blade Runner 2099",
      type: "series",
      year: "Prochainement (En production)",
      creator: "Ridley Scott (Producteur) & Silka Luisa (Showrunneuse)",
      description: "Une série télévisée live-action à gros budget actuellement en cours de tournage pour Amazon Prime Video. Elle mettra en vedette l'actrice oscarisée Michelle Yeoh et Hunter Schafer dans une mégalopole futuriste à la veille d'un bouleversement technologique sans précédent.",
      lorePlacement: "Se déroulera en 2099, cinquante ans après les événements narrés dans Blade Runner 2049, explorant de toutes nouvelles barrières d'éthique transhumaniste.",
      image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "westwood1997",
      title: "Blade Runner: Le Jeu Vidéo (Westwood)",
      type: "jeu",
      year: "1997",
      creator: "Westwood Studios",
      description: "Le chef-d'œuvre absolu de l'aventure point-and-click. Une adaptation hautement respectueuse qui raconte l'histoire parallèle de Ray McCoy, flic d'élite du LAPD, confronté à un complot de falsification de tests Voight-Kampff et à des réplicants suspects d'abattage infanticide criminel d'animaux.",
      lorePlacement: "Coexiste parallèlement au film original de 1982. On y explore l'appartement de Sebastian, le marché d'animaux artificiels, et les bureaux de Tyrell.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600",
      details: "Innovations spectaculaires : premier jeu sans accélération 3D obligatoire simulant l'histoire en temps réel avec des fins générées selon des identités d'humain/réplicant attribuées aléatoirement à chaque nouvelle partie."
    },
    {
      id: "labyrinth2033",
      title: "Blade Runner 2033: Labyrinth (Jeu d'aventure)",
      type: "jeu",
      year: "Prochainement",
      creator: "Annapurna Interactive",
      description: "Le tout premier jeu vidéo de la franchise officielle à voir le jour en 25 ans. Développé en interne par Annapurna, ce jeu d'aventure narrative explore le travail d'un Blade Runner fatigué contraint de retourner au LAPD après le grand Black Out de 2022 pour une affaire touchant aux archives perdues.",
      lorePlacement: "Se situe en 2033, pile au cœur de la période de reconstruction entre le Black Out et la montée en puissance de l'empire de Wallace.",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "comicsTitan",
      title: "Les Bandes Dessinées Titan Comics",
      type: "comics",
      year: "2019 — 2022",
      creator: "Michael Green & Andres Guinaldo",
      description: "Une vaste et somptueuse série de comics canoniques acclamés par les lecteurs. Les intrigues principales incluent 'Blade Runner 2019' (qui suit Aahna 'Ash' Ashina, l'une des toutes premières blade runners féminines de l'histoire du LAPD), 'Blade Runner 2029' (poursuivant sa lutte contre la résistance réplicante) et 'Blade Runner Origins' (qui détaille l'enquête qui mena à la création même de la section d'élite de répression de la police).",
      lorePlacement: "Séries de bandes dessinées pleinement validées par Alcon Entertainment, enrichissant considérablement la mythologie de l'univers étendu.",
      image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=600"
    }
  ];

  const categories = [
    { id: "all", label: "TOUS LES SUPPORTS", icon: <Sparkles className="h-4 w-4" /> },
    { id: "cinema", label: "CINÉMA / COURTS", icon: <Film className="h-4 w-4" /> },
    { id: "series", label: "SÉRIES TV", icon: <Tv className="h-4 w-4" /> },
    { id: "roman", label: "ROMANS / SUITES", icon: <BookOpen className="h-4 w-4" /> },
    { id: "comics", label: "COMICS & BD", icon: <BookCopy className="h-4 w-4" /> },
    { id: "jeu", label: "JEUX VIDÉO", icon: <Gamepad className="h-4 w-4" /> }
  ];

  const filteredItems = mediaList.filter(
    (item) => selectedType === "all" || item.type === selectedType
  );

  if (loading) {
    return (
      <TerminalLoader
        onComplete={() => setLoading(false)}
        targetDataName="CHRONOLOGIE DE L'UNIVERS ÉTENDU & MULTIMÉDIA DE BLADE RUNNER"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Visual Timeline Hero Banner */}
      <div 
        className="relative h-[200px] rounded-xl overflow-hidden border border-amber-500/25 shadow-[0_0_15px_rgba(245,158,11,0.08)] flex items-end p-6 md:p-8 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent"></div>
        <div className="absolute top-4 right-4 bg-amber-950/90 border border-amber-500/40 text-amber-400 text-[10px] px-3 py-1 font-mono rounded uppercase tracking-widest">
          LAPD CORE FILE: EXPANDED LORE
        </div>
        <div className="relative z-10 space-y-1">
          <h1 className="text-xl md:text-3xl font-display font-black tracking-widest text-white uppercase">
            La Suite : L'univers Étendu
          </h1>
          <p className="text-gray-300 max-w-2xl text-xs md:text-sm leading-relaxed text-left">
            D'œuvres cinématographiques en séries d'animation, en passant par des jeux rétro révolutionnaires ou des romans d'anticipation, découvrez l'épopée cyberpunk au-delà de 1982.
          </p>
        </div>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap gap-2 border-b border-gray-900 pb-4">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedType(c.id)}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-display uppercase tracking-wider font-semibold rounded-lg border transition-all cursor-pointer ${
              selectedType === c.id
                ? "bg-amber-950/30 border-amber-500/30 text-amber-300 shadow-[inset_0_0_10px_rgba(245,158,11,0.05)]"
                : "border-transparent text-gray-400 hover:text-white hover:bg-gray-900/30 hover:border-gray-800"
            }`}
          >
            <span className={`${selectedType === c.id ? "text-amber-400" : "text-gray-500"} transition-colors`}>
              {c.icon}
            </span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* List items representation */}
      <div className="space-y-6">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className="group bg-gray-900/40 border border-gray-850 rounded-xl overflow-hidden backdrop-blur hover:border-amber-500/15 transition-all duration-300 grid grid-cols-1 md:grid-cols-12"
          >
            {/* Visual media card preview */}
            <div className="md:col-span-4 relative h-48 md:h-full min-h-[160px] overflow-hidden bg-gray-950">
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0 filter saturate-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-gray-950/90 via-transparent to-transparent"></div>
              
              {/* Type tag floating badge */}
              <div className="absolute top-3 left-3 bg-black/80 border border-gray-800 text-[10px] uppercase font-mono px-2 py-0.5 rounded tracking-widest text-amber-400 font-bold">
                {item.type}
              </div>
            </div>

            {/* Core textual info */}
            <div className="md:col-span-8 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h3 className="text-lg font-display font-bold text-white tracking-wide uppercase">
                    {item.title}
                  </h3>
                  <div className="flex items-center space-x-1 text-gray-500 font-mono text-[10px]">
                    <Calendar className="h-3 w-3" />
                    <span>{item.year} • {item.creator}</span>
                  </div>
                </div>

                <p className="text-gray-300 text-xs leading-relaxed text-left">
                  {item.description}
                </p>
              </div>

              {/* Bottom detail boxes */}
              <div className="space-y-2 pt-2 border-t border-gray-950 flex flex-col justify-start">
                <div className="flex items-start space-x-2 text-[11px] text-amber-400/90 leading-tight">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500/80" />
                  <span className="text-left font-sans">
                    <strong className="font-mono text-[9px] uppercase tracking-wider block text-gray-500">Placement Canonique & Lore :</strong>
                    {item.lorePlacement}
                  </span>
                </div>

                {item.details && (
                  <div className="flex items-start space-x-2 text-[10.5px] text-gray-400 bg-gray-950/50 p-2.5 rounded border border-gray-900/85">
                    <ChevronRight className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-left leading-normal font-mono text-[9.5px]">
                      {item.details}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
