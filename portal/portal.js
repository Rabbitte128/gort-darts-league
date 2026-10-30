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

/* ---------- 180s & checkouts ---------- */

// Checkout scores that cannot be finished in three darts.
const IMPOSSIBLE_CHECKOUTS = [159, 162, 163, 165, 166, 168, 169];

function playerOptions(f, selected = "") {
  const group = team => {
    const players = (typeof TEAM_DATA !== "undefined" && TEAM_DATA[team]?.players) || [];
    return `<optgroup label="${esc(team)}">${players.map(p => {
      const value = `${team}|${p}`;
      return `<option value="${esc(value)}" ${value === selected ? "selected" : ""}>${esc(p)}</option>`;
    }).join("")}</optgroup>`;
  };
  return `<option value="">Select player…</option>${group(f.home)}${group(f.away)}`;
}

function extraRow(type, f, entry = {}) {
  const selected = entry.player ? `${entry.team}|${entry.player}` : "";
  const isTon = type === "180";
  const value = isTon ? (entry.total ?? 1) : (entry.score ?? "");
  return `<div class="portal-extra-row" data-type="${type}">
    <select class="extra-player" aria-label="Player">${playerOptions(f, selected)}</select>
    <input type="number" class="extra-value" min="${isTon ? 1 : 2}" max="${isTon ? 20 : 170}" value="${value}"
      placeholder="${isTon ? "How many" : "Checkout"}" aria-label="${isTon ? "Number of 180s" : "Checkout score"}">
    <button class="link-button extra-remove" type="button" aria-label="Remove">✕</button>
  </div>`;
}

function extrasBlock(f, r) {
  const tons = r?.oneEighties || [];
  const outs = r?.checkouts || [];
  const count = tons.length + outs.length;
  return `<details class="portal-extras" ${count ? "open" : ""}>
    <summary>180s &amp; high checkouts ${count ? `(${count})` : ""}</summary>
    <div class="portal-extra-list" data-list="180">
      <strong>🎯 180s</strong>
      ${tons.map(t => extraRow("180", f, t)).join("")}
    </div>
    <button class="link-button extra-add" type="button" data-type="180">+ Add 180</button>
    <div class="portal-extra-list" data-list="checkout">
      <strong>🔥 High checkouts</strong>
      ${outs.map(c => extraRow("checkout", f, c)).join("")}
    </div>
    <button class="link-button extra-add" type="button" data-type="checkout">+ Add checkout</button>
  </details>`;
}

// Reads the 180/checkout rows for one match. Returns { oneEighties, checkouts } or { error }.
function readExtras(row, label) {
  const oneEighties = [], checkouts = [];
  for (const el of row.querySelectorAll(".portal-extra-row")) {
    const pick = el.querySelector(".extra-player").value;
    const text = el.querySelector(".extra-value").value.trim();
    if (!pick && text === "") continue;
    if (!pick) return { error: `${label}'s match: choose a player for each 180/checkout.` };
    const [team, player] = pick.split("|");
    const n = Number(text);

    if (el.dataset.type === "180") {
      if (!Number.isInteger(n) || n < 1) return { error: `${label}'s match: enter how many 180s ${player} hit.` };
      const same = oneEighties.find(t => t.player === player && t.team === team);
      if (same) same.total += n; else oneEighties.push({ player, team, total: n });
    } else {
      if (!Number.isInteger(n) || n < 2 || n > 170 || IMPOSSIBLE_CHECKOUTS.includes(n)) {
        return { error: `${label}'s match: ${text || "blank"} is not a valid checkout for ${player}.` };
      }
      checkouts.push({ player, team, score: n });
    }
  }
  return { oneEighties, checkouts };
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
        ${extrasBlock(f, r)}
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
  root.querySelectorAll(".portal-match").forEach(row => {
    const league = LEAGUE_DATA[row.dataset.league];
    const f = league.fixtures.find(m => m.id === Number(row.dataset.fixture));
    row.addEventListener("click", e => {
      const add = e.target.closest(".extra-add");
      if (add) {
        row.querySelector(`.portal-extra-list[data-list="${add.dataset.type}"]`)
          .insertAdjacentHTML("beforeend", extraRow(add.dataset.type, f));
      }
      const remove = e.target.closest(".extra-remove");
      if (remove) remove.closest(".portal-extra-row").remove();
    });
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

    const extras = readExtras(row, label);
    if (extras.error) return message(extras.error, "error");
    const hasExtras = extras.oneEighties.length || extras.checkouts.length;

    if (hsText === "" && asText === "") {
      if (hasExtras) return message(`Enter the score for ${label}'s match before adding 180s or checkouts.`, "error");
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
    const old = existing[id];
    if (old?.hs === hs && old?.as === as &&
        JSON.stringify(old.oneEighties || []) === JSON.stringify(extras.oneEighties) &&
        JSON.stringify(old.checkouts || []) === JSON.stringify(extras.checkouts)) continue;

    batch.set(doc(db, "results", id), {
      league: row.dataset.league,
      fixtureId: Number(row.dataset.fixture),
      hs, as,
      oneEighties: extras.oneEighties,
      checkouts: extras.checkouts,
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
    message(err?.code === "permission-denied"
      ? "Could not save results: permission denied. Please contact Michael Rabbitte."
      : `Could not save results: ${err?.message || err}`, "error");
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
