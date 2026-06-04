import { SearchOutlined, FilterOutlined, EnvironmentOutlined, BarChartOutlined, DotChartOutlined } from "@ant-design/icons";
import { Card, Col, Input, Row, Space, Typography, Segmented, Select, Tag, Divider, Slider } from "antd";
import { motion } from "framer-motion";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import IndonesiaMap from "./IndonesiaMap";
import { HOTSPOT_DATA } from "../../data/mockHotspots";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, Legend } from 'recharts';
import { COMPARISON_METRICS } from "../../data/mockSocioEconomic";
import CorrelationAnalysis from "./CorrelationAnalysis";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const INDICATORS = ["Kekerasan Seksual", "Korupsi", "Narkotika", "Peradilan Anak"];
const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

export default function JusticeDashboard() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState("Semua Tindak Kejahatan");
  const [selectedYear, setSelectedYear] = useState("Semua Tahun");
  const [mapMode, setMapMode] = useState("Hotspots"); // Hotspots, Boundaries
  const [loading, setLoading] = useState(false);
  
  // Filter States
  const [selectedProvince, setSelectedProvince] = useState("Semua Provinsi");
  const [selectedKabupaten, setSelectedKabupaten] = useState("Semua Kabupaten");

  // Socio-Economic States
  const [selectedMetric, setSelectedMetric] = useState("None");
  const [mapDataMode, setMapDataMode] = useState("Crime"); // Crime, SocioEconomic
  
  // Map Data State (Received from IndonesiaMap)
  const [scatterData, setScatterData] = useState([]);

  // Sliders State
  const [crimeRange, setCrimeRange] = useState([0, 100]);
  const [metricRange, setMetricRange] = useState([0, 100]);

  const handleSearch = (value) => {
    if (!value) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1500); 
  };

  const provinces = useMemo(() => {
    const provs = new Set(HOTSPOT_DATA.map(h => h.province));
    return Array.from(provs).sort();
  }, []);

  const kabupatens = useMemo(() => {
    if (!selectedProvince || selectedProvince === "Semua Provinsi") return [];
    const kabs = new Set(HOTSPOT_DATA.filter(h => h.province === selectedProvince).map(h => h.kabupaten));
    return Array.from(kabs).sort();
  }, [selectedProvince]);

  const handleProvinceChange = (val) => {
    setSelectedProvince(val);
    setSelectedKabupaten("Semua Kabupaten"); 
    setSelectedHotspot(null);
    if (val !== "Semua Provinsi") {
      setSelectedRegion({ name: val, val: 0, ind: selectedIndicator });
    } else {
      setSelectedRegion(null);
    }
  };

  const handleKabupatenChange = (val) => {
    setSelectedKabupaten(val);
    setSelectedHotspot(null);
    if (val !== "Semua Kabupaten") {
      setSelectedRegion({ name: val, val: 0, ind: selectedIndicator });
    } else if (selectedProvince !== "Semua Provinsi") {
      setSelectedRegion({ name: selectedProvince, val: 0, ind: selectedIndicator });
    } else {
      setSelectedRegion(null);
    }
  };
  
  // Callback from IndonesiaMap
  const handleDataAggregated = useCallback((data) => {
    setScatterData(data);
  }, []);

  // Compute Data Bounds for Sliders
  const bounds = useMemo(() => {
    if (scatterData.length === 0) return { minC: 0, maxC: 100, minM: 0, maxM: 100 };
    const casesArr = scatterData.map(r => r.cases);
    const metricsArr = scatterData.map(r => r.metricValue);
    
    return {
      minC: Math.min(...casesArr),
      maxC: Math.max(...casesArr) || 1,
      minM: Math.min(...metricsArr),
      maxM: Math.max(...metricsArr) || 1
    };
  }, [scatterData]);

  // Update slider default ranges when bounds/metric changes
  useEffect(() => {
    setCrimeRange([bounds.minC, bounds.maxC]);
    setMetricRange([bounds.minM, bounds.maxM]);
  }, [bounds.minC, bounds.maxC, bounds.minM, bounds.maxM, selectedMetric]);

  const regionFilterFunction = useMemo(() => {
    if (selectedMetric === "None") return null;
    return (regionName) => {
      const regionData = scatterData.find(r => r.regionName === regionName);
      if (!regionData) return false;
      
      const passCrime = regionData.cases >= crimeRange[0] && regionData.cases <= crimeRange[1];
      const passMetric = regionData.metricValue >= metricRange[0] && regionData.metricValue <= metricRange[1];

      return passCrime && passMetric;
    };
  }, [selectedMetric, scatterData, crimeRange, metricRange]);


  // Monthly Data Calculation for AreaChart
  const monthlyData = useMemo(() => {
    if (!selectedRegion) return [];
    
    const relevantCases = HOTSPOT_DATA.filter(h => {
      const isProvLevel = provinces.includes(selectedRegion.name);
      const matchReg = isProvLevel ? h.province === selectedRegion.name : h.kabupaten === selectedRegion.name;
      const matchInd = selectedIndicator === "Semua Tindak Kejahatan" ? true : h.crimeType === selectedIndicator;
      const matchYear = selectedYear === "Semua Tahun" ? true : new Date(h.date).getFullYear() === parseInt(selectedYear);
      return matchReg && matchInd && matchYear;
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const aggregated = months.map(m => ({ name: m, cases: 0, forecastCases: null }));
    
    let totalJanMay = 0;
    relevantCases.forEach(c => {
      const d = new Date(c.date);
      const mIdx = d.getMonth();
      if (mIdx >= 0 && mIdx < 12) {
        aggregated[mIdx].cases += 1;
        if (mIdx < 5) totalJanMay += 1;
      }
    });
    
    if (selectedYear === 2026 || selectedYear === "2026" || selectedYear === "Semua Tahun") {
      const avg = totalJanMay / 5;
      let prevForecast = aggregated[4].cases;
      aggregated[4].forecastCases = prevForecast;
      for (let i = 5; i < 11; i++) {
        aggregated[i].cases = null;
        let nextForecast = prevForecast * (1 + (Math.random() * 0.4 - 0.2)); 
        if (nextForecast === 0 && avg > 0) nextForecast = avg;
        else if (nextForecast === 0) nextForecast = Math.random() * 5; 
        aggregated[i].forecastCases = Math.max(0, Math.round(nextForecast));
        prevForecast = nextForecast;
      }
      aggregated[11].cases = null;
    }
    return aggregated;
  }, [selectedRegion, selectedIndicator, selectedYear, provinces]);

  return (
    <div style={{ padding: "24px 24px", maxWidth: 1600, margin: "0 auto", position: "relative", zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: 24 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
          <div style={{ textAlign: "left" }}>
            <Title level={3} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, margin: 0, color: '#111827' }}>
              IJS Nexus Explorer
            </Title>
            <Text type="secondary" style={{ fontSize: 14 }}>
              Interactive analytics for inclusive justice data across Indonesia.
            </Text>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            {/* Search input removed as requested */}
          </div>
        </div>

        {/* Global Filters Bar */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', background: 'white', padding: '12px 16px', borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' }}>
          <Select value={selectedYear} onChange={(val) => { setSelectedYear(val); setSelectedHotspot(null); }} style={{ width: 140 }}>
            <Option value="Semua Tahun">Semua Tahun</Option>
            {YEARS.map(y => <Option key={y} value={y}>{y}</Option>)}
          </Select>
          <Select value={selectedProvince} onChange={handleProvinceChange} style={{ width: 160 }} showSearch dropdownMatchSelectWidth={false}>
            <Option value="Semua Provinsi">Semua Provinsi</Option>
            {provinces.map(p => <Option key={p} value={p}>{p}</Option>)}
          </Select>
          <Select value={selectedKabupaten} onChange={handleKabupatenChange} disabled={selectedProvince === "Semua Provinsi"} style={{ width: 180 }} showSearch dropdownMatchSelectWidth={false}>
            <Option value="Semua Kabupaten">Semua Kabupaten</Option>
            {kabupatens.map(k => <Option key={k} value={k}>{k}</Option>)}
          </Select>
          <Select value={selectedIndicator} onChange={(val) => { setSelectedIndicator(val); setSelectedRegion(null); setSelectedHotspot(null); }} style={{ width: 200 }} dropdownMatchSelectWidth={false}>
            <Option value="Semua Tindak Kejahatan">Semua Kriminalitas</Option>
            {INDICATORS.map(ind => <Option key={ind} value={ind}>{ind}</Option>)}
          </Select>
          
          <Divider type="vertical" style={{ height: 32 }} />
          
          {/* Socio-Economic Compare Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: 500, color: '#4b5563' }}>Bandingkan Dengan:</Text>
            <Select 
              value={selectedMetric} 
              onChange={(val) => {
                setSelectedMetric(val);
                if (val === "None") {
                  setMapDataMode("Crime");
                } else {
                  setMapMode("Boundaries");
                }
              }} 
              style={{ width: 180 }}
              dropdownMatchSelectWidth={false}
            >
              <Option value="None">Tidak Ada</Option>
              {Object.keys(COMPARISON_METRICS).map(m => <Option key={m} value={m}>{m}</Option>)}
            </Select>
          </div>
        </div>

        {/* Map Control Bar (Appears when comparison is active) */}
        {selectedMetric !== "None" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: 12, display: 'flex', gap: 16, alignItems: 'center', padding: '8px 16px', background: 'rgba(239, 246, 255, 0.5)', borderRadius: 8, border: '1px solid #bfdbfe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: 600, color: '#1d4ed8' }}>Visualisasi Peta:</Text>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.85)', padding: '4px', borderRadius: 24, 
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                display: 'flex', gap: '2px', border: '1px solid rgba(226, 232, 240, 1)'
              }}>
                <div 
                  onClick={() => { setMapDataMode("Crime"); setMapMode("Boundaries"); }}
                  style={{ 
                    padding: '4px 14px', borderRadius: 20, cursor: 'pointer', 
                    fontSize: 12, fontWeight: 600, transition: 'all 0.2s ease', 
                    background: mapDataMode === "Crime" ? '#4f46e5' : 'transparent', 
                    color: mapDataMode === "Crime" ? '#fff' : '#4b5563', 
                    boxShadow: mapDataMode === "Crime" ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none' 
                  }}
                >
                  Tingkat Kriminalitas
                </div>
                <div 
                  onClick={() => { setMapDataMode("SocioEconomic"); setMapMode("Boundaries"); }}
                  style={{ 
                    padding: '4px 14px', borderRadius: 20, cursor: 'pointer', 
                    fontSize: 12, fontWeight: 600, transition: 'all 0.2s ease', 
                    background: mapDataMode === "SocioEconomic" ? '#4f46e5' : 'transparent', 
                    color: mapDataMode === "SocioEconomic" ? '#fff' : '#4b5563', 
                    boxShadow: mapDataMode === "SocioEconomic" ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none' 
                  }}
                >
                  Data {selectedMetric}
                </div>
              </div>
            </div>
            <Divider type="vertical" />
            <Text style={{ fontSize: 12, color: '#4b5563' }}>
              Atur slider di panel kanan untuk menyorot wilayah spesifik.
            </Text>
          </motion.div>
        )}
      </motion.div>

      {/* Main Content Area - Fixed 17/7 Layout */}
      <Row gutter={[24, 24]} style={{ flex: 1, minHeight: 600 }}>
        <Col xs={24} lg={17} style={{ display: 'flex', flexDirection: 'column' }}>
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} style={{ flex: 1, minHeight: 500 }}>
            <Card 
              style={{ borderRadius: 16, border: '1px solid #f0f0f0', background: '#ffffff', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: "0 10px 30px rgba(0,0,0,0.05)", overflow: 'hidden' }}
              styles={{ body: { padding: 0, width: '100%', height: '100%', position: 'relative' } }}
            >
              <div style={{ 
                position: 'absolute', top: 16, left: 16, zIndex: 1000,
                background: 'rgba(255, 255, 255, 0.85)', padding: '4px', borderRadius: 24, 
                backdropFilter: 'blur(10px)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                display: 'flex', gap: '2px', border: '1px solid rgba(255, 255, 255, 0.4)'
              }}>
                <div 
                  onClick={() => { setMapMode("Hotspots"); setSelectedHotspot(null); setSelectedRegion(null); }}
                  style={{ 
                    padding: '4px 14px', borderRadius: 20, cursor: 'pointer', 
                    fontSize: 12, fontWeight: 600, transition: 'all 0.2s ease', 
                    background: mapMode === "Hotspots" ? '#4f46e5' : 'transparent', 
                    color: mapMode === "Hotspots" ? '#fff' : '#4b5563', 
                    boxShadow: mapMode === "Hotspots" ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none' 
                  }}
                >
                  Hotspots
                </div>
                <div 
                  onClick={() => { setMapMode("Boundaries"); setSelectedHotspot(null); setSelectedRegion(null); }}
                  style={{ 
                    padding: '4px 14px', borderRadius: 20, cursor: 'pointer', 
                    fontSize: 12, fontWeight: 600, transition: 'all 0.2s ease', 
                    background: mapMode === "Boundaries" ? '#4f46e5' : 'transparent', 
                    color: mapMode === "Boundaries" ? '#fff' : '#4b5563', 
                    boxShadow: mapMode === "Boundaries" ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none' 
                  }}
                >
                  Boundaries
                </div>
              </div>

              <IndonesiaMap 
                selectedIndicator={selectedIndicator}
                selectedYear={selectedYear}
                mapMode={mapMode}
                selectedProvince={selectedProvince}
                selectedKabupaten={selectedKabupaten}
                mapDataMode={mapDataMode}
                selectedMetric={selectedMetric}
                regionFilter={regionFilterFunction}
                onDataAggregated={handleDataAggregated}
                onRegionClick={(name, val, ind) => {
                  setSelectedRegion({ name, val, ind });
                  setSelectedHotspot(null);
                }} 
                onHotspotClick={(hotspot) => {
                  setSelectedHotspot(hotspot);
                  setSelectedRegion(null);
                }}
              />
            </Card>
          </motion.div>
        </Col>
        
        <Col xs={24} lg={7} style={{ display: 'flex', flexDirection: 'column' }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} style={{ flex: 1, minHeight: 500 }}>
            <Card 
              title={
                <Space>
                  {selectedMetric !== "None" ? <DotChartOutlined style={{ color: '#ec4899' }} /> : (selectedHotspot ? <EnvironmentOutlined style={{ color: '#ef4444' }} /> : <BarChartOutlined style={{ color: '#1890ff' }} />)}
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 700, color: '#111827' }}>
                    {selectedMetric !== "None" ? "Socio-Economic Analysis" : (selectedHotspot ? "Case Details" : "Region Insights")}
                  </span>
                </Space>
              }
              style={{ borderRadius: 16, border: '1px solid #f0f0f0', height: '100%', background: '#ffffff', boxShadow: "0 10px 30px rgba(0,0,0,0.05)", overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
              styles={{ 
                header: { borderBottom: '1px solid #f0f0f0' },
                body: { flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', overflow: 'auto' }
              }}
            >
              {selectedMetric !== "None" ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
                  {/* Slider Controls */}
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text style={{ fontSize: 13, fontWeight: 600 }}>Filter Kasus Kriminalitas</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{crimeRange[0]} - {crimeRange[1]}</Text>
                      </div>
                      <Slider range min={bounds.minC} max={bounds.maxC} value={crimeRange} onChange={(val) => setCrimeRange(val)} tooltip={{ open: false }} />
                    </div>
                    
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text style={{ fontSize: 13, fontWeight: 600 }}>Filter {COMPARISON_METRICS[selectedMetric]?.label}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {COMPARISON_METRICS[selectedMetric]?.format(metricRange[0])} - {COMPARISON_METRICS[selectedMetric]?.format(metricRange[1])}
                        </Text>
                      </div>
                      <Slider range min={bounds.minM} max={bounds.maxM} value={metricRange} onChange={(val) => setMetricRange(val)} tooltip={{ open: false }} step={selectedMetric === 'Pendapatan Per Kapita' || selectedMetric === 'Tingkat Pendidikan' ? 0.1 : 1} />
                    </div>
                  </div>

                  <CorrelationAnalysis data={scatterData} selectedMetric={selectedMetric} />
                </div>
              ) : selectedHotspot ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <Tag color="red" style={{ marginBottom: 8, fontWeight: 600, padding: '4px 8px' }}>{selectedHotspot.crimeType}</Tag>
                      <Title level={4} style={{ margin: 0 }}>{selectedHotspot.id}</Title>
                      <Text type="secondary" style={{ fontSize: 13 }}>{new Date(selectedHotspot.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                    </div>
                    <Divider style={{ margin: '12px 0' }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Location</Text>
                      <Text style={{ fontWeight: 500 }}>{selectedHotspot.address}</Text><br/>
                      <Text type="secondary">{selectedHotspot.kabupaten}, {selectedHotspot.province}</Text>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Description</Text>
                      <Paragraph style={{ margin: 0, color: '#374151' }}>{selectedHotspot.description}</Paragraph>
                    </div>
                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: 8, marginTop: 8 }}>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Current Status</Text>
                      <Text style={{ fontWeight: 600, color: '#0f172a', fontSize: 16 }}>{selectedHotspot.status}</Text>
                    </div>
                  </Space>
                </motion.div>
              ) : selectedRegion ? (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Selected Region</Text>
                    <Title level={3} style={{ margin: "4px 0 0 0", color: '#111827' }}>{selectedRegion.name}</Title>
                  </div>
                  
                  <div style={{ padding: "20px", background: "#f8fafc", borderRadius: 12, borderLeft: "4px solid #ef4444", border: "1px solid #f3f4f6" }}>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>{selectedIndicator}</Text>
                    <Title level={2} style={{ margin: 0, color: '#ef4444', fontWeight: 800 }}>
                      {monthlyData.reduce((sum, item) => sum + (item.cases || 0), 0)}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Total Reported Cases</Text>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <Text style={{ display: 'block', marginBottom: 16, fontWeight: 600, color: '#374151', fontSize: 15 }}>
                      Monthly Trend {selectedYear !== "Semua Tahun" ? `(${selectedYear})` : "(All Years)"}
                    </Text>
                    <div style={{ height: 220, width: '100%', marginLeft: -16 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/><stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/></linearGradient>
                            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} width={40} />
                          <RechartsTooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} labelStyle={{ fontWeight: 600, color: '#333' }} />
                          <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 500 }} />
                          <Area type="monotone" dataKey="cases" name="Actual Cases" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorCases)" connectNulls={false} />
                          <Area type="monotone" dataKey="forecastCases" name="Forecast (6 Months)" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecast)" connectNulls={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Space>
              ) : (
                <div style={{ textAlign: 'center', padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: 64, marginBottom: 24, opacity: 0.2 }}>🗺️</div>
                  <Title level={4} style={{ color: '#6b7280', fontWeight: 500 }}>No Selection</Title>
                  <Text type="secondary" style={{ maxWidth: 220 }}>
                    {mapMode === "Hotspots" ? "Click a hotspot marker on the map to view case details." : "Hover over or click a province on the map to view its detailed statistics."}
                  </Text>
                </div>
              )}
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
}
