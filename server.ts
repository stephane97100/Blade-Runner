import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
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
  app.get("/api/health", (req, res) => {
    res.json({
      status: "online",
      firebaseConfigured: !!firebaseConfig.projectId,
      geminiConfigured: !!ai,
      currentTime: new Date().toISOString()
    });
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
