import { Actor, FilmVersion, BookDifference, ProductionSecret, VKQuestion } from "../types";

export const actorsData: Actor[] = [
  {
    id: "deckard",
    name: "Harrison Ford",
    character: "Rick Deckard",
    role: "Blade Runner",
    status: "Inconnu",
    description: "Un flic chevronné, rappelé au service actif de la police de Los Angeles (LAPD) au département spécialisé dans le 'retrait' des réplicants rebelles. Las et froid, Deckard commence à s'interroger sur sa propre nature et son humanité au fur et à mesure de sa traque.",
    secretInfo: "La question de savoir si Deckard est lui-même un réplicant Nexus-6 (ou Nexus-7 spécial) est le plus célèbre débat du cinéma de science-fiction. La coupe 'Final Cut' de Ridley Scott, montrant le rêve de la licorne et l'origami final laissé par Gaff, suggère fortement qu'il en est un.",
    portraitUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    archivalRepresentation: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1000",
    keyQuote: "Je ne savais pas si j'avais des souvenirs d'elle, ou si ce n'étaient que des rêves...",
    coordinates: { x: 342, y: 198, zoom: 4 }
  },
  {
    id: "batty",
    name: "Rutger Hauer",
    character: "Roy Batty",
    role: "Chef des Réplicants (Nexus-6)",
    status: "Réplicant",
    description: "Le leader charismatique et redoutable des réplicants évadés d'une colonie minière spatiale. Conçu pour le combat militaire, il possède une intelligence suprême, une force extrême et une conscience aiguë de sa date de péremption imminente.",
    secretInfo: "Rutger Hauer a lui-même improvisé la célèbre phrase 'All those moments will be lost in time, like tears in rain' juste avant le tournage de sa scène de mort face à Deckard, touchant profondément l'équipe technique.",
    portraitUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
    archivalRepresentation: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1000",
    keyQuote: "J'ai vu tant de choses que vous, humains, ne pourriez pas croire...",
    coordinates: { x: 210, y: 154, zoom: 3.5 }
  },
  {
    id: "rachael",
    name: "Sean Young",
    character: "Rachael",
    role: "Secrétaire de Tyrell / Prototype spécial",
    status: "Réplicant",
    description: "Un prototype de réplicant Nexus-6 d'un genre nouveau, doté de souvenirs implantés issus de la nièce du Dr. Eldon Tyrell pour stabiliser ses émotions. Elle se croit humaine jusqu'à ce que Deckard lui fasse passer le test de Voight-Kampff.",
    secretInfo: "Rachael possède un code d'identification secret qui n'inclut pas de date de péremption prédéfinie de 4 ans, à la différence des autres Nexus-6, faisant d'elle un être unique capable de ressentir de réelles émotions durables.",
    portraitUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
    archivalRepresentation: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000",
    keyQuote: "Est-ce qu'on vous a déjà fait passer ce test, à vous ?",
    coordinates: { x: 450, y: 220, zoom: 4.5 }
  },
  {
    id: "pris",
    name: "Daryl Hannah",
    character: "Pris Stratton",
    role: "Modèle de plaisir / Réplicante révoltée",
    status: "Réplicant",
    description: "Une réplicanteNexus-6 qualifiée de 'modèle de plaisir basique pour le personnel militaire'. Compagne de Roy Batty, elle s'infiltre chez l'ingénieur en robotique J.F. Sebastian en profitant de sa naïveté et de sa solitude.",
    secretInfo: "Daryl Hannah a exécuté elle-même plusieurs acrobaties complexes durant la scène de combat acrobatique finale avec Deckard dans l'appartement de Sebastian, impressionnant Ridley Scott.",
    portraitUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
    archivalRepresentation: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&q=80&w=1000",
    keyQuote: "Je pense, donc je suis.",
    coordinates: { x: 180, y: 280, zoom: 3 }
  },
  {
    id: "gaff",
    name: "Edward James Olmos",
    character: "Gaff",
    role: "Inspecteur de police LAPD",
    status: "Humain",
    description: "Un mystérieux policier polyglotte qui s'exprime en argot de la rue ('Cityspeak'). Il escorte Deckard tout au long de sa mission et passe son temps à plier des origamis prémonitoires en papier (poule, bonhomme en érection, licorne).",
    secretInfo: "L'origami de licorne laissé par Gaff à la fin du film prouve qu'il connaissait les rêves intimes de Deckard, ce qui démontre implicitement que Deckard est un réplicant doté de rêves synthétiques surveillés par la police.",
    portraitUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
    archivalRepresentation: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000",
    keyQuote: "C'est dommage qu'elle doive mourir... mais qui n'en est pas là ?",
    coordinates: { x: 520, y: 130, zoom: 5 }
  }
];

export const filmVersions: FilmVersion[] = [
  {
    id: "workprint",
    title: "Version de Travail (Workprint Version)",
    year: "1982",
    duration: "113 min",
    description: "Projetée lors d'avant-premières tests à Denver et Dallas en mars 1982. Les retours négatifs du public sur la fin abrupte et l'absence d'explications ont poussé les studios à imposer des modifications majeures pour la sortie en salle.",
    keyDifferences: [
      "Pas de voix off de Harrison Ford.",
      "Comprend une scène de mort de Roy Batty avec des plans différents.",
      "Pas de scène de rêve de Licorne.",
      "Fin abrupte sans le 'Happy Ending' imposé."
    ],
    importance: "Cruciale historiquement car elle montre la vision brute de Ridley Scott avant les concessions commerciales."
  },
  {
    id: "us_theatrical",
    title: "Version Cinéma Américaine (US Theatrical Cut)",
    year: "1982",
    duration: "116 min",
    description: "La version originale projetée dans les cinémas américains en 1982. Elle intègre la voix off célèbre (et souvent critiquée comme trop monotone) de Harrison Ford et la fin heureuse où Deckard et Rachael s'échappent dans la nature verdoyante.",
    keyDifferences: [
      "Voix off explicative de Deckard présente tout au long du film.",
      "Fin heureuse utilisant des rushs de paysages inutilisés du film 'The Shining' de Stanley Kubrick.",
      "Moins violente que la version internationale."
    ],
    importance: "C'est la version qui a fait découvrir le film au grand public, bien qu'elle fut reniée par le réalisateur."
  },
  {
    id: "international_theatrical",
    title: "Version Cinéma Internationale (Sanctioned Cut)",
    year: "1982",
    duration: "117 min",
    description: "Projetée en Europe et en Asie en 1982. Identique à la version américaine mais contenant des scènes d'action et de violence beaucoup plus crues, absentes de la version américaine censurée.",
    keyDifferences: [
      "Scène prolongée où Roy Batty enfonce ses doigts dans les yeux de Tyrell.",
      "Pris utilisant Deckard comme un punching-bag par d'incroyables cabrioles violentes.",
      "Plans supplémentaires de clous enfoncés dans la main de Roy Batty."
    ],
    importance: "Offre un aperçu plus authentique du désespoir et de la brutalité de la dystopie originelle."
  },
  {
    id: "directors_cut",
    title: "Version du Réalisateur (Director's Cut)",
    year: "1992",
    duration: "116 min",
    description: "Apparue suite au succès inattendu de projections non autorisées de la version de travail en 1990. Ridley Scott a validé des changements artistiques majeurs pour revenir à une œuvre plus sombre et ambiguë.",
    keyDifferences: [
      "Suppression totale de la voix off nostalgique de Deckard.",
      "Insertion pour la première fois de la séquence du rêve de la Licorne de Deckard.",
      "Suppression de la 'Fin heureuse' dans les montagnes enneigées/verdoyantes : le film s'arrête sur les portes de l'ascenseur qui se ferment."
    ],
    importance: "Elle a redéfini Blade Runner en chef-d'œuvre culte et a scellé la théorie selon laquelle Deckard est un réplicant."
  },
  {
    id: "final_cut",
    title: "La Version Finale (The Final Cut)",
    year: "2007",
    duration: "117 min",
    description: "La seule version sur laquelle Ridley Scott a eu un contrôle artistique absolu et complet. Réalisée pour le 25ème anniversaire, elle présente une restauration d'image époustouflante en 4K, une bande-son remasterisée et des effets visuels corrigés minutieusement.",
    keyDifferences: [
      "Restauration visuelle complète et correction d'erreurs logiques (ex: la doublure de Joanna Cassidy pour la mort de Zhora est remplacée numériquement).",
      "Séquence de la licorne intacte et complète.",
      "Violence ré-intégrée en haute définition.",
      "Mixage sonore immersif exploitant pleinement les nappes du compositeur Vangelis."
    ],
    importance: "La version ultime et définitive, considérée comme la vision canonique absolue de l'œuvre."
  }
];

export const bookDifferences: BookDifference[] = [
  {
    topic: "L'Empathie et la religion (Mercerisme)",
    bookVersion: "Dans le livre de Philip K. Dick, l'empathie est codifiée par une véritable religion d'État appelée la 'Boîte à Empathie' de Wilbur Mercer, qui unit virtuellement l'humanité déclinante dans la souffrance collective.",
    movieVersion: "Le Mercerisme est totalement absent du film. Ridley Scott préfère traduire cette question de l'empathie de manière profane et viscérale à travers le test de Voight-Kampff et l'évolution spirituelle de Roy Batty.",
    thematicImpact: "Le livre examine l'empathie comme une norme sociale artificielle, tandis que le film la présente comme une révélation existentielle individuelle."
  },
  {
    topic: "Les Animaux artificiels vs Animaux réels",
    bookVersion: "Après la guerre nucléaire ('Poussière'), les animaux sont l'ultime symbole de richesse et d'humanité. Deckard est hanté par la honte de posséder un mouton électrique artificiel et rêve d'acheter un animal vivant d'une valeur inestimable.",
    movieVersion: "Bien qu'on aperçoive des animaux artificiels (le hibou de Tyrell, le serpent géant de Zhora), cette obsession matérielle et sociale est reléguée au second plan sonore ou à quelques lignes de dialogue.",
    thematicImpact: "Dans le livre, posséder un animal définit la moralité civique. Dans le film, c'est l'empathie envers d'autres êtres conscients qui définit le statut moral d'un être."
  },
  {
    topic: "Le personnage de Rick Deckard",
    bookVersion: "Deckard est un fonctionnaire marié à une femme dépressive (Iran), vivant modestement. Il est consumé par la routine, le besoin d'argent pour remplacer son mouton électrique et les doutes moraux permanents.",
    movieVersion: "Deckard est un détective solitaire, divorcé, mystérieux, archétype du détective désabusé des films noirs des années 40 (Sam Spade / Philip Marlowe). Il vit seul dans son appartement sombre, entouré de vieux souvenirs photo.",
    thematicImpact: "Le film transforme une satire sociale en un poème mélancolique existentiel."
  },
  {
    topic: "La nature des Réplicants (Androïdes)",
    bookVersion: "Les Androïdes (modèles Nexus-6) sont dépeints par Philip K. Dick comme des esprits froids, calculateurs, machines biologiques dénuées d'humour et d'empathie réelle pour leurs semblables.",
    movieVersion: "Les réplicants de Scott se révèlent plus passionnés, vivants et désireux de vivre que les humains apathiques de la Terre. Roy Batty devient une figure christique rédemptrice.",
    thematicImpact: "Scott inverse la proposition de Dick : les machines deviennent humaines tandis que l'humanité s'automatise et dépérit."
  },
  {
    topic: "L'atmosphère et la Pluie",
    bookVersion: "Une Californie étouffée par une fine poussière radioactive tombant du ciel, désertée et silencieuse où les immeubles géants sont à moitié vides de vie humaine.",
    movieVersion: "Une mégapole cyberpunk surpeuplée, étouffante, caractérisée par une pluie torrentielle acide perpétuelle, des néons géants publicitaires de firmes japonaises corporatives et un brouillage sonore permanent.",
    thematicImpact: "Le film a littéralement inventé l'esthétique cyberpunk qui influencera les décennies à venir (Neuromancien, Matrix, Cyberpunk 2077)."
  }
];

export const productionSecrets: ProductionSecret[] = [
  {
    title: "Le choix crucial de Ridley Scott",
    category: "Réalisation",
    content: "Ridley Scott sortait tout juste du succès magistral de 'Alien' en 1979. Il avait d'abord refusé de réaliser Blade Runner pour se concentrer sur l'adaptation de 'Dune'. C'est le décès tragique de son frère aîné Frank qui l'a poussé à accepter le projet afin de s'immerger totalement dans un travail créatif colossal et d'exorciser son deuil.",
    imageDesc: "L'ambiance rétro du studio de tournage avec la présence marquée d'ombres expressionnistes.",
    imageUrl: "https://images.unsplash.com/photo-1485686531469-a87d948603c2?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Comment Deckard a failli être Dustin Hoffman",
    category: "Casting",
    content: "Avant que Harrison Ford ne s'impose grâce à son ascension fulgurante dans Star Wars et Indiana Jones, Dustin Hoffman a collaboré plusieurs mois avec la production pour le rôle de Deckard. Son concept était d'en faire un personnage beaucoup plus fragile et abîmé par la rue. Le rôle fut également proposé à Al Pacino, Clint Eastwood et Jack Nicholson.",
    imageDesc: "Silhouette masculine en trench-coat classique sous un éclairage urbain néo-noir rétro.",
    imageUrl: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Le secret des yeux brillants des Réplicants",
    category: "Technique",
    content: "Pour donner aux réplicants (et à la chouette de Tyrell) ce regard ambré surnaturel d'animaux prédateurs, le chef opérateur Jordan Cronenweth a utilisé l'ancienne méthode de l'effet Schüfftan. Il a placé un miroir semi-réfléchissant incliné à 45 degrés devant l'objectif de la caméra, réfléchissant un filet de lumière rouge/ambre aligné directement avec la pupille des acteurs.",
    imageDesc: "Détail macro d'un iris capturant le reflet lumineux rouge et doré des biocapteurs.",
    imageUrl: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "L'improvisation légendaire des Larmes dans la Pluie",
    category: "Anecdote",
    content: "Pendant le tournage nocturne épuisant de la mort de Roy Batty, l'acteur Rutger Hauer a estimé que le monologue d'origine fourni par le scénariste David Peoples était trop pompeux et long pour un mourant. Il l'a tronqué de moitié de sa propre initiative et y a rajouté la célèbre épitaphe : 'Tous ces moments se perdront dans le temps, comme des larmes dans la pluie.' Ridley Scott, ébloui par la poésie de l'acteur, a immédiatement gardé la prise.",
    imageDesc: "Lumières de néons se reflétant dans de sombres gouttes de pluie le long d'une ruelle brumeuse.",
    imageUrl: "https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "La révolte de l'équipe technique contre Ridley",
    category: "Anecdote",
    content: "Le perfectionnisme absolu de Scott et ses méthodes britanniques rigoristes ont provoqué un conflit ouvert avec l'équipe technique américaine durant le tournage. Ridley Scott ayant déclaré dans une interview préférer travailler avec des techniciens anglais plus obéissants, l'équipe américaine a riposté en imprimant des T-shirts portant les inscriptions 'Yes Guv' (Oui chef) et 'Xenophobia'. Scott s'est amusé à porter lui-même un T-shirt 'Guv' pour calmer les esprits.",
    imageDesc: "Lentilles et machineries de caméras argentiques prêtes pour le réglage d'une scène.",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800"
  }
];

export const vkQuestions: VKQuestion[] = [
  {
    id: 1,
    scenario: "Vous marchez dans le désert et soudain vous apercevez une tortue qui rampe vers vous. Vous la saisissez et la retournez sur le dos, ses pattes s'agitent au soleil brûlant mais elle ne peut pas se redresser toute seule. Et vous ne l'aidez pas. Pourquoi ?",
    options: [
      {
        text: "Qu'est-ce que vous entendez par désert ? Et pourquoi est-ce que je serais là-bas ?",
        description: "Contestation du cadre logique pour s'esquiver (Comportement réplicant typique).",
        suggestedAIType: "replicant-leaning"
      },
      {
        text: "C'est horrible ! Je ne la laisserais jamais souffrir ainsi, je la remettrais immédiatement sur ses pattes.",
        description: "Réponse hautement empathique et instinctive (Réaction humaine standard).",
        suggestedAIType: "human-leaning"
      },
      {
        text: "C'est une expérience fascinante de voir comment elle réagit au stress environnemental.",
        description: "Observation pragmatique, indifférence clinique (Android suspect).",
        suggestedAIType: "replicant-leaning"
      }
    ]
  },
  {
    id: 2,
    scenario: "C'est votre anniversaire. Quelqu'un vous offre un portefeuille en peau de bébé de phoque, un modèle magnifique mais synthétique.",
    options: [
      {
        text: "Je le refuse poliment. Même synthétique, l'idée de porter la peau d'un bébé phoque me révulse.",
        description: "Fort sens des valeurs morales appliquées au règne animal.",
        suggestedAIType: "human-leaning"
      },
      {
        text: "S'il est synthétique, cela n'a aucune importance. C'est juste un bout de plastique bien dessiné.",
        description: "Esprit logique dénué de symbolisme affectif ou d'empathie animale secondaire.",
        suggestedAIType: "replicant-leaning"
      },
      {
        text: "Qui me l'offre ? Est-ce que cette personne tente d'obtenir quelque chose de moi ?",
        description: "Méfiance paranoïaque, analyse purement rationnelle des relations d'intérêts.",
        suggestedAIType: "highly-evasive"
      }
    ]
  },
  {
    id: 3,
    scenario: "Vous regardez la télévision et un documentaire montre une guêpe ramper sur le bras d'un enfant de deux ans. L'enfant l'écrase lentement du bout des doigts, sans haine, juste pour voir.",
    options: [
      {
        text: "Je me sens inquiet de la piqûre potentielle pour le pauvre bambin, mais l'acte de tuer la guêpe m'attriste.",
        description: "Mélange d'empathie protectrice et de respect pour la vie d'insectes.",
        suggestedAIType: "human-leaning"
      },
      {
        text: "Un enfant de deux ans n'a pas les capacités motrices pour écraser une guêpe sans se faire piquer. Ce scénario est absurde.",
        description: "Analyse hyper-rationnelle axée uniquement sur la physique et la vraisemblance mécanique.",
        suggestedAIType: "replicant-leaning"
      },
      {
        text: "Je change immédiatement de chaîne, ce genre de détails ne mérite pas mon attention.",
        description: "Esquive comportementale froide pour éviter des questions émotives.",
        suggestedAIType: "highly-evasive"
      }
    ]
  },
  {
    id: 4,
    scenario: "Vous êtes invité à dîner chez un haut dirigeant. Le plat de résistance est du homard vivant que l'on jette dans une marmite d'eau bouillante sous vos yeux.",
    options: [
      {
        text: "Je quitte la table. Je trouve inadmissible de faire souffrir un être vivant ainsi sous mes yeux.",
        description: "Désapprobation immédiate de la violence physique gratuite.",
        suggestedAIType: "human-leaning"
      },
      {
        text: "Le homard n'a pas de système nerveux central semblable au nôtre, ses cris sont uniquement de la vapeur s'échappant de sa carapace.",
        description: "Rationalisation scientifique froide pour masquer l'absence d'inconfort viscéral.",
        suggestedAIType: "replicant-leaning"
      },
      {
        text: "Je me demande quelle est la température exacte de l'eau et combien de calories cela apporte.",
        description: "Focus absolu sur les statistiques et données non-affectives.",
        suggestedAIType: "highly-evasive"
      }
    ]
  },
  {
    id: 5,
    scenario: "Votre enfant vous dit qu'il a trouvé un insecte rare et qu'il l'a épinglé vivant dans sa boîte de collection pour qu'il ne s'échappe pas.",
    options: [
      {
        text: "Je lui explique patiemment le caractère cruel de cet acte et je l'oblige à relâcher l'animal.",
        description: "Éducation morale et empathique active.",
        suggestedAIType: "human-leaning"
      },
      {
        text: "Cela témoigne d'un esprit d'organisation et de rigueur scientifique prometteur pour son avenir.",
        description: "Valorisation de la taxonomie utilitaire au détriment de la vie biologique.",
        suggestedAIType: "replicant-leaning"
      },
      {
        text: "Les papillons et les insectes de toute façon ne vivent que quelques jours. Autant en faire une œuvre d'art permanente.",
        description: "Esthétisation morale détachée du caractère sacré de la vie.",
        suggestedAIType: "highly-evasive"
      }
    ]
  }
];
