import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { hasRole } from "../../helpers/roleHelper";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Must be authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check roles via helper
  const allowed = hasRole(user, roles);
  if (!allowed) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default ProtectedRoute;
