export const PROVINCE_SOCIO_ECONOMIC_DATA = {
  "Aceh": { populationDensity: 92, educationIndex: 72.3, incomePerCapita: 35.4 },
  "Sumatera Utara": { populationDensity: 205, educationIndex: 72.0, incomePerCapita: 55.2 },
  "Sumatera Barat": { populationDensity: 132, educationIndex: 73.2, incomePerCapita: 48.6 },
  "Riau": { populationDensity: 76, educationIndex: 73.1, incomePerCapita: 130.5 },
  "Jambi": { populationDensity: 72, educationIndex: 71.6, incomePerCapita: 59.8 },
  "Sumatera Selatan": { populationDensity: 94, educationIndex: 70.2, incomePerCapita: 57.1 },
  "Bengkulu": { populationDensity: 102, educationIndex: 71.6, incomePerCapita: 40.5 },
  "Lampung": { populationDensity: 260, educationIndex: 70.0, incomePerCapita: 44.1 },
  "Kepulauan Bangka Belitung": { populationDensity: 90, educationIndex: 71.7, incomePerCapita: 58.0 },
  "Kepulauan Riau": { populationDensity: 254, educationIndex: 76.0, incomePerCapita: 133.2 },
  "DKI Jakarta": { populationDensity: 15900, educationIndex: 81.6, incomePerCapita: 280.4 },
  "Jawa Barat": { populationDensity: 1370, educationIndex: 72.4, incomePerCapita: 48.3 },
  "Jawa Tengah": { populationDensity: 1120, educationIndex: 72.1, incomePerCapita: 42.1 },
  "DI Yogyakarta": { populationDensity: 1180, educationIndex: 80.2, incomePerCapita: 45.8 },
  "Jawa Timur": { populationDensity: 860, educationIndex: 72.3, incomePerCapita: 62.5 },
  "Banten": { populationDensity: 1240, educationIndex: 73.0, incomePerCapita: 57.3 },
  "Bali": { populationDensity: 760, educationIndex: 76.0, incomePerCapita: 52.8 },
  "Nusa Tenggara Barat": { populationDensity: 265, educationIndex: 68.6, incomePerCapita: 29.5 },
  "Nusa Tenggara Timur": { populationDensity: 112, educationIndex: 65.2, incomePerCapita: 21.6 },
  "Kalimantan Barat": { populationDensity: 37, educationIndex: 67.9, incomePerCapita: 43.1 },
  "Kalimantan Tengah": { populationDensity: 17, educationIndex: 71.2, incomePerCapita: 62.8 },
  "Kalimantan Selatan": { populationDensity: 110, educationIndex: 71.2, incomePerCapita: 56.4 },
  "Kalimantan Timur": { populationDensity: 30, educationIndex: 76.8, incomePerCapita: 180.2 },
  "Kalimantan Utara": { populationDensity: 9, educationIndex: 71.1, incomePerCapita: 105.4 },
  "Sulawesi Utara": { populationDensity: 190, educationIndex: 73.3, incomePerCapita: 54.1 },
  "Sulawesi Tengah": { populationDensity: 48, educationIndex: 69.7, incomePerCapita: 53.6 },
  "Sulawesi Selatan": { populationDensity: 195, educationIndex: 72.2, incomePerCapita: 58.7 },
  "Sulawesi Tenggara": { populationDensity: 70, educationIndex: 71.6, incomePerCapita: 48.5 },
  "Gorontalo": { populationDensity: 105, educationIndex: 69.0, incomePerCapita: 35.8 },
  "Sulawesi Barat": { populationDensity: 86, educationIndex: 66.3, incomePerCapita: 32.1 },
  "Maluku": { populationDensity: 40, educationIndex: 70.2, incomePerCapita: 30.5 },
  "Maluku Utara": { populationDensity: 41, educationIndex: 68.7, incomePerCapita: 34.2 },
  "Papua Barat": { populationDensity: 11, educationIndex: 65.2, incomePerCapita: 74.5 },
  "Papua": { populationDensity: 13, educationIndex: 60.6, incomePerCapita: 62.1 },
  "Papua Selatan": { populationDensity: 5, educationIndex: 59.0, incomePerCapita: 55.0 },
  "Papua Tengah": { populationDensity: 22, educationIndex: 55.0, incomePerCapita: 70.0 },
  "Papua Pegunungan": { populationDensity: 25, educationIndex: 52.0, incomePerCapita: 35.0 },
  "Papua Barat Daya": { populationDensity: 15, educationIndex: 64.0, incomePerCapita: 68.0 }
};

// Helper function to generate pseudo-randomized kabupten data based on province
export const getKabupatenSocioEconomicData = (provinceName, kabupatenName) => {
  const provData = PROVINCE_SOCIO_ECONOMIC_DATA[provinceName] || { populationDensity: 100, educationIndex: 70, incomePerCapita: 40 };
  
  // Use string hashing to create a deterministic "random" value for the kabupaten
  let hash = 0;
  if (kabupatenName) {
    for (let i = 0; i < kabupatenName.length; i++) {
      hash = kabupatenName.charCodeAt(i) + ((hash << 5) - hash);
    }
  }
  
  // Create a variance between -20% and +20%
  const variance = (Math.abs(hash) % 40) - 20; 
  const factor = 1 + (variance / 100);

  // For density, variance can be much larger for cities vs regencies. Let's add more variance if name contains "Kota"
  let densityFactor = factor;
  if (kabupatenName && kabupatenName.toLowerCase().includes('kota ')) {
    densityFactor *= (3 + (Math.abs(hash) % 5)); // Cities are much denser
  }

  return {
    populationDensity: Math.round(provData.populationDensity * densityFactor),
    educationIndex: Number((provData.educationIndex * (1 + (variance / 200))).toFixed(1)), // Education variance is smaller
    incomePerCapita: Number((provData.incomePerCapita * factor).toFixed(1))
  };
};

export const COMPARISON_METRICS = {
  "Kepadatan Penduduk": { key: "populationDensity", label: "Kepadatan Penduduk", unit: "jiwa/km²", format: (v) => v.toLocaleString('id-ID') },
  "Tingkat Pendidikan": { key: "educationIndex", label: "Indeks Pendidikan", unit: "IPM", format: (v) => v.toFixed(1) },
  "Pendapatan Per Kapita": { key: "incomePerCapita", label: "Pendapatan", unit: "Juta Rp/Tahun", format: (v) => `Rp ${v.toFixed(1)} Jt` },
};
