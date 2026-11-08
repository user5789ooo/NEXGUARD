import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import {
  getCurrentSession,
  onAuthStateChange
} from "../services/auth";

type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({
  children
}: ProtectedRouteProps) {
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let active = true;

    const subscription = onAuthStateChange(
      (_event, session) => {
        if (active) {
          setStatus(
            session ? "authenticated" : "unauthenticated"
          );
        }
      }
    );

    getCurrentSession()
      .then((session) => {
        if (active) {
          setStatus(
            session ? "authenticated" : "unauthenticated"
          );
        }
      })
      .catch(() => {
        if (active) {
          setStatus("unauthenticated");
        }
      });

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="empty-state">
        Checking authentication...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
