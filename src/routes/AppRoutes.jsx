import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";
import ArticleDetailPage from "../pages/Article/ArticleDetailPage";
import ArticleListPage from "../pages/Article/ArticleListPage";
import CreateArticlePage from "../pages/Article/CreateArticlePage";
import EditArticlePage from "../pages/Article/EditArticlePage";
import MyArticlePage from "../pages/Article/MyArticlePage";
import BookmarkPage from "../pages/BookmarkPage";
import CrossAppAuthPage from "../pages/CrossAppAuthPage";
import CreateDiscussionPage from "../pages/Discussion/CreateDiscussionPage";
import DiscussionDetailPage from "../pages/Discussion/DiscussionDetailPage";
import DiscussionListPage from "../pages/Discussion/DiscussionListPage";
import MyDiscussionPage from "../pages/Discussion/MyDiscussionPage";
import UpdateDiscussionPage from "../pages/Discussion/UpdateDiscussionPage";
import ForbiddenPage from "../pages/ForbiddenPage";
import HomePage from "../pages/HomePage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import OAuthSuccessPage from "../pages/OAuthSuccessPage";
import ReportPage from "../pages/ReportPage";
import AskAIPage from "../pages/AskAIPage";
import AboutPage from "../pages/AboutPage";

const AppRoutes = () => (
  <Routes>
    {/* No layout */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/oauth-success" element={<OAuthSuccessPage />} />
    <Route path="/auth/cross-app" element={<CrossAppAuthPage />} />
    <Route path="/forbidden" element={<ForbiddenPage />} />
    {/* With layout */}
    {/* Protected routes */}
    <Route
      path="/home"
      element={
        <ProtectedRoute>
          <MainLayout>
            <HomePage />
          </MainLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/discussions"
      element={
        <ProtectedRoute>
          <MainLayout>
            <DiscussionListPage />
          </MainLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/discussions/read/:slug"
      element={
        <ProtectedRoute>
          <MainLayout>
            <DiscussionDetailPage />
          </MainLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/discussions/create"
      element={
        <ProtectedRoute>
          <MainLayout>
            <CreateDiscussionPage />
          </MainLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/discussions/update/:id"
      element={
        <ProtectedRoute>
          <MainLayout>
            <UpdateDiscussionPage />
          </MainLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/discussions/mine"
      element={
        <ProtectedRoute>
          <MainLayout>
            <MyDiscussionPage />
          </MainLayout>
        </ProtectedRoute>
      }
    />

    {/* Articles */}
    <Route
      path="/my-articles"
      element={
        <ProtectedRoute>
          <MainLayout>
            <MyArticlePage />
          </MainLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/my-articles/create"
      element={
        <ProtectedRoute>
          <MainLayout>
            <CreateArticlePage />
          </MainLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/my-articles/edit/:id"
      element={
        <ProtectedRoute>
          <MainLayout>
            <EditArticlePage />
          </MainLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/articles/read/:slug"
      element={
        <ProtectedRoute>
          <MainLayout>
            <ArticleDetailPage />
          </MainLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/articles"
      element={
        <ProtectedRoute>
          <MainLayout>
            <ArticleListPage />
          </MainLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/bookmark"
      element={
        <ProtectedRoute>
          <MainLayout>
            <BookmarkPage />
          </MainLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/report"
      element={
        <ProtectedRoute roles={["Admin", "Moderator"]}>
          <MainLayout>
            <ReportPage />
          </MainLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/ask-ai"
      element={
        <ProtectedRoute>
          <MainLayout fullScreen>
            <AskAIPage />
          </MainLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/about"
      element={
        <ProtectedRoute>
          <MainLayout>
            <AboutPage />
          </MainLayout>
        </ProtectedRoute>
      }
    />

    <Route 
      path="*"
      element={<NotFoundPage />}
    />
  </Routes>
);

export default AppRoutes;
