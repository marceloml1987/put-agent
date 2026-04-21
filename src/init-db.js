/**
 * PUT AGENT — Database Initialization
 *
 * Stack: Node.js (ESM) + better-sqlite3
 *
 * Instalação:
 *   npm install better-sqlite3
 *
 * Uso:
 *   node src/init-db.js
 *
 * Cria o arquivo put-agent.db na raiz do projeto.
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, '..', 'put-agent.db'); // raiz do projeto
const db = new Database(DB_PATH, { verbose: console.log });

// ─── Configurações de performance ────────────────────────────────────────────
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('synchronous = NORMAL');

// ─── Criação das tabelas ──────────────────────────────────────────────────────
db.exec(`

  -- ─────────────────────────────────────────────
  -- ATIVOS RASTREADOS
  -- ─────────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS assets (
    ticker        TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    type          TEXT NOT NULL CHECK(type IN ('stock', 'etf', 'bdr', 'index')),
    sector        TEXT,
    active        INTEGER NOT NULL DEFAULT 1,
    created_at    TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  );


  -- ─────────────────────────────────────────────
  -- PREÇOS HISTÓRICOS (OHLCV)
  -- ─────────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS prices (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    ticker        TEXT NOT NULL REFERENCES assets(ticker),
    date          TEXT NOT NULL,
    open          REAL NOT NULL,
    high          REAL NOT NULL,
    low           REAL NOT NULL,
    close         REAL NOT NULL,
    volume        REAL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    UNIQUE(ticker, date)
  );

  CREATE INDEX IF NOT EXISTS idx_prices_ticker_date ON prices(ticker, date DESC);


  -- ─────────────────────────────────────────────
  -- CADEIA DE OPÇÕES (snapshots diários)
  -- ─────────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS options_chain (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    underlying     TEXT NOT NULL REFERENCES assets(ticker),
    series         TEXT NOT NULL,
    option_type    TEXT NOT NULL CHECK(option_type IN ('PUT', 'CALL')),
    strike         REAL NOT NULL,
    expiry         TEXT NOT NULL,
    days_to_expiry INTEGER,
    iv             REAL,
    hv             REAL,
    iv_hv_ratio    REAL,
    delta          REAL,
    theta          REAL,
    gamma          REAL,
    vega           REAL,
    premium        REAL,
    bid            REAL,
    ask            REAL,
    open_interest  INTEGER,
    volume         INTEGER,
    snapshot_date  TEXT NOT NULL,
    created_at     TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    UNIQUE(series, snapshot_date)
  );

  CREATE INDEX IF NOT EXISTS idx_options_underlying ON options_chain(underlying, snapshot_date DESC);
  CREATE INDEX IF NOT EXISTS idx_options_expiry     ON options_chain(expiry);
  CREATE INDEX IF NOT EXISTS idx_options_delta      ON options_chain(delta);


  -- ─────────────────────────────────────────────
  -- OPERAÇÕES (trades)
  -- ─────────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS trades (
    id                       INTEGER PRIMARY KEY AUTOINCREMENT,
    underlying               TEXT NOT NULL REFERENCES assets(ticker),
    series                   TEXT NOT NULL,
    option_type              TEXT NOT NULL CHECK(option_type IN ('PUT', 'CALL')),
    strike                   REAL NOT NULL,
    expiry                   TEXT NOT NULL,

    entry_date               TEXT NOT NULL,
    entry_premium            REAL NOT NULL,
    entry_delta              REAL,
    entry_iv                 REAL,
    entry_hv                 REAL,
    entry_underlying_price   REAL,
    contracts                INTEGER NOT NULL DEFAULT 1,

    exit_date                TEXT,
    exit_premium             REAL,
    exit_reason              TEXT CHECK(exit_reason IN (
                               'expiry_worthless',
                               'buyback_profit',
                               'buyback_loss',
                               'assignment',
                               'roll'
                             )),

    result                   REAL,
    result_pct               REAL,
    status                   TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'closed', 'rolled')),

    technical_context        TEXT,
    strategy_tag             TEXT,
    notes                    TEXT,
    created_at               TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    updated_at               TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  );

  CREATE INDEX IF NOT EXISTS idx_trades_status     ON trades(status);
  CREATE INDEX IF NOT EXISTS idx_trades_underlying ON trades(underlying);
  CREATE INDEX IF NOT EXISTS idx_trades_expiry     ON trades(expiry);


  -- ─────────────────────────────────────────────
  -- ZONAS DE SUPORTE
  -- ─────────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS support_zones (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    ticker            TEXT NOT NULL REFERENCES assets(ticker),
    price_floor       REAL NOT NULL,
    price_ceiling     REAL NOT NULL,
    touches           INTEGER NOT NULL DEFAULT 1,
    last_touch_date   TEXT,
    strength_score    REAL,
    broken            INTEGER DEFAULT 0,
    broken_date       TEXT,
    detection_method  TEXT,
    created_at        TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    updated_at        TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  );

  CREATE INDEX IF NOT EXISTS idx_support_ticker ON support_zones(ticker);


  -- ─────────────────────────────────────────────
  -- RESULTADOS DO SCANNER
  -- ─────────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS scanner_results (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    run_date          TEXT NOT NULL,
    underlying        TEXT NOT NULL REFERENCES assets(ticker),
    series            TEXT,
    iv_hv_ratio       REAL,
    best_strike       REAL,
    delta             REAL,
    theta             REAL,
    days_to_expiry    INTEGER,
    technical_flag    TEXT CHECK(technical_flag IN (
                        'testing_support',
                        'above_support',
                        'just_broke_support',
                        'stabilizing',
                        'no_support_data'
                      )),
    score             REAL,
    recommended       INTEGER DEFAULT 0,
    raw_data          TEXT,
    created_at        TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  );

  CREATE INDEX IF NOT EXISTS idx_scanner_date        ON scanner_results(run_date DESC);
  CREATE INDEX IF NOT EXISTS idx_scanner_recommended ON scanner_results(recommended, run_date DESC);


  -- ─────────────────────────────────────────────
  -- ANÁLISES DA IA
  -- ─────────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS ai_analyses (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    ticker            TEXT NOT NULL REFERENCES assets(ticker),
    analysis_date     TEXT NOT NULL,
    model             TEXT,
    prompt_context    TEXT,
    verdict           TEXT,
    trend             TEXT,
    suggested_strike  REAL,
    estimated_premium REAL,
    full_response     TEXT,
    created_at        TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  );

  CREATE INDEX IF NOT EXISTS idx_ai_analyses_ticker ON ai_analyses(ticker, analysis_date DESC);


  -- ─────────────────────────────────────────────
  -- CONFIGURAÇÕES DO USUÁRIO
  -- ─────────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS settings (
    key         TEXT PRIMARY KEY,
    value       TEXT NOT NULL,
    description TEXT,
    updated_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  );

`);

// ─── Dados iniciais ───────────────────────────────────────────────────────────

const defaultAssets = [
    { ticker: 'BOVA11', name: 'iShares Ibovespa ETF', type: 'etf' },
    { ticker: 'PETR4', name: 'Petrobras PN', type: 'stock' },
    { ticker: 'VALE3', name: 'Vale ON', type: 'stock' },
    { ticker: 'ITUB4', name: 'Itaú Unibanco PN', type: 'stock' },
    { ticker: 'BBDC4', name: 'Bradesco PN', type: 'stock' },
    { ticker: 'BBAS3', name: 'Banco do Brasil ON', type: 'stock' },
    { ticker: 'ABEV3', name: 'Ambev ON', type: 'stock' },
    { ticker: 'WEGE3', name: 'WEG ON', type: 'stock' },
    { ticker: 'RENT3', name: 'Localiza ON', type: 'stock' },
    { ticker: 'MGLU3', name: 'Magazine Luiza ON', type: 'stock' },
];

const insertAsset = db.prepare(`
  INSERT OR IGNORE INTO assets (ticker, name, type)
  VALUES (@ticker, @name, @type)
`);

db.transaction((assets) => {
    for (const asset of assets) insertAsset.run(asset);
})(defaultAssets);

const defaultSettings = [
    {
        key: 'scanner_filters',
        value: JSON.stringify({
            min_iv_hv_ratio: 1.10,
            delta_min: 0.20,
            delta_max: 0.30,
            min_open_interest: 100,
            min_days_to_expiry: 15,
            max_days_to_expiry: 60,
        }),
        description: 'Filtros principais do scanner de opções'
    },
    {
        key: 'support_detection',
        value: JSON.stringify({
            swing_low_lookback: 5,
            cluster_tolerance_pct: 0.02,
            min_touches: 2,
            lookback_days: 252,
        }),
        description: 'Parâmetros de detecção de zonas de suporte'
    },
    {
        key: 'risk_params',
        value: JSON.stringify({
            max_delta_alert: 0.40,
            profit_target_pct: 0.50,
            hv_lookback_days: 30,
        }),
        description: 'Parâmetros de gerenciamento de risco'
    },
    {
        key: 'selic_rate',
        value: JSON.stringify({ rate: 0.1350 }),
        description: 'Taxa Selic anual — atualizar conforme decisões do Copom'
    },
];

const insertSetting = db.prepare(`
  INSERT OR IGNORE INTO settings (key, value, description)
  VALUES (@key, @value, @description)
`);

db.transaction((settings) => {
    for (const s of settings) insertSetting.run(s);
})(defaultSettings);

// ─── Verificação final ────────────────────────────────────────────────────────
const tables = db
    .prepare(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`)
    .all()
    .map(r => r.name);

const assetCount = db.prepare('SELECT COUNT(*) as n FROM assets').get().n;
const settingCount = db.prepare('SELECT COUNT(*) as n FROM settings').get().n;

console.log('\n✅ Banco inicializado com sucesso!');
console.log(`📁 Arquivo: ${DB_PATH}`);
console.log(`📋 Tabelas: ${tables.join(', ')}`);
console.log(`📈 Ativos pré-carregados: ${assetCount}`);
console.log(`⚙️  Configurações padrão: ${settingCount}`);
console.log('\nPróximos passos:');
console.log('  1. Importar OHLC histórico → tabela prices');
console.log('  2. Conectar feed de opções → tabela options_chain');
console.log('  3. Rodar primeiro scan     → tabela scanner_results\n');

db.close();