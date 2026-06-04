import {
  BookOutlined,
  CommentOutlined,
  EyeOutlined,
  FlagOutlined,
  LikeOutlined,
  ShareAltOutlined
} from "@ant-design/icons";

import {
  useMutation,
  useQuery
} from "@apollo/client/react";

import { Button, Space, Tooltip, message } from "antd";
import { useEffect, useState } from "react";

import { useAuth } from "../../contexts/AuthContext";
import { formatNumber } from "../../utils/formatNumberUtil";

import {
  GET_ARTICLE_VIEW_LIKE,
  LIKE_ARTICLE,
  UNLIKE_ARTICLE,
  VIEW_ARTICLE
} from "../../services/articleViewLikeService";

import { ADD_BOOKMARK } from "../../services/bookmarkService";
import ReportModal from "../report/ReportModal";

export default function ArticleActions({ article }) {
  const { user } = useAuth();

  const isOwner = user?.id === article?.userId;

  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(article?.stats?.likes ?? 0);
  const [views, setViews] = useState(article?.stats?.views ?? 0);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // =========================
  // ✅ QUERY (CORRECT ONE)
  // =========================
  const { data, loading: likeLoading } = useQuery(GET_ARTICLE_VIEW_LIKE, {
    variables: {
      articleId: article?.id,
      userId: user?.id,
    },
    skip: !article?.id || !user?.id,
    fetchPolicy: "network-only", // 🔥 important to avoid stale cache
  });

  // =========================
  // ✅ SYNC LIKE STATE (NULL SAFE)
  // =========================
  useEffect(() => {
    if (!likeLoading) {
      const liked = data?.getArticleViewLike?.liked ?? false;
      setIsLiked(liked);
    }
  }, [data, likeLoading]);

  // =========================
  // MUTATIONS
  // =========================
  const [likeArticle] = useMutation(LIKE_ARTICLE);
  const [unlikeArticle] = useMutation(UNLIKE_ARTICLE);
  const [viewArticle] = useMutation(VIEW_ARTICLE);
  const [addBookmark, { loading: bookmarkLoading }] = useMutation(ADD_BOOKMARK);

  // =========================
  // ✅ AUTO VIEW (SAFE)
  // =========================
  useEffect(() => {
    if (!article?.id || !user?.id) return;

    viewArticle({
      variables: {
        articleId: article.id,
        userId: user.id
      }
    });

    setViews((prev) => prev + 1);
  }, [article?.id, user?.id]);

  // =========================
  // ✅ LIKE / UNLIKE (ROBUST)
  // =========================
  const handleToggleLike = async () => {
    if (!user?.id) {
      message.warning("Please login to like");
      return;
    }

    const previousLiked = isLiked;

    // optimistic UI
    setIsLiked(!previousLiked);
    setLikes((prev) => prev + (previousLiked ? -1 : 1));

    try {
      if (!previousLiked) {
        await likeArticle({
          variables: { articleId: article.id, userId: user.id }
        });
      } else {
        await unlikeArticle({
          variables: { articleId: article.id, userId: user.id }
        });
      }
    } catch (err) {
      // rollback
      setIsLiked(previousLiked);
      setLikes((prev) => prev + (previousLiked ? 1 : -1));

      message.error("Failed to process like");
    }
  };

  // =========================
  // ✅ BOOKMARK
  // =========================
  const handleBookmark = async () => {
    if (!user?.id) {
      message.warning("Please login to bookmark");
      return;
    }

    try {
      setIsBookmarked(true);

      await addBookmark({
        variables: {
          owner: user.id,
          kind: "Article",
          name: article.title,
          link: `/articles/read/${article.slug}`,
        },
      });

      message.success("Saved to bookmark");
    } catch (err) {
      setIsBookmarked(false);
      message.error(err.message || "Failed to save bookmark");
    }
  };

  // =========================
  // ✅ SHARE
  // =========================
  const handleShare = async () => {
    const shareData = {
      title: article?.title,
      text: `Check out this article: ${article?.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        message.error("Share failed");
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      message.success("Link copied!");
    }
  };

  return (
    <>
      <Space>
        {/* LIKE */}
        <Tooltip title="Like">
          <Button
            icon={<LikeOutlined />}
            type={isLiked ? "primary" : "default"}
            onClick={handleToggleLike}
            loading={likeLoading}
          >
            {formatNumber(likes)}
          </Button>
        </Tooltip>

        {/* VIEWS */}
        <Tooltip title="Views">
          <Space size={4}>
            <EyeOutlined />
            {formatNumber(views)}
          </Space>
        </Tooltip>

        {/* COMMENTS */}
        <Tooltip title="Comments">
          <Space size={4}>
            <CommentOutlined />
            {formatNumber(article.stats?.comments ?? 0)}
          </Space>
        </Tooltip>

        {/* BOOKMARK */}
        <Tooltip title="Save to bookmark">
          <Button
            icon={<BookOutlined />}
            type={isBookmarked ? "primary" : "default"}
            onClick={handleBookmark}
            loading={bookmarkLoading}
          />
        </Tooltip>

        {/* SHARE */}
        <Tooltip title="Share">
          <Button icon={<ShareAltOutlined />} onClick={handleShare} />
        </Tooltip>

        {/* REPORT - Hanya muncul jika bukan pemilik */}
        {!isOwner && (
          <Tooltip title="Report">
            <Button
              icon={<FlagOutlined />}
              onClick={() => setIsReportModalOpen(true)}
            />
          </Tooltip>
        )}
      </Space>

      <ReportModal
        open={isReportModalOpen}
        onCancel={() => setIsReportModalOpen(false)}
        onSubmit={() => setIsReportModalOpen(false)}
        reportedUser={{
          id: article?.userId,
          fullname: article?.author
        }}
        reference={{
          kind: "Article",
          id: article?.id,
          snippet: article?.title
        }}
      />
    </>
  );
}