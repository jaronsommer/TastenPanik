/* ──────────────────────────────────────────────────────────────────
   LEVEL-KONFIGURATION
   Jedes Level ist ein Objekt mit diesen Eigenschaften:
   - label      : Anzeigename (mit Emoji)
   - color      : Akzentfarbe für den Level-Badge
   - time        : Startzeit in Sekunden
   - bonusTime   : Sekunden die bei einem Zeitbonus dazukommen
   - bonusEvery  : Zeitbonus alle X Wörter (999 = kein Bonus)
   - wordSet     : Welcher Wortpool verwendet wird (Key aus WORDS)
   - step        : Basis-Höhenmeter pro Wort (+ Zufall bis +25m)
   ────────────────────────────────────────────────────────────────── */
const LEVELS = {
  easy:    { label:'🌿 LEICHT',  color:'#7de87d', time:75, bonusTime:10, bonusEvery:4,   wordSet:'short',    step:150 },
  normal:  { label:'🏔️ NORMAL',  color:'#88b8ff', time:50, bonusTime:7,  bonusEvery:5,   wordSet:'mixed',    step:130 },
  hard:    { label:'⛏️ SCHWER',  color:'#ffa050', time:35, bonusTime:0,  bonusEvery:999, wordSet:'long',     step:110 },
  extreme: { label:'💀 EXTREM',  color:'#ff5555', time:40, bonusTime:6,  bonusEvery:3,   wordSet:'verylong', step:100 },
};

/* ──────────────────────────────────────────────────────────────────
   WORT-POOLS
   Vier Listen mit unterschiedlicher Wortlänge, je nach Level.
   - short    : 3–5 Buchstaben (Leicht)
   - mixed    : 4–8 Buchstaben (Normal)
   - long     : 9–12 Buchstaben (Schwer)
   - verylong : 13+ Buchstaben  (Extrem)
   ────────────────────────────────────────────────────────────────── */
const WORDS = {
  short: [
    /* Kurze deutsche und englische Bergbegriffe (3–5 Buchstaben) */
    "Berg","Eis","Fels","Grat","Nebel","Pfad","Stein","Wind","Zelt",
    "Alm","Bach","Helm","Hütte","Kalt","Mut","Seil","Tour","Weg",
    "Hoch","Tal","Frost","Hang","Sturm","Licht","Nacht","Horn","Pass","See",
    "Firn","Moor","Riff","Fluss","Alp","Dorf","Karte","Luft","Adler","Wolf",
    "Bär","Luchs","Gämse","Reh","Falke","Uhu","Peak","Rock","Snow",
    "High","Cold","Bold","Trail","Mist","Rain","Fog","Gale","Dusk","Dawn",
  ],
  mixed: [
    /* Mittellange alpine Begriffe (4–8 Buchstaben) */
    "Alpen","Gipfel","Schnee","Lawine","Plateau","Wandern","Klettern",
    "Rucksack","Panorama","Wolken","Schlucht","Ausdauer","Freiheit","Bergwelt",
    "Wanderer","Bergbach","Almwiese","Hochtour","Bergkamm","Felswand",
    "Seilbahn","Bergtour","Abgrund","Alpental","Felsgrat","Bergsee",
    "Mountain","Climbing","Glacier","Blizzard","Rockface","Overhang",
    "Basecamp","Altitude","Bivouac","Pinnacle","Crampon",
    "Belay","Sherpa","Traverse","Crevasse","Rappel","Summit","Ledge","Couloir",
    "Hirsch","Tiefe","Höhe","Ranger","Wache","Knoten","Bergauf","Talweg",
  ],
  long: [
    /* Lange Bergfachbegriffe (9–12 Buchstaben) */
    "Gipfelkreuz","Abenteuer","Bergsteiger","Steigeisen","Hochalpin","Kletterroute",
    "Gletschereis","Nebelmeer","Eispickel","Hochgebirge",
    "Steinschlag","Bergkette","Klettersteig","Klettergurt","Bergrettung",
    "Schneebrücke","Schneesturm","Felsmassiv","Bergsattel","Gipfelsturm",
    "Felsklettern","Bergpanorama","Expedition","Carabiner","Rappelling",
    "Acclimatize","Snowstorm","Rockclimbing","Iceclimbing","Alpinismus",
    "Gebirgsjäger","Bergführer","Naturpfad","Kletterer","Edelweiss",
    "Bergwiese","Kletterweg","Sicherung","Karabiner","Adventure",
    "Avalanche","Snowfield","Schneelinie","Steilwand",
  ],
  verylong: [
    /* Sehr lange zusammengesetzte Wörter (13+ Buchstaben) für Extrem */
    "Gletscherspalte","Wetterstation","Lawinengefahr","Höhenkrankheit","Berglandschaft",
    "Bergbekleidung","Kletterführer","Sicherungstechnik","Klettertechnik","Naturschutzgebiet",
    "Gletscherwanderung","Hochalpinismus","Extremkletterer","Hochgebirgsweg",
    "Sicherungsseil","Bergrettungstrupp","Kletterpartner","Hochgebirgsführer",
    "Gipfelerfahrung","Gletscherüberquerung","Felsklettersteig","Hochalpinroute",
    "Acclimatization","Mountaineering","Rockclimbingroute","Glaciertraverse",
    "Summitapproach","Crevassefield","Ridgeclimbing","Bergrettungseinsatz",
    "Steigeisenpflicht","Lawinenschutznetz","Steinbockkolonie",
    "Gletscherbach","Lawinenschutz","Gletscherwelt",
  ],
};

/* ──────────────────────────────────────────────────────────────────
   SPIELZUSTAND (globale Variablen)
   Diese Variablen speichern den aktuellen Zustand des Spiels.
   ────────────────────────────────────────────────────────────────── */
const SUMMIT = 3798;         // Gipfelhöhe in Metern (Jungfrau, Schweiz)
let altitude      = 0;       // Aktuelle Höhe des Kletterers in Metern
let timeLeft      = 60;      // Verbleibende Zeit in Sekunden
let gameActive    = false;   // Ist das Spiel gerade aktiv?
let timer         = null;    // Referenz auf den setInterval-Timer
let trailPoints   = [];      // Array von "x,y"-Strings für die Kletterer-Spur
let currentWord   = '';      // Das aktuell anzutippende Wort
let wordCount     = 0;       // Anzahl korrekt getippter Wörter in dieser Runde
let selectedLevel = 'easy';  // Key des gewählten Levels (easy/normal/hard/extreme)
let levelCfg      = LEVELS.easy; // Konfigurationsobjekt des aktiven Levels
let uiHeight      = 160;     // Höhe der Tipp-Zone in Pixeln (per JS gemessen)
let gameStartTs   = 0;       // Zeitstempel beim Spielstart (für WPM-Berechnung)
let gamePaused    = false;   // Ist das Spiel pausiert? (ESC)
let pauseStartTs  = 0;       // Zeitstempel beim Beginn der aktuellen Pause

/* ──────────────────────────────────────────────────────────────────
   PERSÖNLICHER BESTWERT — Helper
   Liest den Bestwert für ein Level aus localStorage und migriert
   einmalig den alten "bergsteiger_best_*"-Key auf den neuen Namen.
   ────────────────────────────────────────────────────────────────── */
function getPersonalBest(level) {
  const key    = 'tastenpanik_best_' + level;
  const oldKey = 'bergsteiger_best_'  + level;
  const oldVal = localStorage.getItem(oldKey);
  if (oldVal !== null && localStorage.getItem(key) === null) {
    localStorage.setItem(key, oldVal);
    localStorage.removeItem(oldKey);
  }
  return parseInt(localStorage.getItem(key) || '0');
}

/* ──────────────────────────────────────────────────────────────────
   BESTWERTE AUF DEM STARTBILDSCHIRM AKTUALISIEREN
   Schreibt für jede Level-Karte den persönlichen Rekord in das
   <div class="lc-best">-Element.
   ────────────────────────────────────────────────────────────────── */
function refreshPersonalBests() {
  document.querySelectorAll('.lc-best').forEach(el => {
    const lv = el.dataset.level;
    const best = getPersonalBest(lv);
    el.textContent = best > 0
      ? '★ ' + best.toLocaleString('de-CH') + ' m'
      : '';
  });
}

/* ──────────────────────────────────────────────────────────────────
   BERGPFAD-FUNKTION
   Berechnet die SVG-Position des Kletterers anhand des Fortschritts t.

   Parameter:
   - t : Fortschritt von 0.0 (Fuss) bis 1.0 (Gipfel)

   Rückgabe: { x, y } im SVG-Koordinatensystem (0-1000 Breite, 0-600 Höhe)

   Die y-Koordinate geht linear vom Fuss (560) zum Gipfel (50).
   Die x-Koordinate schwankt mit einer Sinuswelle → zickzack-artige Spur,
   die am Gipfel kleiner wird (weil der Weg enger wird).
   ────────────────────────────────────────────────────────────────── */
function mountainPath(t) {
  const baseX = 500, baseY = 560, peakY = 50;
  // Lineare Interpolation der y-Koordinate von Fuss zu Gipfel
  const y = baseY + (peakY - baseY) * t;
  // Sinuswelle für Zickzack-Bewegung, wird zum Gipfel hin kleiner
  const wave = Math.sin(t * Math.PI * 4) * (80 * (1 - t));
  return { x: baseX + wave, y };
}

/* ──────────────────────────────────────────────────────────────────
   UI-HÖHE MESSEN
   Misst die aktuelle Pixelhöhe der Tipp-Zone (#typing-zone)
   und speichert sie in uiHeight sowie als CSS-Variable --ui-height.
   Diese Variable wird im CSS verwendet, damit der Berg genau
   bis zur Oberkante der Tipp-Zone reicht.
   ────────────────────────────────────────────────────────────────── */
function measureUI() {
  const tz = document.getElementById('typing-zone');
  uiHeight = tz.offsetHeight;
  document.documentElement.style.setProperty('--ui-height', uiHeight + 'px');
}

/* ──────────────────────────────────────────────────────────────────
   LEVEL AUSWÄHLEN
   Wird aufgerufen wenn der Spieler eine Level-Karte anklickt.
   - Entfernt die "selected"-Klasse von allen Karten
   - Fügt sie der angeklickten Karte hinzu
   ────────────────────────────────────────────────────────────────── */
function selectLevel(lv) {
  selectedLevel = lv;
  // Alle Karten zurücksetzen
  document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
  // Gewählte Karte markieren
  document.querySelector('.lc-' + lv).classList.add('selected');
}

/* ──────────────────────────────────────────────────────────────────
   STARTBILDSCHIRM ANZEIGEN
   Blendet den Endbildschirm aus und den Startbildschirm ein.
   ────────────────────────────────────────────────────────────────── */
function showStart() {
  document.getElementById('end-screen').style.display = 'none';
  document.getElementById('start-screen').style.display = 'flex';
  refreshPersonalBests(); // Bestwerte aktualisieren beim Anzeigen
}

/* ──────────────────────────────────────────────────────────────────
   SPIEL STARTEN
   Setzt alle Spielvariablen zurück und startet eine neue Runde.
   ────────────────────────────────────────────────────────────────── */
function startGame() {
  // Level-Konfiguration laden
  levelCfg = LEVELS[selectedLevel];

  // Spielzustand zurücksetzen
  altitude    = 0;
  timeLeft    = levelCfg.time;
  gameActive  = true;
  trailPoints = [];
  wordCount   = 0;
  gameStartTs = Date.now(); // Für WPM-Berechnung am Spielende

  // Bildschirme & Pause-Overlay ausblenden
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('end-screen').style.display = 'none';
  document.getElementById('flag').style.display = 'none';
  document.getElementById('pause-overlay').classList.remove('active');
  gamePaused = false;

  // Level-Badge im HUD aktualisieren (Text und Farbe)
  const badge = document.getElementById('level-badge');
  badge.textContent    = levelCfg.label;
  badge.style.color       = levelCfg.color;
  badge.style.borderColor = levelCfg.color;

  // Trail (Spur) löschen
  document.getElementById('trail').setAttribute('points', '');

  // UI messen, HUD und Kletterer initial setzen
  measureUI();
  updateHUD();
  updateClimberPos();
  newWord(); // Erstes Wort laden

  // Eingabefeld fokussieren
  document.getElementById('input-field').focus();

  // Auf Mobile: nach kurzer Verzögerung neu messen
  // (die Tastatur verändert die Viewport-Höhe)
  setTimeout(() => {
    measureUI();
    updateClimberPos();
  }, 350);

  // Laufenden Timer stoppen falls vorhanden, neuen starten
  clearInterval(timer);
  timer = setInterval(tick, 1000); // Jede Sekunde tick() aufrufen
}

/* ──────────────────────────────────────────────────────────────────
   TIMER-TICK
   Wird jede Sekunde aufgerufen.
   Zieht 1 Sekunde ab, aktualisiert das HUD und prüft ob die Zeit um ist.
   ────────────────────────────────────────────────────────────────── */
function tick() {
  if (!gameActive) return; // Sicherheitscheck: nur wenn Spiel aktiv
  timeLeft--;
  updateHUD();
  if (timeLeft <= 0) endGame(false); // Zeit abgelaufen → Niederlage
}

/* ──────────────────────────────────────────────────────────────────
   NEUES WORT LADEN
   Wählt zufällig ein Wort aus dem aktiven Wortpool.
   Stellt sicher, dass das gleiche Wort nicht zweimal hintereinander kommt.
   ────────────────────────────────────────────────────────────────── */
function newWord() {
  const pool = WORDS[levelCfg.wordSet]; // Passenden Wortpool holen
  let w;
  do {
    w = pool[Math.floor(Math.random() * pool.length)]; // Zufälliges Wort
  } while (w === currentWord); // Wiederholen wenn gleich wie vorheriges
  currentWord = w;
  renderWord(''); // Wort anzeigen (ohne getippte Buchstaben)
}

/* ──────────────────────────────────────────────────────────────────
   WORT RENDERN
   Zeigt das aktuelle Wort Buchstabe für Buchstabe an.
   Buchstaben die bereits getippt wurden, werden farbig markiert.

   Parameter:
   - typed : Der bisherige Eingabetext des Spielers
   ────────────────────────────────────────────────────────────────── */
function renderWord(typed) {
  const disp = document.getElementById('word-display');
  disp.innerHTML = ''; // Vorherigen Inhalt löschen

  for (let i = 0; i < currentWord.length; i++) {
    const s = document.createElement('span');
    s.className = 'letter';
    s.textContent = currentWord[i];

    // Buchstabe einfärben je nach Tipp-Status
    if (i < typed.length) {
      // Gross/Kleinschreibung ignorieren beim Vergleich
      if (typed[i].toLowerCase() === currentWord[i].toLowerCase()) {
        s.classList.add('typed'); // Richtig → gold
      } else {
        s.classList.add('wrong'); // Falsch → rot + schütteln
      }
    }

    disp.appendChild(s);
  }
}

/* ──────────────────────────────────────────────────────────────────
   EINGABE ÜBERWACHEN
   Event-Listener auf dem Eingabefeld.
   Bei jeder Eingabe:
   1. Das Wort neu rendern (Buchstaben einfärben)
   2. Prüfen ob das Wort vollständig und korrekt getippt wurde
   ────────────────────────────────────────────────────────────────── */
document.getElementById('input-field').addEventListener('input', function() {
  if (!gameActive || gamePaused) {
    // Während Pause keine Eingaben werten; Feld leeren
    if (gamePaused) this.value = '';
    return;
  }
  const val = this.value;
  renderWord(val);

  // Wort komplett? (Gross/Kleinschreibung ignorieren)
  if (val.toLowerCase() === currentWord.toLowerCase()) {
    this.value = ''; // Eingabefeld leeren
    wordComplete();  // Wort-Abschluss-Logik ausführen
  }
});

/* ──────────────────────────────────────────────────────────────────
   ENTER-TASTE → SPIEL STARTEN (wenn nicht aktiv)
   ────────────────────────────────────────────────────────────────── */
document.getElementById('input-field').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !gameActive) startGame();
});

/* ──────────────────────────────────────────────────────────────────
   PAUSE EIN/AUS
   - Stoppt den Timer und blendet ein Overlay ein
   - Beim Fortsetzen wird gameStartTs um die Pausenzeit verschoben,
     damit der WPM-Wert nicht durch Pausen verfälscht wird.
   ────────────────────────────────────────────────────────────────── */
function togglePause() {
  if (!gameActive) return;
  gamePaused = !gamePaused;
  document.getElementById('pause-overlay').classList.toggle('active', gamePaused);

  if (gamePaused) {
    pauseStartTs = Date.now();
    clearInterval(timer);
  } else {
    // Pause-Dauer auf gameStartTs aufschlagen → WPM bleibt fair
    gameStartTs += (Date.now() - pauseStartTs);
    timer = setInterval(tick, 1000);
    document.getElementById('input-field').focus();
  }
}

/* ──────────────────────────────────────────────────────────────────
   GLOBALE TASTATUR-SHORTCUTS
   - Enter im Endbildschirm  → Nochmal gleiches Level starten
   - ESC während Spiel       → Pause ein/aus
   ────────────────────────────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  const endVisible = document.getElementById('end-screen').style.display !== 'none';
  if (e.key === 'Enter' && endVisible) {
    e.preventDefault();
    startGame();
    return;
  }
  if (e.key === 'Escape' && gameActive) {
    e.preventDefault();
    togglePause();
  }
});

/* ──────────────────────────────────────────────────────────────────
   WORT ABGESCHLOSSEN
   Wird aufgerufen wenn das Wort korrekt getippt wurde.
   - Höhe erhöhen (Basiswert + Zufallsbonus)
   - HUD und Klettererposition aktualisieren
   - Flash-Einblendung anzeigen
   - Evt. Zeitbonus vergeben
   - Prüfen ob Gipfel erreicht
   - Nächstes Wort laden
   ────────────────────────────────────────────────────────────────── */
function wordComplete() {
  wordCount++;

  // Höhengewinn: Basiswert + Zufallsbetrag (0–24m)
  const gain = levelCfg.step + Math.floor(Math.random() * 25);
  // Math.min stellt sicher, dass SUMMIT nie überschritten wird
  altitude = Math.min(SUMMIT, altitude + gain);

  updateHUD();
  updateClimberPos();
  showStepFlash('+' + gain + 'm'); // z.B. "+78m" einblenden

  // Zeitbonus prüfen: alle X Wörter (je nach Level)
  if (levelCfg.bonusTime > 0 && wordCount % levelCfg.bonusEvery === 0) {
    // Maximale Zeit: Startzeit + 20 Sekunden Puffer
    timeLeft = Math.min(timeLeft + levelCfg.bonusTime, levelCfg.time + 20);
    showBonusFlash('+' + levelCfg.bonusTime + 's ⏱');
  }

  // Gipfel erreicht?
  if (altitude >= SUMMIT) {
    endGame(true); // Sieg!
    return;
  }

  newWord(); // Nächstes Wort laden
}

/* ──────────────────────────────────────────────────────────────────
   SCHRITT-FLASH ANZEIGEN
   Zeigt kurz "+XXm" in der Bildschirmmitte an und lässt es nach oben fliegen.
   Trick: className="" dann offsetWidth lesen → erzwingt Reflow →
   damit die Animation auch beim gleichen Element neu startet.
   ────────────────────────────────────────────────────────────────── */
function showStepFlash(msg) {
  const el = document.getElementById('step-flash');
  el.textContent = msg;
  el.className = '';          // Animation zurücksetzen
  void el.offsetWidth;        // Reflow erzwingen (Browser-Trick)
  el.className = 'flash-anim'; // Animation neu starten
}

/* ──────────────────────────────────────────────────────────────────
   KONFETTI-EFFEKT
   Erzeugt 90 bunte fallende Partikel im game-container und
   entfernt sie nach Ablauf ihrer Animation automatisch.
   Wird nur beim Sieg (Gipfel erreicht) aufgerufen.
   ────────────────────────────────────────────────────────────────── */
function launchConfetti() {
  const colors = ['#ff6b35', '#ffd700', '#7de87d', '#88b8ff', '#ff5555', '#ffffff', '#ff88dd'];
  const container = document.getElementById('game-container');
  for (let i = 0; i < 90; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    const dur = 1.8 + Math.random() * 2.0;
    const delay = Math.random() * 0.6;
    c.style.cssText =
      'left:' + (Math.random() * 100) + '%;' +
      'width:'  + (5 + Math.random() * 6)  + 'px;' +
      'height:' + (10 + Math.random() * 8) + 'px;' +
      'background:' + colors[Math.floor(Math.random() * colors.length)] + ';' +
      'animation-duration:' + dur + 's;' +
      'animation-delay:'    + delay + 's;';
    container.appendChild(c);
    // Nach Animationsende aus dem DOM entfernen
    setTimeout(() => c.remove(), (dur + delay + 0.3) * 1000);
  }
}

/* ──────────────────────────────────────────────────────────────────
   ZEITBONUS-FLASH ANZEIGEN
   Erstellt ein temporäres grünes Element ("+7s ⏱") das nach oben fliegt,
   dann nach 1 Sekunde automatisch aus dem DOM entfernt wird.
   ────────────────────────────────────────────────────────────────── */
function showBonusFlash(msg) {
  const el = document.createElement('div');
  el.style.cssText = [
    "position:absolute",
    "top:40%",
    "left:50%",
    "transform:translate(-50%,-50%)",
    "font-family:'Bebas Neue',sans-serif",
    "font-size:clamp(1.1rem,3vw,1.5rem)",
    "color:#6fff6f",
    "text-shadow:0 0 15px #6fff6f",
    "pointer-events:none",
    "z-index:30",
    "animation:flashUp 1s ease-out forwards"
  ].join(';');
  el.textContent = msg;
  document.getElementById('game-container').appendChild(el);
  setTimeout(() => el.remove(), 1000); // Nach 1s aus DOM entfernen
}

/* ──────────────────────────────────────────────────────────────────
   HUD AKTUALISIEREN
   Aktualisiert alle sichtbaren Anzeigen:
   - Höhentext
   - Timer (+ Farbe/Animation bei wenig Zeit)
   - Fortschrittsbalken-Höhe
   - Himmelsfarbe je nach Aufstiegshöhe
   ────────────────────────────────────────────────────────────────── */
function updateHUD() {
  // Höhe in Schweizer Format (1'234 m)
  document.getElementById('alt-val').textContent = altitude.toLocaleString('de-CH');

  // Timer anzeigen
  document.getElementById('timer-display').textContent = timeLeft;

  // Alarm-Schwelle: 22% der Startzeit, maximal 12 Sekunden
  const danger = Math.min(12, Math.floor(levelCfg.time * 0.22));
  document.getElementById('timer-display').classList.toggle('danger', timeLeft <= danger);

  // Fortschrittsbalken: Höhe als Prozentsatz des Gipfels
  document.getElementById('progress-fill').style.height = ((altitude / SUMMIT) * 100) + '%';

  // Himmelsfarbe dynamisch berechnen:
  // t = 0 (Fuss) → dunkler Nachthimmel
  // t = 1 (Gipfel) → heller Taghimmel
  const t = altitude / SUMMIT;
  document.getElementById('sky').style.background =
          `linear-gradient(180deg,` +
          `hsl(${220 + t*20},${50 + t*20}%,${5 + t*15}%) 0%,` +
          `hsl(${210 + t*10},${40 + t*10}%,${15 + t*20}%) 40%,` +
          `hsl(200,${50 + t*10}%,${25 + t*20}%) 70%,` +
          `hsl(195,60%,${35 + t*15}%) 100%)`;
}

/* ──────────────────────────────────────────────────────────────────
   KLETTERER POSITIONIEREN
   Berechnet die Bildschirmposition des Kletterers aus der aktuellen Höhe
   und aktualisiert left/bottom sowie die Neigung (transform: rotate).

   Koordinatensystem:
   - SVG-Koordinaten: 0-1000 (Breite) × 0-600 (Höhe), y=0 oben, y=600 unten
   - Bildschirmkoordinaten: 0-W (Breite), bottom = 0 unten
   - Der Berg füllt den Bereich oberhalb der Tipp-Zone (Höhe: H - uiHeight)
   ────────────────────────────────────────────────────────────────── */
function updateClimberPos() {
  const t = altitude / SUMMIT; // Fortschritt 0..1
  const p = mountainPath(t);   // SVG-Position berechnen

  const container = document.getElementById('game-container');
  const W = container.clientWidth;   // Bildschirmbreite in Pixeln
  const H = container.clientHeight;  // Bildschirmhöhe in Pixeln
  const mAreaH = H - uiHeight;       // Höhe des Berg-Bereichs

  // SVG x (0-1000) → Bildschirm x (0-W)
  const screenX = (p.x / 1000) * W;

  // SVG y (0=oben, 600=unten) → Pixel von oben im Bergbereich
  const screenYFromTop = (p.y / 600) * mAreaH;

  // Pixel vom unteren Rand des Bergbereichs
  const screenYFromBottom = mAreaH - screenYFromTop;

  // Kletterer-Grösse aus CSS lesen (für Zentrierung)
  const clSize = parseInt(getComputedStyle(document.getElementById('climber')).width) || 36;
  const cl = document.getElementById('climber');

  // Position setzen (Kletterer wird zentriert auf den Pfadpunkt)
  cl.style.left   = (screenX - clSize / 2) + 'px';
  // bottom: Abstand von ganz unten = Tipp-Zone-Höhe + Bergbereich-Boden + halbe Grösse
  cl.style.bottom = (uiHeight + screenYFromBottom - clSize / 2) + 'px';

  // Spur-Punkt hinzufügen und Pfad neu setzen
  trailPoints.push(p.x + ',' + p.y);
  document.getElementById('trail').setAttribute('points', trailPoints.join(' '));

  // Kletterer leicht neigen je nach Bergkurve (wackelnde Bewegung)
  const tilt = Math.sin(t * Math.PI * 4) * 10; // -10° bis +10°
  cl.style.transform = 'rotate(' + (-15 + tilt) + 'deg)';
}

/* ──────────────────────────────────────────────────────────────────
   SPIEL BEENDEN
   Stoppt den Timer, zeigt den Endbildschirm an.

   Parameter:
   - success : true = Sieg (Gipfel erreicht), false = Niederlage (Zeit)
   ────────────────────────────────────────────────────────────────── */
function endGame(success) {
  gameActive = false;
  clearInterval(timer); // Timer stoppen

  // Eingabefeld und Wortanzeige leeren
  document.getElementById('input-field').value = '';
  document.getElementById('word-display').innerHTML = '';

  // Endbildschirm einblenden
  document.getElementById('end-screen').style.display = 'flex';

  // Effektive Spielzeit für WPM (in Sekunden, mind. 1)
  const elapsedSec = Math.max(1, Math.round((Date.now() - gameStartTs) / 1000));
  const wpm = Math.round((wordCount / elapsedSec) * 60);

  if (success) {
    // ── SIEG ────────────────────────────────────────────────────
    document.getElementById('end-icon').textContent  = '🏆';
    document.getElementById('end-title').textContent = 'GIPFEL!';
    document.getElementById('end-sub').textContent   = 'HERZLICHEN GLÜCKWUNSCH!';
    document.getElementById('end-msg').textContent   =
            'Du hast den Gipfel (' + SUMMIT.toLocaleString('de-CH') + ' m) auf Level „' +
            levelCfg.label + '" in ' + elapsedSec + 's erklommen! ' +
            wordCount + ' Wörter · ' + wpm + ' WPM.';

    // Gipfelfahne an der richtigen Position platzieren und einblenden
    const flag = document.getElementById('flag');
    const W    = document.getElementById('game-container').clientWidth;
    const H    = document.getElementById('game-container').clientHeight;
    const sp   = mountainPath(1); // SVG-Koordinaten des Gipfels
    const mAreaH = H - uiHeight;
    flag.style.left   = ((sp.x / 1000) * W - 10) + 'px';
    flag.style.bottom = (uiHeight + (mAreaH - (sp.y / 600) * mAreaH) + 10) + 'px';
    flag.style.display = 'block';

    // 🎉 Konfetti regnen lassen
    launchConfetti();

  } else {
    // ── NIEDERLAGE ──────────────────────────────────────────────
    const pct = Math.round((altitude / SUMMIT) * 100); // Prozent erklommen

    // Emoji je nach Fortschritt
    document.getElementById('end-icon').textContent =
            pct > 70 ? '😤' : pct > 40 ? '😮‍💨' : '❄️';

    document.getElementById('end-title').textContent = 'ZEIT ABGELAUFEN';
    document.getElementById('end-sub').textContent   = pct + '% ERKLOMMEN';
    document.getElementById('end-msg').textContent   =
            'Du hast ' + altitude.toLocaleString('de-CH') + ' m von ' +
            SUMMIT.toLocaleString('de-CH') + ' m erreicht. ' +
            wordCount + ' Wörter · ' + wpm + ' WPM. Versuch es nochmal!';
  }

  // Ergebnis-Höhe gross anzeigen
  document.getElementById('result-altitude').textContent = altitude.toLocaleString('de-CH') + ' m';

  // ── PERSÖNLICHER BESTESCORE ──────────────────────────────────────
  const bestKey  = 'tastenpanik_best_' + selectedLevel;
  const prevBest = getPersonalBest(selectedLevel); // migriert ggf. alten Key
  const box      = document.getElementById('personal-best-box');

  if (altitude > prevBest) {
    // Neuer Rekord!
    localStorage.setItem(bestKey, altitude);
    if (prevBest > 0) {
      box.innerHTML = '<span class="new-record">🎉 NEUER REKORD! +' +
              (altitude - prevBest).toLocaleString('de-CH') + ' m</span>';
    } else {
      box.innerHTML = '<span class="new-record">🎉 ERSTER REKORD!</span>';
    }
  } else if (prevBest > 0) {
    // Bestescore anzeigen
    box.innerHTML = 'DEIN REKORD: <span class="best-val">' +
            prevBest.toLocaleString('de-CH') + ' m</span>';
  } else {
    box.innerHTML = '';
  }
}

/* ──────────────────────────────────────────────────────────────────
   INITIALISIERUNG
   Wird einmalig beim Laden der Seite ausgeführt (IIFE = sofort ausgeführte Funktion).
   Erstellt alle per JS generierten Hintergrundelemente.
   ────────────────────────────────────────────────────────────────── */
(function init() {

  /* ── STERNE ──────────────────────────────────────────────────── */
  const starsContainer = document.getElementById('stars');
  for (let i = 0; i < 70; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const sz = Math.random() * 2.5 + 0.5; // Zufällige Grösse: 0.5–3px
    s.style.cssText =
            'width:'  + sz + 'px;' +
            'height:' + sz + 'px;' +
            'left:'   + Math.random() * 100 + '%;' +
            'top:'    + Math.random() * 60  + '%;' + // Nur obere 60% (Himmelbereich)
            'animation-delay:'    + Math.random() * 2 + 's;' +
            'animation-duration:' + (1.5 + Math.random() * 2) + 's;';
    starsContainer.appendChild(s);
  }

  /* ── WOLKEN ──────────────────────────────────────────────────── */
  const cloudsContainer = document.getElementById('clouds');
  for (let i = 0; i < 4; i++) {
    const cl = document.createElement('div');
    cl.className = 'cloud';
    const w = 80 + Math.random() * 160; // Zufällige Breite: 80–240px
    cl.style.cssText =
            'width:'  + w + 'px;' +
            'height:' + (w * 0.4) + 'px;' + // Höhe = 40% der Breite (ovale Form)
            'top:'    + (10 + Math.random() * 30) + '%;' + // Position im oberen Drittel
            'left:-200px;' + // Startet ausserhalb links
            'animation-duration:' + (30 + Math.random() * 40) + 's;' + // 30–70s pro Durchlauf
            'animation-delay:'    + Math.random() * 30 + 's;'; // Versetzt starten
    cloudsContainer.appendChild(cl);
  }

  /* ── SCHNEEFLOCKEN ───────────────────────────────────────────── */
  const snowContainer = document.getElementById('snow-container');
  for (let i = 0; i < 15; i++) {
    const s = document.createElement('div');
    s.className = 'snowflake';
    s.innerHTML = '❄';
    s.style.cssText =
            'left:'   + Math.random() * 100 + '%;' +
            'top:'    + Math.random() * 100 + '%;' + // Zufällige Startposition
            'font-size:' + (7 + Math.random() * 7) + 'px;' + // 7–14px
            'animation-duration:' + (8 + Math.random() * 12) + 's;' + // 8–20s
            'animation-delay:'    + Math.random() * 10 + 's;' +
            'opacity:' + (0.15 + Math.random() * 0.35) + ';'; // Halbtransparent
    snowContainer.appendChild(s);
  }

  /* ── ERSTE MESSUNG & BESTWERTE ───────────────────────────────── */
  measureUI(); // UI-Höhe initial messen
  refreshPersonalBests(); // Bestwerte für alle Level anzeigen

  /*
    Bei Fenstergrösse-Änderungen (resize) neu messen.
    Wichtig auf Mobile: Wenn die Tastatur erscheint/verschwindet,
    ändert sich die Viewport-Höhe → Berg und Kletterer müssen neu berechnet werden.
  */
  window.addEventListener('resize', () => {
    measureUI();
    if (gameActive) updateClimberPos(); // Kletterer neu positionieren
  });

})(); // Sofort ausführen

/*
  Klick irgendwo im Spiel → Eingabefeld wieder fokussieren.
  Verhindert, dass der Spieler versehentlich das Fokus verliert.
  Gilt nur wenn das Spiel aktiv ist und kein Overlay-Screen sichtbar ist.
*/
document.addEventListener('click', e => {
  if (gameActive && !e.target.closest('.screen')) {
    document.getElementById('input-field').focus();
  }
});
