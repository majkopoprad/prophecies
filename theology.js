// Shared helpers for the theology pages: language, book names, biblia.sk
// links, verse quotes (VERSES comes from verses.js) and site navigation.

const T_LANG_KEY = "prophecies-lang";

function tGetLang() {
  try { return localStorage.getItem(T_LANG_KEY) || "sk"; } catch (e) { return "sk"; }
}
function tSetLang(l) {
  try { localStorage.setItem(T_LANG_KEY, l); } catch (e) {}
}

const T_BOOKS_SK = [
  ["Song of Solomon", "Pieseň piesní"],
  ["1 Corinthians", "1. Korinťanom"], ["2 Corinthians", "2. Korinťanom"],
  ["1 Chronicles", "1. Kroník"], ["Deuteronomy", "Deuteronómium"],
  ["Philippians", "Filipanom"], ["Colossians", "Kolosanom"],
  ["1 Timothy", "1. Timotejovi"], ["Revelation", "Zjavenie"],
  ["Zechariah", "Zachariáš"], ["Ephesians", "Efezanom"],
  ["Galatians", "Galaťanom"], ["Leviticus", "Levitikus"],
  ["1 Samuel", "1. Samuelova"], ["2 Samuel", "2. Samuelova"],
  ["Jeremiah", "Jeremiáš"], ["Proverbs", "Príslovia"],
  ["2 Kings", "2. Kráľov"], ["1 Kings", "1. Kráľov"],
  ["1 Peter", "1. Petrov"], ["2 Peter", "2. Petrov"],
  ["Genesis", "Genezis"], ["Numbers", "Numeri"], ["Ezekiel", "Ezechiel"],
  ["Hebrews", "Hebrejom"], ["Matthew", "Matúš"], ["Malachi", "Malachiáš"],
  ["Obadiah", "Abdiáš"], ["Haggai", "Aggeus"], ["Romans", "Rimanom"],
  ["Exodus", "Exodus"], ["1 John", "1. Jánov"], ["Isaiah", "Izaiáš"],
  ["Daniel", "Daniel"], ["Joshua", "Jozua"], ["Hosea", "Ozeáš"],
  ["Micah", "Micheáš"], ["Jonah", "Jonáš"], ["Titus", "Títovi"],
  ["Psalm", "Žalm"], ["Nahum", "Nahum"], ["Amos", "Ámos"],
  ["Luke", "Lukáš"], ["Mark", "Marek"], ["John", "Ján"], ["Acts", "Skutky"],
  ["Ruth", "Rút"], ["Joel", "Joel"], ["Job", "Jób"]
];

const T_ABBR = [
  ["Song of Solomon","vlp"],["1 Corinthians","1kor"],["2 Corinthians","2kor"],
  ["1 Chronicles","1krn"],["Deuteronomy","dt"],["Philippians","flp"],
  ["Colossians","kol"],["1 Timothy","1tim"],["Revelation","zj"],
  ["Zechariah","zach"],["Ephesians","ef"],["Galatians","ga"],
  ["Leviticus","lv"],["1 Samuel","1sam"],["2 Samuel","2sam"],
  ["Jeremiah","jer"],["Proverbs","pris"],["2 Kings","2krl"],
  ["1 Kings","1krl"],["1 Peter","1pt"],["2 Peter","2pt"],["Genesis","gn"],
  ["Numbers","nm"],["Ezekiel","ez"],["Hebrews","heb"],["Matthew","mt"],
  ["Malachi","mal"],["Obadiah","abd"],["Haggai","ag"],["Romans","rim"],
  ["Exodus","ex"],["1 John","1jn"],["Isaiah","iz"],["Daniel","dan"],
  ["Joshua","joz"],["Hosea","oz"],["Micah","mich"],["Jonah","jon"],
  ["Titus","tit"],["Psalm","z"],["Nahum","nah"],["Amos","am"],
  ["Luke","lk"],["Mark","mk"],["John","jn"],["Acts","sk"],
  ["Ruth","rut"],["Joel","joel"],["Job","job"]
];

function tRefSK(text) {
  let out = text;
  for (const [en, sk] of T_BOOKS_SK) out = out.split(en).join(sk);
  return out;
}

function tBibliaLink(ref) {
  const seg = ref.split(";")[0].trim();
  for (const [en, abbr] of T_ABBR) {
    if (seg.startsWith(en + " ")) {
      const ch = parseInt(seg.slice(en.length).trim(), 10);
      if (!isNaN(ch)) return "https://biblia.sk/citanie/seb/" + abbr + "/" + ch;
      break;
    }
  }
  return null;
}

// One quote block for a single reference (or "ref1; ref2" — each rendered).
function tQuote(ref, label, lang) {
  const parts = ref.split(";").map(s => s.trim()).filter(Boolean);
  let html = "";
  for (let i = 0; i < parts.length; i++) {
    const r = parts[i];
    const shown = lang === "sk" ? tRefSK(r) : r;
    const v = (typeof VERSES !== "undefined" && VERSES[r]) ? VERSES[r][lang] : "";
    const link = tBibliaLink(r);
    const refHTML = link
      ? `<a href="${link}" target="_blank" rel="noopener">${shown}</a>`
      : shown;
    const lbl = i === 0 && label ? " · " + label : "";
    html += `<div class="q"><div class="q-ref">${refHTML}${lbl}</div>` +
            `<div class="q-text">${v || "—"}</div></div>`;
  }
  return html;
}

const T_NAV = [
  ["index.html", "Domov", "Home"],
  ["bible.html", "Biblia", "Bible"],
  ["plan.html", "Plán", "Plan"],
  ["prophecies.html", "Proroctvá", "Prophecies"],
  ["map.html", "Mapa", "Map"],
  ["typology.html", "Predobrazy", "Types"],
  ["nations.html", "Národy", "Nations"],
  ["harmony.html", "Harmónia", "Harmony"],
  ["parables.html", "Podobenstvá", "Parables"],
  ["iam.html", "Ja som", "I AM"],
  ["genealogy.html", "Rodokmeň", "Genealogy"],
  ["timeline.html", "Dejiny", "History"],
  ["readings.html", "Čítania", "Readings"],
  ["prayers.html", "Modlitby", "Prayers"],
  ["reference.html", "Zoznamy", "Lists"],
  ["widget.html", "Widget", "Widget"],
  ["encyclical.html", "Encyklika", "Encyclical"]
];

function tNavHTML(activeFile, lang) {
  return T_NAV.map(([file, sk, en]) =>
    `<a href="${file}"${file === activeFile ? ' class="active"' : ""}>` +
    (lang === "sk" ? sk : en) + `</a>`).join(" ");
}

function tLangSwitcher(onChange) {
  document.getElementById("lang-en").addEventListener("click", () => {
    tSetLang("en"); onChange("en");
  });
  document.getElementById("lang-sk").addEventListener("click", () => {
    tSetLang("sk"); onChange("sk");
  });
}

function tMarkLang(lang) {
  document.documentElement.lang = lang;
  document.getElementById("lang-en").className = lang === "en" ? "active" : "";
  document.getElementById("lang-sk").className = lang === "sk" ? "active" : "";
}

// ---- progressive web app: register the service worker (offline + install) ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
