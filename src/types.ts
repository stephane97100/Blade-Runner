export interface Actor {
  id: string;
  name: string;
  character: string;
  role: string;
  status: "Humain" | "Réplicant" | "Inconnu";
  description: string;
  secretInfo: string;
  portraitUrl: string;
  archivalRepresentation: string;
  keyQuote: string;
  coordinates: { x: number; y: number; zoom: number };
}

export interface FilmVersion {
  id: string;
  title: string;
  year: string;
  duration: string;
  description: string;
  keyDifferences: string[];
  importance: string;
}

export interface BookDifference {
  topic: string;
  bookVersion: string;
  movieVersion: string;
  thematicImpact: string;
}

export interface ProductionSecret {
  title: string;
  category: "Casting" | "Réalisation" | "Technique" | "Anecdote";
  content: string;
  imageDesc?: string;
  imageUrl?: string;
}

export interface VKQuestion {
  id: number;
  scenario: string;
  options: {
    text: string;
    description: string;
    suggestedAIType: "human-leaning" | "replicant-leaning" | "highly-evasive";
  }[];
}

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface SoundtrackTrack {
  title: string;
  composer: string;
  duration: string;
  notes: string;
  url: string;
}

export const VANGELIS_PLAYLIST: SoundtrackTrack[] = [
  {
    title: "Main Titles / Overture",
    composer: "Vangelis",
    duration: "3:42",
    notes: "Atmosphère synthétique d'ouverture majestueuse avec des percussions en écho et la célèbre modulation du synthétiseur CS-80.",
    url: "https://archive.org/download/blade-runner-vangelis/01%20-%20Main%20Titles.mp3"
  },
  {
    title: "Love Theme",
    composer: "Vangelis & Rachel's Sax Solo",
    duration: "4:56",
    notes: "Comporte un solo de saxophone sensuel et mélancolique, illustrant l'amour naissant entre Deckard et Rachael.",
    url: "https://archive.org/download/blade-runner-vangelis/03%20-%20Love%20Theme.mp3"
  },
  {
    title: "Blade Runner Blues",
    composer: "Vangelis",
    duration: "8:53",
    notes: "Mélodie bluesy déchirante et immersive, résonnant au milieu des gratte-ciels pluvieux de Los Angeles.",
    url: "https://archive.org/download/blade-runner-vangelis/04%20-%20Blade%20Runner%20Blues.mp3"
  },
  {
    title: "Tears in Rain",
    composer: "Vangelis (avec la voix de Roy Batty)",
    duration: "3:00",
    notes: "L'élégie finale de Roy Batty sur le toit de l'immeuble Bradbury, accompagnée d'un ruissellement de notes cristallines.",
    url: "https://archive.org/download/blade-runner-vangelis/12%20-%20Tears%20In%20Rain.mp3"
  },
  {
    title: "Tales of the Future",
    composer: "Vangelis feat. Demis Roussos",
    duration: "4:46",
    notes: "Comprend les vocalisations envoûtantes sans paroles du célèbre chanteur Demis Roussos, évoquant un Orient futuriste.",
    url: "https://archive.org/download/blade-runner-vangelis/07%20-%20Tales%20Of%20The%2520Future.mp3"
  }
];

