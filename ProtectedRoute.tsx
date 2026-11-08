import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("checking");

  useEffect(() => {
    if (!supabase) {
      setStatus("unauthenticated");
      return;
    }

    let active = true;

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setStatus(session ? "authenticated" : "unauthenticated");
      }
    });

    supabase.auth.getSession().then(({ data: sessionData, error }) => {
      if (active) {
        setStatus(!error && sessionData.session ? "authenticated" : "unauthenticated");
      }
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  if (status === "checking") {
    return <div className="empty-state">Checking secure session...</div>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
