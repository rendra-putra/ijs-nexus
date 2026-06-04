import { ClockCircleOutlined } from "@ant-design/icons";
import {
  Card,
  Empty,
  Modal,
  Space,
  Spin,
  Tag,
  Timeline,
  Typography,
} from "antd";
import dayjs from "dayjs";

const { Text } = Typography;

const activityColor = {
  modified: "blue",
  answered: "green",
  closed: "red",
  reopened: "orange",
  modified_answer: "default"
};

export default function EventsModal({
  open,
  onCancel,
  events = [],
  loading = false, // 🔥 ADD THIS
}) {
  const getEventLabel = (event) => {
    switch (event.activity) {
      case "modified":
        return "updated the discussion";
      case "answered":
        return "accepted an answer";
      case "closed":
        return "closed the discussion";
      case "reopened":
        return "reopened the discussion";
      case "modified_answer":
        return "modified the verified answer";
      default:
        return event.activity;
    }
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
  );

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title="Discussion Activities"
      width={580}
    >
      {/* 🔥 LOADING STATE */}
      {loading ? (
        <div style={{ padding: "40px 0", textAlign: "center" }}>
          <Spin />
        </div>
      ) : sortedEvents.length === 0 ? (
        <div style={{ padding: "20px 0" }}>
          <Empty description="No activities found" />
        </div>
      ) : (
        <Timeline
          style={{ marginTop: 12 }}
          items={sortedEvents.map((event, index) => ({
            key: index,
            children: (
              <Card
                size="small"
                style={{
                  marginBottom: 10,
                  borderRadius: 8,
                }}
              >
                <Space direction="vertical" size={4}>
                  <Space wrap>
                    <Tag color={activityColor[event.activity] || "default"}>
                      {event.activity.toUpperCase()}
                    </Tag>

                    <Text strong>{event.actor}</Text>

                    <Text>{getEventLabel(event)}</Text>
                  </Space>

                  <Space size={4}>
                    <ClockCircleOutlined style={{ color: "#8c8c8c" }} />
                    <Text type="secondary">
                      {dayjs(event.dateTime).format(
                        "DD MMM YYYY • HH:mm:ss"
                      )}
                    </Text>
                  </Space>
                </Space>
              </Card>
            ),
          }))}
        />
      )}
    </Modal>
  );
}