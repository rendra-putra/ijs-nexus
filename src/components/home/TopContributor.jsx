import { useQuery } from "@apollo/client/react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  List,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography
} from "antd";
import { useState } from "react";
import { GET_TOP_USERS } from "../../services/activityLogService";
import { formatNumber } from "../../utils/formatNumberUtil";

const { Text } = Typography;

const medals = ["🥇", "🥈", "🥉"];

export default function TopContributors() {
  const [range, setRange] = useState("DAY");

  const { data, loading, error } = useQuery(GET_TOP_USERS, {
    variables: {
      range,
      limit: 3
    }
  });

  const contributors = data?.getTopUsers || [];

  return (
    <Card title="Top Contributors" style={{ maxWidth: 400 }}>
      <Text type="secondary">
        🙌 Thank you to our amazing contributors! Your posts and replies help
        the community grow and support others.
      </Text>

      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20
        }}
      >
        <Text>Top in</Text>

        <Button.Group>
          {["DAY", "WEEK", "MONTH", "ALL"].map((item) => (
            <Button
              key={item}
              type={range === item ? "primary" : "default"}
              size="small"
              onClick={() => setRange(item)}
            >
              {item}
            </Button>
          ))}
        </Button.Group>
      </Space>

      {loading && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Spin />
        </div>
      )}

      {error && (
        <Alert
          type="error"
          message="Failed to load contributors"
          style={{ marginTop: 16 }}
        />
      )}

      {!loading && !error && (
        <List
          style={{ marginTop: 12 }}
          itemLayout="horizontal"
          dataSource={contributors}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{item.fullName?.[0]}</Avatar>}
                title={
                  <>
                    <span style={{ fontSize: 16 }}>{medals[index] || ""}</span>{" "}
                    {item.fullName}
                  </>
                }
                description={
                  <>
                    <Tooltip title="Create discussion or article">
                      <Tag color="green">
                        Posts: {formatNumber(item.totalPost)}
                      </Tag>
                    </Tooltip>

                    <Tooltip title="Answer or reply discussion or comment article">
                      <Tag color="orange">
                        Replies: {formatNumber(item.totalReply)}
                      </Tag>
                    </Tooltip>
                  </>
                }
              />

              <strong>{formatNumber(item.totalActivity)}</strong>
            </List.Item>
          )}
        />
      )}

      <Text type="secondary" style={{ display: "block", marginTop: 10 }}>
        ⭐ Your knowledge and engagement make this community stronger.
      </Text>
    </Card>
  );
}