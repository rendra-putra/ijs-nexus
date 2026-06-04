import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet default marker icon missing in production (Vite/Webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});
import { scaleQuantize } from "d3-scale";
import MarkerClusterGroup from "react-leaflet-cluster";
import { HOTSPOT_DATA } from "../../data/mockHotspots";
import { getKabupatenSocioEconomicData, COMPARISON_METRICS, PROVINCE_SOCIO_ECONOMIC_DATA } from "../../data/mockSocioEconomic";

const provUrl = "/data/geo/indonesia_provinsi.json"; 
const kabUrl = "/data/geo/indonesia_kabupaten.json";

const DynamicMapController = ({ hotspots, selectedProvince, selectedKabupaten }) => {
  const map = useMap();
  useEffect(() => {
    const isFilteredProv = selectedProvince && selectedProvince !== "Semua Provinsi";
    const isFilteredKab = selectedKabupaten && selectedKabupaten !== "Semua Kabupaten";

    if (isFilteredProv || isFilteredKab) {
      if (hotspots.length > 0) {
        const bounds = L.latLngBounds(hotspots.map(h => [h.lat, h.lng]));
        map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5, maxZoom: 12 });
      }
    } else {
      map.flyTo([-2.5, 118], 5, { duration: 1.5 });
    }
  }, [hotspots, selectedProvince, selectedKabupaten, map]);
  return null;
};

let currentMapZoom = 5;

const ZoomTracker = () => {
  const map = useMap();
  useEffect(() => {
    currentMapZoom = map.getZoom();
    const onZoom = () => { currentMapZoom = map.getZoom(); };
    map.on('zoomend', onZoom);
    return () => map.off('zoomend', onZoom);
  }, [map]);
  return null;
};

const createClusterCustomIcon = function (cluster) {
  const count = cluster.getChildCount();
  let redThresh = 50;
  let yellowThresh = 15;
  if (currentMapZoom >= 10) { redThresh = 5; yellowThresh = 2; }
  else if (currentMapZoom >= 8) { redThresh = 15; yellowThresh = 5; }
  else if (currentMapZoom >= 6) { redThresh = 30; yellowThresh = 10; }

  let bgColor = "rgba(34, 197, 94, 0.85)"; 
  let borderColor = "rgba(34, 197, 94, 0.3)";
  if (count >= redThresh) {
    bgColor = "rgba(239, 68, 68, 0.85)"; 
    borderColor = "rgba(239, 68, 68, 0.3)";
  } else if (count >= yellowThresh) {
    bgColor = "rgba(234, 179, 8, 0.85)"; 
    borderColor = "rgba(234, 179, 8, 0.3)";
  }

  return L.divIcon({
    html: `
      <div style="
        background: ${bgColor}; 
        color: white; 
        width: 38px; height: 38px; 
        border-radius: 50%; 
        display: flex; justify-content: center; alignItems: center; 
        font-weight: 700; font-family: Inter;
        box-shadow: 0 0 0 6px ${borderColor};
        border: 2px solid white;
        transition: all 0.3s ease;
      ">
        <span style="margin: auto">${count}</span>
      </div>`,
    className: 'custom-cluster-icon',
    iconSize: L.point(38, 38, true),
  });
};

const IndonesiaMap = ({ 
  onRegionClick, onHotspotClick, onDataAggregated,
  selectedIndicator = "Semua Tindak Kejahatan", 
  mapMode = "Hotspots", 
  selectedProvince, selectedKabupaten, selectedYear,
  mapDataMode = "Crime", // "Crime" or "SocioEconomic"
  selectedMetric = "None",
  regionFilter = null // optional function (regionName) => boolean
}) => {
  const [data, setData] = useState({});
  const [provData, setProvData] = useState(null);
  const [kabData, setKabData] = useState(null);
  const [error, setError] = useState(false);
  const [level, setLevel] = useState("provinsi");

  useEffect(() => {
    fetch(provUrl)
      .then(res => res.json())
      .then(json => setProvData(json))
      .catch(err => setError(true));
    fetch(kabUrl)
      .then(res => res.json())
      .then(json => setKabData(json))
      .catch(err => console.error(err));
  }, []);

  const activeGeoData = React.useMemo(() => {
    if (mapMode === "Hotspots" && selectedKabupaten && selectedKabupaten !== "Semua Kabupaten") return kabData;
    if (level === "provinsi") return provData;
    if (level === "kabupaten") return kabData;
    return provData;
  }, [level, provData, kabData, mapMode, selectedKabupaten]);

  const filteredHotspots = useMemo(() => {
    return HOTSPOT_DATA.filter(h => {
      const matchIndicator = (!selectedIndicator || selectedIndicator === "Semua Tindak Kejahatan") ? true : h.crimeType === selectedIndicator;
      const matchProv = (!selectedProvince || selectedProvince === "Semua Provinsi") ? true : h.province === selectedProvince;
      const matchKab = (!selectedKabupaten || selectedKabupaten === "Semua Kabupaten") ? true : h.kabupaten === selectedKabupaten;
      const matchYear = (!selectedYear || selectedYear === "Semua Tahun") ? true : new Date(h.date).getFullYear().toString() === selectedYear.toString();
      return matchIndicator && matchProv && matchKab && matchYear;
    });
  }, [selectedIndicator, selectedProvince, selectedKabupaten, selectedYear]);

  // Compute filtered GeoData BEFORE data mapping to pass correct regions to Dashboard
  const filteredGeoData = useMemo(() => {
    if (!activeGeoData) return null;
    let features = activeGeoData.features;

    const isFilteredProv = selectedProvince && selectedProvince !== "Semua Provinsi";
    const isFilteredKab = selectedKabupaten && selectedKabupaten !== "Semua Kabupaten";
    const activeLevel = (mapMode === "Hotspots" && isFilteredKab) ? "kabupaten" : level;

    if (isFilteredProv) {
      features = features.filter(f => {
        const provName = f.properties.WADMPR || f.properties.PROVINSI;
        return provName === selectedProvince;
      });
    }

    if (isFilteredKab && activeLevel === "kabupaten") {
      features = features.filter(f => {
        const kabName = f.properties.WADMKK || f.properties.name;
        return kabName === selectedKabupaten;
      });
    }
    
    // Always return GeoData so boundaries are drawn and data is aggregated
    return { ...activeGeoData, features };
  }, [activeGeoData, selectedProvince, selectedKabupaten, level, mapMode]);

  useEffect(() => {
    if (filteredGeoData) {
      const newData = {};
      const newScatterData = [];
      const isProv = level === "provinsi";
      
      const processed = new Set();

      filteredGeoData.features.forEach(f => {
        const regionName = isProv 
          ? (f.properties.WADMPR || f.properties.PROVINSI || f.properties.name || "Unknown")
          : (f.properties.WADMKK || f.properties.name || "Unknown");
        
        if (processed.has(regionName)) return;
        processed.add(regionName);

        const provName = isProv ? regionName : (f.properties.WADMPR || f.properties.PROVINSI || "Unknown");

        const cases = filteredHotspots.filter(h => isProv ? h.province === regionName : h.kabupaten === regionName).length;
        let metricValue = 0;

        if (selectedMetric !== "None") {
          const metricKey = COMPARISON_METRICS[selectedMetric]?.key;
          if (isProv) {
            metricValue = PROVINCE_SOCIO_ECONOMIC_DATA[regionName]?.[metricKey] || 0;
          } else {
            metricValue = getKabupatenSocioEconomicData(provName, regionName)[metricKey] || 0;
          }
        }

        newData[regionName] = (mapDataMode === "Crime" || selectedMetric === "None") ? cases : metricValue;
        
        newScatterData.push({ regionName, cases, metricValue, provName, isProv });
      });
      
      setData(newData);
      if (onDataAggregated) {
        onDataAggregated(newScatterData);
      }
    }
  }, [filteredGeoData, filteredHotspots, level, mapDataMode, selectedMetric]); 

  const colorScale = useMemo(() => {
    const vals = Object.values(data).filter(v => v > 0);
    const maxVal = vals.length > 0 ? Math.max(...vals) : 100;
    const minVal = vals.length > 0 ? Math.min(...vals) : 0;
    
    if (mapDataMode === "SocioEconomic" && selectedMetric !== "None") {
      return scaleQuantize()
        .domain([minVal, maxVal])
        .range([
          "#93c5fd",
          "#60a5fa",
          "#3b82f6",
          "#2563eb",
          "#1d4ed8",
          "#1e3a8a"
        ]);
    }

    return scaleQuantize()
      .domain([0, maxVal])
      .range([
        "#22c55e", "#a3e635", "#fde047", "#fb923c", "#ef4444", "#991b1b"
      ]);
  }, [data, mapDataMode, selectedMetric]);

  const onEachFeature = (feature, layer) => {
    const isProvinsiLevel = level === "provinsi";
    const regionName = isProvinsiLevel 
      ? (feature.properties.WADMPR || feature.properties.PROVINSI || feature.properties.name || "Unknown")
      : (feature.properties.WADMKK || feature.properties.name || "Unknown");
    
    const value = data[regionName] || 0;
    
    if (mapMode === "Boundaries") {
      let tooltipText = `<b>${regionName}</b><br/>`;
      if (mapDataMode === "SocioEconomic" && selectedMetric !== "None") {
        tooltipText += `${COMPARISON_METRICS[selectedMetric].format(value)}<br/>`;
      } else {
        tooltipText += `${value} Cases<br/>`;
      }
      tooltipText += `<span style="font-size:10px; color:#666;">${isProvinsiLevel ? "Click to view Kabupaten" : "Kabupaten Level"}</span>`;
      
      layer.bindTooltip(tooltipText, { sticky: true, className: 'custom-tooltip', direction: 'top' });
    }

    layer.on({
      click: () => {
        if (mapMode === "Boundaries" && onRegionClick) {
          onRegionClick(regionName, value, selectedIndicator);
        }
      },
      mouseover: (e) => {
        if (mapMode !== "Boundaries") return;
        const targetLayer = e.target;
        targetLayer.setStyle({ fillOpacity: 0.95, weight: 2, color: '#1890ff' });
        targetLayer.bringToFront();
      },
      mouseout: (e) => {
        if (mapMode !== "Boundaries") return;
        const targetLayer = e.target;
        // reset style
        const isVisible = regionFilter ? regionFilter(regionName) : true;
        targetLayer.setStyle({
          fillOpacity: isVisible ? 0.85 : 0.1,
          weight: 1,
          color: '#ffffff'
        });
      }
    });
  };

  const styleFunction = (feature) => {
    const isProvinsiLevel = level === "provinsi";
    const regionName = isProvinsiLevel 
      ? (feature.properties.WADMPR || feature.properties.PROVINSI || feature.properties.name || "Unknown")
      : (feature.properties.WADMKK || feature.properties.name || "Unknown");
      
    const value = data[regionName] || 0;
    
    const isVisible = regionFilter ? regionFilter(regionName) : true;

    if (mapMode === "Hotspots") {
      const isFilteredProv = selectedProvince && selectedProvince !== "Semua Provinsi";
      const isFilteredKab = selectedKabupaten && selectedKabupaten !== "Semua Kabupaten";
      
      if (!isFilteredProv && !isFilteredKab) {
        return { opacity: 0, fillOpacity: 0, weight: 0 };
      }

      return {
        fillColor: "#4f46e5", weight: 1, color: '#818cf8',
        opacity: 0.5, dashArray: '3, 4', fillOpacity: 0.05
      };
    }

    return {
      fillColor: isVisible ? colorScale(value) : "#e5e7eb",
      weight: 1,
      opacity: 1,
      color: '#ffffff',
      fillOpacity: isVisible ? 0.85 : 0.2
    };
  };

  if (error) return <div style={{ textAlign: 'center', padding: '40px' }}>Map boundary file not found.</div>;
  if (!provData) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading Map Data...</div>;

  const lightBasemap = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  const geoJsonKey = `${level}-${selectedIndicator}-${mapMode}-${selectedProvince}-${selectedKabupaten}-${selectedYear}-${colorScale.domain()[1]}-${mapDataMode}-${selectedMetric}-${regionFilter ? 'filtered' : 'unfiltered'}`;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", zIndex: 1, background: '#f8fafc' }}>
      
      {mapMode === "Boundaries" && (
        <div style={{
          position: 'absolute', top: 16, right: 16, zIndex: 1000, 
          background: 'rgba(255, 255, 255, 0.85)', padding: '4px', borderRadius: 24, 
          backdropFilter: 'blur(10px)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          display: 'flex', gap: '2px', border: '1px solid rgba(255, 255, 255, 0.4)'
        }}>
          <div onClick={() => setLevel("provinsi")} style={{ padding: '4px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.2s ease', background: level === "provinsi" ? '#4f46e5' : 'transparent', color: level === "provinsi" ? '#fff' : '#4b5563', boxShadow: level === "provinsi" ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none' }}>Provinsi</div>
          <div onClick={() => setLevel("kabupaten")} style={{ padding: '4px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.2s ease', background: level === "kabupaten" ? '#4f46e5' : 'transparent', color: level === "kabupaten" ? '#fff' : '#4b5563', boxShadow: level === "kabupaten" ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none' }}>Kabupaten</div>
        </div>
      )}

      <MapContainer center={[-2.5, 118]} zoom={5} style={{ width: "100%", height: "100%", borderRadius: 16 }} zoomControl={false}>
        <ZoomTracker />
        <DynamicMapController hotspots={filteredHotspots} selectedProvince={selectedProvince} selectedKabupaten={selectedKabupaten} />
        <TileLayer attribution='&copy; OpenStreetMap &copy; CartoDB' url={lightBasemap} />
        
        {filteredGeoData && (
          <GeoJSON key={geoJsonKey} data={filteredGeoData} style={styleFunction} onEachFeature={onEachFeature} />
        )}

        {mapMode === "Hotspots" && (
          <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon} showCoverageOnHover={false} maxClusterRadius={60}>
            {filteredHotspots.map((hotspot) => (
              <Marker key={hotspot.id} position={[hotspot.lat, hotspot.lng]} eventHandlers={{ click: () => { if (onHotspotClick) onHotspotClick(hotspot); } }} />
            ))}
          </MarkerClusterGroup>
        )}
        <ZoomControl position="bottomright" />
      </MapContainer>
      
      {mapMode === "Boundaries" && (
        <div style={{ position: 'absolute', bottom: 30, left: 20, zIndex: 1000, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', padding: '12px 16px', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#333' }}>
            {mapDataMode === "Crime" || selectedMetric === "None" ? selectedIndicator : COMPARISON_METRICS[selectedMetric]?.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 10, marginRight: 4, color: '#888' }}>Low</span>
            {colorScale.range().map((color, idx) => (
              <div key={idx} style={{ width: 16, height: 16, backgroundColor: color, borderRadius: 2 }} />
            ))}
            <span style={{ fontSize: 10, marginLeft: 4, color: '#888' }}>High</span>
          </div>
          <div style={{ fontSize: 10, marginTop: 4, color: '#aaa', textAlign: 'center' }}>
            Max: {mapDataMode === "Crime" ? Math.round(colorScale.domain()[1]) + " Cases" : COMPARISON_METRICS[selectedMetric]?.format(colorScale.domain()[1])}
          </div>
        </div>
      )}
    </div>
  );
};

export default IndonesiaMap;
