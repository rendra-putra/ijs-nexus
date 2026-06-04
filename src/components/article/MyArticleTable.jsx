// import { Table, Select, Space, Button, Popconfirm } from "antd";
// import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

// export default function MyArticleTable({ articles, onStatusChange, onDelete, onNavigate }) {
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
//           onChange={(value) => onStatusChange(record.id, value)}
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
//           <Button
//             type="link"
//             icon={<EyeOutlined />}
//             onClick={() => onNavigate(`/articles/read/${record.slug}`)}
//           />
//           <Button
//             type="link"
//             icon={<EditOutlined />}
//             style={{ color: "orange" }}
//             onClick={() => onNavigate(`/my-articles/edit/${record.id}`)}
//           />
//           <Popconfirm
//             title="Delete this article?"
//             description="This action cannot be undone"
//             onConfirm={() => onDelete(record.id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button type="link" danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <Table
//       rowKey="id"
//       columns={columns}
//       dataSource={articles}
//     />
//   );
// }

import { Table, Select, Space, Button, Popconfirm } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function MyArticleTable({ articles, onStatusChange, onDelete, onNavigate }) {
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      // Ellipsis dihapus sesuai permintaan
      // Berikan width agar saat di-scroll, kolom judul punya lebar yang konsisten
      width: 250, 
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 160,
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 140 }}
          onChange={(value) => onStatusChange(record.id, value)}
          options={[
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
            { value: "archived", label: "Archived" },
          ]}
        />
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: 120,
      render: (v) => new Date(v).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => onNavigate(`/articles/read/${record.slug}`)}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            style={{ color: "orange" }}
            onClick={() => onNavigate(`/my-articles/edit/${record.id}`)}
          />
          <Popconfirm
            title="Delete this article?"
            description="This action cannot be undone"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={articles}
      // x: "max-content" memastikan lebar tabel mengikuti total lebar kolom
      // Ini yang mencegah tabel "tumpah" keluar dari Card putih
      scroll={{ x: "max-content" }} 
      pagination={{ pageSize: 10 }}
    />
  );
}