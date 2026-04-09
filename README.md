# InfoAbi 2026 — Informatik-Lernapp Niedersachsen eA

Systematische Klausurvorbereitung für das **Informatik-Abitur Niedersachsen 2026 (erhöhtes Anforderungsniveau)**.

## Starten

```bash
npm install
npm run dev
```

Browser öffnen: **http://localhost:5173**

## Projektstruktur

```
src/
  app/          Router-Konfiguration
  components/
    layout/     Sidebar, Layout-Wrapper
    ui/         Badge, Button, Card, CodeBlock, TabBar
  data/         Fachliche Inhalte (Themen, Übungen, Klausurdaten)
  features/
    dashboard/  Startseite mit Countdown + Fortschritt
    analysis/   Prüfungsanalyse 2021–2025 + Prognose 2026
    topics/     Themenübersicht mit Theorie, Fehlern, Klausurmustern
    exercises/  Übungssystem mit lokaler Bewertungslogik
    visualizers/ BST, Huffman, Hamming, DEA, Stack/Queue
    sql/        SQL-Referenz, ER-Diagramme, Anomalien
    exam/       Klausurmodus (offizielle 2026-Struktur, 300 min)
    mistakes/   Fehlerlogbuch (automatisch befüllt)
  hooks/        useTimer
  lib/
    evaluator/  Lokale Bewertungslogik + AI-Adapter-Interface
  store/        Zustand (Lernfortschritt, Fehlerlog) → localStorage
  types/        Alle TypeScript-Typen
  utils/        Countdown, Formatierung
```

## Fachliche Quellen

| Inhalt | Quelle |
|--------|--------|
| Offizielle Operationen (BinTree, Stack, Queue, DynArray, String) | Ergänzende Hinweise KC Informatik, Stand Juni 2021 |
| SQL-Syntax, Hamming-Notation, Automaten-Notation | Ergänzende Hinweise 2021 + Anlage zu 18_InformatikHinweise2026 |
| Prüfungsstruktur 2026 | 18_InformatikHinweise2026.pdf |
| Klausurmuster & Häufigkeitsanalyse | eA-Klausuren Informatik Niedersachsen 2021–2025 |
| Themen-Inhalte | KC Informatik 2017 |

## Wichtige Hinweise

- **Prognosen** (2026-Wahrscheinlichkeiten) sind didaktische Ableitungen aus 2021–2025 — **keine offiziellen Vorgaben des Kultusministeriums**
- Die App funktioniert **vollständig offline** ohne externe API-Calls
- KI-Bewertung: Es gibt eine abstrakte Adapter-Schnittstelle, aber **keine direkten API-Calls** aus dem Frontend
- Alle Bewertungen sind lokal und regelbasiert

## Korrigierte Fehler vs. HTML-Prototyp

1. **Kritisch behoben**: Direkter `fetch('https://api.anthropic.com/v1/messages'...)` im Frontend entfernt → saubere Adapter-Architektur
2. **Grammatik-Übung e9**: Falsches Modell (B→bB|b erzeugt `aⁿb`, nicht `aⁿbᵐ`) korrigiert zu L(G) = {aⁿbᵐ | n≥1, m≥1}
3. **Architektur**: Monolithische 1150-Zeilen-HTML-Datei in saubere React+TS-Komponentenstruktur migriert
4. **Persistenz**: Lernfortschritt, Fehlerlog, letzte Themen nun in localStorage
5. **Vollständige Visualisierer**: BST, Huffman, Hamming (mit Fehlerkorrektur), DEA, Stack/Queue

## Offene Punkte / Erweiterungsmöglichkeiten

- [ ] Mehr Übungsaufgaben (besonders für 2D-Reihung, Rekursion)
- [ ] Kellerautomat-Visualisierer
- [ ] Grammatik-Ableitungs-Simulator
- [ ] Huffman-Schritt-für-Schritt-Modus mit Prioritätswarteschlange
- [ ] Wiederholungsplaner (Spaced Repetition)
- [ ] Lernpfad-Feature
- [ ] Backend-Implementierung für die AI-Evaluator-Schnittstelle (opt.)

## Tech-Stack

- **Vite 8** + **React 18** + **TypeScript**
- **Tailwind CSS v4** (@tailwindcss/vite)
- **React Router v7**
- **Zustand** (State + localStorage-Persistenz)
- **Recharts** (Balkendiagramme in Prüfungsanalyse)
- **Lucide React** (Icons)
