import { useState } from "react";
import {
  Home, CheckSquare, Wallet, FolderOpen, MoreHorizontal, ChevronRight,
  Settings, Clock, AlertTriangle, Shield, Lock, Scale, User, Calendar,
  Zap, ArrowRight, Check, Circle, X, Bell, MessageSquare, FileText,
  Heart, Feather, Leaf, Sun, TreePine, Waves, Eye, EyeOff
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   SISTA RESAN — DESIGN C: "SOFT HORIZON"

   Mjuk, varm, illustrativ. Som en barnbok för vuxna.
   Tänk: Headspace möter en skandinavisk keramikstudio.

   - Krämig vit + pastellfärger
   - Rundade "blobby" former
   - Gradient-kort med mjuka övergångar
   - Stor, vänlig typografi
   - Varje fas har sin egen färgvärld
   - Illustrativa ikoner med bakgrundsformer
   ═══════════════════════════════════════════════════════════════ */

const T = {
  bgCream: "#FBF8F4",
  bgWarm: "#F5F0E8",
  bgCard: "#FFFFFF",
  bgPeach: "#FFF5EE",
  bgMint: "#F0F7F4",
  bgLavender: "#F4F0FA",
  bgSky: "#EEF4FA",

  textDark: "#3D3530",
  textBody: "#655D56",
  textLight: "#A09890",
  textOnDark: "#FFFCF8",

  peach: "#E8956A",
  peachDark: "#D47A50",
  peachLight: "#F2B899",
  peachTint: "#FFF5EE",

  mint: "#6DAE96",
  mintDark: "#4E8F78",
  mintLight: "#92C7B3",
  mintTint: "#F0F7F4",

  lavender: "#9E8BC5",
  lavenderDark: "#7E6BA8",
  lavenderTint: "#F4F0FA",

  sky: "#6FA3C7",
  skyDark: "#5088AE",
  skyTint: "#EEF4FA",

  coral: "#D4736A",
  coralTint: "#FDF0EE",

  honey: "#D4A95A",
  honeyTint: "#FDF6EA",

  border: "#EDE8E0",
  borderSoft: "#F5F0E8",
  shadow: "0 2px 8px rgba(61,53,48,0.04), 0 8px 24px rgba(61,53,48,0.04)",
  shadowHover: "0 4px 12px rgba(61,53,48,0.06), 0 12px 32px rgba(61,53,48,0.06)",

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

const btnWarm = {
  width: "100%",
  minHeight: "56px",
  padding: "16px 28px",
  background: `linear-gradient(135deg, ${T.peach}, ${T.peachDark})`,
  color: T.textOnDark,
  fontWeight: 700,
  fontSize: "17px",
  borderRadius: T.radiusMd,
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  transition: "all 0.25s ease",
  boxShadow: "0 4px 16px rgba(232,149,106,0.25)",
};

const btnOutline = {
  ...btnWarm,
  background: T.bgCard,
  color: T.textDark,
  border: `2px solid ${T.border}`,
  boxShadow: T.shadow,
  fontWeight: 600,
};

function BlobShape({ color, size, style: extraStyle }) {
  return (
    <div style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "42% 58% 62% 38% / 45% 55% 45% 55%",
      background: color,
      opacity: 0.5,
      pointerEvents: "none",
      ...extraStyle,
    }} />
  );
}

function IconBubble({ icon: Icon, color, bgColor, size = 48 }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size * 0.4,
      background: bgColor,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <Icon size={size * 0.45} color={color} strokeWidth={1.5} />
    </div>
  );
}

function NavTabC({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: "3px", padding: "8px 12px", minWidth: "64px",
      background: active ? T.peachTint : "none",
      border: "none", cursor: "pointer",
      borderRadius: "14px 14px 0 0",
      color: active ? T.peach : T.textLight,
      transition: "all 0.2s ease",
    }}>
      <Icon size={20} strokeWidth={active ? 2.2 : 1.5} />
      <span style={{ fontSize: "11px", fontWeight: active ? 600 : 500 }}>{label}</span>
    </button>
  );
}

function BottomNavC({ activeTab, setActiveTab }) {
  return (
    <nav style={{
      position: "sticky", bottom: 0,
      background: T.bgCard,
      borderTop: `1px solid ${T.borderSoft}`,
      display: "flex", justifyContent: "space-around", alignItems: "flex-end",
      paddingBottom: "8px", paddingTop: "4px", zIndex: 50,
      boxShadow: "0 -4px 20px rgba(61,53,48,0.04)",
    }}>
      {[
        { id: "home", icon: Home, label: "Hem" },
        { id: "tasks", icon: CheckSquare, label: "Att göra" },
        { id: "economy", icon: Wallet, label: "Ekonomi" },
        { id: "docs", icon: FolderOpen, label: "Dokument" },
        { id: "more", icon: MoreHorizontal, label: "Mer" },
      ].map(t => (
        <NavTabC key={t.id} icon={t.icon} label={t.label}
          active={activeTab === t.id} onClick={() => setActiveTab(t.id)} />
      ))}
    </nav>
  );
}

// ── Landing ────────────────────────────────────────────────────

function LandingC({ onNavigate }) {
  return (
    <div style={{ background: T.bgCream, minHeight: "100%", position: "relative", overflow: "hidden" }}>
      <BlobShape color={T.peachTint} size="280px" style={{ top: "-100px", right: "-80px" }} />
      <BlobShape color={T.mintTint} size="220px" style={{ bottom: "30%", left: "-80px" }} />
      <BlobShape color={T.lavenderTint} size="160px" style={{ bottom: "10%", right: "-40px" }} />

      {/* Hero */}
      <section style={{ padding: "52px 28px 28px", position: "relative", zIndex: 1 }}>
        <div style={{
          width: 64, height: 64,
          borderRadius: "24px",
          background: `linear-gradient(135deg, ${T.mintTint}, ${T.bgMint})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "28px",
          boxShadow: "0 4px 16px rgba(109,174,150,0.15)",
        }}>
          <Leaf size={30} color={T.mint} strokeWidth={1.5} />
        </div>

        <h1 style={{
          fontSize: "34px", fontWeight: 800,
          color: T.textDark, lineHeight: 1.15,
          marginBottom: "16px", letterSpacing: "-0.02em",
        }}>
          En vänlig hand<br />
          genom sorgen
        </h1>

        <p style={{
          fontSize: "17px", color: T.textBody,
          lineHeight: 1.65, maxWidth: "320px",
        }}>
          Sista Resan gör det praktiska enklare — så du kan fokusera
          på det som verkligen betyder något.
        </p>
      </section>

      {/* Warm message */}
      <section style={{ padding: "0 28px 28px", position: "relative", zIndex: 1 }}>
        <div style={{
          background: `linear-gradient(135deg, ${T.bgPeach}, ${T.bgCream})`,
          borderRadius: T.radius,
          padding: "22px",
          border: `1px solid rgba(232,149,106,0.15)`,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
            <Heart size={20} color={T.peach} strokeWidth={1.5} style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: "15px", color: T.textBody, lineHeight: 1.6 }}>
              Du behöver inte ha koll på allt. Vi visar vägen,
              en sak i taget, i din egen takt.
            </p>
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section style={{ padding: "0 28px 36px", display: "flex", flexDirection: "column", gap: "12px", position: "relative", zIndex: 1 }}>
        <button onClick={() => onNavigate("dashboard")} style={btnWarm}>
          Börja här <ArrowRight size={18} />
        </button>
        <button style={btnOutline}>
          Fortsätt där du var
        </button>
      </section>

      {/* Features — illustrated cards */}
      <section style={{ padding: "0 28px 36px", position: "relative", zIndex: 1 }}>
        <h2 style={{
          fontSize: "24px", fontWeight: 700,
          color: T.textDark, marginBottom: "20px",
        }}>Så hjälper vi dig</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[
            { icon: Clock, title: "Personlig tidslinje", desc: "Anpassad efter just din situation", color: T.sky, bg: T.skyTint, accent: T.bgSky },
            { icon: FileText, title: "Bouppteckning", desc: "Samla underlag steg för steg", color: T.mint, bg: T.mintTint, accent: T.bgMint },
            { icon: MessageSquare, title: "Fråga AI-assistenten", desc: "Juridiken förklarad på enkel svenska", color: T.lavender, bg: T.lavenderTint, accent: T.bgLavender },
            { icon: Bell, title: "Smarta påminnelser", desc: "Vi håller koll — du behöver inte", color: T.peach, bg: T.peachTint, accent: T.bgPeach },
          ].map((f, i) => (
            <div key={i} style={{
              ...softCard,
              padding: "20px",
              background: `linear-gradient(135deg, ${f.accent}, ${T.bgCard})`,
              display: "flex", alignItems: "center", gap: "16px",
            }}>
              <IconBubble icon={f.icon} color={f.color} bgColor={f.bg} size={52} />
              <div>
                <p style={{ fontWeight: 600, fontSize: "16px", color: T.textDark, marginBottom: "3px" }}>{f.title}</p>
                <p style={{ fontSize: "14px", color: T.textBody, lineHeight: 1.45 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process steps — playful */}
      <section style={{ padding: "0 28px 36px", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: T.textDark, marginBottom: "20px" }}>
          Tre enkla steg
        </h2>
        {[
          { n: "1", title: "Berätta om din situation", desc: "Några frågor — tar 2 minuter", color: T.peach, bg: T.peachTint },
          { n: "2", title: "Följ din personliga plan", desc: "Vi visar vad som behöver göras härnäst", color: T.mint, bg: T.mintTint },
          { n: "3", title: "Ta det i din takt", desc: "Ingen brådska — allt sparas automatiskt", color: T.lavender, bg: T.lavenderTint },
        ].map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: "16px",
            marginBottom: i < 2 ? "20px" : 0,
          }}>
            <div style={{
              width: 44, height: 44,
              borderRadius: "16px",
              background: s.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: "18px", color: s.color,
              flexShrink: 0,
            }}>{s.n}</div>
            <div style={{ paddingTop: "2px" }}>
              <p style={{ fontWeight: 600, fontSize: "16px", color: T.textDark, marginBottom: "2px" }}>{s.title}</p>
              <p style={{ fontSize: "14px", color: T.textBody }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Trust */}
      <section style={{ padding: "0 28px 36px", position: "relative", zIndex: 1 }}>
        <div style={{
          ...softCard,
          background: `linear-gradient(135deg, ${T.bgMint}, ${T.bgCream})`,
        }}>
          <h3 style={{ fontWeight: 700, fontSize: "17px", color: T.textDark, marginBottom: "16px" }}>
            Tryggt & säkert
          </h3>
          {[
            { icon: Scale, text: "Baserat på svensk lag", color: T.mint },
            { icon: Lock, text: "Allt stannar på din enhet", color: T.sky },
            { icon: Shield, text: "Grundversionen är gratis", color: T.peach },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: i < 2 ? "14px" : 0 }}>
              <IconBubble icon={t.icon} color={t.color} bgColor={`${t.color}18`} size={36} />
              <p style={{ fontSize: "14px", color: T.textBody }}>{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{
        padding: "24px 28px 32px", textAlign: "center",
        borderTop: `1px solid ${T.borderSoft}`,
        position: "relative", zIndex: 1,
      }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "10px" }}>
          {["Om oss", "Integritet", "Villkor", "FAQ"].map(l => (
            <span key={l} style={{ fontSize: "13px", color: T.textLight, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
        <p style={{ fontSize: "12px", color: T.textLight }}>Ersätter inte juridisk rådgivning.</p>
      </footer>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────

function DashboardC() {
  return (
    <div style={{ background: T.bgCream, minHeight: "100%", position: "relative", overflow: "hidden", paddingBottom: "16px" }}>
      <BlobShape color={T.mintTint} size="200px" style={{ top: "-60px", right: "-60px" }} />

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
          width: 46, height: 46,
          borderRadius: "16px",
          background: T.bgCard,
          border: `1px solid ${T.borderSoft}`,
          boxShadow: T.shadow,
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Settings size={20} color={T.textBody} strokeWidth={1.5} />
        </button>
      </div>

      {/* Phase — big gradient card */}
      <div style={{ padding: "0 28px", marginBottom: "20px", position: "relative", zIndex: 1 }}>
        <div style={{
          background: `linear-gradient(135deg, ${T.bgSky}, ${T.bgMint})`,
          borderRadius: T.radius,
          padding: "24px",
          border: `1px solid ${T.borderSoft}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(111,163,199,0.1)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <IconBubble icon={Waves} color={T.sky} bgColor={`${T.sky}20`} size={52} />
            <div>
              <p style={{ fontSize: "12px", color: T.textLight, marginBottom: "3px", fontWeight: 500 }}>Du är i fasen</p>
              <p style={{ fontSize: "19px", fontWeight: 700, color: T.textDark }}>Kartläggning</p>
            </div>
          </div>
          <ChevronRight size={20} color={T.textLight} />
        </div>
      </div>

      {/* Stats — pill style */}
      <div style={{ padding: "0 28px", marginBottom: "24px", display: "flex", gap: "12px", position: "relative", zIndex: 1 }}>
        {[
          { icon: User, value: "3", label: "Delägare", color: T.peach, bg: T.bgPeach },
          { icon: Calendar, value: "2", label: "Frister", color: T.coral, bg: T.coralTint },
        ].map((s, i) => (
          <div key={i} style={{
            ...softCard, flex: 1,
            background: `linear-gradient(135deg, ${s.bg}, ${T.bgCard})`,
            textAlign: "center", padding: "20px 12px",
          }}>
            <IconBubble icon={s.icon} color={s.color} bgColor={`${s.color}15`} size={44} />
            <p style={{ fontSize: "28px", fontWeight: 800, color: T.textDark, marginTop: "10px", lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: "13px", color: T.textBody, marginTop: "4px" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Priorities */}
      <div style={{ padding: "0 28px", marginBottom: "24px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <IconBubble icon={Zap} color={T.honey} bgColor={T.honeyTint} size={34} />
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: T.textDark }}>Gör detta först</h2>
        </div>
        {[
          { n: 1, label: "Kontakta banker", reason: "2 banker att meddela", color: T.coral, bg: T.coralTint },
          { n: 2, label: "Inventera tillgångar", reason: "Grund för bouppteckning", color: T.mint, bg: T.mintTint },
          { n: 3, label: "Kolla försäkringar", reason: "Dödsfallsersättning?", color: T.sky, bg: T.skyTint },
        ].map((a, i) => (
          <div key={i} style={{
            ...softCard,
            padding: "16px 18px", marginBottom: "8px",
            background: `linear-gradient(135deg, ${a.bg}, ${T.bgCard})`,
            display: "flex", alignItems: "center", gap: "14px",
            cursor: "pointer",
          }}>
            <div style={{
              width: 32, height: 32,
              borderRadius: "12px",
              background: `linear-gradient(135deg, ${a.color}, ${a.color}CC)`,
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

      {/* Deadline */}
      <div style={{ padding: "0 28px", marginBottom: "20px", position: "relative", zIndex: 1 }}>
        <div style={{
          ...softCard,
          background: `linear-gradient(135deg, ${T.coralTint}, ${T.bgCard})`,
          display: "flex", alignItems: "center", gap: "14px",
        }}>
          <IconBubble icon={AlertTriangle} color={T.coral} bgColor={`${T.coral}15`} size={44} />
          <div>
            <p style={{ fontWeight: 600, fontSize: "15px", color: T.textDark }}>Bouppteckning</p>
            <p style={{ fontSize: "13px", color: T.coral, fontWeight: 600, marginTop: "2px" }}>72 dagar kvar</p>
          </div>
        </div>
      </div>

      {/* AI */}
      <div style={{ padding: "0 28px", position: "relative", zIndex: 1 }}>
        <div style={{
          ...softCard,
          background: `linear-gradient(135deg, ${T.bgLavender}, ${T.bgCard})`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <IconBubble icon={MessageSquare} color={T.lavender} bgColor={`${T.lavender}15`} size={44} />
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

function TasksC() {
  const [filter, setFilter] = useState("all");
  const [showDone, setShowDone] = useState(false);

  const tasks = [
    { title: "Beställ dödsbevis", desc: "Kontakta Skatteverket", status: "klar", step: "akut" },
    { title: "Meddela banken", desc: "Kontakta alla banker", status: "ej", step: "akut", deadline: "3 dagar kvar", urgent: true },
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
      <BlobShape color={T.peachTint} size="180px" style={{ top: "-50px", left: "-50px" }} />

      <div style={{ padding: "28px 28px 0", position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: T.textDark, marginBottom: "4px" }}>Att göra</h1>
        <p style={{ fontSize: "14px", color: T.textBody, marginBottom: "18px" }}>{done}/{tasks.length} klara</p>

        {/* Progress — thick, warm */}
        <div style={{
          height: 10, borderRadius: 5,
          background: T.bgWarm, marginBottom: "22px", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: `linear-gradient(90deg, ${T.mint}, ${T.mintLight})`,
            borderRadius: 5, transition: "width 0.5s ease",
          }} />
        </div>

        {/* Filters — pill shaped with colors */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", marginBottom: "14px" }}>
          {[
            { id: "all", label: "Alla", color: T.textDark, bg: T.bgWarm, activeBg: T.textDark },
            { id: "akut", label: "Nödbroms", color: T.coral, bg: T.coralTint, activeBg: T.coral },
            { id: "kart", label: "Kartläggning", color: T.sky, bg: T.skyTint, activeBg: T.sky },
            { id: "boup", label: "Bouppteckning", color: T.mint, bg: T.mintTint, activeBg: T.mint },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: "10px 20px", borderRadius: T.radiusFull,
              fontSize: "14px", fontWeight: 600, border: "none", cursor: "pointer",
              whiteSpace: "nowrap", transition: "all 0.25s ease",
              background: filter === f.id ? f.activeBg : f.bg,
              color: filter === f.id ? T.textOnDark : f.color,
              boxShadow: filter === f.id ? `0 2px 12px ${f.color}30` : "none",
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
          background: showDone ? T.mintTint : T.bgWarm,
          color: showDone ? T.mintDark : T.textLight,
        }}>
          {showDone ? <Eye size={16} /> : <EyeOff size={16} />}
          {showDone ? "Dölj klara" : "Visa klara"}
        </button>
      </div>

      {/* Tasks */}
      <div style={{ padding: "0 28px", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Step label */}
        <div style={{
          padding: "10px 16px",
          background: `linear-gradient(135deg, ${T.coralTint}, ${T.bgCream})`,
          borderRadius: T.radiusSm,
          marginBottom: "4px",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.coral }} />
          <p style={{ fontSize: "13px", fontWeight: 700, color: T.coral }}>Nödbroms (dag 1–7)</p>
        </div>

        {filtered.filter(t => t.step === "akut").map((task, i) => {
          const isKlar = task.status === "klar";
          return (
            <div key={i} style={{
              ...softCard, padding: "18px 20px",
              display: "flex", alignItems: "flex-start", gap: "14px",
              opacity: isKlar ? 0.5 : 1,
              background: task.urgent ? `linear-gradient(135deg, ${T.coralTint}, ${T.bgCard})` : T.bgCard,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: "10px",
                border: isKlar ? "none" : `2px solid ${T.border}`,
                background: isKlar ? `linear-gradient(135deg, ${T.mint}, ${T.mintLight})` : "transparent",
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
                  <p style={{ fontSize: "12px", fontWeight: 700, marginTop: "6px", color: task.urgent ? T.coral : T.mint }}>
                    {task.deadline}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        <div style={{
          padding: "10px 16px",
          background: `linear-gradient(135deg, ${T.skyTint}, ${T.bgCream})`,
          borderRadius: T.radiusSm,
          marginTop: "12px", marginBottom: "4px",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.sky }} />
          <p style={{ fontSize: "13px", fontWeight: 700, color: T.sky }}>Kartläggning (vecka 1–4)</p>
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
                <p style={{ fontSize: "12px", fontWeight: 700, marginTop: "6px", color: T.mint }}>{task.deadline}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tokens ─────────────────────────────────────────────────────

function TokensC() {
  const groups = [
    { title: "Bakgrunder", colors: [
      { name: "Cream", hex: T.bgCream }, { name: "Warm", hex: T.bgWarm },
      { name: "Peach", hex: T.bgPeach }, { name: "Mint", hex: T.bgMint },
      { name: "Lavender", hex: T.bgLavender }, { name: "Sky", hex: T.bgSky },
    ]},
    { title: "Text", colors: [
      { name: "Dark", hex: T.textDark }, { name: "Body", hex: T.textBody }, { name: "Light", hex: T.textLight },
    ]},
    { title: "Accent", colors: [
      { name: "Peach", hex: T.peach }, { name: "Mint", hex: T.mint },
      { name: "Sky", hex: T.sky }, { name: "Lavender", hex: T.lavender },
      { name: "Coral", hex: T.coral }, { name: "Honey", hex: T.honey },
    ]},
  ];

  return (
    <div style={{ background: T.bgCream, minHeight: "100%", padding: "28px", paddingBottom: "16px", position: "relative", overflow: "hidden" }}>
      <BlobShape color={T.mintTint} size="200px" style={{ top: "-60px", right: "-40px" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: T.textDark, marginBottom: "4px" }}>Design System</h1>
        <p style={{ fontSize: "14px", color: T.textBody, marginBottom: "28px" }}>"Soft Horizon" — varm, mjuk, illustrativ</p>

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

        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ fontSize: "12px", fontWeight: 700, color: T.textLight, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>Knappar</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button style={btnWarm}>Varm primär <ArrowRight size={16} /></button>
            <button style={btnOutline}>Outline sekundär</button>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "12px", fontWeight: 700, color: T.textLight, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>Iconbubblor</h3>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <IconBubble icon={Heart} color={T.peach} bgColor={T.peachTint} size={52} />
            <IconBubble icon={Leaf} color={T.mint} bgColor={T.mintTint} size={52} />
            <IconBubble icon={Waves} color={T.sky} bgColor={T.skyTint} size={52} />
            <IconBubble icon={Sun} color={T.honey} bgColor={T.honeyTint} size={52} />
            <IconBubble icon={TreePine} color={T.lavender} bgColor={T.lavenderTint} size={52} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────

export default function DesignC() {
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
        background: "rgba(251,248,244,0.92)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${T.borderSoft}`,
        padding: "8px 16px", display: "flex", gap: "6px",
      }}>
        {[
          { id: "landing", label: "Landing", color: T.peach },
          { id: "dashboard", label: "Dashboard", color: T.mint },
          { id: "tasks", label: "Uppgifter", color: T.sky },
          { id: "tokens", label: "Design System", color: T.lavender },
        ].map(v => (
          <button key={v.id} onClick={() => {
            setView(v.id);
            if (v.id === "dashboard") setTab("home");
            else if (v.id === "tasks") setTab("tasks");
            else if (v.id === "tokens") setTab("more");
          }} style={{
            padding: "7px 16px", borderRadius: T.radiusFull,
            fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer",
            background: view === v.id ? v.color : T.bgWarm,
            color: view === v.id ? T.textOnDark : T.textBody,
            transition: "all 0.2s ease",
          }}>
            {v.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }}>
        {view === "landing" && <LandingC onNavigate={(v) => { setView(v); setTab("home"); }} />}
        {view === "dashboard" && <DashboardC />}
        {view === "tasks" && <TasksC />}
        {view === "tokens" && <TokensC />}
      </div>

      {view !== "landing" && <BottomNavC activeTab={tab} setActiveTab={handleTab} />}
    </div>
  );
}