import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Dashboard } from "@/components/Dashboard";
import { AuthDialog } from "@/components/AuthDialog";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      setShowDashboard(true);
    } else {
      setAuthOpen(true);
    }
  };

  if (showDashboard) {
    return <Dashboard onBack={() => setShowDashboard(false)} onAuthClick={() => setAuthOpen(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onAuthClick={() => setAuthOpen(true)} />
      <main>
        <HeroSection onGetStarted={handleGetStarted} />
        <FeaturesSection />
        
        <footer className="py-12 border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">
              © 2026 Recall Memento. Study less, remember more. ✨
            </p>
          </div>
        </footer>
      </main>
      
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
};

export default Index;
