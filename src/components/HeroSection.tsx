import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Clock, Sparkles, ArrowRight, ChevronDown, Zap } from "lucide-react";
import { AuthDialog } from "@/components/AuthDialog";
import heroIllustration from "@/assets/hero-illustration.png";

export const HeroSection = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features-section");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 pt-20 pb-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent border border-accent/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Smart Study for Egyptian Students</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Study Less,{" "}
              <span className="gradient-text">Remember More</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Master your curriculum with spaced repetition science. Stop cramming, start retaining — 
              achieve up to <span className="font-bold text-primary">95% memory retention</span> for exams.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <AuthDialog
                defaultMode="signup"
                trigger={
                  <Button variant="hero" size="xl" className="group">
                    Start Learning Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                }
              />
              <Button variant="outline" size="xl" onClick={scrollToFeatures}>
                See How It Works
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm">20-30 min/day</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-5 h-5 text-success" />
                <span className="text-sm">+15-20% exam scores</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-5 h-5 text-accent" />
                <span className="text-sm">Exam-ready schedules</span>
              </div>
            </div>
          </div>

          <div className="relative animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              <img src={heroIllustration} alt="Smart Egyptian Study Assistant" className="w-full h-auto rounded-2xl shadow-2xl animate-float" />
              <div className="absolute -top-4 -left-4 bg-card rounded-xl p-4 shadow-lg animate-bounce-soft">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Retention</p>
                    <p className="font-bold text-success">95%</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-card rounded-xl p-4 shadow-lg animate-bounce-soft" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg streak-gradient flex items-center justify-center">
                    <span className="text-streak-foreground text-sm">🔥</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Streak</p>
                    <p className="font-bold">7 Days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={scrollToFeatures}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce-soft cursor-pointer hover:text-primary transition-colors"
        >
          <span className="text-sm">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
