# 🏔️ Bergsteiger

**Ein browserbasieres Tipp-Spiel — erklimme den Gipfel mit deiner Tastatur!**

> **Autor:** Jaron Sommer  
> **E-Mail:** jaron.sommer.ch@icloud.ch  
> **Schule:** OZW Wiedlisbach  
> **Projekt:** Schulprojekt Informatik

🎮 **Live spielen:** [jaron-sommer.github.io/bergsteiger](https://jaron-sommer.github.io/bergsteiger)
*(URL wird aktiv sobald GitHub Pages eingerichtet ist — deinen GitHub-Username oben eintragen)*

---

## 📖 Spielbeschreibung

Bergsteiger ist ein einfaches, animiertes Browserspiel. Du treibst einen Kletterer auf einen Berg — nicht mit Pfeiltasten, sondern mit deinen Fingern auf der Tastatur. Tippe die angezeigten Wörter so schnell wie möglich, um deinen Bergsteiger Schritt für Schritt den Berg hinaufzubewegen. Das Ziel: den Gipfel der Jungfrau auf **3'798 m** erreichen, bevor die Zeit abläuft!

---

## 🎮 Spielprinzip

1. Level auf dem Startbildschirm wählen
2. Ein zufälliges Wort erscheint auf dem Bildschirm
3. Wort vollständig und korrekt abtippen
4. Jedes Wort bringt den Kletterer höher
5. Gipfel erreichen bevor der Timer auf 0 fällt!

---

## ⛰️ Level-Übersicht

| Level | Icon | Zeit | Wortlänge | Zeitbonus | Schwierigkeit |
|---|---|---|---|---|---|
| **Leicht** | 🌿 | 75 Sekunden | 3–5 Buchstaben | +10s alle 4 Wörter | Einsteiger |
| **Normal** | 🏔️ | 50 Sekunden | 4–8 Buchstaben | +7s alle 5 Wörter | Mittel |
| **Schwer** | ⛏️ | 35 Sekunden | 7–12 Buchstaben | Kein Bonus | Fortgeschritten |
| **Extrem** | 💀 | 40 Sekunden | 9+ Buchstaben | +6s alle 3 Wörter | Profi |

---

## 🗂️ Projektstruktur

```
bergsteiger/
├── index.html       # Das Spiel (eine einzige HTML-Datei)
├── .gitignore       # Dateien die nicht auf GitHub kommen
└── README.md        # Diese Datei
```

---

## 🚀 Lokales Starten

Keine Installation nötig. Einfach die Datei im Browser öffnen:

```bash
# Doppelklick auf index.html  — oder im Terminal:
open index.html         # macOS
start index.html        # Windows
xdg-open index.html     # Linux
```

---

## ☁️ GitHub & GitHub Pages einrichten

GitHub Pages hostet das Spiel **kostenlos** direkt aus dem Repository —
kein eigener Server, keine Konfiguration, keine Kosten.

### Voraussetzungen

- [Git](https://git-scm.com/) installiert
- [GitHub-Account](https://github.com) vorhanden
- Terminal / Kommandozeile

---

### Schritt 1 — Repository auf GitHub erstellen

1. Gehe auf [github.com](https://github.com) und melde dich an
2. Klicke oben rechts auf **"+"** → **"New repository"**
3. Name: `bergsteiger`
4. Sichtbarkeit: **Public** *(GitHub Pages ist bei Public-Repos gratis)*
5. Klicke **"Create repository"** — kein README oder .gitignore beim Erstellen hinzufügen!

---

### Schritt 2 — Code hochladen

Öffne ein Terminal im Projektordner und führe diese Befehle aus:

```bash
# Git im Ordner initialisieren
git init

# Alle Dateien zum Commit hinzufügen
git add .

# Ersten Commit erstellen
git commit -m "Bergsteiger Schulprojekt OZW Wiedlisbach"

# Hauptbranch "main" nennen
git branch -M main

# GitHub-Repository verknüpfen (USERNAME ersetzen!)
git remote add origin https://github.com/USERNAME/bergsteiger.git

# Code auf GitHub hochladen
git push -u origin main
```

---

### Schritt 3 — GitHub Pages aktivieren

1. Im Repository auf **Settings** klicken
2. Links in der Sidebar: **Pages** wählen
3. Unter *Source*: **Deploy from a branch**
4. Branch: **main** / Ordner: **/ (root)**
5. **Save** klicken

Nach 1–2 Minuten ist das Spiel live unter:

```
https://USERNAME.github.io/bergsteiger
```

✅ Das war's! Ab jetzt wird bei jedem `git push` die Website automatisch aktualisiert.

---

### Schritt 4 — Updates deployen

```bash
# Änderungen machen, dann:
git add .
git commit -m "Beschreibung der Änderung"
git push
# → GitHub Pages aktualisiert die Website automatisch!
```

Den aktuellen Status siehst du unter:  
Repository → **Actions** → grüner Haken = live ✅

---

## 🔧 Häufige Probleme

| Problem | Lösung |
|---|---|
| Seite zeigt 404 | Warte 1–2 Minuten nach dem ersten Aktivieren von Pages |
| Änderungen nicht sichtbar | Browser-Cache leeren (Ctrl+Shift+R) oder kurz warten |
| Pages-Option nicht sichtbar | Repository muss **Public** sein |
| Push schlägt fehl | GitHub-Zugangsdaten prüfen, evtl. Personal Access Token erstellen |

---

## 🖥️ Technisches

- Reines **HTML / CSS / JavaScript** — keine Frameworks, keine Installation
- Eine einzige Datei: `index.html`
- Funktioniert in allen modernen Browsern (Chrome, Firefox, Safari, Edge)
- Mobile-optimiert (iOS & Android)

---

## 🔗 Alternativer Deployment-Weg (SSH-Server)

Falls du statt GitHub Pages einen eigenen Server nutzen möchtest,
enthält dieses Repo optional eine GitHub Actions Workflow-Datei
`.github/workflows/deploy.yml` für automatisches rsync-Deployment via SSH.
Anleitung dazu: siehe ältere Version dieses READMEs oder frag deinen Lehrer.

---

*Viel Erfolg beim Erklimmen — und beim Deployen! 🧗‍♂️*