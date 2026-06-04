import { List, Spin } from "antd";
import DiscussionItem from "./DiscussionItem";

export default function DiscussionList({
  discussions,
  loading
}) {

  if (loading && discussions.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <List
      itemLayout="vertical"
      dataSource={discussions}
      locale={{ emptyText: "No discussions found" }}
      split={false}
      renderItem={(item, index) => (
        <List.Item style={{ padding: 0, border: "none" }}>
          <DiscussionItem
            item={item}
            isLast={index === discussions.length - 1}
          />
        </List.Item>
      )}
    />
  );
}