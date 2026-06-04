import { useMutation, useQuery } from "@apollo/client/react";
import { Alert, App as AntApp, Divider, Typography } from "antd";
import { useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import {
  DELETE_BOOKMARK,
  GET_MY_BOOKMARKS,
  PIN_BOOKMARK,
  RENAME_BOOKMARK,
  UNPIN_BOOKMARK,
  UPDATE_PINNED_ORDER
} from "../services/bookmarkService";

import BookmarkFilter from "../components/bookmark/BookmarkFilter";
import BookmarkList from "../components/bookmark/BookmarkList";
import BookmarkSkeleton from "../components/bookmark/BookmarkSkeleton";
import RenameBookmarkModal from "../components/bookmark/RenameBookmarkModal";

export default function BookmarksPage() {
  const { message, modal } = AntApp.useApp();
  const { user } = useAuth();

  const [bookmarks, setBookmarks] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const { data, loading, error, refetch } = useQuery(GET_MY_BOOKMARKS, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  const [pinBookmark] = useMutation(PIN_BOOKMARK);
  const [unpinBookmark] = useMutation(UNPIN_BOOKMARK);
  const [deleteBookmark] = useMutation(DELETE_BOOKMARK);
  const [renameBookmark] = useMutation(RENAME_BOOKMARK);
  const [updatePinnedOrder] = useMutation(UPDATE_PINNED_ORDER);

  useEffect(() => {
    if (data?.getMyBookmarks) setBookmarks(data.getMyBookmarks);
  }, [data]);

  const handleTogglePin = async (id) => {
    const item = bookmarks.find(b => b.id === id);
    if (!item) return;

    const isCurrentlyPinned = item.pinned;
    setBookmarks(prev =>
      prev.map(b => b.id === id ? { ...b, pinned: !isCurrentlyPinned, pinnedOrder: !isCurrentlyPinned ? 99 : 0 } : b)
    );

    try {
      if (isCurrentlyPinned) await unpinBookmark({ variables: { id } });
      else await pinBookmark({ variables: { id } });
      message.success(`Bookmark ${isCurrentlyPinned ? "di-unpin" : "di-pin"}`);
    } catch {
      message.error("Gagal mengubah status pin");
    }
  };

  const handleDeleteClick = (id) => {
    modal.confirm({
      title: "Delete Bookmark",
      content: "Are you sure you want to delete this bookmark?",
      okText: "Yes, Delete",
      okButtonProps: { danger: true, type: "primary" },
      async onOk() {
        try {
          await deleteBookmark({ variables: { id } });
          setBookmarks(prev => prev.filter(i => i.id !== id));
          message.success("Bookmark deleted");
        } catch {
          message.error("Gagal menghapus bookmark");
        }
      },
    });
  };

  const handleEditClick = (id) => {
    const item = bookmarks.find(b => b.id === id);
    if (!item) return;
    setEditingId(id);
    setEditName(item.name);
    setIsRenameModalOpen(true);
  };

  const handleRenameSave = async () => {
    if (!editName.trim()) return message.error("Name cannot be empty");

    try {
      await renameBookmark({ variables: { id: editingId, name: editName } });
      setBookmarks(prev => prev.map(item => item.id === editingId ? { ...item, name: editName } : item));
      setIsRenameModalOpen(false);
      setEditingId(null);
      setEditName("");
      message.success("Bookmark renamed");
    } catch {
      message.error("Gagal mengubah nama bookmark");
    }
  };

  // Updated handler for pinned order
  const handleUpdatePinnedOrder = async (items) => {
    try {
      await updatePinnedOrder({ variables: { items } });
      // Update local bookmarks state with new pinnedOrder
      setBookmarks(prev => {
        return prev.map(b => {
          const updated = items.find(i => i.id === b.id);
          return updated ? { ...b, pinnedOrder: updated.pinnedOrder } : b;
        });
      });
    } catch {
      message.error("Gagal menyimpan urutan.");
    }
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      message.success("Bookmarks refreshed");
    } catch (err){
      message.error("Failed to refresh bookmarks");
    }
  };

  return (
    <div>
      <BookmarkFilter
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
        searchQuery={searchQuery}
        onSearchChange={e => setSearchQuery(e.target.value)}
      />

      <Divider style={{ margin: "24px 0" }} />

      {error && <Alert description={error.message} type="error" style={{marginBottom: 16}}/>}

      {loading && bookmarks.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <BookmarkSkeleton />
          <BookmarkSkeleton />
          <BookmarkSkeleton />
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 20, height: 24 }}>
            <Typography.Text type="secondary" strong>
              {`Showing ${bookmarks.length} items`}
            </Typography.Text>
          </div>

          <BookmarkList
            bookmarks={bookmarks}
            currentFilter={currentFilter}
            searchQuery={searchQuery}
            onTogglePin={handleTogglePin}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onUpdatePinnedOrder={handleUpdatePinnedOrder}
            onRefresh={handleRefresh}
          />
        </>
      )}

      <RenameBookmarkModal
        open={isRenameModalOpen}
        name={editName}
        onChange={(e) => setEditName(e.target.value)}
        onSave={handleRenameSave}
        onCancel={() => setIsRenameModalOpen(false)}
      />
    </div>
  );
}