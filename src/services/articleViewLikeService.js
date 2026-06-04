import { gql } from "@apollo/client";

export const GET_ARTICLE_VIEW_LIKE = gql`
  query GetArticleViewLike($articleId: ID!, $userId: ID!) {
    getArticleViewLike(articleId: $articleId, userId: $userId) {
      liked
      viewed
    }
  }
`;

export const LIKE_ARTICLE = gql`
  mutation LikeArticle($articleId: ID!, $userId: ID!) {
    likeArticle(articleId: $articleId, userId: $userId)
  }
`;

export const UNLIKE_ARTICLE = gql`
  mutation UnlikeArticle($articleId: ID!, $userId: ID!) {
    unlikeArticle(articleId: $articleId, userId: $userId)
  }
`;

export const VIEW_ARTICLE = gql`
  mutation ViewArticle($articleId: ID!, $userId: ID!) {
    viewArticle(articleId: $articleId, userId: $userId)
  }
`;