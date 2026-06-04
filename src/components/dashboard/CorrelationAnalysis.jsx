import React, { useMemo } from 'react';
import { Card, Typography, Row, Col, Statistic, Tooltip as AntTooltip, Tag } from 'antd';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { InfoCircleOutlined, FallOutlined, RiseOutlined, SwapOutlined } from '@ant-design/icons';
import { calculatePearsonCorrelation, calculateLinearRegression } from '../../utils/statistics';
import { COMPARISON_METRICS } from '../../data/mockSocioEconomic';

const { Title, Text } = Typography;

export default function CorrelationAnalysis({ data, selectedMetric }) {
  const metricInfo = COMPARISON_METRICS[selectedMetric];

  const chartData = useMemo(() => {
    if (!data || data.length === 0 || !metricInfo) return [];
    return data.map(d => ({
      name: d.regionName,
      x: d.metricValue,
      y: d.cases
    })).filter(d => d.x !== undefined && d.y !== undefined);
  }, [data, metricInfo]);

  const { r, regressionLine } = useMemo(() => {
    if (chartData.length < 2) return { r: 0, regressionLine: [] };

    const xs = chartData.map(d => d.x);
    const ys = chartData.map(d => d.y);

    const rValue = calculatePearsonCorrelation(xs, ys);

    const { predict } = calculateLinearRegression(xs, ys);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);

    const line = [
      { x: minX, y: predict(minX) },
      { x: maxX, y: predict(maxX) }
    ];

    return { r: rValue, regressionLine: line };
  }, [chartData]);

  if (!metricInfo || chartData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Text type="secondary">Data tidak tersedia untuk filter saat ini.</Text>
      </div>
    );
  }

  const rStrength = Math.abs(r);
  let RColor = '#10b981'; // Green for negative/low correlation
  let RIcon = <SwapOutlined />;
  if (r > 0.5) { RColor = '#ef4444'; RIcon = <RiseOutlined />; } // Red for strong positive
  else if (r < -0.5) { RColor = '#3b82f6'; RIcon = <FallOutlined />; } // Blue for strong negative

  const customTooltip = (props) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (!data.name) return null; // This is a trendline point
      return (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(4px)'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#111827', fontSize: '14px' }}>{data.name}</p>
          <p style={{ margin: '0 0 4px 0', color: '#4b5563', fontSize: '12px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#4f46e5', marginRight: '6px' }}></span>
            Kasus: <span style={{ fontWeight: 600 }}>{data.y}</span>
          </p>
          <p style={{ margin: 0, color: '#4b5563', fontSize: '12px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', marginRight: '6px' }}></span>
            {metricInfo.label}: <span style={{ fontWeight: 600 }}>{metricInfo.format(data.x)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minHeight: 0 }}>
      {/* Fancy Compact Metric Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
        borderRadius: '12px',
        padding: '12px 16px',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 4px 12px 0 rgba(31, 38, 135, 0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text style={{ margin: 0, color: '#4b5563', fontSize: 13, fontWeight: 600 }}>
            Koefisien Korelasi
          </Text>
          <AntTooltip title="Korelasi Pearson (r) mengukur arah dan kekuatan hubungan linear. Nilai mendekati 1 atau -1 berarti korelasi kuat.">
            <InfoCircleOutlined style={{ fontSize: 14, color: '#9ca3af' }} />
          </AntTooltip>
        </div>

        <Tag color={rStrength > 0.5 ? (r > 0 ? 'red' : 'blue') : 'green'} style={{ margin: 0, padding: '4px 16px', fontSize: '15px', borderRadius: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
          {RIcon} r = {r.toFixed(3)}
        </Tag>
      </div>

      {/* Scatter Plot */}
      <div style={{ flex: 1, minHeight: 200, width: '100%', position: 'relative', marginLeft: '-16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              type="number"
              dataKey="x"
              name={metricInfo.label}
              domain={['dataMin - (dataMax-dataMin)*0.1', 'dataMax + (dataMax-dataMin)*0.1']}
              tick={{ fontSize: 12, fill: '#888' }}
              tickFormatter={(v) => metricInfo.key === 'incomePerCapita' ? v.toFixed(0) : v.toLocaleString('id-ID')}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Kasus"
              domain={[0, 'dataMax + (dataMax)*0.1']}
              tick={{ fontSize: 12, fill: '#888' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <RechartsTooltip content={customTooltip} cursor={{ strokeDasharray: '3 3' }} />

            <Scatter
              name="Wilayah"
              data={chartData}
              fill="#4f46e5"
              fillOpacity={0.6}
              stroke="#4f46e5"
              strokeWidth={1}
            />

            {regressionLine.length === 2 && (
              <Scatter
                data={regressionLine}
                line={{ stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5 5' }}
                lineType="fitting"
                shape={() => null}
                isAnimationActive={false}
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
        <div style={{ position: 'absolute', bottom: -10, width: '100%', textAlign: 'center', fontSize: 11, color: '#9ca3af', marginLeft: '16px' }}>
          Sumbu X: {metricInfo.label} ({metricInfo.unit})
        </div>
      </div>
    </div>
  );
}
