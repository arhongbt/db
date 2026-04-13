import { useState, useMemo } from "react";

// Seed-based random for consistency
let _seed = 42;
function seededRandom() {
  _seed = (_seed * 16807 + 0) % 2147483647;
  return (_seed - 1) / 2147483646;
}
function randInt(min, max) {
  return Math.floor(seededRandom() * (max - min + 1)) + min;
}
function weightedChoice(items, weights) {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = seededRandom() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}
function sample(arr, n) {
  const copy = [...arr];
  const result = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(seededRandom() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}
function gauss(mean, std) {
  let u = 0, v = 0;
  while (u === 0) u = seededRandom();
  while (v === 0) v = seededRandom();
  return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const NAMES = ["Anna Andersson","Erik Johansson","Maria Karlsson","Lars Nilsson","Eva Eriksson","Johan Larsson","Karin Olsson","Anders Persson","Sara Svensson","Per Gustafsson","Birgitta Pettersson","Magnus Jonsson","Lena Jansson","Henrik Hansson","Elisabeth Bengtsson","Olof Jönsson","Ingrid Lindberg","Gustav Lindström","Margareta Jakobsson","Karl Magnusson","Christina Lindgren","Fredrik Axelsson","Ulla Bergström","Sven Lundberg","Helena Berglund","Mikael Fredriksson","Kristina Sandberg","Jan Henriksson","Malin Forsberg","Nils Sjöberg","Emma Wallin","Daniel Engström","Cecilia Eklund","Peter Danielsson","Monica Lundin","Ola Håkansson","Gunilla Björk","Mattias Bergman","Annika Mattsson","Björn Fransson","Sofia Lindqvist","Thomas Samuelsson","Katarina Nyström","Bengt Holmberg","Jenny Arvidsson","Rickard Löfgren","Berit Söderberg","David Nyberg","Hanna Blomqvist","Martin Claesson","Elin Mårtensson","Stefan Nordström","Marianne Lundgren","Tomas Eliasson","Josefin Björklund","Robert Bergqvist","Barbro Isaksson","Axel Lindholm","Linda Nordin","Mats Nygren","Therese Lund","Claes Ström","Susanne Sundberg","Oscar Hermansson","Victoria Åberg","Göran Ekström","Camilla Holmgren","Andreas Hedlund","Åsa Dahlberg","Joakim Hellström","Lisa Sjögren","Patrik Abrahamsson","Agneta Falk","Jesper Martinsson","Ulrika Öberg"];
const RELATIONS = ["Barn","Make/Maka","Syskon","Barnbarn","Förälder","Annan släkting","Vän/Kontakt"];
const REL_W = [35,20,15,10,5,10,5];
const CITIES = ["Stockholm","Göteborg","Malmö","Uppsala","Linköping","Örebro","Västerås","Norrköping","Helsingborg","Jönköping","Umeå","Lund","Borås","Sundsvall","Gävle","Karlstad","Växjö","Halmstad","Kalmar","Falun"];
const JOBS = ["Pensionär","Lärare","Sjuksköterska","Ingenjör","Ekonom","Egenföretagare","Säljare","Chef","IT-konsult","Administratör","Arbetare","Student","Läkare","Jurist","Butiksanställd","Undersköterska","Frilansare","Hantverkare","Socialarbetare","Forskare"];

const FEATURES = {
  "Nödbroms":["Barn","Make/Maka","Syskon","Förälder"],
  "Bouppteckning":["Barn","Make/Maka","Syskon"],
  "Arvskifte":["Barn","Make/Maka","Syskon","Barnbarn"],
  "Arvskalkylator":["Barn","Make/Maka","Syskon","Barnbarn","Annan släkting"],
  "Fullmakt":["Barn","Make/Maka","Syskon"],
  "Bankbrev":["Barn","Make/Maka"],
  "Dödsannons":["Barn","Make/Maka","Syskon","Förälder"],
  "Kallelse":["Barn","Make/Maka","Syskon"],
  "Checklistor":["Barn","Make/Maka","Syskon","Barnbarn","Förälder","Annan släkting","Vän/Kontakt"],
  "Tillgångar":["Barn","Make/Maka","Syskon"],
  "Lösöre":["Barn","Make/Maka","Syskon","Barnbarn"],
  "Kostnader":["Barn","Make/Maka"],
  "Försäkringar":["Barn","Make/Maka","Syskon"],
  "Bankguide":["Barn","Make/Maka","Syskon","Barnbarn"],
  "Avsluta konton":["Barn","Make/Maka"],
  "Deklarera dödsbo":["Barn","Make/Maka"],
  "Skatteverket":["Barn","Make/Maka","Syskon"],
  "Begravning":["Barn","Make/Maka","Syskon","Förälder"],
  "Delägare-portal":["Barn","Make/Maka","Syskon","Barnbarn"],
  "Tidslinje":["Barn","Make/Maka","Syskon","Barnbarn","Förälder","Annan släkting"],
  "Ordlista":["Barn","Make/Maka","Syskon","Barnbarn","Förälder","Annan släkting","Vän/Kontakt"],
  "FAQ":["Barn","Make/Maka","Syskon","Barnbarn","Förälder","Annan släkting","Vän/Kontakt"],
  "Minnessida":["Barn","Make/Maka","Syskon","Barnbarn","Förälder","Annan släkting","Vän/Kontakt"],
  "AI Juridisk hjälp":["Barn","Make/Maka","Syskon"],
  "Skanner":["Barn","Make/Maka","Syskon"],
  "Export ZIP":["Barn","Make/Maka","Syskon"],
  "Sambo-arv":["Make/Maka","Barn"],
  "Särkullbarn":["Barn","Make/Maka"],
  "Konflikt":["Barn","Make/Maka","Syskon","Annan släkting"],
  "Internationellt":["Barn","Make/Maka","Syskon"],
  "Krypto":["Barn","Barnbarn"],
  "Digitala tillgångar":["Barn","Make/Maka","Syskon","Barnbarn"],
  "Företag i dödsbo":["Barn","Make/Maka"],
  "Dödsboanmälan":["Barn","Make/Maka","Syskon"],
  "Testamente":["Barn","Make/Maka","Syskon"],
  "Bodelning":["Make/Maka","Barn"],
  "Påminnelser":["Barn","Make/Maka","Syskon","Barnbarn"],
};

const MISSING = ["Direktchatt med jurist","Integration med Skatteverket","Automatisk bouppteckning via bank-API","Boka begravningsbyrå direkt","Realtidssamarbete","Engelsk version","Fler bankmallar","Värdering av lösöre","SMS-notiser","Dark mode","PDF-sammanfattning","Video-guider","Lättläst version","Mäklar-integration","Gemensam kalender","Skanna dödsbevis","Testamente med villkor","Snabbare laddning","Bättre sökfunktion","Röstinmatning","Koppling till försäkringsbolag","Auto-ifyllning Skatteverket","Sorgbearbetning/stöd","Flerspråkigt stöd"];

function generateProfiles() {
  _seed = 42;
  const profiles = [];
  for (let i = 0; i < 75; i++) {
    const age = weightedChoice([randInt(25,35),randInt(36,50),randInt(51,65),randInt(66,85)],[15,30,35,20]);
    const relation = weightedChoice(RELATIONS, REL_W);
    const tech = age < 40 ? weightedChoice([3,4,5],[20,40,40]) : age < 60 ? weightedChoice([2,3,4,5],[15,35,35,15]) : weightedChoice([1,2,3,4],[20,40,30,10]);
    const complexity = weightedChoice(["Enkelt","Medel","Komplext"],[25,50,25]);
    const heirs = complexity === "Enkelt" ? randInt(1,2) : complexity === "Medel" ? randInt(2,4) : randInt(3,7);

    const usedFeatures = {};
    Object.entries(FEATURES).forEach(([feat, rels]) => {
      if (rels.includes(relation)) {
        const prob = 0.3 + tech * 0.12 + (complexity !== "Enkelt" ? 0.1 : 0);
        if (seededRandom() < prob) {
          let base = 3.5 + tech * 0.15;
          usedFeatures[feat] = Math.max(1, Math.min(5, Math.round(base + gauss(0, 0.7))));
        }
      }
    });

    const plan = complexity === "Komplext" ? weightedChoice(["Gratis","Standard","Premium"],[10,50,40]) : age > 60 && complexity === "Enkelt" ? weightedChoice(["Gratis","Standard","Premium"],[50,40,10]) : weightedChoice(["Gratis","Standard","Premium"],[20,60,20]);

    const priceOpinions = plan === "Gratis" ? ["Bra att det är gratis","Rimligt","Saknar funktioner i gratis"] : plan === "Standard" ? ["Rimligt pris","Lite dyrt men värt det","För dyrt","Bra engångspris"] : ["Rimligt för vad man får","Lite dyrt","Värt varenda krona","Förväntar mig mer"];

    const nav = Math.min(10, Math.max(1, Math.round(6.5 + tech * 0.5 + gauss(0, 1))));
    const understand = Math.min(10, Math.max(1, Math.round(6 + tech * 0.55 + gauss(0, 1))));
    const design = Math.min(10, Math.max(1, Math.round(7 + gauss(0, 1.2))));
    const nps = Math.min(10, Math.max(0, Math.round(6.5 + tech * 0.35 + (complexity !== "Enkelt" ? 0.5 : 0) + gauss(0, 1.5))));

    const nMissing = randInt(0, 3);
    const missing = nMissing > 0 ? sample(MISSING, nMissing) : ["Inget saknas"];

    profiles.push({
      id: i + 1, name: NAMES[i], age, city: CITIES[i % CITIES.length], job: JOBS[i % JOBS.length],
      relation, tech, complexity, heirs, usedFeatures, plan,
      priceOpinion: priceOpinions[Math.floor(seededRandom() * priceOpinions.length)],
      nav, understand, design, nps,
      recommend: nps >= 7 ? "Ja" : nps >= 5 ? "Kanske" : "Nej",
      missing
    });
  }
  return profiles;
}

const TABS = ["Sammanfattning","Profiler","Betyg","Funktioner","Prisanalys","Insikter"];

function StatCard({ label, value, sub, color = "gray" }) {
  const colors = { green: "bg-green-50 text-green-700 border-green-200", red: "bg-red-50 text-red-700 border-red-200", amber: "bg-amber-50 text-amber-700 border-amber-200", blue: "bg-blue-50 text-blue-700 border-blue-200", gray: "bg-gray-50 text-gray-700 border-gray-200" };
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs mt-0.5">{label}</p>
      {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
    </div>
  );
}

function ExportCSV({ profiles }) {
  const download = () => {
    let csv = "\uFEFF#,Namn,Ålder,Stad,Yrke,Relation,Teknikvana,Komplexitet,Delägare,Plan,Navigation,Förståelse,Design,NPS,Rekommenderar,Prisåsikt,Saknas\n";
    profiles.forEach(p => {
      csv += `${p.id},"${p.name}",${p.age},"${p.city}","${p.job}","${p.relation}",${p.tech},"${p.complexity}",${p.heirs},"${p.plan}",${p.nav},${p.understand},${p.design},${p.nps},"${p.recommend}","${p.priceOpinion}","${p.missing.join('; ')}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sistaresan_analys_75_profiler.csv";
    a.click();
  };
  return <button onClick={download} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Ladda ner CSV</button>;
}

export default function App() {
  const profiles = useMemo(() => generateProfiles(), []);
  const [tab, setTab] = useState("Sammanfattning");

  const avgNav = (profiles.reduce((s,p) => s + p.nav, 0) / 75).toFixed(1);
  const avgUnd = (profiles.reduce((s,p) => s + p.understand, 0) / 75).toFixed(1);
  const avgDes = (profiles.reduce((s,p) => s + p.design, 0) / 75).toFixed(1);
  const avgNps = (profiles.reduce((s,p) => s + p.nps, 0) / 75).toFixed(1);
  const promoters = profiles.filter(p => p.nps >= 9).length;
  const detractors = profiles.filter(p => p.nps <= 6).length;
  const npsScore = Math.round((promoters - detractors) / 75 * 100);
  const pctYes = Math.round(profiles.filter(p => p.recommend === "Ja").length / 75 * 100);
  const pctMaybe = Math.round(profiles.filter(p => p.recommend === "Kanske").length / 75 * 100);
  const pctNo = Math.round(profiles.filter(p => p.recommend === "Nej").length / 75 * 100);
  const planCounts = { Gratis: profiles.filter(p => p.plan === "Gratis").length, Standard: profiles.filter(p => p.plan === "Standard").length, Premium: profiles.filter(p => p.plan === "Premium").length };
  const totalRev = planCounts.Standard * 899 + planCounts.Premium * 1499;

  const featUsage = {};
  const featRatings = {};
  profiles.forEach(p => {
    Object.entries(p.usedFeatures).forEach(([f, r]) => {
      featUsage[f] = (featUsage[f] || 0) + 1;
      if (!featRatings[f]) featRatings[f] = [];
      featRatings[f].push(r);
    });
  });
  const topFeats = Object.entries(featUsage).sort((a,b) => b[1] - a[1]).slice(0, 15);

  const missingCount = {};
  profiles.forEach(p => p.missing.forEach(m => { if (m !== "Inget saknas") missingCount[m] = (missingCount[m] || 0) + 1; }));
  const topMissing = Object.entries(missingCount).sort((a,b) => b[1] - a[1]).slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-800">Sista Resan — Användaranalys</h1>
          <p className="text-sm text-gray-500">75 simulerade profiler · {new Date().toLocaleDateString("sv-SE")}</p>
        </div>

        <div className="flex gap-1 mb-6 flex-wrap">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-green-700 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"}`}>{t}</button>
          ))}
          <div className="ml-auto"><ExportCSV profiles={profiles} /></div>
        </div>

        {tab === "Sammanfattning" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Navigation" value={`${avgNav}/10`} color="blue" />
              <StatCard label="Förståelse" value={`${avgUnd}/10`} color="blue" />
              <StatCard label="Design" value={`${avgDes}/10`} color="blue" />
              <StatCard label="NPS Score" value={npsScore} sub={`Promoters: ${promoters} · Detractors: ${detractors}`} color={npsScore > 30 ? "green" : "amber"} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Rekommenderar: Ja" value={`${pctYes}%`} color="green" />
              <StatCard label="Rekommenderar: Kanske" value={`${pctMaybe}%`} color="amber" />
              <StatCard label="Rekommenderar: Nej" value={`${pctNo}%`} color="red" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-3">Planval</h3>
                {[{n:"Gratis",p:0},{n:"Standard",p:899},{n:"Premium",p:1499}].map(pl => {
                  const c = planCounts[pl.n];
                  const pct = Math.round(c / 75 * 100);
                  return (
                    <div key={pl.n} className="mb-2">
                      <div className="flex justify-between text-sm mb-1"><span>{pl.n} ({pl.p} kr)</span><span className="font-medium">{c} st ({pct}%)</span></div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} /></div>
                    </div>
                  );
                })}
                <p className="text-sm font-bold text-green-700 mt-3">Potentiell intäkt: {totalRev.toLocaleString("sv-SE")} kr</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-3">Top 10 mest använda funktioner</h3>
                {topFeats.slice(0,10).map(([f, c]) => (
                  <div key={f} className="flex justify-between text-sm py-1 border-b border-gray-50">
                    <span>{f}</span>
                    <span className="text-gray-500">{c} anv. · {(featRatings[f].reduce((s,r)=>s+r,0)/featRatings[f].length).toFixed(1)}/5</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-3">Top 10 mest saknade funktioner</h3>
              <div className="grid md:grid-cols-2 gap-x-6">
                {topMissing.map(([m, c]) => (
                  <div key={m} className="flex justify-between text-sm py-1.5 border-b border-gray-50">
                    <span>{m}</span><span className="text-red-500 font-medium">{c} st</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "Profiler" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-green-700 text-white">
                {["#","Namn","Ålder","Stad","Yrke","Relation","Tech","Komplexitet","Delägare","Plan"].map(h => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}
              </tr></thead>
              <tbody>
                {profiles.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-400">{p.id}</td>
                    <td className="px-3 py-2 font-medium">{p.name}</td>
                    <td className="px-3 py-2">{p.age}</td>
                    <td className="px-3 py-2">{p.city}</td>
                    <td className="px-3 py-2">{p.job}</td>
                    <td className="px-3 py-2">{p.relation}</td>
                    <td className="px-3 py-2"><span className={`px-1.5 py-0.5 rounded text-xs font-medium ${p.tech >= 4 ? "bg-green-100 text-green-700" : p.tech <= 2 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>{p.tech}/5</span></td>
                    <td className="px-3 py-2">{p.complexity}</td>
                    <td className="px-3 py-2">{p.heirs}</td>
                    <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.plan === "Premium" ? "bg-purple-100 text-purple-700" : p.plan === "Standard" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{p.plan}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "Betyg" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-green-700 text-white">
                {["#","Namn","Nav","Förståelse","Design","NPS","Rek?","Prisåsikt","Saknas"].map(h => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}
              </tr></thead>
              <tbody>
                {profiles.map(p => (
                  <tr key={p.id} className={`border-b border-gray-50 ${p.nps >= 8 ? "bg-green-50" : p.nps <= 4 ? "bg-red-50" : ""}`}>
                    <td className="px-3 py-2 text-gray-400">{p.id}</td>
                    <td className="px-3 py-2 font-medium">{p.name}</td>
                    <td className="px-3 py-2">{p.nav}</td>
                    <td className="px-3 py-2">{p.understand}</td>
                    <td className="px-3 py-2">{p.design}</td>
                    <td className="px-3 py-2 font-bold">{p.nps}</td>
                    <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.recommend === "Ja" ? "bg-green-100 text-green-700" : p.recommend === "Nej" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{p.recommend}</span></td>
                    <td className="px-3 py-2 text-xs">{p.priceOpinion}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">{p.missing.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "Funktioner" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Funktionsanvändning & betyg</h3>
              {Object.entries(featUsage).sort((a,b) => b[1] - a[1]).map(([f, c]) => {
                const avg = (featRatings[f].reduce((s,r)=>s+r,0)/featRatings[f].length).toFixed(1);
                const pct = Math.round(c / 75 * 100);
                return (
                  <div key={f} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{f}</span>
                      <span className="text-gray-500">{c} användare ({pct}%) · Snitt: {avg}/5</span>
                    </div>
                    <div className="flex gap-1 h-4">
                      <div className="bg-green-400 rounded-l" style={{ width: `${pct}%` }} />
                      <div className="bg-gray-100 rounded-r flex-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "Prisanalys" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[{n:"Gratis",p:"0 kr",c:planCounts.Gratis},{n:"Standard",p:"899 kr",c:planCounts.Standard},{n:"Premium",p:"1 499 kr",c:planCounts.Premium}].map(pl => (
                <div key={pl.n} className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                  <p className="text-lg font-bold">{pl.c} st</p>
                  <p className="text-sm text-gray-500">{pl.n} ({pl.p})</p>
                  <p className="text-xs text-gray-400 mt-1">{Math.round(pl.c/75*100)}%</p>
                </div>
              ))}
            </div>
            <div className="bg-green-50 rounded-xl border border-green-200 p-5 text-center">
              <p className="text-sm text-green-600">Potentiell intäkt (75 användare)</p>
              <p className="text-3xl font-bold text-green-800">{totalRev.toLocaleString("sv-SE")} kr</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold mb-3">Prisåsikter</h3>
              {(() => {
                const opinions = {};
                profiles.forEach(p => { opinions[p.priceOpinion] = (opinions[p.priceOpinion] || 0) + 1; });
                return Object.entries(opinions).sort((a,b) => b[1] - a[1]).map(([o, c]) => (
                  <div key={o} className="flex justify-between text-sm py-1.5 border-b border-gray-50">
                    <span>{o}</span><span className="font-medium">{c} st ({Math.round(c/75*100)}%)</span>
                  </div>
                ));
              })()}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold mb-3">Per åldersgrupp</h3>
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="text-left py-2">Ålder</th><th>Gratis</th><th>Standard</th><th>Premium</th></tr></thead>
                <tbody>
                  {[["25-35",25,35],["36-50",36,50],["51-65",51,65],["66-85",66,85]].map(([label,lo,hi]) => {
                    const group = profiles.filter(p => p.age >= lo && p.age <= hi);
                    if (!group.length) return null;
                    return (
                      <tr key={label} className="border-b border-gray-50">
                        <td className="py-2 font-medium">{label}</td>
                        {["Gratis","Standard","Premium"].map(plan => {
                          const c = group.filter(p => p.plan === plan).length;
                          return <td key={plan} className="text-center">{c} ({Math.round(c/group.length*100)}%)</td>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "Insikter" && (
          <div className="space-y-4">
            {[
              { title: "Styrkor", color: "green", items: [
                ["Dokumentgenerering", "Allra mest uppskattade. Bouppteckning, fullmakter och bankbrev som PDF/Word sparar timmar."],
                ["Checklistor & tidslinje", "Ger struktur åt kaotisk process. Särskilt uppskattat av förstagångsanvändare."],
                ["Nödbromsen (dag 1-7)", "Unik funktion — ger omedelbart värde i akut situation."],
                ["Design & ton", "Lugn, professionell men varm. Perfekt för målgruppen."],
                ["Engångspris", "Starkt uppskattat att det inte är prenumeration."],
              ]},
              { title: "Förbättringsområden", color: "amber", items: [
                ["Äldre användare (65+)", `Nav-betyg lägre. Behöver: större text, enklare nav, röstinmatning.`],
                ["Sökfunktion", "Saknas helt. Flera användare nämner — bör prioriteras."],
                ["Video-guider", "Efterfrågas av 15%+ — korta 2-3 min per steg."],
                ["Direktchatt med jurist", "Mest efterfrågade saknade funktionen."],
                ["Realtidssamarbete", "Delägare-portal finns men saknar realtids-editing."],
              ]},
              { title: "Nästa steg (prioritet)", color: "blue", items: [
                ["1. Sökfunktion", "Lågt hängande frukt som förbättrar navigation avsevärt."],
                ["2. Tillgänglighet 65+", "Större text, förenklat läge, tydligare knappar."],
                ["3. Video-guider", "Börja med 5 videos för vanligaste stegen."],
                ["4. Tydligare Premium", "Lägg till exklusivt innehåll som motiverar prisskillnaden."],
                ["5. Realtidssamarbete", "Tekniskt krävande men stort värde för komplexa dödsbon."],
              ]},
            ].map(section => (
              <div key={section.title} className={`bg-white rounded-xl border p-5 ${section.color === "green" ? "border-green-200" : section.color === "amber" ? "border-amber-200" : "border-blue-200"}`}>
                <h3 className={`font-bold mb-3 ${section.color === "green" ? "text-green-800" : section.color === "amber" ? "text-amber-800" : "text-blue-800"}`}>{section.title}</h3>
                {section.items.map(([title, desc]) => (
                  <div key={title} className="mb-3">
                    <p className="text-sm font-semibold text-gray-900">{title}</p>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
