import {
  DeleteOutlined,
  EditOutlined,
  MessageOutlined,
  MoreOutlined,
  PlusOutlined,
  PushpinFilled,
  PushpinOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Empty, Input, Modal } from "antd";
import { useMemo, useState } from "react";

export default function ChatHistorySidebar({
  chats,
  activeChatId,
  collapsed,
  onSelectChat,
  onCreateChat,
  onDeleteChat,
  onRenameChat,
  onPinChat,
}) {
  const [search, setSearch] = useState("");
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [modal, contextHolder] = Modal.useModal();
  /* ── Filter chats ─────────────────────────────────────────── */

  const filtered = useMemo(() => {
    if (!search.trim()) return chats;
    const q = search.toLowerCase();
    return chats.filter((c) => c.title.toLowerCase().includes(q));
  }, [chats, search]);

  /* ── Group by date ────────────────────────────────────────── */

  const grouped = useMemo(() => {
    const now = new Date();
    const todayStr = now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups = {
      pinned: [],
      today: [],
      yesterday: [],
      week: [],
      older: [],
    };

    filtered.forEach((chat) => {
      if (chat.pinned) {
        groups.pinned.push(chat);
        return;
      }
      const d = new Date(chat.updatedAt);
      const ds = d.toDateString();
      if (ds === todayStr) groups.today.push(chat);
      else if (ds === yesterdayStr) groups.yesterday.push(chat);
      else if (d > weekAgo) groups.week.push(chat);
      else groups.older.push(chat);
    });

    return groups;
  }, [filtered]);

  /* ── Rename handlers ──────────────────────────────────────── */

  const startRename = (chat) => {
    setRenamingId(chat.id);
    setRenameValue(chat.title);
  };

  const confirmRename = () => {
    if (renameValue.trim() && renamingId) {
      onRenameChat(renamingId, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue("");
  };

  const cancelRename = () => {
    setRenamingId(null);
    setRenameValue("");
  };

  /* ── Delete handler ───────────────────────────────────────── */

  const handleDelete = (chat) => {
    modal.confirm({
      title: "Hapus Chat",
      content: `Yakin ingin menghapus "${chat.title}"?`,
      okText: "Hapus",
      cancelText: "Batal",
      okButtonProps: { danger: true },
      onOk: () => onDeleteChat(chat.id),
    });
  };

  /* ── Context menu items ───────────────────────────────────── */

  const getMenuItems = (chat) => {
    const items = [
      {
        key: "pin",
        icon: chat.pinned ? <PushpinFilled /> : <PushpinOutlined />,
        label: chat.pinned ? "Unpin" : "Pin",
        onClick: () => onPinChat(chat.id),
      },
      {
        key: "rename",
        icon: <EditOutlined />,
        label: "Rename",
        onClick: () => startRename(chat),
      },
    ];

    if (chat.id !== 'demo-kuhp') {
      items.push(
        { type: "divider" },
        {
          key: "delete",
          icon: <DeleteOutlined />,
          label: "Hapus",
          danger: true,
          onClick: () => handleDelete(chat),
        }
      );
    }

    return items;
  };

  /* ── Render a single chat item ────────────────────────────── */

  const renderItem = (chat) => {
    const isActive = chat.id === activeChatId;
    const isRenaming = chat.id === renamingId;

    return (
      <div
        key={chat.id}
        className={`askai-chat-item ${isActive ? "active" : ""}`}
        onClick={() => {
          if (!isRenaming) onSelectChat(chat.id);
        }}
      >
        <MessageOutlined className="askai-chat-item-icon" />

        {isRenaming ? (
          <Input
            className="askai-rename-input"
            size="small"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onPressEnter={confirmRename}
            onKeyDown={(e) => {
              if (e.key === "Escape") cancelRename();
            }}
            onBlur={confirmRename}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <>
            <span className="askai-chat-item-title">{chat.title}</span>

            {chat.pinned && (
              <PushpinFilled className="askai-chat-item-pin" />
            )}

            <div
              className="askai-chat-item-actions"
              onClick={(e) => e.stopPropagation()}
            >
              <Dropdown
                menu={{ items: getMenuItems(chat) }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Button type="text" size="small" icon={<MoreOutlined />} />
              </Dropdown>
            </div>
          </>
        )}
      </div>
    );
  };

  /* ── Render a group ───────────────────────────────────────── */

  const renderGroup = (label, items) => {
    if (!items.length) return null;
    return (
      <div key={label}>
        <div className="askai-date-group">{label}</div>
        {items.map(renderItem)}
      </div>
    );
  };

  return (
    <div className={`askai-sidebar ${collapsed ? "collapsed" : ""}`}>
      {contextHolder}
      <div className="askai-sidebar-header">
        <Button
          className="askai-new-chat-btn"
          icon={<PlusOutlined />}
          onClick={() =>onCreateChat()}
        >
          Chat Baru
        </Button>

        <Input
          className="askai-search-input"
          placeholder="Cari percakapan..."
          prefix={<SearchOutlined style={{ opacity: 0.4 }} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
      </div>

      <div className="askai-chat-list">
        {filtered.length === 0 ? (
          <div className="askai-empty-history">
            <MessageOutlined className="askai-empty-history-icon" />
            <div className="askai-empty-history-text">
              {search ? "Tidak ditemukan" : "Belum ada percakapan"}
            </div>
          </div>
        ) : (
          <>
            {renderGroup("📌 Pinned", grouped.pinned)}
            {renderGroup("Hari Ini", grouped.today)}
            {renderGroup("Kemarin", grouped.yesterday)}
            {renderGroup("7 Hari Terakhir", grouped.week)}
            {renderGroup("Lebih Lama", grouped.older)}
          </>
        )}
      </div>
    </div>
  );
}
