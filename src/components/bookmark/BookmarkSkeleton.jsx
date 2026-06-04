import React from 'react';
import { Card, Skeleton, Space } from 'antd';

const BookmarkSkeleton = () => {
  return (
    <Card
      style={{
        width: '100%',
        marginBottom: 16,
        borderRadius: 10,
        border: '1px solid var(--ant-color-border-secondary)',
      }}
      styles={{ body: { padding: '20px' } }}
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', width: '100%' }}>
        
        <div>
          <Skeleton.Avatar active size="small" shape="square" style={{ width: 20, height: 20 }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <Skeleton.Input active size="default" style={{ width: 200 }} />
               <Skeleton.Button active size="small" shape="circle" style={{ width: 32 }} />
            </div>

            <div>
              <Skeleton.Button active size="small" style={{ width: 80, borderRadius: 4, height: 24 }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <Space>
                <Skeleton.Avatar active size="small" shape="circle" />
                <Skeleton.Input active size="small" style={{ width: 100 }} />
              </Space>
              <Skeleton.Input active size="small" style={{ width: 80 }} />
            </div>

          </Space>
        </div>
      </div>
    </Card>
  );
};

export default BookmarkSkeleton;