import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, '..', 'put-agent.db');

export function retornaHistorico(ticker, dias) {

    const db = new Database(DB_PATH);

    const candles = db.prepare(`
    SELECT date, open, high, low, close, volume
    FROM prices
    WHERE ticker = ?
    ORDER BY date DESC
    LIMIT ?
    `).all(ticker, dias);

    db.close();

    const currentPrice = candles[0].close;
    console.log(`Candles carregados: ${candles.length} (${candles[candles.length - 1].date} -> ${candles[0].date})`);
    console.log(`Preco atual: R$ ${currentPrice.toFixed(2)}`);

    return candles;
}