import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type UserSegment =
  | "casual_browser"
  | "casual_customizer"
  | "designer_hobbyist"
  | "designer_entrepreneur"
  | "printer_individual"
  | "printer_small_business";

export type Profile = {
  id: string;
  full_name: string | null;
  segment: UserSegment | null;
  created_at?: string;
  updated_at?: string | null;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentUser: User | null) => {
    if (!currentUser) {
      setProfile(null);
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, segment, created_at, updated_at")
      .eq("id", currentUser.id)
      .maybeSingle();
    if (!error) {
      setProfile((data as Profile) ?? null);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();
      if (!isMounted) return;
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      await fetchProfile(initialSession?.user ?? null);
      setLoading(false);
    };
    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        await fetchProfile(newSession?.user ?? null);
      }
    );
    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      loading,
      signOut: async () => {
        await supabase.auth.signOut();
        setProfile(null);
      },
      refreshProfile: async () => {
        await fetchProfile(user);
      },
    }),
    [session, user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};


