import {
  CheckOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";

import { useMutation, useQuery } from "@apollo/client/react";

import {
  Button,
  Descriptions,
  Divider,
  Drawer,
  Flex,
  message,
  Popconfirm,
  Space,
  Tag,
  theme,
  Typography
} from "antd";

import DOMPurify from "dompurify";
import { marked } from "marked";

import dayjs from "dayjs";

import {
  DELETE_ARTICLE,
  GET_ARTICLE_BY_ID
} from "../../services/articleService";

import {
  DELETE_DISCUSSION,
  GET_DISCUSSION_BY_ID
} from "../../services/discussionService";

import {
  BAN_REPLY,
  GET_REPLY_BY_ID
} from "../../services/replyService";

const { Title, Paragraph, Text } = Typography;

export default function ReportDetailDrawer({
  report,
  open,
  onClose,
  onResolve,
  loading
}) {
  const { token } = theme.useToken();

  /*
  =========================
  SAFE FLAGS
  =========================
  */

  const referenceId = report?.reference?.id;
  const referenceKind = report?.reference?.kind;

  const isDiscussion = referenceKind === "Discussion";
  const isArticle = referenceKind === "Article";
  const isReply = referenceKind === "Reply";

  /*
  =========================
  FETCH REFERENCE CONTENT
  =========================
  */

  const {
    data: discussionData,
    loading: discussionLoading
  } = useQuery(GET_DISCUSSION_BY_ID, {
    variables: { id: referenceId },
    skip: !referenceId || !isDiscussion
  });

  const {
    data: articleData,
    loading: articleLoading
  } = useQuery(GET_ARTICLE_BY_ID, {
    variables: { id: referenceId },
    skip: !referenceId || !isArticle
  });

  const {
    data: replyData,
    loading: replyLoading
  } = useQuery(GET_REPLY_BY_ID, {
    variables: { id: referenceId },
    skip: !referenceId || !isReply
  });

  /*
  =========================
  DELETE MUTATIONS
  =========================
  */

  const [deleteDiscussion, { loading: deleteDiscussionLoading }] =
    useMutation(DELETE_DISCUSSION, {
      onCompleted: () => {
        message.success("Discussion deleted");
        onClose();
      },
      onError: () => {
        message.error("Failed to delete discussion");
      }
    });

  const [deleteArticle, { loading: deleteArticleLoading }] =
    useMutation(DELETE_ARTICLE, {
      onCompleted: () => {
        message.success("Article deleted");
        onClose();
      },
      onError: () => {
        message.error("Failed to delete article");
      }
    });

  const [banReply, { loading: banReplyLoading }] =
    useMutation(BAN_REPLY, {
      onCompleted: () => {
        message.success("Reply banned");
        onClose();
      },
      onError: () => {
        message.error("Failed to ban reply");
      }
    });

  const deleting = deleteDiscussionLoading || deleteArticleLoading || banReplyLoading;

  /*
  =========================
  DELETE HANDLER
  =========================
  */

  const handleDelete = async () => {
    if (!referenceId) return;

    try {
      if (isDiscussion) {
        await deleteDiscussion({
          variables: { id: referenceId }
        });
      }

      if (isArticle) {
        await deleteArticle({
          variables: { id: referenceId }
        });
      }

      if (isReply) {
        await banReply({
          variables: { id: referenceId }
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  /*
  =========================
  RENDER REFERENCE CONTENT
  =========================
  */

  const renderReference = () => {
    if (!report?.reference) {
      return <Text type="secondary">No reference</Text>;
    }

    if (discussionLoading || articleLoading || replyLoading) {
      return <Text>Loading...</Text>;
    }

    if (isDiscussion) {
      const data = discussionData?.discussionById;

      if (!data) {
        return <Text type="secondary">Discussion not found</Text>;
      }

      return (
        <>
          <Divider size="small">Discussion</Divider>

          <Title level={5}>
            {data.question}
          </Title>

          <Paragraph>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked.parse(data.detail || "")),
              }}
            />
          </Paragraph>

          <Space wrap>
            {data.tags?.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Space>
        </>
      );
    }

    if (isArticle) {
      const data = articleData?.getArticleById;

      if (!data) {
        return <Text type="secondary">Article not found</Text>;
      }

      return (
        <>
          <Divider size="small">Article</Divider>

          <Title level={5}>
            {data.title}
          </Title>

          <Paragraph>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked.parse(data.content || "")),
              }}
            />
          </Paragraph>

          <Space wrap>
            {data.tags?.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Space>
        </>
      );
    }

    if (isReply) {
      const data = replyData?.replyById;

      if (!data) {
        return <Text type="secondary">Reply not found</Text>;
      }

      return (
        <>
          <Divider size="small">Reply</Divider>

          <Paragraph>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked.parse(data.answer || "")),
              }}
            />
          </Paragraph>
        </>
      );
    }

    return <Text type="secondary">Unknown reference</Text>;
  };

  /*
  =========================
  SAFE RETURN
  =========================
  */

  if (!report) return null;

  const isOpen = report.status === "open";

  /*
  =========================
  UI
  =========================
  */

  return (
    <Drawer
      title="Report Detail"
      width={500}
      open={open}
      onClose={onClose}
      extra={
        <Space>
          {isOpen && (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              loading={loading}
              onClick={() => onResolve(report.id)}
            >
              Resolve
            </Button>
          )}
        </Space>
      }
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Reporter">
          <Text strong>{report.reporter?.fullName}</Text>
        </Descriptions.Item>

        <Descriptions.Item label="Reported User">
          <Text strong>{report.user?.fullName}</Text>
        </Descriptions.Item>

        <Descriptions.Item label="Reason">
          <Tag color="orange">{report.reason}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <Tag color={isOpen ? "red" : "green"}>
            {report.status}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Issued At">
          <Space>
            <ClockCircleOutlined />
            {dayjs(Number(report.issuedAt)).format("YYYY-MM-DD HH:mm")}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Detail">
          {report.detail}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Flex justify="space-between">
        <Space>
          <FileSearchOutlined style={{ fontSize: 18 }} />
          <Title level={4} style={{ margin: 0 }}>
            Reported Content
          </Title>
        </Space>

        <Popconfirm
          title="Delete this content?"
          description="This action cannot be undone."
          onConfirm={handleDelete}
          okText="Delete"
          cancelText="Cancel"
        >
          <Button
            icon={<DeleteOutlined />}
            danger
            loading={deleting}
          >
            Delete
          </Button>
        </Popconfirm>
      </Flex>

      <div
        style={{
          marginTop: 8,
          padding: 12,
          background: token.colorBgContainer,
          borderRadius: 6,
          border: `1px solid ${token.colorBorder}`
        }}
      >
        {renderReference()}
      </div>
    </Drawer>
  );
}