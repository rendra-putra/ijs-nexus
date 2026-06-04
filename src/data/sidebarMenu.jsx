// src/data/sidebarMenu.jsx
import {
  BookOutlined,
  FileTextOutlined,
  HomeOutlined,
  MessageOutlined,
  RobotOutlined,
  WarningOutlined
} from "@ant-design/icons";

export const sidebarMenu = [
  {
    key: "/home",
    path: "/home",
    text: "Home",
    icon: <HomeOutlined />,
    roles: []
  },
  {
    key: "/ask-ai",
    path: "/ask-ai",
    text: "Ask AI",
    icon: <RobotOutlined />,
    roles: []
  },
  {
    key: "/about",
    path: "/about",
    text: "About",
    icon: <FileTextOutlined />,
    roles: []
  }
];

