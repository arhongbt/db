import { useState } from "react";
import {
  Home, CheckSquare, Wallet, FolderOpen, MoreHorizontal, ChevronRight,
  Settings, Clock, AlertTriangle, Shield, Lock, Scale, User, Calendar,
  Zap, ArrowRight, Check, Bell, MessageSquare, FileText,
  Heart, Feather, Waves, Eye, EyeOff
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   SISTA RESAN — DESIGN E: "SOFT STRUCTURE — REFINED"

   C:s layout (blobbar, gradient-kort, iconbubblor)
   + A:s bas (linen, warm charcoal)
   + Stram palett: SAGE + DUSTY BLUE + terracotta (bara varning)

   Regler:
   - Sage green = knappar, success, progress, checkmarks
   - Dusty blue = info, AI, fas-indikator, sekundär
   - Terracotta = BARA varningar & förseningar
   - Allt annat = neutrala toner (warm charcoal, sand, linen)
   ═══════════════════════════════════════════════════════════════ */

const T = {
  bgCream: "#F7F5F0",
  bgWarm: "#F0EDE6",
  bgCard: "#FFFFFF",
  bgSageTint: "#EEF2EA",
  bgBlueTint: "#EDF2F6",
  bgWarnTint: "#FEF3EE",

  textDark: "#2A2622",
  textBody: "#6B6560",
  textLight: "#9C9590",
  textOnDark: "#FFFFFF",

  sage: "#6B7F5E",
  sageDark: "#4F6145",
  sageLight: "#8FA882",
  sageTint: "#EEF2EA",

  blue: "#6E8BA4",
  blueDark: "#567A93",
  blueTint: "#EDF2F6",

  warn: "#C4704B",
  warnTint: "#FEF3EE",

  warmSlate: "#4A4540",

  border: "#E8E4DD",
  borderSoft: "#F0EDE6",
  shadow: "0 2px 8px rgba(42,38,34,0.04), 0 8px 24px rgba(42,38,34,0.03)",

  radius: "24px",
  radiusMd: "18px",
  radiusSm: "14px",
  radiusFull: "9999px",
};

const softCard = {
  background: T.bgCard,
  borderRadius: T.radius,
  padding: "22px",
  boxShadow: T.shadow,
  border: `1px solid ${T.borderSoft}`,
  transition: "all 0.25s ease",
};

const btnPrimary = {
  width: "100%", minHeight: "56px", padding: "16px 28px",
  background: `linear-gradient(135deg, ${T.sage}, ${T.sageDark})`,
  color: T.textOnDark, fontWeight: 700, fontSize: "17px",
  borderRadius: T.radiusMd, border: "none", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
  transition: "all 0.25s ease",
  boxShadow: "0 4px 16px rgba(107,127,94,0.2)",
};

const btnOutline = {
  ...btnPrimary,
  background: T.bgCard, color: T.warmSlate,
  border: `2px solid ${T.border}`, boxShadow: T.shadow, fontWeight: 600,
};

function BlobShape({ color, size, style: s }) {
  return <div style={{
    position: "absolute", width: size, height: size,
    borderRadius: "42% 58% 62% 38% / 45% 55% 45% 55%",
    background: color, opacity: 0.5, pointerEvents: "none", ...s,
  }} />;
}

function IconBubble({ icon: Icon, color, bg, size = 48 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.4,
      background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <Icon size={size * 0.45} color={color} strokeWidth={1.5} />
    </div>
  );
}

function NavTab({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: "3px", padding: "8px 12px", minWidth: "64px",
      background: active ? T.sageTint : "none",
      border: "none", cursor: "pointer", borderRadius: "14px 14px 0 0",
      color: active ? T.sage : T.textLight, transition: "all 0.2s ease",
    }}>
      <Icon size={20} strokeWidth={active ? 2.2 : 1.5} />
      <span style={{ fontSize: "11px", fontWeight: active ? 600 : 500 }}>{label}</span>
    </button>
  );
}

function BottomNavE({ activeTab, setActiveTab }) {
  return (
    <nav style={{
      position: "sticky", bottom: 0, background: T.bgCard,
      borderTop: `1px solid ${T.borderSoft}`,
      display: "flex", justifyContent: "space-around", alignItems: "flex-end",
      paddingBottom: "8px", paddingTop: "4px", zIndex: 50,
      boxShadow: "0 -4px 20px rgba(42,38,34,0.04)",
    }}>
      {[
        { id: "home", icon: Home, label: "Hem" },
        { id: "tasks", icon: CheckSquare, label: "Att göra" },
        { id: "economy", icon: Wallet, label: "Ekonomi" },
        { id: "docs", icon: FolderOpen, label: "Dokument" },
        { id: "more", icon: MoreHorizontal, label: "Mer" },
      ].map(t => (
        <NavTab key={t.id} icon={t.icon} label={t.label}
          active={activeTab === t.id} onClick={() => setActiveTab(t.id)} />
      ))}
    </nav>
  );
}

// ── Landing ────────────────────────────────────────────────────

function LandingE({ onNavigate }) {
  return (
    <div style={{ background: T.bgCream, minHeight: "100%", position: "relative", overflow: "hidden" }}>
      <BlobShape color={T.sageTint} size="280px" style={{ top: "-100px", right: "-80px" }} />
      <BlobShape color={T.blueTint} size="200px" style={{ bottom: "32%", left: "-70px" }} />

      <section style={{ padding: "52px 28px 28px", position: "relative", zIndex: 1 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "24px",
          background: `linear-gradient(135deg, ${T.sageTint}, ${T.bgSageTint})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "28px", boxShadow: "0 4px 16px rgba(107,127,94,0.10)",
        }}>
          <Feather size={30} color={T.sage} strokeWidth={1.5} />
        </div>

        <h1 style={{
          fontSize: "34px", fontWeight: 800, color: T.textDark,
          lineHeight: 1.15, marginBottom: "16px", letterSpacing: "-0.02em",
        }}>
          En vänlig hand<br />genom sorgen
        </h1>
        <p style={{ fontSize: "17px", color: T.textBody, lineHeight: 1.65, maxWidth: "320px" }}>
          Sista Resan gör det praktiska enklare — så du kan fokusera
          på det som verkligen betyder något.
        </p>
      </section>

      <section style={{ padding: "0 28px 28px", position: "relative", zIndex: 1 }}>
        <div style={{
          background: `linear-gradient(135deg, ${T.sageTint}, ${T.bgCream})`,
          borderRadius: T.radius, padding: "22px",
          border: `1px solid rgba(107,127,94,0.10)`,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
            <Heart size={20} color={T.sage} strokeWidth={1.5} style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: "15px", color: T.textBody, lineHeight: 1.6 }}>
              Du behöver inte ha koll på allt. Vi visar vägen,
              en sak i taget, i din egen takt.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 28px 36px", display: "flex", flexDirection: "column", gap: "12px", position: "relative", zIndex: 1 }}>
        <button onClick={() => onNavigate("dashboard")} style={btnPrimary}>
          Börja här <ArrowRight size={18} />
        </button>
        <button style={btnOutline}>Fortsätt där du var</button>
      </section>

      <section style={{ padding: "0 28px 36px", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: T.textDark, marginBottom: "20px" }}>
          Så hjälper vi dig
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[
            { icon: Clock, title: "Personlig tidslinje", desc: "Anpassad efter just din situation", color: T.blue, bg: T.blueTint, accent: T.bgBlueTint },
            { icon: FileText, title: "Bouppteckning", desc: "Samla underlag steg för steg", color: T.sage, bg: T.sageTint, accent: T.bgSageTint },
            { icon: MessageSquare, title: "Fråga AI-assistenten", desc: "Juridiken förklarad på enkel svenska", color: T.blue, bg: T.blueTint, accent: T.bgBlueTint },
            { icon: Bell, title: "Smarta påminnelser", desc: "Vi håller koll — du behöver inte", color: T.sage, bg: T.sageTint, accent: T.bgSageTint },
          ].map((f, i) => (
            <div key={i} style={{
              ...softCard, padding: "20px",
              background: `linear-gradient(135deg, ${f.accent}, ${T.bgCard})`,
              display: "flex", alignItems: "center", gap: "16px",
            }}>
              <IconBubble icon={f.icon} color={f.color} bg={f.bg} size={52} />
              <div>
                <p style={{ fontWeight: 600, fontSize: "16px", color: T.textDark, marginBottom: "3px" }}>{f.title}</p>
                <p style={{ fontSize: "14px", color: T.textBody, lineHeight: 1.45 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "0 28px 36px", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: T.textDark, marginBottom: "20px" }}>
          Tre enkla steg
        </h2>
        {[
          { n: "1", title: "Berätta om din situation", desc: "Några frågor — tar 2 minuter", color: T.sage, bg: T.sageTint },
          { n: "2", title: "Följ din personliga plan", desc: "Vi visar vad som behöver göras härnäst", color: T.blue, bg: T.blueTint },
          { n: "3", title: "Ta det i din takt", desc: "Ingen brådska — allt sparas automatiskt", color: T.sage, bg: T.sageTint },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: i < 2 ? "20px" : 0 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "16px", background: s.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: "18px", color: s.color, flexShrink: 0,
            }}>{s.n}</div>
            <div style={{ paddingTop: "2px" }}>
              <p style={{ fontWeight: 600, fontSize: "16px", color: T.textDark, marginBottom: "2px" }}>{s.title}</p>
              <p style={{ fontSize: "14px", color: T.textBody }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section style={{ padding: "0 28px 36px", position: "relative", zIndex: 1 }}>
        <div style={{ ...softCard, background: `linear-gradient(135deg, ${T.bgSageTint}, ${T.bgCream})` }}>
          <h3 style={{ fontWeight: 700, fontSize: "17px", color: T.textDark, marginBottom: "16px" }}>
            Tryggt & säkert
          </h3>
          {[
            { icon: Scale, text: "Baserat på Ärvdabalken och Skatteverkets regler" },
            { icon: Lock, text: "Dina uppgifter stannar på din enhet" },
            { icon: Shield, text: "Grundversionen är helt gratis" },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: i < 2 ? "14px" : 0 }}>
              <IconBubble icon={t.icon} color={T.sage} bg={T.sageTint} size={36} />
              <p style={{ fontSize: "14px", color: T.textBody }}>{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{
        padding: "24px 28px 32px", textAlign: "center",
        borderTop: `1px solid ${T.borderSoft}`, position: "relative", zIndex: 1,
      }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "10px" }}>
          {["Om oss", "Integritet", "Villkor", "FAQ"].map(l => (
            <span key={l} style={{ fontSize: "13px", color: T.textLight, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
        <p style={{ fontSize: "12px", color: T.textLight }}>
          Sista Resan ger allmän vägledning och ersätter inte juridisk rådgivning.
        </p>
      </footer>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────

function DashboardE() {
  return (
    <div style={{ background: T.bgCream, minHeight: "100%", position: "relative", overflow: "hidden", paddingBottom: "16px" }}>
      <BlobShape color={T.sageTint} size="200px" style={{ top: "-60px", right: "-60px" }} />

      <div style={{
        padding: "28px 28px 0", display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: "24px", position: "relative", zIndex: 1,
      }}>
        <div>
          <p style={{ fontSize: "14px", color: T.textLight, marginBottom: "2px" }}>Dag 18 — ta det lugnt</p>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: T.textDark, letterSpacing: "-0.02em" }}>
            Annas dödsbo
          </h1>
        </div>
        <button style={{
          width: 46, height: 46, borderRadius: "16px",
          background: T.bgCard, border: `1px solid ${T.borderSoft}`,
          boxShadow: T.shadow, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Settings size={20} color={T.textBody} strokeWidth={1.5} />
        </button>
      </div>

      {/* Phase — dusty blue */}
      <div style={{ padding: "0 28px", marginBottom: "20px", position: "relative", zIndex: 1 }}>
        <div style={{
          background: `linear-gradient(135deg, ${T.blueTint}, ${T.bgCard})`,
          borderRadius: T.radius, padding: "24px",
          border: `1px solid ${T.borderSoft}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer", boxShadow: "0 4px 20px rgba(110,139,164,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <IconBubble icon={Waves} color={T.blue} bg={T.blueTint} size={52} />
            <div>
              <p style={{ fontSize: "12px", color: T.textLight, marginBottom: "3px", fontWeight: 500 }}>Du är i fasen</p>
              <p style={{ fontSize: "19px", fontWeight: 700, color: T.textDark }}>Kartläggning</p>
            </div>
          </div>
          <ChevronRight size={20} color={T.textLight} />
        </div>
      </div>

      {/* Stats — sage + blue */}
      <div style={{ padding: "0 28px", marginBottom: "24px", display: "flex", gap: "12px", position: "relative", zIndex: 1 }}>
        <div style={{
          ...softCard, flex: 1,
          background: `linear-gradient(135deg, ${T.sageTint}, ${T.bgCard})`,
          textAlign: "center", padding: "20px 12px",
        }}>
          <IconBubble icon={User} color={T.sage} bg={`${T.sage}15`} size={44} />
          <p style={{ fontSize: "28px", fontWeight: 800, color: T.textDark, marginTop: "10px", lineHeight: 1 }}>3</p>
          <p style={{ fontSize: "13px", color: T.textBody, marginTop: "4px" }}>Delägare</p>
        </div>
        <div style={{
          ...softCard, flex: 1,
          background: `linear-gradient(135deg, ${T.blueTint}, ${T.bgCard})`,
          textAlign: "center", padding: "20px 12px",
        }}>
          <IconBubble icon={Calendar} color={T.blue} bg={`${T.blue}15`} size={44} />
          <p style={{ fontSize: "28px", fontWeight: 800, color: T.textDark, marginTop: "10px", lineHeight: 1 }}>2</p>
          <p style={{ fontSize: "13px", color: T.textBody, marginTop: "4px" }}>Frister</p>
        </div>
      </div>

      {/* Priorities — numbered with sage */}
      <div style={{ padding: "0 28px", marginBottom: "24px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <IconBubble icon={Zap} color={T.sage} bg={T.sageTint} size={34} />
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: T.textDark }}>Gör detta först</h2>
        </div>
        {[
          { n: 1, label: "Kontakta banker", reason: "2 banker att meddela" },
          { n: 2, label: "Inventera tillgångar", reason: "Grund för bouppteckning" },
          { n: 3, label: "Kolla försäkringar", reason: "Dödsfallsersättning?" },
        ].map((a, i) => (
          <div key={i} style={{
            ...softCard, padding: "16px 18px", marginBottom: "8px",
            display: "flex", alignItems: "center", gap: "14px", cursor: "pointer",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "12px",
              background: `linear-gradient(135deg, ${T.sage}, ${T.sageDark})`,
              color: T.textOnDark,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", fontWeight: 800, flexShrink: 0,
            }}>{a.n}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: "15px", color: T.textDark }}>{a.label}</p>
              <p style={{ fontSize: "12px", color: T.textBody, marginTop: "2px" }}>{a.reason}</p>
            </div>
            <ChevronRight size={16} color={T.textLight} />
          </div>
        ))}
      </div>

      {/* Deadline — terracotta (only place it appears!) */}
      <div style={{ padding: "0 28px", marginBottom: "20px", position: "relative", zIndex: 1 }}>
        <div style={{
          ...softCard,
          background: `linear-gradient(135deg, ${T.warnTint}, ${T.bgCard})`,
          display: "flex", alignItems: "center", gap: "14px",
        }}>
          <IconBubble icon={AlertTriangle} color={T.warn} bg={`${T.warn}15`} size={44} />
          <div>
            <p style={{ fontWeight: 600, fontSize: "15px", color: T.textDark }}>Bouppteckning</p>
            <p style={{ fontSize: "13px", color: T.warn, fontWeight: 600, marginTop: "2px" }}>72 dagar kvar</p>
          </div>
        </div>
      </div>

      {/* AI — dusty blue */}
      <div style={{ padding: "0 28px", position: "relative", zIndex: 1 }}>
        <div style={{
          ...softCard,
          background: `linear-gradient(135deg, ${T.blueTint}, ${T.bgCard})`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <IconBubble icon={MessageSquare} color={T.blue} bg={`${T.blue}15`} size={44} />
            <div>
              <p style={{ fontWeight: 600, fontSize: "15px", color: T.textDark }}>Juridisk AI</p>
              <p style={{ fontSize: "12px", color: T.textBody }}>Fråga om arvsrätt</p>
            </div>
          </div>
          <ChevronRight size={18} color={T.textLight} />
        </div>
      </div>
    </div>
  );
}

// ── Tasks ──────────────────────────────────────────────────────

function TasksE() {
  const [filter, setFilter] = useState("all");
  const [showDone, setShowDone] = useState(false);

  const tasks = [
    { title: "Beställ dödsbevis", desc: "Kontakta Skatteverket", status: "klar", step: "akut" },
    { title: "Meddela banken", desc: "Kontakta alla banker", status: "ej", step: "akut", deadline: "3 dagar försenad", urgent: true },
    { title: "Kontakta försäkringsbolag", desc: "Gå igenom alla försäkringar", status: "ej", step: "kart", deadline: "12 dagar kvar" },
    { title: "Inventera tillgångar", desc: "Lista allt: fastigheter, konton, fordon", status: "ej", step: "kart" },
    { title: "Samla skulduppgifter", desc: "Kronofogden och banker", status: "ej", step: "kart" },
  ];

  const filtered = tasks.filter(t => {
    if (!showDone && t.status === "klar") return false;
    return true;
  });

  const done = tasks.filter(t => t.status === "klar").length;
  const pct = (done / tasks.length) * 100;

  return (
    <div style={{ background: T.bgCream, minHeight: "100%", position: "relative", overflow: "hidden", paddingBottom: "16px" }}>
      <BlobShape color={T.sageTint} size="180px" style={{ top: "-50px", left: "-50px" }} />

      <div style={{ padding: "28px 28px 0", position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: T.textDark, marginBottom: "4px" }}>Att göra</h1>
        <p style={{ fontSize: "14px", color: T.textBody, marginBottom: "18px" }}>{done}/{tasks.length} klara</p>

        {/* Progress — sage */}
        <div style={{ height: 10, borderRadius: 5, background: T.bgWarm, marginBottom: "22px", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: `linear-gradient(90deg, ${T.sage}, ${T.sageLight})`,
            borderRadius: 5, transition: "width 0.5s ease",
          }} />
        </div>

        {/* Filters — sage active, neutral inactive */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", marginBottom: "14px" }}>
          {[
            { id: "all", label: "Alla" },
            { id: "akut", label: "Nödbroms" },
            { id: "kart", label: "Kartläggning" },
            { id: "boup", label: "Bouppteckning" },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: "10px 20px", borderRadius: T.radiusFull,
              fontSize: "14px", fontWeight: 600, border: "none", cursor: "pointer",
              whiteSpace: "nowrap", transition: "all 0.25s ease",
              background: filter === f.id ? T.warmSlate : T.bgWarm,
              color: filter === f.id ? T.textOnDark : T.textBody,
            }}>
              {f.label}
            </button>
          ))}
        </div>

        <button onClick={() => setShowDone(!showDone)} style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "10px 16px", borderRadius: T.radiusSm,
          border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 500,
          marginBottom: "22px",
          background: showDone ? T.sageTint : T.bgWarm,
          color: showDone ? T.sage : T.textLight,
        }}>
          {showDone ? <Eye size={16} /> : <EyeOff size={16} />}
          {showDone ? "Dölj klara" : "Visa klara"}
        </button>
      </div>

      {/* Tasks */}
      <div style={{ padding: "0 28px", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Nödbroms — uses blue for step label (neutral info), warn only for urgent tasks */}
        <div style={{
          padding: "10px 16px",
          background: `linear-gradient(135deg, ${T.blueTint}, ${T.bgCream})`,
          borderRadius: T.radiusSm, marginBottom: "4px",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.blue }} />
          <p style={{ fontSize: "13px", fontWeight: 700, color: T.blue }}>Nödbroms (dag 1–7)</p>
        </div>

        {filtered.filter(t => t.step === "akut").map((task, i) => {
          const isKlar = task.status === "klar";
          return (
            <div key={i} style={{
              ...softCard, padding: "18px 20px",
              display: "flex", alignItems: "flex-start", gap: "14px",
              opacity: isKlar ? 0.5 : 1,
              background: task.urgent ? `linear-gradient(135deg, ${T.warnTint}, ${T.bgCard})` : T.bgCard,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: "10px",
                border: isKlar ? "none" : `2px solid ${T.border}`,
                background: isKlar ? `linear-gradient(135deg, ${T.sage}, ${T.sageLight})` : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: 1, cursor: "pointer",
              }}>
                {isKlar && <Check size={14} color="#fff" strokeWidth={3} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontWeight: 600, fontSize: "15px",
                  color: isKlar ? T.textLight : T.textDark,
                  textDecoration: isKlar ? "line-through" : "none",
                }}>{task.title}</p>
                <p style={{ fontSize: "13px", color: T.textBody, marginTop: "3px" }}>{task.desc}</p>
                {task.deadline && !isKlar && (
                  <p style={{
                    fontSize: "12px", fontWeight: 700, marginTop: "6px",
                    color: task.urgent ? T.warn : T.sage,
                  }}>{task.deadline}</p>
                )}
              </div>
            </div>
          );
        })}

        {/* Kartläggning */}
        <div style={{
          padding: "10px 16px",
          background: `linear-gradient(135deg, ${T.blueTint}, ${T.bgCream})`,
          borderRadius: T.radiusSm, marginTop: "12px", marginBottom: "4px",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.blue }} />
          <p style={{ fontSize: "13px", fontWeight: 700, color: T.blue }}>Kartläggning (vecka 1–4)</p>
        </div>

        {filtered.filter(t => t.step === "kart").map((task, i) => (
          <div key={i} style={{
            ...softCard, padding: "18px 20px",
            display: "flex", alignItems: "flex-start", gap: "14px",
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: "10px",
              border: `2px solid ${T.border}`,
              flexShrink: 0, marginTop: 1, cursor: "pointer",
            }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: "15px", color: T.textDark }}>{task.title}</p>
              <p style={{ fontSize: "13px", color: T.textBody, marginTop: "3px" }}>{task.desc}</p>
              {task.deadline && (
                <p style={{ fontSize: "12px", fontWeight: 700, marginTop: "6px", color: T.sage }}>{task.deadline}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tokens ─────────────────────────────────────────────────────

function TokensE() {
  const groups = [
    { title: "Bakgrunder", colors: [
      { name: "Cream (bas)", hex: T.bgCream }, { name: "Warm (sand)", hex: T.bgWarm },
      { name: "Sage Tint", hex: T.sageTint }, { name: "Blue Tint", hex: T.blueTint },
      { name: "Warn Tint", hex: T.warnTint }, { name: "Card", hex: T.bgCard },
    ]},
    { title: "Text", colors: [
      { name: "Dark", hex: T.textDark }, { name: "Body", hex: T.textBody }, { name: "Light", hex: T.textLight },
    ]},
    { title: "Accent (bara 3!)", colors: [
      { name: "Sage (primär)", hex: T.sage }, { name: "Dusty Blue (info)", hex: T.blue },
      { name: "Terracotta (varning)", hex: T.warn },
    ]},
  ];

  return (
    <div style={{ background: T.bgCream, minHeight: "100%", padding: "28px", paddingBottom: "16px", position: "relative", overflow: "hidden" }}>
      <BlobShape color={T.sageTint} size="200px" style={{ top: "-60px", right: "-40px" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: T.textDark, marginBottom: "4px" }}>Design System</h1>
        <p style={{ fontSize: "14px", color: T.textBody, marginBottom: "6px" }}>"Soft Structure — Refined"</p>
        <p style={{ fontSize: "13px", color: T.textLight, marginBottom: "28px", lineHeight: 1.5 }}>
          Bara 3 färger: sage (knappar, success), dusty blue (info, AI), terracotta (varningar).
        </p>

        {groups.map((g, gi) => (
          <div key={gi} style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 700, color: T.textLight, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
              {g.title}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
              {g.colors.map((c, ci) => (
                <div key={ci} style={{ ...softCard, padding: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "12px", background: c.hex, border: `1px solid ${T.border}`, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: T.textDark }}>{c.name}</p>
                    <p style={{ fontSize: "10px", color: T.textLight, fontFamily: "monospace" }}>{c.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Color usage rules */}
        <div style={{ ...softCard, marginBottom: "24px", background: `linear-gradient(135deg, ${T.sageTint}, ${T.bgCard})` }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: T.textDark, marginBottom: "12px" }}>Färgregler</h3>
          {[
            { color: T.sage, label: "Sage", use: "Knappar, checkmarks, progress, success-states" },
            { color: T.blue, label: "Dusty Blue", use: "Fas-kort, AI-assistent, info, steg-headers" },
            { color: T.warn, label: "Terracotta", use: "BARA varningar, förseningar, deadlines" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: i < 2 ? "12px" : 0 }}>
              <div style={{ width: 12, height: 12, borderRadius: 4, background: r.color, flexShrink: 0, marginTop: 4 }} />
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: T.textDark }}>{r.label}</p>
                <p style={{ fontSize: "12px", color: T.textBody }}>{r.use}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ fontSize: "12px", fontWeight: 700, color: T.textLight, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>Knappar</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button style={btnPrimary}>Sage primär <ArrowRight size={16} /></button>
            <button style={btnOutline}>Outline sekundär</button>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "12px", fontWeight: 700, color: T.textLight, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>Iconbubblor</h3>
          <div style={{ display: "flex", gap: "12px" }}>
            <IconBubble icon={Feather} color={T.sage} bg={T.sageTint} size={52} />
            <IconBubble icon={Waves} color={T.blue} bg={T.blueTint} size={52} />
            <IconBubble icon={AlertTriangle} color={T.warn} bg={T.warnTint} size={52} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────

export default function DesignE() {
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
      background: T.bgCream, minHeight: "100vh",
      display: "flex", flexDirection: "column",
      boxShadow: "0 0 60px rgba(0,0,0,0.06)",
      WebkitFontSmoothing: "antialiased",
    }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 60,
        background: "rgba(247,245,240,0.92)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${T.borderSoft}`,
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
            padding: "7px 16px", borderRadius: T.radiusFull,
            fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer",
            background: view === v.id ? T.sage : T.bgWarm,
            color: view === v.id ? T.textOnDark : T.textBody,
            transition: "all 0.2s ease",
          }}>
            {v.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }}>
        {view === "landing" && <LandingE onNavigate={(v) => { setView(v); setTab("home"); }} />}
        {view === "dashboard" && <DashboardE />}
        {view === "tasks" && <TasksE />}
        {view === "tokens" && <TokensE />}
      </div>

      {view !== "landing" && <BottomNavE activeTab={tab} setActiveTab={handleTab} />}
    </div>
  );
}