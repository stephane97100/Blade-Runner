import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, History, Shield, Play, Flame, HelpCircle, Gamepad2, ChevronRight, Layers, Radio, ExternalLink, GitBranch, Compass, Users } from "lucide-react";
import TerminalLoader from "./TerminalLoader";

type ActiveSubMenu = "historique" | "developpement" | "univers" | "fins" | "meilleur" | "devenir" | "steam";

interface SubMenuConfig {
  id: ActiveSubMenu;
  title: string;
  shortLabel: string;
  icon: any;
}

export default function WestwoodView() {
  const [loading, setLoading] = useState(true);
  const [activeSub, setActiveSub] = useState<ActiveSubMenu>("historique");

  const subMenus: SubMenuConfig[] = [
    {
      id: "historique",
      title: "L'Historique du Projet (1995 - 1997)",
      shortLabel: "Historique du projet",
      icon: History
    },
    {
      id: "developpement",
      title: "Le Développement & Prouesses de l'Époque",
      shortLabel: "Développement du jeu",
      icon: Layers
    },
    {
      id: "univers",
      title: "L'Univers de l'Aventure de Ray McCoy",
      shortLabel: "L'univers du jeu",
      icon: Gamepad2
    },
    {
      id: "fins",
      title: "Les Fins Alternatives Révolutionnaires",
      shortLabel: "Les Fins Alternatives",
      icon: GitBranch
    },
    {
      id: "meilleur",
      title: "Pourquoi il a régné comme Meilleur Jeu de l'Année",
      shortLabel: "Pourquoi classé meilleur ?",
      icon: Trophy
    },
    {
      id: "devenir",
      title: "Le Destin d'un Géant : Qu'est devenu Westwood ?",
      shortLabel: "Qu'est devenu Westwood ?",
      icon: Flame
    },
    {
      id: "steam",
      title: "La Version Moderne sur Steam & GOG",
      shortLabel: "La version sur Steam",
      icon: ExternalLink
    }
  ];

  // Sound signal frequency
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

  const handleSubChange = (id: ActiveSubMenu) => {
    playBeep(490);
    setActiveSub(id);
  };

  // Content render function based on active selection
  const renderSubMenuContent = () => {
    switch (activeSub) {
      case "historique":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-display font-black text-white uppercase tracking-wider">
                UNE ACQUISITION STRATÉGIQUE EN 1995
              </h2>
              <p className="text-xs text-cyan-200/90 leading-relaxed font-sans">
                Début 1995, Westwood Studios acquiert les droits exclusifs d'adaptation vidéoludique du chef-d'œuvre de Ridley Scott. Le défi est immense : comment reproduire l'atmosphère humide, poisseuse et néo-noir d'un film devenu culte sans pour autant trahir ou répéter de manière mécanique le parcours de Rick Deckard ?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
              <div className="p-4 bg-gray-900/30 border border-gray-900 rounded-xl space-y-2 text-left">
                <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase block">L'OBSTACLE ACQUISITIONNEL</span>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  Le studio n'a pas pu garantir l'usage de la voix de Harrison Ford, ni les décors originaux de la Warner de manière directe. Ils ont donc pris le pari révolutionnaire d'inventer une <strong>histoire parallèle et synchronisée</strong> aux événements de Rick Deckard.
                </p>
              </div>

              <div className="p-4 bg-gray-900/30 border border-gray-900 rounded-xl space-y-2 text-left">
                <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase block">LE SCÉNARIO DES ENQUÊTES</span>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  Pendant que Deckard traque le groupe de Roy Batty, le joueur incarne au même moment et sous le même ciel de goudron l'inspecteur Ray McCoy, un Blade Runner débutant affecté à une affaire de crime haineux contre des animaux chez Runciter's.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-gray-900">
              <span className="text-[9px] font-mono text-gray-500 uppercase block font-bold">L'APPROCHE DE RECHERCHE NARRATIVE</span>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                La collaboration avec le scénariste David Leary a permis d'intégrer des éléments profonds issus du roman de Philip K. Dick (<em>Do Androids Dream of Electric Sheep?</em>), comme l'importance viscérale des animaux artificiels ou le culte de l'empathie, consolidant une écriture dense et dramatique aux antipodes des jeux d'action habituels de l'époque.
              </p>
            </div>
          </div>
        );

      case "developpement":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-display font-black text-white uppercase tracking-wider">
                LA PROUESSE TECHNOLOGIQUE SANS ACCÉLÉRATEUR 3D
              </h2>
              <p className="text-xs text-cyan-200/90 leading-relaxed font-sans">
                En 1997, la plupart des jeux tentent maladroitement de transiter vers la 3D à l'aide des premières cartes d'accélération 3dfx Glide. Westwood refuse cette contrainte qui aurait limité le nombre de joueurs et opte pour un rendu hybride avant-gardiste : des **fonds précalculés en 2D somptueuses** couplés à des **personnages en Voxels animés en 3D volumétrique**.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-900/40 border border-cyan-500/10 rounded-xl flex items-start gap-3.5 text-left">
                <div className="p-2 bg-cyan-950/50 border border-cyan-500/20 text-cyan-400 rounded-lg shrink-0">
                  <span className="text-xs font-mono font-bold">1/4</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold text-white uppercase">LE CHOIX DU VOXEL EN 3D</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                    Le Voxel (Volume Pixel) permet de générer des modèles en 3D réels sans exiger de carte graphique haut de gamme. Les personnages bénéficient de superbes ombrages lissés en temps réel qui se fondent à merveille sous les rideaux de pluie des décors.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-900/40 border border-cyan-500/10 rounded-xl flex items-start gap-3.5 text-left">
                <div className="p-2 bg-cyan-950/50 border border-cyan-500/20 text-cyan-400 rounded-lg shrink-0">
                  <span className="text-xs font-mono font-bold">2/4</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold text-white uppercase">INTELLIGENCE SANS CHEMIN TRACÉ (PATH ROUTINES)</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                    Les PNJ du jeu ne vous attendent pas sagement au coin d'une ruelle. Chacun possède son propre calendrier journalier et se déplace continuellement dans Los Angeles en temps réel pour négocier, manger ou saboter, changeant drastiquement les indices trouvés par McCoy selon l'heure de sa venue.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-900/40 border border-cyan-500/10 rounded-xl flex items-start gap-3.5 text-left">
                <div className="p-2 bg-cyan-950/50 border border-cyan-500/20 text-cyan-400 rounded-lg shrink-0">
                  <span className="text-xs font-mono font-bold">3/4</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold text-white uppercase">LE COMPLIQUÉ SYSTÈME VOIGHT-KAMPFF ET L'ESPER ASSISTANT</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                    Le studio a programmé une machine Voight-Kampff entièrement fonctionnelle en jeu pour mesurer les dilatations capillaires des suspects, ainsi qu'une console ESPER reconstituant en photo 3D des angles morts d'enquêtes criminelles.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-900/40 border border-cyan-500/10 rounded-xl flex items-start gap-3.5 text-left">
                <div className="p-2 bg-cyan-950/50 border border-cyan-500/20 text-cyan-400 rounded-lg shrink-0">
                  <span className="text-xs font-mono font-bold">4/4</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold text-white uppercase">RECRÉATION AUDIO ET TOURNAGE GIGANTESQUE (4 CD-ROM)</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                    Face au refus d'obtention des bandes originales de Vangelis, Westwood a recréé chaque note du synthétiseur à l'oreille. Ils ont également numérisé des dizaines de décors hollywoodiens et engagé les acteurs d'origine du film (dont Sean Young, James Hong et Joe Turkel) pour doubler plus de 20 000 lignes de dialogues stockées sur un volume titanesque de 4 CD-ROMs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "univers":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-display font-black text-white uppercase tracking-wider">
                RAY MCCOY PRIS EN ÉTAU
              </h2>
              <p className="text-xs text-cyan-200/90 leading-relaxed font-sans">
                Le jeu introduit des protagonistes originaux mémorables, dont le parcours va s'entrecroiser de manière tragique sur les toits humides ou les égouts radioactifs de Los Angeles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
              <div className="p-4 bg-gray-950 border border-gray-900 rounded-xl space-y-1 text-left">
                <span className="text-[10px] font-display text-white font-bold uppercase block">RAY MCCOY</span>
                <span className="text-[8.5px] font-mono text-cyan-400 uppercase block mb-2">Blade Runner Débutant</span>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  McCoy adore les animaux et possède un chien de berger nommé Maggie. Affecté au massacre chez Runciter, il sombre dans un complot d'envergure mené par des réplicants fuyant vers le paradis et l'armée.
                </p>
              </div>

              <div className="p-4 bg-gray-950 border border-gray-900 rounded-xl space-y-1 text-left">
                <span className="text-[10px] font-display text-white font-bold uppercase block">CRYSTAL STEELE</span>
                <span className="text-[8.5px] font-mono text-red-400 uppercase block mb-2">Exterminatrice Impitoyable</span>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  Une spécialiste chevronnée. Impitoyable envers les androïdes, elle applique la consigne de retrait instantané sans le moindre remords, servant d'antagoniste philosophique principal à l'introspection de McCoy.
                </p>
              </div>

              <div className="p-4 bg-gray-950 border border-gray-900 rounded-xl space-y-1 text-left">
                <span className="text-[10px] font-display text-white font-bold uppercase block">LUCY HARI</span>
                <span className="text-[8.5px] font-mono text-xs text-purple-450 uppercase block mb-2">La Fille Perdue</span>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  Une jeune adolescente âgée de 14 ans travaillant chez Runciter. C'est la première suspectée d'être une réplicante clandestine Nexus-6. Le joueur doit décider de l'abattre de sang froid, ou de l'épargner.
                </p>
              </div>
            </div>

            <div className="p-4 bg-cyan-950/10 border border-cyan-500/15 rounded-xl text-left space-y-1.5">
              <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase block">LE SPECTRE DE LA NATURE DE MCCOY</span>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Tout comme Rick Deckard dans le film original, McCoy se trouve confronté à des doutes croissants sur sa propre nature biologique durant sa fuite. Est-il un humain souffrant d'empathie toxique, ou bien un réplicant doté de mémoires implantées ?
              </p>
            </div>
          </div>
        );

      case "fins":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-cyan-400">
                <GitBranch className="h-5 w-5" />
                <h2 className="text-lg font-display font-black text-white uppercase tracking-wider">
                  GÉNÉRATEUR DE RAMIFICATIONS NARRATIVES PRÉCURSEUR
                </h2>
              </div>
              <p className="text-xs text-cyan-200/90 leading-relaxed font-sans">
                En 1997, la majorité des jeux vidéo proposent un cheminement linéaire menant à un unique dénouement ou à des variations basées sur un ultime choix binaire. Westwood Studios pulvérise ces limites en intégrant une architecture de **filiation adaptative continue** en temps réel. Le jeu compile discrètement de multiples paramètres pour déterminer l'un des **13 embranchements de fins complexes**.
              </p>
            </div>

            {/* Explanatory notice about early generation coding */}
            <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/10 rounded-xl space-y-1.5 text-left text-gray-400">
              <span className="text-[8.5px] font-mono text-cyan-400 font-bold uppercase tracking-widest block">L'ALGORITHME ALÉATOIRE D'IDENTITÉ</span>
              <p className="text-[11px] font-sans leading-normal">
                À l'initialisation de chaque nouvelle partie, l'ordinateur décide aléatoirement si McCoy, Dektora, Lucy ou Gordo sont des humains biologiques ou des réplicants de l'ombre. Cette attribution invisible modifie la physionopie globale de votre enquête et dicte quel personnage sera enclin à collaborer ou à vous trahir.
              </p>
            </div>

            {/* Comprehensive guide of alternate endings: Spinner flights vs Solo */}
            <div className="space-y-4">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block font-bold">
                GUIDE DES DESTINÉES : LES EMBARQUEMENTS EN SPINNER
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Ending 1: Flight with Dektora */}
                <div className="bg-gray-900/30 border border-gray-950 hover:border-emerald-500/20 rounded-xl p-4 space-y-3 transition-colors text-left">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                      FUITE MULTIPLE
                    </span>
                    <span className="text-[8px] font-mono text-gray-500">BRANCH #1</span>
                  </div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-cyan-400" />
                    FUITE AVEC DEKTORA
                  </h4>
                  <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                    Si Dektora est désignée comme réplicante et survit à vos rencontres, McCoy peut l'aider à déjouer la traque. Ensemble, ils s'introduisent sur le toit, grimpent dans le Spinner de McCoy et percent la chape de smog et de pluie d'un Los Angeles incandescent, fuyant vers une vie clandestine sur Terre ou au sein des Colonies de l'Espace.
                  </p>
                  <div className="pt-2 border-t border-gray-900/60 flex items-center justify-between text-[7.5px] font-mono text-gray-500">
                    <span>REQUIS: ALIGNEMENT PRO-REPLICANT</span>
                    <span className="text-emerald-400 font-bold">STATUT ACCUEILLANT</span>
                  </div>
                </div>

                {/* Ending 2: Flight with Lucy Hari */}
                <div className="bg-gray-900/30 border border-gray-950 hover:border-purple-500/25 rounded-xl p-4 space-y-3 transition-colors text-left">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-purple-400 font-bold bg-purple-950/40 border border-purple-500/20 px-2 py-0.5 rounded uppercase">
                      FUITE MULTIPLE
                    </span>
                    <span className="text-[8px] font-mono text-gray-500">BRANCH #2</span>
                  </div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-cyan-400" />
                    FUITE AVEC LUCY HARI
                  </h4>
                  <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                    Si Dektora est morte ou s'avère humaine, mais que Lucy Hari (identifiée réplicante) est protégée par vos soins, elle remplace Dektora sur le tarmac. McCoy l'arrache des griffes de ses ravisseurs et de la folie meurtrière de Crystal Steele. Ils quittent la mégapole à bord du Spinner pour protéger cette dernière survivante de la série Nexus-6.
                  </p>
                  <div className="pt-2 border-t border-gray-900/60 flex items-center justify-between text-[7.5px] font-mono text-gray-500">
                    <span>REQUIS: PRO-REPLICANT & LUCY EN VIE</span>
                    <span className="text-purple-400 font-bold">STATUT EMPATHIQUE</span>
                  </div>
                </div>

                {/* Ending 3: Flight Alone */}
                <div className="bg-gray-900/30 border border-gray-950 hover:border-amber-500/20 rounded-xl p-4 space-y-3 transition-colors text-left">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-amber-400 font-bold bg-amber-950/40 border border-amber-500/20 px-4 py-0.5 rounded uppercase">
                      FUITE SOLITAIRE
                    </span>
                    <span className="text-[8px] font-mono text-gray-500">BRANCH #3</span>
                  </div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5 text-amber-450" />
                    L'ENVOL SOLITAIRE (L'EXIL)
                  </h4>
                  <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                    Si vous refusez de vous allier aux rebelles de Clovis, mais rejetez tout autant la corruption mortelle de Guzza et la brutalité policière de la LAPD, McCoy abandonne sa insigne de flic. Il monte **totalement seul** à bord du Spinner pour se fondre à jamais dans les nuées toxiques, condamné à errer comme un vagabond paria traqué de toutes parts.
                  </p>
                  <div className="pt-2 border-t border-gray-900/60 flex items-center justify-between text-[7.5px] font-mono text-gray-500">
                    <span>REQUIS: ALIGNEMENT NEUTRE</span>
                    <span className="text-amber-500 font-bold">STATUT PARIA</span>
                  </div>
                </div>

                {/* Ending 4: LAPD Loyalty (No spinner flight) */}
                <div className="bg-gray-900/30 border border-gray-950 hover:border-cyan-500/20 rounded-xl p-4 space-y-3 transition-colors text-left">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded uppercase">
                      LOYAUTÉ POLICIÈRE
                    </span>
                    <span className="text-[8px] font-mono text-gray-500">BRANCH #4</span>
                  </div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-cyan-400" />
                    L'OBÉISSANCE FROIDE DE LA LAPD
                  </h4>
                  <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                    Ray McCoy décide d'accomplir son devoir jusqu'au bout. Il élimine tous les réplicants fugitifs (Clovis, Sadik, Dektora, Lucy) sans hésiter. Il n'y a pas de Spinner de fuite ici ; McCoy se tient sur un toit humide, félicité par son escouade, ravalant ses sentiments humains de compassion pour demeurer un flic exemplaire.
                  </p>
                  <div className="pt-2 border-t border-gray-900/60 flex items-center justify-between text-[7.5px] font-mono text-gray-500">
                    <span>REQUIS: TÊT DE RETRAIT SYSTÉMATIQUE</span>
                    <span className="text-cyan-400 font-bold">STATUT HUMAIN</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Interactive design detail of ending mechanics */}
            <div className="p-4 bg-purple-950/10 border border-purple-500/15 rounded-xl text-left space-y-2">
              <span className="text-[9px] font-mono text-purple-400 font-bold uppercase block">LA MORT TRAGIQUE DU SPINNER</span>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Certains embranchements cruels se concluent tragiquement sur le tarmac de décollage de la Tyrell Corporation : l'agent hostile Crystal Steele et McCoy s'affrontent mutuellement dans un duel à mort. Si Guzza a trahi tout le monde, le Spinner se transforme en piège de fer brisé sous les larmes de pluie de la métropole.
              </p>
            </div>
          </div>
        );

      case "meilleur":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-display font-black text-white uppercase tracking-wider">
                POURQUOI IL A TRÔNÉ PENDANT PLUSIEURS MOIS
              </h2>
              <p className="text-xs text-cyan-200/90 leading-relaxed font-sans">
                Lors de sa sortie en Novembre 1997, le jeu reçoit un accueil critique et commercial triomphal. Il s'adjuge d'emblée la place de **meilleur jeu vidéo d'aventure de l'année**, conservant la première place des charts durant des mois.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-[10px] shrink-0 mt-0.5 font-bold">✓</div>
                  <div className="space-y-1 text-left">
                    <h5 className="text-xs font-mono font-bold text-white uppercase">REJOUABILITÉ INCALCULABLE (ALGORITHME D'IDENTITÉ)</h5>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                      À chaque lancement de partie, l'ordinateur détermine aléatoirement qui est humain et qui est réplicant parmi une dizaine de personnages majeurs. Vos actions façonnent la conscience des suspects et votre parcours de façon unique.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-[10px] shrink-0 mt-0.5 font-bold">✓</div>
                  <div className="space-y-1 text-left">
                    <h5 className="text-xs font-mono font-bold text-white uppercase">TREIZE FINS MULTIPLES ET RAMIFIÉES</h5>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                      De l'extermination froide de tous les réplicants à la fuite clandestine hors de la terre à leurs côtés, ou même sombrer abattu comme un paria par la police, le jeu ne comportait aucun bouton "facile" de moralité.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-900/30 border border-purple-500/20 rounded-xl space-y-3 flex flex-col justify-between text-left">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-purple-400">
                    <Trophy className="h-4 w-4 animate-bounce" />
                    <span className="text-[10px] font-mono font-bold uppercase">RECONNAISSANCE DE L'INDUSTRIE</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                    Le jeu gagne le prestigieux prix de <strong>Meilleur Jeu d'Aventure de l'Année 1997</strong> lors des AIAS Interactive Achievement Awards (aujourd'hui connus sous le nom de D.I.C.E. Awards). Il surpasse largement les grosses superproductions de l'époque.
                  </p>
                </div>
                <span className="text-[8.5px] font-mono text-gray-650 uppercase">RATING : 93% PC GAMER // 9/10 TILT</span>
              </div>
            </div>
          </div>
        );

      case "devenir":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-display font-black text-white uppercase tracking-wider">
                LE DÉCLIN DE WESTWOOD ET L'ASSIMILATION PAR EA
              </h2>
              <p className="text-xs text-cyan-200/90 leading-relaxed font-sans">
                Westwood Studios, alors à l'apogée de sa gloire après les sorties de Command & Conquer et Blade Runner, s'est retrouvé au cœur d'intenses batailles financières.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                En août 1998, Westwood Studios est racheté par Electronic Arts pour la somme astronomique de 122,5 millions de dollars. Rapidement, des tensions apparaissent concernant les impératifs de rentabilité et le rythme de production imposé par le mastodonte de l'édition.
              </p>

              <div className="p-4 bg-red-950/15 border border-red-500/10 rounded-xl text-left space-y-2">
                <div className="flex items-center space-x-2 text-red-400">
                  <Shield className="h-4 w-4" />
                  <span className="text-[9px] font-mono font-bold uppercase">FERMETURE DIRECTE (2003)</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  Suite au succès mitigé de leurs jeux multijoueurs ultérieurs (Earth & Beyond) et à de profonds désaccords managériaux, Electronic Arts annonce la fermeture définitive des studios Westwood de Las Vegas en Mars 2003. Une partie importante des développeurs quitte à jamais la structure pour fonder Petroglyph Games.
                </p>
              </div>
            </div>
          </div>
        );

      case "steam":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-display font-black text-white uppercase tracking-wider">
                RECONGRESS MODERNISÉ SUR LES PLATEFORMES DIRECTES
              </h2>
              <p className="text-xs text-cyan-200/90 leading-relaxed font-sans">
                La version originelle du jeu s'était perdue à jamais car son code source d'origine avait été égaré lors du déménagement des bureaux vers Los Angeles. Pendant près de 15 ans, il était impossible d'y jouer sur des plateformes modernes.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="p-4 bg-gray-950 border border-gray-900 rounded-xl space-y-3 text-left">
                <h4 className="text-xs font-mono font-bold text-white uppercase">BLADE RUNNER : ENHANCED EDITION (STEAM & GOG)</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  Grâce aux efforts titaniques d'ingénierie inverse menés par l'équipe de ScummVM, les fans de la communauté ont réussi à reconstruire l'ensemble du moteur voxel. Nightdive Studios a par la suite officiellement lancé l'Enhanced Edition sur Steam, réintégrant des cinématiques lissées et le support complet de la manette pour Xbox et PlayStation.
                </p>

                <div className="pt-3 border-t border-gray-900/60 flex items-center justify-between">
                  <span className="text-[8px] font-mono text-gray-600 uppercase">STORE REF: STEAM_APP_1678420</span>
                  <a
                    href="https://store.steampowered.com/app/1678420/Blade_Runner_Enhanced_Edition/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 px-2.5 py-1 bg-gray-900 border border-gray-800 hover:border-cyan-500/30 rounded text-[9.5px] font-mono text-cyan-400 font-bold uppercase tracking-wider transition-colors"
                  >
                    <span>Page Steam</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <TerminalLoader
        onComplete={() => setLoading(false)}
        targetDataName="SECTION_RECONSTITUTION : HISTOIRE ET ANALYSE DU JEU WESTWOOD COLOURED 1997"
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
      {/* Header section metadata banner */}
      <div className="border-b border-gray-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-1 px-2.5 bg-cyan-950/40 border border-cyan-500/30 rounded text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest animate-pulse">
            ARCHIVES JEUX VIDÉO : 1997
          </div>
          <h1 className="text-xl md:text-2xl font-display font-black tracking-widest text-white uppercase flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-cyan-400" />
            LE JEU WESTWOOD
          </h1>
        </div>
        <p className="text-xs text-gray-400 font-mono leading-relaxed mt-1 uppercase">
          Espace de documentation rétro-consacré à l'histoire et à la conception du chef-d'œuvre de Westwood Studios
        </p>
      </div>

      {/* Main split grid submenu section layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Submenu Sidebar lists */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase block mb-1">
            UNITÉS DE RECHERCHE :
          </span>

          <nav className="space-y-2">
            {subMenus.map((item) => {
              const active = item.id === activeSub;
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSubChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 border text-left rounded-xl transition-all relative overflow-hidden group cursor-pointer ${
                    active
                      ? "bg-cyan-950/30 border-cyan-500/30 text-white shadow-[0_0_12px_rgba(6,182,212,0.04)]"
                      : "bg-gray-950 border-gray-900/40 text-gray-400 hover:text-white hover:border-gray-800"
                  }`}
                >
                  <IconComp className={`h-4 w-4 shrink-0 transition-colors ${active ? "text-cyan-400" : "text-gray-500 group-hover:text-cyan-400"}`} />
                  <span className="text-xs font-display uppercase tracking-widest font-black leading-none">
                    {item.shortLabel}
                  </span>
                  
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-cyan-400 rounded-r-sm" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Detailed text contents reader area */}
        <div className="lg:col-span-8 bg-gray-950 border border-gray-900 rounded-2xl p-6 md:p-8 min-h-[350px] relative text-left">
          
          {/* Futuristic HUD tech detail lines */}
          <div className="absolute top-4 right-4 text-[8px] font-mono text-gray-600 uppercase tracking-widest">
            LAPD_DB_RECOVER // ACCES_POINTID: {activeSub.toUpperCase()}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSub}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
            >
              {renderSubMenuContent()}
            </motion.div>
          </AnimatePresence>

          {/* CRT scan lines simulation */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none opacity-40 rounded-2xl" />
        </div>

      </div>
    </motion.div>
  );
}
