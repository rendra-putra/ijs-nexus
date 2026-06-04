import { List } from "antd";
import ArticleItem from "./ArticleItem";

export default function ArticleList({ articles, onNavigate }) {
  return (
    <List
      dataSource={articles}
      locale={{ emptyText: "No articles found" }}
      renderItem={(item) => (
        <List.Item
          style={{
            padding: 0,
            border: "none",
            marginBottom: 16,
          }}
        >
          <ArticleItem 
            item={item} 
            onClick={() => onNavigate(item.slug)} 
          />
        </List.Item>
      )}
    />
  );
}