import { gql } from "@apollo/client";

export const GET_REPORTS = gql`
  query GetReports($status: ReportStatus, $from: String, $to: String) {
    reports(status: $status, from: $from, to: $to) {
      id
      reason
      detail
      status
      issuedAt

      user {
        id
        fullName
      }

      reporter {
        id
        fullName
      }

      reference {
        id
        kind
      }
    }
  }
`;

export const ADD_REPORT = gql`
  mutation AddReport(
    $user: UserRefInput!
    $reporter: UserRefInput!
    $reason: String!
    $detail: String!
    $reference: ReferenceInput!
  ) {
    addReport(
      user: $user
      reporter: $reporter
      reason: $reason
      detail: $detail
      reference: $reference
    ) {
      id
      status
    }
  }
`;

export const CLOSE_REPORT = gql`
  mutation CloseReport($id: ID!) {
    closeReport(id: $id) {
      id
      status
    }
  }
`;

export const DELETE_REPORTS = gql`
  mutation DeleteReports($ids: [ID!]!) {
    deleteReports(ids: $ids)
  }
`;