import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface UserStats {
  current_streak: number;
  longest_streak: number;
  total_reviews: number;
  correct_reviews: number;
  last_review_date: string | null;
}

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchStats = useCallback(async () => {
    if (!user) {
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setStats(data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const updateStatsAfterReview = async (isCorrect: boolean) => {
    if (!user || !stats) return;

    const today = new Date().toISOString().split("T")[0];
    const lastReview = stats.last_review_date;
    
    let newStreak = stats.current_streak;
    
    if (!lastReview) {
      newStreak = 1;
    } else if (lastReview === today) {
      // Already reviewed today
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      
      if (lastReview === yesterdayStr) {
        newStreak = stats.current_streak + 1;
      } else {
        newStreak = 1;
      }
    }

    const newLongestStreak = Math.max(newStreak, stats.longest_streak);
    const newTotalReviews = stats.total_reviews + 1;
    const newCorrectReviews = isCorrect ? stats.correct_reviews + 1 : stats.correct_reviews;

    try {
      const { error } = await supabase
        .from("user_stats")
        .update({
          current_streak: newStreak,
          longest_streak: newLongestStreak,
          total_reviews: newTotalReviews,
          correct_reviews: newCorrectReviews,
          last_review_date: today,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setStats({
        ...stats,
        current_streak: newStreak,
        longest_streak: newLongestStreak,
        total_reviews: newTotalReviews,
        correct_reviews: newCorrectReviews,
        last_review_date: today,
      });
    } catch (error) {
      console.error("Error updating stats:", error);
    }
  };

  const getRetentionRate = () => {
    if (!stats || stats.total_reviews === 0) return 0;
    return Math.round((stats.correct_reviews / stats.total_reviews) * 100);
  };

  return {
    stats,
    loading,
    updateStatsAfterReview,
    getRetentionRate,
    refetch: fetchStats,
  };
};
