import { useState } from "react";
import {
  Home, CheckSquare, Wallet, FolderOpen, MoreHorizontal, ChevronRight,
  Settings, Clock, AlertTriangle, Shield, Lock, Scale, User, Calendar,
  Zap, ArrowRight, Check, Circle, X, Bell, MessageSquare, FileText,
  Heart, Feather, Sparkles, Eye, EyeOff, Layers
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   SISTA RESAN — DESIGN B: "NORDIC NIGHT"

   Dark mode, premium, glassmorphism.
   Tänk: Spotify möter en finsk spa-upplevelse.

   - Mörk bas med djupt blåsvart
   - Guld/amber accent — värme i mörkret
   - Glas-kort med blur-effekter
   - Stora typsnitt, dramatisk hierarki
   - Runda organiska former
   ═══════════════════════════════════════════════════════════════ */

const T = {
  bgDeep: "#0D1117",
  bgSurface: "#161B22",
  bgCard: "rgba(255,255,255,0.05)",
  bgCardHover: "rgba(255,255,255,0.08)",
  bgGlass: "rgba(255,255,255,0.06)",
  bgGlassStrong: "rgba(255,255,255,0.10)",

  textPrimary: "#E6E1D8",
  textSecondary: "#9B9589",
  textMuted: "#6B665E",
  textOnAccent: "#0D1117",

  amber: "#D4A053",
  amberLight: "#E8C17A",
  amberDark: "#B8873A",
  amberGlow: "rgba(212,160,83,0.15)",
  amberTint: "rgba(212,160,83,0.08)",

  rose: "#C97B7B",
  roseGlow: "rgba(201,123,123,0.15)",
  roseTint: "rgba(201,123,123,0.08)",

  teal: "#6BA3A0",
  tealGlow: "rgba(107,163,160,0.15)",
  tealTint: "rgba(107,163,160,0.08)",

  lavender: "#9B8EC4",
  lavenderTint: "rgba(155,142,196,0.08)",

  border: "rgba(255,255,255,0.06)",
  borderLight: "rgba(255,255,255,0.04)",
  shadow: "0 4px 24px rgba(0,0,0,0.3)",
  shadowLg: "0 8px 40px rgba(0,0,0,0.4)",

  radius: "20px",
  radiusSm: "14px",
  radiusXs: "10px",
  radiusFull: "9999px",

  glass: "backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);",
};

const glassCard = {
  background: T.bgGlass,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderRadius: T.radius,
  padding: "20px",
  border: `1px solid ${T.border}`,
  transition: "all 0.3s ease",
};

const btnGold = {
  width: "100%",
  minHeight: "56px",
  padding: "16px 24px",
  background: `linear-gradient(135deg, ${T.amber}, ${T.amberLight})`,
  color: T.textOnAccent,
  fontWeight: 700,
  fontSize: "16px",
  borderRadius: T.radiusSm,
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  transition: "all 0.3s ease",
  letterSpacing: "0.02em",
  boxShadow: `0 4px 20px ${T.amberGlow}`,
};

const btnGhost = {
  ...btnGold,
  background: "transparent",
  color: T.textPrimary,
  border: `1px solid ${T.border}`,
  boxShadow: "none",
  fontWeight: 600,
};

function GlowOrb({ color, size, top, left, right, bottom }) {
  return (
    <div style={{
      position: "absolute",
      width: size, height: size,
      borderRadius: "50%",
      background: color,
      filter: "blur(80px)",
      opacity: 0.4,
      top, left, right, bottom,
      pointerEvents: "none",
    }} />
  );
}

function NavTabB({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: "3px", padding: "10px 12px", minWidth: "64px",
      background: "none", border: "none", cursor: "pointer",
      color: active ? T.amber : T.textMuted,
      transition: "color 0.2s ease",
    }}>
      <Icon size={20} strokeWidth={active ? 2.2 : 1.5} />
      <span style={{ fontSize: "11px", fontWeight: active ? 600 : 500 }}>{label}</span>
      {active && <div style={{
        width: 4, height: 4, borderRadius: "50%",
        background: T.amber, marginTop: "-1px",
      }} />}
    </button>
  );
}

function BottomNavB({ activeTab, setActiveTab }) {
  return (
    <nav style={{
      position: "sticky", bottom: 0,
      background: "rgba(13,17,23,0.85)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderTop: `1px solid ${T.border}`,
      display: "flex", justifyContent: "space-around", alignItems: "center",
      paddingBottom: "8px", zIndex: 50,
    }}>
      {[
        { id: "home", icon: Home, label: "Hem" },
        { id: "tasks", icon: CheckSquare, label: "Att göra" },
        { id: "economy", icon: Wallet, label: "Ekonomi" },
        { id: "docs", icon: FolderOpen, label: "Dokument" },
        { id: "more", icon: MoreHorizontal, label: "Mer" },
      ].map(t => (
        <NavTabB key={t.id} icon={t.icon} label={t.label}
          active={activeTab === t.id} onClick={() => setActiveTab(t.id)} />
      ))}
    </nav>
  );
}

// ── Landing ────────────────────────────────────────────────────

function LandingB({ onNavigate }) {
  return (
    <div style={{ background: T.bgDeep, minHeight: "100%", position: "relative", overflow: "hidden" }}>
      <GlowOrb color={T.amberGlow} size="300px" top="-80px" right="-60px" />
      <GlowOrb color={T.tealGlow} size="250px" bottom="20%" left="-80px" />

      <section style={{ padding: "56px 28px 36px", position: "relative", zIndex: 1 }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: T.amberTint, border: `1px solid rgba(212,160,83,0.2)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "32px",
        }}>
          <Feather size={24} color={T.amber} strokeWidth={1.5} />
        </div>

        <h1 style={{
          fontSize: "38px", fontWeight: 800, color: T.textPrimary,
          lineHeight: 1.1, marginBottom: "20px", letterSpacing: "-0.03em",
        }}>
          Vi hjälper dig<br />
          <span style={{ color: T.amber }}>genom det svåra</span>
        </h1>

        <p style={{
          fontSize: "17px", color: T.textSecondary,
          lineHeight: 1.65, maxWidth: "320px",
        }}>
          Att hantera ett dödsbo kan kännas överväldigande.
          Sista Resan guidar dig steg för steg.
        </p>
      </section>

      <section style={{ padding: "0 28px 36px", position: "relative", zIndex: 1 }}>
        <div style={{
          ...glassCard,
          borderLeft: `2px solid ${T.amber}`,
        }}>
          <p style={{ fontSize: "14px", color: T.textSecondary, lineHeight: 1.65 }}>
            Du behöver inte ha koll på allt just nu. Vi visar vägen,
            steg för steg — i din egen takt.
          </p>
        </div>
      </section>

      <section style={{ padding: "0 28px 40px", display: "flex", flexDirection: "column", gap: "12px", position: "relative", zIndex: 1 }}>
        <button onClick={() => onNavigate("dashboard")} style={btnGold}>
          Börja här <Sparkles size={18} />
        </button>
        <button style={btnGhost}>
          Fortsätt där du var <ChevronRight size={18} />
        </button>
      </section>

      <section style={{ padding: "0 28px 40px", position: "relative", zIndex: 1 }}>
        <h2 style={{
          fontSize: "24px", fontWeight: 700, color: T.textPrimary,
          marginBottom: "24px", letterSpacing: "-0.02em",
        }}>Vad appen gör för dig</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            { icon: Clock, title: "Tidslinje", desc: "Anpassad efter dig", color: T.teal, bg: T.tealTint },
            { icon: FileText, title: "Bouppteckning", desc: "Steg för steg", color: T.amber, bg: T.amberTint },
            { icon: MessageSquare, title: "AI-assistent", desc: "Fråga vad som helst", color: T.lavender, bg: T.lavenderTint },
            { icon: Bell, title: "Påminnelser", desc: "Aldrig missa frister", color: T.rose, bg: T.roseTint },
          ].map((f, i) => (
            <div key={i} style={{
              ...glassCard,
              padding: "18px",
              display: "flex", flexDirection: "column", gap: "12px",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: T.radiusXs,
                background: f.bg, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <f.icon size={20} color={f.color} strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "14px", color: T.textPrimary, marginBottom: "2px" }}>{f.title}</p>
                <p style={{ fontSize: "12px", color: T.textSecondary }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "0 28px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ ...glassCard, padding: "24px" }}>
          <h3 style={{ fontWeight: 600, fontSize: "16px", color: T.textPrimary, marginBottom: "18px" }}>
            Tryggt & säkert
          </h3>
          {[
            { icon: Scale, text: "Baserat på Ärvdabalken" },
            { icon: Lock, text: "Data stannar på din enhet" },
            { icon: Shield, text: "Gratis grundversion" },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: i < 2 ? "14px" : 0 }}>
              <t.icon size={16} color={T.amber} strokeWidth={1.5} />
              <p style={{ fontSize: "14px", color: T.textSecondary }}>{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ padding: "20px 28px 32px", textAlign: "center", borderTop: `1px solid ${T.border}`, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "10px" }}>
          {["Om oss", "Integritet", "Villkor"].map(l => (
            <span key={l} style={{ fontSize: "13px", color: T.textMuted, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
        <p style={{ fontSize: "12px", color: T.textMuted }}>Ersätter inte juridisk rådgivning.</p>
      </footer>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────

function DashboardB() {
  return (
    <div style={{ background: T.bgDeep, minHeight: "100%", position: "relative", overflow: "hidden", paddingBottom: "16px" }}>
      <GlowOrb color={T.amberGlow} size="200px" top="-60px" right="-40px" />

      <div style={{
        padding: "28px 28px 0", display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: "28px", position: "relative", zIndex: 1,
      }}>
        <div>
          <p style={{ fontSize: "14px", color: T.textMuted, marginBottom: "4px" }}>Dag 18</p>
          <h1 style={{
            fontSize: "26px", fontWeight: 700, color: T.textPrimary,
            letterSpacing: "-0.02em",
          }}>Annas dödsbo</h1>
        </div>
        <button style={{
          width: 44, height: 44, borderRadius: "50%",
          background: T.bgGlass, border: `1px solid ${T.border}`,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Settings size={18} color={T.textSecondary} strokeWidth={1.5} />
        </button>
      </div>

      {/* Phase */}
      <div style={{ padding: "0 28px", marginBottom: "20px", position: "relative", zIndex: 1 }}>
        <div style={{
          ...glassCard,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: T.tealTint,
          borderLeft: `3px solid ${T.teal}`,
          cursor: "pointer",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: T.tealGlow, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Layers size={20} color={T.teal} strokeWidth={1.5} />
            </div>
            <div>
              <p style={{ fontSize: "12px", color: T.textMuted, marginBottom: "2px" }}>Aktuell fas</p>
              <p style={{ fontSize: "17px", fontWeight: 600, color: T.textPrimary }}>Kartläggning</p>
            </div>
          </div>
          <ChevronRight size={18} color={T.textMuted} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "0 28px", marginBottom: "24px", display: "flex", gap: "12px", position: "relative", zIndex: 1 }}>
        {[
          { icon: User, value: "3", label: "Delägare", color: T.amber, bg: T.amberTint },
          { icon: Calendar, value: "2", label: "Frister", color: T.rose, bg: T.roseTint },
        ].map((s, i) => (
          <div key={i} style={{ ...glassCard, flex: 1, textAlign: "center", padding: "20px 12px" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: s.bg, display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px",
            }}>
              <s.icon size={18} color={s.color} strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: "28px", fontWeight: 800, color: T.textPrimary, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: "13px", color: T.textSecondary, marginTop: "4px" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Priorities */}
      <div style={{ padding: "0 28px", marginBottom: "24px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <Zap size={18} color={T.amber} />
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: T.textPrimary }}>Prioriterat</h2>
        </div>
        {[
          { n: 1, label: "Kontakta banker", reason: "2 banker", color: T.rose },
          { n: 2, label: "Inventera tillgångar", reason: "Grund för bouppteckning", color: T.amber },
          { n: 3, label: "Kolla försäkringar", reason: "Dödsfallsersättning?", color: T.teal },
        ].map((a, i) => (
          <div key={i} style={{
            ...glassCard, padding: "14px 16px", marginBottom: "8px",
            display: "flex", alignItems: "center", gap: "14px",
            borderLeft: `2px solid ${a.color}`, cursor: "pointer",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: `linear-gradient(135deg, ${T.amber}, ${T.amberLight})`,
              color: T.textOnAccent, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: 800, flexShrink: 0,
            }}>{a.n}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: "14px", color: T.textPrimary }}>{a.label}</p>
              <p style={{ fontSize: "12px", color: T.textSecondary, marginTop: "1px" }}>{a.reason}</p>
            </div>
            <ChevronRight size={16} color={T.textMuted} />
          </div>
        ))}
      </div>

      {/* Deadline warning */}
      <div style={{ padding: "0 28px", marginBottom: "20px", position: "relative", zIndex: 1 }}>
        <div style={{
          ...glassCard, background: T.roseTint,
          borderLeft: `2px solid ${T.rose}`,
          display: "flex", alignItems: "center", gap: "14px",
        }}>
          <AlertTriangle size={20} color={T.rose} />
          <div>
            <p style={{ fontWeight: 600, fontSize: "14px", color: T.textPrimary }}>Bouppteckning</p>
            <p style={{ fontSize: "13px", color: T.rose, fontWeight: 600, marginTop: "2px" }}>72 dagar kvar</p>
          </div>
        </div>
      </div>

      {/* AI card */}
      <div style={{ padding: "0 28px", position: "relative", zIndex: 1 }}>
        <div style={{
          ...glassCard, background: T.lavenderTint,
          borderLeft: `2px solid ${T.lavender}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <MessageSquare size={20} color={T.lavender} />
            <div>
              <p style={{ fontWeight: 600, fontSize: "14px", color: T.textPrimary }}>Juridisk AI</p>
              <p style={{ fontSize: "12px", color: T.textSecondary }}>Fråga om arvsrätt</p>
            </div>
          </div>
          <ChevronRight size={16} color={T.textMuted} />
        </div>
      </div>
    </div>
  );
}

// ── Tasks ──────────────────────────────────────────────────────

function TasksB() {
  const [filter, setFilter] = useState("all");
  const [showDone, setShowDone] = useState(false);

  const tasks = [
    { title: "Beställ dödsbevis", desc: "Kontakta Skatteverket", status: "klar", step: "akut" },
    { title: "Meddela banken", desc: "Kontakta alla banker", status: "ej", step: "akut", deadline: "3 dagar kvar", urgent: true },
    { title: "Kontakta försäkringsbolag", desc: "Gå igenom alla försäkringar", status: "ej", step: "kart", deadline: "12 dagar kvar" },
    { title: "Inventera tillgångar", desc: "Lista fastigheter, konton, fordon", status: "ej", step: "kart" },
    { title: "Samla skulduppgifter", desc: "Kronofogden och banker", status: "ej", step: "kart" },
  ];

  const filtered = tasks.filter(t => {
    if (!showDone && t.status === "klar") return false;
    return true;
  });

  const done = tasks.filter(t => t.status === "klar").length;
  const pct = (done / tasks.length) * 100;

  return (
    <div style={{ background: T.bgDeep, minHeight: "100%", position: "relative", overflow: "hidden", paddingBottom: "16px" }}>
      <GlowOrb color={T.amberGlow} size="180px" top="-40px" left="-40px" />

      <div style={{ padding: "28px 28px 0", position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: T.textPrimary, marginBottom: "4px", letterSpacing: "-0.02em" }}>
          Att göra
        </h1>
        <p style={{ fontSize: "14px", color: T.textSecondary, marginBottom: "18px" }}>{done}/{tasks.length} klara</p>

        {/* Progress */}
        <div style={{ height: 4, borderRadius: 2, background: T.bgGlassStrong, marginBottom: "22px", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: `linear-gradient(90deg, ${T.amber}, ${T.amberLight})`,
            borderRadius: 2, transition: "width 0.5s ease",
            boxShadow: `0 0 12px ${T.amberGlow}`,
          }} />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", overflowX: "auto", paddingBottom: "4px" }}>
          {[
            { id: "all", label: "Alla" },
            { id: "akut", label: "Nödbroms" },
            { id: "kart", label: "Kartläggning" },
            { id: "boup", label: "Bouppteckning" },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: "10px 18px", borderRadius: T.radiusFull,
              fontSize: "13px", fontWeight: 500, border: "none", cursor: "pointer",
              whiteSpace: "nowrap", transition: "all 0.2s ease",
              background: filter === f.id ? `linear-gradient(135deg, ${T.amber}, ${T.amberLight})` : T.bgGlass,
              color: filter === f.id ? T.textOnAccent : T.textSecondary,
              boxShadow: filter === f.id ? `0 2px 12px ${T.amberGlow}` : "none",
            }}>
              {f.label}
            </button>
          ))}
        </div>

        <button onClick={() => setShowDone(!showDone)} style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "10px 14px", borderRadius: T.radiusXs,
          border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 500,
          marginBottom: "22px",
          background: showDone ? T.amberTint : "transparent",
          color: showDone ? T.amber : T.textMuted,
        }}>
          {showDone ? <Eye size={15} /> : <EyeOff size={15} />}
          {showDone ? "Dölj klara" : "Visa klara"}
        </button>
      </div>

      {/* Tasks */}
      <div style={{ padding: "0 28px", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{
          padding: "8px 14px", borderLeft: `2px solid ${T.rose}`,
          background: T.roseTint, borderRadius: `0 ${T.radiusXs} ${T.radiusXs} 0`, marginBottom: "4px",
        }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: T.rose, textTransform: "uppercase", letterSpacing: "0.05em" }}>Nödbroms</p>
        </div>

        {filtered.filter(t => t.step === "akut").map((task, i) => {
          const isKlar = task.status === "klar";
          return (
            <div key={i} style={{
              ...glassCard, padding: "16px 18px",
              display: "flex", alignItems: "flex-start", gap: "14px",
              opacity: isKlar ? 0.45 : 1,
              borderLeft: task.urgent ? `2px solid ${T.rose}` : undefined,
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                border: isKlar ? "none" : `2px solid ${T.border}`,
                background: isKlar ? `linear-gradient(135deg, ${T.amber}, ${T.amberLight})` : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: 1, cursor: "pointer",
              }}>
                {isKlar && <Check size={12} color={T.textOnAccent} strokeWidth={3} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontWeight: 500, fontSize: "14px",
                  color: isKlar ? T.textMuted : T.textPrimary,
                  textDecoration: isKlar ? "line-through" : "none",
                }}>{task.title}</p>
                <p style={{ fontSize: "12px", color: T.textSecondary, marginTop: "2px" }}>{task.desc}</p>
                {task.deadline && !isKlar && (
                  <p style={{ fontSize: "12px", fontWeight: 600, marginTop: "6px", color: task.urgent ? T.rose : T.amber }}>{task.deadline}</p>
                )}
              </div>
            </div>
          );
        })}

        <div style={{
          padding: "8px 14px", borderLeft: `2px solid ${T.teal}`,
          background: T.tealTint, borderRadius: `0 ${T.radiusXs} ${T.radiusXs} 0`, marginTop: "12px", marginBottom: "4px",
        }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: T.teal, textTransform: "uppercase", letterSpacing: "0.05em" }}>Kartläggning</p>
        </div>

        {filtered.filter(t => t.step === "kart").map((task, i) => (
          <div key={i} style={{
            ...glassCard, padding: "16px 18px",
            display: "flex", alignItems: "flex-start", gap: "14px",
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              border: `2px solid ${T.border}`,
              flexShrink: 0, marginTop: 1, cursor: "pointer",
            }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 500, fontSize: "14px", color: T.textPrimary }}>{task.title}</p>
              <p style={{ fontSize: "12px", color: T.textSecondary, marginTop: "2px" }}>{task.desc}</p>
              {task.deadline && (
                <p style={{ fontSize: "12px", fontWeight: 600, marginTop: "6px", color: T.amber }}>{task.deadline}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tokens ─────────────────────────────────────────────────────

function TokensB() {
  const groups = [
    { title: "Bakgrunder", colors: [
      { name: "Deep", hex: T.bgDeep }, { name: "Surface", hex: T.bgSurface },
      { name: "Glass", hex: "#1C2129" }, { name: "Glass Strong", hex: "#242A33" },
    ]},
    { title: "Text", colors: [
      { name: "Primary", hex: "#E6E1D8" }, { name: "Secondary", hex: "#9B9589" }, { name: "Muted", hex: "#6B665E" },
    ]},
    { title: "Accent", colors: [
      { name: "Amber", hex: T.amber }, { name: "Amber Light", hex: T.amberLight },
      { name: "Rose", hex: T.rose }, { name: "Teal", hex: T.teal },
      { name: "Lavender", hex: T.lavender },
    ]},
  ];

  return (
    <div style={{ background: T.bgDeep, minHeight: "100%", padding: "28px", paddingBottom: "16px", position: "relative", overflow: "hidden" }}>
      <GlowOrb color={T.amberGlow} size="200px" top="-60px" right="-40px" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: T.textPrimary, marginBottom: "4px" }}>Design System</h1>
        <p style={{ fontSize: "14px", color: T.textSecondary, marginBottom: "28px" }}>"Nordic Night" — dark, premium, glas</p>

        {groups.map((g, gi) => (
          <div key={gi} style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
              {g.title}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
              {g.colors.map((c, ci) => (
                <div key={ci} style={{ ...glassCard, padding: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: 32, height: 32, borderRadius: T.radiusXs, background: c.hex, border: `1px solid ${T.border}`, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: T.textPrimary }}>{c.name}</p>
                    <p style={{ fontSize: "10px", color: T.textMuted, fontFamily: "monospace" }}>{c.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ fontSize: "12px", fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>Knappar</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button style={btnGold}>Guld primär <Sparkles size={16} /></button>
            <button style={btnGhost}>Ghost sekundär</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────

export default function DesignB() {
  const [view, setView] = useState("landing");
  const [tab, setTab] = useState("home");

  const handleTab = (t) => {
    setTab(t);
    if (t === "home") setView("dashboard");
    else if (t === "tasks") setView("tasks");
    else if (t === "more") setView("tokens");
    else setView("dashboard");
  };

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, sans-serif",
      maxWidth: 430, margin: "0 auto",
      background: T.bgDeep, minHeight: "100vh",
      display: "flex", flexDirection: "column",
      boxShadow: "0 0 80px rgba(0,0,0,0.4)",
      WebkitFontSmoothing: "antialiased",
    }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 60,
        background: "rgba(13,17,23,0.9)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${T.border}`,
        padding: "8px 16px", display: "flex", gap: "6px",
      }}>
        {[
          { id: "landing", label: "Landing" },
          { id: "dashboard", label: "Dashboard" },
          { id: "tasks", label: "Uppgifter" },
          { id: "tokens", label: "Design System" },
        ].map(v => (
          <button key={v.id} onClick={() => {
            setView(v.id);
            if (v.id === "dashboard") setTab("home");
            else if (v.id === "tasks") setTab("tasks");
            else if (v.id === "tokens") setTab("more");
          }} style={{
            padding: "6px 14px", borderRadius: T.radiusFull,
            fontSize: "12px", fontWeight: 500, border: "none", cursor: "pointer",
            background: view === v.id ? `linear-gradient(135deg, ${T.amber}, ${T.amberLight})` : T.bgGlass,
            color: view === v.id ? T.textOnAccent : T.textSecondary,
          }}>
            {v.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }}>
        {view === "landing" && <LandingB onNavigate={(v) => { setView(v); setTab("home"); }} />}
        {view === "dashboard" && <DashboardB />}
        {view === "tasks" && <TasksB />}
        {view === "tokens" && <TokensB />}
      </div>

      {view !== "landing" && <BottomNavB activeTab={tab} setActiveTab={handleTab} />}
    </div>
  );
}