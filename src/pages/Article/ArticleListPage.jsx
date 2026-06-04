// import {
//   EyeOutlined,
//   LikeOutlined,
//   MessageOutlined,
//   SearchOutlined,
//   UserOutlined
// } from "@ant-design/icons";
// import { useQuery } from "@apollo/client/react";
// import {
//   Alert,
//   Card,
//   Input,
//   List,
//   Space,
//   Spin,
//   Tag,
//   Tooltip,
//   Typography,
// } from "antd";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { GET_ARTICLES } from "../../services/articleService";
// import { formatNumber } from "../../utils/formatNumberUtil";

// const { Title, Text } = Typography;

// export default function ArticleListPage() {
//   const [keyword, setKeyword] = useState("");
//   const [debouncedKeyword, setDebouncedKeyword] = useState("");
//   const navigate = useNavigate();

//   // debounce search
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedKeyword(keyword);
//     }, 400);

//     return () => clearTimeout(handler);
//   }, [keyword]);

//   const { data, loading, error } = useQuery(GET_ARTICLES, {
//     variables: { keyword: debouncedKeyword },
//   });

//   if (error)
//     return (
//       <Alert
//         message="Error API"
//         description={error.message}
//         type="error"
//       />
//     );

//   const articles = data?.getArticles ?? [];

//   return (
//     <div>
//       <Title level={2}>Articles</Title>

//       <Input
//         size="large"
//         placeholder="Search articles..."
//         prefix={<SearchOutlined />}
//         value={keyword}
//         onChange={(e) => setKeyword(e.target.value)}
//         style={{ marginBottom: 20 }}
//         allowClear
//         suffix={loading ? <Spin size="small" /> : null}
//       />

//       {/* Initial loading */}
//       {!data && loading ? (
//         <div style={{ textAlign: "center", padding: 40 }}>
//           <Spin size="large" />
//         </div>
//       ) : (
//         <List
//           dataSource={articles}
//           locale={{ emptyText: "No articles found" }}
//           renderItem={(item) => (
//             <List.Item
//               style={{
//                 padding: 0,
//                 border: "none",
//                 marginBottom: item === articles[articles.length - 1] ? 0 : 16,
//               }}
//             >
//               <Card
//                 key={item.id}
//                 style={{ borderRadius: 10, width: "100%" }}
//                 hoverable
//                 onClick={() => navigate(`/articles/read/${item.slug}`)}
//               >
//                 <Space
//                   direction="vertical"
//                   style={{width: "100%"}}
//                 >
//                   <Title level={4} style={{ margin: 0 }}>
//                     {item.title}
//                   </Title>

//                   <Space wrap>
//                     {item.tags.map((tag) => (
//                       <Tag key={tag}>#{tag}</Tag>
//                     ))}
//                   </Space>

//                   {/* Footer */}
//                   <Space
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       width: "100%",
//                       marginTop: 12,
//                     }}
//                   >
//                     {/* Author */}
//                     <Space>
//                       <UserOutlined />
//                       <Text>{item.author}</Text>
//                       <Text type="secondary">
//                         • {new Date(item.createdAt).toLocaleDateString()}
//                       </Text>
//                     </Space>

//                     {/* Stats */}
//                     <Space size={8}>
//                       <Tooltip title="Likes">
//                         <Space size={4}>
//                           <LikeOutlined />
//                           <Text>{formatNumber(item.stats.likes ?? 0)}</Text>
//                         </Space>
//                       </Tooltip>

//                       <Tooltip title="Comments">
//                         <Space size={4}>
//                           <MessageOutlined />
//                           <Text>{formatNumber(item.stats.comments ?? 0)}</Text>
//                         </Space>
//                       </Tooltip>

//                       <Tooltip title="Views">
//                         <Space size={4}>
//                           <EyeOutlined />
//                           <Text>{formatNumber(item.stats.views ?? 0)}</Text>
//                         </Space>
//                       </Tooltip>
//                     </Space>
//                   </Space>
//                 </Space>
//               </Card>
//             </List.Item>
//           )}
//         />
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { Alert, Input, Spin, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { GET_ARTICLES } from "../../services/articleService";
import ArticleList from "../../components/article/ArticleList";

const { Title } = Typography;

export default function ArticleListPage() {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const navigate = useNavigate();

  // Logic: Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 400);
    return () => clearTimeout(handler);
  }, [keyword]);

  // Data Fetching
  const { data, loading, error } = useQuery(GET_ARTICLES, {
    variables: { keyword: debouncedKeyword },
    fetchPolicy: "cache-and-network",
  });

  const articles = data?.getArticles ?? [];

  // Handler: Navigasi ke Detail
  const handleNavigate = (slug) => {
    navigate(`/articles/read/${slug}`);
  };

  if (error) return (
    <Alert message="Error API" description={error.message} type="error" showIcon />
  );

  return (
    <div>
      <Title level={2}>Articles</Title>

      <Input
        size="large"
        placeholder="Search articles..."
        prefix={<SearchOutlined />}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ marginBottom: 20 }}
        allowClear
        suffix={loading ? <Spin size="small" /> : null}
      />

      {/* Konten Utama */}
      {!data && loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" tip="Fetching articles..." />
        </div>
      ) : (
        <ArticleList 
          articles={articles} 
          onNavigate={handleNavigate} 
        />
      )}
    </div>
  );
}