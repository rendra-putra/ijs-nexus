// import {
//   DeleteOutlined,
//   EditOutlined,
//   EyeOutlined,
//   PlusOutlined,
//   SyncOutlined
// } from "@ant-design/icons";
// import { useMutation, useQuery } from "@apollo/client/react";
// import { Alert, Button, Card, message, Popconfirm, Select, Space, Spin, Table } from "antd";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// import { DELETE_ARTICLE, GET_MY_ARTICLES, UPDATE_ARTICLE_STATUS } from "../../services/articleService";

// export default function MyArticlePage() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [updateStatus] = useMutation(UPDATE_ARTICLE_STATUS, {
//     refetchQueries: ["getMyArticles"], // biar auto refresh
//   });

//   const handleChangeStatus = async (id, value) => {
//     try {
//       await updateStatus({
//         variables: { id, status: value },

//         optimisticResponse: {
//           updateArticleStatus: {
//             __typename: "Article",
//             id,
//             status: value,
//           },
//         },
//       });

//       message.success("Status updated");
//     } catch (err) {
//       message.error(err.message);
//     }
//   };

//   const [deleteArticle] = useMutation(DELETE_ARTICLE, {
//     refetchQueries: ["getMyArticles"],
//   });

//   const handleDelete = async (id) => {
//     try {
//       await deleteArticle({ variables: { id } });
//       message.success("Article deleted");
//     } catch (err) {
//       message.error(err.message);
//     }
//   };

//   const { data, loading, error } = useQuery(GET_MY_ARTICLES, {
//     variables: { userId: user?.id },
//     skip: !user?.id,
//   });

//   if (loading) return <Spin fullscreen />;

//   if (error) return (
//     <Alert
//       description={error.message}
//       type="error"
//     />
//   );;

//   const articles = data?.getMyArticles ?? [];

//   const columns = [
//     {
//       title: "Title",
//       dataIndex: "title",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (status, record) => (
//         <Select
//           value={status}
//           style={{ width: 140 }}
//           onChange={(value) => handleChangeStatus(record.id, value)}
//           options={[
//             { value: "draft", label: "Draft" },
//             { value: "published", label: "Published" },
//             { value: "archived", label: "Archived" },
//           ]}
//         />
//       ),
//     },
//     {
//       title: "Created At",
//       dataIndex: "createdAt",
//       render: (v) => new Date(v).toLocaleDateString(),
//     },
//     {
//       title: "Action",
//       key: "action",
//       align: "center",
//       render: (_, record) => (
//         <Space>
//           {/* VIEW */}
//           <Button
//             type="link"
//             icon={<EyeOutlined />}
//             onClick={() => navigate(`/articles/read/${record.slug}`)}
//           />

//           {/* EDIT */}
//           <Button
//             type="link"
//             icon={<EditOutlined />}
//             style={
//               { color: "orange" }
//             }
//             onClick={() => navigate(`/my-articles/edit/${record.id}`)}
//           />

//           {/* DELETE */}
//           <Popconfirm
//             title="Delete this article?"
//             description="This action cannot be undone"
//             onConfirm={() => handleDelete(record.id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button
//               type="link"
//               danger
//               icon={<DeleteOutlined />}
//             />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <Space
//         style={{
//           display: "flex",
//           justifyContent: "end",
//           marginBottom: 20,
//         }}
//       >
//         <Button
//           type="primary"
//           style={{
//             backgroundColor: "#52c41a",
//             borderColor: "#52c41a",
//             color: "#fff"
//           }}
//           icon={<PlusOutlined />}
//           onClick={() => navigate("/my-articles/create")}
//         >
//           Create Article
//         </Button>
//         <Button
//           icon={<SyncOutlined />}
//         >
//         </Button>
//       </Space>

//       <Card>
//         <Table
//           rowKey="id"
//           columns={columns}
//           dataSource={articles}
//         />
//       </Card>
//     </div>
//   );
// }

import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client/react";
import { Alert, Button, Card, message, Space, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { DELETE_ARTICLE, GET_MY_ARTICLES, UPDATE_ARTICLE_STATUS } from "../../services/articleService";
import MyArticleList from "../../components/article/MyArticleTable";

export default function MyArticlePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- QUERIES ---
  const { data, loading, error, refetch } = useQuery(GET_MY_ARTICLES, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  // --- MUTATIONS ---
  const [updateStatus] = useMutation(UPDATE_ARTICLE_STATUS, {
    refetchQueries: ["getMyArticles"],
  });

  const [deleteArticle] = useMutation(DELETE_ARTICLE, {
    refetchQueries: ["getMyArticles"],
  });

  // --- HANDLERS ---
  const handleChangeStatus = async (id, value) => {
    try {
      await updateStatus({
        variables: { id, status: value },
        optimisticResponse: {
          updateArticleStatus: {
            __typename: "Article",
            id,
            status: value,
          },
        },
      });
      message.success("Status updated");
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteArticle({ variables: { id } });
      message.success("Article deleted");
    } catch (err) {
      message.error(err.message);
    }
  };

  if (loading) return <Spin fullscreen tip="Loading your articles..." />;

  if (error) return (
    <Alert description={error.message} type="error" showIcon />
  );

  const articles = data?.getMyArticles ?? [];

  return (
    <div>
      <Space
        style={{
          display: "flex",
          justifyContent: "end",
          marginBottom: 20,
        }}
      >
        <Button
          type="primary"
          style={{
            backgroundColor: "#52c41a",
            borderColor: "#52c41a",
          }}
          icon={<PlusOutlined />}
          onClick={() => navigate("/my-articles/create")}
        >
          Create Article
        </Button>
        <Button 
          icon={<SyncOutlined />} 
          onClick={() => refetch()}
        />
      </Space>

      <Card>
        <MyArticleList 
          articles={articles}
          onStatusChange={handleChangeStatus}
          onDelete={handleDelete}
          onNavigate={navigate}
        />
      </Card>
    </div>
  );
}