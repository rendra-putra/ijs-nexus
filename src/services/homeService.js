import { gql } from "@apollo/client";

export const GET_SUMMARY_STATS = gql`
    query GetSummaryStats {
        getSummaryStats {
            totalDiscussions
            unansweredDiscussions
            publishedArticles
        }
    }
`;

export const GET_TRENDING_DISCUSSIONS = gql`
    query GetTrendingDiscussions($limit: Int) {
        getTrendingDiscussions(limit: $limit) {
            id
            question
            slug
        }
    }
`;

export const GET_RECENT_DISCUSSIONS = gql`
    query GetRecentDiscussions($limit: Int) {
        getRecentDiscussions(limit: $limit) {
            id
            question
            slug
            questioner  
            createdAt
        }
    }
`;

export const GET_POPULAR_TAGS = gql `
    query GetPopularTags($limit: Int) {
        getPopularTags(limit: $limit)
    }
`;