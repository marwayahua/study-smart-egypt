import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // If logged in, redirect to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        
        <footer className="py-12 border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">
              © 2026 Recall Memento. Study less, remember more. ✨
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
