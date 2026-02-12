import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const arAuthErrors: Record<string, string> = {
  "Invalid login credentials": "بيانات تسجيل الدخول غير صحيحة",
  "Email not confirmed": "لم يتم تأكيد البريد الإلكتروني بعد",
  "User already registered": "هذا البريد الإلكتروني مسجل بالفعل",
  "Password should be at least 6 characters": "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
  "Signup requires a valid password": "يرجى إدخال كلمة مرور صالحة",
  "Unable to validate email address: invalid format": "صيغة البريد الإلكتروني غير صحيحة",
  "Email rate limit exceeded": "تم تجاوز الحد المسموح، حاول لاحقاً",
  "For security purposes, you can only request this after": "لأسباب أمنية، يرجى المحاولة لاحقاً",
};

function translateError(msg: string): string {
  for (const [en, ar] of Object.entries(arAuthErrors)) {
    if (msg.includes(en)) return ar;
  }
  return "حدث خطأ غير متوقع. حاول مرة أخرى.";
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth changes FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Then check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName || email.split("@")[0] },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) return { error: translateError(error.message) };
      return { error: null };
    } catch {
      return { error: "حدث خطأ غير متوقع. حاول مرة أخرى." };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: translateError(error.message) };
      return { error: null };
    } catch {
      return { error: "حدث خطأ غير متوقع. حاول مرة أخرى." };
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
