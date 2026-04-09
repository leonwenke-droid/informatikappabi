import { useState } from 'react';
import { PageHeader } from '../../components/layout/Layout';
import { SectionCard, AlertBox } from '../../components/ui/Card';
import { CodeBlock } from '../../components/ui/CodeBlock';
import { TabBar } from '../../components/ui/TabBar';
import { OFFICIAL_SQL_SCOPE } from '../../data/officialConstraints';

export function SQLReference() {
  const [activeTab, setActiveTab] = useState('syntax');

  return (
    <div>
      <PageHeader
        title="SQL & Datenbanken"
        subtitle="Offizieller SQL-Umfang für Abitur Niedersachsen 2026 (Anlage zu 18_InformatikHinweise2026)"
      />

      <TabBar
        tabs={[
          { id: 'syntax', label: 'SQL-Syntax', icon: '🗄' },
          { id: 'er', label: 'ER-Diagramme', icon: '📊' },
          { id: 'anomalien', label: 'Anomalien', icon: '⚠️' },
          { id: 'beispiele', label: 'Beispiele', icon: '💡' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="mb-6"
      />

      {activeTab === 'syntax' && (
        <div className="space-y-5">
          <SectionCard title="Vollständige SQL SELECT-Syntax (offiziell)">
            <CodeBlock lang="sql" title="SELECT-Anweisung (offizieller Umfang 2026)">
              {OFFICIAL_SQL_SCOPE}
            </CodeBlock>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-[12px] font-bold text-blue-400 mb-2">Aggregatfunktionen</div>
                {['AVG(col) — Durchschnitt', 'COUNT(*) — alle Zeilen', 'COUNT(col) — nicht-NULL', 'MAX(col) — Maximum', 'MIN(col) — Minimum', 'SUM(col) — Summe'].map((t, i) => (
                  <div key={i} className="font-mono text-[12px] text-slate-400 mb-1">{t}</div>
                ))}
              </div>
              <div>
                <div className="text-[12px] font-bold text-blue-400 mb-2">Vergleichsoperatoren</div>
                {['= gleich', '!= ungleich', '>, <, >=, <=', "LIKE (% = beliebig viel, _ = 1 Zeichen)", 'BETWEEN a AND b', 'IN (val1, val2, ...)', 'IS NULL / IS NOT NULL', 'NOT', 'AND, OR'].map((t, i) => (
                  <div key={i} className="font-mono text-[12px] text-slate-400 mb-1">{t}</div>
                ))}
              </div>
              <div>
                <div className="text-[12px] font-bold text-blue-400 mb-2">Berechnungsoperatoren</div>
                {['+, -, *, /'].map((t, i) => (
                  <div key={i} className="font-mono text-[12px] text-slate-400 mb-1">{t}</div>
                ))}
                <div className="text-[12px] font-bold text-red-400 mt-3 mb-2">❌ Nicht erlaubt</div>
                <div className="font-mono text-[12px] text-red-400">Verschachtelte SELECTs!</div>
                <div className="text-[11px] text-slate-600 mt-1">Offiziell ausgeschlossen (Hinweise 2021, §3)</div>
              </div>
            </div>
          </SectionCard>

          <AlertBox variant="warning" title="⚠️ Häufige SQL-Fehler in Klausuren">
            <div className="space-y-2">
              {[
                { error: 'HAVING statt WHERE', detail: 'Aggregatbedingungen (SUM > 100, COUNT >= 3) MÜSSEN in HAVING, nicht WHERE!' },
                { error: 'JOIN-Bedingung fehlt', detail: 'Bei mehreren Tabellen in FROM: Verbindung über WHERE tab1.key = tab2.fremdkey ist PFLICHT. Fehlt sie → kartesisches Produkt!' },
                { error: 'GROUP BY unvollständig', detail: 'Alle SELECT-Spalten ohne Aggregatfunktion MÜSSEN in GROUP BY stehen.' },
                { error: 'Alias in WHERE nutzen', detail: 'Ein in SELECT definierter Alias kann in WHERE NICHT verwendet werden (erst in HAVING und ORDER BY).' },
              ].map((item, i) => (
                <div key={i} className="bg-black/20 rounded-lg p-2.5">
                  <div className="text-[13px] font-bold text-amber-300 mb-0.5">{item.error}</div>
                  <div className="text-[12px] text-amber-200/70">{item.detail}</div>
                </div>
              ))}
            </div>
          </AlertBox>
        </div>
      )}

      {activeTab === 'er' && (
        <div className="space-y-5">
          <SectionCard title="ER-Diagramm Notation (offiziell, Ergänzende Hinweise 2021, §9)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <div className="text-[13px] font-bold text-blue-400 mb-3">ER-Komponenten</div>
                <div className="space-y-2">
                  {[
                    { symbol: '☐', label: 'Entitätstyp', desc: 'Rechteck — Ding der realen Welt' },
                    { symbol: '◇', label: 'Beziehungstyp', desc: 'Raute — Verbindung zwischen Entitäten' },
                    { symbol: '○', label: 'Attribut', desc: 'Ellipse — Eigenschaft eines Entitäts- oder Beziehungstyps' },
                    { symbol: '○̲', label: 'Schlüsselattribut', desc: 'Unterstrichen — eindeutige Identifikation (OBLIGATORISCH!)' },
                    { symbol: '1:n', label: 'Kardinalitäten', desc: '1:1, 1:n, n:m — an Kanten (OBLIGATORISCH!)' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white/[0.02] rounded-lg p-2.5">
                      <span className="text-[18px] w-7 text-center flex-shrink-0">{item.symbol}</span>
                      <div>
                        <div className="text-[12.5px] font-bold text-slate-200">{item.label}</div>
                        <div className="text-[11.5px] text-slate-500">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[13px] font-bold text-blue-400 mb-3">Relationales Schema (Kurzschreibweise)</div>
                <CodeBlock>
{`Tabelle(PrimärSchlüssel, Attribut, ↑FremdSchlüssel)

Beispiel:
Produkt(Nummer, Bezeichnung, Anzahl, ↑LKuerzel)
Lieferant(Kuerzel, Firmenname, Ort)

Primärschlüssel: unterstrichen
Fremdschlüssel: ↑ vorangestellt`}
                </CodeBlock>
                <div className="mt-3 text-[12px] text-slate-500">
                  Quelle: Ergänzende Hinweise 2021, §9
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === 'anomalien' && (
        <div className="space-y-4">
          {[
            {
              name: 'Einfügeanomalie',
              color: 'red',
              def: 'Ein neuer Datensatz kann nicht eingefügt werden, ohne andere (ggf. unbekannte) Daten gleichzeitig angeben zu müssen.',
              example: 'In Tabelle Bestellung(BNr, KundenName, KundenOrt, Betrag) kann keine neue Bestellung angelegt werden, solange der Kundenname nicht bekannt ist — obwohl man ihn noch nicht kennt.',
              solution: 'Normalisierung: Kundendaten in separate Tabelle Kunde auslagern, Fremdschlüssel nutzen.',
            },
            {
              name: 'Änderungsanomalie',
              color: 'amber',
              def: 'Redundante Daten müssen an mehreren Stellen gleichzeitig geändert werden. Fehlt eine Stelle, entstehen Inkonsistenzen.',
              example: 'KundenOrt "München" steht in 50 Bestellzeilen. Zieht der Kunde um, müssen alle 50 Zeilen aktualisiert werden.',
              solution: 'Normalisierung: Ortsdaten einmalig in Kundentabelle halten.',
            },
            {
              name: 'Löschanomalie',
              color: 'red',
              def: 'Das Löschen eines Datensatzes vernichtet unbeabsichtigt andere, noch benötigte Informationen.',
              example: 'Löscht man die letzte Bestellung eines Kunden, gehen alle Kundendaten (Name, Adresse) mit verloren.',
              solution: 'Normalisierung: Kundendaten unabhängig von Bestellungen speichern.',
            },
          ].map((item) => (
            <div key={item.name} className={`border border-${item.color}-500/25 bg-${item.color}-500/[0.05] rounded-xl p-5`}>
              <h3 className={`text-[15px] font-bold text-${item.color}-400 mb-2`}>{item.name}</h3>
              <div className="space-y-2">
                <div><span className="text-[12px] text-slate-400 font-bold">Definition: </span><span className="text-[13px] text-slate-200">{item.def}</span></div>
                <div><span className="text-[12px] text-slate-400 font-bold">Beispiel: </span><span className="text-[13px] text-slate-300">{item.example}</span></div>
                <div><span className="text-[12px] text-emerald-400 font-bold">Lösung: </span><span className="text-[13px] text-emerald-200/80">{item.solution}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'beispiele' && (
        <div className="space-y-5">
          {[
            {
              title: 'Einfacher JOIN + Aggregat',
              desc: 'Alle Kunden aus Hamburg mit Gesamtbestellwert > 500, absteigend sortiert',
              sql: `SELECT Kunde.Name, SUM(Bestellung.Betrag) AS Gesamtwert
FROM Kunde, Bestellung
WHERE Kunde.KNr = Bestellung.KNr
  AND Kunde.Ort = 'Hamburg'
GROUP BY Kunde.KNr, Kunde.Name
HAVING SUM(Bestellung.Betrag) > 500
ORDER BY Gesamtwert DESC`,
            },
            {
              title: 'LIKE + DISTINCT',
              desc: 'Alle verschiedenen Orte von Kunden, deren Name mit M beginnt',
              sql: `SELECT DISTINCT Ort
FROM Kunde
WHERE Name LIKE 'M%'
ORDER BY Ort ASC`,
            },
            {
              title: 'Drei-Tabellen-JOIN',
              desc: 'Bestellpositionen mit Produktname und Kundenname',
              sql: `SELECT Kunde.Name, Produkt.Bezeichnung, Position.Anzahl
FROM Kunde, Bestellung, Position, Produkt
WHERE Kunde.KNr = Bestellung.KNr
  AND Bestellung.BNr = Position.BNr
  AND Position.PNr = Produkt.PNr
ORDER BY Kunde.Name ASC`,
            },
            {
              title: 'COUNT + HAVING',
              desc: 'Kunden mit mindestens 3 Bestellungen',
              sql: `SELECT Kunde.Name, COUNT(Bestellung.BNr) AS Anzahl
FROM Kunde, Bestellung
WHERE Kunde.KNr = Bestellung.KNr
GROUP BY Kunde.KNr, Kunde.Name
HAVING COUNT(Bestellung.BNr) >= 3
ORDER BY Anzahl DESC`,
            },
          ].map((ex) => (
            <SectionCard key={ex.title} title={ex.title} subtitle={ex.desc}>
              <CodeBlock lang="sql">{ex.sql}</CodeBlock>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
}
