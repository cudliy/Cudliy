import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const RequireSegment = () => {
  const { loading, user, profile } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!profile || !profile.segment) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
};

export default RequireSegment;







