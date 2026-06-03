import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, serverTimestamp, getDocs, deleteDoc, getDoc } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

// Resolve config path
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
if (!fs.existsSync(configPath)) {
  console.warn("[Firebase]警告: firebase-applet-config.json est absent au démarrage du serveur.");
}

const firebaseConfig = fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath, "utf-8"))
  : {
      projectId: "metal-discipline-2f4nj",
      appId: "1:312419165339:web:faaf08fc1e994eacd2523e",
      apiKey: "AIzaSyChfjpOjqyQqr09WZnVIVPghrJC1n6LQoU",
      authDomain: "metal-discipline-2f4nj.firebaseapp.com",
      firestoreDatabaseId: "ai-studio-3a3a99e9-6dfe-4bda-aa4d-195974bcf2c5"
    };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

// Initialize Gemini (handling missing API key gracefully to prevent crashes)
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } else {
    console.warn("[Gemini] GEMINI_API_KEY est manquant dans l'environnement.");
  }
} catch (e) {
  console.error("[Gemini] Échec d'initialisation de l'API Gemini:", e);
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API 1: Test connection health
  app.get("/api/health", async (req, res) => {
    let firestoreOnline = false;
    try {
      // Direct query to check Firestore connectivity
      const pingCol = collection(db, "gallery_items");
      await getDocs(pingCol);
      firestoreOnline = true;
    } catch (e) {
      console.error("[Health API] Connection to Firestore lost/inactive:", e);
    }

    res.json({
      status: "online",
      firestoreOnline,
      firebaseConfigured: !!firebaseConfig.projectId,
      geminiConfigured: !!ai,
      currentTime: new Date().toISOString()
    });
  });

  // --- DATABASE DATA SEEDING & DATA API ENDPOINTS ---

  const initialGalleryList = [
    {
      id: "spinner-police",
      title: "Le Spinner Policier Nexus",
      category: "vaisseaux",
      medium: "Crayon, Aérographe et Gouache sur carton",
      artist: "Syd Mead (Concept Designer)",
      date: "Octobre 1980",
      catalogId: "ART-VES-001",
      description: "Le Spinner est le véhicule de patrouille volant emblématique du LAPD. Capable de décollage vertical (VTOL) grâce à des réacteurs intégrés dans les essieux avant, il est conçu avec un châssis profilé bleu-nuit et des portes ciseaux transparentes afin d'offrir une visibilité au sol maximale.",
      technicalSpec: "Propulsion VTOL de 4ème génération // Double turbine arrière à combustion hydrogène // Blindage composites polymères.",
      imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "tyrell-shuttle",
      title: "Navette Exécutive de la Tyrell",
      category: "vaisseaux",
      medium: "Acrylique et Gouache sur canson",
      artist: "Syd Mead",
      date: "Janvier 1981",
      catalogId: "ART-VES-002",
      description: "Une navette géométrique blindée de très grand luxe réservée aux déplacements privés du Dr. Eldon Tyrell et des cadres exécutifs supérieurs. Sa silhouette polygonale brute évoque directement l'architecture mésoaméricaine des pyramides d'entreprise.",
      technicalSpec: "Système de stabilisation anti-gravité de soute // Revêtement réflectif thermo-absorbant // Liaison satellite quantum chiffrée.",
      imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "garbage-scow",
      title: "Benne de Collecte Industrielle",
      category: "vaisseaux",
      medium: "Feutre et marqueurs noirs",
      artist: "Production Sketch",
      date: "Mai 1981",
      catalogId: "ART-VES-003",
      description: "Esquisse conceptuelle d'un cargo de transport de déchets lourds volant au-dessus des mégalopoles vers les gigantesques décharges de San Diego. Son design est délibérément asymétrique, rouillé, empoussiéré, s'alignant sur l'esthétique 'futur usé'.",
      technicalSpec: "Capacité de charge de soute: 2200 tonnes métriques // Générateurs d'ions basse altitude // Système de compactage moléculaire intégré.",
      imageUrl: "https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "cargo-carrier",
      title: "Cargo Interstellaire Centaurus",
      category: "vaisseaux",
      medium: "Croquis de storyboarding technique",
      artist: "Mentor Huebner",
      date: "Août 1980",
      catalogId: "ART-VES-004",
      description: "Grand dessin d'étude représentant le lancement d'un immense transporteur minéralier interplanétaire depuis le port spatial orbital terrestre en direction des colonies Off-World du Centaure.",
      technicalSpec: "Moteurs à fusion continue de deutérium // Soute cryogénique sous haute pression // Équipage de maintenance autonome cyborg.",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "industrial-la",
      title: "Los Angeles - Enfers Industriels",
      category: "villes",
      medium: "Huile sur toile grand format",
      artist: "Sherman Labby",
      date: "Novembre 1980",
      catalogId: "ART-ENV-001",
      description: "Une peinture d'ambiance à l'échelle monumentale décrivant la scène d'ouverture mythique du film: de gigantesques cheminées d'usines crachant des bouffées de flammes dans la nuit, sous de lourdes trombes de pluies acides de novembre.",
      technicalSpec: "Étude d'ambiance colorimétrique // Palette dominante : bleu de cobalt carbonisé, orange de cadmium, noir terreux.",
      imageUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "bradbury-interior",
      title: "La Cour d'Honneur du Bradbury",
      category: "villes",
      medium: "Dessin au fusain et craie blanche",
      artist: "Production Team",
      date: "Mars 1981",
      catalogId: "ART-ENV-002",
      description: "Un croquis architectural minutieux détaillant la verrière géante, les ferronneries art-nouveau de l'ascenseur en cage d'oiseau et les coursives d'angle baignées dans de sombres clair-obscurs nébuleux propres au genre néo-noir.",
      technicalSpec: "Configuration de caméra: Objectif anamorphique 35mm // Configuration d'éclairage : projecteurs horizontaux à arc au carbone.",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "animoid-market",
      title: "Les Brumes d'Animoid Row",
      category: "villes",
      medium: "Aquarelle et encre de Chine",
      artist: "Mentor Huebner",
      date: "Décembre 1980",
      catalogId: "ART-ENV-003",
      description: "Esquisse vibrante du marché aux animaux artificiels. Les étals débordent de cages lumineuses où s'agitent des serpents, hiboux et poissons artificiels, au milieu d'une foule oppressante d'immigrés asiatiques et de policiers en patrouille.",
      technicalSpec: "Rendu atmosphérique à la vapeur dense // Perspective centrale fuyante // Contraste néon chaud / froid.",
      imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "offworld-dome",
      title: "Colonie Extérieure 'Off-World'",
      category: "villes",
      medium: "Gouache et aérographe sur panneau",
      artist: "Syd Mead",
      date: "Février 1981",
      catalogId: "ART-ENV-004",
      description: "Une des rares planches illustrant un complexe résidentiel d'habitation colonial extraterrestre sous un double coucher de soleil rougeoyant, contrastant avec l'oppression étouffante de la Terre.",
      technicalSpec: "Structure pressurisée auto-portante géodésique // Protecteurs magnétiques de radiation planétaire.",
      imageUrl: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "deckard-coat",
      title: "Rick Deckard - Recherche de Silhouette",
      category: "personnages",
      medium: "Crayons de couleur et feutres de dessin",
      artist: "Charles Knode (Costumier)",
      date: "Septembre 1980",
      catalogId: "ART-CHR-001",
      description: "Recherche originale de costumes pour le personnage principal incarné par Harrison Ford. Le dessin insiste sur le grand trenchcote brun imperméable, le col relevé et l'assemblage de vestes de tweed désuètes à motifs écossais.",
      technicalSpec: "Étiquette : Style 'Hard-Boiled Detective' d'époque d'après-guerre modernisé par une coupe ample rétro.",
      imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "roy-batty-concept",
      title: "Roy Batty - Le Chef Rebelle",
      category: "personnages",
      medium: "Encre, feutre et gouache",
      artist: "Charles Knode",
      date: "Novembre 1980",
      catalogId: "ART-CHR-002",
      description: "Étude esthétique décrivant l'énergie menaçante et la beauté plastique de Roy Batty, le Replicant Nexus-6 d'élite à la chevelure platine, vêtu de son grand manteau de cuir brillant clouté aux épaules.",
      technicalSpec: "Texte additionnel : 'The Aryan Superman of biotechnology, both poetic and lethal.'",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "rachael-shoulder",
      title: "Rachael - Silhouette Structurée Vintage",
      category: "personnages",
      medium: "Crayon graphite et lavis d'encre",
      artist: "Charles Knode",
      date: "Janvier 1981",
      catalogId: "ART-CHR-003",
      description: "Croquis de conception pour le tailleur de Rachael. Épaules ultra-rembourrées géométriques typiques du style de créatrices des années 1940 (Adonis/Schiaparelli), coiffure en chignon banane sculptural sans fioritures superflues, représentant l'intemporalité des réplicants.",
      technicalSpec: "Tissus étudiés: laine brodée croisée lourde noire // maquillage porcelaine contrasté.",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "pris-makeup",
      title: "Pris - Le Camouflage Punk",
      category: "personnages",
      medium: "Croquis rapide aux crayons gras de couleur",
      artist: "Production Makeup Design",
      date: "Avril 1981",
      catalogId: "ART-CHR-004",
      description: "Projet de maquillage pour la réplicante de plaisir incarnée par Daryl Hannah. Détaillant le masque noir pulvérisé à l'aérographe autour des yeux, inspiré du mouvement punk et new-wave, ainsi que sa célèbre perruque blonde échevelée.",
      technicalSpec: "Application fard noir gras rasant // Rouge à lèvres cerise sombre métallique.",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const initialVehiclesList = [
    {
      id: "lapd-spinner",
      name: "LAPD Spinner (Standard Model)",
      category: "Spécification Volante (VTOL)",
      description: "Le Spinner est le véhicule de patrouille volant emblématique utilisé par le département de police de Los Angeles pour surveiller la mégapole et traquer les réplicants hors-la-loi.",
      lore: "Capable de circuler au sol comme une voiture classique, il utilise une propulsion aérodynamique verticale (VTOL) pour s'élever au-dessus du trafic étouffant de Los Angeles. Ses portes s'ouvrent en ciseaux, et le plancher du cockpit intègre des trappes transparentes pour permettre une visibilité au sol absolue lors des patrouilles.",
      visualUrl: "https://images.unsplash.com/photo-1533560224143-69661558f11b?auto=format&fit=crop&q=80&w=800",
      specs: {
        maxSpeed: "450 km/h (Mégapole) // 850 km/h (Altitude libre)",
        propulsion: "Turbines ioniques jumelles et propulseurs d'air pressurisés",
        armor: "Blindage polycarbonate et alliage de titane allégé",
        crew: "2 Officiers LAPD",
        length: "5.4 Mètres",
        weapons: "Émetteur de décharges IEM, canons laser d'interception à focalisation courte"
      }
    },
    {
      id: "peugeot-spinner",
      name: "Brutalist Spinner (Modèle 2049)",
      category: "Spécification Volante (VTOL)",
      description: "Un spinner à trois roues d'apparence anguleuse et minimaliste conçu pour affronter les conditions climatiques extrêmes et acides du milieu du XXIe siècle.",
      lore: "Ce modèle de spinner se distingue par un design brutaliste agressif et asymétrique. Ses vitres teintées en noir et ses panneaux de carbone renforcé protègent l'habitacle contre les tempêtes de sable radioactif d'outre-marge, comme dans le secteur de Las Vegas ou les décharges d'Orphanage à San Diego.",
      visualUrl: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=800",
      specs: {
        maxSpeed: "520 km/h (Mode volant)",
        propulsion: "Cellules à fusion froide et réacteurs orientables asymétriques",
        armor: "Matériaux composites carbone-fibres auto-réparateurs",
        crew: "1 Pilote + 1 Passager",
        length: "4.8 Mètres",
        weapons: "Scanner thermique longue distance, charges de démolition orbitales guidées"
      }
    },
    {
      id: "deckard-sedan",
      name: "Deckard's Ground Sedan (DeLorean Concept)",
      category: "Unité de Surface",
      description: "La voiture terrestre classique de Rick Deckard, solide et blindée, dotée de phares de repérage et de grilles de traitement antibruit.",
      lore: "Conçue à l'origine comme voiture de patrouille policière de surface banalisée, elle possède une suspension hydraulique ajustable robuste et d'épais pare-chocs conçus pour résister aux impacts à haute vitesse sous le bitume glissant de Los Angeles. Son habitacle est austère, dominé par des cadrans de détection analogiques rouges obsolètes.",
      visualUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800",
      specs: {
        maxSpeed: "220 km/h",
        propulsion: "Moteur rotatif à haute compression d'hydrocarbures synthétiques",
        armor: "Plaques de plomb pare-balles de niveau 4",
        crew: "1 Pilote + 1 Passager",
        length: "4.9 Mètres",
        weapons: "Aucune intégrée (Armements optionnels de coffre d'intervention)"
      }
    },
    {
      id: "sebastian-van",
      name: "Sebastian's Mobile Diagnostic Lab",
      category: "Unité de Surface",
      description: "La camionnette utilitaire cabossée et modifiée par J.F. Sebastian pour collecter des pièces médicales et transporter ses prototypes génétiques à travers les quartiers industriels.",
      lore: "Un vieux modèle de transport blindé reconverti en laboratoire ambulant autonome. Sebastian l'utilise pour maintenir temporairement l'homéostasie de ses petits jouets génétiques lors de ses déplacements. Le véhicule est encombré d'oscilloscopes cathodiques et d'outils de micro-ingénierie biologique.",
      visualUrl: "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=800",
      specs: {
        maxSpeed: "140 km/h",
        propulsion: "Hélice de combustion diesel hybride hautement filtrée",
        armor: "Tôle d'acier galvanisée de récupération",
        crew: "1 Conducteur + Animaux de compagnie génétiques",
        length: "5.8 Mètres"
      }
    },
    {
      id: "tyrell-shuttle",
      name: "Tyrell Executive Shuttle (V-10)",
      category: "Transport Spatial",
      description: "Un navette de transport spatial lourd à l'esthétique dorée et géométrique, réservée à la haute direction de la Tyrell Corporation.",
      lore: "Cette merveille technologique intègre des quartiers d'habitation complets avec de confortables banquettes impériales en velours pour les longs transferts vers les colonies d'outre-monde (Off-world colonies). Elle utilise des propulseurs plasmiques de pointe pour échapper à la pesanteur terrestre de manière presque imperceptible.",
      visualUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800",
      specs: {
        maxSpeed: "Mach 4.5 (Entrée atmosphérique) // Hyperpropulsion (Orbital)",
        propulsion: "Quatre réacteurs plasmiques à confinement magnétique",
        armor: "Plaques céramiques thermorésistantes plaquées titane-or",
        crew: "2 Pilotes Androids + 6 Passagers VIP",
        length: "14.2 Mètres"
      }
    }
  ];

  // Secure Login endpoint
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    const adminUsername = process.env.ADMIN_USERNAME || "mistermaster";
    const adminPassword = process.env.ADMIN_PASSWORD || "29Decembre2012!";

    if (username === adminUsername && password === adminPassword) {
      console.log(`[Admin] Authentification réussie pour admin ${username}`);
      res.json({ success: true, token: "admin-session-resection-token-2019" });
    } else {
      console.warn(`[Admin] Échec identification admin pour ${username}`);
      res.status(401).json({ success: false, error: "Identification incorrecte. Code d'accès refusé." });
    }
  });

  // Middleware to authorize admin actions
  const requireAdmin = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader === "Bearer admin-session-resection-token-2019") {
      next();
    } else {
      res.status(403).json({ success: false, error: "Accès refusé. Autorisation requise." });
    }
  };

  // GET Gallery
  app.get("/api/gallery", async (req, res) => {
    try {
      const q = collection(db, "gallery_items");
      const snap = await getDocs(q);
      let items = snap.docs.map(doc => doc.data());

      if (items.length === 0) {
        console.log("[Firestore] Seeding initial gallery items...");
        for (const item of initialGalleryList) {
          await setDoc(doc(db, "gallery_items", item.id), item);
        }
        items = initialGalleryList;
      }
      res.json({ success: true, items });
    } catch (err: any) {
      console.error("[Gallery GET error]", err);
      res.json({ success: true, items: initialGalleryList, note: "Loaded from local memory due to firestore status" });
    }
  });

  // Create / Update Gallery Item
  app.post("/api/admin/gallery", requireAdmin, async (req, res) => {
    try {
      const item = req.body;
      if (!item.id || !item.title || !item.imageUrl) {
        return res.status(400).json({ success: false, error: "Données obligatoires manquantes." });
      }
      await setDoc(doc(db, "gallery_items", item.id), item);
      console.log(`[Firestore] Galerie mise à jour pour: ${item.id}`);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Delete Gallery Item
  app.delete("/api/admin/gallery/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await deleteDoc(doc(db, "gallery_items", id));
      console.log(`[Firestore] Galerie item supprimé: ${id}`);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET Vehicles
  app.get("/api/vehicles", async (req, res) => {
    try {
      const q = collection(db, "vehicles");
      const snap = await getDocs(q);
      let items = snap.docs.map(doc => doc.data());

      if (items.length === 0) {
        console.log("[Firestore] Seeding initial vehicles...");
        for (const item of initialVehiclesList) {
          await setDoc(doc(db, "vehicles", item.id), item);
        }
        items = initialVehiclesList;
      }
      res.json({ success: true, items });
    } catch (err: any) {
      console.error("[Vehicles GET error]", err);
      res.json({ success: true, items: initialVehiclesList, note: "Loaded from local memory due to firestore status" });
    }
  });

  // Create / Update Vehicle
  app.post("/api/admin/vehicles", requireAdmin, async (req, res) => {
    try {
      const item = req.body;
      if (!item.id || !item.name || !item.visualUrl) {
        return res.status(400).json({ success: false, error: "Données obligatoires manquantes." });
      }
      await setDoc(doc(db, "vehicles", item.id), item);
      console.log(`[Firestore] Véhicule mis à jour: ${item.id}`);
      res.json({ success: true });
    } catch (err: any) {
      res.status(550).json({ success: false, error: err.message });
    }
  });

  // Delete Vehicle
  app.delete("/api/admin/vehicles/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await deleteDoc(doc(db, "vehicles", id));
      console.log(`[Firestore] Véhicule supprimé: ${id}`);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API 2: Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Tous les champs (nom, email, message) sont requis." });
      }

      // We enforce steeve97113@hotmail.com destination (it can be stored elegantly)
      const id = "sub_" + Math.random().toString(36).substring(2, 12);
      const docRef = doc(db, "contact_submissions", id);

      await setDoc(docRef, {
        name,
        email,
        message: `${message} (Destinataire désigné: steeve97113@hotmail.com)`,
        createdAt: serverTimestamp()
      });

      console.log(`[Firestore] Message de contact enregistré pour id: ${id}`);
      res.json({
        success: true,
        message: "Message enregistré avec succès et transmis à l'unité de contact de l'examinateur.",
        transmissionEmail: "steeve97113@hotmail.com"
      });
    } catch (err: any) {
      console.error("[Firestore] Erreur lors de l'enregistrement du contact:", err);
      res.status(500).json({ error: err.message || "Impossible d'enregistrer le formulaire de contact." });
    }
  });

  // API 2.5: Get Blade Runner News (Dynamic RSS aggregator with fallback)
  app.get("/api/news", async (req, res) => {
    try {
      const fallbackNews = [
        {
          id: "news-1",
          title: "Blade Runner 2099 : Le tournage de la série avance chez Amazon Prime",
          description: "La série live-action historique produite par Ridley Scott et mettant en vedette Michelle Yeoh et Hunter Schafer avance dans ses studios à Prague. Elle fera le pont 50 ans après Blade Runner 2049.",
          date: "2026-05-24T12:00:00Z",
          imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
          link: "https://www.allocine.fr/series/ficheserie_gen_cserie=31641.html",
          source: "Allociné"
        },
        {
          id: "news-2",
          title: "Annapurna Interactive confirme le développement de Blade Runner 2033: Labyrinth",
          description: "Le tout premier jeu vidéo de la franchise développé en interne en 25 ans s'attache à dépeindre le travail d'un Blade Runner fatigué après le grand blackout de 2022.",
          date: "2026-04-18T10:30:00Z",
          imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
          link: "https://store.steampowered.com/app/2481050/Blade_Runner_2033_Labyrinth/",
          source: "Steam"
        },
        {
          id: "news-3",
          title: "Le jeu culte Blade Runner de Westwood Studios fête ses récents remasters",
          description: "Considéré comme l'une des meilleures adaptations de science-fiction de l'histoire, le jeu en voxel de 1997 fait à nouveau les gros titres des critiques rétro de GOG pour son incroyable rejouabilité.",
          date: "2026-03-05T14:15:00Z",
          imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800",
          link: "https://store.steampowered.com/app/1678420/Blade_Runner_Enhanced_Edition/",
          source: "GOG & Steam"
        },
        {
          id: "news-4",
          title: "Titan Comics publie l'arc final pour Blade Runner 2039",
          description: "Les aventures dessinées de Cleo et Ash dans l'univers sombre et pluvieux de la dystopie de Ridley Scott s'achèvent dans un somptueux volume grand format encensé par les critiques.",
          date: "2026-02-12T09:00:00Z",
          imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800",
          link: "https://titan-comics.com/",
          source: "Titan Comics"
        }
      ];

      try {
        const response = await fetch("https://news.google.com/rss/search?q=Blade+Runner&hl=fr&gl=FR&ceid=FR:fr", {
          signal: AbortSignal.timeout(4000)
        });
        if (response.ok) {
          const xmlText = await response.text();
          const itemRegex = /<item>([\s\S]*?)<\/item>/g;
          const items: any[] = [];
          let match;
          let idCount = 1;

          while ((match = itemRegex.exec(xmlText)) !== null && items.length < 8) {
            const itemContent = match[1];
            const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
            const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
            const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
            const descMatch = itemContent.match(/<description>([\s\S]*?)<\/description>/);
            
            if (titleMatch && linkMatch) {
              const fullTitle = titleMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
              const link = linkMatch[1].trim();
              const rawPubDate = pubDateMatch ? pubDateMatch[1].trim() : new Date().toUTCString();
              const rawDesc = descMatch ? descMatch[1].replace(/<[^>]*>/g, "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim() : "";
              
              let title = fullTitle;
              let source = "Google News Feed";
              const lastDash = fullTitle.lastIndexOf(" - ");
              if (lastDash !== -1) {
                title = fullTitle.substring(0, lastDash).trim();
                source = fullTitle.substring(lastDash + 3).trim();
              }

              let imageUrl = "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=800";
              const lowerTitle = title.toLowerCase();
              if (lowerTitle.includes("game") || lowerTitle.includes("jeu") || lowerTitle.includes("westwood") || lowerTitle.includes("pc")) {
                imageUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800";
              } else if (lowerTitle.includes("2099") || lowerTitle.includes("serie") || lowerTitle.includes("scifi") || lowerTitle.includes("amazon")) {
                imageUrl = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800";
              } else if (lowerTitle.includes("comic") || lowerTitle.includes("livre") || lowerTitle.includes("titan")) {
                imageUrl = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800";
              } else if (lowerTitle.includes("film") || lowerTitle.includes("scott") || lowerTitle.includes("dystopie")) {
                imageUrl = "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800";
              }

              items.push({
                id: `rss-news-${idCount++}`,
                title,
                description: rawDesc ? (rawDesc.length > 250 ? rawDesc.substring(0, 247) + "..." : rawDesc) : "Cliquez sur l'article pour explorer les declassified records de cette actualité du LAPD.",
                date: new Date(rawPubDate).toISOString(),
                imageUrl,
                link,
                source
              });
            }
          }

          if (items.length > 0) {
            items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return res.json({ success: true, articles: items, cached: false });
          }
        }
      } catch (e) {
        console.warn("[RSS News] Impossible de récupérer le flux RSS distant, utilisation du fallback.");
      }

      fallbackNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      res.json({ success: true, articles: fallbackNews, cached: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Erreur lors de la récupération des actualités." });
    }
  });

  // API 3: Voight-Kampff test analysis using Gemini
  app.post("/api/voight-kampff/analyze", async (req, res) => {
    try {
      const { answers } = req.body;
      if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ error: "Les réponses de l'interrogatoire sont manquantes." });
      }

      const transcript = answers.map((ans: any, idx: number) => {
        return `Question ${idx + 1}: ${ans.scenario}\nRéponse choisie: ${ans.text} (${ans.description})\nOrientation: ${ans.suggestedAIType}`;
      }).join("\n\n");

      let verdict = "REPLICANT";
      let analysisText = "L'appareil respiratoire montre des saccades incompatibles avec un humain normal. Le sang se glace dans ses veines synthétiques.";

      if (ai) {
        try {
          const prompt = `Tu es un inspecteur émérite de l'unité des Blade Runners du LAPD à Los Angeles en Novembre 2019. Tu mènes un interrogatoire serré à l'aide de l'appareil de Voight-Kampff sur un suspect suspecté d'être un androïde (réplicant) Nexus-6 rebelle évadé de la Tyrell Corporation.
Voici les réactions physico-optiques recueillies par les senseurs optiques et capillaires de ta machine lors de la séance :

${transcript}

Analyse cliniquement et sur un ton viscéral l'interrogatoire du suspect. Écris ton rapport de manière poétique, sombre, rétro-futuriste, typiquement dans le style néo-noir du film Blade Runner (1982) réalisé par Ridley Scott. Décris précisément les micro-fluctuations oculaire (mouvements saccadés de l'iris, lueur rouge Schüfftan anormale aux questions émotionnelles), le rythme cardiaque fluctuant, la respiration saccadée et sa réaction symbolique aux animaux.
Rends un verdict définitif et tranché : le suspect est-il un HUMAIN ou un REPLICANT? Sois implacable.

Tu dois répondre impérativement sous forme de JSON valide avec exactement ces deux propriétés :
- 'verdict' : Une chaîne contenant soit 'REPLICANT' soit 'HUMAIN'.
- 'analysis' : Un texte riche en français d'au moins 3 paragraphes, rédigé à la première personne (en incarnant le Blade Runner), décrivant l'analyse biologique de ta machine et l'ambiguïté philosophique de l'interrogatoire.`;

          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  verdict: { type: Type.STRING, description: "REPLICANT ou HUMAIN" },
                  analysis: { type: Type.STRING, description: "Rapport d'analyse détaillé de l'examinateur à la première personne" }
                },
                required: ["verdict", "analysis"]
              },
              temperature: 0.85
            }
          });

          const resultText = response.text || "{}";
          const parsedResult = JSON.parse(resultText.trim());
          if (parsedResult.verdict && parsedResult.analysis) {
            verdict = parsedResult.verdict;
            analysisText = parsedResult.analysis;
          }
        } catch (geminiErr) {
          console.error("[Gemini] Échec génération contenu:", geminiErr);
          // Fallback algorithm if Gemini is missing or fails
          const replicantLeanCount = answers.filter((a: any) => a.suggestedAIType === "replicant-leaning").length;
          const highlyEvasiveCount = answers.filter((a: any) => a.suggestedAIType === "highly-evasive").length;
          
          if (replicantLeanCount + highlyEvasiveCount >= 2) {
            verdict = "REPLICANT";
            analysisText = "MONITEUR DU LAPD -- RAPPORT D'URGENCE DE REPLI-SCAN:\nLe suspect a montré un temps de latence de réaction oculaire suspect de 2.4 secondes sur les scénarios impliquant de la violence sur des animaux. La tension artérielle est restée constante malgré les stimulations verbales dérangeantes. Aucun sursaut oculaire de type Schüfftan n'a été enregistré directement, mais la rigidité des muscles faciaux et le choix d'options hypers-logiques amènent à un diagnostic de Nexus-6 à durée de vie limitée. Demande de retrait d'urgence transmise à l'unité.";
          } else {
            verdict = "HUMAIN";
            analysisText = "MONITEUR DU LAPD -- RAPPORT DE SÉURITÉ :\nLe sujet a réagi avec des temps de réponse fluctuants typiques d'un système limbique organique complexe. L'empathie démontrée sur les simulations animales (scénarios de la tortue et du homard) est corrélée à une accélération marquée du pouls et de la sudation cutanée. Le test de Voight-Kampff confirme l'absence de programmation artificielle. Le sujet est certifié biologique.";
          }
        }
      } else {
        console.warn("[Gemini] API non configurée, utilisation du diagnostic d'urgence de la console.");
        const replicantLeanCount = answers.filter((a: any) => a.suggestedAIType === "replicant-leaning").length;
        const highlyEvasiveCount = answers.filter((a: any) => a.suggestedAIType === "highly-evasive").length;
        
        if (replicantLeanCount + highlyEvasiveCount >= 2) {
          verdict = "REPLICANT";
          analysisText = "[TERMINAL SÉCURISÉ LAPD] -- DIAGNOSTIC ANALYTIQUE :\nLe sujet a fourni des réponses à l'éthique hautement mécanisée et intellectuelle. Les muscles faciaux sont restés totalement inertes. L'analyse révèle un temps de réponse trop régulier de 1.8 seconde, trahissant un processeur synaptique artificiel de génération Nexus-6. La réaction sur le homard plongé dans l'eau bouillante démontre une absence complète de résonnance empathique primaire. Sujet dangereux. Procédure de retrait recommandée.";
        } else {
          verdict = "HUMAIN";
          analysisText = "[TERMINAL SÉCURISÉ LAPD] -- DIAGNOSTIC ANALYTIQUE :\nL'empathie mesurée par les biocapteurs d'iris révèle une altération émotive évidente aux questions liées à la maltraitance. L'onde cérébrale alpha a chuté de 30% lors du scénario de l'insecte épinglé, témoigne d'un remords d'apprentissage affectif impossible à usurper par programmation. Sujet classifié biologique. Aucun danger de rébellion synthétique réplicante.";
        }
      }

      // Save VK Session to Firestore
      const id = "vk_" + Math.random().toString(36).substring(2, 12);
      const docRef = doc(db, "vk_sessions", id);

      const simpleAnswers = answers.map((a: any) => ({
        scenario: a.scenario.substring(0, 50) + "...",
        choice: a.text,
        type: a.suggestedAIType
      }));

      await setDoc(docRef, {
        answers: simpleAnswers,
        verdict,
        analysis: analysisText,
        createdAt: serverTimestamp()
      });

      console.log(`[Firestore] Session Voight-Kampff enregistrée pour id: ${id}, verdict: ${verdict}`);
      res.json({
        success: true,
        sessionId: id,
        verdict,
        analysis: analysisText
      });
    } catch (err: any) {
      console.error("[Firestore/Gemini] Erreur test Voight-Kampff:", err);
      res.status(500).json({ error: err.message || "Erreur lors du traitement du test de Voight-Kampff." });
    }
  });

  // API 3.5: Retrieve Voight-Kampff history
  app.get("/api/voight-kampff/history", async (req, res) => {
    try {
      const q = collection(db, "vk_sessions");
      const snap = await getDocs(q);
      const items = snap.docs.map(doc => {
        const data = doc.data();
        let timestamp = data.createdAt;
        if (timestamp && typeof timestamp.toDate === "function") {
          timestamp = timestamp.toDate().toISOString();
        } else if (timestamp && timestamp._seconds) {
          timestamp = new Date(timestamp._seconds * 1000).toISOString();
        } else if (!timestamp) {
          timestamp = new Date().toISOString();
        }
        return {
          id: doc.id,
          verdict: data.verdict,
          analysis: data.analysis,
          answers: data.answers,
          createdAt: timestamp
        };
      });

      // Sort newest first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json({ success: true, items });
    } catch (err: any) {
      console.error("[History GET error]", err);
      res.json({ success: false, items: [], error: err.message });
    }
  });

  // Serve static assets in production, setup Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Blade Runner Server] En écoute sur le port ${PORT}`);
    console.log(`[Blade Runner Server] Environnement: ${process.env.NODE_ENV || "development"}`);
  });
}

startServer();
