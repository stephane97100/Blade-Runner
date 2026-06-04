import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Music, Play, Pause, SkipForward, Disc, Volume2, HelpCircle, Layers, Sliders, MessageSquareCode, Award, Share2 } from "lucide-react";
import { VANGELIS_PLAYLIST, SoundtrackTrack } from "../types";

interface OSTViewProps {
  currentTrack: SoundtrackTrack | null;
  isPlaying: boolean;
  volume: number;
  onPlayPause: () => void;
  onNextTrack: () => void;
  onSelectTrack: (track: SoundtrackTrack) => void;
  onVolumeChange: (vol: number) => void;
}

export default function OSTView({
  currentTrack,
  isPlaying,
  volume,
  onPlayPause,
  onNextTrack,
  onSelectTrack,
  onVolumeChange
}: OSTViewProps) {
  const [selectedStoryTab, setSelectedStoryTab] = useState<"synthese" | "retard" | "voix" | "instruments">("synthese");

  const storyTabs = [
    { id: "synthese", label: "L'Histoire", title: "L'Odyssée Sonore de Vangelis" },
    { id: "retard", label: "Le Retard (12 Ans)", title: "Le Mystère de la Sortie Différée (1982 vs 1994)" },
    { id: "voix", label: "Les Chansons & Voix", title: "Les Voix d'Outre-Monde de l'OST" },
    { id: "instruments", label: "La Technologie", title: "Les Machines : CS-80 & Lexicon Reverb" }
  ] as const;

  const getStoryContent = () => {
    switch (selectedStoryTab) {
      case "synthese":
        return (
          <div className="space-y-4 text-xs font-sans text-gray-300 leading-relaxed text-left">
            <h3 className="text-sm font-display font-black text-white uppercase tracking-wider">
              UN CHEF-D’ŒUVRE IMMORTEL DU SYSTÈME NÉO-NOIR
            </h3>
            <p>
              Composée par le claviériste et compositeur grec <strong>Evángelos Odysséas Papathanassíou</strong>, alias <strong>Vangelis</strong>, la bande originale de <em>Blade Runner</em> est considérée comme l'une des compositions électroniques les plus révolutionnaires et influentes de l'histoire du cinéma. Plus qu'un simple fond musical, elle sert d'ossature émotionnelle et de ciment atmosphérique au Los Angeles dystopique de Ridley Scott.
            </p>
            <p>
              Travaillant dans son studio privé de Londres, les <strong>Nemo Studios</strong>, Vangelis composait en regardant en boucle les rushes quotidiens du tournage. Il ne cherchait pas à coller d'une manière mécanique à l'action, mais plutôt à capturer la solitude étouffante des personnages, les pleurs de la pluie perpétuelle, et la grandeur industrielle des pyramides de la Tyrell Corporation.
            </p>
            <p>
              Le résultat est une fusion intemporelle de mélodies romantiques nostalgiques inspirées de la musique classique, d'orchestrations de jazz mélancolique, de percussions spatiales profondes et d'effets électroniques futuristes, préfigurant le genre du modern synthwave et de l'ambient cinématique.
            </p>
          </div>
        );
      case "retard":
        return (
          <div className="space-y-4 text-xs font-sans text-gray-300 leading-relaxed text-left">
            <h3 className="text-sm font-display font-black text-white uppercase tracking-wider">
              DOUZE ANS DE RECHERCHE CLANDESTINE
            </h3>
            <p>
              Bien que le film soit sorti sur les écrans hollywoodiens en <strong>juin 1982</strong>, les auditeurs ont dû patienter <strong>douze longues années</strong> avant de pouvoir acheter la véritable bande originale officielle de Vangelis, enfin commercialisée en <strong>1994</strong> sous l'égide de Warner Music.
            </p>
            <p>
              Pourquoi ce délai exorbitant ? La légende raconte qu'un profond désaccord d'ordre artistique et financier éclata entre Vangelis et les producteurs du film. Courroucé, Vangelis confisqua les bandes maestras et refusa toute publication officielle immédiate. Pour combler ce vide béant, les producteurs publièrent en décembre 1982 un album décevant enregistré par le <em>New American Orchestra</em>, qui réinterprétait au saxophone jazz acoustique les thèmes du compositeur.
            </p>
            <p>
              Pendant plus d'une décennie, les fans durent s'échanger des disques pirates (bootlegs) de piètre qualité capturés directement dans les cinémas. En 1994, Vangelis céda enfin à la demande générale et se plongea dans ses archives pour mixer un album officiel d'anthologie, agrémenté de dialogues clés du film (dont la tirade 'Tears in Rain' de Roy Batty) pour restituer l'immersion narrative totale du dôme noir de Los Angeles.
            </p>
          </div>
        );
      case "voix":
        return (
          <div className="space-y-4 text-xs font-sans text-gray-300 leading-relaxed text-left">
            <h3 className="text-sm font-display font-black text-white uppercase tracking-wider">
              LES SOUFFLES HUMAINS ET VOCALISES DES COLONIES
            </h3>
            <p>
              La force de l'album tient aussi à l'intégration subtile de voix humaines et de vocalistes d'une grande expressivité, incarnant le paradoxe de la machine sensible en quête d'âme :
            </p>
            <ul className="list-disc list-inside space-y-2 text-cyan-200">
              <li>
                <strong>Demis Roussos ("Tales of the Future") :</strong> 
                {" "}Ancien ami intime et vocaliste du groupe de rock progressif de Vangelis, <em>Aphrodite's Child</em>. Il livre sur cette piste une prestation féroce et déchirante de vocalisations improvisées sans paroles, inspirée des incantations orientales traditionnelles des balkans, renforçant l'aspect multiculturel et globalisé de la cité futuriste.
              </li>
              <li>
                <strong>Mary Hopkin ("Rachael's Song") :</strong> 
                {" "}Chanteuse folk galloise à la voix céleste cristalline. Sa vocalise mélancolique et sans paroles plane au-dessus de synthétiseurs onduleurs rêveurs, symbolisant toute la fragilité et le deuil identitaire de Rachael découvrant sa nature artificielle.
              </li>
              <li>
                <strong>Don Percival ("One More Kiss, Dear") :</strong> 
                {" "}Pour parfaire le style polar noir des années 1940, Vangelis a composé ce morceau jazz rétro qui imite parfaitement les ballades de l'ère du gramophone, chanté avec un détachement nostalgique saisissant de Don Percival.
              </li>
            </ul>
          </div>
        );
      case "instruments":
        return (
          <div className="space-y-4 text-xs font-sans text-gray-300 leading-relaxed text-left">
            <h3 className="text-sm font-display font-black text-white uppercase tracking-wider">
              L'EMPIRE RETRO-ANALOGIQUE : LE YAMAHA CS-80
            </h3>
            <p>
              Le son unique et colossal de <em>Blade Runner</em> provient de deux pièces technologiques de collection, véritables joyaux de la synthèse analogique de la fin des années 70 :
            </p>
            <ul className="list-disc list-inside space-y-2 text-amber-200">
              <li>
                <strong>Le Yamaha CS-80 (1977) :</strong> 
                {" "}Considéré comme la quintessence des synthétiseurs polyphoniques analogiques. Pesant plus de 100 kg, sa particularité réside dans son clavier sensible à la vélocité et doté de l'aftertouch polyphonique. Vangelis en tirait des nappes expressives colossales et une célèbre onde lead ressemblant à une trompette de laiton cybernétique qui pleure, symbole du générique d'ouverture.
              </li>
              <li>
                <strong>La Réverbération Lexicon 224 :</strong> 
                {" "}Une des premières boîtes de réverbération numérique professionnelles. En réglant des modulations de queue de réverbérations infiniment longues (jusqu'à 70 secondes de déclin !), Vangelis a conféré aux claviers secs du CS-80 cette atmosphère liquide et vaporeuse gigantesque, imitant le son réverbéré sur les hauts murs graisseux et les abîmes profonds de la mégapole.
              </li>
            </ul>
          </div>
        );
    }
  };

  return (
    <div id="ost_vangelis_dashboard" className="space-y-8 select-none">
      {/* Title block */}
      <div className="flex items-center space-x-3 border-b border-gray-900 pb-4">
        <div className="w-10 h-10 rounded-lg bg-pink-950/40 border border-pink-500/20 flex items-center justify-center text-pink-500 animate-spin-slow">
          <Disc className="h-5.5 w-5.5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-500 to-amber-500 uppercase">
            BLADE RUNNER VANGELIS OST
          </h1>
          <p className="text-gray-400 text-xs font-mono mt-1 uppercase">
            Anthologie de l'architecture sonore & Thèmes légendaires du synthétiseur CS-80
          </p>
        </div>
      </div>

      {/* Grid of story and active track player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column (7/12): Stories about album */}
        <div className="lg:col-span-7 bg-gray-950/50 border border-gray-900 rounded-2xl p-5 md:p-6 space-y-6">
          
          {/* Sub menu tabs for the story */}
          <div className="flex flex-wrap gap-2 border-b border-gray-900 pb-3">
            {storyTabs.map((story) => (
              <button
                key={story.id}
                onClick={() => setSelectedStoryTab(story.id)}
                className={`py-1.5 px-3.5 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  selectedStoryTab === story.id
                    ? "bg-pink-950/30 border-pink-500/30 text-pink-300 shadow-[0_0_8px_rgba(236,72,153,0.1)]"
                    : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {story.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStoryTab}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 4 }}
              transition={{ duration: 0.2 }}
            >
              {getStoryContent()}
            </motion.div>
          </AnimatePresence>

          {/* Special highlighted box for Demis Roussos as requested */}
          <div className="p-4 bg-gradient-to-r from-gray-950 via-pink-950/10 to-gray-950 border border-pink-500/10 rounded-xl space-y-2 text-left">
            <span className="text-[8.5px] font-mono text-pink-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
              FOCUS VOCALISTE : DEMIS ROUSSOS (1946-2015)
            </span>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              Saviez-vous que <strong>Demis Roussos</strong>, l'immense superstar grecque du disco-romance des années 1970 (connu pour <em>'Forever and Ever'</em>), chante sur <em>Blade Runner</em> ? Ami cher de Vangelis avec qui il fonda le mythique groupe <strong>Aphrodite's Child</strong> en 1967, Demis a enregistré dans le noir absolu des Nemo Studios de Londres une litanie de lamentations mélismatiques sans paroles sur <strong>'Tales of the Future'</strong>. Sa puissance vocale et son timbre chaud, passés dans un écho analogique lourd, créent ce choc culturel absolu, symbolisant les fumeries et ruelles asiatiques décadentes du L.A. de 2019.
            </p>
          </div>
        </div>

        {/* Right column (5/12): Cybernetic album cassette player */}
        <div className="lg:col-span-5 bg-gray-950/70 border border-cyan-500/10 rounded-2xl p-5 md:p-6 space-y-6 flex flex-col justify-between relative overflow-hidden group">
          {/* Laser flare graphic decoration */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />

          {/* Cassette Graphic Tape UI */}
          <div className="bg-gray-900 border-2 border-gray-950 p-4 rounded-xl space-y-3 shadow-inner text-center select-none relative">
            <div className="flex justify-between items-center text-[7.5px] font-mono text-gray-500 mb-1">
              <span>NEMO RECORDINGS LTD // STEREO</span>
              <span className="text-cyan-400 font-bold">TYPE IV METAL TAPE</span>
            </div>
            
            {/* Cassette body with spinning wheels */}
            <div className="h-28 bg-gray-950 border border-gray-800 rounded-lg p-3 flex flex-col justify-between relative shadow-inner">
              <div className="h-1 bg-gradient-to-r from-pink-500 via-cyan-500 to-amber-500 rounded" />
              
              <div className="flex justify-around items-center my-1.5">
                {/* Wheel left */}
                <div className={`w-11 h-11 rounded-full border border-gray-800 flex items-center justify-center bg-gray-900 ${isPlaying ? "animate-spin [animation-duration:8s]" : ""}`}>
                  <div className="w-4 h-4 rounded-full bg-black border-2 border-dashed border-gray-600 flex items-center justify-center">
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  </div>
                </div>

                {/* Cassette Window strip */}
                <div className="w-16 h-8 bg-zinc-900 border border-zinc-850 rounded flex items-center justify-center p-1 text-[8px] font-mono text-cyan-400 font-bold tracking-widest relative">
                  <div className="absolute inset-x-2 h-[1px] bg-cyan-400/20 top-1/2" />
                  <span>{isPlaying ? "[ PLAY ]" : "[ PAUSE ]"}</span>
                </div>

                {/* Wheel right */}
                <div className={`w-11 h-11 rounded-full border border-gray-800 flex items-center justify-center bg-gray-900 ${isPlaying ? "animate-spin [animation-duration:8s]" : ""}`}>
                  <div className="w-4 h-4 rounded-full bg-black border-2 border-dashed border-gray-600 flex items-center justify-center">
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="text-[8.5px] font-mono text-gray-400 uppercase truncate text-center font-bold px-1 tracking-wider">
                {currentTrack ? currentTrack.title : "SÉLECTIONNEZ UNE PISTE"}
              </div>
            </div>

            {/* Simulated hardware buttons */}
            <div className="grid grid-cols-5 gap-1.5 font-mono text-[8px] text-gray-300 select-none">
              <div className="p-1 bg-gray-950 rounded border border-gray-800 font-bold text-center">REC</div>
              <button
                onClick={onPlayPause}
                style={{ contentVisibility: "auto" }}
                className={`p-1 rounded border font-bold text-center cursor-pointer transition-colors ${isPlaying ? "bg-cyan-950 text-cyan-400 border-cyan-400" : "bg-gray-950 border-gray-800"}`}
              >
                PLAY
              </button>
              <button
                onClick={onPlayPause}
                className={`p-1 rounded border font-bold text-center cursor-pointer transition-colors ${!isPlaying ? "bg-amber-950 text-amber-400 border-amber-400" : "bg-gray-950 border-gray-800"}`}
              >
                PAUSE
              </button>
              <div className="p-1 bg-gray-950 rounded border border-gray-800 font-bold text-center opacity-40">REW</div>
              <button
                onClick={onNextTrack}
                className="p-1 bg-gray-950 rounded border border-gray-800 hover:border-cyan-400 font-bold text-center cursor-pointer"
              >
                FFWD
              </button>
            </div>
          </div>

          {/* V-K Sound controls panel */}
          <div className="space-y-4">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block font-bold text-left">
              CONTRÔLEUR DE FOND AUDIO (NIVEAU DE DEFAUT : 30%)
            </span>

            {/* Volume indicator slider */}
            <div className="flex items-center gap-3 bg-gray-900/30 p-3 rounded-lg border border-gray-950">
              <Volume2 className="h-4.5 w-4.5 text-cyan-400 shrink-0" />
              <div className="flex-grow">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-gray-950 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
              <span className="font-mono text-[9px] text-gray-400 w-8 text-right font-bold">
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* List of Tracks in local collection player */}
            <div className="space-y-2 text-left font-mono">
              <span className="text-[8px] text-gray-500 uppercase tracking-widest block font-bold">PISTES DE L'ALBUM CYBERNETIQUE :</span>
              
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-none">
                {VANGELIS_PLAYLIST.map((track, i) => {
                  const isActive = currentTrack?.title === track.title;
                  return (
                    <button
                      key={i}
                      onClick={() => onSelectTrack(track)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg border text-[9.5px] transition-all cursor-pointer ${
                        isActive
                          ? "bg-pink-950/20 border-pink-500/40 text-pink-300"
                          : "bg-gray-950/40 border-gray-900 hover:border-gray-800 text-gray-400 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                        {isActive && isPlaying ? (
                          <span className="flex gap-0.5 h-3 items-end shrink-0">
                            <span className="w-0.5 bg-pink-500 animate-[sound-bar_0.8s_infinite] h-2"></span>
                            <span className="w-0.5 bg-pink-500 animate-[sound-bar_1.2s_infinite_0.2s] h-3"></span>
                            <span className="w-0.5 bg-pink-500 animate-[sound-bar_0.9s_infinite_0.4s] h-1.5"></span>
                          </span>
                        ) : (
                          <Music className={`h-3 w-3 shrink-0 ${isActive ? "text-pink-400" : "text-gray-600"}`} />
                        )}
                        <span className="truncate uppercase font-bold">{track.title}</span>
                      </div>
                      <span className="text-[8px] text-gray-500 shrink-0 font-medium">{track.duration}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick technical info annotation */}
          <div className="p-3 bg-cyan-950/10 border border-cyan-500/10 rounded-xl text-[8.5px] font-sans text-gray-400 leading-normal text-left">
            <strong>Note de lecture :</strong> Les pistes ci-dessus proviennent d'archives ouvertes de l'Internet Archive. En cas de blocage réseau ou administratif, le lecteur commute de manière transparente de l'ambient de fond vers un synthétiseur modulaire local.
          </div>
        </div>

      </div>

      <style>{`
        @keyframes sound-bar {
          0%, 100% { height: 3px; }
          50% { height: 12px; }
        }
      `}</style>
    </div>
  );
}
