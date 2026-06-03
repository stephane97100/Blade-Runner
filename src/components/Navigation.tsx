import { AnimatePresence } from "motion/react";
import { Eye, Film, Layers, BookOpen, Settings, Send, Users, Menu, X, Shield, HelpCircle, FastForward, Image, Newspaper, Gamepad2, Compass, Lock, Github } from "lucide-react";
import WeatherWidget from "./WeatherWidget";

export type NavTab = "film" | "galerie" | "versions" | "book" | "makingof" | "actors" | "devenus" | "suite" | "contact" | "vk" | "westwood" | "vehicules" | "actualites" | "admin";

interface NavigationProps {
  currentTab: NavTab;
  setTab: (tab: NavTab) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Navigation({ currentTab, setTab, mobileOpen, setMobileOpen }: NavigationProps) {
  const tabs = [
    { id: "film", label: "Le Film", icon: <Film className="h-4 w-4" /> },
    { id: "galerie", label: "Galerie d'Art", icon: <Image className="h-4 w-4" /> },
    { id: "vehicules", label: "Véhicules", icon: <Compass className="h-4 w-4" /> },
    { id: "versions", label: "Les Versions", icon: <Layers className="h-4 w-4" /> },
    { id: "book", label: "Livre vs Film", icon: <BookOpen className="h-4 w-4" /> },
    { id: "makingof", label: "Le Tournage", icon: <Settings className="h-4 w-4" /> },
    { id: "actors", label: "Les Acteurs", icon: <Users className="h-4 w-4" /> },
    { id: "devenus", label: "Que sont-ils devenus ?", icon: <HelpCircle className="h-4 w-4" /> },
    { id: "suite", label: "La Suite", icon: <FastForward className="h-4 w-4" /> },
    { id: "westwood", label: "Le Jeu Westwood", icon: <Gamepad2 className="h-4 w-4" /> },
    { id: "actualites", label: "Actualités", icon: <Newspaper className="h-4 w-4" /> },
    { id: "contact", label: "Dépôt de Contact", icon: <Send className="h-4 w-4" /> },
    { id: "vk", label: "Test Voight-Kampff", icon: <Eye className="h-4 w-4" /> },
    { id: "admin", label: "Console Administrateur", icon: <Lock className="h-4 w-4" /> }
  ] as const;

  return (
    <>
      {/* Laptop / Desktop HUD Side-board Rail (hidden on mobile) */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-950/70 border-r border-cyan-500/10 backdrop-blur-md p-6 h-[calc(100vh-4rem)] sticky top-16 space-y-6 select-none shrink-0 overflow-y-auto scrollbar-none">
        
        {/* Connection status stamp */}
        <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-lg p-3 space-y-1.5 flicker-effect">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Shield className="h-4 w-4" />
            <span className="text-[10px] font-display font-medium tracking-widest uppercase">CONCURRENCE OK</span>
          </div>
          <span className="block text-[9px] font-mono text-gray-500 uppercase">SYS_PORT: 3000 // LAPD_ROOT</span>
        </div>

        {/* Real-time Dystopian Weather widget */}
        <WeatherWidget />

        {/* List of Navigation shortcuts */}
        <div className="space-y-1">
          <span className="text-[9px] font-mono font-bold tracking-widest text-gray-500 uppercase block mb-3 px-2">
            CONTRÔLE MAINFRAME :
          </span>
          <nav className="space-y-1.5">
            {tabs.map((tab) => {
              const active = tab.id === currentTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTab(tab.id as NavTab)}
                  className={`w-full flex items-center space-x-3.5 px-4 py-3 text-xs font-display uppercase tracking-widest font-semibold rounded-lg border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                    active
                      ? "bg-cyan-950/30 border-cyan-500/30 text-cyan-300 shadow-[inset_0_0_10px_rgba(6,182,212,0.05)]"
                      : "border-transparent text-gray-400 hover:text-white hover:bg-gray-900/40 hover:border-gray-800"
                  }`}
                >
                  {/* Glowing left dot */}
                  {active && (
                    <span className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-1/2 bg-cyan-400 rounded-r-sm"></span>
                  )}

                  <span className={`${active ? "text-cyan-400" : "text-gray-500 group-hover:text-cyan-400"} transition-colors shrink-0`}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Small trademark license label */}
        <div className="text-[9px] font-mono text-gray-600 mt-auto pt-4 border-t border-gray-900 leading-normal uppercase">
          <p>© BLADE RUNNER // 1982</p>
          <p>DIR: RIDLEY SCOTT</p>
          <p>SYS DATA TRANSIT PROTECT</p>
          <a
            href="https://github.com/steeve97113/blade-runner-world"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 mt-2.5 text-[8.5px] font-mono text-cyan-400 hover:text-cyan-300 font-bold tracking-wider transition-all cursor-pointer uppercase select-none"
          >
            <Github className="h-3 w-3" />
            <span>[ SOURCE GITHUB ]</span>
          </a>
        </div>
      </aside>

      {/* Mobile drawer dialogue (shown when mobileOpen is true) */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-gray-950/95 lg:hidden flex flex-col justify-center p-6">
            
            {/* Top close bar */}
            <div className="absolute top-5 right-5">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 bg-gray-900 rounded-lg border border-gray-800 text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Logo area */}
            <div className="mb-10 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">CONSOLE LAPD MOBILE</span>
              <h1 className="text-xl font-display font-semibold text-white tracking-widest uppercase">BLADE RUNNER</h1>
            </div>

            {/* List links */}
            <nav className="space-y-3.5 max-w-xs mx-auto w-full mb-4">
              {tabs.map((tab) => {
                const active = tab.id === currentTab;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setTab(tab.id as NavTab);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-5 py-4 text-xs font-display uppercase tracking-widest font-semibold rounded-xl border transition-all cursor-pointer ${
                      active
                        ? "bg-cyan-950/40 border-cyan-400/40 text-cyan-300"
                        : "bg-gray-950/40 border-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className={active ? "text-cyan-400" : "text-gray-500"}>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="text-center mt-2 pb-6">
              <a
                href="https://github.com/steeve97113/blade-runner-world"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-[9px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors uppercase font-bold tracking-widest"
              >
                <Github className="h-3 w-3" />
                <span>[ SOURCE CODE GITHUB ]</span>
              </a>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
