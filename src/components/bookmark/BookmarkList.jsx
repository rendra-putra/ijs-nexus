import { PushpinFilled, SyncOutlined } from "@ant-design/icons";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, Card, Divider, Empty, Space, Tooltip, Typography } from "antd";
import { useState } from "react";
import BookmarkItem from "./BookmarkItem";
import { SortableItem } from "./SortableItem";

const { Title } = Typography;

export default function BookmarkList({
  bookmarks,
  onTogglePin,
  onEdit,
  onDelete,
  onUpdatePinnedOrder,
  currentFilter = "All",
  searchQuery = "",
  onRefresh, // optional
}) {
  
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const matchesFilter = (b) => currentFilter === "All" || b.kind === currentFilter;
  const matchesSearch = (b) => b?.name?.toLowerCase().includes(searchQuery.toLowerCase());

  const regularList = bookmarks
    .filter((b) => !b.pinned && matchesFilter(b) && matchesSearch(b))
    .sort((a, b) => (a.pinnedOrder || 0) - (b.pinnedOrder || 0));

  const pinnedList = bookmarks
    .filter((b) => b.pinned && matchesFilter(b) && matchesSearch(b))
    .sort((a, b) => (a.pinnedOrder || 0) - (b.pinnedOrder || 0));

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    setActiveId(null); 

    if (!active || !over || active.id === over.id) return;

    const isDraggingPinned = pinnedList.some(b => b.id === active.id);
    const targetList = isDraggingPinned ? pinnedList : regularList;

    const oldIndex = targetList.findIndex(b => b.id === active.id);
    const newIndex = targetList.findIndex(b => b.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedList = arrayMove(targetList, oldIndex, newIndex);

    const newOrderData = reorderedList.map((item, index) => ({
      id: item.id,
      pinnedOrder: index + 1 
    }));

    if (newOrderData.length > 0 && onUpdatePinnedOrder) {
      await onUpdatePinnedOrder(newOrderData);
    }
  };

  const activeItem = activeId ? bookmarks.find(b => b.id === activeId) : null;

  return (
    <Card
      style={{ borderRadius: 12 }}
      extra={
        onRefresh && (
          <Tooltip title="Refresh">
            <Button icon={<SyncOutlined />} onClick={onRefresh} />
          </Tooltip>
        )
      }
    >
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
    
        {pinnedList.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Space align="center">
              <PushpinFilled style={{ color: "var(--ant-color-primary)", fontSize: 18 }} />
              <Title level={4} style={{ margin: 0 }}>Pinned</Title>
            </Space>

            <SortableContext items={pinnedList.map(i => i.id)} strategy={verticalListSortingStrategy}>
              {pinnedList.map((item) => (
                <SortableItem
                  key={item.id}
                  data={item}
                  onTogglePin={onTogglePin}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </SortableContext>
          </div>
        )}

        {pinnedList.length > 0 && regularList.length > 0 && <Divider style={{ margin: "16px 0" }} />}

        {regularList.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <SortableContext items={regularList.map(i => i.id)} strategy={verticalListSortingStrategy}>
              {regularList.map((item) => (
                <SortableItem
                  key={item.id}
                  data={item}
                  isPinned={false}
                  onTogglePin={onTogglePin}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </SortableContext>
          </div>
        )}

        {pinnedList.length === 0 && regularList.length === 0 && (
          <Empty description="No bookmarks found" style={{ padding: 40 }} />
        )}

        <DragOverlay>
          {activeItem ? (
            <div style={{ cursor: 'grabbing', opacity: 0.9, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
              <BookmarkItem data={activeItem} />
            </div>
          ) : null}
        </DragOverlay>

      </DndContext>
    </Card>
  );
}