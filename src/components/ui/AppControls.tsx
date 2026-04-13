"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { Search, Moon, Sun, Type, Settings2 } from "lucide-react";
import SearchModal from "./SearchModal";

// ============================================
// Theme & Accessibility Context
// ============================================
interface AppSettings {
  theme: "light" | "dark";
  textSize: "normal" | "large" | "xlarge";
}

const AppSettingsContext = createContext<{
  settings: AppSettings;
  setTheme: (t: "light" | "dark") => void;
  setTextSize: (s: "normal" | "large" | "xlarge") => void;
}>({
  settings: { theme: "light", textSize: "normal" },
  setTheme: () => {},
  setTextSize: () => {},
});

export function useAppSettings() {
  return useContext(AppSettingsContext);
}

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>({
    theme: "light",
    textSize: "normal",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sr_app_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        document.documentElement.setAttribute("data-theme", parsed.theme);
        document.documentElement.setAttribute("data-text-size", parsed.textSize);
      } catch {}
    }
  }, []);

  const persist = useCallback((s: AppSettings) => {
    localStorage.setItem("sr_app_settings", JSON.stringify(s));
    document.documentElement.setAttribute("data-theme", s.theme);
    document.documentElement.setAttribute("data-text-size", s.textSize);
  }, []);

  const setTheme = useCallback((t: "light" | "dark") => {
    setSettings(prev => {
      const next = { ...prev, theme: t };
      persist(next);
      return next;
    });
  }, [persist]);

  const setTextSize = useCallback((s: "normal" | "large" | "xlarge") => {
    setSettings(prev => {
      const next = { ...prev, textSize: s };
      persist(next);
      return next;
    });
  }, [persist]);

  if (!mounted) return <>{children}</>;

  return (
    <AppSettingsContext.Provider value={{ settings, setTheme, setTextSize }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

// ============================================
// Floating controls (search + settings)
// ============================================
export function AppControlBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const { settings, setTheme, setTextSize } = useAppSettings();

  // Cmd+K shortcut
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      {/* Top bar with search + settings */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 pb-2 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, var(--bg) 60%, transparent)" }}
      >
        <div className="flex items-center gap-2 max-w-lg mx-auto pointer-events-auto">
          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm transition-all press-effect"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              boxShadow: "0 2px 8px var(--shadow-color)",
            }}
          >
            <Search className="w-4 h-4" />
            <span>Sök i appen...</span>
          </button>

          {/* Settings toggle */}
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all press-effect"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "0 2px 8px var(--shadow-color)",
              color: "var(--text-secondary)",
            }}
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

        {/* Settings panel */}
        {panelOpen && (
          <div
            className="max-w-lg mx-auto mt-2 rounded-xl p-4 pointer-events-auto animate-slideUp"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 30px var(--shadow-color)",
            }}
          >
            {/* Theme */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium" style={{ color: "var(--text)" }}>Tema</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setTheme("light")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    settings.theme === "light"
                      ? "bg-amber-100 text-amber-700"
                      : ""
                  }`}
                  style={settings.theme !== "light" ? { background: "var(--border-light)", color: "var(--text-secondary)" } : {}}
                >
                  <Sun className="w-3.5 h-3.5 inline mr-1" />
                  Ljust
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    settings.theme === "dark"
                      ? "bg-indigo-100 text-indigo-700"
                      : ""
                  }`}
                  style={settings.theme !== "dark" ? { background: "var(--border-light)", color: "var(--text-secondary)" } : {}}
                >
                  <Moon className="w-3.5 h-3.5 inline mr-1" />
                  Mörkt
                </button>
              </div>
            </div>

            {/* Text size */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: "var(--text)" }}>Textstorlek</span>
              <div className="flex gap-1">
                {([
                  { key: "normal", label: "A", size: "text-xs" },
                  { key: "large", label: "A", size: "text-sm" },
                  { key: "xlarge", label: "A", size: "text-base" },
                ] as const).map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setTextSize(opt.key)}
                    className={`w-9 h-9 rounded-lg font-bold transition-all flex items-center justify-center ${opt.size} ${
                      settings.textSize === opt.key
                        ? "bg-green-100 text-green-700"
                        : ""
                    }`}
                    style={settings.textSize !== opt.key ? { background: "var(--border-light)", color: "var(--text-secondary)" } : {}}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
