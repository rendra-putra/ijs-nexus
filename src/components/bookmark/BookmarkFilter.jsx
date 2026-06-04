import React from 'react';
import { Button, Space, Input, theme } from 'antd'; 
import { SearchOutlined, AppstoreOutlined } from '@ant-design/icons';

const { useToken } = theme;

const BookmarkFilter = ({ currentFilter, onFilterChange, searchQuery, onSearchChange }) => {
  const { token } = useToken();
  const filters = ['All', 'Discussion', 'Article'];

  return (
    <div style={{ marginBottom: '16px' }}>
      <Space.Compact style={{ width: "100%", marginBottom: 20 }}>
        <Input
          size="large"
          placeholder="Search bookmarks by name..."
          value={searchQuery}
          onChange={onSearchChange}
        />
        <Button
          icon={<SearchOutlined />}
          size="large"
        >
          Search
        </Button>
      </Space.Compact>

      <Space 
        size="middle" 
        style={{ 
          width: '100%', 
          overflowX: 'auto', 
          paddingBottom: '8px'
        }}
      >
        {filters.map((filter) => {
          const isActive = currentFilter === filter;
          const icon = filter === 'All' ? <AppstoreOutlined /> : null;

          return (
            <Button 
                key={filter}
                onClick={() => onFilterChange(filter)} 
                size="large"
                shape="round"
                icon={icon}
                type="default" 
                style={{ 
                   background: isActive ? token.colorPrimary : token.colorFillAlter,
                   color: isActive ? '#fff' : token.colorText,
                   border: isActive ? 'none' : `1px solid ${token.colorBorderSecondary}`,
                   boxShadow: 'none',
                   outline: 'none',
                   fontWeight: isActive ? 700 : 500,
                   minWidth: '100px',
                   transition: 'all 0.3s'
                }}
            >
                {filter}
            </Button>
          );
        })}
      </Space>
    </div>
  );
};

export default BookmarkFilter;