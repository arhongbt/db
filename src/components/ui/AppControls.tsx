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
    // RGB color mappings — browsers convert hex to rgb() in computed styles
    const rgbBgMap: [string, string][] = [
      // Light backgrounds → dark
      ['rgb(247, 245, 240)', 'var(--bg)'],           // #F7F5F0
      ['rgb(255, 255, 255)', 'var(--bg-card)'],       // #FFFFFF
      ['rgb(240, 237, 230)', 'var(--border-light)'],   // #F0EDE6
      ['rgb(232, 228, 222)', 'var(--border)'],         // #E8E4DE
      ['rgb(238, 242, 234)', 'var(--accent-soft)'],    // #E8F0E8
      ['rgb(237, 242, 246)', '#1E2A35'],               // #EDF2F6 info-light
      ['rgb(254, 243, 238)', '#352420'],               // #FEF3EE warn-light
    ];
    const rgbTextMap: [string, string][] = [
      ['rgb(42, 38, 34)', 'var(--text)'],              // #2A2622
      ['rgb(82, 75, 69)', 'var(--text-secondary)'],    // #524B45
      ['rgb(107, 101, 96)', 'var(--text-secondary)'],  // #6B6560
      ['rgb(74, 69, 64)', 'var(--text-secondary)'],    // #4A4540
    ];
    const rgbBorderMap: [string, string][] = [
      ['rgb(232, 228, 222)', 'var(--border)'],         // #E8E4DE
      ['rgb(240, 237, 230)', 'var(--border-light)'],   // #F0EDE6
    ];

    requestAnimationFrame(() => {
      document.querySelectorAll('[style]').forEach(el => {
        const style = (el as HTMLElement).style;
        // Fix background (handles gradients too)
        if (style.background) {
          let bg = style.background;
          let changed = false;
          rgbBgMap.forEach(([from, to]) => {
            if (bg.includes(from)) {
              bg = bg.replace(new RegExp(from.replace(/[()]/g, '\\$&'), 'g'), to);
              changed = true;
            }
          });
          if (changed) style.background = bg;
        }
        if (style.backgroundColor) {
          rgbBgMap.forEach(([from, to]) => {
            if (style.backgroundColor === from) {
              style.backgroundColor = to;
            }
          });
        }
        // Fix border-color
        if (style.borderColor) {
          rgbBorderMap.forEach(([from, to]) => {
            if (style.borderColor === from) {
              style.borderColor = to;
            }
          });
        }
        // Fix text color
        if (style.color) {
          rgbTextMap.forEach(([from, to]) => {
            if (style.color === from) {
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
      <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 pb-4 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, var(--bg) 70%, var(--bg) 85%, transparent)" }}
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
