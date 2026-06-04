import React from "react";
import { FileDoneOutlined, MessageOutlined, QuestionOutlined } from "@ant-design/icons";

import {
  Card,
  Col,
  Row,
  Statistic,
  Alert,
  Skeleton,
} from "antd";

import { useQuery } from "@apollo/client/react";
import { GET_SUMMARY_STATS } from "../../services/homeService";

export default function SummaryInfo() {
  const { data, loading, error } = useQuery(GET_SUMMARY_STATS);
  
  if (loading) {
    return (
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[1, 2, 3].map((item) => (
          <Col xs={24} sm={12} md={8} key={item}>
            <Card variant="borderless" style={{ borderRadius: 12 }}>
               <Skeleton active paragraph={{ rows: 1 }} title={false} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  if (error) return <Alert message="Error fetching summary data" type="error" style={{ marginBottom: 24 }} />;

  const { totalDiscussions, unansweredDiscussions, publishedArticles } = data.getSummaryStats;

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} md={8}>
        <Card variant="borderless" style={{ borderRadius: 12 }}>
          <Statistic
            title="Total Discussions"
            value={totalDiscussions}
            prefix={<MessageOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={8}>
        <Card variant="borderless" style={{ borderRadius: 12 }}>
          <Statistic
            title="Unanswered Discussions"
            value={unansweredDiscussions}
            prefix={<QuestionOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={8}>
        <Card variant="borderless" style={{ borderRadius: 12 }}>
          <Statistic
            title="Published Articles"
            value={publishedArticles}
            prefix={<FileDoneOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
}