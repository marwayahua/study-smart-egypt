// Public mode - no authentication required
// Returns a fake user so all DB operations work with a shared public user ID

const PUBLIC_USER_ID = "00000000-0000-0000-0000-000000000001";

const publicUser = {
  id: PUBLIC_USER_ID,
  email: "public@recallmemento.app",
  user_metadata: { display_name: "Student" },
} as any;

export const useAuth = () => {
  return {
    user: publicUser,
    session: null,
    loading: false,
    signUp: async () => ({ error: null }),
    signIn: async () => ({ error: null }),
    signOut: async () => {},
  };
};

// AuthProvider is now a pass-through wrapper (no context needed)
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
