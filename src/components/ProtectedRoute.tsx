import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type ProtectedRouteProps = {
  redirectTo?: string;
};

export const ProtectedRoute = ({ redirectTo = "/login" }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }
  if (!user) return <Navigate to={redirectTo} replace />;
  return <Outlet />;
};

export default ProtectedRoute;


