import { useState, useEffect, useRef } from "react";

const MOCK_HISTORY = {
  BOVA11: [
    { date: "2025-03-27", close: 129.78 }, { date: "2025-03-28", close: 128.69 },
    { date: "2025-03-31", close: 127.30 }, { date: "2025-04-01", close: 128.04 },
    { date: "2025-04-02", close: 128.90 }, { date: "2025-04-03", close: 128.10 },
    { date: "2025-04-04", close: 124.05 }, { date: "2025-04-07", close: 122.73 },
    { date: "2025-04-08", close: 121.04 }, { date: "2025-04-09", close: 124.55 },
    { date: "2025-04-10", close: 123.41 }, { date: "2025-04-11", close: 124.72 },
    { date: "2025-04-14", close: 126.41 }, { date: "2025-04-15", close: 126.20 },
    { date: "2025-04-16", close: 125.28 }, { date: "2025-04-17", close: 126.53 },
    { date: "2025-04-22", close: 127.33 }, { date: "2025-04-23", close: 129.08 },
    { date: "2025-04-24", close: 131.38 }, { date: "2025-04-25", close: 131.49 },
    { date: "2025-04-28", close: 131.65 }, { date: "2025-04-29", close: 131.86 },
    { date: "2025-04-30", close: 131.63 }, { date: "2025-05-02", close: 131.85 },
    { date: "2025-05-05", close: 130.34 }, { date: "2025-05-06", close: 130.38 },
    { date: "2025-05-07", close: 130.21 }, { date: "2025-05-08", close: 133.04 },
    { date: "2025-05-09", close: 133.24 }, { date: "2025-05-12", close: 133.39 },
    { date: "2025-05-13", close: 135.61 }, { date: "2025-05-14", close: 135.19 },
    { date: "2025-05-15", close: 136.07 }, { date: "2025-05-16", close: 136.11 },
    { date: "2025-05-19", close: 136.42 }, { date: "2025-05-20", close: 136.84 },
    { date: "2025-05-21", close: 134.59 }, { date: "2025-05-22", close: 134.05 },
    { date: "2025-05-23", close: 134.47 }, { date: "2025-05-26", close: 135.01 },
    { date: "2025-05-27", close: 136.46 }, { date: "2025-05-28", close: 135.71 },
    { date: "2025-05-29", close: 135.36 }, { date: "2025-05-30", close: 133.99 },
    { date: "2025-06-02", close: 133.60 }, { date: "2025-06-03", close: 134.40 },
    { date: "2025-06-04", close: 133.81 }, { date: "2025-06-05", close: 133.25 },
    { date: "2025-06-06", close: 133.06 }, { date: "2025-06-09", close: 132.73 },
    { date: "2025-06-10", close: 133.35 }, { date: "2025-06-11", close: 133.97 },
    { date: "2025-06-12", close: 134.66 }, { date: "2025-06-13", close: 133.99 },
    { date: "2025-06-16", close: 136.07 }, { date: "2025-06-17", close: 135.52 },
    { date: "2025-06-18", close: 135.42 }, { date: "2025-06-20", close: 133.90 },
    { date: "2025-06-23", close: 133.47 }, { date: "2025-06-24", close: 134.07 },
    { date: "2025-06-25", close: 132.55 }, { date: "2025-06-26", close: 133.96 },
    { date: "2025-06-27", close: 133.79 }, { date: "2025-06-30", close: 135.85 },
    { date: "2025-07-01", close: 136.52 }, { date: "2025-07-02", close: 135.91 },
    { date: "2025-07-03", close: 137.92 }, { date: "2025-07-04", close: 138.13 },
    { date: "2025-07-07", close: 136.45 }, { date: "2025-07-08", close: 136.15 },
    { date: "2025-07-09", close: 134.11 }, { date: "2025-07-10", close: 133.61 },
    { date: "2025-07-11", close: 133.50 }, { date: "2025-07-14", close: 132.09 },
    { date: "2025-07-15", close: 132.37 }, { date: "2025-07-16", close: 132.40 },
    { date: "2025-07-17", close: 132.47 }, { date: "2025-07-18", close: 130.30 },
    { date: "2025-07-21", close: 131.20 }, { date: "2025-07-22", close: 131.15 },
    { date: "2025-07-23", close: 132.39 }, { date: "2025-07-24", close: 130.78 },
    { date: "2025-07-25", close: 130.45 }, { date: "2025-07-28", close: 129.25 },
    { date: "2025-07-29", close: 129.50 }, { date: "2025-07-30", close: 130.93 },
    { date: "2025-07-31", close: 129.88 }, { date: "2025-08-01", close: 129.57 },
    { date: "2025-08-04", close: 130.00 }, { date: "2025-08-05", close: 130.16 },
    { date: "2025-08-06", close: 131.49 }, { date: "2025-08-07", close: 133.52 },
    { date: "2025-08-08", close: 132.91 }, { date: "2025-08-11", close: 132.50 },
    { date: "2025-08-12", close: 135.10 }, { date: "2025-08-13", close: 133.66 },
    { date: "2025-08-14", close: 133.36 }, { date: "2025-08-15", close: 133.56 },
    { date: "2025-08-18", close: 134.33 }, { date: "2025-08-19", close: 131.17 },
    { date: "2025-08-20", close: 131.80 }, { date: "2025-08-21", close: 131.63 },
    { date: "2025-08-22", close: 135.15 }, { date: "2025-08-25", close: 135.11 },
    { date: "2025-08-26", close: 134.94 }, { date: "2025-08-27", close: 136.20 },
    { date: "2025-08-28", close: 138.31 }, { date: "2025-08-29", close: 138.50 },
    { date: "2025-09-01", close: 138.29 }, { date: "2025-09-02", close: 137.37 },
    { date: "2025-09-03", close: 136.87 }, { date: "2025-09-04", close: 138.01 },
    { date: "2025-09-05", close: 139.65 }, { date: "2025-09-08", close: 138.80 },
    { date: "2025-09-09", close: 138.60 }, { date: "2025-09-10", close: 139.16 },
    { date: "2025-09-11", close: 139.96 }, { date: "2025-09-12", close: 139.21 },
    { date: "2025-09-15", close: 140.45 }, { date: "2025-09-16", close: 141.11 },
    { date: "2025-09-17", close: 142.60 }, { date: "2025-09-18", close: 142.53 },
    { date: "2025-09-19", close: 142.82 }, { date: "2025-09-22", close: 142.49 },
    { date: "2025-09-23", close: 142.74 }, { date: "2025-09-24", close: 142.91 },
    { date: "2025-09-25", close: 141.51 }, { date: "2025-09-26", close: 141.60 },
    { date: "2025-09-29", close: 141.97 }, { date: "2025-09-30", close: 141.22 },
    { date: "2025-10-01", close: 142.52 }, { date: "2025-10-02", close: 140.99 },
    { date: "2025-10-03", close: 141.22 }, { date: "2025-10-06", close: 140.67 },
    { date: "2025-10-07", close: 138.45 }, { date: "2025-10-08", close: 139.20 },
    { date: "2025-10-09", close: 138.75 }, { date: "2025-10-10", close: 137.81 },
    { date: "2025-10-13", close: 138.75 }, { date: "2025-10-14", close: 138.74 },
    { date: "2025-10-15", close: 139.49 }, { date: "2025-10-16", close: 139.16 },
    { date: "2025-10-17", close: 140.40 }, { date: "2025-10-20", close: 141.27 },
    { date: "2025-10-21", close: 141.17 }, { date: "2025-10-22", close: 141.88 },
    { date: "2025-10-23", close: 142.68 }, { date: "2025-10-24", close: 143.00 },
    { date: "2025-10-27", close: 144.00 }, { date: "2025-10-28", close: 144.32 },
    { date: "2025-10-29", close: 145.30 }, { date: "2025-10-30", close: 145.70 },
    { date: "2025-10-31", close: 146.41 }, { date: "2025-11-03", close: 147.37 },
    { date: "2025-11-04", close: 147.53 }, { date: "2025-11-05", close: 150.38 },
    { date: "2025-11-06", close: 150.10 }, { date: "2025-11-07", close: 150.80 },
    { date: "2025-11-10", close: 152.25 }, { date: "2025-11-11", close: 154.80 },
    { date: "2025-11-12", close: 154.44 }, { date: "2025-11-13", close: 154.10 },
    { date: "2025-11-14", close: 154.34 }, { date: "2025-11-17", close: 153.79 },
    { date: "2025-11-18", close: 153.53 }, { date: "2025-11-19", close: 152.00 },
    { date: "2025-11-21", close: 151.95 }, { date: "2025-11-24", close: 152.35 },
    { date: "2025-11-25", close: 152.97 }, { date: "2025-11-26", close: 155.74 },
    { date: "2025-11-27", close: 155.32 }, { date: "2025-11-28", close: 155.85 },
    { date: "2025-12-01", close: 155.50 }, { date: "2025-12-02", close: 157.97 },
    { date: "2025-12-03", close: 158.40 }, { date: "2025-12-04", close: 161.29 },
    { date: "2025-12-05", close: 154.18 }, { date: "2025-12-08", close: 155.25 },
    { date: "2025-12-09", close: 154.55 }, { date: "2025-12-10", close: 156.00 },
    { date: "2025-12-11", close: 156.19 }, { date: "2025-12-12", close: 157.50 },
    { date: "2025-12-15", close: 159.37 }, { date: "2025-12-16", close: 155.16 },
    { date: "2025-12-17", close: 154.35 }, { date: "2025-12-18", close: 154.86 },
    { date: "2025-12-19", close: 155.30 }, { date: "2025-12-22", close: 155.07 },
    { date: "2025-12-23", close: 157.43 }, { date: "2025-12-26", close: 157.82 },
    { date: "2025-12-29", close: 157.41 }, { date: "2025-12-30", close: 158.00 },
    { date: "2026-01-02", close: 157.36 }, { date: "2026-01-05", close: 158.52 },
    { date: "2026-01-06", close: 160.20 }, { date: "2026-01-07", close: 158.80 },
    { date: "2026-01-08", close: 159.60 }, { date: "2026-01-09", close: 160.10 },
    { date: "2026-01-12", close: 160.15 }, { date: "2026-01-13", close: 159.07 },
    { date: "2026-01-14", close: 162.24 }, { date: "2026-01-15", close: 162.55 },
    { date: "2026-01-16", close: 161.57 }, { date: "2026-01-19", close: 161.94 },
    { date: "2026-01-20", close: 162.92 }, { date: "2026-01-21", close: 168.95 },
    { date: "2026-01-22", close: 172.74 }, { date: "2026-01-23", close: 175.70 },
    { date: "2026-01-26", close: 175.30 }, { date: "2026-01-27", close: 178.23 },
    { date: "2026-01-28", close: 181.40 }, { date: "2026-01-29", close: 179.65 },
    { date: "2026-01-30", close: 178.20 }, { date: "2026-02-02", close: 179.20 },
    { date: "2026-02-03", close: 182.19 }, { date: "2026-02-04", close: 178.20 },
    { date: "2026-02-05", close: 178.65 }, { date: "2026-02-06", close: 179.24 },
    { date: "2026-02-09", close: 182.79 }, { date: "2026-02-10", close: 182.40 },
    { date: "2026-02-11", close: 185.99 }, { date: "2026-02-12", close: 184.28 },
    { date: "2026-02-13", close: 182.98 }, { date: "2026-02-18", close: 182.43 },
    { date: "2026-02-19", close: 184.99 }, { date: "2026-02-20", close: 186.69 },
    { date: "2026-02-23", close: 185.17 }, { date: "2026-02-24", close: 187.78 },
    { date: "2026-02-25", close: 187.46 }, { date: "2026-02-26", close: 187.35 },
    { date: "2026-02-27", close: 185.16 }, { date: "2026-03-02", close: 185.50 },
    { date: "2026-03-03", close: 179.30 }, { date: "2026-03-04", close: 181.60 },
    { date: "2026-03-05", close: 176.75 }, { date: "2026-03-06", close: 175.89 },
    { date: "2026-03-09", close: 177.26 }, { date: "2026-03-10", close: 179.75 },
    { date: "2026-03-11", close: 180.21 }, { date: "2026-03-12", close: 175.85 },
    { date: "2026-03-13", close: 174.55 }, { date: "2026-03-16", close: 176.55 },
    { date: "2026-03-17", close: 176.83 }, { date: "2026-03-18", close: 175.80 },
    { date: "2026-03-19", close: 177.15 }, { date: "2026-03-20", close: 173.01 },
    { date: "2026-03-23", close: 178.90 }, { date: "2026-03-24", close: 179.19 },
    { date: "2026-03-25", close: 182.20 }, { date: "2026-03-26", close: 179.45 },
    { date: "2026-03-27", close: 177.74 }, { date: "2026-03-27", close: 179.00 },
  ],
  PETR4: [
    { date: "2025-09-01", close: 38.20 }, { date: "2025-09-08", close: 37.50 },
    { date: "2025-09-15", close: 36.80 }, { date: "2025-09-22", close: 38.10 },
    { date: "2025-09-29", close: 37.40 }, { date: "2025-10-06", close: 36.90 },
    { date: "2025-10-13", close: 38.50 }, { date: "2025-10-20", close: 37.80 },
    { date: "2025-10-27", close: 36.20 }, { date: "2025-11-03", close: 37.60 },
    { date: "2025-11-10", close: 38.90 }, { date: "2025-11-17", close: 37.30 },
    { date: "2025-11-24", close: 36.70 }, { date: "2025-12-01", close: 38.20 },
    { date: "2025-12-08", close: 37.50 }, { date: "2025-12-15", close: 39.10 },
    { date: "2025-12-22", close: 38.40 }, { date: "2025-12-29", close: 37.80 },
    { date: "2026-01-05", close: 38.60 }, { date: "2026-01-12", close: 39.20 },
  ],
  VALE3: [
    { date: "2025-09-01", close: 62.10 }, { date: "2025-09-08", close: 60.80 },
    { date: "2025-09-15", close: 59.40 }, { date: "2025-09-22", close: 61.20 },
    { date: "2025-09-29", close: 58.90 }, { date: "2025-10-06", close: 57.60 },
    { date: "2025-10-13", close: 59.30 }, { date: "2025-10-20", close: 58.10 },
    { date: "2025-10-27", close: 56.80 }, { date: "2025-11-03", close: 58.40 },
    { date: "2025-11-10", close: 60.20 }, { date: "2025-11-17", close: 59.50 },
    { date: "2025-11-24", close: 58.80 }, { date: "2025-12-01", close: 60.40 },
    { date: "2025-12-08", close: 61.80 }, { date: "2025-12-15", close: 60.90 },
    { date: "2025-12-22", close: 62.30 }, { date: "2025-12-29", close: 61.50 },
    { date: "2026-01-05", close: 63.20 }, { date: "2026-01-12", close: 62.80 },
  ],
};

// ── Black-Scholes ─────────────────────────────────────────────────────────
function erf(x) {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1; x = Math.abs(x);
  const t = 1 / (1 + p * x);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}
function normCDF(x) { return 0.5 * (1 + erf(x / Math.sqrt(2))); }
function normPDF(x) { return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI); }

function blackScholes(S, K, T, r, sigma, type) {
  if (S <= 0 || K <= 0) throw new Error("Invalid inputs");
  if (T <= 0) {
    var intrinsic = type === "PUT"
      ? Math.max(K - S, 0)
      : Math.max(S - K, 0);

    return { price: intrinsic, delta: 0, gamma: 0, theta: 0, vega: 0 };
  }
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  const isPut = type === "PUT";
  const nd1 = normPDF(d1);
  const price = isPut
    ? K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1)
    : S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
  const delta = isPut ? -normCDF(-d1) : normCDF(d1);
  const gamma = nd1 / (S * sigma * Math.sqrt(T));
  const theta = isPut
    ? (-(S * nd1 * sigma) / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * normCDF(-d2)) / 252
    : (-(S * nd1 * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * normCDF(d2)) / 252;
  const vega = S * nd1 * Math.sqrt(T) / 100;
  return { price, delta, gamma, theta, vega };
}

function impliedVolatility(S, K, T, r, marketPrice, type) {
  var tol = 1e-5;
  var maxIter = 100;

  var low = 0.0001;
  var high = 3; // 300% de vol (limite alto)

  for (var i = 0; i < maxIter; i++) {
    var mid = (low + high) / 2;

    var price = blackScholes(S, K, T, r, mid, type).price;

    if (Math.abs(price - marketPrice) < tol) {
      return mid;
    }

    if (price > marketPrice) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return (low + high) / 2;
}

function calcPercentile(prices, strike) {
  const sorted = [...prices].sort((a, b) => a - b);
  return (sorted.filter(p => p <= strike).length / sorted.length) * 100;
}

function probITM(S, K, T, r, sigma, type) {
  const d2 = (Math.log(S / K) + (r - 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  return type === "PUT"
    ? normCDF(-d2)
    : normCDF(d2);
}

// ── Technical indicators ──────────────────────────────────────────────────
function calcSMA(data, period) {
  return data.map((_, i) => {
    if (i < period - 1) return null;
    return data.slice(i - period + 1, i + 1).reduce((s, d) => s + d.close, 0) / period;
  });
}
function calcRSI(data, period = 14) {
  if (data.length < period + 1) return Array(data.length).fill(null);
  const changes = data.map((d, i) => i === 0 ? 0 : d.close - data[i - 1].close);
  return data.map((_, i) => {
    if (i < period) return null;
    const slice = changes.slice(i - period + 1, i + 1);
    const gains = slice.filter(c => c > 0).reduce((s, c) => s + c, 0) / period;
    const losses = Math.abs(slice.filter(c => c < 0).reduce((s, c) => s + c, 0)) / period;
    if (losses === 0) return 100;
    return 100 - 100 / (1 + gains / losses);
  });
}

function calcVolatility(data) {
  if (!data || data.length < 2) return 0;

  var returns = [];

  for (var i = 1; i < data.length; i++) {
    var prev = data[i - 1].close;
    var curr = data[i].close;

    if (prev > 0 && curr > 0) {
      returns.push(Math.log(curr / prev));
    }
  }

  var n = returns.length;
  if (n < 2) return 0;

  var mean = returns.reduce(function (s, r) { return s + r; }, 0) / n;

  var variance = returns.reduce(function (s, r) {
    return s + Math.pow(r - mean, 2);
  }, 0) / (n - 1); // 👈 ajuste aqui

  return Math.sqrt(variance * 252);
}

function calcHVPercentil(priceData) {

  let returns = [];
  for (var i = 1; i < priceData.length; i++) {
    returns.push(Math.log(priceData[i].close / priceData[i - 1].close));
  }

  const volatilidades = rollingVolatility(returns, 21);

  const currentVol = volatilidades[volatilidades.length - 1];
  const historicalVols = volatilidades.slice(0, -1);

  const volPercentil = calcVolPercentile(historicalVols, currentVol);
  console.log(volPercentil);
  return volPercentil;
}

function rollingVolatility(returns, window) {
  var vols = [];

  for (var i = window; i < returns.length; i++) {
    var slice = returns.slice(i - window, i);

    var mean = slice.reduce((a, b) => a + b, 0) / window;

    var variance = slice.reduce(function (sum, r) {
      return sum + Math.pow(r - mean, 2);
    }, 0) / window;

    var vol = Math.sqrt(variance) * Math.sqrt(252);

    vols.push(vol);
  }

  return vols;
}

function calcVolPercentile(vols, currentVol) {
  var count = vols.filter(function (v) {
    return v <= currentVol;
  }).length;

  return (count / vols.length) * 100;
}

// ── Mini Chart ────────────────────────────────────────────────────────────
function MiniChart({ data, sma20, sma50, strikeLevel, width = 340, height = 120 }) {
  if (!data || data.length === 0) return null;
  const prices = data.map(d => d.close);
  const allVals = strikeLevel ? [...prices, strikeLevel] : prices;
  const min = Math.min(...allVals) * 0.993;
  const max = Math.max(...allVals) * 1.007;
  const px = i => (i / (data.length - 1)) * width;
  const py = v => height - ((v - min) / (max - min)) * height;
  const line = arr => arr.map((v, i) => v !== null ? `${i === 0 || arr[i - 1] === null ? 'M' : 'L'}${px(i)},${py(v)}` : ``).join(' ');
  const areaPath = `M${px(0)},${py(prices[0])} ` + prices.slice(1).map((v, i) => `L${px(i + 1)},${py(v)}`).join(' ') + ` L${px(prices.length - 1)},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00d4a8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00d4a8" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#ag)" />
      <path d={`M${px(0)},${py(prices[0])} ` + prices.slice(1).map((v, i) => `L${px(i + 1)},${py(v)}`).join(' ')} fill="none" stroke="#00d4a8" strokeWidth="2" />
      {sma20 && <path d={line(sma20)} fill="none" stroke="#f5a623" strokeWidth="1.2" strokeDasharray="4,2" />}
      {sma50 && <path d={line(sma50)} fill="none" stroke="#7b68ee" strokeWidth="1.2" strokeDasharray="4,2" />}
      {strikeLevel && strikeLevel >= min && strikeLevel <= max && <>
        <line x1="0" y1={py(strikeLevel)} x2={width} y2={py(strikeLevel)} stroke="#ff4d6d" strokeWidth="1.5" strokeDasharray="6,3" />
        <text x={width - 4} y={py(strikeLevel) - 4} textAnchor="end" fill="#ff4d6d" fontSize="9">Strike</text>
      </>}
    </svg>
  );
}

// ── Greek Card ────────────────────────────────────────────────────────────
function GreekCard({ label, value, description, color = "#e8eaf6", fmt }) {
  const display = fmt ? fmt(value) : (typeof value === 'number' ? value.toFixed(4) : value);
  return (
    <div style={{ background: "#0a0e1a", borderRadius: 8, padding: "12px 14px" }}>
      <div style={{ fontSize: 9, color: "#4a6080", letterSpacing: "0.1em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "'IBM Plex Mono',monospace" }}>{display}</div>
      <div style={{ fontSize: 9, color: "#3a5070", marginTop: 3, lineHeight: 1.5 }}>{description}</div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────
export default function PutAgent() {
  const [ticker, setTicker] = useState("BOVA11");
  const [customTicker, setCustomTicker] = useState("");
  const [expiry, setExpiry] = useState("30");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("analise");
  const chatEndRef = useRef(null);

  // Greeks state
  const [gStrike, setGStrike] = useState("");
  const [mPlace, setMPlace] = useState("");
  const [impdVol, setImpdVol] = useState("");
  const [gExpiry, setGExpiry] = useState("");
  const [gType, setGType] = useState("PUT");
  const [gRate, setGRate] = useState("13.75");
  const [greeks, setGreeks] = useState(null);

  const activeTicker = customTicker.trim().toUpperCase() || ticker;
  const priceData = MOCK_HISTORY[activeTicker] || MOCK_HISTORY["BOVA11"];
  const sma20 = calcSMA(priceData, 20);
  const sma50 = calcSMA(priceData, 10);
  const rsiValues = calcRSI(priceData);
  const lastRSI = rsiValues.filter(v => v !== null).at(-1);
  const lastPrice = priceData.at(-1)?.close;
  const firstPrice = priceData[0]?.close;
  const trend = ((lastPrice - firstPrice) / firstPrice) * 100;
  const volDecimal = calcVolatility(priceData);
  const vol = volDecimal * 100;
  const lastSMA20 = sma20.filter(v => v !== null).at(-1);
  const lastSMA50 = sma50.filter(v => v !== null).at(-1);

  const computeGreeks = () => {
    const K = parseFloat(gStrike);
    const r = parseFloat(gRate) / 100;
    if (!K || !gExpiry || isNaN(K)) return;
    const today = new Date();
    const expiryDate = new Date(gExpiry);
    const T = Math.max((expiryDate - today) / (365 * 24 * 60 * 60 * 1000), 0.001);
    const daysLeft = Math.max(Math.round((expiryDate - today) / (24 * 60 * 60 * 1000)), 0);
    const bs = blackScholes(lastPrice, K, T, r, volDecimal, gType);
    const marketPrice = parseFloat(mPlace);
    const impdVol = Math.max(impliedVolatility(lastPrice, K, T, r, marketPrice, gType) * 100).toFixed(2);
    setImpdVol(impdVol);
    const prices = priceData.map(d => d.close);
    const percentile = calcPercentile(prices, K);
    const prob = probITM(lastPrice, K, T, r, volDecimal, gType);
    const otmPct = gType === "PUT" ? ((lastPrice - K) / lastPrice) * 100 : ((K - lastPrice) / lastPrice) * 100;
    const hvPercentil = calcHVPercentil(priceData);

    setGreeks({ ...bs, percentile, otmPct, K, T, daysLeft, prob, hvPercentil });
  };

  const buildPrompt = ind => `
Você é um especialista em opções da B3. Analise os dados e dê recomendação objetiva sobre lançamento de PUT.
DADOS: Ticker ${ind.ticker}, Preço R$${ind.lastPrice}, Tendência ${ind.trend}%, RSI ${ind.rsi}, Vol ${ind.volatility}%, SMA20 R$${ind.sma20} (preço ${ind.priceAboveSMA20 ? "ACIMA" : "ABAIXO"}), vencimento ${ind.expiry}d.
Histórico: ${ind.priceData}
RESPONDA APENAS JSON sem markdown:
{"veredicto":"FAVORÁVEL"|"NEUTRO"|"DESFAVORÁVEL","score":<0-100>,"tendencia":"ALTA"|"LATERAL"|"QUEDA","strikes_sugeridos":[<3 strikes OTM>],"premio_estimado_pct":<número>,"risco_principal":"<frase>","justificativa":"<2-3 frases>","alerta":"<aviso ou null>"}`;

  const runAnalysis = async () => {
    setLoading(true); setAnalysis(null);
    const ind = { ticker: activeTicker, lastPrice, trend: trend.toFixed(2), rsi: lastRSI?.toFixed(1), volatility: vol.toFixed(1), sma20: lastSMA20?.toFixed(2), sma50: lastSMA50?.toFixed(2), priceAboveSMA20: lastPrice > lastSMA20, priceAboveSMA50: lastPrice > lastSMA50, expiry, priceData: priceData.map(d => `${d.date}:R$${d.close}`).join(",") };
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: buildPrompt(ind) }] }) });
      const data = await res.json();
      const text = data.content.map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(text);
      setAnalysis(parsed);
      setMessages([{ role: "assistant", content: `Análise de **${activeTicker}** concluída! Veredicto: **${parsed.veredicto}** (score ${parsed.score}/100). Tendência: **${parsed.tendencia}**. Pode perguntar sobre estratégias, strikes ou gestão de risco.` }]);
    } catch { setAnalysis({ error: true }); }
    setLoading(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = { role: "user", content: chatInput };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages); setChatInput(""); setChatLoading(true);
    const ctx = `Especialista em opções B3. Ativo: ${activeTicker} R$${lastPrice}, tendência ${trend.toFixed(1)}%, RSI ${lastRSI?.toFixed(1)}, vol ${vol.toFixed(1)}%.${analysis ? ` Análise: ${JSON.stringify(analysis)}` : ""}${greeks ? ` Gregas: delta=${greeks.delta?.toFixed(4)}, theta=${greeks.theta?.toFixed(4)}, gamma=${greeks.gamma?.toFixed(6)}, vega=${greeks.vega?.toFixed(4)}, strike R$${greeks.K}, ${greeks.daysLeft}d.` : ""}. Responda em português, direto, máx 3 parágrafos.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: ctx, messages: newMessages.map(m => ({ role: m.role, content: m.content })) }) });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.content.map(b => b.text || "").join("") }]);
    } catch { setMessages(prev => [...prev, { role: "assistant", content: "Erro. Tente novamente." }]); }
    setChatLoading(false);
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const vc = { "FAVORÁVEL": "#00d4a8", "NEUTRO": "#f5a623", "DESFAVORÁVEL": "#ff4d6d" };
  const ti = { "ALTA": "↑", "LATERAL": "→", "QUEDA": "↓" };
  const card = { background: "#0f1628", border: "1px solid #1e2a45", borderRadius: 12, padding: 20 };
  const lbl = { fontSize: 10, color: "#4a6080", letterSpacing: "0.1em", marginBottom: 14 };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#e8eaf6", fontFamily: "'IBM Plex Mono','Courier New',monospace", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@400;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e2a45", padding: "18px 28px", display: "flex", alignItems: "center", gap: 14, background: "rgba(10,14,26,0.97)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#00d4a8,#0088ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>Ψ</div>
        <div>
          <div style={{ fontFamily: "'IBM Plex Sans'", fontWeight: 600, fontSize: 15, letterSpacing: "0.04em" }}>PUT AGENT <span style={{ color: "#00d4a8", fontSize: 11, marginLeft: 6 }}>B3 · OPÇÕES</span></div>
          <div style={{ fontSize: 10, color: "#4a6080", letterSpacing: "0.08em" }}>ANÁLISE TÉCNICA + GREGAS + IA</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {["BOVA11", "PETR4", "VALE3"].map(t => (
            <button key={t} onClick={() => { setTicker(t); setCustomTicker(""); setAnalysis(null); setMessages([]); setGreeks(null); }} style={{ padding: "5px 12px", borderRadius: 5, border: "1px solid", borderColor: ticker === t && !customTicker ? "#00d4a8" : "#1e2a45", background: ticker === t && !customTicker ? "rgba(0,212,168,0.1)" : "transparent", color: ticker === t && !customTicker ? "#00d4a8" : "#4a6080", cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #1e2a45", background: "#0a0e1a", padding: "0 28px" }}>
        {[["analise", "ANÁLISE IA"], ["gregas", "∂  GREGAS · PERCENTIL"]].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{ padding: "12px 20px", border: "none", borderBottom: `2px solid ${activeTab === key ? "#00d4a8" : "transparent"}`, background: "transparent", color: activeTab === key ? "#00d4a8" : "#4a6080", cursor: "pointer", fontSize: 11, fontFamily: "inherit", letterSpacing: "0.08em" }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={card}>
            <div style={lbl}>CONFIGURAÇÃO</div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, color: "#7a8aaa", display: "block", marginBottom: 5 }}>TICKER PERSONALIZADO</label>
              <input value={customTicker} onChange={e => { setCustomTicker(e.target.value); setAnalysis(null); setMessages([]); setGreeks(null); }} placeholder="Ex: ITUB4, ABEV3..."
                style={{ width: "100%", background: "#0a0e1a", border: "1px solid #1e2a45", borderRadius: 6, padding: "8px 12px", color: "#e8eaf6", fontFamily: "inherit", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              {customTicker && !MOCK_HISTORY[customTicker.toUpperCase()] && <div style={{ fontSize: 10, color: "#f5a623", marginTop: 4 }}>⚠ Usando dados simulados (BOVA11 proxy)</div>}
            </div>
            {activeTab === "analise" && <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 10, color: "#7a8aaa", display: "block", marginBottom: 5 }}>VENCIMENTO ALVO (dias úteis)</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {["15", "30", "45", "60"].map(d => (
                    <button key={d} onClick={() => setExpiry(d)} style={{ flex: 1, padding: "7px 0", borderRadius: 6, border: "1px solid", fontFamily: "inherit", fontSize: 12, cursor: "pointer", borderColor: expiry === d ? "#00d4a8" : "#1e2a45", background: expiry === d ? "rgba(0,212,168,0.12)" : "transparent", color: expiry === d ? "#00d4a8" : "#4a6080" }}>{d}d</button>
                  ))}
                </div>
              </div>
              <button onClick={runAnalysis} disabled={loading} style={{ width: "100%", padding: 11, borderRadius: 7, background: loading ? "#1e2a45" : "linear-gradient(135deg,#00d4a8,#0088ff)", border: "none", color: loading ? "#4a6080" : "#0a0e1a", fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "⟳  ANALISANDO..." : "▶  RODAR ANÁLISE IA"}
              </button>
            </>}
          </div>

          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#4a6080", letterSpacing: "0.1em" }}>GRÁFICO · {activeTicker}</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>R$ {lastPrice?.toFixed(2)}</div>
            </div>
            <MiniChart data={priceData} sma20={sma20} sma50={sma50} strikeLevel={activeTab === "gregas" && greeks?.K ? greeks.K : null} width={340} height={110} />
            <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 10, color: "#4a6080" }}>
              <span style={{ color: "#f5a623" }}>── SMA20</span>
              <span style={{ color: "#7b68ee" }}>── SMA10</span>
              <span style={{ color: "#00d4a8" }}>── Preço</span>
              {activeTab === "gregas" && greeks?.K && <span style={{ color: "#ff4d6d" }}>── Strike</span>}
            </div>
          </div>

          <div style={card}>
            <div style={lbl}>INDICADORES TÉCNICOS</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "TENDÊNCIA", value: `${trend > 0 ? "+" : ""}${trend.toFixed(1)}%`, color: trend > 0 ? "#00d4a8" : "#ff4d6d" },
                { label: "RSI (14)", value: lastRSI?.toFixed(1), color: lastRSI > 70 ? "#ff4d6d" : lastRSI < 30 ? "#00d4a8" : "#e8eaf6" },
                { label: "VOL. ANUAL", value: `${vol.toFixed(1)}%`, color: vol > 35 ? "#f5a623" : "#e8eaf6" },
                { label: "vs SMA20", value: lastPrice > lastSMA20 ? "ACIMA ↑" : "ABAIXO ↓", color: lastPrice > lastSMA20 ? "#00d4a8" : "#ff4d6d" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: "#0a0e1a", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 9, color: "#4a6080", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ═══ ANÁLISE ═══ */}
          {activeTab === "analise" && <>
            {!analysis && !loading && (
              <div style={{ ...card, padding: 40, textAlign: "center", border: "1px dashed #1e2a45", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 40, opacity: 0.3 }}>Ψ</div>
                <div style={{ fontSize: 12, color: "#4a6080", lineHeight: 1.6 }}>Configure o ativo e clique em<br /><strong style={{ color: "#00d4a8" }}>Rodar Análise IA</strong></div>
              </div>
            )}
            {loading && (
              <div style={{ ...card, padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#4a6080", letterSpacing: "0.1em", marginBottom: 20 }}>PROCESSANDO...</div>
                {["Lendo histórico", "Calculando RSI e médias", "Avaliando tendência", "Gerando recomendação"].map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: "0 30px" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4a8", animation: `pulse 1.2s ${i * 0.3}s ease-in-out infinite` }} />
                    <span style={{ fontSize: 11, color: "#4a6080" }}>{step}</span>
                  </div>
                ))}
                <style>{`@keyframes pulse{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
              </div>
            )}
            {analysis && !analysis.error && <>
              <div style={{ ...card, border: `1px solid ${vc[analysis.veredicto] || "#1e2a45"}`, boxShadow: `0 0 30px ${vc[analysis.veredicto]}22` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={lbl}>VEREDICTO IA</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: vc[analysis.veredicto] }}>{analysis.veredicto}</div>
                    <div style={{ fontSize: 12, color: "#7a8aaa", marginTop: 4 }}>Tendência: <span style={{ color: "#e8eaf6" }}>{ti[analysis.tendencia]} {analysis.tendencia}</span></div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: "#4a6080", marginBottom: 4 }}>SCORE</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: vc[analysis.veredicto] }}>{analysis.score}</div>
                    <div style={{ fontSize: 9, color: "#4a6080" }}>/100</div>
                  </div>
                </div>
                <div style={{ height: 4, background: "#1e2a45", borderRadius: 2, marginTop: 14, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${analysis.score}%`, background: `linear-gradient(90deg,${vc[analysis.veredicto]},${vc[analysis.veredicto]}88)`, borderRadius: 2 }} />
                </div>
                <div style={{ marginTop: 14, fontSize: 11, color: "#7a8aaa", lineHeight: 1.6 }}>{analysis.justificativa}</div>
                {analysis.alerta && <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(245,166,35,0.08)", borderLeft: "3px solid #f5a623", borderRadius: "0 6px 6px 0", fontSize: 11, color: "#f5a623" }}>⚠ {analysis.alerta}</div>}
              </div>

              <div style={card}>
                <div style={lbl}>STRIKES SUGERIDOS (OTM) · {expiry}d</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                  {(analysis.strikes_sugeridos || []).map((strike, i) => {
                    const otm = ((lastPrice - strike) / lastPrice * 100).toFixed(1);
                    return (
                      <div key={i} style={{ background: "#0a0e1a", borderRadius: 8, padding: "10px 12px", textAlign: "center", border: i === 1 ? "1px solid #00d4a822" : "1px solid transparent" }}>
                        <div style={{ fontSize: 9, color: "#4a6080", marginBottom: 4 }}>{i === 0 ? "CONSERVADOR" : i === 1 ? "MODERADO ★" : "AGRESSIVO"}</div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: i === 1 ? "#00d4a8" : "#e8eaf6" }}>R$ {typeof strike === 'number' ? strike.toFixed(2) : strike}</div>
                        <div style={{ fontSize: 10, color: "#4a6080" }}>{otm}% OTM</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 12, padding: "8px 12px", background: "#0a0e1a", borderRadius: 6 }}>
                  <span style={{ fontSize: 10, color: "#4a6080" }}>PRÊMIO EST.: </span>
                  <span style={{ fontSize: 12, color: "#00d4a8", fontWeight: 600 }}>~{analysis.premio_estimado_pct?.toFixed(1)}% do strike</span>
                  <span style={{ fontSize: 10, color: "#4a6080" }}> · {analysis.risco_principal}</span>
                </div>
              </div>
            </>}

            {messages.length > 0 && (
              <div style={{ ...card, padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e2a45", fontSize: 10, color: "#4a6080", letterSpacing: "0.1em" }}>CHAT COM O AGENTE</div>
                <div style={{ maxHeight: 220, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                  {messages.map((m, i) => (
                    <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "88%", background: m.role === "user" ? "rgba(0,212,168,0.12)" : "#0a0e1a", border: `1px solid ${m.role === "user" ? "rgba(0,212,168,0.3)" : "#1e2a45"}`, borderRadius: 8, padding: "8px 12px", fontSize: 11, lineHeight: 1.6, color: "#c8d0e0" }}>
                      {m.content}
                    </div>
                  ))}
                  {chatLoading && <div style={{ alignSelf: "flex-start", fontSize: 11, color: "#4a6080" }}>Agente digitando...</div>}
                  <div ref={chatEndRef} />
                </div>
                <div style={{ padding: "10px 14px", borderTop: "1px solid #1e2a45", display: "flex", gap: 8 }}>
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="Pergunte sobre a estratégia..."
                    style={{ flex: 1, background: "#0a0e1a", border: "1px solid #1e2a45", borderRadius: 6, padding: "7px 10px", color: "#e8eaf6", fontFamily: "inherit", fontSize: 11, outline: "none" }} />
                  <button onClick={sendChat} disabled={chatLoading} style={{ padding: "7px 14px", borderRadius: 6, background: "linear-gradient(135deg,#00d4a8,#0088ff)", border: "none", color: "#0a0e1a", fontFamily: "inherit", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>↑</button>
                </div>
              </div>
            )}
          </>}

          {/* ═══ GREGAS ═══ */}
          {activeTab === "gregas" && <>
            <div style={card}>
              <div style={lbl}>PARÂMETROS DA OPÇÃO</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 10, color: "#7a8aaa", display: "block", marginBottom: 5 }}>TIPO</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["PUT", "CALL"].map(t => (
                      <button key={t} onClick={() => setGType(t)} style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid", fontFamily: "inherit", fontSize: 12, cursor: "pointer", borderColor: gType === t ? (t === "PUT" ? "#ff4d6d" : "#00d4a8") : "#1e2a45", background: gType === t ? (t === "PUT" ? "rgba(255,77,109,0.12)" : "rgba(0,212,168,0.12)") : "transparent", color: gType === t ? (t === "PUT" ? "#ff4d6d" : "#00d4a8") : "#4a6080" }}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 10, color: "#7a8aaa", display: "block", marginBottom: 5 }}>SELIC (% a.a.)</label>
                  <input value={gRate} onChange={e => setGRate(e.target.value)} style={{ width: "100%", background: "#0a0e1a", border: "1px solid #1e2a45", borderRadius: 6, padding: "8px 10px", color: "#e8eaf6", fontFamily: "inherit", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 10, color: "#7a8aaa", display: "block", marginBottom: 5 }}>STRIKE (R$)</label>
                  <input value={gStrike} onChange={e => setGStrike(e.target.value)} placeholder={`ex: ${(lastPrice * 0.95).toFixed(2)}`}
                    style={{ width: "100%", background: "#0a0e1a", border: "1px solid #1e2a45", borderRadius: 6, padding: "8px 10px", color: "#e8eaf6", fontFamily: "inherit", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 10, color: "#7a8aaa", display: "block", marginBottom: 5 }}>VENCIMENTO</label>
                  <input type="date" value={gExpiry} onChange={e => setGExpiry(e.target.value)}
                    style={{ width: "100%", background: "#0a0e1a", border: "1px solid #1e2a45", borderRadius: 6, padding: "8px 10px", color: "#e8eaf6", fontFamily: "inherit", fontSize: 13, outline: "none", boxSizing: "border-box", colorScheme: "dark" }} />
                </div>
                <div>
                  <label style={{ fontSize: 10, color: "#7a8aaa", display: "block", marginBottom: 5 }}>MARKETPLACE (R$)</label>
                  <input value={mPlace} onChange={e => setMPlace(e.target.value)} placeholder={`ex: 2,00`}
                    style={{ width: "100%", background: "#0a0e1a", border: "1px solid #1e2a45", borderRadius: 6, padding: "8px 10px", color: "#e8eaf6", fontFamily: "inherit", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ padding: "8px 12px", background: "#0a0e1a", borderRadius: 6, marginBottom: 14, fontSize: 11, color: "#4a6080" }}>
                Spot: <span style={{ color: "#00d4a8" }}>R$ {lastPrice?.toFixed(2)}</span> · Vol histórica: <span style={{ color: "#f5a623" }}>{vol.toFixed(1)}%</span> · {activeTicker}
              </div>
              <button onClick={computeGreeks} style={{ width: "100%", padding: 11, borderRadius: 7, background: "linear-gradient(135deg,#7b68ee,#0088ff)", border: "none", color: "#fff", fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                ∂  CALCULAR GREGAS
              </button>
            </div>

            {!greeks && (
              <div style={{ ...card, padding: 40, textAlign: "center", border: "1px dashed #1e2a45", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 36, opacity: 0.3 }}>∂</div>
                <div style={{ fontSize: 12, color: "#4a6080", lineHeight: 1.6 }}>Preencha os dados da opção<br />e clique em <strong style={{ color: "#7b68ee" }}>Calcular Gregas</strong></div>
              </div>
            )}

            {greeks && <>
              {/* Prêmio + Percentil */}
              <div style={{ ...card, border: "1px solid #7b68ee44", boxShadow: "0 0 24px #7b68ee18" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={lbl}>PRÊMIO TEÓRICO · {gType}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: "#7b68ee" }}>R$ {greeks.price?.toFixed(4)}</div>
                    <div style={{ fontSize: 11, color: "#4a6080", marginTop: 4 }}>Strike R$ {greeks.K?.toFixed(2)} · {greeks.daysLeft}d para vencer · {impdVol} Vol. Implícita</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: "#4a6080", marginBottom: 4 }}>MONEYNESS</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: greeks.otmPct > 0 ? "#00d4a8" : "#ff4d6d" }}>
                      {greeks.otmPct > 0 ? "-" : "+"}{Math.abs(greeks.otmPct).toFixed(1)}%
                    </div>
                    <div style={{ fontSize: 9, color: "#4a6080" }}>{greeks.otmPct > 0 ? "fora do dinheiro" : "dentro do dinheiro"}</div>
                  </div>
                </div>


                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: "#4a6080" }}>HV Percentil</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: (greeks.hvPercentil) < 20 ? "#00d4a8" : (greeks.hvPercentil) > 70 ? "#ff4d6d" : "#f5a623" }}>{greeks.hvPercentil}%</span>
                  </div>
                  <div style={{ height: 8, background: "#1e2a45", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(greeks.hvPercentil)}%`, background: `linear-gradient(90deg,#00d4a8,${(greeks.hvPercentil) > 70 ? "#ff4d6d" : "#f5a623"})`, borderRadius: 4, transition: "width 0.8s ease" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                    <span style={{ fontSize: 9, color: "#2a3a55" }}>Baixa</span>
                    <span style={{ fontSize: 10, color: (greeks.hvPercentil) < 20 ? "#00d4a8" : (greeks.hvPercentil) > 70 ? "#ff4d6d" : "#f5a623" }}>
                      {greeks.hvPercentil < 20 ? "Vol baixa — prêmios baratos (melhor comprar vol)" : (greeks.hvPercentil) > 70 ? "Vol alta — prêmios caros (melhor vender vol)" : "→ Vol neutra"}
                    </span>
                    <span style={{ fontSize: 9, color: "#2a3a55" }}>Alta</span>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: "#4a6080" }}>PERCENTIL DO STRIKE NO HISTÓRICO 1 ANO</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: (greeks.percentile) < 20 ? "#00d4a8" : (greeks.percentile) > 70 ? "#ff4d6d" : "#f5a623" }}>{(greeks.percentile).toFixed(1)}%</span>
                  </div>
                  <div style={{ height: 8, background: "#1e2a45", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(greeks.percentile)}%`, background: `linear-gradient(90deg,#00d4a8,${(greeks.percentile) > 70 ? "#ff4d6d" : "#f5a623"})`, borderRadius: 4, transition: "width 0.8s ease" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                    <span style={{ fontSize: 9, color: "#2a3a55" }}>mín</span>
                    <span style={{ fontSize: 10, color: (greeks.percentile) < 20 ? "#00d4a8" : (greeks.percentile) > 70 ? "#ff4d6d" : "#f5a623" }}>
                      {greeks.percentile < 20 ? "✓ Strike bem abaixo do histórico — seguro" : (greeks.percentile) > 70 ? "⚠ Strike alto — risco de exercício elevado" : "→ Faixa intermediária"}
                    </span>
                    <span style={{ fontSize: 9, color: "#2a3a55" }}>máx</span>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: "#4a6080" }}>Chance de terminar ITM</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: (greeks.prob * 100) < 20 ? "#00d4a8" : (greeks.prob * 100) > 70 ? "#ff4d6d" : "#f5a623" }}>{(greeks.prob * 100).toFixed(1)}%</span>
                  </div>
                  <div style={{ height: 8, background: "#1e2a45", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(greeks.prob * 100)}%`, background: `linear-gradient(90deg,#00d4a8,${(greeks.prob * 100) > 70 ? "#ff4d6d" : "#f5a623"})`, borderRadius: 4, transition: "width 0.8s ease" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                    <span style={{ fontSize: 9, color: "#2a3a55" }}>mín</span>
                    <span style={{ fontSize: 10, color: (greeks.prob * 100) < 20 ? "#00d4a8" : (greeks.prob * 100) > 70 ? "#ff4d6d" : "#f5a623" }}>
                      {(greeks.prob * 100) < 20 ? "✓ Baixa probabilidade de exercício" : (greeks.prob * 100) > 70 ? "⚠ Alta probabilidade de exercício" : "→ Probabilidade moderada"}
                    </span>
                    <span style={{ fontSize: 9, color: "#2a3a55" }}>máx</span>
                  </div>
                </div>

              </div>

              {/* Greeks Grid */}
              <div style={card}>
                <div style={lbl}>GREGAS · BLACK-SCHOLES</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <GreekCard label="DELTA (Δ)" value={greeks.delta}
                    color={Math.abs(greeks.delta) < 0.2 ? "#00d4a8" : Math.abs(greeks.delta) > 0.5 ? "#ff4d6d" : "#f5a623"}
                    description={`±R$${Math.abs(greeks.delta).toFixed(4)} no prêmio por R$1 no spot. ${Math.abs(greeks.delta) < 0.2 ? "Baixo risco direcional." : Math.abs(greeks.delta) > 0.5 ? "Alto risco!" : "Moderado."}`}
                  />
                  <GreekCard label="THETA (Θ) /dia" value={greeks.theta}
                    color="#00d4a8"
                    description={`Decaimento: +R$${Math.abs(greeks.theta).toFixed(4)}/dia a seu favor como lançador.`}
                  />
                  <GreekCard label="GAMMA (Γ)" value={greeks.gamma} fmt={v => v.toFixed(6)}
                    color="#f5a623"
                    description="Variação do Delta por R$1 no spot. Aumenta perto do vencimento."
                  />
                  <GreekCard label="VEGA (ν) /1%vol" value={greeks.vega}
                    color="#7b68ee"
                    description="Impacto de 1% de alta na volatilidade implícita sobre o prêmio."
                  />
                </div>
                <div style={{ marginTop: 14, padding: "10px 14px", background: "#0a0e1a", borderRadius: 8, fontSize: 11, color: "#7a8aaa", lineHeight: 1.7 }}>
                  <span style={{ color: "#4a6080", display: "block", fontSize: 9, letterSpacing: "0.08em", marginBottom: 4 }}>LEITURA RÁPIDA</span>
                  {gType === "PUT"
                    ? <>Delta <span style={{ color: "#e8eaf6" }}>{greeks.delta?.toFixed(4)}</span> → a PUT perde <span style={{ color: "#e8eaf6" }}>R${Math.abs(greeks.delta).toFixed(4)}</span> por real de alta no spot. Theta <span style={{ color: "#00d4a8" }}>{Math.abs(greeks.theta).toFixed(4)}</span> → você lucra <span style={{ color: "#00d4a8" }}>R${Math.abs(greeks.theta).toFixed(4)}</span> por dia pelo decaimento do prêmio.</>
                    : <>Delta <span style={{ color: "#e8eaf6" }}>{greeks.delta?.toFixed(4)}</span> → a CALL ganha <span style={{ color: "#e8eaf6" }}>R${Math.abs(greeks.delta).toFixed(4)}</span> por real de alta. Theta <span style={{ color: "#00d4a8" }}>{Math.abs(greeks.theta).toFixed(4)}</span> → decaimento de R${Math.abs(greeks.theta).toFixed(4)}/dia.</>
                  }
                </div>
              </div>

              {/* Chat in gregas tab */}
              <div style={{ ...card, padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e2a45", fontSize: 10, color: "#4a6080", letterSpacing: "0.1em" }}>CHAT COM O AGENTE</div>
                <div style={{ maxHeight: 180, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                  {messages.length === 0 && <div style={{ fontSize: 11, color: "#2a3a55", textAlign: "center", padding: "10px 0" }}>Pergunte sobre as gregas ou estratégia...</div>}
                  {messages.slice(-6).map((m, i) => (
                    <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "88%", background: m.role === "user" ? "rgba(0,212,168,0.12)" : "#0a0e1a", border: `1px solid ${m.role === "user" ? "rgba(0,212,168,0.3)" : "#1e2a45"}`, borderRadius: 8, padding: "8px 12px", fontSize: 11, lineHeight: 1.6, color: "#c8d0e0" }}>
                      {m.content}
                    </div>
                  ))}
                  {chatLoading && <div style={{ alignSelf: "flex-start", fontSize: 11, color: "#4a6080" }}>Agente digitando...</div>}
                  <div ref={chatEndRef} />
                </div>
                <div style={{ padding: "10px 14px", borderTop: "1px solid #1e2a45", display: "flex", gap: 8 }}>
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="Ex: esse Delta está bom para lançar?"
                    style={{ flex: 1, background: "#0a0e1a", border: "1px solid #1e2a45", borderRadius: 6, padding: "7px 10px", color: "#e8eaf6", fontFamily: "inherit", fontSize: 11, outline: "none" }} />
                  <button onClick={sendChat} disabled={chatLoading} style={{ padding: "7px 14px", borderRadius: 6, background: "linear-gradient(135deg,#7b68ee,#0088ff)", border: "none", color: "#fff", fontFamily: "inherit", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>↑</button>
                </div>
              </div>
            </>}
          </>}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "16px 20px", fontSize: 9, color: "#2a3a55", letterSpacing: "0.05em", borderTop: "1px solid #0f1628" }}>
        AVISO: ANÁLISE INFORMATIVA · NÃO CONSTITUI RECOMENDAÇÃO DE INVESTIMENTO · OPÇÕES ENVOLVEM RISCO DE PERDA TOTAL DO CAPITAL
      </div>
    </div>
  );
}