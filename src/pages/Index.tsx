import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <Dashboard onBack={() => setShowDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection onGetStarted={() => setShowDashboard(true)} />
        <FeaturesSection />
        
        {/* Footer */}
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
