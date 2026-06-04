import { SyncOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Alert,
  App,
  Button,
  Card,
  Grid,
  Pagination,
  Spin,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

import MyDiscussionList from "../../components/discussion/MyDiscussionList";
import { useAuth } from "../../contexts/AuthContext";

import {
  GET_MY_DISCUSSIONS,
  TOGGLE_DISCUSSION_STATUS,
} from "../../services/discussionService";

const { Text } = Typography;
const { useBreakpoint } = Grid;

export default function MyDiscussionPage() {
  const { user } = useAuth();
  const { message } = App.useApp();
  const screens = useBreakpoint();

  const isMobile = !screens.md;
  const userId = user.id;

  const [page, setPage] = useState(1);
  const [lastRefresh, setLastRefresh] = useState(null);

  // 🔥 LOCAL STATE (source of truth UI)
  const [localDiscussions, setLocalDiscussions] = useState([]);

  const limit = 10;

  const { data, loading, error, refetch, networkStatus } = useQuery(
    GET_MY_DISCUSSIONS,
    {
      variables: {
        userId,
        limit,
        offset: (page - 1) * limit,
      },
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    }
  );

  const [toggleDiscussion] = useMutation(TOGGLE_DISCUSSION_STATUS);

  const total = data?.myDiscussions?.meta?.total ?? 0;

  const isRefetching = networkStatus === 4;

  // =========================
  // 🔥 SYNC SERVER → LOCAL STATE
  // =========================
  useEffect(() => {
    if (data?.myDiscussions?.data) {
      setLocalDiscussions(data.myDiscussions.data);
    }
  }, [data]);

  // =========================
  // 🔥 REFRESH
  // =========================
  const handleRefresh = async () => {
    try {
      await refetch({
        userId,
        limit,
        offset: (page - 1) * limit,
      });

      setLastRefresh(new Date());
    } catch (e) {
      message.error("Failed to refresh");
    }
  };

  // =========================
  // 🔥 TOGGLE STATUS (OPTIMISTIC)
  // =========================
  const handleToggleStatus = async (item) => {
    if (!user) return;

    const nextStatus =
      item.status === "open" ? "closed" : "open";

    // 🔥 backup
    const prev = [...localDiscussions];

    // ✅ optimistic update
    setLocalDiscussions((prevState) =>
      prevState.map((d) =>
        d.id === item.id
          ? { ...d, status: nextStatus }
          : d
      )
    );

    try {
      await toggleDiscussion({
        variables: {
          discussionId: item.id,
          userId: user.id,
          status: nextStatus,
        },
      });

      message.success(
        nextStatus === "closed"
          ? "Discussion closed 🔒"
          : "Discussion reopened 🔓"
      );
    } catch (err) {
      console.error(err);

      // 🔥 rollback
      setLocalDiscussions(prev);

      message.error("Failed to update discussion ❌");
    }
  };

  if (error)
    return <Alert description={error.message} type="error" />;

  return (
    <div style={{ position: "relative" }}>
      {/* 🔥 OVERLAY */}
      {isRefetching && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,255,255,0.65)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(2px)",
            borderRadius: 12,
          }}
        >
          <Spin size="large" tip="Refreshing discussions..." />
        </div>
      )}

      <Card
        styles={{
          body: {
            padding: isMobile ? 12 : 24,
          },
        }}
        style={{ borderRadius: 12 }}
        extra={
          <Tooltip title="Refresh">
            <Button
              icon={<SyncOutlined spin={isRefetching} />}
              loading={isRefetching}
              onClick={handleRefresh}
            />
          </Tooltip>
        }
      >
        {lastRefresh && (
          <Text type="secondary" style={{ display: "block", marginBottom: 10 }}>
            Last updated: {lastRefresh.toLocaleTimeString()}
          </Text>
        )}

        <MyDiscussionList
          discussions={localDiscussions}
          loading={loading && !isRefetching}
          onToggleStatus={handleToggleStatus}
        />

        <Pagination
          style={{
            marginTop: 20,
            textAlign: isMobile ? "center" : "right",
          }}
          current={page}
          pageSize={limit}
          total={total}
          onChange={(p) => setPage(p)}
        />
      </Card>
    </div>
  );
}