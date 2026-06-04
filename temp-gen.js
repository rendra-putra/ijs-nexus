const fs = require('fs');
const turf = require('@turf/turf');

const kabUrl = '/Users/rendra/Documents/Data/AAS Course Project/code/justice/public/data/geo/indonesia_kabupaten.json';

let kabData;
try {
  kabData = JSON.parse(fs.readFileSync(kabUrl, 'utf8'));
} catch (e) {
  console.error("Error reading geojson", e);
  process.exit(1);
}

const crimeTypes = ["Kekerasan Seksual", "Korupsi", "Narkotika", "Peradilan Anak"];
const statuses = ["Penyelidikan", "Penyidikan", "Vonis", "Terdakwa", "Pemeriksaan Saksi", "Diversi", "Pemeriksaan Berkas"];
const hotspots = [];
let caseIdCounter = 1;

kabData.features.forEach(f => {
  const province = f.properties.WADMPR || f.properties.PROVINSI || "Unknown Province";
  const kabupaten = f.properties.WADMKK || f.properties.name || "Unknown Kabupaten";
  
  if (!f.geometry || !f.geometry.coordinates) return;

  const numCases = Math.floor(Math.random() * 9) + 2;
  const bbox = turf.bbox(f);
  
  for (let i = 0; i < numCases; i++) {
    const crimeType = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Pick random point strictly inside the polygon
    let lat, lng;
    let found = false;
    let attempts = 0;
    while (!found && attempts < 100) {
      // random point in bbox
      lng = bbox[0] + Math.random() * (bbox[2] - bbox[0]);
      lat = bbox[1] + Math.random() * (bbox[3] - bbox[1]);
      
      const pt = turf.point([lng, lat]);
      try {
        if (f.geometry.type === "MultiPolygon" || f.geometry.type === "Polygon") {
          if (turf.booleanPointInPolygon(pt, f)) {
            found = true;
          }
        } else {
          // If not a polygon, just fallback to bbox center
          break;
        }
      } catch(e) {
        // Just in case of malformed geometry in turf
        break;
      }
      attempts++;
    }
    
    // fallback if couldn't find inside (rare, maybe extremely complex geometry)
    if (!found) {
      lng = (bbox[0] + bbox[2]) / 2;
      lat = (bbox[1] + bbox[3]) / 2;
    }
    
    const startTimestamp = new Date("2019-01-01").getTime();
    const endTimestamp = new Date("2026-12-31").getTime();
    const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp);
    const date = new Date(randomTimestamp).toISOString().split('T')[0];
    
    hotspots.push({
      id: `case-${String(caseIdCounter).padStart(5, '0')}`,
      lat,
      lng,
      province,
      kabupaten,
      address: `Kawasan ${kabupaten}, Titik ${i+1}`,
      crimeType,
      description: `Laporan dugaan tindak pidana ${crimeType} di wilayah ${kabupaten}. Kasus ini tercatat pada ${date} dan saat ini dalam status ${status}.`,
      date,
      status
    });
    
    caseIdCounter++;
  }
});

const fileContent = `// Auto-generated rich mock data based on Indonesian Kabupatens
export const HOTSPOT_DATA = ${JSON.stringify(hotspots, null, 2)};
`;

fs.writeFileSync('/Users/rendra/Documents/Data/AAS Course Project/code/justice/src/data/mockHotspots.js', fileContent);
console.log(`Generated ${hotspots.length} hotspots across ${kabData.features.length} kabupatens.`);
