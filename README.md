# InfoAbi 2026 — Informatik-Lernapp (Neuaufbau Anfänger-first)

Lernplattform für das **Informatik-Abitur Niedersachsen 2026 (eA, erhöhtes Anforderungsniveau)** mit Fokus auf **Von Grund auf lernen** (15 Etappen), geführte Übungen und erst danach Prüfungsmodus.

Git-Tag **`legacy-v1`** markiert den Stand vor diesem Neuaufbau (revisionsorientierte App).

## Starten

```bash
npm install
npm run dev
```

**http://localhost:5173**

```bash
npm run build    # Produktion
npm test         # Vitest (Kernlogik)
```

## Navigation (Priorität)

| Route | Inhalt |
|-------|--------|
| `/` | Dashboard, Tagesmodus, Lernpfad-Fortschritt |
| `/onboarding` | Startdiagnose (Tempo, Einstieg) |
| `/lernpfad` | 15 Etappen mit Freischaltung |
| `/lernen/:stageId/:unitId` | Lektionsspieler (3 Ebenen, Checkliste, Concept Checks) |
| `/themen` | Themenübersicht (Legacy-KC-Ansicht) |
| `/ueben` | Geführte Übungen (Modi: frei, geführt, Schritt-Tipps, Musterweg) |
| `/uebungspool` | **Alle** Legacy-Aufgaben + Wiederholung (`?review=1`) |
| `/visualizer` | Visualisierungen mit **VisualizerFrame** (Demo / Lernen / Schritt) |
| `/sql` | SQL-Referenz |
| `/glossar` | Begriffe (einfache Sprache) |
| `/fehlerlog` | Fehlerlogbuch |
| `/analyse` | Prüfungsanalyse 2021–2025 (sekundär) |
| `/klausur` | Klausurmodus (Freigabe nach 7 Etappen oder Überspringen) |

## Projektstruktur

```
src/
  app/           Router (dünn)
  pages/         Seiten-Shells (Dashboard, Lernpfad, Lektion, …)
  content/       Didaktische Rohdaten: path/stages, path/units, glossary
  features/
    lesson/      LessonPlayer, Hilfe
    practice/    PracticeSession (Modi)
    diagnostics/ OnboardingFlow
    help/        HelpToolbar
    visualizer/  VisualizerFrame
    …            analysis, exam, exercises, topics, visualizers, sql, mistakes (Legacy-UI)
  data/          officialConstraints, examYears, topics, exercises (Legacy)
  lib/
    path/        unlock.ts, dailyPlan.ts (+ Tests)
    errors/      Fehlertaxonomie (Misconceptions)
    evaluator/   Lokale Bewertung (+ misconceptionIds im Feedback)
  store/
    learningStore.ts   Lernpfad, Diagnose, Tagesplan, Klausur-Gate (localStorage: infoabi-learning-v2)
    progressStore.ts   Legacy-Übungen, Spaced Repetition, Klausursimulationen
  types/
    index.ts     Legacy-Typen + EvaluationResult
    learning.ts  Stages, Units, Lektion, PathExercise, Glossar
```

## Inhalts-Kennzeichnung

In Lektionen und Metadaten:

- **official** — KC 2017, Ergänzende Hinweise 2021, Informatikhinweise 2026  
- **examPattern2021_2025** — aus eA-Klausuren Niedersachsen 2021–2025 abgeleitet  
- **didactic** — methodische Vereinfachung, Reihenfolge, Beispiele  

## Fachliche Quellen

| Inhalt | Quelle |
|--------|--------|
| Operationen BinTree, Stack, Queue, DynArray, String | Ergänzende Hinweise 2021 |
| SQL, Hamming, Automaten-Notation | Ergänzende Hinweise 2021 + Anlage Hinweise 2026 |
| Prüfungsstruktur 2026 | 18_InformatikHinweise2026.pdf |
| Häufigkeitsanalyse | eA-Klausuren 2021–2025 |
| Kernthemen | KC Informatik 2017 |

## Technik

- Vite 8, React 19, TypeScript, Tailwind v4, React Router 7, Zustand, Recharts, Lucide  
- Keine LLM-API im Frontend; optionaler AI-Adapter nur als Schnittstelle  

## Offene Punkte / nächste Schritte

- Etappen **s02–s15**: Platzhalter-Lektionen durch volle Inhalte ersetzen (aus `topics.ts` / PDFs migrieren).  
- Weitere Glossar-Einträge und Verknüpfung zu Units.  
- `PracticeSession`: vollständige Anbindung aller Legacy-Aufgabentypen (Text/SQL) wie im Aufgabenpool.  
- Visualisierungen: Schritt-Modus tiefer mit Zustand der jeweiligen Komponente koppeln.  
- Optional: Backend für AI-Evaluator.

## Hinweise

- **Prognosen** in der Analyse sind keine offiziellen Vorgaben.  
- Wiederholungen (`nextReviewAt`) beziehen sich auf den **Aufgabenpool** (`progressStore`).
