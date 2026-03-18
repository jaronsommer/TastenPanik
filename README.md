# 🏔️ Bergsteiger

**Ein browserbasieres Tipp-Spiel — erklimme den Gipfel mit deiner Tastatur!**

> **Autor:** Jaron Sommer  
> **E-Mail:** jaron.sommer.ch@icloud.ch  
> **Schule:** OZW Wiedlisbach  
> **Projekt:** Schulprojekt Informatik

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
├── index.html                   # Das Spiel (eine einzige HTML-Datei)
├── .gitignore                   # Dateien die nicht auf GitHub kommen
├── README.md                    # Diese Datei
└── .github/
    └── workflows/
        └── deploy.yml           # GitHub Actions: automatisches Deployment
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

## ☁️ GitHub & Automatisches Deployment einrichten

Diese Anleitung erklärt Schritt für Schritt wie du das Projekt auf GitHub hochlädst und bei jedem Push automatisch auf deinen SSH-Server deployst.

### Voraussetzungen

- [Git](https://git-scm.com/) installiert
- [GitHub-Account](https://github.com) vorhanden
- Ein SSH-Server (Linux-VPS, Raspberry Pi, Schulserver, etc.)
- Terminal / Kommandozeile

---

### Schritt 1 — Repository auf GitHub erstellen

1. Gehe auf [github.com](https://github.com) und melde dich an
2. Klicke oben rechts auf **"+"** → **"New repository"**
3. Gib dem Repository einen Namen, z.B. `bergsteiger`
4. Wähle **Public** oder **Private**
5. Klicke **"Create repository"** (kein README, kein .gitignore beim Erstellen!)

---

### Schritt 2 — Lokales Git-Repository einrichten und pushen

Öffne ein Terminal im Projektordner und führe diese Befehle aus:

```bash
# Git im Ordner initialisieren
git init

# Alle Dateien zum Commit hinzufügen
git add .

# Ersten Commit erstellen
git commit -m "Erstes Commit: Bergsteiger Spiel"

# Hauptbranch "main" nennen
git branch -M main

# GitHub-Repository als Remote hinzufügen
# ACHTUNG: DEIN-USERNAME und bergsteiger durch deine Werte ersetzen!
git remote add origin https://github.com/DEIN-USERNAME/bergsteiger.git

# Code auf GitHub hochladen
git push -u origin main
```

Nach dem Push ist dein Code auf GitHub sichtbar.

---

### Schritt 3 — SSH-Key für das Deployment erstellen

Das Deployment funktioniert über SSH. Dafür brauchst du ein Schlüsselpaar:
- **Privater Key** → kommt in GitHub Secrets (bleibt geheim!)
- **Öffentlicher Key** → wird auf dem Server hinterlegt

```bash
# SSH-Schlüsselpaar generieren (kein Passwort setzen → Enter drücken wenn gefragt!)
# -t rsa   = RSA-Algorithmus (kompatibel mit GitHub Actions)
# -b 4096  = 4096-Bit Schlüssellänge (sicher)
# -f       = Dateiname des Schlüssels
ssh-keygen -t rsa -b 4096 -C "jaron.sommer.ch@icloud.ch" -f ~/.ssh/bergsteiger_deploy

# Ergebnis: zwei Dateien
#   ~/.ssh/bergsteiger_deploy       ← Privater Key (GEHEIM!)
#   ~/.ssh/bergsteiger_deploy.pub   ← Öffentlicher Key (kann geteilt werden)
```

---

### Schritt 4 — Öffentlichen Key auf dem Server hinterlegen

Verbinde dich mit deinem Server und füge den öffentlichen Key hinzu:

```bash
# Öffentlichen Key anzeigen und kopieren
cat ~/.ssh/bergsteiger_deploy.pub

# Auf dem Server: in authorized_keys eintragen
# (Entweder direkt auf dem Server ausführen, oder mit ssh-copy-id)
ssh benutzer@dein-server.ch "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys" < ~/.ssh/bergsteiger_deploy.pub

# Verbindung testen (sollte ohne Passwort funktionieren)
ssh -i ~/.ssh/bergsteiger_deploy benutzer@dein-server.ch
```

---

### Schritt 5 — GitHub Secrets einrichten

GitHub Secrets speichern sensible Daten (wie SSH-Keys) sicher.  
Sie sind **verschlüsselt** und werden nur während GitHub Actions sichtbar.

**Wo zu finden:**  
GitHub Repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Erstelle diese 5 Secrets:

| Secret-Name | Wert | Beispiel |
|---|---|---|
| `SSH_PRIVATE_KEY` | Inhalt des privaten Keys | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `SSH_HOST` | IP-Adresse oder Domain deines Servers | `123.456.789.0` oder `meinserver.ch` |
| `SSH_PORT` | SSH-Port (Standard: 22) | `22` |
| `SSH_USER` | Benutzername auf dem Server | `ubuntu` oder `admin` |
| `DEPLOY_PATH` | Pfad auf dem Server wo die Dateien hin sollen | `/var/www/html/bergsteiger` |

**Privaten Key kopieren:**
```bash
# macOS
cat ~/.ssh/bergsteiger_deploy | pbcopy

# Linux
cat ~/.ssh/bergsteiger_deploy | xclip -selection clipboard

# Windows (PowerShell)
Get-Content ~/.ssh/bergsteiger_deploy | Set-Clipboard

# Oder einfach: Datei öffnen und alles kopieren (inkl. BEGIN/END Zeilen!)
```

> ⚠️ **Wichtig:** Den kompletten Inhalt kopieren, von `-----BEGIN OPENSSH PRIVATE KEY-----` bis `-----END OPENSSH PRIVATE KEY-----` (inklusive dieser Zeilen!).

---

### Schritt 6 — Deployment testen

Nach dem Einrichten der Secrets: mache eine kleine Änderung und pushe:

```bash
# Kleine Änderung machen (z.B. Kommentar in index.html)
# Dann committen und pushen:
git add .
git commit -m "Deployment testen"
git push
```

**Deployment-Status prüfen:**  
GitHub Repository → **Actions** → Du siehst den laufenden oder abgeschlossenen Workflow

- ✅ Grüner Haken = Deployment erfolgreich
- ❌ Rotes X = Fehler (klicke drauf um Details zu sehen)

---

### Schritt 7 — Zukünftige Updates deployen

Ab jetzt ist der Workflow fertig eingerichtet. Jedes Mal wenn du pushst:

```bash
# Änderungen machen
# Dann:
git add .
git commit -m "Beschreibung der Änderung"
git push
# → GitHub Actions deployt automatisch auf den Server!
```

---

## 🔧 Häufige Probleme

| Problem | Lösung |
|---|---|
| `Permission denied (publickey)` | Überprüfe ob der öffentliche Key korrekt in `~/.ssh/authorized_keys` auf dem Server steht |
| `Host key verification failed` | Stelle sicher dass `SSH_HOST` korrekt ist. Oder füge `StrictHostKeyChecking=no` temporär ein |
| Dateien landen am falschen Ort | Überprüfe `DEPLOY_PATH` in den Secrets |
| Workflow wird nicht ausgelöst | Stelle sicher dass du auf den `main`-Branch pushst (in `deploy.yml` konfiguriert) |
| `rsync: command not found` | rsync ist auf `ubuntu-latest` vorinstalliert — sollte nicht vorkommen |

---

## 🛡️ Sicherheitshinweise

- Der SSH-Private-Key **niemals** direkt in den Code einchecken
- Der Key ist in GitHub Secrets verschlüsselt gespeichert
- Der Deployment-Key hat nur Zugriffsrechte auf den Deployment-Pfad
- Nach jedem Deployment wird der Key aus dem Container gelöscht (siehe `deploy.yml`)

---

## 🖥️ Technisches

- Reines **HTML / CSS / JavaScript** — keine Frameworks, keine Installation
- Eine einzige Datei: `index.html`
- Funktioniert in allen modernen Browsern
- Mobile-optimiert (iOS & Android)

---

*Viel Erfolg beim Erklimmen — und beim Deployen! 🧗‍♂️*
