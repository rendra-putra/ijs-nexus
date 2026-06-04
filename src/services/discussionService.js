import { gql } from "@apollo/client";

/**
 * =========================
 * QUERY
 * =========================
 */

// public – search discussion
export const GET_DISCUSSIONS = gql`
  query GetDiscussions($search: String, $limit: Int, $offset: Int) {
    discussions(search: $search, limit: $limit, offset: $offset) {
			data {
				id
				question
				slug
				userId
        questioner
				tags
				answered
        status
        viewCount
        upvoteCount
        downvoteCount
        answerCount
        createdAt
			}
    }
  }
`;

// 🔹 Get single discussion by id
export const GET_DISCUSSION_BY_ID = gql`
  query GetDiscussionById($id: ID!) {
    discussionById(id: $id) {
      id
      question
      detail
      tags
    }
  }
`;

// 🔹 Get single discussion by slug
export const GET_DISCUSSION_BY_SLUG = gql`
  query GetDiscussionBySlug($slug: String!) {
    discussion(slug: $slug) {
      id
      slug
      question
      detail
      userId
      questioner
      tags
      status
      answered
      viewCount
      upvoteCount
      downvoteCount
      answerCount
      createdAt
    }
  }
`;

export const GET_MY_DISCUSSIONS = gql`
  query MyDiscussions($userId: String!, $limit: Int, $offset: Int) {
    myDiscussions(userId: $userId, limit: $limit, offset: $offset) {
      data {
        id
        slug
        question
        tags
        status
        answerCount
        viewCount
        upvoteCount
        downvoteCount
        createdAt
      }
      meta {
        total
        limit
        offset
      }
    }
  }
`;

export const GET_NEWEST_DISCUSSIONS = gql`
    query GetNewestDiscussions {
        getNewestDiscussions {
            id
            slug
            question
            detail
            userId
            questioner
            tags
            status
            answered
            viewCount
            upvoteCount
            downvoteCount
            answerCount
            createdAt
        }
    }
`;

export const GET_POPULAR_DISCUSSIONS = gql`
    query GetPopularDiscussions {
        getPopularDiscussions {
            id
            slug
            question
            detail
            userId
            questioner
            tags
            status
            answered
            viewCount
            upvoteCount
            downvoteCount
            answerCount
            createdAt
        }
    }
`;

export const GET_UNANSWERED_DISCUSSIONS = gql`
    query GetUnansweredDiscussions {
        getUnansweredDiscussions {
            id
            slug
            question
            detail
            userId
            questioner
            tags
            status
            answered
            viewCount
            upvoteCount
            downvoteCount
            answerCount
            createdAt
        }
    }
`;

export const GET_DISCUSSION_ACTIVITIES = gql`
  query GetDiscussionActivities($discussionId: ID!) {
    getDiscussionActivities(discussionId: $discussionId) {
      dateTime
      activity
      actor
    }
  }
`;

/**
 * =========================
 * MUTATION
 * =========================
 */

export const CREATE_DISCUSSION = gql`
  mutation CreateDiscussion(
    $input: CreateDiscussionInput!
    $userId: String!
    $fullName: String!
  ) {
    createDiscussion(input: $input) {
      id
      slug
      question
    }

    logPost(userId: $userId, fullName: $fullName) {
      id
      totalPost: postCount
    }
  }
`;

export const UPDATE_DISCUSSION = gql`
  mutation UpdateDiscussion($id: ID!, $fullname: String!, $input: UpdateDiscussionInput!) {
    updateDiscussion(id: $id, fullname: $fullname, input: $input) {
      id
      question
      slug
      detail
      tags
      status
      updatedAt
    }
  }
`;

export const DELETE_DISCUSSION = gql`
  mutation DeleteDiscussion($id: ID!, $fullname: String!) {
    deleteDiscussion(id: $id, fullname: $fullname) {
      success
    }
  }
`;

export const TOGGLE_DISCUSSION_STATUS = gql`
  mutation ToggleDiscussionStatus(
    $discussionId: ID!
    $userId: String!
    $status: String!
  ) {
    toggleDiscussionStatus(
      discussionId: $discussionId
      userId: $userId
      status: $status
    ) {
      id
      status
      answered
    }
  }
`;