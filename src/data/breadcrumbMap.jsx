import {
  BookOutlined,
  EditOutlined,
  FileTextOutlined,
  HomeOutlined,
  MessageOutlined,
  PlusOutlined,
  ReadOutlined,
  RobotOutlined,
  SafetyOutlined,
  TableOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";

export const routeMap = {
  "/home": [
    {
      path: "/home",
      label: "Home",
      icon: <HomeOutlined />,
    },
  ],

  "/discussions": [
    {
      path: "/discussions",
      label: "Discussions",
      icon: <MessageOutlined />,
    },
  ],

  "/discussions/mine": [
    {
      path: "/discussions",
      label: "Discussions",
      icon: <MessageOutlined />,
    },
    {
      label: "My Discussions",
      icon: <UnorderedListOutlined />,
    },
  ],

  "/discussions/read": [
    {
      path: "/discussions",
      label: "Discussions",
      icon: <MessageOutlined />,
    },
    {
      label: "Detail",
      icon: <ReadOutlined />,
    },
  ],

  "/discussions/create": [
    {
      path: "/discussions",
      label: "Discussions",
      icon: <MessageOutlined />,
    },
    {
      label: "Create",
      icon: <PlusOutlined />,
    },
  ],

  "/discussions/update": [
    {
      path: "/discussions",
      label: "Discussions",
      icon: <MessageOutlined />,
    },
    {
      label: "Update",
      icon: <EditOutlined />,
    },
  ],

  "/articles": [
    {
      path: "/articles",
      label: "Articles",
      icon: <FileTextOutlined />,
    },
  ],

  "/articles/read": [
    {
      path: "/articles",
      label: "Articles",
      icon: <FileTextOutlined />,
    },
    {
      label: "Detail",
      icon: <ReadOutlined />,
    },
  ],

  "/my-articles": [
    {
      path: "/my-articles",
      label: "My Articles",
      icon: <TableOutlined />,
    },
  ],

  "/my-articles/create": [
    {
      path: "/my-articles",
      label: "My Articles",
      icon: <TableOutlined />,
    },
    {
      label: "Create",
      icon: <PlusOutlined />,
    },
  ],

  "/my-articles/edit": [
    {
      path: "/my-articles",
      label: "My Articles",
      icon: <TableOutlined />,
    },
    {
      label: "Update",
      icon: <EditOutlined />,
    },
  ],

  "/bookmark": [
    {
      label: "My Bookmarks",
      icon: <BookOutlined />,
    },
  ],
  "/report": [
    {
      label: "Moderation - Reports",
      icon: <SafetyOutlined />,
    },
  ],
  "/ask-ai": [
    {
      label: "Ask AI",
      icon: <RobotOutlined />,
    },
  ],
};