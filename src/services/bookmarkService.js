import { gql } from "@apollo/client";

export const GET_MY_BOOKMARKS = gql`
  query GetMyBookmarks($userId: String!) {
    getMyBookmarks(userId: $userId) {
      id
      owner
      kind
      name
      link
      pinned
      pinnedOrder
      addedAt
    }
  }
`;

export const ADD_BOOKMARK = gql`
  mutation AddBookmark(
    $owner: String!
    $kind: BookmarkKind!
    $name: String!
    $link: String!
  ) {
    addBookmark(
      owner: $owner
      kind: $kind
      name: $name
      link: $link
    ) {
      id
      owner
      kind
      name
      link
      pinned
      pinnedOrder
      addedAt
    }
  }
`;

export const RENAME_BOOKMARK = gql`
  mutation RenameBookmark($id: ID!, $name: String!) {
    renameBookmark(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const DELETE_BOOKMARK = gql`
  mutation DeleteBookmark($id: ID!) {
    deleteBookmark(id: $id)
  }
`;

export const PIN_BOOKMARK = gql`
  mutation PinBookmark($id: ID!) {
    pinBookmark(id: $id) {
      id
      pinned
      pinnedOrder
    }
  }
`;

export const UNPIN_BOOKMARK = gql`
  mutation UnpinBookmark($id: ID!) {
    unpinBookmark(id: $id) {
      id
      pinned
      pinnedOrder
    }
  }
`;

export const UPDATE_PINNED_ORDER = gql`
  mutation UpdatePinnedOrder($items: [OrderItemInput!]!) {
    updatePinnedOrder(items: $items)
  }
`;