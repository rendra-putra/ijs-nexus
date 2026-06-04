import { gql } from "@apollo/client";

/**
 * =========================
 * QUERY
 * =========================
 */

// public – search / newest
export const GET_ARTICLES = gql`
  query GetArticles($keyword: String) {
    getArticles(keyword: $keyword) {
      id
      title
      slug
      author
      stats {
        likes
        comments
        views
      }
      createdAt
      tags
    }
  }
`;

// owner – my articles
export const GET_MY_ARTICLES = gql`
  query GetMyArticles($userId: String!) {
    getMyArticles(userId: $userId) {
      id
      title
      slug
      status
      createdAt
    }
  }
`;

// detail
export const GET_ARTICLE_BY_SLUG = gql`
  query GetArticleBySlug($slug: String!) {
    getArticleBySlug(slug: $slug) {
      id
      title
      slug
      userId
      author
      content
      coverImage
      tags
      stats {
        likes
        comments
        views
      }
      createdAt
      comments {
        text
        postedAt
        user {
          fullName
        }
      }
    }
  }
`;

export const GET_ARTICLE_BY_ID = gql`
  query GetArticleById($id: ID!) {
    getArticleById(id: $id) {
      id
      title
      content
      tags
      coverImage
    }
  }
`;


/**
 * =========================
 * MUTATION
 * =========================
 */

export const CREATE_ARTICLE = gql`
  mutation CreateArticle(
    $title: String!
    $userId: String!
    $author: String!
    $coverImage: String
    $content: String!
    $tags: [String!]
  ) {
    createArticle(
      title: $title
      userId: $userId
      author: $author
      coverImage: $coverImage
      content: $content
      tags: $tags
    ) {
      id
      slug
    }
    
    logPost(userId: $userId, fullName: $author) {
      id
      totalPost: postCount
    }
  }
`;

export const ADD_ARTICLE_COMMENT = gql`
  mutation AddArticleComment(
    $articleId: ID!
    $user: UserInput!
    $text: String!
    $userId: String!
    $fullName: String!
  ) {
    addArticleComment(
      articleId: $articleId
      user: $user
      text: $text
    ) {
      id
      comments {
        text
        postedAt
        user {
          fullName
        }
      }
    }

    logReply(userId: $userId, fullName: $fullName) {
      id
      totalReply: replyCount
    }
  }
`;

export const UPDATE_ARTICLE_STATUS = gql`
  mutation UpdateArticleStatus($id: ID!, $status: ArticleStatus!) {
    updateArticleStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const UPDATE_ARTICLE = gql`
  mutation UpdateArticle(
    $id: ID!
    $title: String
    $coverImage: String
    $content: String
    $tags: [String!]
  ) {
    updateArticle(
      id: $id
      title: $title
      coverImage: $coverImage
      content: $content
      tags: $tags
    ) {
      id
      title
      content
      tags
      coverImage
    }
  }
`;

export const DELETE_ARTICLE = gql`
  mutation DeleteArticle($id: ID!) {
    deleteArticle(id: $id)
  }
`;
