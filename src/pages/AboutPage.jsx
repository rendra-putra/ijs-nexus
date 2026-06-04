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
          <Title level={1} className="about-hero-title">
            IJS Nexus Explorer
          </Title>
          <Paragraph className="about-hero-subtitle" type="secondary">
            A unified platform integrating geospatial crime analysis, socio-economic correlations, 
            and AI-powered legal assistance to empower policy makers, researchers, and communities across Indonesia.
          </Paragraph>
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
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={6}>
              <div className="feature-box">
                <GlobalOutlined style={{ fontSize: 24, color: "#3b82f6", marginBottom: 12 }} />
                <div className="feature-title">Geospatial Explorer</div>
                <div className="feature-title" style={{ fontSize: 12, color: "#3b82f6", marginTop: -8 }}>Hotspots & Boundaries</div>
                <div className="feature-desc">
                  Interactive mapping of crime statistics down to the Kabupaten level. Switch between point-based hotspots and choropleth regional boundaries effortlessly.
                </div>
              </div>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <div className="feature-box">
                <DotChartOutlined style={{ fontSize: 24, color: "#ec4899", marginBottom: 12 }} />
                <div className="feature-title">Socio-Economic Correlation</div>
                <div className="feature-title" style={{ fontSize: 12, color: "#ec4899", marginTop: -8 }}>Statistical Analysis</div>
                <div className="feature-desc">
                  Dynamically compare regional crime rates against population density, education indexes, and income per capita using Pearson correlation models.
                </div>
              </div>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <div className="feature-box">
                <RobotOutlined style={{ fontSize: 24, color: "#10b981", marginBottom: 12 }} />
                <div className="feature-title">Ask AI (Chatbot)</div>
                <div className="feature-title" style={{ fontSize: 12, color: "#10b981", marginTop: -8 }}>Virtual Legal Assistant</div>
                <div className="feature-desc">
                  An intelligent agent trained specifically on KUHP, KUHAP, and UU ITE, capable of breaking down complex legal jargon into understandable insights.
                </div>
              </div>
            </Col>
            
            <Col xs={24} sm={12} md={6}>
              <div className="feature-box">
                <BookOutlined style={{ fontSize: 24, color: "#f59e0b", marginBottom: 12 }} />
                <div className="feature-title">Community Forums</div>
                <div className="feature-title" style={{ fontSize: 12, color: "#f59e0b", marginTop: -8 }}>Public Discourse</div>
                <div className="feature-desc">
                  A moderated space for users to write articles, open discussions, and debate inclusive justice topics safely and transparently.
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
