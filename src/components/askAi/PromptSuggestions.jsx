import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SafetyCertificateOutlined,
  UserOutlined,
  BankOutlined,
  MedicineBoxOutlined,
  BookOutlined,
  ArrowLeftOutlined,
  MessageOutlined,
  FileProtectOutlined,
  LaptopOutlined
} from "@ant-design/icons";

const TOPICS = [
  {
    id: "kekerasan-seksual",
    title: "Kekerasan Seksual",
    desc: "UU TPKS",
    icon: <SafetyCertificateOutlined />,
    color: "#ec4899",
    bgColor: "#fce7f3",
    questions: [
      "Apa saja yang termasuk tindak pidana kekerasan seksual menurut UU TPKS?",
      "Bagaimana perlindungan hukum bagi korban kekerasan seksual?",
      "Apa sanksi bagi pelaku pelecehan seksual di tempat kerja?"
    ]
  },
  {
    id: "peradilan-anak",
    title: "Peradilan Anak",
    desc: "UU SPPA",
    icon: <UserOutlined />,
    color: "#3b82f6",
    bgColor: "#dbeafe",
    questions: [
      "Apa itu diversi dan kapan wajib diupayakan dalam peradilan anak?",
      "Berapa batas usia anak yang dapat dimintai pertanggungjawaban pidana?",
      "Bagaimana prosedur penahanan terhadap anak yang berhadapan dengan hukum?"
    ]
  },
  {
    id: "korupsi",
    title: "Tindak Pidana Korupsi",
    desc: "UU Tipikor",
    icon: <BankOutlined />,
    color: "#f59e0b",
    bgColor: "#fef3c7",
    questions: [
      "Apa perbedaan antara suap dan gratifikasi menurut UU Tipikor?",
      "Bagaimana perlindungan bagi pelapor tindak pidana korupsi?",
      "Berapa ancaman pidana bagi penyelenggara negara yang menerima gratifikasi?"
    ]
  },
  {
    id: "narkotika",
    title: "Narkotika",
    desc: "UU Narkotika",
    icon: <MedicineBoxOutlined />,
    color: "#10b981",
    bgColor: "#d1fae5",
    questions: [
      "Apa perbedaan sanksi hukum bagi pemakai dan pengedar narkotika?",
      "Apakah pecandu narkotika berhak mendapatkan rehabilitasi medis?",
      "Apa yang dimaksud dengan narkotika golongan I menurut undang-undang?"
    ]
  },
  {
    id: "kuhp",
    title: "KUHP",
    desc: "UU No. 1 Tahun 2023",
    icon: <BookOutlined />,
    color: "#6366f1",
    bgColor: "#e0e7ff",
    questions: [
      "Kapan KUHP Baru (UU No. 1 Tahun 2023) mulai berlaku secara efektif?",
      "Apa saja pembaruan utama dalam KUHP yang baru dibandingkan KUHP lama?",
      "Bagaimana ketentuan pidana denda dalam sistem KUHP yang baru?"
    ]
  },
  {
    id: "kuhap-kuhp",
    title: "KUHAP",
    desc: "Hukum Acara Pidana",
    icon: <FileProtectOutlined />,
    color: "#8b5cf6", // Purple
    bgColor: "#ede9fe",
    questions: [
      "Apa hak-hak tersangka menurut KUHAP selama masa penahanan?",
      "Bagaimana prosedur pengajuan praperadilan menurut KUHAP?"
    ]
  },
  {
    id: "uu-ite",
    title: "Undang-Undang ITE",
    desc: "Hukum Siber & Digital",
    icon: <LaptopOutlined />,
    color: "#14b8a6", // Teal
    bgColor: "#ccfbf1",
    questions: [
      "Apa batasan tindak pidana pencemaran nama baik menurut revisi UU ITE?",
      "Bagaimana perlindungan data pribadi dikaitkan dengan aturan dalam UU ITE?",
      "Apa sanksi penyebaran berita bohong (hoaks) berdasarkan UU ITE?"
    ]
  }
];

export default function PromptSuggestions({ onSelect }) {
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <div style={{ padding: "16px 12px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0, fontFamily: "'Inter', sans-serif" }}>
          Legal Document Q&A Chatbot
        </h2>
        <p style={{ color: "#6b7280", fontSize: 13, marginTop: 4, marginBottom: 0 }}>
          Pilih topik di bawah ini untuk mengeksplorasi peraturan dan undang-undang.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedTopic ? (
          <motion.div
            key="topics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12
            }}
          >
            {TOPICS.map((topic) => (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #f3f4f6",
                  background: "#ffffff",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.05)",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 10px -3px rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.borderColor = topic.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 4px -1px rgba(0, 0, 0, 0.05)";
                  e.currentTarget.style.borderColor = "#f3f4f6";
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: topic.bgColor,
                  color: topic.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0
                }}>
                  {topic.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1f2937", margin: "0 0 2px 0" }}>
                    {topic.title}
                  </h3>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.2 }}>
                    {topic.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="questions"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div
              onClick={() => setSelectedTopic(null)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "#6b7280",
                cursor: "pointer",
                marginBottom: 16,
                fontSize: 13,
                fontWeight: 500,
                padding: "6px 12px",
                borderRadius: 20,
                background: "#f3f4f6",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#e5e7eb"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#f3f4f6"}
            >
              <ArrowLeftOutlined /> Kembali ke Kategori
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: selectedTopic.bgColor,
                color: selectedTopic.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16
              }}>
                {selectedTopic.icon}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", margin: 0 }}>
                  {selectedTopic.title}
                </h3>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {selectedTopic.questions.map((q, i) => (
                <div
                  key={i}
                  onClick={() => onSelect(q)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    background: "#ffffff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = selectedTopic.color;
                    e.currentTarget.style.background = "#fafafa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.background = "#ffffff";
                  }}
                >
                  <MessageOutlined style={{ color: selectedTopic.color, fontSize: 16, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: "#374151", fontWeight: 500, lineHeight: 1.4 }}>{q}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
