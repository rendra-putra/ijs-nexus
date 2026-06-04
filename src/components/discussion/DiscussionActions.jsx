import {
  BookOutlined,
  DownOutlined,
  FlagOutlined,
  HistoryOutlined,
  ShareAltOutlined,
  UpOutlined
} from "@ant-design/icons";

import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { Button, Space, Tag, Tooltip, message } from "antd";
import { useState } from "react";

import { useAuth } from "../../contexts/AuthContext";
import { formatNumber } from "../../utils/formatNumberUtil";

import ReportModal from "../report/ReportModal";
import EventsModal from "./EventsModal";

import {
  GET_DISCUSSION_VIEW_VOTE,
  VOTE_DISCUSSION
} from "../../services/discussionViewVoteService";

import { ADD_BOOKMARK } from "../../services/bookmarkService";
import { GET_DISCUSSION_ACTIVITIES } from "../../services/discussionService";

export default function DiscussionActions({ discussion }) {
  const { user } = useAuth();

  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [fetchActivities, { data: activitiesData, loading: activitiesLoading }] =
    useLazyQuery(GET_DISCUSSION_ACTIVITIES);

  const activities = activitiesData?.getDiscussionActivities || [];

  const handleOpenActivities = () => {
    setIsEventsModalOpen(true);
    fetchActivities({ variables: { discussionId: discussion.id } });
  };

  const { data: voteData } = useQuery(GET_DISCUSSION_VIEW_VOTE, {
    variables: {
      discussionId: discussion?.id,
      userId: user?.id
    },
    skip: !discussion?.id || !user?.id
  });

  const voteStatus = voteData?.discussionViewVote;

  const [voteDiscussion] = useMutation(VOTE_DISCUSSION, {
    refetchQueries: [
      {
        query: GET_DISCUSSION_VIEW_VOTE,
        variables: {
          discussionId: discussion?.id,
          userId: user?.id
        }
      }
    ],
    awaitRefetchQueries: true
  });
  const [addBookmark, { loading: bookmarkLoading }] =
    useMutation(ADD_BOOKMARK);

  const handleVote = (type) => {
    voteDiscussion({
      variables: {
        discussionId: discussion.id,
        userId: user?.id,
        type
      }
    });
  };

  const handleBookmark = () => {
    addBookmark({
      variables: {
        owner: user.id,
        kind: "Discussion",
        name: discussion.question,
        link: `/discussions/read/${discussion.slug}`
      }
    });
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: discussion?.question,
          text: discussion?.question,
          url
        });
      } catch { }
    } else {
      navigator.clipboard.writeText(url);
      message.success("Link copied!");
    }
  };

  return (
    <>
      <div style={{ marginTop: 16 }}>
        <Space wrap size={[16, 16]}>
          <Space wrap size={[8, 8]}>
            <Tooltip title="Upvote">
              <Button
                icon={<UpOutlined />}
                type={voteStatus?.upvoted ? "primary" : "default"}
                onClick={() => handleVote("up")}
              >
                {formatNumber(discussion?.upvoteCount || 0)}
              </Button>
            </Tooltip>

            <Tooltip title="Downvote">
              <Button
                icon={<DownOutlined />}
                type={voteStatus?.downvoted ? "primary" : "default"}
                danger={voteStatus?.downvoted}
                onClick={() => handleVote("down")}
              >
                {formatNumber(discussion?.downvoteCount || 0)}
              </Button>
            </Tooltip>

            <Tooltip title="Activities">
              <Button icon={<HistoryOutlined />} onClick={handleOpenActivities} />
            </Tooltip>

            <Tooltip title="Bookmark">
              <Button
                icon={<BookOutlined />}
                onClick={handleBookmark}
                loading={bookmarkLoading}
              />
            </Tooltip>

            <Tooltip title="Share">
              <Button icon={<ShareAltOutlined />} onClick={handleShare} />
            </Tooltip>

            {discussion?.userId !== user?.id && (
              <Tooltip title="Report">
                <Button
                  icon={<FlagOutlined />}
                  onClick={() => setIsReportModalOpen(true)}
                />
              </Tooltip>
            )}
          </Space>
          <Space size={4}>
            <Tag color="blue">
              {formatNumber(discussion?.viewCount || 0)} views
            </Tag>

            <Tag color="green">
              {formatNumber(discussion?.answerCount || 0)} answers
            </Tag>
          </Space>
        </Space>
      </div>

      <EventsModal
        open={isEventsModalOpen}
        onCancel={() => setIsEventsModalOpen(false)}
        events={activities}
        loading={activitiesLoading}
      />

      <ReportModal
        open={isReportModalOpen}
        onCancel={() => setIsReportModalOpen(false)}
        onSubmit={() => setIsReportModalOpen(false)}
        reportedUser={{
          id: discussion?.userId,
          fullname: discussion?.questioner
        }}
        reference={{
          kind: "Discussion",
          id: discussion?.id,
          snippet: discussion?.question
        }}
      />
    </>
  );
}