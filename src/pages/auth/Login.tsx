import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 px-6 py-16">
        {/* Left: Role explanation */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Sign in</h1>
            <p className="text-sm text-muted-foreground">Welcome back. Choose your path below.</p>
          </div>
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <h2 className="text-lg font-semibold">Casual Users</h2>
              <ul className="mt-2 list-disc list-inside text-muted-foreground">
                <li>
                  <span className="text-foreground">Browser</span>: Explore pre-made models with little or no customization.
                </li>
                <li>
                  <span className="text-foreground">Light Customizer</span>: Tweak existing designs in small ways for personalization.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Dedicated Designers</h2>
              <ul className="mt-2 list-disc list-inside text-muted-foreground">
                <li>
                  <span className="text-foreground">Hobbyist Designer</span>: Design toys for personal fun and creativity.
                </li>
                <li>
                  <span className="text-foreground">Entrepreneurial Designer</span>: Build and sell designs or collaborate with others.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold">3D Printer Partners</h2>
              <ul className="mt-2 list-disc list-inside text-muted-foreground">
                <li>
                  <span className="text-foreground">Individual Printer</span>: One or two printers for small-scale side gigs.
                </li>
                <li>
                  <span className="text-foreground">Small Business Partner</span>: Larger setups for formal or ongoing partnerships.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div>
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-soft">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Welcome back</h2>
              <p className="text-sm text-muted-foreground">Sign in to continue</p>
            </div>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don't have an account? <Link to="/register">Create one</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


