import React from "react";
import { Typography, Row, Col, Card, Divider } from "antd";
import { motion } from "framer-motion";
import {
  AppstoreOutlined,
  ApiOutlined,
  DatabaseOutlined,
  RobotOutlined,
  LineChartOutlined,
  BookOutlined,
  SafetyCertificateOutlined,
  DotChartOutlined,
  GlobalOutlined
} from "@ant-design/icons";
import { useThemeContext } from "../contexts/ThemeContext";
import "../styles/about.css";

const { Title, Paragraph } = Typography;

export default function AboutPage() {
  const { isDark } = useThemeContext();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="about-page-container" data-theme={isDark ? "dark" : "light"}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* HERO SECTION */}
        <motion.div variants={itemVariants} className="about-hero">
          <div className="about-hero-glow" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{ marginBottom: 40, display: 'flex', justifyContent: 'center' }}
          >
            <img 
              src="/bannerAAS.png" 
              alt="AAS Project Banner" 
              style={{ 
                width: "100%", 
                maxWidth: 800, 
                borderRadius: 24, 
                boxShadow: isDark 
                  ? "0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)" 
                  : "0 24px 48px rgba(99,102,241,0.2), 0 0 0 1px rgba(0,0,0,0.05)",
                objectFit: "cover",
                display: "block"
              }} 
            />
          </motion.div>

          <Title level={1} className="about-hero-title" style={{ marginTop: 24, fontSize: 48 }}>
            IJS Nexus Explorer
          </Title>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div style={{
              background: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(16px)",
              padding: "28px 40px",
              borderRadius: 20,
              border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(255, 255, 255, 0.5)",
              maxWidth: 800,
              margin: "0 auto",
              boxShadow: isDark ? "0 16px 40px rgba(0, 0, 0, 0.3)" : "0 16px 40px rgba(79, 70, 229, 0.08)"
            }}>
              <Paragraph style={{ 
                fontSize: 18, 
                lineHeight: 1.8, 
                marginBottom: 0, 
                color: isDark ? "rgba(255, 255, 255, 0.85)" : "#374151",
                fontWeight: 500,
                letterSpacing: "0.2px"
              }}>
                A unified intelligence platform integrating <strong style={{ color: isDark ? "#818cf8" : "#4f46e5" }}>geospatial crime analysis</strong>, <strong style={{ color: isDark ? "#f472b6" : "#ec4899" }}>socio-economic correlations</strong>, 
                and <strong style={{ color: isDark ? "#34d399" : "#10b981" }}>AI-powered legal assistance</strong> to empower policymakers, researchers, and communities across Indonesia.
              </Paragraph>
            </div>
          </motion.div>
        </motion.div>

        {/* MISSION & VISION */}
        <motion.div variants={itemVariants} style={{ marginBottom: 64 }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={12}>
              <Card bordered={false} style={{ height: "100%", background: "transparent" }}>
                <Title level={3} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <SafetyCertificateOutlined style={{ color: "#10b981" }} /> 
                  Our Mission
                </Title>
                <Paragraph style={{ fontSize: 15, lineHeight: 1.6 }}>
                  To bridge the gap between complex justice data and impactful policy making. 
                  By combining advanced geospatial mapping, socio-economic correlation analysis, 
                  and generative AI capabilities, we aim to make the Indonesian legal framework transparent, 
                  understandable, and actionable for everyone—from government officials to everyday citizens.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card bordered={false} style={{ height: "100%", background: "transparent" }}>
                <Title level={3} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <ApiOutlined style={{ color: "#3b82f6" }} /> 
                  System Ecosystem
                </Title>
                <Paragraph style={{ fontSize: 15, lineHeight: 1.6 }}>
                  IJS Nexus operates as an interconnected ecosystem. It transforms raw justice metrics 
                  into highly interactive visual dashboards and statistical scatter plots, while simultaneously 
                  providing an AI-driven interface capable of digesting, searching, and summarizing 
                  massive volumes of regulatory documents in real-time.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </motion.div>

        <Divider style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)" }} />

        {/* CORE FEATURES */}
        <motion.div variants={itemVariants} className="features-grid">
          <Title level={2} style={{ textAlign: "center", marginBottom: 48, fontWeight: 700 }}>
            Core Capabilities
          </Title>
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} sm={24} md={8}>
              <div className="feature-box">
                <GlobalOutlined style={{ fontSize: 28, color: "#3b82f6", marginBottom: 16 }} />
                <div className="feature-title" style={{ fontSize: 18 }}>Geospatial Explorer</div>
                <div className="feature-title" style={{ fontSize: 13, color: "#3b82f6", marginTop: -8, opacity: 0.8 }}>Hotspots & Boundaries</div>
                <div className="feature-desc" style={{ marginTop: 12 }}>
                  Interactive mapping of crime statistics down to the Kabupaten level. Switch between point-based hotspots and choropleth regional boundaries effortlessly.
                </div>
              </div>
            </Col>

            <Col xs={24} sm={24} md={8}>
              <div className="feature-box">
                <DotChartOutlined style={{ fontSize: 28, color: "#ec4899", marginBottom: 16 }} />
                <div className="feature-title" style={{ fontSize: 18 }}>Socio-Economic Analytics</div>
                <div className="feature-title" style={{ fontSize: 13, color: "#ec4899", marginTop: -8, opacity: 0.8 }}>Correlation & Insights</div>
                <div className="feature-desc" style={{ marginTop: 12 }}>
                  Dynamically compare regional crime rates against population density, education indexes, and income per capita using Pearson correlation models.
                </div>
              </div>
            </Col>

            <Col xs={24} sm={24} md={8}>
              <div className="feature-box">
                <RobotOutlined style={{ fontSize: 28, color: "#10b981", marginBottom: 16 }} />
                <div className="feature-title" style={{ fontSize: 18 }}>Ask AI</div>
                <div className="feature-title" style={{ fontSize: 13, color: "#10b981", marginTop: -8, opacity: 0.8 }}>Virtual Legal Assistant</div>
                <div className="feature-desc" style={{ marginTop: 12 }}>
                  An intelligent agent trained specifically on KUHP, KUHAP, and UU ITE, capable of breaking down complex legal jargon into understandable insights.
                </div>
              </div>
            </Col>
          </Row>
        </motion.div>

        <Divider style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)", marginTop: 64, marginBottom: 64 }} />

        {/* ARCHITECTURE DIAGRAM */}
        <motion.div variants={itemVariants} className="architecture-container">
          <Title level={2} style={{ textAlign: "center", marginBottom: 48, fontWeight: 700 }}>
            System Architecture
          </Title>
          
          <Row gutter={[24, 24]} align="stretch" justify="center">
            {/* FRONTEND */}
            <Col xs={24} lg={8} className="arch-connection">
              <Card className="architecture-card" bordered={false}>
                <div className="arch-icon-wrapper">
                  <AppstoreOutlined />
                </div>
                <Title level={4}>Client Interface</Title>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  Built with <strong>React</strong> & <strong>Vite</strong>. The interactive mapping is powered by <strong>Leaflet</strong>, 
                  while the complex data visualizations and correlation scatter plots are rendered seamlessly using <strong>Recharts</strong> and <strong>D3</strong>.
                </Paragraph>
              </Card>
            </Col>

            {/* AI LAYER */}
            <Col xs={24} lg={8} className="arch-connection">
              <Card className="architecture-card" bordered={false}>
                <div className="arch-icon-wrapper" style={{ background: isDark ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
                  <RobotOutlined />
                </div>
                <Title level={4}>AI Processing Hub</Title>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  Powered by advanced <strong>LLMs</strong>. It leverages context-aware Retrieval-Augmented Generation (RAG) 
                  principles to interpret user queries and fetch hyper-relevant answers directly from the embedded Indonesian regulatory knowledge base.
                </Paragraph>
              </Card>
            </Col>

            {/* DATABASE */}
            <Col xs={24} lg={8}>
              <Card className="architecture-card" bordered={false}>
                <div className="arch-icon-wrapper" style={{ background: isDark ? "rgba(245, 158, 11, 0.15)" : "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}>
                  <DatabaseOutlined />
                </div>
                <Title level={4}>Data & Analytics</Title>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  Mathematical aggregations and geographic filtering are processed locally in real-time. 
                  User sessions, discussions, and application states are securely managed via scalable backend infrastructure.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </motion.div>

      </motion.div>
    </div>
  );
}
