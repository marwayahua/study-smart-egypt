import { Brain, LogIn, User, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  streak?: number;
}

export const Navbar = ({ streak = 0 }: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <span className="text-xl font-bold gradient-text">Recall Memento</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {streak > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full streak-gradient text-streak-foreground">
              <Flame className="w-4 h-4" />
              <span className="font-bold text-sm">{streak} day streak</span>
            </div>
          )}
          <Button variant="ghost" size="sm">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};
