import { useState } from "react";
import {
  Home, CheckSquare, Wallet, FolderOpen, MoreHorizontal, ChevronRight,
  Settings, Clock, AlertTriangle, Shield, Lock, Scale, User, Calendar,
  Zap, ArrowRight, Check, Circle, X, Bell, MessageSquare, FileText,
  Heart, Sun, Moon, Feather
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   SISTA RESAN — REDESIGN PROTOTYPE
   Concept: "Gentle Structure"

   Lugn & trygg + Professionell & pålitlig

   Design principles:
   1. Warm neutrals — no cold whites, linen/cream backgrounds
   2. Sage green as accent — nature, calm, growth through grief
   3. Generous whitespace — breathing room, no visual overwhelm
   4. Subtle depth — soft shadows, layered cards
   5. Quiet confidence — professional without being corporate
   ═══════════════════════════════════════════════════════════════ */

// ── Design Tokens ──────────────────────────────────────────────
const T = {
  // Backgrounds
  bgBase: "#F7F5F0",       // warm linen
  bgCard: "#FFFFFF",
  bgCardHover: "#FAFAF7",
  bgElevated: "#FFFFFE",
  bgSubtle: "#F0EDE6",     // muted sand
  bgAccentSoft: "#EEF2EA", // sage tint

  // Text
  textPrimary: "#2A2622",   // warm charcoal
  textSecondary: "#6B6560", // warm gray
  textMuted: "#9C9590",     // soft muted
  textOnAccent: "#FFFFFF",

  // Accent palette
  sage: "#6B7F5E",          // primary accent — sage green
  sageDark: "#4F6145",
  sageLight: "#8FA882",
  sageTint: "#EEF2EA",

  // Supporting colors
  warmSlate: "#4A4540",     // headings, emphasis
  terracotta: "#C4704B",    // warnings, urgency (warm, not aggressive)
  terracottaLight: "#FEF3EE",
  dustyBlue: "#6E8BA4",     // info, links
  dustyBlueTint: "#EDF2F6",
  olive: "#5F6B4D",         // success (darker sage)
  oliveTint: "#F0F3EC",

  // Borders & shadows
  border: "#E8E4DD",
  borderLight: "#F0EDE6",
  shadow: "0 1px 3px rgba(42,38,34,0.04), 0 4px 12px rgba(42,38,34,0.03)",
  shadowLg: "0 4px 6px rgba(42,38,34,0.04), 0 12px 24px rgba(42,38,34,0.06)",
  shadowXl: "0 8px 16px rgba(42,38,34,0.06), 0 20px 40px rgba(42,38,34,0.08)",

  // Radii
  radius: "16px",
  radiusSm: "12px",
  radiusXs: "8px",
  radiusFull: "9999px",

  // Typography
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  fontDisplay: "'Inter', sans-serif",
};

// ── Shared styles ──────────────────────────────────────────────
const cardStyle = {
  background: T.bgCard,
  borderRadius: T.radius,
  padding: "20px",
  boxShadow: T.shadow,
  border: `1px solid ${T.borderLight}`,
  transition: "all 0.2s ease",
};

const btnPrimary = {
  width: "100%",
  minHeight: "52px",
  padding: "14px 24px",
  background: T.sage,
  color: T.textOnAccent,
  fontWeight: 600,
  fontSize: "16px",
  borderRadius: T.radiusSm,
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  transition: "all 0.2s ease",
  letterSpacing: "0.01em",
};

const btnSecondary = {
  ...btnPrimary,
  background: "transparent",
  color: T.warmSlate,
  border: `2px solid ${T.border}`,
};

// ── Components ─────────────────────────────────────────────────

function NavTab({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
        padding: "8px 12px",
        minWidth: "64px",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: active ? T.sage : T.textMuted,
        transition: "color 0.2s ease",
      }}
    >
      <Icon size={20} strokeWidth={active ? 2.2 : 1.5} />
      <span style={{ fontSize: "11px", fontWeight: active ? 600 : 500 }}>{label}</span>
    </button>
  );
}

function BottomNavProto({ activeTab, setActiveTab }) {
  return (
    <nav style={{
      position: "sticky",
      bottom: 0,
      background: T.bgElevated,
      borderTop: `1px solid ${T.borderLight}`,
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      paddingBottom: "env(safe-area-inset-bottom, 8px)",
      zIndex: 50,
    }}>
      {[
        { id: "home", icon: Home, label: "Hem" },
        { id: "tasks", icon: CheckSquare, label: "Att göra" },
        { id: "economy", icon: Wallet, label: "Ekonomi" },
        { id: "docs", icon: FolderOpen, label: "Dokument" },
        { id: "more", icon: MoreHorizontal, label: "Mer" },
      ].map(t => (
        <NavTab
          key={t.id}
          icon={t.icon}
          label={t.label}
          active={activeTab === t.id}
          onClick={() => setActiveTab(t.id)}
        />
      ))}
    </nav>
  );
}

function PhaseIndicator({ phase, daysText }) {
  const phaseConfig = {
    akut: { label: "Nödbroms", color: T.terracotta, bg: T.terracottaLight, icon: AlertTriangle },
    kartlaggning: { label: "Kartläggning", color: T.dustyBlue, bg: T.dustyBlueTint, icon: Clock },
    bouppteckning: { label: "Bouppteckning", color: T.sage, bg: T.sageTint, icon: FileText },
    arvskifte: { label: "Arvskifte", color: T.olive, bg: T.oliveTint, icon: Scale },
  };
  const c = phaseConfig[phase] || phaseConfig.kartlaggning;
  const Icon = c.icon;

  return (
    <div style={{
      ...cardStyle,
      background: c.bg,
      borderLeft: `4px solid ${c.color}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      cursor: "pointer",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          width: 44, height: 44,
          borderRadius: T.radiusSm,
          background: `${c.color}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={22} color={c.color} strokeWidth={1.5} />
        </div>
        <div>
          <p style={{ fontSize: "13px", color: T.textSecondary, marginBottom: "2px" }}>Du är i fasen</p>
          <p style={{ fontSize: "17px", fontWeight: 600, color: T.textPrimary }}>{c.label}</p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "13px", color: T.textMuted }}>{daysText}</span>
        <ChevronRight size={18} color={T.textMuted} />
      </div>
    </div>
  );
}

function TaskItem({ title, description, status, deadline, urgent }) {
  const isKlar = status === "klar";
  return (
    <div style={{
      ...cardStyle,
      padding: "16px 18px",
      display: "flex",
      alignItems: "flex-start",
      gap: "14px",
      opacity: isKlar ? 0.55 : 1,
      borderLeft: urgent ? `3px solid ${T.terracotta}` : undefined,
    }}>
      <div style={{
        width: 28, height: 28,
        borderRadius: "50%",
        border: isKlar ? "none" : `2px solid ${T.border}`,
        background: isKlar ? T.sage : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        marginTop: 1,
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}>
        {isKlar && <Check size={14} color="#fff" strokeWidth={3} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontWeight: 500, fontSize: "15px",
          color: isKlar ? T.textMuted : T.textPrimary,
          textDecoration: isKlar ? "line-through" : "none",
          marginBottom: "3px",
        }}>{title}</p>
        <p style={{ fontSize: "13px", color: T.textSecondary, lineHeight: 1.45 }}>{description}</p>
        {deadline && !isKlar && (
          <p style={{
            fontSize: "12px", fontWeight: 600, marginTop: "6px",
            color: urgent ? T.terracotta : T.sage,
          }}>{deadline}</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div style={{
      ...cardStyle,
      textAlign: "center",
      padding: "18px 12px",
      flex: 1,
    }}>
      <div style={{
        width: 40, height: 40,
        borderRadius: T.radiusSm,
        background: T.sageTint,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 10px",
      }}>
        <Icon size={20} color={T.sage} strokeWidth={1.5} />
      </div>
      <p style={{ fontSize: "26px", fontWeight: 700, color: T.textPrimary, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: "13px", color: T.textSecondary, marginTop: "4px" }}>{label}</p>
    </div>
  );
}

function PriorityAction({ number, label, reason, color }) {
  return (
    <div style={{
      ...cardStyle,
      padding: "14px 16px",
      display: "flex",
      alignItems: "center",
      gap: "14px",
      cursor: "pointer",
      borderLeft: `3px solid ${color}`,
    }}>
      <div style={{
        width: 28, height: 28,
        borderRadius: "50%",
        background: T.sage,
        color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "13px", fontWeight: 700,
        flexShrink: 0,
      }}>{number}</div>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 600, fontSize: "14px", color: T.textPrimary }}>{label}</p>
        <p style={{ fontSize: "12px", color: T.textSecondary, marginTop: "2px" }}>{reason}</p>
      </div>
      <ChevronRight size={16} color={T.textMuted} />
    </div>
  );
}

// ── Page Views ─────────────────────────────────────────────────

function LandingView({ onNavigate }) {
  return (
    <div style={{ background: T.bgBase, minHeight: "100%" }}>
      {/* Hero */}
      <section style={{ padding: "48px 24px 32px" }}>
        {/* Logo mark */}
        <div style={{
          width: 56, height: 56,
          borderRadius: T.radiusSm,
          background: T.sageTint,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "28px",
        }}>
          <Feather size={28} color={T.sage} strokeWidth={1.5} />
        </div>

        <h1 style={{
          fontSize: "32px", fontWeight: 700,
          color: T.textPrimary,
          lineHeight: 1.2,
          marginBottom: "16px",
          letterSpacing: "-0.02em",
        }}>
          Vi hjälper dig<br />genom det svåra
        </h1>

        <p style={{
          fontSize: "17px",
          color: T.textSecondary,
          lineHeight: 1.6,
          maxWidth: "340px",
        }}>
          Att hantera ett dödsbo kan kännas överväldigande.
          Sista Resan guidar dig steg för steg — i din egen takt.
        </p>
      </section>

      {/* Empathy card */}
      <section style={{ padding: "0 24px 28px" }}>
        <div style={{
          background: T.sageTint,
          borderRadius: T.radius,
          padding: "20px",
          borderLeft: `3px solid ${T.sage}`,
        }}>
          <p style={{ fontSize: "14px", color: T.warmSlate, lineHeight: 1.65 }}>
            Du behöver inte ha koll på allt just nu. Vi hjälper dig se vad
            som behöver göras, i vilken ordning, och när det är dags.
          </p>
        </div>
      </section>

      {/* CTAs */}
      <section style={{ padding: "0 24px 36px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <button
          onClick={() => onNavigate("dashboard")}
          style={btnPrimary}
          onMouseEnter={e => e.target.style.background = T.sageDark}
          onMouseLeave={e => e.target.style.background = T.sage}
        >
          Börja här
          <ArrowRight size={18} />
        </button>
        <button style={btnSecondary}>
          Fortsätt där du var
          <ChevronRight size={18} />
        </button>
      </section>

      {/* Features */}
      <section style={{ padding: "0 24px 36px" }}>
        <h2 style={{
          fontSize: "22px", fontWeight: 700,
          color: T.textPrimary, marginBottom: "20px",
          letterSpacing: "-0.01em",
        }}>Vad appen hjälper dig med</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { icon: Clock, title: "Personlig tidslinje", desc: "Anpassad efter din situation — du ser bara det som är relevant just nu" },
            { icon: FileText, title: "Bouppteckning", desc: "Samla underlag och skapa dokument — steg för steg" },
            { icon: MessageSquare, title: "Fråga när du undrar", desc: "En AI-assistent som förklarar juridiken på enkel svenska" },
            { icon: Bell, title: "Påminnelser", desc: "Vi håller koll på fristerna — du behöver inte" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div style={{
                width: 44, height: 44,
                borderRadius: T.radiusSm,
                background: T.sageTint,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <f.icon size={20} color={T.sage} strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "15px", color: T.textPrimary, marginBottom: "3px" }}>{f.title}</p>
                <p style={{ fontSize: "14px", color: T.textSecondary, lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust signals */}
      <section style={{ padding: "0 24px 36px" }}>
        <div style={{
          background: T.bgSubtle,
          borderRadius: T.radius,
          padding: "24px",
        }}>
          <h3 style={{ fontWeight: 600, fontSize: "16px", color: T.textPrimary, marginBottom: "16px" }}>
            Du är i trygga händer
          </h3>
          {[
            { icon: Scale, text: "Baserat på Ärvdabalken och Skatteverkets regler" },
            { icon: Lock, text: "Dina uppgifter stannar på din enhet" },
            { icon: Shield, text: "Grundversionen är helt gratis" },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: i < 2 ? "12px" : 0 }}>
              <t.icon size={16} color={T.sage} strokeWidth={1.5} style={{ marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontSize: "14px", color: T.textSecondary, lineHeight: 1.5 }}>{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "24px",
        textAlign: "center",
        borderTop: `1px solid ${T.borderLight}`,
      }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "12px" }}>
          {["Om oss", "Integritetspolicy", "Villkor", "FAQ"].map(l => (
            <span key={l} style={{ fontSize: "13px", color: T.textMuted, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
        <p style={{ fontSize: "12px", color: T.textMuted }}>
          Sista Resan ger allmän vägledning och ersätter inte juridisk rådgivning.
        </p>
      </footer>
    </div>
  );
}

function DashboardView() {
  return (
    <div style={{ background: T.bgBase, minHeight: "100%", paddingBottom: "16px" }}>
      {/* Header */}
      <div style={{
        padding: "24px 24px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "24px",
      }}>
        <div>
          <h1 style={{
            fontSize: "24px", fontWeight: 700,
            color: T.textPrimary, marginBottom: "4px",
            letterSpacing: "-0.01em",
          }}>
            Annas dödsbo
          </h1>
          <p style={{ fontSize: "14px", color: T.textSecondary }}>
            Dag 18 — ta det i din takt
          </p>
        </div>
        <button style={{
          width: 44, height: 44,
          borderRadius: T.radiusSm,
          background: T.bgSubtle,
          border: "none",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Settings size={20} color={T.textSecondary} strokeWidth={1.5} />
        </button>
      </div>

      {/* Phase card */}
      <div style={{ padding: "0 24px", marginBottom: "20px" }}>
        <PhaseIndicator phase="kartlaggning" daysText="Dag 18" />
      </div>

      {/* Stats */}
      <div style={{ padding: "0 24px", marginBottom: "24px", display: "flex", gap: "12px" }}>
        <StatCard icon={User} value="3" label="Dödsbodelägare" />
        <StatCard icon={Calendar} value="2" label="Kommande frister" />
      </div>

      {/* Priority actions */}
      <div style={{ padding: "0 24px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: T.radiusXs,
            background: T.sageTint,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Zap size={16} color={T.sage} strokeWidth={2} />
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: T.textPrimary }}>Gör detta först</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <PriorityAction number={1} label="Kontakta banker" reason="2 banker att meddela" color={T.terracotta} />
          <PriorityAction number={2} label="Inventera tillgångar" reason="Grund för bouppteckning" color={T.sage} />
          <PriorityAction number={3} label="Kontrollera försäkringar" reason="Kan ge dödsfallsersättning" color={T.dustyBlue} />
        </div>
      </div>

      {/* Upcoming deadlines */}
      <div style={{ padding: "0 24px", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: T.textPrimary, marginBottom: "14px" }}>
          Kommande tidsfrister
        </h2>
        <div style={{
          ...cardStyle,
          display: "flex",
          alignItems: "flex-start",
          gap: "14px",
          borderLeft: `3px solid ${T.terracotta}`,
        }}>
          <div style={{
            width: 36, height: 36,
            borderRadius: T.radiusXs,
            background: T.terracottaLight,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <AlertTriangle size={18} color={T.terracotta} strokeWidth={1.5} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: "14px", color: T.textPrimary }}>Bouppteckning ska skickas</p>
            <p style={{ fontSize: "13px", color: T.textSecondary, marginTop: "2px" }}>
              Ska vara klar inom 3 månader
            </p>
            <p style={{ fontSize: "13px", fontWeight: 600, color: T.terracotta, marginTop: "6px" }}>
              72 dagar kvar
            </p>
          </div>
        </div>
      </div>

      {/* AI Assistant card */}
      <div style={{ padding: "0 24px", marginBottom: "16px" }}>
        <div style={{
          ...cardStyle,
          background: T.dustyBlueTint,
          borderLeft: `3px solid ${T.dustyBlue}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: 40, height: 40,
              borderRadius: T.radiusSm,
              background: `${T.dustyBlue}18`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <MessageSquare size={20} color={T.dustyBlue} strokeWidth={1.5} />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: "14px", color: T.textPrimary }}>Juridisk AI-assistent</p>
              <p style={{ fontSize: "12px", color: T.textSecondary }}>Fråga om arvsrätt, bouppteckning</p>
            </div>
          </div>
          <ChevronRight size={18} color={T.textMuted} />
        </div>
      </div>

      {/* Legal note */}
      <p style={{
        padding: "0 24px",
        fontSize: "12px",
        color: T.textMuted,
        textAlign: "center",
        lineHeight: 1.5,
      }}>
        Denna app ger allmän vägledning och ersätter inte juridisk rådgivning.
      </p>
    </div>
  );
}

function TasksView() {
  const [filter, setFilter] = useState("all");
  const [showDone, setShowDone] = useState(false);

  const filters = [
    { id: "all", label: "Alla" },
    { id: "akut", label: "Nödbroms" },
    { id: "kartlaggning", label: "Kartläggning" },
    { id: "bouppteckning", label: "Bouppteckning" },
  ];

  const tasks = [
    { title: "Beställ dödsbevis", description: "Kontakta Skatteverket för att beställa dödsbevis", status: "klar", step: "akut" },
    { title: "Meddela banken", description: "Kontakta alla banker där den avlidne hade konton", status: "ej", step: "akut", deadline: "3 dagar kvar", urgent: true },
    { title: "Kontakta försäkringsbolag", description: "Gå igenom alla försäkringar — det kan finnas dödsfallsersättning", status: "ej", step: "kartlaggning", deadline: "12 dagar kvar" },
    { title: "Inventera tillgångar", description: "Lista alla tillgångar: fastigheter, bankkonton, fordon, värdepapper", status: "ej", step: "kartlaggning", deadline: "25 dagar kvar" },
    { title: "Samla skulduppgifter", description: "Kontakta Kronofogden och banker för fullständig skuldbild", status: "ej", step: "kartlaggning" },
  ];

  const filteredTasks = tasks.filter(t => {
    if (filter !== "all" && t.step !== filter) return false;
    if (!showDone && t.status === "klar") return false;
    return true;
  });

  const totalDone = tasks.filter(t => t.status === "klar").length;
  const progress = (totalDone / tasks.length) * 100;

  return (
    <div style={{ background: T.bgBase, minHeight: "100%", paddingBottom: "16px" }}>
      {/* Header */}
      <div style={{ padding: "24px 24px 0" }}>
        <h1 style={{
          fontSize: "24px", fontWeight: 700,
          color: T.textPrimary, marginBottom: "4px",
          letterSpacing: "-0.01em",
        }}>Att göra</h1>
        <p style={{ fontSize: "14px", color: T.textSecondary, marginBottom: "16px" }}>
          {totalDone}/{tasks.length} uppgifter klara
        </p>

        {/* Progress bar */}
        <div style={{
          height: 6,
          borderRadius: 3,
          background: T.bgSubtle,
          marginBottom: "20px",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${T.sage}, ${T.sageLight})`,
            borderRadius: 3,
            transition: "width 0.5s ease",
          }} />
        </div>

        {/* Filters */}
        <div style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "4px",
          marginBottom: "12px",
        }}>
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: "10px 18px",
                borderRadius: T.radiusFull,
                fontSize: "14px",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
                background: filter === f.id ? T.warmSlate : T.bgSubtle,
                color: filter === f.id ? "#fff" : T.textSecondary,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Show done toggle */}
        <button
          onClick={() => setShowDone(!showDone)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 14px",
            borderRadius: T.radiusXs,
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            marginBottom: "20px",
            background: showDone ? T.oliveTint : "transparent",
            color: showDone ? T.olive : T.textMuted,
            transition: "all 0.2s ease",
          }}
        >
          <Check size={16} />
          {showDone ? "Dölj klara" : "Visa klara"}
        </button>
      </div>

      {/* Task list */}
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Step heading */}
        <div style={{
          padding: "8px 14px",
          borderLeft: `3px solid ${T.terracotta}`,
          background: T.terracottaLight,
          borderRadius: `0 ${T.radiusXs} ${T.radiusXs} 0`,
          marginBottom: "4px",
        }}>
          <p style={{ fontSize: "13px", fontWeight: 600, color: T.terracotta }}>
            Nödbroms (dag 1–7)
          </p>
        </div>

        {filteredTasks.filter(t => t.step === "akut").map((task, i) => (
          <TaskItem key={i} {...task} />
        ))}

        {/* Step heading 2 */}
        <div style={{
          padding: "8px 14px",
          borderLeft: `3px solid ${T.dustyBlue}`,
          background: T.dustyBlueTint,
          borderRadius: `0 ${T.radiusXs} ${T.radiusXs} 0`,
          marginTop: "12px",
          marginBottom: "4px",
        }}>
          <p style={{ fontSize: "13px", fontWeight: 600, color: T.dustyBlue }}>
            Kartläggning (vecka 1–4)
          </p>
        </div>

        {filteredTasks.filter(t => t.step === "kartlaggning").map((task, i) => (
          <TaskItem key={i} {...task} />
        ))}
      </div>
    </div>
  );
}

// ── Design Tokens Showcase ─────────────────────────────────────

function TokensView() {
  const colorGroups = [
    {
      title: "Bakgrunder",
      colors: [
        { name: "Base (Linen)", hex: T.bgBase },
        { name: "Card", hex: T.bgCard },
        { name: "Subtle (Sand)", hex: T.bgSubtle },
        { name: "Accent Soft", hex: T.bgAccentSoft },
      ]
    },
    {
      title: "Text",
      colors: [
        { name: "Primary", hex: T.textPrimary },
        { name: "Secondary", hex: T.textSecondary },
        { name: "Muted", hex: T.textMuted },
      ]
    },
    {
      title: "Accent — Sage",
      colors: [
        { name: "Sage Dark", hex: T.sageDark },
        { name: "Sage", hex: T.sage },
        { name: "Sage Light", hex: T.sageLight },
        { name: "Sage Tint", hex: T.sageTint },
      ]
    },
    {
      title: "Stödfärger",
      colors: [
        { name: "Terracotta (varning)", hex: T.terracotta },
        { name: "Terracotta Tint", hex: T.terracottaLight },
        { name: "Dusty Blue (info)", hex: T.dustyBlue },
        { name: "Dusty Blue Tint", hex: T.dustyBlueTint },
        { name: "Olive (success)", hex: T.olive },
        { name: "Olive Tint", hex: T.oliveTint },
      ]
    },
  ];

  return (
    <div style={{ background: T.bgBase, minHeight: "100%", padding: "24px", paddingBottom: "16px" }}>
      <h1 style={{
        fontSize: "24px", fontWeight: 700,
        color: T.textPrimary, marginBottom: "8px",
      }}>Design System</h1>
      <p style={{ fontSize: "14px", color: T.textSecondary, marginBottom: "28px" }}>
        "Gentle Structure" — Sista Resan redesign tokens
      </p>

      {/* Color palette */}
      {colorGroups.map((group, gi) => (
        <div key={gi} style={{ marginBottom: "24px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
            {group.title}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
            {group.colors.map((c, ci) => (
              <div key={ci} style={{
                ...cardStyle,
                padding: "12px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>
                <div style={{
                  width: 36, height: 36,
                  borderRadius: T.radiusXs,
                  background: c.hex,
                  border: `1px solid ${T.border}`,
                  flexShrink: 0,
                }} />
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: T.textPrimary }}>{c.name}</p>
                  <p style={{ fontSize: "11px", color: T.textMuted, fontFamily: "monospace" }}>{c.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Button showcase */}
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "13px", fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
          Knappar
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button style={btnPrimary}>Primär knapp <ArrowRight size={16} /></button>
          <button style={btnSecondary}>Sekundär knapp</button>
          <button style={{
            ...btnPrimary,
            background: "transparent",
            color: T.sage,
            border: "none",
            fontSize: "15px",
          }}>Textlänk →</button>
        </div>
      </div>

      {/* Card showcase */}
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "13px", fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
          Kort
        </h3>
        <div style={cardStyle}>
          <p style={{ fontWeight: 600, fontSize: "15px", color: T.textPrimary, marginBottom: "4px" }}>Standard kort</p>
          <p style={{ fontSize: "13px", color: T.textSecondary }}>Mjuk skugga, varma kanter, generöst padding.</p>
        </div>
      </div>

      {/* Typography */}
      <div>
        <h3 style={{ fontSize: "13px", fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
          Typografi (Inter)
        </h3>
        <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "12px" }}>
          <p style={{ fontSize: "32px", fontWeight: 700, color: T.textPrimary, letterSpacing: "-0.02em" }}>Heading 1</p>
          <p style={{ fontSize: "24px", fontWeight: 700, color: T.textPrimary, letterSpacing: "-0.01em" }}>Heading 2</p>
          <p style={{ fontSize: "18px", fontWeight: 600, color: T.textPrimary }}>Heading 3</p>
          <p style={{ fontSize: "15px", fontWeight: 500, color: T.textPrimary }}>Body — 15px medium</p>
          <p style={{ fontSize: "14px", color: T.textSecondary, lineHeight: 1.6 }}>
            Body text — 14px. Varm grå för löpande text. Generöst radavstånd
            för läsbarhet i en svår tid.
          </p>
          <p style={{ fontSize: "13px", color: T.textMuted }}>Caption — 13px muted</p>
          <p style={{ fontSize: "12px", color: T.textMuted }}>Small — 12px (minsta storlek)</p>
        </div>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────

export default function SistaResanRedesign() {
  const [currentView, setCurrentView] = useState("landing");
  const [activeTab, setActiveTab] = useState("home");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "home") setCurrentView("dashboard");
    else if (tab === "tasks") setCurrentView("tasks");
    else if (tab === "more") setCurrentView("tokens");
    else setCurrentView("dashboard");
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
    if (view === "dashboard") setActiveTab("home");
  };

  return (
    <div style={{
      fontFamily: T.fontFamily,
      maxWidth: 430,
      margin: "0 auto",
      background: T.bgBase,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      boxShadow: "0 0 60px rgba(0,0,0,0.08)",
      WebkitFontSmoothing: "antialiased",
    }}>
      {/* Page switcher bar */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        background: T.bgElevated,
        borderBottom: `1px solid ${T.borderLight}`,
        padding: "8px 16px",
        display: "flex",
        gap: "6px",
        overflowX: "auto",
      }}>
        {[
          { id: "landing", label: "Landing" },
          { id: "dashboard", label: "Dashboard" },
          { id: "tasks", label: "Uppgifter" },
          { id: "tokens", label: "Design System" },
        ].map(v => (
          <button
            key={v.id}
            onClick={() => {
              setCurrentView(v.id);
              if (v.id === "dashboard") setActiveTab("home");
              else if (v.id === "tasks") setActiveTab("tasks");
              else if (v.id === "tokens") setActiveTab("more");
            }}
            style={{
              padding: "6px 14px",
              borderRadius: T.radiusFull,
              fontSize: "13px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              background: currentView === v.id ? T.warmSlate : T.bgSubtle,
              color: currentView === v.id ? "#fff" : T.textSecondary,
              transition: "all 0.2s ease",
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {currentView === "landing" && <LandingView onNavigate={handleNavigate} />}
        {currentView === "dashboard" && <DashboardView />}
        {currentView === "tasks" && <TasksView />}
        {currentView === "tokens" && <TokensView />}
      </div>

      {/* Bottom nav — show on app views */}
      {currentView !== "landing" && (
        <BottomNavProto activeTab={activeTab} setActiveTab={handleTabChange} />
      )}
    </div>
  );
}