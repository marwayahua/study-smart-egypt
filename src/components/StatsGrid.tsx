import { Brain, Flame, Target, TrendingUp } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  variant?: "default" | "streak" | "success" | "accent";
}

const StatCard = ({ icon, label, value, subtext, variant = "default" }: StatCardProps) => {
  const bgClasses = {
    default: "bg-card",
    streak: "streak-gradient text-streak-foreground",
    success: "success-gradient text-success-foreground",
    accent: "bg-accent/20",
  };

  return (
    <div className={`rounded-xl p-5 ${bgClasses[variant]} shadow-md transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${variant === "default" ? "bg-primary/10 text-primary" : "bg-background/20"}`}>
          {icon}
        </div>
        <div>
          <p className={`text-sm font-medium ${variant === "default" ? "text-muted-foreground" : "opacity-90"}`}>
            {label}
          </p>
          <p className="text-2xl font-bold">{value}</p>
          {subtext && (
            <p className={`text-xs ${variant === "default" ? "text-muted-foreground" : "opacity-75"}`}>
              {subtext}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

interface StatsGridProps {
  streak: number;
  todayCards: number;
  totalCards: number;
  retention: number;
}

export const StatsGrid = ({ streak, todayCards, totalCards, retention }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<Flame className="w-5 h-5" />}
        label="Day Streak"
        value={streak}
        subtext="Keep it up! 🔥"
        variant="streak"
      />
      <StatCard
        icon={<Target className="w-5 h-5" />}
        label="Today's Reviews"
        value={todayCards}
        subtext="cards remaining"
        variant="default"
      />
      <StatCard
        icon={<Brain className="w-5 h-5" />}
        label="Total Cards"
        value={totalCards}
        subtext="in your library"
        variant="default"
      />
      <StatCard
        icon={<TrendingUp className="w-5 h-5" />}
        label="Retention Rate"
        value={`${retention}%`}
        subtext="memory strength"
        variant="success"
      />
    </div>
  );
};
