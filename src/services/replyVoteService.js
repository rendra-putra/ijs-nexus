import { gql } from "@apollo/client";

/**
 * =========================
 * VOTE REPLY
 * =========================
 */

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