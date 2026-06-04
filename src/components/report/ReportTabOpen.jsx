import { CalendarOutlined, CheckOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tag } from "antd";
import dayjs from "dayjs";

export default function ReportTabOpen({ reports, onView, onResolve }) {

  const columns = [
    {
      title: "Reporter",
      dataIndex: ["reporter", "fullName"]
    },
    {
      title: "Reported User",
      dataIndex: ["user", "fullName"]
    },
    {
      title: "Reason",
      dataIndex: "reason",
      render: (reason) => (
        <Tag color="orange">{reason}</Tag>
      )
    },
    {
      title: "Issued",
      dataIndex: "issuedAt",
      render: (issuedAt) => (
        <Space>
          <CalendarOutlined />
          {dayjs(Number(issuedAt)).format("YYYY-MM-DD")}
        </Space>
      )
    },
    {
      title: "Actions",
      render: (_, r) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => onView(r)}
          />

          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => onResolve(r.id)}
          />
        </Space>
      )
    }
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={reports}
      scroll={{ x: "max-content" }} 
    />
  );
}