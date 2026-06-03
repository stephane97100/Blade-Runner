import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Unlock, Key, Shield, LogOut, Check, Save, Plus, Trash2, Edit2, X, RefreshCw, AlertTriangle, Image as ImageIcon, FileText, Settings, Compass } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: "vaisseaux" | "villes" | "personnages";
  medium: string;
  artist: string;
  date: string;
  catalogId: string;
  description: string;
  technicalSpec: string;
  imageUrl: string;
}

interface Vehicle {
  id: string;
  name: string;
  category: string;
  description: string;
  lore: string;
  visualUrl: string;
  specs: {
    maxSpeed: string;
    propulsion: string;
    armor: string;
    crew: string;
    length: string;
    weapons?: string;
  };
}

export default function AdminView() {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bladeRunner_adminToken");
    }
    return null;
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeSubTab, setActiveSubTab] = useState<"gallery" | "vehicles">("gallery");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Edit / Add Item States
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryItem> | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Partial<Vehicle> | null>(null);

  // Sound triggers
  const playBeep = (freq: number, type: "sine" | "triangle" | "sawtooth" = "sine", duration = 0.08) => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem("bladeRunner_soundEnabled") === "false") return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (_) {}
  };

  // Fetch lists
  const refreshData = async () => {
    setLoadingData(true);
    try {
      const rGallery = await fetch("/api/gallery");
      const dGallery = await rGallery.json();
      if (dGallery.success) setGalleryItems(dGallery.items);

      const rVehicles = await fetch("/api/vehicles");
      const dVehicles = await rVehicles.json();
      if (dVehicles.success) setVehicles(dVehicles.items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      refreshData();
    }
  }, [token]);

  // Login action
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    playBeep(440, "triangle");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (response.ok && data.success && data.token) {
        setToken(data.token);
        localStorage.setItem("bladeRunner_adminToken", data.token);
        playBeep(880, "sine", 0.15);
        setUsername("");
        setPassword("");
      } else {
        setLoginError(data.error || "Échec de l'authentification.");
        playBeep(220, "sawtooth", 0.2);
      }
    } catch (err) {
      setLoginError("Erreur lors de la connexion au serveur central LAPD.");
      playBeep(180, "sawtooth", 0.25);
    } finally {
      setLoggingIn(false);
    }
  };

  // Logout action
  const handleLogout = () => {
    playBeep(330, "sine");
    setToken(null);
    localStorage.removeItem("bladeRunner_adminToken");
    setGalleryItems([]);
    setVehicles([]);
  };

  // Submit/Save Gallery Item
  const handleSaveGallery = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingGallery || !editingGallery.id || !editingGallery.title || !editingGallery.imageUrl) {
      alert("Veuillez remplir les informations obligatoires (ID, Titre, URL Image).");
      return;
    }
    try {
      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editingGallery)
      });
      if (response.ok) {
        playBeep(660, "sine");
        setEditingGallery(null);
        refreshData();
      } else {
        const d = await response.json();
        alert(`Erreur: ${d.error}`);
      }
    } catch (e) {
      alert("Impossible d'enregistrer la galerie.");
    }
  };

  // Delete Gallery Item
  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet élément de la galerie d'art ?")) return;
    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        playBeep(150, "sawtooth");
        refreshData();
      }
    } catch (e) {
      alert("Erreur de suppression.");
    }
  };

  // Submit/Save Vehicle
  const handleSaveVehicle = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingVehicle || !editingVehicle.id || !editingVehicle.name || !editingVehicle.visualUrl) {
      alert("Veuillez remplir les informations obligatoires (ID, Nom, URL Visuel).");
      return;
    }
    try {
      const response = await fetch("/api/admin/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editingVehicle)
      });
      if (response.ok) {
        playBeep(660, "sine");
        setEditingVehicle(null);
        refreshData();
      } else {
        const d = await response.json();
        alert(`Erreur: ${d.error}`);
      }
    } catch (e) {
      alert("Impossible d'enregistrer le véhicule.");
    }
  };

  // Delete Vehicle
  const handleDeleteVehicle = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer définitivement ce véhicule de la base ?")) return;
    try {
      const response = await fetch(`/api/admin/vehicles/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        playBeep(150, "sawtooth");
        refreshData();
      }
    } catch (e) {
      alert("Erreur de suppression.");
    }
  };

  // Pre-seed helper for new items
  const startAddGallery = () => {
    playBeep(480);
    setEditingGallery({
      id: "art_" + Math.random().toString(36).substring(2, 8),
      title: "",
      category: "vaisseaux",
      medium: "Aérographe et Gouache sur canson",
      artist: "Syd Mead",
      date: new Date().getFullYear().toString(),
      catalogId: "ART-NEW-" + Math.floor(Math.random() * 1000),
      description: "",
      technicalSpec: "",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
    });
  };

  const startAddVehicle = () => {
    playBeep(480);
    setEditingVehicle({
      id: "veh_" + Math.random().toString(36).substring(2, 8),
      name: "",
      category: "Spécification Volante (VTOL)",
      description: "",
      lore: "",
      visualUrl: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=800",
      specs: {
        maxSpeed: "400 km/h",
        propulsion: "Turbines ioniques jumelles",
        armor: "Alliage composite de titane",
        crew: "2 Membres",
        length: "5.0 Mètres",
        weapons: "Non équipé"
      }
    });
  };

  // --- RENDERING 1: LOGIN CARD ---
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] px-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-gray-950 border border-cyan-500/20 rounded-xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.05)]"
        >
          {/* Futuristic grid scan overlays */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-pulse" />
          
          <div className="flex flex-col items-center text-center space-y-2 mb-8 select-none">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
              <Lock className="h-5 w-5 animate-pulse" />
            </div>
            <h1 className="text-sm font-display font-bold uppercase tracking-[0.2em] text-white">
              MAINFRAME CENTRAL LAPD
            </h1>
            <p className="text-[10px] font-mono tracking-widest text-cyan-500 uppercase">
              RESECTION ADMINISTRATEUR REPLICANT
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono font-bold tracking-widest text-gray-500 uppercase block pl-1">
                UNITÉ IDENTIFIANT :
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ex: mistermaster"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2.5 pl-4 pr-10 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10 transition-all uppercase"
                />
                <Shield className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-mono font-bold tracking-widest text-gray-500 uppercase block pl-1">
                CODE D&apos;AUTORISATION QUANTIQUE :
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2.5 pl-4 pr-10 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10 transition-all"
                />
                <Key className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600" />
              </div>
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-red-950/30 border border-red-500/20 text-[10px] font-mono text-red-400 rounded-lg uppercase tracking-wider flex items-start gap-2.5"
              >
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                <span>{loginError}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-cyan-950/30 hover:bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-500 text-cyan-400 hover:text-cyan-300 font-display text-[10px] uppercase font-bold tracking-[0.2em] py-3.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.05)]"
            >
              {loggingIn ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>DECRYPTAGE DU PROTOCOLE...</span>
                </>
              ) : (
                <>
                  <Unlock className="h-3.5 w-3.5 mr-1" />
                  <span>DÉVERROUILLER LA SEMAQUE</span>
                </>
              )}
            </button>
          </form>

          <p className="text-[8px] font-mono text-gray-600 text-center mt-6 uppercase leading-relaxed">
            ACCÈS RÉSERVÉ RECOLLECTION CRITIQUE // SÉRETÉ INTERNE LAPD
            <br />
            IP ENREGISTRÉE - PROTÉGÉE PAR RETINAL SCAN VERIFICATION
          </p>
        </motion.div>
      </div>
    );
  }

  // --- RENDERING 2: AUTHORIZED CONSOLE ---
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-3">
            <span className="p-1 px-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded text-emerald-400 font-mono text-[9px] font-black tracking-widest animate-pulse uppercase">
              CONSOLE : ROOT_CONNECTED // COHÉRENCE PARFAITE
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-black tracking-widest text-white uppercase flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-400 animate-spin [animation-duration:15s]" />
            GESTION DES ARCHIVES MEDIA BR
          </h1>
          <p className="text-xs text-gray-400 font-mono leading-relaxed uppercase">
            Mettez à jour les images, croquis techniques et descriptions narratives de l&apos;application en temps réel
          </p>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-900 hover:bg-red-950/20 border border-gray-800 hover:border-red-500/30 rounded-xl text-gray-400 hover:text-red-400 font-mono text-[10px] tracking-wider transition-all uppercase cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Fermer la session</span>
          </button>
        </div>
      </div>

      {/* Selector Subtabs */}
      <div className="flex items-center space-x-3 border-b border-gray-900/60 pb-3">
        <button
          onClick={() => { playBeep(500); setActiveSubTab("gallery"); }}
          className={`px-4.5 py-2.5 rounded-lg font-mono text-xs uppercase tracking-widest border transition-all cursor-pointer ${
            activeSubTab === "gallery"
              ? "bg-purple-950/30 border-purple-500/30 text-purple-400"
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          🖼️ GALERIE D&apos;ART ({galleryItems.length})
        </button>
        <button
          onClick={() => { playBeep(500); setActiveSubTab("vehicles"); }}
          className={`px-4.5 py-2.5 rounded-lg font-mono text-xs uppercase tracking-widest border transition-all cursor-pointer ${
            activeSubTab === "vehicles"
              ? "bg-amber-950/30 border-amber-500/30 text-amber-400"
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          🚀 VÉHICULES DU FUTUR ({vehicles.length})
        </button>
      </div>

      {loadingData ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3 font-mono text-xs text-gray-500">
          <RefreshCw className="h-6 w-6 text-cyan-500 animate-spin" />
          <span>SYNCHRONISATION EN COURS AVEC LE SERVEUR FIRESTORE...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {/* TAB 1: GALLERY ITEMS */}
            {activeSubTab === "gallery" && (
              <motion.div
                key="tab-gallery"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase">
                    REGISTRE ACTUEL : GALERIE DE SYD MEAD
                  </span>
                  <button
                    onClick={startAddGallery}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:border-cyan-400 rounded-lg font-mono text-[10px] font-bold tracking-widest uppercase cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>AJOUTER UN ARTWORK</span>
                  </button>
                </div>

                {/* Main Table Grid */}
                <div className="bg-gray-950 border border-gray-900 rounded-xl overflow-hidden select-none">
                  <table className="w-full text-left border-collapse font-mono text-[11px] text-gray-400">
                    <thead className="bg-gray-900/60 text-gray-500 uppercase text-[9px] tracking-widest border-b border-gray-900">
                      <tr>
                        <th className="py-3 px-4">Visuel</th>
                        <th className="py-3 px-4">Titre / ID</th>
                        <th className="py-3 px-4">Artiste / Categorie</th>
                        <th className="py-3 px-4">Technique</th>
                        <th className="py-3 px-4 text-right">Actions Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900">
                      {galleryItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-900/40 transition-all">
                          <td className="py-3 px-4">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-12 h-10 object-cover rounded border border-gray-800"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-white font-bold">{item.title}</div>
                            <div className="text-[9px] text-gray-500">ID : {item.id} // {item.catalogId}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div>{item.artist}</div>
                            <div className="text-cyan-500 text-[9px] uppercase">{item.category}</div>
                          </td>
                          <td className="py-3 px-4 truncate max-w-[12rem]">{item.medium}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => { playBeep(550); setEditingGallery(item); }}
                                className="p-2 hover:bg-cyan-950/40 rounded text-cyan-500 hover:text-cyan-400 transition-colors border border-transparent hover:border-cyan-500/20 cursor-pointer"
                                title="Modifier"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteGallery(item.id)}
                                className="p-2 hover:bg-red-950/40 rounded text-red-500 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20 cursor-pointer"
                                title="Supprimer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 2: VEHICLE ITEMS */}
            {activeSubTab === "vehicles" && (
              <motion.div
                key="tab-vehicles"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase">
                    REGISTRE ACTUEL : SYSTEME TECHNIQUE DES GÉANTS VOLANTS
                  </span>
                  <button
                    onClick={startAddVehicle}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:border-cyan-400 rounded-lg font-mono text-[10px] font-bold tracking-widest uppercase cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>AJOUTER UN VÉHICULE</span>
                  </button>
                </div>

                {/* Main Table Grid */}
                <div className="bg-gray-950 border border-gray-900 rounded-xl overflow-hidden select-none">
                  <table className="w-full text-left border-collapse font-mono text-[11px] text-gray-400">
                    <thead className="bg-gray-900/60 text-gray-500 uppercase text-[9px] tracking-widest border-b border-gray-900">
                      <tr>
                        <th className="py-3 px-4">Visuel</th>
                        <th className="py-3 px-4">Nom de Code / ID</th>
                        <th className="py-3 px-4">Catégorie</th>
                        <th className="py-3 px-4">Max Vitesse</th>
                        <th className="py-3 px-4 text-right">Actions Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900">
                      {vehicles.map((v) => (
                        <tr key={v.id} className="hover:bg-gray-900/40 transition-all">
                          <td className="py-3 px-4">
                            <img
                              src={v.visualUrl}
                              alt={v.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-10 object-cover rounded border border-gray-800"
                            />
                          </td>
                          <td className="py-3 px-4 text-white">
                            <div className="font-bold">{v.name}</div>
                            <div className="text-[9px] text-gray-500">ID : {v.id}</div>
                          </td>
                          <td className="py-3 px-4 text-cyan-400 text-[9px] uppercase">{v.category}</td>
                          <td className="py-3 px-4">{v.specs?.maxSpeed || "NON SPÉCIFIÉ"}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => { playBeep(550); setEditingVehicle(v); }}
                                className="p-2 hover:bg-cyan-950/40 rounded text-cyan-500 hover:text-cyan-400 transition-colors border border-transparent hover:border-cyan-500/20 cursor-pointer"
                                title="Modifier"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteVehicle(v.id)}
                                className="p-2 hover:bg-red-950/40 rounded text-red-500 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20 cursor-pointer"
                                title="Supprimer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* --- MODAL DIALOGS: CREATE / EDIT GALLERY ITEM --- */}
      <AnimatePresence>
        {editingGallery && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-950 border border-purple-500/30 rounded-xl w-full max-w-2xl overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)] max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="h-14 bg-gray-900 border-b border-gray-800 px-6 flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  EDITION GALERIE D&apos;ART
                </span>
                <button
                  onClick={() => { playBeep(330); setEditingGallery(null); }}
                  className="p-1 hover:bg-gray-800 rounded text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveGallery} className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-500 block mb-1">ID UNIQUE (Non Modifiable si déjà créé) :</label>
                    <input
                      type="text"
                      required
                      value={editingGallery.id || ""}
                      onChange={(e) => setEditingGallery({ ...editingGallery, id: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">Titre de l&apos;œuvre :</label>
                    <input
                      type="text"
                      required
                      value={editingGallery.title || ""}
                      onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-500 block mb-1">Catégorie :</label>
                    <select
                      value={editingGallery.category || "vaisseaux"}
                      onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value as any })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500/40"
                    >
                      <option value="vaisseaux">Vaisseaux (Art conceptuel)</option>
                      <option value="villes">Villes (Environnements urbains)</option>
                      <option value="personnages">Personnages (Costumes & Maquillages)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">ID Catalogue (Ref interne) :</label>
                    <input
                      type="text"
                      required
                      value={editingGallery.catalogId || ""}
                      onChange={(e) => setEditingGallery({ ...editingGallery, catalogId: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-500 block mb-1">Artiste :</label>
                    <input
                      type="text"
                      required
                      value={editingGallery.artist || ""}
                      onChange={(e) => setEditingGallery({ ...editingGallery, artist: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">Date Originale :</label>
                    <input
                      type="text"
                      required
                      value={editingGallery.date || ""}
                      onChange={(e) => setEditingGallery({ ...editingGallery, date: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">Support de Peinture :</label>
                    <input
                      type="text"
                      required
                      value={editingGallery.medium || ""}
                      onChange={(e) => setEditingGallery({ ...editingGallery, medium: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-500 block mb-1">URL ABSOLUE DE L&apos;IMAGE :</label>
                  <input
                    type="url"
                    required
                    value={editingGallery.imageUrl || ""}
                    onChange={(e) => setEditingGallery({ ...editingGallery, imageUrl: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-cyan-400 focus:outline-none focus:border-purple-500/40"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">Renseignez un lien HTTPS valide (Unsplash, imgur, ou local comme /src/assets/images/...)</span>
                </div>

                <div>
                  <label className="text-gray-500 block mb-1">Description Narrative Historique :</label>
                  <textarea
                    rows={3}
                    required
                    value={editingGallery.description || ""}
                    onChange={(e) => setEditingGallery({ ...editingGallery, description: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500/40 resize-none"
                  />
                </div>

                <div>
                  <label className="text-gray-500 block mb-1">Spécifications Techniques de Production :</label>
                  <input
                    type="text"
                    required
                    value={editingGallery.technicalSpec || ""}
                    onChange={(e) => setEditingGallery({ ...editingGallery, technicalSpec: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500/40"
                  />
                </div>

                <div className="pt-4 border-t border-gray-900 flex justify-end space-x-3.5">
                  <button
                    type="button"
                    onClick={() => { playBeep(330); setEditingGallery(null); }}
                    className="px-4.5 py-2.5 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white rounded-lg cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-purple-950/40 border border-purple-500 text-purple-400 hover:text-purple-300 rounded-lg cursor-pointer flex items-center gap-2 font-bold"
                  >
                    <Save className="h-4 w-4" />
                    <span>ENREGISTRER LA FICHE</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL DIALOGS: CREATE / EDIT VEHICLE --- */}
      <AnimatePresence>
        {editingVehicle && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-950 border border-amber-500/30 rounded-xl w-full max-w-2xl overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.15)] max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="h-14 bg-gray-900 border-b border-gray-800 px-6 flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase flex items-center gap-2">
                  <Compass className="h-4 w-4" />
                  EDITION VÉHICULE MULTI-TERRE
                </span>
                <button
                  onClick={() => { playBeep(330); setEditingVehicle(null); }}
                  className="p-1 hover:bg-gray-800 rounded text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveVehicle} className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-500 block mb-1">ID DE BASE UNIQUE :</label>
                    <input
                      type="text"
                      required
                      value={editingVehicle.id || ""}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, id: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">Nom du Véhicule (Code) :</label>
                    <input
                      type="text"
                      required
                      value={editingVehicle.name || ""}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-500 block mb-1">Classification :</label>
                    <select
                      value={editingVehicle.category || "Spécification Volante (VTOL)"}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, category: e.target.value as any })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none"
                    >
                      <option value="Spécification Volante (VTOL)">Spécification Volante (VTOL)</option>
                      <option value="Unité de Surface">Unité de Surface (Terrestre)</option>
                      <option value="Transport Spatial">Transport Spatial (Interstellaire)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">URL ABSOLUE VISUEL :</label>
                    <input
                      type="url"
                      required
                      value={editingVehicle.visualUrl || ""}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, visualUrl: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-cyan-400 focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-500 block mb-1">Description Sommaire :</label>
                  <textarea
                    rows={2}
                    required
                    value={editingVehicle.description || ""}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, description: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500/40 resize-none"
                  />
                </div>

                <div>
                  <label className="text-gray-500 block mb-1">Analyse Documentaire (Lore complet) :</label>
                  <textarea
                    rows={3}
                    required
                    value={editingVehicle.lore || ""}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, lore: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500/40 resize-none"
                  />
                </div>

                {/* Technical specs block */}
                <div className="bg-gray-900/60 p-4 border border-gray-900 rounded-lg space-y-3">
                  <span className="text-[10px] text-amber-500 font-bold tracking-wider block">SPÉCIFICATIONS TECHNIQUES INDIVIDUELLES</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-500 block mb-0.5">Vitesse Limite :</label>
                      <input
                        type="text"
                        required
                        value={editingVehicle.specs?.maxSpeed || ""}
                        onChange={(e) => setEditingVehicle({
                          ...editingVehicle,
                          specs: { ...editingVehicle.specs!, maxSpeed: e.target.value }
                        })}
                        className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-0.5">Technologie Propulsion :</label>
                      <input
                        type="text"
                        required
                        value={editingVehicle.specs?.propulsion || ""}
                        onChange={(e) => setEditingVehicle({
                          ...editingVehicle,
                          specs: { ...editingVehicle.specs!, propulsion: e.target.value }
                        })}
                        className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-gray-500 block mb-0.5">Matériaux Blindage :</label>
                      <input
                        type="text"
                        required
                        value={editingVehicle.specs?.armor || ""}
                        onChange={(e) => setEditingVehicle({
                          ...editingVehicle,
                          specs: { ...editingVehicle.specs!, armor: e.target.value }
                        })}
                        className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-0.5">Équipage Opérationnel :</label>
                      <input
                        type="text"
                        required
                        value={editingVehicle.specs?.crew || ""}
                        onChange={(e) => setEditingVehicle({
                          ...editingVehicle,
                          specs: { ...editingVehicle.specs!, crew: e.target.value }
                        })}
                        className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-0.5">Longueur Totale :</label>
                      <input
                        type="text"
                        required
                        value={editingVehicle.specs?.length || ""}
                        onChange={(e) => setEditingVehicle({
                          ...editingVehicle,
                          specs: { ...editingVehicle.specs!, length: e.target.value }
                        })}
                        className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-500 block mb-0.5">Armements d&apos;interception intégrés :</label>
                    <input
                      type="text"
                      value={editingVehicle.specs?.weapons || ""}
                      onChange={(e) => setEditingVehicle({
                        ...editingVehicle,
                        specs: { ...editingVehicle.specs!, weapons: e.target.value }
                      })}
                      className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white"
                      placeholder="laisser vide si non équipé"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-900 flex justify-end space-x-3.5">
                  <button
                    type="button"
                    onClick={() => { playBeep(330); setEditingVehicle(null); }}
                    className="px-4.5 py-2.5 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white rounded-lg cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-950/40 border border-amber-500 text-amber-500 hover:text-amber-400 rounded-lg cursor-pointer flex items-center gap-2 font-bold"
                  >
                    <Save className="h-4 w-4" />
                    <span>ENREGISTRER LA FICHE VÉHICULE</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
