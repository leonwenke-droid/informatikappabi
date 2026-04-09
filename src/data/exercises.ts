import type { Exercise } from '../types';

/**
 * EXERCISES
 * Source:
 *   - 'official': content directly from KC 2017 / Ergänzende Hinweise 2021
 *   - 'klausur-XXXX': adapted from or inspired by actual eA-Klausur
 *   - 'derived': didactic construction based on official patterns
 *
 * Bug fix vs. prototype:
 *   - Grammar exercise B→bB|b: generates aⁿbᵐ (n≥1, m≥1), NOT aⁿb. Fixed.
 */

export const EXERCISES: Exercise[] = [
  // ─────────────────────────────────────────────────────────
  // OOP
  // ─────────────────────────────────────────────────────────
  {
    id: 'oop-01',
    topicId: 'oop',
    track: 'mini',
    subtopic: 'notation',
    difficulty: 1,
    points: 4,
    operator: 'bestimmen',
    question: 'Welche der folgenden Aussagen zur offiziellen Klassendiagramm-Notation (Ergänzende Hinweise 2021) sind korrekt? (Mehrere Antworten möglich)',
    type: 'mc',
    options: [
      { id: 0, text: 'Konstruktoren werden durch ein vorangestelltes c gekennzeichnet' },
      { id: 1, text: 'Private Attribute werden mit + markiert' },
      { id: 2, text: 'Assoziationen werden als einfache Linien ohne Kardinalitäten dargestellt' },
      { id: 3, text: 'Objektdiagramme enthalten keine Operationen' },
      { id: 4, text: 'Öffentliche Operationen werden mit - markiert' },
      { id: 5, text: 'Nicht aufgeführte Attribute werden durch ... angedeutet' },
    ],
    correctOptions: [0, 2, 3, 5],
    explanation: 'c = Konstruktor ✓ | Assoziation ohne Kardinalitäten ✓ | Objektdiagramm ohne Ops. ✓ | ... für nicht aufgeführte ✓. FALSCH: Private = -, Öffentlich = + (nicht umgekehrt!)',
    source: 'official',
  },
  {
    id: 'oop-02',
    topicId: 'oop',
    track: 'standard',
    subtopic: 'klassendiagramm',
    difficulty: 2,
    points: 6,
    operator: 'entwerfen',
    question: `Entwerfen Sie ein Klassendiagramm für folgende Situation:
Eine Klasse "Fahrzeug" hat private Attribute "kennzeichen" (Zeichenkette) und "baujahr" (Ganzzahl).
Sie hat öffentliche Operationen getKennzeichen(): Zeichenkette und getBaujahr(): Ganzzahl.
Einen Konstruktor Fahrzeug(kennzeichen: Zeichenkette, baujahr: Ganzzahl).
Eine Klasse "PKW" erbt von Fahrzeug und fügt ein privates Attribut "anzahlTueren: Ganzzahl" hinzu,
sowie eine öffentliche Operation getAnzahlTueren(): Ganzzahl.`,
    type: 'text',
    modelAnswer: `Fahrzeug
- kennzeichen: Zeichenkette
- baujahr: Ganzzahl
c Fahrzeug(kennzeichen: Zeichenkette, baujahr: Ganzzahl)
+ getKennzeichen(): Zeichenkette
+ getBaujahr(): Ganzzahl

PKW
- anzahlTueren: Ganzzahl
+ getAnzahlTueren(): Ganzzahl

PKW ──▷ Fahrzeug  (leerer Dreieckspfeil, PKW erbt von Fahrzeug)`,
    explanation: 'Vererbung: leerer Dreieckspfeil zeigt zur OBERKLASSE. Konstruktor mit c. Private = -, öffentlich = +. PKW braucht keine geerbten Attribute/Ops. zu wiederholen.',
    keywords: ['Fahrzeug', 'kennzeichen', 'baujahr', 'PKW', 'anzahlTueren', 'c Fahrzeug', '- kennzeichen', '+ get'],
    source: 'derived',
  },
  {
    id: 'oop-03',
    topicId: 'oop',
    track: 'transfer',
    difficulty: 2,
    points: 4,
    operator: 'erläutern',
    question: 'Erläutern Sie den Unterschied zwischen Kapselung und Vererbung in der objektorientierten Programmierung. Geben Sie jeweils ein konkretes Beispiel.',
    type: 'text',
    modelAnswer: `Kapselung: Daten (Attribute) werden privat gehalten und nur über öffentliche Methoden zugänglich gemacht. Beispiel: Klasse Konto hat privates Attribut "kontostand: Ganzzahl" — nur durch öffentliche Methode getKontostand() lesbar und durch einzahlen() veränderbar. So wird unkontrollierter Zugriff verhindert.

Vererbung: Eine Unterklasse übernimmt alle Attribute und Operationen der Oberklasse und kann eigene hinzufügen oder Operationen überschreiben. Beispiel: PKW erbt von Fahrzeug alle Attribute (kennzeichen, baujahr) und Operationen, fügt aber eigenes Attribut anzahlTueren hinzu.

Unterschied: Kapselung schützt Daten INNERHALB einer Klasse; Vererbung beschreibt die BEZIEHUNG zwischen Klassen.`,
    explanation: 'Kapselung = Datenschutz innerhalb einer Klasse (private + getter/setter). Vererbung = Weitergabe von Attributen/Ops. an Unterklasse.',
    keywords: ['private', 'public', 'getter', 'Unterklasse', 'Oberklasse', 'erbt'],
    source: 'derived',
  },

  // ─────────────────────────────────────────────────────────
  // BST
  // ─────────────────────────────────────────────────────────
  {
    id: 'bst-01',
    topicId: 'bst',
    track: 'mini',
    difficulty: 1,
    points: 3,
    operator: 'bestimmen',
    question: `Gegeben ist ein BST mit folgenden Knoten (in dieser Einfügereihenfolge): 10, 5, 15, 3, 7, 20

Bestimmen Sie die Ergebnisse der drei Traversierungen:
a) Preorder (VLR)
b) Inorder (LVR)
c) Postorder (LRV)`,
    type: 'text',
    modelAnswer: `Baumstruktur:
       10
      /   \\
     5    15
    / \\     \\
   3   7    20

a) Preorder  (VLR): 10, 5, 3, 7, 15, 20
b) Inorder   (LVR): 3, 5, 7, 10, 15, 20  ← aufsteigend (BST-Eigenschaft!)
c) Postorder (LRV): 3, 7, 5, 20, 15, 10`,
    explanation: 'Inorder eines BST ist immer aufsteigend sortiert — fundamentale Eigenschaft! Preorder: erst Wurzel, dann links, dann rechts. Postorder: erst links, dann rechts, dann Wurzel.',
    keywords: ['Preorder', 'Inorder', 'Postorder', '3, 5, 7, 10, 15, 20'],
    source: 'derived',
  },
  {
    id: 'bst-02',
    topicId: 'bst',
    difficulty: 2,
    points: 8,
    operator: 'implementieren',
    question: `Implementieren Sie die folgende Operation als Struktogramm/Pseudocode mit offiziellen BinTree-Operationen:

  zaehleKnotenMitWert(baum: BinTree, wert: Ganzzahl): Ganzzahl
  
Gibt zurück: Wie viele Knoten im Baum haben genau den übergebenen Wert?
(Der Baum ist ein allgemeiner Binärbaum, KEIN BST.)
Hinweis: Nutzen Sie Rekursion.`,
    type: 'text',
    modelAnswer: `zaehleKnotenMitWert(baum: BinTree, wert: Ganzzahl): Ganzzahl
  // Basisfall 1: Baum ist leer (kein Inhalt)
  wenn NICHT baum.hasItem() dann
    gib 0 zurück
  
  // Eigener Knoten zählen
  anzahl ← 0
  wenn baum.getItem() = wert dann
    anzahl ← 1
  
  // Rekursiv in Teilbäumen zählen
  wenn baum.hasLeft() dann
    anzahl ← anzahl + zaehleKnotenMitWert(baum.getLeft(), wert)
  wenn baum.hasRight() dann
    anzahl ← anzahl + zaehleKnotenMitWert(baum.getRight(), wert)
  
  gib anzahl zurück`,
    explanation: 'Basisfall: leerer Knoten (hasItem() falsch). Eigener Knoten prüfen. Dann rekursiv links und rechts. hasLeft/hasRight VOR getLeft/getRight prüfen!',
    keywords: ['hasItem', 'getItem', 'hasLeft', 'hasRight', 'getLeft', 'getRight', 'gib', 'zurück', 'anzahl'],
    antiPatterns: ['ohne hasLeft überprüfung', 'ohne basisfall', 'getLeft ohne hasLeft'],
    source: 'derived',
  },
  {
    id: 'bst-03',
    topicId: 'bst',
    difficulty: 2,
    points: 5,
    operator: 'analysieren',
    question: `Analysieren Sie: Welche Aussagen über den BST sind korrekt? (Mehrfachauswahl)

Gegeben: Einfügereihenfolge 50, 30, 70, 20, 40, 60, 80`,
    type: 'mc',
    options: [
      { id: 0, text: 'Die Inorder-Traversierung ergibt: 20, 30, 40, 50, 60, 70, 80' },
      { id: 1, text: 'Die Wurzel des BST ist 50' },
      { id: 2, text: 'Der Knoten 40 befindet sich links von 30' },
      { id: 3, text: 'Der Knoten 40 befindet sich rechts von 30' },
      { id: 4, text: 'Die Preorder-Traversierung beginnt mit: 50, 30, 20, 40' },
      { id: 5, text: 'isLeaf() gibt für Knoten 20 den Wert wahr zurück' },
    ],
    correctOptions: [0, 1, 3, 4, 5],
    explanation: '50 ist Wurzel (zuerst eingefügt). 30 links von 50, 70 rechts. 20 links von 30, 40 RECHTS von 30 (40>30). 60 links von 70, 80 rechts. Inorder immer aufsteigend. 20 ist Blatt (keine Kinder). Preorder: 50,30,20,40,...',
    source: 'derived',
  },

  // ─────────────────────────────────────────────────────────
  // Kryptologie
  // ─────────────────────────────────────────────────────────
  {
    id: 'krypto-01',
    topicId: 'krypto',
    difficulty: 2,
    points: 5,
    operator: 'analysieren',
    question: 'Analysieren Sie: Warum ist das Vigenère-Verfahren gegen Häufigkeitsanalyse sicherer als das Caesar-Verfahren? Nennen Sie den entscheidenden Unterschied.',
    type: 'text',
    modelAnswer: `Caesar ist monoalphabetisch: Jeder Klartextbuchstabe wird IMMER durch denselben Geheimtextbuchstaben ersetzt. Die Häufigkeitsverteilung des Klartexts bleibt im Geheimtext erhalten — häufige Buchstaben (E, N, I im Deutschen) bleiben häufig und sind identifizierbar.

Vigenère ist polyalphabetisch: Je nach Position im Schlüssel wird ein anderes Verschlüsselungsalphabet verwendet. Derselbe Klartextbuchstabe wird an verschiedenen Positionen durch verschiedene Geheimtextbuchstaben ersetzt. Die Häufigkeitsverteilung im Geheimtext wird dadurch verzerrt und eine einfache Häufigkeitsanalyse ist nicht mehr direkt anwendbar.

Entscheidender Unterschied: Mono- vs. polyalphabetisch.`,
    explanation: 'Kernbegriff: polyalphabetisch = wechselnde Alphabete = Häufigkeiten werden verschleiert.',
    keywords: ['polyalphabetisch', 'monoalphabetisch', 'Häufigkeit', 'Schlüssel'],
    source: 'derived',
  },
  {
    id: 'krypto-02',
    topicId: 'krypto',
    difficulty: 2,
    points: 5,
    operator: 'erläutern',
    question: 'Erläutern Sie den Unterschied zwischen digitaler Signatur und asymmetrischer Verschlüsselung: Welcher Schlüssel wird bei welchem Vorgang verwendet?',
    type: 'text',
    modelAnswer: `Asymmetrische Verschlüsselung (Ziel: Vertraulichkeit):
  - Sender verschlüsselt mit dem ÖFFENTLICHEN Schlüssel des Empfängers
  - Empfänger entschlüsselt mit seinem eigenen PRIVATEN Schlüssel
  - Nur der Empfänger kann entschlüsseln (nur er hat den privaten Schlüssel)

Digitale Signatur (Ziel: Authentizität + Integrität):
  - Sender signiert mit seinem eigenen PRIVATEN Schlüssel
  - Empfänger prüft die Signatur mit dem ÖFFENTLICHEN Schlüssel des Senders
  - Jeder kann prüfen, aber nur der rechtmäßige Sender konnte signieren

Merkhilfe: Signieren = PRIVATER Schlüssel des Senders (umgekehrt zur Verschlüsselung!)`,
    explanation: 'Die Schlüsselverwendung ist beim Signieren genau umgekehrt! Privat signiert → öffentlich prüfbar. Öffentlich verschlüsselt → privat entschlüsselbar.',
    keywords: ['privat', 'öffentlich', 'signiert', 'verschlüsselt', 'Authentizität'],
    source: 'derived',
  },
  {
    id: 'krypto-03',
    topicId: 'krypto',
    difficulty: 1,
    points: 3,
    operator: 'bestimmen',
    question: 'Welche Aussagen zur Transpositionsverschlüsselung sind korrekt? (Mehrfachauswahl)',
    type: 'mc',
    options: [
      { id: 0, text: 'Buchstaben werden durch andere Buchstaben ersetzt' },
      { id: 1, text: 'Buchstaben werden in ihrer Reihenfolge umgeordnet' },
      { id: 2, text: 'Der Klartext ist nach der Transposition vollständig enthalten, nur anders angeordnet' },
      { id: 3, text: 'Häufigkeitsanalyse ist gegen Transposition wirkungslos, da Buchstaben nicht ersetzt werden' },
      { id: 4, text: 'Transposition ist eine Form der Substitution' },
    ],
    correctOptions: [1, 2, 3],
    explanation: 'Transposition STELLT UM, ersetzt NICHT. Alle Buchstaben bleiben erhalten. Häufigkeitsanalyse wirkungslos (Inhalt bleibt). Transposition und Substitution sind VERSCHIEDENE Verfahren.',
    source: 'derived',
  },

  // ─────────────────────────────────────────────────────────
  // Datenbank / SQL
  // ─────────────────────────────────────────────────────────
  {
    id: 'db-01',
    topicId: 'db',
    track: 'mini',
    subtopic: 'sql_basis',
    difficulty: 2,
    points: 8,
    operator: 'implementieren',
    question: `Schreiben Sie eine SQL-Abfrage für folgende Tabellen:
  Kunde(KNr, Name, Ort)
  Bestellung(BNr, ↑KNr, Datum, Betrag)

Gesucht: Name aller Kunden aus "Hamburg" und ihr Gesamtbestellwert,
aber nur Kunden mit einem Gesamtbestellwert größer als 500.
Sortierung: absteigend nach Gesamtbestellwert.`,
    type: 'sql',
    modelAnswer: `SELECT Kunde.Name, SUM(Bestellung.Betrag) AS Gesamtwert
FROM Kunde, Bestellung
WHERE Kunde.KNr = Bestellung.KNr
  AND Kunde.Ort = 'Hamburg'
GROUP BY Kunde.KNr, Kunde.Name
HAVING SUM(Bestellung.Betrag) > 500
ORDER BY Gesamtwert DESC`,
    explanation: 'JOIN über WHERE (kein JOIN-Schlüsselwort!). GROUP BY für Aggregation. HAVING (nicht WHERE!) für Bedingung auf SUM. Alias im ORDER BY verwendbar.',
    keywords: ['SELECT', 'FROM Kunde', 'FROM Bestellung', 'WHERE', 'KNr', 'Hamburg', 'GROUP BY', 'HAVING', 'SUM', '500', 'ORDER BY', 'DESC'],
    antiPatterns: ['WHERE SUM', 'ohne GROUP BY', 'ohne JOIN-Bedingung'],
    source: 'derived',
  },
  {
    id: 'db-02',
    topicId: 'db',
    difficulty: 1,
    points: 4,
    operator: 'erläutern',
    question: 'Erläutern Sie die drei Arten von Anomalien in Datenbanken (Einfüge-, Änderungs- und Löschanomalie) jeweils an einem eigenen Beispiel.',
    type: 'text',
    modelAnswer: `Einfügeanomalie: Ein Datensatz kann nicht eingefügt werden, ohne andere (ggf. noch unbekannte) Daten mitzuangeben. Beispiel: In Tabelle Bestellung(BNr, KundenName, KundenOrt, Betrag) kann eine Bestellung erst eingetragen werden, wenn Kundenname und -ort bekannt sind — obwohl die Bestellung selbst noch gar nicht existiert.

Änderungsanomalie: Redundante Daten müssen an mehreren Stellen gleichzeitig geändert werden. Vergisst man eine Stelle, sind die Daten inkonsistent. Beispiel: Zieht Kunde "Müller" um, muss sein Ort in JEDER seiner Bestellungszeilen geändert werden.

Löschanomalie: Das Löschen eines Datensatzes vernichtet unbeabsichtigt andere Informationen. Beispiel: Löscht man die letzte Bestellung eines Kunden, gehen auch alle Kundendaten (Name, Ort) verloren.`,
    explanation: 'Alle drei Anomalien entstehen durch Redundanz (nicht normalisierte Daten). Lösung: Normalisierung, d.h. Daten in separate Tabellen mit Fremdschlüsseln aufteilen.',
    keywords: ['Einfügeanomalie', 'Änderungsanomalie', 'Löschanomalie', 'Redundanz'],
    source: 'derived',
  },
  {
    id: 'db-03',
    topicId: 'db',
    difficulty: 2,
    points: 5,
    operator: 'bestimmen',
    question: 'Welche SQL-Aussagen sind korrekt gemäß dem offiziellen Abitur-Umfang 2026? (Mehrfachauswahl)',
    type: 'mc',
    options: [
      { id: 0, text: 'Verschachtelte SELECT-Anweisungen (Subqueries) sind im Abitur zugelassen' },
      { id: 1, text: 'JOIN zwischen Tabellen erfolgt über die WHERE-Bedingung' },
      { id: 2, text: 'HAVING wird für Bedingungen auf Aggregatfunktionen verwendet' },
      { id: 3, text: 'WHERE kann für Bedingungen auf SUM() verwendet werden' },
      { id: 4, text: 'DISTINCT entfernt Duplikate aus dem Ergebnis' },
      { id: 5, text: 'ORDER BY kann einen Alias aus SELECT verwenden' },
    ],
    correctOptions: [1, 2, 4, 5],
    explanation: 'Subqueries: NICHT im Abitur (offiziell ausgeschlossen). JOIN über WHERE ✓. HAVING für Aggregate ✓. WHERE kann NICHT SUM() prüfen ✗. DISTINCT ✓. Alias in ORDER BY ✓ (auch laut Anlage 2026).',
    source: 'official',
  },
  {
    id: 'db-04',
    topicId: 'db',
    track: 'examStyle',
    difficulty: 3,
    points: 8,
    operator: 'implementieren',
    question: `Gegeben:
  Student(MatrNr, Name, Semester)
  Kurs(KursNr, Titel, ECTS)
  Belegung(↑MatrNr, ↑KursNr, Note)

Schreiben Sie eine SQL-Abfrage:
Alle Studenten (Name, MatrNr) im 3. oder höheren Semester,
die mindestens 3 Kurse belegt haben.
Ausgabe: Name, MatrNr, Anzahl der belegten Kurse.
Sortierung: nach Anzahl absteigend.`,
    type: 'sql',
    modelAnswer: `SELECT Student.Name, Student.MatrNr, COUNT(Belegung.KursNr) AS AnzahlKurse
FROM Student, Belegung
WHERE Student.MatrNr = Belegung.MatrNr
  AND Student.Semester >= 3
GROUP BY Student.MatrNr, Student.Name
HAVING COUNT(Belegung.KursNr) >= 3
ORDER BY AnzahlKurse DESC`,
    explanation: 'JOIN: Student.MatrNr = Belegung.MatrNr. Semester-Filter in WHERE (kein Aggregat). GROUP BY für COUNT. HAVING für Aggregat-Filter. ORDER BY auf Alias.',
    keywords: ['SELECT', 'COUNT', 'FROM Student', 'FROM Belegung', 'MatrNr', 'Semester >= 3', 'GROUP BY', 'HAVING', 'ORDER BY', 'DESC'],
    source: 'derived',
  },

  // ─────────────────────────────────────────────────────────
  // Automaten
  // ─────────────────────────────────────────────────────────
  {
    id: 'aut-01',
    topicId: 'aut',
    difficulty: 2,
    points: 6,
    operator: 'entwerfen',
    question: `Entwerfen Sie textuell einen vollständigen DEA über dem Alphabet Σ = {0, 1},
der genau alle Zeichenketten akzeptiert, die mit "01" enden.

Geben Sie an: Zustände, Startzustand, Endzustand(Endzustände), Übergänge.`,
    type: 'text',
    modelAnswer: `Zustände: S0 (Start), S1, S2 (Endzustand)

Übergänge:
  S0 --0--> S1    (erstes 0 gelesen)
  S0 --1--> S0    (1 ohne 0 davor: wieder Anfang)
  S1 --0--> S1    (weiteres 0: noch kein "01")
  S1 --1--> S2    (nach 0 kommt 1: "01" vollständig!)
  S2 --0--> S1    (Muster gebrochen, beginne neu mit 0)
  S2 --1--> S0    (Muster gebrochen, kein 0 mehr aktuell)

Startzustand: S0
Endzustand: S2 (Doppelkreis)
Eingabealphabet: Σ = {0, 1}

Erklärung: S2 kann verlassen werden, wenn das Muster "01" gebrochen wird.`,
    explanation: 'Klassischer Suffix-DEA. S1 = "0 gerade gelesen". S2 = "01 zuletzt gelesen". Wichtig: S2 kann verlassen werden (kein absorbing state).',
    keywords: ['S0', 'S1', 'S2', 'Endzustand', 'Startzustand', '01'],
    source: 'derived',
  },
  {
    id: 'aut-02',
    topicId: 'aut',
    difficulty: 1,
    points: 4,
    operator: 'analysieren',
    question: 'Welche Aussagen zum DEA (Deterministischer Endlicher Automat) sind korrekt? (Mehrfachauswahl)',
    type: 'mc',
    options: [
      { id: 0, text: 'Ein DEA kann immer Klammersprachen wie {aⁿbⁿ | n≥1} erkennen' },
      { id: 1, text: 'Endzustände werden durch Doppelkreis dargestellt' },
      { id: 2, text: 'Ein vollständiger DEA hat für jeden Zustand und jedes Eingabezeichen genau einen Übergang' },
      { id: 3, text: 'Der Startzustand wird durch einen Pfeil ohne Quelle markiert' },
      { id: 4, text: 'Ein DEA kann nur reguläre Sprachen erkennen' },
      { id: 5, text: 'Ein Fehlerzustand muss immer explizit dargestellt werden' },
    ],
    correctOptions: [1, 2, 3, 4],
    explanation: 'DEA kann KEINE Klammersprachen erkennen (fehlendes Gedächtnis). Fehlerzustand kann weggelassen werden mit erläuterndem Text. Alles andere stimmt.',
    source: 'official',
  },
  {
    id: 'aut-03',
    topicId: 'aut',
    difficulty: 2,
    points: 4,
    operator: 'erläutern',
    question: 'Erläutern Sie, warum ein DEA die Sprache L = {aⁿbⁿ | n ≥ 1} nicht erkennen kann, ein Kellerautomat jedoch schon.',
    type: 'text',
    modelAnswer: `Ein DEA hat kein Gedächtnis über die Vergangenheit hinaus — er kann sich nur in einem von endlich vielen Zuständen befinden. Um aⁿbⁿ zu erkennen, müsste der DEA "zählen", wie viele a's er gelesen hat, und dann genau gleich viele b's akzeptieren. Da n beliebig groß sein kann, bräuchte man unendlich viele Zustände — was ein DEA nicht hat.

Ein Kellerautomat besitzt zusätzlich einen unbegrenzten Kellerspeicher (Stack). Er kann für jedes gelesene 'a' ein Symbol auf den Keller legen und für jedes 'b' eines entnehmen. Am Ende ist der Keller leer genau dann, wenn gleich viele a's und b's gelesen wurden. So kann er zählen und L erkennen.`,
    explanation: 'DEA: endliche Zustände = kein unbegrenztes Zählen. Kellerautomat: Keller = unbegrenztes Gedächtnis für Zählung.',
    keywords: ['zählen', 'endlich', 'Keller', 'Speicher', 'beliebig'],
    source: 'derived',
  },

  // ─────────────────────────────────────────────────────────
  // Grammatiken
  // ─────────────────────────────────────────────────────────
  {
    id: 'gram-01',
    topicId: 'gram',
    difficulty: 2,
    points: 5,
    operator: 'analysieren',
    question: `Gegeben ist die Grammatik G:
  N = {S, B}
  T = {a, b}
  Startsymbol: S
  Produktionsregeln: S → aS | aB,  B → bB | b

(1) Leiten Sie das Wort "aaab" vollständig ab.
(2) Beschreiben Sie die erzeugte Sprache L(G) präzise in Worten.`,
    type: 'text',
    modelAnswer: `(1) Ableitung von "aaab":
  S → aS    (Regel S → aS)
  → aaS     (Regel S → aS)
  → aaaB    (Regel S → aB, statt nochmal S → aS)
  → aaabB   (Regel B → bB)

Warte — besser direkter:
  S → aS → aaS → aaaB → aaabB → aaabb?

Nochmal korrekt für "aaab" (genau 3 a und 1 b):
  S → aS → aaS → aaaB → aaab   (B → b Basisfall!)
  ✓ Ableitung endet: aaab ∈ L(G)

(2) L(G) = { aⁿbᵐ | n ≥ 1, m ≥ 1 }
  Das sind alle Wörter mit mindestens einem a, gefolgt von mindestens einem b.
  Begründung: S→aS|aB erzeugt beliebig viele a's (mind. 1), dann B.
  B→bB|b erzeugt beliebig viele b's (mind. 1).`,
    explanation: 'KORREKTUR gegenüber Prototyp: B→bB|b erzeugt MEHRERE b (nicht nur eines!). L(G) = {aⁿbᵐ | n,m ≥ 1}. Die Ableitung muss ohne Nichtterminale enden.',
    keywords: ['S', 'aS', 'aB', 'bB', 'Ableitung', 'aⁿbᵐ', 'n≥1', 'm≥1'],
    source: 'derived',
  },
  {
    id: 'gram-02',
    topicId: 'gram',
    difficulty: 2,
    points: 4,
    operator: 'bestimmen',
    question: 'Welche Aussagen zu Grammatiktypen sind korrekt? (Mehrfachauswahl)',
    type: 'mc',
    options: [
      { id: 0, text: 'Eine reguläre Grammatik ist äquivalent zu einem DEA' },
      { id: 1, text: 'Eine kontextfreie Grammatik kann {aⁿbⁿ | n≥1} erzeugen' },
      { id: 2, text: 'Eine reguläre Grammatik kann Klammersprachen erzeugen' },
      { id: 3, text: 'Bei rechtslinearer regulärer Grammatik steht das Nichtterminal RECHTS in der Regel' },
      { id: 4, text: 'Kontextfreie Grammatiken werden von Kellerautomaten erkannt' },
      { id: 5, text: 'ε (leeres Wort) ist in Grammatiken grundsätzlich verboten' },
    ],
    correctOptions: [0, 1, 3, 4],
    explanation: 'Regulär ↔ DEA ✓. KF kann aⁿbⁿ ✓. Regulär KANN KEINE Klammersprachen (fehlendes Gedächtnis) ✗. Rechtslinear: A→aB ✓. KF ↔ Kellerautomat ✓. ε ist zulässig ✗ (es ist erlaubt).',
    source: 'official',
  },

  // ─────────────────────────────────────────────────────────
  // Codierung / Hamming
  // ─────────────────────────────────────────────────────────
  {
    id: 'cod-01',
    topicId: 'cod',
    difficulty: 2,
    points: 5,
    operator: 'berechnen',
    question: `Berechnen Sie den (7,4)-Hamming-Code für die Datenbits:
  d0 = 1,  d1 = 0,  d2 = 1,  d3 = 1

Verwenden Sie die offizielle Reihenfolge: p0 p1 d0 p2 d1 d2 d3
Kontrollgruppen: p0:{d0,d1,d3}, p1:{d0,d2,d3}, p2:{d1,d2,d3}`,
    type: 'text',
    modelAnswer: `Schritt 1: Prüfbits berechnen (gerade Parität = XOR):
  p0 = d0 ⊕ d1 ⊕ d3 = 1 ⊕ 0 ⊕ 1 = 0
  p1 = d0 ⊕ d2 ⊕ d3 = 1 ⊕ 1 ⊕ 1 = 1
  p2 = d1 ⊕ d2 ⊕ d3 = 0 ⊕ 1 ⊕ 1 = 0

Schritt 2: Bitfolge in offizieller Reihenfolge:
  p0 p1 d0 p2 d1 d2 d3
   0  1  1  0  0  1  1

Hamming-Code: 0110011`,
    explanation: 'XOR = 0 wenn gerade Anzahl Einsen, 1 wenn ungerade (gerade Parität). Reihenfolge p0 p1 d0 p2 d1 d2 d3 ist OFFIZIELL festgelegt!',
    keywords: ['p0', 'p1', 'p2', 'd0', 'd1', 'd2', 'd3', 'XOR', '0110011'],
    source: 'official',
  },
  {
    id: 'cod-02',
    topicId: 'cod',
    difficulty: 1,
    points: 3,
    operator: 'bestimmen',
    question: 'Welche Aussagen zum (7,4)-Hamming-Code sind korrekt (gemäß offizieller Notation)? (Mehrfachauswahl)',
    type: 'mc',
    options: [
      { id: 0, text: 'Die offizielle Bitreihenfolge lautet: p0 p1 d0 p2 d1 d2 d3' },
      { id: 1, text: 'p0 prüft die Datenbits d0, d1 und d2' },
      { id: 2, text: 'p0 prüft die Datenbits d0, d1 und d3' },
      { id: 3, text: 'Der (7,4)-Hamming-Code kann 1-Bit-Fehler korrigieren' },
      { id: 4, text: 'Prüfbits werden durch XOR der Bits in der Kontrollgruppe berechnet' },
    ],
    correctOptions: [0, 2, 3, 4],
    explanation: 'Reihenfolge: p0 p1 d0 p2 d1 d2 d3 ✓. p0 prüft {d0,d1,d3} NICHT d2 ✗. 1-Bit-Fehler korrigierbar ✓. Berechnung durch XOR ✓.',
    source: 'official',
  },

  // ─────────────────────────────────────────────────────────
  // DynArray / Stack / Queue
  // ─────────────────────────────────────────────────────────
  {
    id: 'dyn-01',
    topicId: 'dyn',
    difficulty: 1,
    points: 3,
    operator: 'bestimmen',
    question: 'Welche Aussagen zu Stack und Queue sind korrekt? (Mehrfachauswahl)',
    type: 'mc',
    options: [
      { id: 0, text: 'Stack arbeitet nach dem LIFO-Prinzip (Last In, First Out)' },
      { id: 1, text: 'Queue arbeitet nach dem LIFO-Prinzip' },
      { id: 2, text: 'top() entnimmt das oberste Element des Stacks' },
      { id: 3, text: 'top() liest nur das oberste Element, ohne es zu entfernen' },
      { id: 4, text: 'head() liest nur das vorderste Element der Queue, ohne es zu entfernen' },
      { id: 5, text: 'Vor pop() und top() sollte isEmpty() geprüft werden' },
    ],
    correctOptions: [0, 3, 4, 5],
    explanation: 'Stack=LIFO ✓. Queue=FIFO (First In, First Out) ✗. top() liest NUR, entnimmt nicht ✓. head() liest NUR ✓. isEmpty() immer prüfen ✓.',
    source: 'official',
  },
  {
    id: 'dyn-02',
    topicId: 'dyn',
    difficulty: 2,
    points: 6,
    operator: 'implementieren',
    question: `Implementieren Sie als Struktogramm/Pseudocode:
  stapelUmkehren(original: Stack): Stack
  
Gibt einen neuen Stack zurück, dessen Elemente in umgekehrter Reihenfolge sind.
Hinweis: Nutzen Sie einen Hilfs-Stack.`,
    type: 'text',
    modelAnswer: `stapelUmkehren(original: Stack): Stack
  hilfsStack ← Stack()
  
  // Alle Elemente in Hilfs-Stack verschieben (umkehren)
  solange NICHT original.isEmpty()
    hilfsStack.push(original.pop())
  
  ergebnis ← Stack()
  
  // Wieder umkehren → Original-Reihenfolge in Ergebnis
  solange NICHT hilfsStack.isEmpty()
    ergebnis.push(hilfsStack.pop())
  
  gib ergebnis zurück`,
    explanation: 'Zweimaliges Umfüllen = doppelte Umkehrung = Original-Reihenfolge wiederhergestellt. isEmpty() immer VOR pop() prüfen!',
    keywords: ['Stack', 'isEmpty', 'pop', 'push', 'solange', 'hilfsStack'],
    source: 'derived',
  },

  // ─────────────────────────────────────────────────────────
  // Rekursion
  // ─────────────────────────────────────────────────────────
  {
    id: 'rek-01',
    topicId: 'rek',
    difficulty: 2,
    points: 7,
    operator: 'implementieren',
    question: `Implementieren Sie die folgende Operation rekursiv als Struktogramm/Pseudocode (offizielle BinTree-Operationen!):

  tiefeBerechnen(baum: BinTree): Ganzzahl
  
Gibt die Tiefe (maximale Pfadlänge von Wurzel zu Blatt) des Baums zurück.
Leerer Baum (kein Inhalt): Tiefe = 0, Blatt: Tiefe = 1.`,
    type: 'text',
    modelAnswer: `tiefeBerechnen(baum: BinTree): Ganzzahl
  // Basisfall: Baum ohne Inhalt
  wenn NICHT baum.hasItem() dann
    gib 0 zurück
  
  // Basisfall: Blatt (keine Teilbäume)
  wenn baum.isLeaf() dann
    gib 1 zurück
  
  linkesTiefe ← 0
  rechtesTiefe ← 0
  
  wenn baum.hasLeft() dann
    linkeTiefe ← tiefeBerechnen(baum.getLeft())
  wenn baum.hasRight() dann
    rechteTiefe ← tiefeBerechnen(baum.getRight())
  
  // Maximale Tiefe + 1 für aktuellen Knoten
  wenn linkeTiefe >= rechteTiefe dann
    gib linkeTiefe + 1 zurück
  sonst
    gib rechteTiefe + 1 zurück`,
    explanation: 'Zwei Basisfälle: leer → 0, Blatt → 1. Dann: Maximum beider Teilbäume + 1. hasLeft/hasRight immer vor getLeft/getRight!',
    keywords: ['hasItem', 'isLeaf', 'hasLeft', 'hasRight', 'getLeft', 'getRight', 'gib', 'zurück', 'Maximum'],
    source: 'derived',
  },
  {
    id: 'rek-02',
    topicId: 'rek',
    difficulty: 1,
    points: 4,
    operator: 'analysieren',
    question: `Analysieren Sie den folgenden rekursiven Algorithmus:
  
  f(n: Ganzzahl): Ganzzahl
    wenn n <= 1 dann
      gib 1 zurück
    gib n * f(n - 1) zurück

(1) Was berechnet diese Funktion?
(2) Was ist der Basisfall?
(3) Welchen Wert gibt f(4) zurück?`,
    type: 'text',
    modelAnswer: `(1) Die Funktion berechnet n! (n Fakultät, auch "n Fak" oder Produkt 1·2·3·...·n).

(2) Basisfall: wenn n <= 1, dann gib 1 zurück. (Dies terminiert die Rekursion für n=0 und n=1.)

(3) f(4) = 4 * f(3) = 4 * 3 * f(2) = 4 * 3 * 2 * f(1) = 4 * 3 * 2 * 1 = 24`,
    explanation: 'Klassische Fakultät. Basisfall: n<=1 → 1. Rekursionsschritt: n * f(n-1). Wichtig: jeder Schritt verkleinert n um 1 → Basisfall wird erreicht.',
    keywords: ['Fakultät', 'n!', 'Basisfall', 'n <= 1', '24', 'Rekursion'],
    source: 'derived',
  },

  // ─────────────────────────────────────────────────────────
  // 2D-Reihung
  // ─────────────────────────────────────────────────────────
  {
    id: 'arr2d-01',
    topicId: 'arr2d',
    difficulty: 2,
    points: 6,
    operator: 'implementieren',
    question: `Gegeben ist eine zweidimensionale Reihung "kino" mit 5 Reihen (0–4) und 10 Sitzen (0–9).
Ein Wert von 1 bedeutet "belegt", 0 bedeutet "frei".

Implementieren Sie:
  freiesPlaetzeInReihe(reihe: Ganzzahl): Ganzzahl
  
Gibt die Anzahl freier Plätze in der angegebenen Reihe zurück.`,
    type: 'text',
    modelAnswer: `freiesPlaetzeInReihe(reihe: Ganzzahl): Ganzzahl
  anzahl ← 0
  für j von 0 bis 9
    wenn kino[reihe][j] = 0 dann
      anzahl ← anzahl + 1
  gib anzahl zurück`,
    explanation: 'Index 0-basiert (offiziell!). Iteration über Spalten j = 0 bis 9 (nicht 10!). Zugriff: kino[reihe][j] — erst Zeile, dann Spalte.',
    keywords: ['für j', 'von 0 bis 9', 'kino[reihe][j]', '= 0', 'anzahl', 'gib', 'zurück'],
    source: 'derived',
  },

  // arr2d — neue Aufgaben
  {
    id: 'arr2d-02',
    topicId: 'arr2d',
    difficulty: 1,
    points: 3,
    operator: 'bestimmen',
    question: `Gegeben ist eine 3×4-Reihung (3 Zeilen, 4 Spalten). Welche Aussagen sind korrekt? (Mehrfachauswahl)

  reihung[zeile][spalte]`,
    type: 'mc',
    options: [
      { id: 0, text: 'Der gültige Zeilenindex-Bereich ist 0 bis 2 (einschließlich)' },
      { id: 1, text: 'Der gültige Spaltenindex-Bereich ist 1 bis 4 (einschließlich)' },
      { id: 2, text: 'reihung[2][3] ist ein gültiger Zugriff' },
      { id: 3, text: 'reihung[3][0] ist ein gültiger Zugriff' },
      { id: 4, text: 'Die Gesamtanzahl der Elemente beträgt 12' },
      { id: 5, text: 'Äußere Schleife iteriert Zeilen, innere Schleife Spalten' },
    ],
    correctOptions: [0, 2, 4, 5],
    explanation: 'Zeilen: 0 bis 2 (3 Zeilen). Spalten: 0 bis 3 (nicht 1–4!). reihung[2][3]: Zeile 2, Spalte 3 → gültig. reihung[3][0]: Zeile 3 existiert nicht! 3×4=12 Elemente.',
    source: 'derived',
  },
  {
    id: 'arr2d-03',
    topicId: 'arr2d',
    difficulty: 2,
    points: 6,
    operator: 'implementieren',
    question: `Gegeben ist eine zweidimensionale Reihung "noten" mit 30 Zeilen (Schüler 0–29) und 4 Spalten (Fächer 0–3).
Jeder Wert ist eine Note von 1 bis 6.

Implementieren Sie:
  zaehleSechserProFach(fach: Ganzzahl): Ganzzahl

Gibt zurück: Wie viele Schüler haben in dem angegebenen Fach eine 6?`,
    type: 'text',
    modelAnswer: `zaehleSechserProFach(fach: Ganzzahl): Ganzzahl
  anzahl ← 0
  für i von 0 bis 29
    wenn noten[i][fach] = 6 dann
      anzahl ← anzahl + 1
  gib anzahl zurück`,
    explanation: 'Iteration über alle Zeilen (Schüler), Spalte ist fest (fach). Index 0-basiert. Off-by-one: bis 29, nicht bis 30.',
    keywords: ['für i', 'von 0 bis 29', 'noten[i][fach]', '= 6', 'anzahl', 'gib', 'zurück'],
    source: 'derived',
  },

  // ─────────────────────────────────────────────────────────
  // rek — neue Aufgaben
  // ─────────────────────────────────────────────────────────
  {
    id: 'rek-03',
    topicId: 'rek',
    difficulty: 2,
    points: 5,
    operator: 'analysieren',
    question: `Erstellen Sie eine Tracetabelle für den folgenden rekursiven Aufruf:

  summe(n: Ganzzahl): Ganzzahl
    wenn n = 0 dann
      gib 0 zurück
    gib n + summe(n - 1) zurück

Aufruf: summe(4)

Spalten der Tracetabelle: Aufruf | n | Rückgabewert`,
    type: 'text',
    modelAnswer: `Aufruf          | n | Rückgabewert
─────────────────────────────────
summe(4)        | 4 | 4 + summe(3) = 4 + 6 = 10
  summe(3)      | 3 | 3 + summe(2) = 3 + 3 = 6
    summe(2)    | 2 | 2 + summe(1) = 2 + 1 = 3
      summe(1)  | 1 | 1 + summe(0) = 1 + 0 = 1
        summe(0)| 0 | 0  (Basisfall)

Ergebnis: summe(4) = 10`,
    explanation: 'Basisfall: n=0 → 0. Jede Ebene addiert n zum Ergebnis der nächsten. Abwicklung von innen nach außen: 0 → 1 → 3 → 6 → 10.',
    keywords: ['Basisfall', 'n = 0', '0', '1', '3', '6', '10', 'summe'],
    source: 'derived',
  },
  {
    id: 'rek-04',
    topicId: 'rek',
    difficulty: 1,
    points: 4,
    operator: 'analysieren',
    question: `Analysieren Sie den folgenden Algorithmus und beantworten Sie:
(1) Gibt es einen Basisfall? Wenn ja, welchen?
(2) Ist sichergestellt, dass der Basisfall erreicht wird?
(3) Was gibt countdown(3) aus?

  countdown(n: Ganzzahl)
    wenn n < 0 dann
      gib zurück
    gib n aus
    countdown(n - 1)`,
    type: 'text',
    modelAnswer: `(1) Ja, der Basisfall ist: wenn n < 0, dann beende (gib zurück ohne Ausgabe).

(2) Ja: Jeder rekursive Aufruf verringert n um 1. Damit nähert sich n dem Basisfall n < 0 immer an.

(3) countdown(3) gibt aus: 3, 2, 1, 0
    (Danach: countdown(-1) trifft den Basisfall und gibt zurück)`,
    explanation: 'Ausgabe BEVOR Rekursion → Zahlen absteigend. Basisfall n<0 beendet die Rekursion. Vier Ausgaben: 3, 2, 1, 0.',
    keywords: ['Basisfall', 'n < 0', '3', '2', '1', '0', 'verringert'],
    source: 'derived',
  },

  // ─────────────────────────────────────────────────────────
  // cod — neue Aufgaben
  // ─────────────────────────────────────────────────────────
  {
    id: 'cod-03',
    topicId: 'cod',
    difficulty: 2,
    points: 5,
    operator: 'berechnen',
    question: `Gegeben ist folgender Huffman-Code:
  A = 0
  B = 10
  C = 110
  D = 111

(1) Decodieren Sie die Bitfolge: 0 10 111 0 110 10
(2) Erklären Sie, warum dieser Code eindeutig decodierbar ist (kein Präfix-Problem).`,
    type: 'text',
    modelAnswer: `(1) Decodierung der Bitfolge 0 10 111 0 110 10:
  0 → A
  10 → B
  111 → D
  0 → A
  110 → C
  10 → B
  Ergebnis: A B D A C B

(2) Der Code ist präfixfrei: Kein Code ist der Anfang (Präfix) eines anderen Codes.
  Beispiel: "0" ist weder Anfang von "10" noch von "110" noch von "111".
  "10" ist nicht Anfang von "110" oder "111".
  Da der Huffman-Code immer präfixfrei ist, kann man die Bitfolge von links lesen und
  findet immer eindeutig das kürzeste passende Codewort.`,
    explanation: 'Präfixfreier Code = Huffman-Code ist immer eindeutig decodierbar. Lese von links, bis ein vollständiger Code erkannt wird.',
    keywords: ['A', 'B', 'D', 'A', 'C', 'B', 'präfixfrei', 'Präfix', 'eindeutig'],
    source: 'derived',
  },
  {
    id: 'cod-04',
    topicId: 'cod',
    difficulty: 1,
    points: 3,
    operator: 'bestimmen',
    question: 'Welche Aussagen zur Lauflängencodierung (RLE) und zum Huffman-Code sind korrekt? (Mehrfachauswahl)',
    type: 'mc',
    options: [
      { id: 0, text: 'Lauflängencodierung ist besonders effizient bei Daten mit vielen aufeinanderfolgenden gleichen Zeichen' },
      { id: 1, text: 'Huffman-Code verwendet für alle Zeichen gleich lange Codes' },
      { id: 2, text: 'Huffman-Code ist präfixfrei — kein Code ist Anfang eines anderen' },
      { id: 3, text: '"aaaabbc" wird mit RLE codiert zu: 4a2b1c' },
      { id: 4, text: 'Lauflängencodierung ist bei zufällig gemischten Daten immer effizient' },
    ],
    correctOptions: [0, 2, 3],
    explanation: 'RLE: effizient bei langen Wiederholungen ✓. Huffman: variable Länge (häufige → kurz) ✗. Präfixfrei ✓. "aaaabbc" → 4a2b1c ✓. RLE bei zufälligen Daten ineffizient ✗ (kann sogar größer werden).',
    source: 'derived',
  },

  // ─────────────────────────────────────────────────────────
  // gram — neue Aufgabe
  // ─────────────────────────────────────────────────────────
  {
    id: 'gram-03',
    topicId: 'gram',
    difficulty: 2,
    points: 5,
    operator: 'entwerfen',
    question: `Entwerfen Sie eine reguläre Grammatik G = (N, T, S, P), die genau die Sprache
  L = { w ∈ {a,b}* | w beginnt mit 'a' und endet mit 'b' }
erzeugt (alle Wörter über {a,b}, die mit 'a' beginnen und mit 'b' enden).

Geben Sie N, T, Startsymbol S und alle Produktionsregeln an.`,
    type: 'text',
    modelAnswer: `N = {S, M, E}
T = {a, b}
Startsymbol: S

Produktionsregeln:
  S → aM    (beginnt mit 'a', dann mittlerer Teil)
  S → ab    (kürzester Fall: "ab")
  M → aM    (weitere a's im Mittelteil)
  M → bM    (weitere b's im Mittelteil)
  M → b     (endet mit 'b', Basisfall)

Vereinfacht (2 Nichtterminale):
  S → aA
  A → aA | bA | b

Überprüfung:
  "ab":   S → aA → ab ✓
  "aab":  S → aA → aaA → aab ✓
  "abb":  S → aA → abA → abb ✓`,
    explanation: 'Rechtslineare Grammatik: Nichtterminal immer rechts (A→aB oder A→a). S startet mit a. A erlaubt beliebige a,b im Mittelteil, endet mit b.',
    keywords: ['S', 'aA', 'aA | bA | b', 'rechtslinear', 'beginnt', 'endet'],
    source: 'derived',
  },

  // ─────────────────────────────────────────────────────────
  // dyn — neue Aufgabe
  // ─────────────────────────────────────────────────────────
  {
    id: 'dyn-03',
    topicId: 'dyn',
    difficulty: 2,
    points: 5,
    operator: 'analysieren',
    question: `Analysieren Sie den folgenden Algorithmus auf Korrektheit. Benennen Sie alle Fehler und korrigieren Sie sie.

  gibMaximum(liste: DynArray): Ganzzahl
    max ← liste.getItem(0)
    für i von 1 bis liste.getLength()     // Zeile 3
      wenn liste.getItem(i) > max dann
        max ← liste.getItem(i)
    gib max zurück`,
    type: 'text',
    modelAnswer: `Fehler 1 (Zeile 3): Schleife bis getLength() — Off-by-One!
  getLength() gibt z.B. 5 zurück, aber letzter Index ist 4.
  Korrekt: für i von 1 bis liste.getLength() - 1

Fehler 2: Kein isEmpty()-Check vor getItem(0).
  Wenn die Liste leer ist, führt getItem(0) zu einem Laufzeitfehler.
  Korrekt: Zuerst prüfen ob liste.isEmpty()

Korrigierter Algorithmus:
  gibMaximum(liste: DynArray): Ganzzahl
    wenn liste.isEmpty() dann
      // Fehlerbehandlung: Liste leer
      gib zurück
    max ← liste.getItem(0)
    für i von 1 bis liste.getLength() - 1
      wenn liste.getItem(i) > max dann
        max ← liste.getItem(i)
    gib max zurück`,
    explanation: 'Zwei klassische DynArray-Fehler: Off-by-one (bis Length statt Length-1) und fehlende isEmpty()-Prüfung vor erstem Zugriff.',
    keywords: ['Off-by-one', 'getLength() - 1', 'isEmpty', 'Laufzeitfehler', 'korrekt'],
    source: 'derived',
  },
];

export const getExercisesByTopic = (topicId: string): Exercise[] =>
  EXERCISES.filter((e) => e.topicId === topicId);

export const getExerciseById = (id: string): Exercise | undefined =>
  EXERCISES.find((e) => e.id === id);

export const getAllTopicIds = (): string[] =>
  [...new Set(EXERCISES.map((e) => e.topicId))];
