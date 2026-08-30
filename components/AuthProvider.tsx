"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { ActivityTracker } from "@/components/ActivityTracker";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleSignOut = useCallback(() => {
    setUser(null);
    if (typeof window === "undefined" || window.location.pathname !== "/login") {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const supabase = createClient();

    // Récupère la session active immédiatement
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setIsLoading(false);
    });

    // Écoute en temps réel les changements de session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          handleSignOut();
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
          setUser(session?.user ?? null);
          setIsLoading(false);
        } else if (event === "INITIAL_SESSION") {
          // Une page publique reste accessible lorsqu'aucune session n'existe.
          // Les routes privées sont protégées par le middleware.
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [handleSignOut]);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      <ActivityTracker userEmail={user?.email} />
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
