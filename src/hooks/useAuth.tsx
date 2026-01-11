import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---
// Auth refresh stability
//
// We've seen some browsers get into a "refresh storm" (many TOKEN_REFRESHED events
// back-to-back) which can hit rate limits and end with a forced SIGNED_OUT.
// To make auth stable across desktops/laptops, we disable the SDK's auto-refresh
// loop and run a single, throttled refresh scheduler.
// ---
let refreshTimeout: number | null = null;
let refreshInFlight = false;
let lastRefreshAt = 0;

const clearRefreshTimeout = () => {
  if (refreshTimeout !== null) {
    window.clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }
};

const scheduleSessionRefresh = (session: Session | null) => {
  clearRefreshTimeout();
  if (!session?.expires_at) return;

  const expiresAtMs = session.expires_at * 1000;
  const now = Date.now();

  // Refresh ~5 minutes before expiry.
  // Clamp to avoid tight loops when a device clock is skewed.
  let delayMs = expiresAtMs - now - 5 * 60_000;
  delayMs = Math.max(delayMs, 10 * 60_000); // never more often than every 10 min
  delayMs = Math.min(delayMs, 55 * 60_000); // sanity cap

  refreshTimeout = window.setTimeout(async () => {
    if (refreshInFlight) return;
    if (Date.now() - lastRefreshAt < 60_000) return;

    refreshInFlight = true;
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.warn("[auth] refreshSession error:", error);
        // Retry later (avoid sign-out loops from rapid retries)
        refreshTimeout = window.setTimeout(() => scheduleSessionRefresh(session), 2 * 60_000);
        return;
      }

      lastRefreshAt = Date.now();
      scheduleSessionRefresh(data.session);
    } finally {
      refreshInFlight = false;
    }
  }, delayMs);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    // Guard against a race where getSession() resolves after a SIGNED_IN event,
    // which would overwrite state with a stale (often null) session.
    let authEventHandled = false;

    // Disable the SDK auto-refresh timer (prevents refresh storms on some clients).
    supabase.auth.stopAutoRefresh();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      authEventHandled = true;

      // Debug aid for the "auto logout" reports
      console.log("[auth] event=", event, "user=", session?.user?.id ?? null);

      // Keep SDK auto-refresh disabled; we manage refresh ourselves.
      supabase.auth.stopAutoRefresh();

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      scheduleSessionRefresh(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      if (authEventHandled) return;

      supabase.auth.stopAutoRefresh();

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      scheduleSessionRefresh(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearRefreshTimeout();
    };
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          display_name: displayName,
        },
      },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
