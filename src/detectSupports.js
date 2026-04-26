/**
 * PUT AGENT -- Deteccao de Zonas de Suporte
 *
 * Le OHLC da tabela prices e preenche support_zones.
 * Algoritmo: swing lows -> clustering -> filtro de distancia -> score de forca
 *
 * Uso:
 *   node src/detect-supports.js <TICKER> [opcoes]
 *
 * Exemplos:
 *   node src/detect-supports.js BOVA11
 *   node src/detect-supports.js BOVA11 --lookback=90 --max-distance=0.12
 *   node src/detect-supports.js PETR4 --debug
 */
export default recuperaSuportesResistencias;

/* function getArg(name, defaultVal) {
    const found = args.find(a => a.startsWith(`--${name}=`));
    return found ? parseFloat(found.split('=')[1]) : defaultVal;
}

const PARAMS = {
    lookback_days: getArg('lookback', 90),       // janela de historico
    swing_lookback: getArg('swing', 5),           // N candles cada lado p/ swing low
    cluster_tolerance_pct: getArg('tolerance', 0.50),   // tolerancia p/ agrupar minimas
    min_touches: getArg('min-touches', 1),     // minimo de toques por zona
    max_distance_pct: getArg('max-distance', 0.15), // ignora zonas > X% abaixo do preco
    recency_weight: 0.4,
    touches_weight: 0.6,
}; */

// --- Carregar parametros do banco (se existirem) -----------------------------
function loadParamsFromDB(db) {
    try {
        const row = db.prepare(`SELECT value FROM settings WHERE key = 'support_detection'`).get();
        if (row) {
            const saved = JSON.parse(row.value);
            if (saved.swing_low_lookback) PARAMS.swing_lookback = saved.swing_low_lookback;
            if (saved.cluster_tolerance_pct) PARAMS.cluster_tolerance_pct = saved.cluster_tolerance_pct;
            if (saved.min_touches) PARAMS.min_touches = saved.min_touches;
            if (saved.lookback_days) PARAMS.lookback_days = saved.lookback_days;
            if (saved.max_distance_pct) PARAMS.max_distance_pct = saved.max_distance_pct;
        }
    } catch (_) { /* usa defaults */ }
}

// --- Algoritmo ---------------------------------------------------------------

window.implementaDBSCAN = implementaDBSCAN;

async function implementaDBSCAN() {

    const resp = await fetch(
        '/api/ohlc/BOVA11/90'
    );

    const candles = await resp.json();
    const clusters = recuperaSuportesResistencias(candles, 0.5);
    console.log(clusters);
    //const clustersNormalizados = deduplicarClustersIterativo(clusters, 0.5);

    //const clusterMedianasSuporte = criaClusterMedianas(clustersNormalizados);

}
/**
 * PASSO 1 - Swing lows
 * Candle e swing low se sua minima for menor que os N candles de cada lado.
 */

function recuperaSuportesResistencias(candles, percentualDistancia) {

    const percentualDistanciaDecimal = percentualDistancia / 100;

    let candlesOrdenadosHigh = [...candles]
        .sort((a, b) => b.high - a.high);

    let candlesOrdenadosLow = [...candles]
        .sort((a, b) => b.low - a.low);

    /*     const zonas = [];
        for (let s of candlesOrdenadosLow) {
            for (let r of candlesOrdenadosHigh) {
    
                const distancia = Math.abs(s.low - r.high) / s.low;
    
                if (distancia < 0.005) { // 0.5%
                    zonas.push({
                        preco: (s.low + r.high) / 2,
                        tipo: "confluencia",
                        date: s.date
                    });
                }
            }
        } */

    //Clusterizando os topos
    let clustersTopo = [];

    for (let i = 0; i < candlesOrdenadosHigh.length; i++) {

        const high = candlesOrdenadosHigh[i].high;

        const min = high * (1 - percentualDistancia / 100);
        const max = high * (1 + percentualDistancia / 100);

        const clusterTop = [
            candlesOrdenadosHigh[i].high
        ];

        for (let j = i + 1; j < candlesOrdenadosHigh.length; j++) {

            const h = candlesOrdenadosHigh[j].high;

            const distancia = Math.abs(high - h) / ((high + h) / 2);

            //if (l >= min && l <= max) {
            if (distancia <= percentualDistanciaDecimal) {

                clusterTop.push(h);

            } else {

                break;

            }

        }

        if (clusterTop.length > 3) {
            const medianaClusterHigh = recuperaMedianaClusters(clusterTop);


            if (clustersTopo.length > 0) {
                clustersTopo = comparaMedianaAtualComCluster(clustersTopo, medianaClusterHigh, percentualDistancia);
            } else {
                clustersTopo.push(medianaClusterHigh);
            }

        }

    }

    //Clusterizando os fundos
    let clustersFundo = [];

    for (let i = 0; i < candlesOrdenadosLow.length; i++) {

        const low = candlesOrdenadosLow[i].low;

        const min = low * (1 - percentualDistancia / 100);
        const max = low * (1 + percentualDistancia / 100);

        const clusterFundo = [
            candlesOrdenadosLow[i].low
        ];

        for (let j = i + 1; j < candlesOrdenadosLow.length; j++) {

            const l = candlesOrdenadosLow[j].low;

            const distancia = Math.abs(low - l) / ((low + l) / 2);

            //if (l >= min && l <= max) {
            if (distancia <= percentualDistanciaDecimal) {

                clusterFundo.push(l);

            } else {

                break;

            }

        }

        if (clusterFundo.length > 3) {
            const medianaClusterLow = recuperaMedianaClusters(clusterFundo);


            if (clustersTopo.length > 0) {
                clustersFundo = comparaMedianaAtualComCluster(clustersFundo, medianaClusterLow, percentualDistancia);
            } else {
                clustersFundo.push(medianaClusterLow);
            }

        }

    }

    return {
        "topos": clustersTopo,
        "fundos": clustersFundo
    };
}

function comparaMedianaAtualComCluster(clusters, medianaCluster, percentualDistancia) {

    const min = medianaCluster * (1 - percentualDistancia / 100);
    const max = medianaCluster * (1 + percentualDistancia / 100);

    for (let i = 0; i < clusters.length; i++) {
        let preco = clusters[i];

        if (preco >= min && preco <= max) {

            const mediana = recuperaMedianaClusters([preco, medianaCluster])
            clusters[i] = mediana;
            return clusters;
        }

    }
    clusters.push(medianaCluster);
    return clusters;
}

function calculaRange(cluster) {
    const highs = cluster.map(c => c.high);
    return {
        min: Math.min(...highs),
        max: Math.max(...highs)
    };
}

function overlapRatio(rangeA, rangeB) {

    const intersecao =
        Math.min(rangeA.max, rangeB.max) -
        Math.max(rangeA.min, rangeB.min);

    if (intersecao <= 0) return 0;

    const menorRange = Math.min(
        rangeA.max - rangeA.min,
        rangeB.max - rangeB.min
    );

    return intersecao / menorRange;
}

function removerDuplicados(cluster) {
    const map = new Map();

    for (const c of cluster) {
        const key = c.date + "_" + c.high;
        map.set(key, c);
    }

    return Array.from(map.values());
}

function deduplicarClustersIterativo(clusters, threshold = 0.5) {

    let mudou = true;

    while (mudou) {

        mudou = false;
        const novoResultado = [];

        for (let i = 0; i < clusters.length; i++) {

            let atual = clusters[i];
            let rangeAtual = calculaRange(atual);
            let fundido = false;

            for (let j = 0; j < novoResultado.length; j++) {

                let rangeExistente = calculaRange(novoResultado[j]);

                let overlap = overlapRatio(rangeAtual, rangeExistente);

                if (overlap > threshold) {

                    novoResultado[j] = removerDuplicados([
                        ...novoResultado[j],
                        ...atual
                    ]);

                    fundido = true;
                    mudou = true;
                    break;
                }
            }

            if (!fundido) {
                novoResultado.push(atual);
            }
        }

        clusters = novoResultado;
    }

    return clusters;
}

function criaClusterMedianas(clustersNormalizados) {

    const medianas = [];

    for (let i = 0; i < clustersNormalizados.length; i++) {

        const clusterInterno = clustersNormalizados[i];
        const highs = clusterInterno.map(c => c.high);
        medianas.push(recuperaMedianaClusters(highs));

    }
    return medianas;
}


function recuperaMedianaClusters(valores) {

    const ordenado = [...valores].sort((a, b) => a - b);

    const meio = Math.floor(ordenado.length / 2);

    if (ordenado.length % 2 === 0) {
        // par → média dos dois do meio
        return normalizaPrecos((ordenado[meio - 1] + ordenado[meio]) / 2);
    } else {
        // ímpar → valor do meio
        return normalizaPrecos(ordenado[meio]);
    }
}

function normalizaPrecos(preco) {

    let precoNormalizado = parseFloat(preco.toFixed(2));

    return precoNormalizado;
}

/**
 * PASSO 2 - Clustering
 * Agrupa minimas dentro de X% de distancia. Retorna faixas com piso e teto.
 */
function clusterSwingLows(swings, tolerancePct) {
    if (swings.length === 0) return [];
    const sorted = [...swings].sort((a, b) => a.price - b.price);
    const clusters = [];
    let current = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
        const prev = current[current.length - 1];
        const dist = (sorted[i].price - prev.price) / prev.price;
        if (dist <= tolerancePct) {
            current.push(sorted[i]);
        } else {
            clusters.push(current);
            current = [sorted[i]];
        }
    }
    clusters.push(current);

    return clusters.map(group => {
        const prices = group.map(g => g.price);
        const closes = group.map(g => g.close);
        const price_floor = Math.min(...prices);
        const price_ceiling = closes.reduce((a, b) => a + b, 0) / closes.length;
        const lastTouch = group.reduce((a, b) => a.date > b.date ? a : b);
        return {
            price_floor: parseFloat(price_floor.toFixed(2)),
            price_ceiling: parseFloat(price_ceiling.toFixed(2)),
            touches: group.length,
            last_touch_date: lastTouch.date,
            members: group,
        };
    });
}

/**
 * PASSO 3 - Score de forca (0 a 1)
 * Combina toques (60%) + recencia (40%)
 */
function scoreZones(zones, allDates) {
    const totalDays = allDates.length;
    const maxTouches = Math.max(...zones.map(z => z.touches));

    return zones.map(zone => {
        const daysSinceTouch = allDates.indexOf(zone.last_touch_date);
        const recencyScore = daysSinceTouch === -1 ? 0 : 1 - (daysSinceTouch / totalDays);
        const touchScore = zone.touches / maxTouches;
        const score = parseFloat((
            (PARAMS.recency_weight * recencyScore) +
            (PARAMS.touches_weight * touchScore)
        ).toFixed(4));
        return { ...zone, strength_score: score };
    });
}

/**
 * PASSO 4 - Detectar rompimento
 * Zona rompida = 2 fechamentos consecutivos abaixo do price_floor.
 */
function detectBrokenZones(zones, candles) {
    return zones.map(zone => {
        let broken = 0, broken_date = null, consecutive = 0;
        for (let i = candles.length - 1; i >= 0; i--) {
            if (candles[i].close < zone.price_floor) {
                consecutive++;
                if (consecutive >= 2) { broken = 1; broken_date = candles[i].date; break; }
            } else {
                consecutive = 0;
            }
        }
        return { ...zone, broken, broken_date };
    });
}

// --- Main --------------------------------------------------------------------


// const chronological = [...candles].reverse();
// const allDates = candles.map(c => c.date);

// // Passo 1 - swing lows
// const swingLows = findSwingLows(chronological, PARAMS.swing_lookback);
// console.log(`\nSwing lows encontrados: ${swingLows.length}`);
// if (DEBUG) swingLows.forEach(s => console.log(`  ${s.date}  low=${s.price}`));

// // Passo 2 - clustering
// let clusters = clusterSwingLows(swingLows, PARAMS.cluster_tolerance_pct);

// // Filtro: minimo de toques
// clusters = clusters.filter(c => c.touches >= PARAMS.min_touches);
// console.log(`Apos filtro de toques (min ${PARAMS.min_touches}): ${clusters.length} zona(s)`);

// // Filtro: distancia maxima do preco atual  <-- AQUI esta o max_distance_pct
// const minAllowedPrice = currentPrice * (1 - PARAMS.max_distance_pct);
// const beforeDistFilter = clusters.length;
// clusters = clusters.filter(c => c.price_floor >= minAllowedPrice);
// const removedByDist = beforeDistFilter - clusters.length;
// console.log(`Apos filtro de distancia (max ${(PARAMS.max_distance_pct * 100).toFixed(0)}% abaixo de R$ ${currentPrice.toFixed(2)}, piso minimo R$ ${minAllowedPrice.toFixed(2)}): removeu ${removedByDist} zona(s)`);
// console.log(`Zonas relevantes: ${clusters.length}`);

// if (clusters.length === 0) {
//     console.log(`\nNenhuma zona de suporte encontrada com os parametros atuais.`);
//     console.log(`Sugestoes:`);
//     console.log(`  Aumentar --max-distance (atual: ${PARAMS.max_distance_pct})`);
//     console.log(`  Aumentar --lookback (atual: ${PARAMS.lookback_days})`);
//     console.log(`  Reduzir --min-touches (atual: ${PARAMS.min_touches})`);
//     db.close(); process.exit(0);
// }

// // Passo 3 - score
// let zones = scoreZones(clusters, allDates);

// // Passo 4 - rompimentos
// zones = detectBrokenZones(zones, chronological);

// // Ordenar por preco decrescente
// zones.sort((a, b) => b.price_floor - a.price_floor);

// if (DEBUG) {
//     console.log('\nZonas detalhadas:');
//     zones.forEach(z => {
//         const dist = ((currentPrice - z.price_ceiling) / currentPrice * 100).toFixed(1);
//         console.log(`  R$ ${z.price_floor.toFixed(2)}-${z.price_ceiling.toFixed(2)} | toques=${z.touches} | score=${z.strength_score} | ultimo=${z.last_touch_date} | dist=${dist}% | ${z.broken ? 'ROMPIDA' : 'ativa'}`);
//     });
// }

// // --- Persistir ---------------------------------------------------------------
// const deleted = db.prepare(`DELETE FROM support_zones WHERE ticker = ?`).run(TICKER).changes;
// if (deleted > 0) console.log(`\n${deleted} zona(s) anterior(es) removida(s)`);

// const insert = db.prepare(`
//   INSERT INTO support_zones (
//     ticker, price_floor, price_ceiling,
//     touches, last_touch_date, strength_score,
//     broken, broken_date, detection_method
//   ) VALUES (
//     @ticker, @price_floor, @price_ceiling,
//     @touches, @last_touch_date, @strength_score,
//     @broken, @broken_date, @detection_method
//   )
// `);

// db.transaction((zones) => {
//     for (const z of zones) {
//         insert.run({
//             ticker: TICKER,
//             price_floor: z.price_floor,
//             price_ceiling: z.price_ceiling,
//             touches: z.touches,
//             last_touch_date: z.last_touch_date,
//             strength_score: z.strength_score,
//             broken: z.broken,
//             broken_date: z.broken_date,
//             detection_method: 'swing_low_cluster',
//         });
//     }
// })(zones);

// // --- Relatorio final ----------------------------------------------------------
// const active = zones.filter(z => !z.broken);
// const broken = zones.filter(z => z.broken);

// console.log(`\n${zones.length} zona(s) salva(s) para ${TICKER}`);

// if (active.length > 0) {
//     console.log(`\nZonas ATIVAS (${active.length}):`);
//     active.forEach(z => {
//         const dist = ((currentPrice - z.price_ceiling) / currentPrice * 100).toFixed(1);
//         const tag = currentPrice >= z.price_floor && currentPrice <= z.price_ceiling
//             ? ' <- PRECO DENTRO DA ZONA'
//             : ` (${dist}% abaixo do preco)`;
//         console.log(`  R$ ${z.price_floor.toFixed(2)} - ${z.price_ceiling.toFixed(2)} | ${z.touches} toques | score ${z.strength_score} | ultimo: ${z.last_touch_date}${tag}`);
//     });
// }

// if (broken.length > 0) {
//     console.log(`\nZonas ROMPIDAS (${broken.length}):`);
//     broken.forEach(z => {
//         console.log(`  R$ ${z.price_floor.toFixed(2)} - ${z.price_ceiling.toFixed(2)} | rompida em ${z.broken_date}`);
//     });
// }

// const nextSupport = active
//     .filter(z => z.price_ceiling < currentPrice)
//     .sort((a, b) => b.price_floor - a.price_floor)[0];

// if (nextSupport) {
//     const dist = ((currentPrice - nextSupport.price_ceiling) / currentPrice * 100).toFixed(1);
//     console.log(`\nProximo suporte abaixo: R$ ${nextSupport.price_floor.toFixed(2)} - ${nextSupport.price_ceiling.toFixed(2)} (${dist}% abaixo)`);
// }

// console.log('');
// db.close();