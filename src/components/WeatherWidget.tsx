import { useState, useEffect } from "react";
import { CloudRain, Cloud, Sun, CloudLightning, Wind, Thermometer, Droplets, AlertTriangle, RefreshCw } from "lucide-react";

interface WeatherData {
  temp: number;
  humidity: number;
  apparentTemp: number;
  precipitation: number;
  windSpeed: number;
  isDay: boolean;
  code: number;
  label: string;
  commentary: string;
  alertLevel: "LOW" | "MODERATE" | "CRITICAL";
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Translate weather codes to dystopian cyberpunk descriptions & comments
  const getWeatherDetails = (code: number, isDay: boolean, temp: number): { label: string; commentary: string; alertLevel: "LOW" | "MODERATE" | "CRITICAL" } => {
    // Standard WMO Weather codes
    if (code === 0) {
      return {
        label: "Smog Lumineux",
        commentary: isDay ? "Soleil voilé par la brume artificielle. Secteur Tyrell dégagé." : "Ciel noir d'ébène. Les néons publicitaires se reflètent sur le dôme de pollution.",
        alertLevel: "LOW"
      };
    } else if (code >= 1 && code <= 3) {
      return {
        label: "Smog Persistant",
        commentary: "Nuages bas saturés en particules de carbone. Trafic aérien des spinners aux instruments.",
        alertLevel: "LOW"
      };
    } else if (code === 45 || code === 48) {
      return {
        label: "Brouillard Acide",
        commentary: "Visibilité inférieure à 500m. Respirateurs faciaux recommandés pour les modèles de surface.",
        alertLevel: "MODERATE"
      };
    } else if (code >= 51 && code <= 55) {
      return {
        label: "Crachin Chimique",
        commentary: "Bruine corrosive persistante. Alerte de condensat sulfurique mineure.",
        alertLevel: "MODERATE"
      };
    } else if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
      const isHeavy = code === 65 || code === 82;
      return {
        label: isHeavy ? "Déluge Acide" : "Pluie Acide",
        commentary: isHeavy 
          ? "Précipitations hautement corrosives. Alerte évacuation des balcons. Spinners interdits d'altitude."
          : "Pluie noire traditionnelle de L.A. Port du trench-coat réglementaire de la LAPD conseillé.",
        alertLevel: isHeavy ? "CRITICAL" : "MODERATE"
      };
    } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
      return {
        label: "Chute de Cendres",
        commentary: "Précipitations de poussière grise d'origine industrielle. Pureté de l'air compromise à 85%.",
        alertLevel: "CRITICAL"
      };
    } else if (code >= 95) {
      return {
        label: "Orage Ionique",
        commentary: "Flashes électrostatiques intenses dans la haute atmosphère. Perturbations sur les mémoires quantiques.",
        alertLevel: "CRITICAL"
      };
    }

    // Fallback if temperature is very high or low
    if (temp > 32) {
      return {
        label: "Dôme de Chaleur",
        commentary: "Surchauffe des générateurs à fusion. Wallace Corp ordonne de couper les climatiseurs secondaires.",
        alertLevel: "MODERATE"
      };
    }

    return {
      label: "Atmosphère Stable",
      commentary: "Statut atmosphérique standard de la mégapole. Taux de radioactivité dans les normes.",
      alertLevel: "LOW"
    };
  };

  const fetchWeather = async () => {
    setLoading(true);
    setError(false);
    try {
      // Fetching from Open-Meteo API for Los Angeles
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=34.0522&longitude=-118.2437&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m"
      );
      if (!res.ok) throw new Error("API non accessible");
      const data = await res.json();
      
      if (data && data.current) {
        const c = data.current;
        const details = getWeatherDetails(c.weather_code, c.is_day === 1, c.temperature_2m);
        setWeather({
          temp: Math.round(c.temperature_2m),
          humidity: Math.round(c.relative_humidity_2m),
          apparentTemp: Math.round(c.apparent_temperature),
          precipitation: c.precipitation,
          windSpeed: Math.round(c.wind_speed_10m),
          isDay: c.is_day === 1,
          code: c.weather_code,
          label: details.label,
          commentary: details.commentary,
          alertLevel: details.alertLevel
        });
      } else {
        throw new Error("Format invalide");
      }
    } catch (e) {
      console.warn("Retrying with cyberpunk atmospheric simulation model...", e);
      // Perfect high-fidelity fallback when API fails or offline
      // Simulate typical dark rainy Los Angeles Blade Runner weather
      const fakeTemp = 14 + Math.floor(Math.random() * 6);
      const simulatedDetails = getWeatherDetails(63, false, fakeTemp);
      setWeather({
        temp: fakeTemp,
        humidity: 88,
        apparentTemp: fakeTemp - 2,
        precipitation: 1.2,
        windSpeed: 22,
        isDay: false,
        code: 63,
        label: simulatedDetails.label,
        commentary: simulatedDetails.commentary,
        alertLevel: simulatedDetails.alertLevel
      });
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // Refresh weather hourly
    const interval = setInterval(fetchWeather, 3600000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (code: number, alertLevel: string) => {
    const cls = `h-7 w-7 ${
      alertLevel === "CRITICAL"
        ? "text-red-400 animate-pulse"
        : alertLevel === "MODERATE"
        ? "text-amber-400 animate-pulse"
        : "text-cyan-400"
    }`;

    if (code === 0) return <Sun className={cls} />;
    if (code >= 1 && code <= 3) return <Cloud className={cls} />;
    if (code === 45 || code === 48) return <Cloud className={cls} />; // Fog
    if (code >= 51 && code <= 67) return <CloudRain className={cls} />;
    if (code >= 71 && code <= 77) return <Cloud className={cls} />; // Snow/Ash
    if (code >= 80 && code <= 82) return <CloudRain className={cls} />;
    if (code >= 95) return <CloudLightning className={cls} />;
    return <CloudRain className={cls} />;
  };

  return (
    <div id="weather_sidebar_widget" className="bg-gray-950/45 border border-cyan-500/10 rounded-xl p-3.5 space-y-3 font-mono text-[9px] relative overflow-hidden group hover:border-cyan-500/20 transition-all select-none">
      
      {/* Neon Scanline effect */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse" />

      {/* Widget Header with Refresh/Action controls */}
      <div className="flex items-center justify-between border-b border-gray-900/60 pb-2">
        <span className="text-[10px] font-display font-bold uppercase tracking-[0.15em] text-cyan-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping shrink-0" />
          MÉTÉO L.A. NOV 2019
        </span>
        <button
          onClick={fetchWeather}
          disabled={loading}
          className="text-gray-600 hover:text-cyan-400 disabled:opacity-50 transition-colors cursor-pointer"
          title="Consulter les capteurs satellites"
        >
          <RefreshCw className={`h-2.5 w-2.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-5 space-y-1.5 text-gray-500">
          <RefreshCw className="h-4 w-4 text-cyan-500/40 animate-spin" />
          <span className="animate-pulse select-none text-[8px] tracking-[0.1em] uppercase">RÉCEPTION DES CAPTEURS LAPD...</span>
        </div>
      ) : weather ? (
        <div className="space-y-3">
          {/* Temperature & Large Status Icon Block */}
          <div className="flex items-center gap-3 bg-gray-900/40 p-2.5 rounded-lg border border-gray-900/80">
            {getWeatherIcon(weather.code, weather.alertLevel)}
            <div className="flex-grow min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-black font-mono tracking-tight text-white">{weather.temp}°C</span>
                <span className="text-[8px] text-gray-500">Ressenti {weather.apparentTemp}°C</span>
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-cyan-400 truncate mt-0.5">
                {weather.label}
              </div>
            </div>
          </div>

          {/* Dystopian commentary narrative text */}
          <div className="bg-gray-900/25 p-2 rounded border border-gray-900 leading-normal text-gray-400 font-sans italic">
            "{weather.commentary}"
          </div>

          {/* Environmental metrics grid */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5 font-mono text-[8px] text-gray-500">
            <div className="flex items-center gap-1.5 bg-gray-900/20 p-1.5 rounded border border-gray-900/50">
              <Droplets className="h-3 w-3 text-cyan-600/80" />
              <div>
                <span className="block text-gray-600">HUMIDITÉ</span>
                <span className="text-gray-300 font-bold">{weather.humidity}%</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 bg-gray-900/20 p-1.5 rounded border border-gray-900/50">
              <Wind className="h-3 w-3 text-cyan-600/80" />
              <div>
                <span className="block text-gray-600">VENT TOURS</span>
                <span className="text-gray-300 font-bold">{weather.windSpeed} km/h</span>
              </div>
            </div>
          </div>

          {/* Alert levels warnings if any warning triggers */}
          {weather.alertLevel !== "LOW" && (
            <div className={`flex items-start gap-2 p-1.5 border rounded text-[7.5px] uppercase font-bold tracking-wider ${
              weather.alertLevel === "CRITICAL"
                ? "bg-red-950/30 border-red-500/20 text-red-400"
                : "bg-amber-950/20 border-amber-500/25 text-amber-500"
            }`}>
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <div>
                <span className="block text-[8px] tracking-widest font-black">
                  ALERTE SÉCURITÉ {weather.alertLevel} :
                </span>
                <span className="font-normal font-sans text-[7.5px] lowercase leading-normal tracking-normal block mt-0.5">
                  {weather.alertLevel === "CRITICAL" 
                    ? "exposition externe interdite sans protection homologuée LAPD."
                    : "prudence recommandée lors des déplacements en Spinner aérien."
                  }
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="text-[7px] text-gray-600 uppercase text-center mt-2 tracking-widest leading-none">
              // MODE SIMULATION ATMOSPHÉRIQUE ACTIVE //
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
