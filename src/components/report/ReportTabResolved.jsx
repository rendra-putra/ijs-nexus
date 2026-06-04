import { CalendarOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, Tag } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

export default function ReportTabResolved({ reports, onView, onBulkDelete, loading }) {

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
        </Space>
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Popconfirm
          title="Delete selected reports?"
          onConfirm={() => {
            onBulkDelete(selectedRowKeys);
            setSelectedRowKeys([]);
          }}
        >
          <Button
            danger
            loading={loading}
            disabled={selectedRowKeys.length === 0}
          >
            Delete Selected ({selectedRowKeys.length})
          </Button>
        </Popconfirm>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={reports}
        scroll={{ x: "max-content" }} 
        rowSelection={rowSelection}
      />
    </>
  );
}