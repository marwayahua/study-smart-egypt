import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface ExamDate {
  id: string;
  title: string;
  exam_date: string;
  exam_type: "monthly" | "midterm" | "final";
  subject: string | null;
}

export const useExamDates = () => {
  const [exams, setExams] = useState<ExamDate[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchExams = useCallback(async () => {
    if (!user) {
      setExams([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("exam_dates")
        .select("*")
        .eq("user_id", user.id)
        .order("exam_date", { ascending: true });

      if (error) throw error;
      const typedData = (data || []).map((item) => ({
        ...item,
        exam_type: item.exam_type as "monthly" | "midterm" | "final",
      }));
      setExams(typedData);
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const addExam = async (exam: {
    title: string;
    exam_date: string;
    exam_type: "monthly" | "midterm" | "final";
    subject?: string;
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("exam_dates")
        .insert({
          user_id: user.id,
          title: exam.title,
          exam_date: exam.exam_date,
          exam_type: exam.exam_type,
          subject: exam.subject || null,
        })
        .select()
        .single();

      if (error) throw error;
      const typedData = {
        ...data,
        exam_type: data.exam_type as "monthly" | "midterm" | "final",
      };
      setExams((prev) => [...prev, typedData]);
      return typedData;
    } catch (error) {
      console.error("Error adding exam:", error);
      return null;
    }
  };

  const deleteExam = async (examId: string) => {
    try {
      const { error } = await supabase.from("exam_dates").delete().eq("id", examId);
      if (error) throw error;
      setExams((prev) => prev.filter((e) => e.id !== examId));
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
  };

  const getUpcomingExams = (days: number = 30) => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);
    
    return exams.filter((exam) => {
      const examDate = new Date(exam.exam_date);
      return examDate >= now && examDate <= futureDate;
    });
  };

  const getDaysUntilExam = (examDate: string) => {
    const now = new Date();
    const exam = new Date(examDate);
    const diffTime = exam.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getIntensiveReviewMultiplier = () => {
    const upcomingExams = getUpcomingExams(7);
    if (upcomingExams.some((e) => e.exam_type === "final")) return 3;
    if (upcomingExams.some((e) => e.exam_type === "midterm")) return 2;
    if (upcomingExams.length > 0) return 1.5;
    return 1;
  };

  return {
    exams,
    loading,
    addExam,
    deleteExam,
    getUpcomingExams,
    getDaysUntilExam,
    getIntensiveReviewMultiplier,
    refetch: fetchExams,
  };
};
