import { useState } from "react";
import { motion } from "motion/react";
import { Award, Calendar, ShieldAlert, User, ArrowRight, Heart } from "lucide-react";
import TerminalLoader from "./TerminalLoader";

interface ActorDossier {
  name: string;
  character: string;
  birthDeath: string;
  status: "Actif" | "Retiré" | "Décédé";
  image: string;
  bio: string;
  notableRoles: string[];
  bladeRunnerImpact: string;
}

export default function DevenusView() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");

  const dossiers: ActorDossier[] = [
    {
      name: "Harrison Ford",
      character: "Rick Deckard",
      birthDeath: "Né en 1942 (83 ans)",
      status: "Actif",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      bio: "Harrison Ford a cimenté son statut d'icône absolue du cinéma hollywoodien. Immédiatement après Blade Runner, il a incarné Han Solo et Indiana Jones à de multiples reprises, tout en enchaînant des thrillers cultes comme 'Witness' (nomination à l'Oscar), 'Le Fugitif', et les adaptations de Tom Clancy.",
      notableRoles: ["Dossier Indiana Jones", "Star Wars (Han Solo)", "Le Fugitif", "Witness"],
      bladeRunnerImpact: "35 ans après, il reprend triomphalement le rôle de Rick Deckard dans 'Blade Runner 2049' (2017) sous la direction de Denis Villeneuve, offrant une conclusion mélancolique de haute volée au personnage."
    },
    {
      name: "Rutger Hauer",
      character: "Roy Batty",
      birthDeath: "1944 — 2019 (Décédé à 75 ans)",
      status: "Décédé",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      bio: "Véritable géant du cinéma néerlandais et international, Hauer s'est forgé une filmographie légendaire d'antagonistes charismatiques et de figures poétiques. On se souvient de lui dans 'La Chair et le Sang', 'Ladyhawke', 'Hitcher', ainsi que ses apparitions chez Christopher Nolan (Batman Begins) et Robert Rodriguez (Sin City).",
      notableRoles: ["Hitcher (1986)", "Ladyhawke (1985)", "Batman Begins", "Sin City"],
      bladeRunnerImpact: "Coïncidence mystique gravée dans le marbre de la pop-culture : Rutger Hauer s'est éteint en juillet 2019... l'année même où se déroule l'action du premier film Blade Runner. Il a également fondé la 'Starfish Association' dédiée à la lutte contre le SIDA."
    },
    {
      name: "Sean Young",
      character: "Rachael",
      birthDeath: "Née en 1959 (66 ans)",
      status: "Actif",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
      bio: "Dotée d'un charisme hypnotique, elle enchaîne les premiers rôles dans 'Dune' (1984) de David Lynch, 'Sens Unique' (1987) et la comédie 'Ace Ventura' (1994). Sa carrière a malheureusement été freinée par des conflits médiatisés avec les studios et certains réalisateurs influents.",
      notableRoles: ["Dune (Chani, 1984)", "No Way Out (1987)", "Ace Ventura", "Wall Street"],
      bladeRunnerImpact: "Elle a collaboré virtuellement avec la production de 'Blade Runner 2049' en 2017 : grâce au capture-visuel 3D et une doublure corporelle, son visage d'origine de 1982 a été recréé numériquement pour une réapparition troublante de Rachael."
    },
    {
      name: "Edward James Olmos",
      character: "Gaff",
      birthDeath: "Né en 1947 (79 ans)",
      status: "Actif",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
      bio: "Un ambassadeur historique de la culture hispanique à Hollywood. Après Blade Runner, il triomphe à la télévision dans la série culte 'Deux flics à Miami' (Golden Globe et Emmy Award), est nommé à l'Oscar pour 'Stand and Deliver' (1988), avant d'incarner le légendaire Amiral William Adama dans le chef-d'œuvre de science-fiction 'Battlestar Galactica' (2004-2009).",
      notableRoles: ["Battlestar Galactica (Adama)", "Miami Vice (Castillo)", "Stand and Deliver", "Mayans M.C."],
      bladeRunnerImpact: "Il revient en 2017 le temps d'une scène d'interrogatoire mémorable dans 'Blade Runner 2049', où un Gaff maintenant âgé livre des observations cryptiques à l'officier K sur la trace de Deckard."
    },
    {
      name: "Daryl Hannah",
      character: "Pris Stratton",
      birthDeath: "Née en 1960 (65 ans)",
      status: "Actif",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      bio: "Sa prestation vertigineuse de Pris lui ouvre les portes des plus grands succès des années 80, notamment la sirène de 'Splash' (1984), 'Roxanne', 'Wall Street' et 'Potins de femmes'. Dans les années 2000, Quentin Tarantino orchestre son retour flamboyant en tueuse borgne coriace (Elle Driver) dans les deux volumes de 'Kill Bill'. Plus récemment, elle a marqué la série 'Sense8' des sœurs Wachowski.",
      notableRoles: ["Kill Bill Vol. 1 & 2", "Splash (1984)", "Sense8", "Wall Street (1987)"],
      bladeRunnerImpact: "Daryl Hannah est aujourd'hui une militante écologiste de renommée mondiale, arrêtée à plusieurs reprises lors de manifestations non violentes contre les oléoducs et pour la justice climatique."
    },
    {
      name: "Joanna Cassidy",
      character: "Zhora Salome",
      birthDeath: "Née en 1945 (80 ans)",
      status: "Actif",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400",
      bio: "Une actrice prolifique récompensée par un Golden Globe pour son rôle dans la série satyrique 'Buffalo Bill'. Elle s'illustre brillamment au grand écran dans 'Qui veut la peau de Roger Rabbit' (1988) sous les traits de Dolores, l'amie d'Eddie Valiant. Elle a également marqué le public dans les séries 'Six Feet Under' et 'Body of Proof'.",
      notableRoles: ["Who Framed Roger Rabbit", "Six Feet Under", "Buffalo Bill", "Under Fire"],
      bladeRunnerImpact: "En 2007, lors de la réalisation du 'Final Cut', Joanna Cassidy a enfilé de nouveau son costume légendaire de 1982 pour un ajustement numérique. Elle a tourné sur fond vert pour corriger les visages stunt-double flous lors de la mort fracassante de Zhora à travers les vitrines."
    },
    {
      name: "Brion James",
      character: "Leon Kowalski",
      birthDeath: "1945 — 1999 (Décédé à 54 ans)",
      status: "Décédé",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
      bio: "Visage emblématique des 'méchants' d'Hollywood, Brion James était un acteur de composition extraordinairement prolifique, apparaissant dans plus de 100 films et des dizaines de séries télévisées. On retient ses rôles musclés dans '48 heures', 'Tango & Cash', et en tant que Général Munro dans le classique cyberpunk 'Le Cinquième Élément' (1997) de Luc Besson.",
      notableRoles: ["Le Cinquième Élément (1997)", "48 Hrs. (1982)", "Tango & Cash", "Southern Comfort"],
      bladeRunnerImpact: "Sa mort soudaine d'un infarctus en 1999 à l'âge de 54 ans a privé le cinéma noir d'une de ses plus formidables présences de brute sensible."
    },
    {
      name: "William Sanderson",
      character: "J.F. Sebastian",
      birthDeath: "Né en 1944 (81 ans)",
      status: "Retiré",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400",
      bio: " william Sanderson est un immense acteur de caractère adoré du public télévisuel. Il a marqué l'histoire de la comédie américaine avec son personnage récurrent hilarant de Larry dans la sitcom 'Newhart' pendant 8 ans. Il s'est également illustré avec brio dans des drames sombres, notamment Sheriff Bud Dearborne dans 'True Blood' et le maire névrosé E.B. Farnum dans la sublime série historique de HBO 'Deadwood'.",
      notableRoles: ["Deadwood (HBO)", "Newhart (Larry)", "True Blood", "The Client"],
      bladeRunnerImpact: "Aujourd'hui à la retraite, il a publié son autobiographie fascinante intitulée 'Yes, Lord! (But Not Quite Yet)' racontant en détail ses souvenirs du tournage enfumé de Blade Runner."
    }
  ];

  const filteredDossiers = dossiers.filter(
    (d) => activeTab === "all" || d.status.toLowerCase() === activeTab.toLowerCase()
  );

  if (loading) {
    return (
      <TerminalLoader
        onComplete={() => setLoading(false)}
        targetDataName="RÉTROSPECTIVE DE CARRIÈRE & DOSSIERS ACTEURS"
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
      {/* Header section with HUD aesthetics */}
      <div className="border-b border-cyan-500/10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase">
            Que sont-ils devenus ?
          </h1>
          <p className="text-gray-400 text-xs font-mono mt-1 uppercase">
            Archives du Personnel // LAPD HISTORIC DATA SECTOR // RÉPERTOIRE ACTEURS
          </p>
        </div>

        {/* Filters */}
        <div className="flex bg-gray-950 border border-gray-800 rounded-lg p-1 self-start md:self-center">
          {[
            { id: "all", label: "TOUS" },
            { id: "actif", label: "ACTIFS" },
            { id: "retiré", label: "RETIRÉS" },
            { id: "décédé", label: "DÉCÉDÉS" }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveTab(btn.id)}
              className={`px-3 py-1.5 text-[9px] font-mono rounded font-semibold tracking-wider transition-colors cursor-pointer ${
                activeTab === btn.id
                  ? "bg-cyan-950/80 text-cyan-400 border border-cyan-500/20"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dossier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDossiers.map((actor, idx) => (
          <div
            key={idx}
            className="bg-gray-900/50 border border-gray-800/80 rounded-xl overflow-hidden backdrop-blur flex flex-col justify-between hover:border-cyan-500/20 transition-all duration-300"
          >
            {/* Upper Info Cover */}
            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-start space-x-4">
                {/* Visual Avatar */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-800 shrink-0">
                  <img
                    src={actor.image}
                    alt={actor.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
                  
                  {/* Status Indicator */}
                  <span
                    className={`absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border border-black ${
                      actor.status === "Actif"
                        ? "bg-green-500"
                        : actor.status === "Retiré"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    title={actor.status}
                  />
                </div>

                {/* Actor & Character Title */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-display font-bold text-white leading-tight">
                      {actor.name}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-cyan-400 font-mono">
                    <User className="h-3 w-3" />
                    <span>Rôle : {actor.character}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono block">
                    {actor.birthDeath}
                  </span>
                </div>
              </div>

              {/* Bio & Progression */}
              <p className="text-gray-300 text-xs leading-relaxed text-left">
                {actor.bio}
              </p>

              {/* Notable Works Pills */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-bold block">
                  PROJETS MARQUANTS HORS BLADE RUNNER
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {actor.notableRoles.map((role, rIdx) => (
                    <span
                      key={rIdx}
                      className="bg-gray-950/80 border border-gray-800 px-2 py-0.5 rounded text-[10px] text-gray-400 font-mono"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Section: Blade Runner Legacy Connection */}
            <div className="bg-gray-950/60 border-t border-gray-900 px-6 md:px-8 py-4 space-y-1">
              <div className="flex items-center space-x-2 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Impact & Rétrospective Franchise</span>
              </div>
              <p className="text-gray-450 text-[11px] leading-relaxed italic text-left">
                {actor.bladeRunnerImpact}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
