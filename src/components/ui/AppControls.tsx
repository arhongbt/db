"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { Search, Moon, Sun } from "lucide-react";
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

  const fixDarkInlineStyles = useCallback((isDark: boolean) => {
    if (!isDark) return;
    // Color mappings: light → dark
    const colorMap: Record<string, string> = {
      '#F7F5F0': 'var(--bg)',
      '#f7f5f0': 'var(--bg)',
      '#FFFFFF': 'var(--bg-card)',
      '#ffffff': 'var(--bg-card)',
      'white': 'var(--bg-card)',
      '#E8E4DE': 'var(--border)',
      '#e8e4de': 'var(--border)',
      '#F0EDE6': 'var(--border-light)',
      '#f0ede6': 'var(--border-light)',
      '#2A2622': 'var(--text)',
      '#2a2622': 'var(--text)',
      '#524B45': 'var(--text-secondary)',
      '#524b45': 'var(--text-secondary)',
      '#6B6560': 'var(--text-secondary)',
      '#6b6560': 'var(--text-secondary)',
      '#EEF2EA': 'var(--accent-soft)',
      '#eef2ea': 'var(--accent-soft)',
    };
    requestAnimationFrame(() => {
      document.querySelectorAll('[style]').forEach(el => {
        const style = (el as HTMLElement).style;
        // Fix background
        if (style.background) {
          let bg = style.background;
          Object.entries(colorMap).forEach(([from, to]) => {
            bg = bg.replace(new RegExp(from.replace('#', '\\#'), 'gi'), to);
          });
          if (bg !== style.background) style.background = bg;
        }
        if (style.backgroundColor) {
          Object.entries(colorMap).forEach(([from, to]) => {
            if (style.backgroundColor.toLowerCase().includes(from.toLowerCase())) {
              style.backgroundColor = to;
            }
          });
        }
        // Fix border-color
        if (style.borderColor) {
          Object.entries(colorMap).forEach(([from, to]) => {
            if (style.borderColor.toLowerCase().includes(from.toLowerCase())) {
              style.borderColor = to;
            }
          });
        }
        // Fix color
        if (style.color) {
          Object.entries(colorMap).forEach(([from, to]) => {
            if (style.color.toLowerCase().includes(from.toLowerCase())) {
              style.color = to;
            }
          });
        }
      });
    });
  }, []);

  // Re-run inline style fixer on navigation / DOM changes
  useEffect(() => {
    if (settings.theme !== 'dark') return;
    const observer = new MutationObserver(() => fixDarkInlineStyles(true));
    observer.observe(document.body, { childList: true, subtree: true });
    fixDarkInlineStyles(true);
    return () => observer.disconnect();
  }, [settings.theme, fixDarkInlineStyles]);

  const persist = useCallback((s: AppSettings) => {
    localStorage.setItem("sr_app_settings", JSON.stringify(s));
    document.documentElement.setAttribute("data-theme", s.theme);
    document.documentElement.setAttribute("data-text-size", s.textSize);
    fixDarkInlineStyles(s.theme === 'dark');
  }, [fixDarkInlineStyles]);

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
  const { settings, setTheme } = useAppSettings();

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

          {/* Dark mode toggle */}
          <button
            onClick={() => setTheme(settings.theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all press-effect"
            style={{
              background: settings.theme === "dark" ? "#374151" : "var(--bg-card)",
              border: `1px solid ${settings.theme === "dark" ? "#4B5563" : "var(--border)"}`,
              boxShadow: "0 2px 8px var(--shadow-color)",
              color: settings.theme === "dark" ? "#FCD34D" : "var(--text-secondary)",
            }}
            aria-label={settings.theme === "dark" ? "Byt till ljust tema" : "Byt till mörkt tema"}
          >
            {settings.theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
