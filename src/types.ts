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
