import { gql } from "@apollo/client";

export const GET_TOP_USERS = gql`
  query GetTopUsers($range: ActivityRange, $limit: Int) {
    getTopUsers(range: $range, limit: $limit) {
      userId
      fullName
      totalReply
      totalPost
      totalActivity
    }
  }
`;