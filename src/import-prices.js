/**
 * PUT AGENT — Importador de CSV histórico
 *
 * Formato esperado (Investing.com):
 *   "Data","Último","Abertura","Máxima","Mínima","Vol.","Var%"
 *   "10.04.2026","193,84","192,55","193,95","192,22","6,60M","1,12%"
 *
 * Uso:
 *   node src/import-prices.js <TICKER> <arquivo.csv>
 *
 * Exemplo:
 *   node src/import-prices.js BOVA11 data/bova11.csv
 */

import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, '..', 'put-agent.db');

// ─── Argumentos ──────────────────────────────────────────────────────────────
const [, , TICKER, CSV_PATH] = process.argv;

if (!TICKER || !CSV_PATH) {
    console.error('Uso: node src/import-prices.js <TICKER> <arquivo.csv>');
    console.error('Ex:  node src/import-prices.js BOVA11 data/bova11.csv');
    process.exit(1);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Remove aspas duplas: '"193,84"' → '193,84' */
function unquote(str) {
    return str ? str.trim().replace(/^"|"$/g, '') : '';
}

/** "10.04.2026" ou "10/04/2026" → "2026-04-10" */
function parseDate(str) {
    const clean = unquote(str);
    const [d, m, y] = clean.split(/[\/\.]/);
    if (!d || !m || !y) return null;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

/** "192,55" → 192.55 */
function parseNumber(str) {
    const clean = unquote(str);
    if (!clean || clean === '-') return null;
    return parseFloat(clean.replace(/\./g, '').replace(',', '.'));
}

/** "6,60M" → 6600000 | "500K" → 500000 | "-" → null */
function parseVolume(str) {
    const clean = unquote(str);
    if (!clean || clean === '-') return null;
    const s = clean.replace(',', '.');
    const multipliers = { K: 1e3, M: 1e6, B: 1e9 };
    const suffix = s.slice(-1).toUpperCase();
    if (multipliers[suffix]) {
        return parseFloat(s.slice(0, -1)) * multipliers[suffix];
    }
    return parseFloat(s);
}

// ─── Detectar separador ───────────────────────────────────────────────────────
function detectSeparator(firstLine) {
    if (firstLine.includes('\t')) return '\t';
    if (firstLine.includes(';')) return ';';
    return ',';
}

// ─── Split respeitando aspas: "a,b","c" → ['a,b', 'c'] ──────────────────────
function splitCSVLine(line, sep) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            inQuotes = !inQuotes;
        } else if (ch === sep && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += ch;
        }
    }
    result.push(current);
    return result;
}

// ─── Parsing do CSV ───────────────────────────────────────────────────────────
function parseCSV(filePath) {
    const raw = readFileSync(resolve(filePath), 'utf-8');
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    const sep = detectSeparator(lines[0]);
    const headers = splitCSVLine(lines[0], sep).map(h => unquote(h).toLowerCase());

    console.log(`\n📄 Arquivo: ${filePath}`);
    console.log(`🔍 Separador: ${sep === '\t' ? 'TAB' : `"${sep}"`}`);
    console.log(`📋 Colunas:   ${headers.join(' | ')}`);

    // Mapear índices de forma flexível (funciona com PT e EN)
    const idx = {
        date: headers.findIndex(h => h.includes('data') || h === 'date'),
        close: headers.findIndex(h => h.includes('ltimo') || h === 'close' || h === 'fechamento' || h === 'price'),
        open: headers.findIndex(h => h.includes('abertura') || h === 'open'),
        high: headers.findIndex(h => h.includes('xima') || h === 'high'),
        low: headers.findIndex(h => h.includes('nima') || h === 'low'),
        vol: headers.findIndex(h => h.includes('vol')),
    };

    console.log(`🗂️  Mapeamento: date[${idx.date}] open[${idx.open}] high[${idx.high}] low[${idx.low}] close[${idx.close}] vol[${idx.vol}]`);

    const required = ['date', 'close', 'open', 'high', 'low'];
    for (const col of required) {
        if (idx[col] === -1) {
            console.error(`\n❌ Coluna obrigatória não encontrada: "${col}"`);
            console.error(`   Colunas disponíveis: ${headers.join(', ')}`);
            process.exit(1);
        }
    }

    const rows = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
        const cols = splitCSVLine(lines[i], sep);

        const date = parseDate(cols[idx.date]);
        const close = parseNumber(cols[idx.close]);
        const open = parseNumber(cols[idx.open]);
        const high = parseNumber(cols[idx.high]);
        const low = parseNumber(cols[idx.low]);
        const vol = idx.vol >= 0 ? parseVolume(cols[idx.vol]) : null;

        if (!date || close === null || open === null || high === null || low === null) {
            errors.push(`Linha ${i + 1}: dados inválidos → ${lines[i]}`);
            continue;
        }

        rows.push({ date, open, high, low, close, volume: vol });
    }

    return { rows, errors };
}

// ─── Inserção no banco ────────────────────────────────────────────────────────
function importToDb(ticker, rows) {
    const db = new Database(DB_PATH);

    const assetExists = db.prepare('SELECT ticker FROM assets WHERE ticker = ?').get(ticker);
    if (!assetExists) {
        console.log(`⚠️  Ticker ${ticker} não encontrado em assets. Inserindo como 'stock'...`);
        db.prepare(`INSERT OR IGNORE INTO assets (ticker, name, type) VALUES (?, ?, 'stock')`).run(ticker, ticker);
    }

    const existing = new Set(
        db.prepare('SELECT date FROM prices WHERE ticker = ?').all(ticker).map(r => r.date)
    );

    const insert = db.prepare(`
    INSERT INTO prices (ticker, date, open, high, low, close, volume)
    VALUES (@ticker, @date, @open, @high, @low, @close, @volume)
    ON CONFLICT(ticker, date) DO UPDATE SET
      open   = excluded.open,
      high   = excluded.high,
      low    = excluded.low,
      close  = excluded.close,
      volume = excluded.volume
  `);

    let inserted = 0;
    let updated = 0;

    db.transaction((rows) => {
        for (const row of rows) {
            insert.run({ ticker, ...row });
            if (existing.has(row.date)) updated++;
            else inserted++;
        }
    })(rows);

    const total = db.prepare('SELECT COUNT(*) as n FROM prices WHERE ticker = ?').get(ticker).n;
    db.close();
    return { inserted, updated, total };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log(`\n🚀 Importando ${TICKER}...`);

const { rows, errors } = parseCSV(CSV_PATH);

if (errors.length > 0) {
    console.warn(`\n⚠️  ${errors.length} linha(s) ignorada(s):`);
    errors.slice(0, 5).forEach(e => console.warn(`   ${e}`));
    if (errors.length > 5) console.warn(`   ... e mais ${errors.length - 5}`);
}

if (rows.length === 0) {
    console.error('\n❌ Nenhuma linha válida encontrada. Verifique o formato do arquivo.');
    process.exit(1);
}

console.log(`\n✅ ${rows.length} linhas parseadas`);
console.log(`   Período: ${rows.at(-1).date} → ${rows[0].date}`);

const { inserted, updated, total } = importToDb(TICKER, rows);

console.log(`\n📊 Resultado:`);
console.log(`   Inseridas:   ${inserted}`);
console.log(`   Atualizadas: ${updated}`);
console.log(`   Total no banco (${TICKER}): ${total}\n`);