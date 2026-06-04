import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  HolderOutlined,
  MoreOutlined,
  PushpinFilled,
  PushpinOutlined
} from '@ant-design/icons';
import { Button, Card, Dropdown, Space, Tag, Typography } from 'antd';
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

const BookmarkItem = ({
  data,
  onTogglePin,
  dragHandleProps,
  onDelete,
  onEdit,
}) => {
  if (!data) return null;

  const navigate = useNavigate();
  const isItemPinned = data.pinned; 

  const menuItems = [
    {
      key: 'edit',
      label: 'Rename Bookmark',
      icon: <EditOutlined />,
      onClick: (e) => {
        e.domEvent.stopPropagation(); // stop dropdown menu click from bubbling
        onEdit && onEdit(data.id);
      },
    },
    {
      key: 'delete',
      label: 'Delete Bookmark',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        onDelete && onDelete(data.id);
      },
    },
  ];

  return (
    <Card
      hoverable
      style={{
        width: '100%',
        borderRadius: 10,
      }}
      styles={{ body: {padding: 20} }}
      onClick={() => navigate(data.link)}
    >
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', width: '100%' }}>
        
        <div 
          {...dragHandleProps} 
          style={{ 
            cursor: 'grab', 
            color: 'var(--ant-color-text-description)', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <HolderOutlined style={{ fontSize: 18 }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <Space direction="vertical" style={{ width: '100%' }} size="small">

            {/* Title + Pin + Dropdown */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <Title level={4} style={{ margin: 0, wordBreak: 'break-word' }}>
                {data.name}
              </Title>

              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <Button
                  type="text"
                  size="small"
                  icon={isItemPinned ? <PushpinFilled style={{ color: 'var(--ant-color-primary)' }} /> : <PushpinOutlined />}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent Card navigation
                    onTogglePin(data.id);
                  }}
                />
                <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                  <Button
                    type="text"
                    size="small"
                    icon={<MoreOutlined />}
                    onClick={(e) => e.stopPropagation()} // prevent Card navigation
                  />
                </Dropdown>
              </div>
            </div>

            {/* Kind Tag */}
            <div style={{ width: '100%' }}>
              <Tag color="blue" style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4 }}>
                {data.kind}
              </Tag>
            </div>

            {/* Added At */}
            <Space style={{ flexWrap: 'wrap', marginTop: 8 }}>
              <ClockCircleOutlined />
              <Text type="secondary">
                {new Date(data.addedAt).toISOString().split("T")[0]}
              </Text>
            </Space>

          </Space>
        </div>
      </div>
    </Card>
  );
};

export default BookmarkItem;