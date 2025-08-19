import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{user?.email}</span>
            <Button variant="secondary" onClick={signOut}>Sign out</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Your profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <div><span className="text-muted-foreground">Name:</span> {profile?.full_name ?? "—"}</div>
                <div><span className="text-muted-foreground">Segment:</span> {profile?.segment ?? "—"}</div>
              </div>
              <div className="mt-4 text-sm">
                Need to update your role? Go to <Link to="/onboarding">Onboarding</Link>.
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border md:col-span-2">
            <CardHeader>
              <CardTitle>Get started</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Explore models, customize designs, or connect your printer. Tailored tips will appear here based on your role.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


