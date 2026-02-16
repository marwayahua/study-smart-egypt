import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";

const Index = () => {
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
