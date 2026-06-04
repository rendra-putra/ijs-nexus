import {
  PlusOutlined,
  SearchOutlined,
  UserOutlined
} from "@ant-design/icons";

import { useQuery } from "@apollo/client/react";

import {
  Alert,
  Button,
  Col,
  Grid,
  Input,
  Row,
  Space,
  Typography
} from "antd";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DiscussionList from "../../components/discussion/DiscussionList";

import {
  GET_DISCUSSIONS,
  GET_NEWEST_DISCUSSIONS,
  GET_POPULAR_DISCUSSIONS,
  GET_UNANSWERED_DISCUSSIONS
} from "../../services/discussionService";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function DiscussionListPage() {
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const isMobile = !screens.md;

  const [searchInput, setSearchInput] = useState(""); 
  const [activeSearch, setActiveSearch] = useState(""); 
  const [activeFilter, setActiveFilter] = useState("newest");

  // ================= QUERY =================
  const { data: searchData, loading: searchLoading, error: searchError } = useQuery(GET_DISCUSSIONS, {
    variables: { search: activeSearch, limit: 10, offset: 0 },
    skip: activeSearch === "",
    fetchPolicy: "network-only"
  });

  const { data: newestData, loading: newestLoading, error: newestError } = useQuery(GET_NEWEST_DISCUSSIONS, {
    skip: activeSearch !== "" || activeFilter !== "newest",
    fetchPolicy: "network-only"
  });

  const { data: popularData, loading: popularLoading, error: popularError } = useQuery(GET_POPULAR_DISCUSSIONS, {
    skip: activeSearch !== "" || activeFilter !== "popular",
    fetchPolicy: "network-only"
  });

  const { data: unansweredData, loading: unansweredLoading, error: unansweredError } = useQuery(GET_UNANSWERED_DISCUSSIONS, {
    skip: activeSearch !== "" || activeFilter !== "unanswered",
    fetchPolicy: "network-only"
  });

  const loading = searchLoading || newestLoading || popularLoading || unansweredLoading;
  const error = searchError || newestError || popularError || unansweredError;

  // ================= DATA =================
  let discussions = [];

  if (activeSearch !== "") {
    discussions = searchData?.discussions?.data || [];
  } else {
    if (activeFilter === "newest") {
      discussions = newestData?.getNewestDiscussions || [];
    } else if (activeFilter === "popular") {
      discussions = popularData?.getPopularDiscussions || [];
    } else if (activeFilter === "unanswered") {
      discussions = unansweredData?.getUnansweredDiscussions || [];
    }
  }

  // ================= HANDLER =================
  const handleSearch = () => {
    const value = searchInput.trim();
    setActiveSearch(value);

    if (value !== "") {
      setActiveFilter(""); 
    } else {
      setActiveFilter("newest");
    }
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setSearchInput("");
    setActiveSearch("");
  };

  // ================= ERROR =================
  if (error) {
    return (
      <Alert
        description={error.message}
        type="error"
        style={{ marginTop: 16 }}
      />
    );
  }

  return (
    <div style={{ width: "100%" }}>

      {/* ================= HEADER ================= */}
      <Row
        align="middle"
        justify="space-between"
        style={{ marginBottom: isMobile ? 16 : 24 }}
      >
        <Col>
          <Title level={isMobile ? 4 : 2} style={{ margin: 0 }}>
            Forum Discussions
          </Title>
        </Col>

        <Col>
          <Space
            size="middle"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: isMobile ? "100%" : "auto",
              marginTop: isMobile ? 12 : 0
            }}
          >
            <Button
              icon={<UserOutlined />}
              block={isMobile}
              onClick={() => navigate("/discussions/mine")}
            >
              My Discussions
            </Button>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              block={isMobile}
              onClick={() => navigate("/discussions/create")}
            >
              New Discussion
            </Button>
          </Space>
        </Col>
      </Row>

      {/* ================= SEARCH ================= */}
      <Row style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Input.Group compact style={{ display: "flex" }}>
            <Input
              size="large"
              placeholder="Search discussions..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onPressEnter={handleSearch}
              style={{ flex: 1 }}
            />

            <Button
              icon={<SearchOutlined />}
              size="large"
              onClick={handleSearch}
              loading={loading}
            >
              {!isMobile && "Search"}
            </Button>
          </Input.Group>
        </Col>
      </Row>

      {/* ================= FILTER ================= */}
      {isMobile ? (
        // ✅ MOBILE (stack kiri)
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            {discussions.length} discussions
          </Text>

          <div style={{ marginTop: 8 }}>
            <Space.Compact style={{ width: "100%" }}>
              <Button
                type={activeFilter === "newest" ? "primary" : "default"}
                block
                onClick={() => handleFilterClick("newest")}
              >
                Newest
              </Button>

              <Button
                type={activeFilter === "popular" ? "primary" : "default"}
                block
                onClick={() => handleFilterClick("popular")}
              >
                Popular
              </Button>

              <Button
                type={activeFilter === "unanswered" ? "primary" : "default"}
                block
                onClick={() => handleFilterClick("unanswered")}
              >
                Unanswered
              </Button>
            </Space.Compact>
          </div>
        </div>
      ) : (
        // ✅ DESKTOP (inline kiri-kanan)
        <Row
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Text type="secondary">
              {discussions.length} discussions
            </Text>
          </Col>

          <Col style={{ marginLeft: "auto" }}>
            <Space>
              <Text>Filter:</Text>

              <Space.Compact>
                <Button
                  type={activeFilter === "newest" ? "primary" : "default"}
                  onClick={() => handleFilterClick("newest")}
                >
                  Newest
                </Button>

                <Button
                  type={activeFilter === "popular" ? "primary" : "default"}
                  onClick={() => handleFilterClick("popular")}
                >
                  Popular
                </Button>

                <Button
                  type={activeFilter === "unanswered" ? "primary" : "default"}
                  onClick={() => handleFilterClick("unanswered")}
                >
                  Unanswered
                </Button>
              </Space.Compact>
            </Space>
          </Col>
        </Row>
      )}

      {/* ================= LIST ================= */}
      <DiscussionList
        discussions={discussions}
        loading={loading}
      />

    </div>
  );
}