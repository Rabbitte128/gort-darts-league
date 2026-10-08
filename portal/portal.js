import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, doc, getDoc, getDocs, collection, writeBatch, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const root = document.querySelector("#portal");
const LEAGUE_KEYS = ["a", "b"];

/* ---------- helpers ---------- */

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function parseDate(text) {
  const d = new Date(text);
  return isNaN(d) ? null : d;
}

function isRealMatch(league, f) {
  return league.teams.includes(f.home) && league.teams.includes(f.away);
}

function message(text, type = "info") {
  const box = root.querySelector("#portal-message");
  if (box) box.innerHTML = `<div class="portal-alert ${type}">${esc(text)}</div>`;
}

// All match nights (dates) across both leagues, oldest first.
function matchDates() {
  const map = new Map();
  LEAGUE_KEYS.forEach(key => {
    const league = LEAGUE_DATA[key];
    league.fixtures.filter(f => isRealMatch(league, f)).forEach(f => {
      const d = parseDate(f.date);
      if (d) map.set(d.getTime(), f.date);
    });
  });
  return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([time, label]) => ({ time, label }));
}

// Default to the most recent Friday that has already been played.
function defaultDateIndex(dates) {
  const now = Date.now();
  let index = 0;
  dates.forEach((d, i) => { if (d.time <= now) index = i; });
  return index;
}

/* ---------- Firebase ---------- */

if (!FIREBASE_CONFIG.projectId) {
  root.innerHTML = `<div class="portal-card">
    <h2>Portal not configured</h2>
    <p class="portal-muted">Add your Firebase project details to <code>data/firebase-config.js</code>.</p>
  </div>`;
  throw new Error("Firebase not configured");
}

const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let profile = null;
let dates = [];
let dateIndex = 0;

/* ---------- login ---------- */

function renderLogin() {
  root.innerHTML = `
    <form class="portal-card portal-login" id="login-form">
      <h2>Admin sign in</h2>
      <label>Email<input type="email" id="login-email" required autocomplete="username"></label>
      <label>Password<input type="password" id="login-password" required autocomplete="current-password"></label>
      <button class="button primary" type="submit">Sign in</button>
      <button class="link-button" type="button" id="forgot">Forgot password?</button>
      <div id="portal-message"></div>
    </form>`;

  root.querySelector("#login-form").addEventListener("submit", async e => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth,
        root.querySelector("#login-email").value.trim(),
        root.querySelector("#login-password").value);
    } catch {
      message("Incorrect email or password.", "error");
    }
  });

  root.querySelector("#forgot").addEventListener("click", async () => {
    const email = root.querySelector("#login-email").value.trim();
    if (!email) return message("Enter your email above first.", "error");
    try {
      await sendPasswordResetEmail(auth, email);
      message("Password reset email sent.", "success");
    } catch {
      message("Could not send reset email.", "error");
    }
  });
}

/* ---------- admin score entry ---------- */

async function loadResults() {
  const snap = await getDocs(collection(db, "results"));
  const results = {};
  snap.forEach(d => { results[d.id] = d.data(); });
  return results;
}

async function renderAdmin() {
  root.innerHTML = `<p class="portal-muted">Loading…</p>`;
  const results = await loadResults();
  const night = dates[dateIndex];

  const sections = LEAGUE_KEYS.map(key => {
    const league = LEAGUE_DATA[key];
    const fixtures = league.fixtures.filter(f =>
      isRealMatch(league, f) && parseDate(f.date)?.getTime() === night.time);
    if (!fixtures.length) return "";

    const rows = fixtures.map(f => {
      const id = `${key}_${f.id}`;
      const r = results[id];
      return `<div class="portal-match" data-id="${id}" data-league="${key}" data-fixture="${f.id}">
        <span class="portal-team home">${esc(f.home)}</span>
        <input type="number" class="hs" min="0" max="${league.pointsPerMatch}" value="${r?.hs ?? ""}" aria-label="${esc(f.home)} score">
        <span>-</span>
        <input type="number" class="as" min="0" max="${league.pointsPerMatch}" value="${r?.as ?? ""}" aria-label="${esc(f.away)} score">
        <span class="portal-team">${esc(f.away)}</span>
        ${r ? `<span class="badge done">Saved</span>` : `<span class="badge">Not entered</span>`}
      </div>`;
    }).join("");

    return `<div class="portal-card">
      <h2>${esc(league.label)} <span class="portal-muted">(scores total ${league.pointsPerMatch})</span></h2>
      ${rows}
    </div>`;
  }).join("");

  root.innerHTML = `
    <div class="portal-userbar">
      <span>Signed in as <strong>${esc(profile.name || currentUser.email)}</strong></span>
      <button class="button" type="button" id="logout">Sign out</button>
    </div>
    <div class="portal-card">
      <div class="portal-week-nav">
        <button class="button" type="button" id="prev-night" ${dateIndex === 0 ? "disabled" : ""}>&#10094;</button>
        <select id="night-select">
          ${dates.map((d, i) => `<option value="${i}" ${i === dateIndex ? "selected" : ""}>${esc(d.label)}</option>`).join("")}
        </select>
        <button class="button" type="button" id="next-night" ${dateIndex === dates.length - 1 ? "disabled" : ""}>&#10095;</button>
      </div>
      <p class="portal-muted">Enter the scores for this Friday and press Save. Leave both boxes empty to clear a result.</p>
    </div>
    <form id="scores-form" class="portal">
      ${sections || `<div class="portal-card"><p>No matches on this date.</p></div>`}
      <div id="portal-message"></div>
      ${sections ? `<button class="button primary" type="submit">Save all results</button>` : ""}
    </form>`;

  root.querySelector("#logout").addEventListener("click", () => signOut(auth));
  root.querySelector("#prev-night").addEventListener("click", () => { dateIndex--; renderAdmin(); });
  root.querySelector("#next-night").addEventListener("click", () => { dateIndex++; renderAdmin(); });
  root.querySelector("#night-select").addEventListener("change", e => {
    dateIndex = Number(e.target.value);
    renderAdmin();
  });
  root.querySelector("#scores-form").addEventListener("submit", e => {
    e.preventDefault();
    saveScores(results);
  });
}

async function saveScores(existing) {
  const batch = writeBatch(db);
  let saved = 0, cleared = 0;

  for (const row of root.querySelectorAll(".portal-match")) {
    const id = row.dataset.id;
    const league = LEAGUE_DATA[row.dataset.league];
    const hsText = row.querySelector(".hs").value.trim();
    const asText = row.querySelector(".as").value.trim();
    const label = row.querySelector(".home").textContent;

    if (hsText === "" && asText === "") {
      if (existing[id]) { batch.delete(doc(db, "results", id)); cleared++; }
      continue;
    }

    const hs = Number(hsText), as = Number(asText);
    if (hsText === "" || asText === "" || !Number.isInteger(hs) || !Number.isInteger(as) || hs < 0 || as < 0) {
      return message(`Enter both scores for ${label}'s match.`, "error");
    }
    if (hs + as !== league.pointsPerMatch) {
      return message(`${label}'s match: scores must add up to ${league.pointsPerMatch}.`, "error");
    }
    if (existing[id]?.hs === hs && existing[id]?.as === as) continue;

    batch.set(doc(db, "results", id), {
      league: row.dataset.league,
      fixtureId: Number(row.dataset.fixture),
      hs, as,
      updatedBy: currentUser.uid,
      updatedAt: serverTimestamp()
    });
    saved++;
  }

  if (!saved && !cleared) return message("No changes to save.", "info");

  try {
    await batch.commit();
    await renderAdmin();
    message(`Saved ${saved} result(s)${cleared ? `, cleared ${cleared}` : ""}. The website is now updated.`, "success");
  } catch (err) {
    console.error(err);
    message("Could not save results. Check you are an admin.", "error");
  }
}

/* ---------- session ---------- */

onAuthStateChanged(auth, async user => {
  currentUser = user;
  profile = null;
  if (!user) return renderLogin();

  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    profile = snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error(err);
  }

  if (profile?.role !== "admin") {
    root.innerHTML = `<div class="portal-card"><p>This account is not an admin. Please contact the league.</p>
      <button class="button" type="button" id="logout">Sign out</button></div>`;
    root.querySelector("#logout").addEventListener("click", () => signOut(auth));
    return;
  }

  dates = matchDates();
  dateIndex = defaultDateIndex(dates);
  await renderAdmin();
});
