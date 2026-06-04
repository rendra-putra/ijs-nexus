// Statistical Utility Functions

export const calculatePearsonCorrelation = (x, y) => {
  if (x.length !== y.length || x.length === 0) return 0;
  const n = x.length;
  const sum_x = x.reduce((a, b) => a + b, 0);
  const sum_y = y.reduce((a, b) => a + b, 0);
  const sum_xy = x.reduce((acc, curr, i) => acc + curr * y[i], 0);
  const sum_x2 = x.reduce((a, b) => a + b * b, 0);
  const sum_y2 = y.reduce((a, b) => a + b * b, 0);

  const numerator = (n * sum_xy) - (sum_x * sum_y);
  const denominator = Math.sqrt((n * sum_x2 - sum_x * sum_x) * (n * sum_y2 - sum_y * sum_y));

  if (denominator === 0) return 0;
  return numerator / denominator;
};

export const getCorrelationInterpretation = (r, metricName) => {
  const absR = Math.abs(r);
  let strength = "";
  if (absR >= 0.7) strength = "Sangat Kuat";
  else if (absR >= 0.5) strength = "Kuat";
  else if (absR >= 0.3) strength = "Sedang";
  else strength = "Lemah";

  const direction = r > 0 ? "Berbanding Lurus" : "Berbanding Terbalik";

  if (absR < 0.2) {
    return `Tidak ditemukan korelasi yang signifikan antara tingkat kejahatan dan ${metricName}. Faktor lain mungkin lebih dominan dalam memengaruhi angka kriminalitas di wilayah ini.`;
  }

  return `Terdapat korelasi yang **${strength}** (${direction}). ${r > 0 ? `Wilayah dengan ${metricName} yang lebih tinggi cenderung memiliki angka kejahatan yang lebih tinggi pula.` : `Wilayah dengan ${metricName} yang lebih tinggi cenderung memiliki angka kejahatan yang lebih rendah.`} Hal ini dapat menjadi acuan untuk intervensi kebijakan.`;
};

// Simple linear regression: y = mx + c
// Returns a function that computes expected y for a given x, for drawing a trendline
export const calculateLinearRegression = (x, y) => {
  if (x.length !== y.length || x.length === 0) return { m: 0, c: 0, predict: () => 0 };
  const n = x.length;
  const sum_x = x.reduce((a, b) => a + b, 0);
  const sum_y = y.reduce((a, b) => a + b, 0);
  const sum_xy = x.reduce((acc, curr, i) => acc + curr * y[i], 0);
  const sum_x2 = x.reduce((a, b) => a + b * b, 0);

  const m = (n * sum_xy - sum_x * sum_y) / (n * sum_x2 - sum_x * sum_x);
  const c = (sum_y - m * sum_x) / n;

  return {
    m,
    c,
    predict: (valX) => m * valX + c
  };
};
