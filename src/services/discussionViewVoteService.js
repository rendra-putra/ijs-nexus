import { gql } from "@apollo/client";

/*
=========================
QUERY
=========================
*/

export const GET_DISCUSSION_VIEW_VOTE = gql`
  query GetDiscussionViewVote($discussionId: ID!, $userId: String!) {
    discussionViewVote(discussionId: $discussionId, userId: $userId) {
      viewed
      upvoted
      downvoted
    }
  }
`;

export const GET_USER_VOTE_STATUS = gql`
  query GetUserVoteStatus($discussionId: ID!, $userId: String!) {
    userVoteStatus(discussionId: $discussionId, userId: $userId) {
      upvoted
      downvoted
    }
  }
`;

/*
=========================
MUTATION
=========================
*/

export const VOTE_DISCUSSION = gql`
  mutation VoteDiscussion(
    $discussionId: ID!
    $userId: String!
    $type: String!
  ) {
    voteDiscussion(
      discussionId: $discussionId
      userId: $userId
      type: $type
    ) {
      id
      upvoteCount
      downvoteCount
    }
  }
`;

export const VIEW_DISCUSSION = gql`
  mutation ViewDiscussion(
    $discussionId: ID!
    $userId: String!
  ) {
    viewDiscussion(
      discussionId: $discussionId
      userId: $userId
    ) {
      id
      viewCount
    }
  }
`;