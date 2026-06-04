import { List, Grid } from "antd";
import MyDiscussionItem from "./MyDiscussionItem";

const { useBreakpoint } = Grid;

export default function MyDiscussionList({
  discussions,
  loading,
  onToggleStatus,
}) {
  const screens = useBreakpoint();

  return (
    <List
      loading={loading}
      dataSource={discussions}
      locale={{ emptyText: "You haven't posted any discussions yet." }}
      renderItem={(item) => (
        <List.Item
          style={{
            padding: screens.md ? "20px 0" : "12px 0",
          }}
        >
          <MyDiscussionItem
            item={item}
            onToggleStatus={onToggleStatus}
          />
        </List.Item>
      )}
    />
  );
}