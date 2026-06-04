import { gql } from "@apollo/client";

/**
 * =========================
 * QUERY
 * =========================
 */

export const GET_REPLY_BY_ID = gql`
  query GetReplyById($id: ID!) {
    replyById(id: $id) {
      id
      parentId
      fullname
      userId
      answer
      verified
      upvoteCount
      downvoteCount
      replyCount
      createdAt
      updatedAt
      deletedAt
      status
      upvoted
      downvoted
    }
  }
`;

export const GET_REPLIES = gql`
  query GetReplies($parentId: ID!, $userId: String!) {
    replies(parentId: $parentId, userId: $userId) {
      id
      parentId
      fullname
      userId
      answer
      verified
      upvoteCount
      downvoteCount
      replyCount
      createdAt
      updatedAt
      deletedAt
      status
      upvoted
      downvoted
    }
  }
`;

/**
 * =========================
 * CREATE REPLY
 * =========================
 */

export const CREATE_REPLY = gql`
  mutation CreateReply(
    $parentId: String!
    $userId: String!
    $fullname: String!
    $answer: String!
  ) {
    createReply(
      parentId: $parentId
      userId: $userId
      fullname: $fullname
      answer: $answer
    ) {
      id
      parentId
      userId
      fullname
      answer
      upvoteCount
      downvoteCount
      replyCount
      createdAt
    }
  }
`;

/**
 * =========================
 * UPDATE REPLY
 * =========================
 */

export const UPDATE_REPLY = gql`
  mutation UpdateReply(
    $id: ID!
    $userId: String!
    $input: UpdateReplyInput!
  ) {
    updateReply(
      id: $id
      userId: $userId
      input: $input
    ) {
      id
      answer
      status
      updatedAt
    }
  }
`;

/**
 * =========================
 * DELETE REPLY
 * =========================
 */

export const DELETE_REPLY = gql`
  mutation DeleteReply(
    $id: ID!
    $userId: String!
  ) {
    deleteReply(
      id: $id
      userId: $userId
    ) {
      id
      status
      deletedAt
    }
  }
`;

export const VOTE_REPLY = gql`
  mutation VoteReply(
    $replyId: ID!
    $userId: String!
    $type: String!
  ) {
    voteReply(
      replyId: $replyId
      userId: $userId
      type: $type
    ) {
      id
      upvoteCount
      downvoteCount
    }
  }
`;

export const BAN_REPLY = gql`
  mutation BanReply(
    $id: ID!
  ) {
    banReply(
      id: $id
    ) {
      id
      status
    }
  }
`;

export const MARK_ACCEPTED_REPLY = gql`
  mutation MarkReplyAsAccepted($replyId: ID!, $userId: String!) {
    markReplyAsAccepted(replyId: $replyId, userId: $userId) {
      id
      verified
      parentId
      updatedAt
    }
  }
`;