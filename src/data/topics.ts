import type { Topic, Priority } from '../types';

/**
 * TOPIC DATA
 * Theory: based on KC 2017 + Ergänzende Hinweise 2021
 * Exam patterns: derived from eA-Klausuren 2021–2025 (marked as such)
 * Corrections vs. prototype:
 *   - Grammar exercise model answer bug fixed (B→bB|b produces aⁿbᵐ, n≥1, m≥1)
 *   - All official operations verified against Anlage to 18_InformatikHinweise2026
 */

export const TOPICS: Topic[] = [
  {
    id: 'oop',
    icon: '🏗',
    title: 'OOP & Klassendiagramme',
    category: 'Algorithmen & Datenstrukturen',
    block: 'B1',
    priority: 'HOCH',
    officialNote: 'KC 2017, Abschnitt 3.1; Ergänzende Hinweise 2021, Abschnitt 6',
    theory: `KLASSE & OBJEKT:
Eine Klasse ist eine Schablone (Bauplan) für Objekte. Objekte sind konkrete Instanzen einer Klasse.

KLASSENDIAGRAMM-NOTATION (offiziell, Ergänzende Hinweise 2021, §6):
  - privatAttribut: Typ          (- = private)
  + öffentlicheOp(): RTyp        (+ = public)
  c Konstruktor()                (c = Konstruktor)
  ...                            (nicht aufgeführte Attrs./Ops.)

Vererbung:     leerer Dreieckspfeil → Oberklasse
Assoziation:   einfache Linie (KEINE Kardinalitäten in Klausuren!)
Komposition:   ausgefüllte Raute (wenn explizit gefragt)

OBJEKTDIAGRAMM (Objektkarte):
  objectName: ClassName
  attribut1 = Wert1
  attribut2 = Wert2
  ...
  → Keine Operationen erforderlich!

WICHTIGE KONZEPTE:
• Kapselung: private Attribute, öffentliche Zugriffsmethoden (get/set)
• Vererbung: Unterklasse erbt ALLE Attribute + Operationen der Oberklasse
• Überschreiben: Unterklasse kann geerbte Operation neu definieren
• Konstruktor: Initialisiert Attributwerte beim Erzeugen (c notiert!)

OPERATIONSSIGNATUR (offizielle Notation, Hinweise 2021, §5):
  name(param: Typ, ...): Rückgabetyp
  Beispiel: suche(wert: Ganzzahl): Wahrheitswert`,
    errors: [
      { description: 'Konstruktor ohne vorangestelltes c notiert', source: 'official' },
      { description: 'Sichtbarkeit + / - vergessen oder vertauscht (public = +, private = -)', source: 'official' },
      { description: 'Vererbungspfeil in falsche Richtung (Pfeil zeigt zur OBER-klasse)', source: 'pattern' },
      { description: 'Objektdiagramm enthält Operationen (nicht notwendig!)', source: 'official' },
      { description: 'Assoziationen mit Kardinalitäten versehen (in Klausuren unspezifiziert)', source: 'official' },
    ],
    examPattern: '⭐ JEDES JAHR in Block 1 (5/5 Jahrgänge 2021–2025). Typisch: Klasse erläutern, Vererbungshierarchie entwerfen, Methode implementieren (Struktogramm), Objektkarte ausfüllen. Oft kombiniert mit BST, DynArray oder Rekursion.',
    relatedTopics: ['bst', 'dyn', 'rek'],
  },
  {
    id: 'bst',
    icon: '🌲',
    title: 'Binärbaum & Binärsuchbaum',
    category: 'Algorithmen & Datenstrukturen',
    block: 'B1',
    priority: 'HOCH',
    officialNote: 'Ergänzende Hinweise 2021, §2 – offizielle BinTree-Operationen',
    theory: `BST-EIGENSCHAFT:
Für jeden Knoten k gilt: alle Werte im linken Teilbaum < k < alle Werte im rechten Teilbaum.

TRAVERSIERUNGEN (auswendig kennen!):
• Preorder  (VLR):  Wurzel → linker TB → rechter TB
• Inorder   (LVR):  linker TB → Wurzel → rechter TB   ← BST: ergibt aufsteigende Folge!
• Postorder (LRV):  linker TB → rechter TB → Wurzel

OFFIZIELLE BinTree-OPERATIONEN (Ergänzende Hinweise 2021, §2):
  BinTree()                       ← Baum ohne Inhalt
  BinTree(inhalt: Inhaltstyp)     ← Baum mit Inhalt
  hasItem(): Wahrheitswert
  getItem(): Inhaltstyp
  setItem(inhalt: Inhaltstyp)
  deleteItem()
  isLeaf(): Wahrheitswert
  hasLeft(): Wahrheitswert        getLeft(): Binärbaum
  setLeft(b: Binärbaum)          deleteLeft()
  hasRight(): Wahrheitswert       getRight(): Binärbaum
  setRight(b: Binärbaum)         deleteRight()

SUCHE im BST (Struktogramm-Schema):
  suche(baum: BinTree, wert: Typ): Wahrheitswert
    wenn NICHT baum.hasItem() dann
      gib falsch zurück
    wenn baum.getItem() = wert dann
      gib wahr zurück
    wenn wert < baum.getItem() dann
      wenn baum.hasLeft() dann
        gib suche(baum.getLeft(), wert) zurück
      sonst
        gib falsch zurück
    sonst
      wenn baum.hasRight() dann
        gib suche(baum.getRight(), wert) zurück
      sonst
        gib falsch zurück

EINFÜGEN: Suche bis leere Stelle → dort neuen BinTree(wert) einsetzen.`,
    errors: [
      { description: 'Inorder (LVR) mit Preorder/Postorder verwechselt', source: 'pattern' },
      { description: 'BST-Sortierungseigenschaft falsch (links < Wurzel < rechts!)', source: 'pattern' },
      { description: 'getLeft()/getRight() ohne vorherige hasLeft()/hasRight()-Prüfung aufgerufen', source: 'official' },
      { description: 'Rekursiver Algorithmus ohne Basisfall', source: 'pattern' },
      { description: 'Blatt-Prüfung: isLeaf() ≠ NOT hasItem() — isLeaf() prüft auf fehlende Teilbäume', source: 'official' },
    ],
    examPattern: '4/5 Jahrgänge in Block 1 (2021:Kfz, 2022:Radioteleskop-Sterne, 2023:Wörter, 2025:Huffman-Baum). Typisch: BST aufbauen, Traversierung ausführen, Suche/Einfügen implementieren.',
    relatedTopics: ['oop', 'rek'],
  },
  {
    id: 'krypto',
    icon: '🔐',
    title: 'Kryptologie',
    category: 'Informationen & ihre Darstellung',
    block: 'B2',
    priority: 'HOCH',
    theory: `SYMMETRISCHE VERSCHLÜSSELUNG:
Gleicher Schlüssel für Ver- und Entschlüsselung.

SUBSTITUTION (Buchstabe wird ersetzt):
• Monoalphabetisch (Caesar, ROT13): Immer gleiche Ersetzung → angreifbar durch Häufigkeitsanalyse!
• Polyalphabetisch (Vigenère): Wechselnde Alphabete je nach Schlüsselposition → Häufigkeitsverteilung wird verschleiert.

TRANSPOSITION:
Buchstaben werden UMGESTELLT, nicht ersetzt.
Klartextinhalt bleibt erhalten, Reihenfolge ändert sich.
Typisch: spaltenweise Anordnung und zeilenweise Herausnahme (oder umgekehrt).

BLOCKCHIFFRE:
Verarbeitung des Klartexts in Blöcken fester Länge.
Jeder Block wird separat (und oft mit mehreren Runden) ver-/entschlüsselt.

ASYMMETRISCHE VERSCHLÜSSELUNG:
• Public Key (öffentlich): zum Verschlüsseln von Nachrichten an den Inhaber
• Private Key (geheim): zum Entschlüsseln empfangener Nachrichten
• Schlüssel mathematisch verknüpft, aber Private Key nicht aus Public Key ableitbar

DIGITALE SIGNATUR (Schlüssel UMGEKEHRT!):
• Alice SIGNIERT mit ihrem PRIVATEN Schlüssel → Authentizität beweisbar
• Bob prüft mit Alices ÖFFENTLICHEM Schlüssel → Integrität prüfbar
• Merkhilfe: signieren = eigener PRIVATER Schlüssel; verschlüsseln = PUBLIC Key des Empfängers

ZERTIFIKAT:
Bindet Identität (Person/Organisation) an öffentlichen Schlüssel. Ausgestellt von einer Zertifizierungsstelle (CA). Verhindert Man-in-the-Middle bei Public-Key-Austausch.

SICHERHEIT BEWERTEN:
• Schlüsselraum: mehr mögliche Schlüssel = höherer Aufwand für Brute-Force
• Häufigkeitsanalyse: funktioniert bei monoalphabetischen Substitutionen
• Kerckhoffs-Prinzip: Sicherheit hängt NUR vom Schlüssel ab, nicht vom Algorithmus`,
    errors: [
      { description: 'Signatur-Schlüssel vertauscht: Signieren erfolgt mit PRIVATEM Schlüssel (nicht öffentlich!)', source: 'pattern' },
      { description: 'Transposition ≠ Substitution: Transposition stellt um, ersetzt nicht', source: 'pattern' },
      { description: 'Häufigkeitsanalyse falsch eingeschätzt: funktioniert NUR bei monoalphabetischer Substitution', source: 'pattern' },
      { description: 'Polyalphabetisch/monoalphabetisch verwechselt', source: 'pattern' },
      { description: 'Blockchiffre-Schritte unvollständig beschrieben', source: 'pattern' },
    ],
    examPattern: '⭐ JEDES JAHR in Block 2 (5/5). 2021:csCrypt(Stack+Transposition), 2022:GironaCrypt(Transposition)+Blockchiffre, 2023:CPlus(polyalphabetisch)+PERMUT-4(Blockchiffre), 2024:Kolonne(3×3-Transposition), 2025:Eibar-Crypt(Transposition+polyalph.). Immer: Verfahren analysieren, Schritte beschreiben/implementieren, Sicherheit beurteilen.',
    relatedTopics: ['cod'],
  },
  {
    id: 'db',
    icon: '🗄',
    title: 'Datenbanken & SQL',
    category: 'Informationen & ihre Darstellung',
    block: 'B2',
    priority: 'HOCH',
    officialNote: 'Ergänzende Hinweise 2021, §3–4 + §9; Anlage 2026, §3',
    theory: `ER-MODELL (Ergänzende Hinweise 2021, §9):
• Entitätstypen: Rechtecke
• Beziehungstypen: Rauten
• Attribute: Ellipsen (können auch an Beziehungstypen stehen!)
• Schlüsselattribute: unterstrichen (obligatorisch!)
• Kardinalitäten: 1:1, 1:n, n:m (obligatorisch an den Kanten!)
• Rekursive Beziehungen: möglich

RELATIONALES SCHEMA (Kurzschreibweise):
  Tabelle(PrimärSchlüssel, Attribut, ↑FremdSchlüssel)
  Primärschlüssel: unterstrichen
  Fremdschlüssel: ↑ vorangestellt

ANOMALIEN:
• Einfügeanomalie: Datensatz kann nicht eingefügt werden ohne andere Daten
• Änderungsanomalie: Redundante Daten müssen an mehreren Stellen geändert werden
• Löschanomalie: Löschen eines Datensatzes entfernt unbeabsichtigt andere Informationen

SQL (offizieller Umfang — Ergänzende Hinweise 2021, §3):
  SELECT [DISTINCT | ALL] * | spalte1 [AS alias1]
  FROM tabelle1, tabelle2
  [WHERE bed1 (AND | OR) bed2
      AND tab1.key = tab2.fremdkey]   ← JOIN über WHERE!
  [GROUP BY spalte
    [HAVING aggregatbedingung]]       ← NICHT WHERE für Aggregat!
  [ORDER BY spalte [ASC | DESC]]
  [LIMIT anzahl]

AGGREGATFUNKTIONEN: AVG, COUNT, MAX, MIN, SUM
VERGLEICHSOPERATOREN: =, !=, >, <, >=, <=, NOT, LIKE, BETWEEN, IN, IS NULL
BERECHNUNGSOPERATOREN: +, -, *, /
KEINE verschachtelten SELECT-Anweisungen! (offiziell ausgeschlossen)`,
    errors: [
      { description: 'HAVING statt WHERE für Aggregatbedingung vergessen (oder umgekehrt!)', source: 'pattern' },
      { description: 'JOIN-Bedingung in WHERE fehlt → kartesisches Produkt (alle × alle)', source: 'pattern' },
      { description: 'GROUP BY fehlt bei Aggregatfunktion mit weiteren Spalten', source: 'pattern' },
      { description: 'Primär- und Fremdschlüssel im Schema verwechselt', source: 'pattern' },
      { description: 'Kardinalitäten im ER-Diagramm fehlen (obligatorisch!)', source: 'official' },
      { description: 'Attribute an Beziehungstypen vergessen (wenn vorhanden)', source: 'pattern' },
    ],
    examPattern: '4/5 Jahrgänge in Block 2 (2021:Anomalien+ER+SQL, 2022:Impfzentrum, 2023:Schulverwaltung, 2025:EM-Tippspiel). Immer: Anomalien erklären, ER-Modell aufstellen/ergänzen, SQL-Abfragen schreiben (JOIN + Aggregat).',
    relatedTopics: ['aut'],
  },
  {
    id: 'aut',
    icon: '⚙',
    title: 'Automaten & DEA',
    category: 'Automaten & formale Sprachen',
    block: 'B2',
    priority: 'HOCH',
    officialNote: 'Ergänzende Hinweise 2021, §7',
    theory: `DEA (Deterministischer Endlicher Automat) — Notation (Ergänzende Hinweise 2021, §7):
• Zustandsgraph
• Startzustand: Pfeil ohne Quelle
• Endzustände: Doppelkreis
• Übergänge: Pfeile mit Eingabezeichen
• Vollständig: jeder Zustand × jedes Zeichen hat genau einen Übergang
• Fehlerzustand: kann weggelassen werden, wenn in Text erläutert

MEALY-AUTOMAT:
• Ausgabe bei jedem Übergang
• Notation am Übergang: Eingabezeichen / Ausgabezeichen
• Leere Ausgabe: ε
• Ausgabealphabet Ω separat angeben

KELLERAUTOMAT (eA-spezifisch!):
• Notation am Übergang: (oberstes_Kellersymbol, Eingabe): neues_Kellersymbol
• Das rechts-gelesene Kellersymbol wird ENTFERNT, dann neues abgelegt
• Mehrere Zeichen: am weitesten rechts notiertes wird ZUERST abgelegt
• Vorbelegung: # | ε-Übergänge möglich
• Akzeptiert: Endzustand nach vollständiger Verarbeitung
• Kann Klammersprachen erkennen (DEA nicht!)

GRENZEN DES DEA:
• Kein Gedächtnis für beliebig viele Wiederholungen
• Kann nicht "zählen" (z.B. gleiche Anzahl a's und b's unmöglich)
• Kellerautomat > DEA in Ausdruckskraft
• Kontextfreie Sprachen ↔ Kellerautomat

ZUSAMMENHANG:
reguläre Grammatik ↔ DEA ↔ reguläre Sprache (Typ 3)
kontextfreie Grammatik ↔ Kellerautomat ↔ kontextfreie Sprache (Typ 2)`,
    errors: [
      { description: 'Endzustand ohne Doppelkreis gezeichnet', source: 'official' },
      { description: 'Fehlzustand vergessen bei unvollständiger Übergangsfunktion', source: 'official' },
      { description: 'Kellerautomat: Reihenfolge beim Stack ablegen falsch (rechts zuerst!)', source: 'official' },
      { description: 'ε-Übergang falsch: darf nicht zusammen mit anderem Übergang mit gleichem Kellersymbol auftreten', source: 'official' },
      { description: 'Mealy-Notation vertauscht: Eingabe / Ausgabe (nicht umgekehrt)', source: 'official' },
    ],
    examPattern: '4/5 Jahrgänge in Block 2 (2022:Fußballergebnisse-DEA, 2024:Spielekonsolen-Sperrcode-DEA, 2025:Prüfnummer-DEA+Kellerautomat). 2021+2023 Grammatik statt DEA. Typisch: DEA entwerfen, Eingaben prüfen, Kellerautomat (2025).',
    relatedTopics: ['gram'],
  },
  {
    id: 'gram',
    icon: '📝',
    title: 'Formale Sprachen & Grammatiken',
    category: 'Automaten & formale Sprachen',
    block: 'B2',
    priority: 'MITTEL',
    officialNote: 'Ergänzende Hinweise 2021, §8',
    theory: `GRAMMATIK G = (N, T, S, P) (Ergänzende Hinweise 2021, §8):
• N: Nichtterminalsymbole (typisch: GROSSBUCHSTABEN)
• T: Terminalsymbole (typisch: kleinbuchstaben / Zeichen)
• S: Startsymbol (∈ N)
• P: Produktionsregeln  A → α

ABLEITUNG: Beginne mit S, ersetze Nichtterminale durch P-Regeln, bis nur Terminale übrig.
Das Wort ist FERTIG wenn kein Nichtterminal mehr vorhanden!

REGULÄRE GRAMMATIK (Typ 3):
• Rechtslinear: A → aB  oder  A → a  (Nichtterminal immer rechts!)
• Äquivalent zu DEA → kann durch DEA erkannt werden
• Kann NICHT: {aⁿbⁿ | n ≥ 1}, Klammersprachen

KONTEXTFREIE GRAMMATIK (Typ 2):
• A → beliebige Zeichenkette α
• Wird von Kellerautomat erkannt
• KANN: {aⁿbⁿ}, Klammersprachen

CHOMSKY-HIERARCHIE (Typ 3 ⊂ Typ 2 ⊂ Typ 1 ⊂ Typ 0):
  Typ 3: regulär ↔ DEA
  Typ 2: kontextfrei ↔ Kellerautomat
  Typ 1: kontextsensitiv
  Typ 0: rekursiv aufzählbar (Turing-Maschine)

ε = leeres Wort (in Grammatiken und Automaten erlaubt)`,
    errors: [
      { description: 'Ableitung zu früh abgebrochen: noch ein Nichtterminal übrig', source: 'pattern' },
      { description: 'Regulär vs. kontextfrei verwechselt (Schlüsselkriterium: kann DEA erkennen?)', source: 'pattern' },
      { description: 'ε falsch eingesetzt oder vergessen', source: 'pattern' },
      { description: 'Typ der Grammatik falsch bestimmt (auf Regelform achten!)', source: 'pattern' },
    ],
    examPattern: '3/5 Jahrgänge in Block 2 (2021:Musiknotation, 2022:Frog-Sprache, 2023:URL-Hostname). Typisch: Wörter ableiten, Grammatik entwerfen, Typ bestimmen, Zusammenhang zu Automat erläutern.',
    relatedTopics: ['aut'],
  },
  {
    id: 'cod',
    icon: '💾',
    title: 'Codierung & Kompression',
    category: 'Informationen & ihre Darstellung',
    block: 'B1+B2',
    priority: 'MITTEL',
    officialNote: 'Ergänzende Hinweise 2021, §4 — offizielle Hamming-Notation',
    theory: `GRUNDLAGEN:
• Bit: kleinste Informationseinheit (0 oder 1)
• Byte: 8 Bit (Werte 0–255)
• Dualzahl: Basis 2 (Stellenwertsystem)
  Beispiel: 1011₂ = 1·8 + 0·4 + 1·2 + 1·1 = 11₁₀

FEHLERKORREKTUR:
• Paritätsbit: gerade oder ungerade Parität (erkennt 1-Bit-Fehler)
• (7,4)-Hamming-Code: 4 Datenbits + 3 Prüfbits

HAMMING (7,4) — offizielle Reihenfolge (Ergänzende Hinweise 2021, §4):
  Position: p0  p1  d0  p2  d1  d2  d3
  
  Kontrollgruppen:
    p0 prüft:  d0, d1,     d3   (XOR: p0 = d0 ⊕ d1 ⊕ d3)
    p1 prüft:  d0,     d2, d3   (XOR: p1 = d0 ⊕ d2 ⊕ d3)
    p2 prüft:      d1, d2, d3   (XOR: p2 = d1 ⊕ d2 ⊕ d3)
  
  Gerade Parität: Anzahl der Einsen in Kontrollgruppe + Prüfbit = gerade

HUFFMAN-CODIERUNG:
1. Häufigkeit jedes Zeichens zählen
2. Prioritätswarteschlange (seltenste zuerst)
3. Die 2 seltensten zu neuem Knoten kombinieren (Summe)
4. Wiederholen bis nur noch 1 Knoten (Wurzel)
5. Links = 0, Rechts = 1 (oder umgekehrt — Aufgabe beachten!)
Ergebnis: häufige Zeichen → kurze Codes, seltene → lange

LAUFLÄNGENCODIERUNG: z.B. aaaabb → 4a2b
ASCII: 7-Bit-Code, 128 Zeichen (0–127)`,
    errors: [
      { description: 'Hamming-Reihenfolge falsch (offiziell: p0 p1 d0 p2 d1 d2 d3)', source: 'official' },
      { description: 'Kontrollgruppen falsch: p0 prüft {d0,d1,d3}, p1:{d0,d2,d3}, p2:{d1,d2,d3}', source: 'official' },
      { description: 'Huffman: Baum von unten nach oben aufbauen (häufigste NICHT zuerst kombinieren!)', source: 'pattern' },
      { description: 'Links=0/Rechts=1 nicht einheitlich im Huffman-Baum', source: 'pattern' },
    ],
    examPattern: '2023:Pulswert-Binärcodierung (B2), 2024:JPEG-ähnliche Kompression mit Huffman (B2), 2025:Huffman-Baum erstellen (prominent in B1). Wächst in Bedeutung!',
    relatedTopics: ['bst', 'krypto'],
  },
  {
    id: 'dyn',
    icon: '📚',
    title: 'DynArray · Stack · Queue',
    category: 'Algorithmen & Datenstrukturen',
    block: 'B1',
    priority: 'BASIS',
    officialNote: 'Ergänzende Hinweise 2021, §2 — vollständige offizielle Operationen',
    theory: `DYNAMISCHE REIHUNG (DynArray) — Index ab 0 (offiziell!):
  DynArray()
  isEmpty(): Wahrheitswert
  getItem(index: Ganzzahl): Inhaltstyp
  append(inhalt: Inhaltstyp)              ← hinten anfügen
  insertAt(index: Ganzzahl, inhalt)       ← an Position einfügen
  setItem(index: Ganzzahl, inhalt)        ← Inhalt ersetzen
  delete(index: Ganzzahl)                 ← Element entfernen
  getLength(): Ganzzahl

STAPEL (Stack) — LIFO (Last In, First Out):
  Stack()
  isEmpty(): Wahrheitswert
  top(): Inhaltstyp         ← liest NUR (ENTNIMMT NICHT!)
  push(inhalt: Inhaltstyp)  ← oben drauflegen
  pop(): Inhaltstyp         ← entnehmen und zurückgeben

SCHLANGE (Queue) — FIFO (First In, First Out):
  Queue()
  isEmpty(): Wahrheitswert
  head(): Inhaltstyp        ← liest NUR (ENTNIMMT NICHT!)
  enqueue(inhalt: Inhaltstyp) ← hinten einreihen
  dequeue(): Inhaltstyp     ← vorne entnehmen

⚠️ IMMER isEmpty() prüfen vor pop()/top()/dequeue()/head()!
   Laufzeitfehler bei Zugriff auf leere Datenstruktur sind KEIN Abiturinhalt!`,
    errors: [
      { description: 'top() entfernt das Element (FALSCH! top() nur lesen, pop() entnimmt)', source: 'official' },
      { description: 'LIFO vs. FIFO verwechselt (Stack = LIFO, Queue = FIFO)', source: 'pattern' },
      { description: 'isEmpty() vor pop/top/dequeue/head nicht geprüft', source: 'official' },
      { description: 'DynArray-Index nicht 0-basiert (offiziell ab 0!)', source: 'official' },
    ],
    examPattern: 'Stack 2021 (csCrypt), DynArray 2024 (Zoo+Krankenhaus). Grundlage fast aller Block-1-Implementierungen. Meist kombiniert mit OOP.',
    relatedTopics: ['oop', 'rek'],
  },
  {
    id: 'rek',
    icon: '🔄',
    title: 'Rekursion & Algorithmen',
    category: 'Algorithmen & Datenstrukturen',
    block: 'B1',
    priority: 'MITTEL',
    officialNote: 'Ergänzende Hinweise 2021, §5–6 — Struktogramm-Notation',
    theory: `REKURSION: Eine Operation ruft sich selbst auf.

PFLICHT-ELEMENTE (immer beide!):
  1. BASISFALL: terminiert ohne Selbstaufruf (Abbruchbedingung)
  2. REKURSIONSSCHRITT: verkleinert das Problem und ruft sich auf

WICHTIGE REGELN:
• Rekursionsschritt muss Problem dem Basisfall ANNÄHERN
• Mehrere Basisfälle möglich (und oft nötig!)
• Immer: wird die Abbruchbedingung erreicht?

STRUKTOGRAMM-NOTATION (Ergänzende Hinweise 2021, §5):
• Signatur: name(param: Typ): Rückgabetyp
• Sequenz: Anweisungsblöcke untereinander
• Verzweigung: Wenn-[Sonst-]Rahmen
• Schleife: Solange-/Für-Rahmen
• Kommentare: // vorangestellt
• Rückgabe: "gib X zurück" → Operation endet an dieser Stelle!

GANZZAHLDIVISION (offiziell!):
7 / 3 = 2  (kein Rest, außer explizit als Fließkomma gefragt)

TRACETABELLE:
• Jede Zeile = ein Ausführungsschritt
• Variablen als Spalten
• Aufgabenstellung beachten: Zustand VOR oder NACH dem Schritt?

ALGORITHMUS-EFFIZIENZ:
• O(n): linearer Aufwand
• O(n²): quadratisch
• O(log n): logarithmisch (BST-Suche im Idealfall)`,
    errors: [
      { description: 'Basisfall fehlt → Endlosrekursion', source: 'pattern' },
      { description: 'Rekursionsschritt verkleinert Problem nicht → Endlosrekursion', source: 'pattern' },
      { description: 'Rückgabewert vergessen (gib ... zurück fehlt)', source: 'pattern' },
      { description: 'Tracetabelle: VOR/NACH Schritt laut Aufgabe beachten', source: 'pattern' },
      { description: 'Ganzzahldivision: 7/3 = 2, nicht 2.33... (offizielle Regelung!)', source: 'official' },
    ],
    examPattern: '2023:Domino-Ketten (B1), 2024:Rekursion mit DynArray (B1), 2025:Huffman-Dekodierung rekursiv (B1). Häufig in Kombination mit BST oder DynArray.',
    relatedTopics: ['bst', 'dyn', 'oop'],
  },
  {
    id: 'arr2d',
    icon: '⊞',
    title: '2D-Reihungen (Matrizen)',
    category: 'Algorithmen & Datenstrukturen',
    block: 'B1',
    priority: 'HOCH',
    theory: `2D-REIHUNG (zweidimensionale statische Reihung):
Darstellung als Matrix mit Zeilen und Spalten.

INDEXIERUNG (offiziell ab 0!):
  reihung[zeile][spalte]  oder  reihung[i][j]
  Zeilen: 0 bis (anzahlZeilen - 1)
  Spalten: 0 bis (anzahlSpalten - 1)

ITERATION (typisches Muster — geschachtelte Schleifen):
  für i von 0 bis anzahlZeilen-1
    für j von 0 bis anzahlSpalten-1
      // verarbeite reihung[i][j]

TYPISCHE OPERATIONEN:
• Suchen (linear): alle Elemente durchlaufen
• Zählen nach Bedingung
• Summe / Durchschnitt
• Transponieren (Zeilen ↔ Spalten)
• Zeile/Spalte auslesen

KLAUSURTYPISCH:
Oft: 2D-Array repräsentiert Karte/Sitzplan/Belegung
Typisch: Bedingungssuche (z.B. "Wie viele freie Plätze in Reihe i?")
         oder Aggregation (z.B. "Belegungsgrad pro Reihe")`,
    errors: [
      { description: 'Index 1-basiert statt 0-basiert', source: 'official' },
      { description: 'Zeile und Spalte vertauscht: reihung[zeile][spalte]!', source: 'pattern' },
      { description: 'Off-by-one: Schleifen bis anzahl statt anzahl-1', source: 'pattern' },
      { description: 'Schachtelung falsch: äußere Schleife Zeilen, innere Spalten', source: 'pattern' },
    ],
    examPattern: '4/5 Jahrgänge in Block 1 (2021:Kino, 2022:MRT, 2023:BAAB-Konzert, 2025:Landwirtschaft). Immer kombiniert mit OOP oder Vererbung. Häufig: Suche/Aggregation über 2D-Array.',
    relatedTopics: ['oop', 'rek'],
  },
];

export const getTopicById = (id: string): Topic | undefined =>
  TOPICS.find((t) => t.id === id);

export const getTopicsByBlock = (block: 'B1' | 'B2'): Topic[] =>
  TOPICS.filter((t) => t.block === block || t.block === 'B1+B2');

export const getTopicsByPriority = (priority: Priority): Topic[] =>
  TOPICS.filter((t) => t.priority === priority);
