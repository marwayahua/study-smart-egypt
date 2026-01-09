import { Brain, Calendar, BarChart3, Zap, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "Spaced Repetition Science",
    description: "Based on Hermann Ebbinghaus' Forgetting Curve research. Review at optimal intervals to maximize retention.",
    color: "primary",
  },
  {
    icon: Calendar,
    title: "Egyptian Exam Calendar",
    description: "Synced with your school's monthly, mid-term, and final exam schedules for perfect preparation.",
    color: "accent",
  },
  {
    icon: BarChart3,
    title: "Smart Assessment",
    description: "Four-level rating system adapts to your memory strength. Items you forget reappear sooner.",
    color: "success",
  },
  {
    icon: Zap,
    title: "Daily Micro-Learning",
    description: "Just 20-30 minutes daily instead of long cramming sessions. Build habits that last.",
    color: "streak",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-bold">
            Train Your Brain,{" "}
            <span className="gradient-text">Not Just Study</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Memory is like a muscle — short daily workouts beat occasional cramming sessions. 
            Our system guides you on when, what, and how to study.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              variant="interactive"
              className="group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 space-y-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    feature.color === "primary"
                      ? "bg-primary/10 text-primary"
                      : feature.color === "accent"
                      ? "bg-accent/10 text-accent"
                      : feature.color === "success"
                      ? "bg-success/10 text-success"
                      : "streak-gradient text-streak-foreground"
                  }`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Steps */}
        <div className="mt-20 pt-12 border-t border-border">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-2">Your Daily Flow</h3>
            <p className="text-muted-foreground">Simple steps, powerful results</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {[
              { step: "1", label: "Add Knowledge", desc: "Input facts & formulas" },
              { step: "2", label: "Daily Review", desc: "20-30 min sessions" },
              { step: "3", label: "Rate Yourself", desc: "Easy, Confusing, Forgot" },
              { step: "4", label: "Ace Exams", desc: "95% retention rate" },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full hero-gradient flex items-center justify-center text-primary-foreground font-bold text-lg mb-2">
                    {item.step}
                  </div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                {index < 3 && (
                  <ArrowRight className="hidden md:block w-6 h-6 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
