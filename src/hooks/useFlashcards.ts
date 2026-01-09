import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: string;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review: string;
}

export const useFlashcards = () => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCards = useCallback(async () => {
    if (!user) {
      setCards([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("flashcards")
        .select("*")
        .eq("user_id", user.id)
        .order("next_review", { ascending: true });

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const addCard = async (card: { question: string; answer: string; subject: string }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("flashcards")
        .insert({
          user_id: user.id,
          question: card.question,
          answer: card.answer,
          subject: card.subject,
        })
        .select()
        .single();

      if (error) throw error;
      setCards((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Error adding flashcard:", error);
      return null;
    }
  };

  const addMultipleCards = async (cardsToAdd: { question: string; answer: string; subject: string }[]) => {
    if (!user || cardsToAdd.length === 0) return [];

    try {
      const { data, error } = await supabase
        .from("flashcards")
        .insert(
          cardsToAdd.map((card) => ({
            user_id: user.id,
            question: card.question,
            answer: card.answer,
            subject: card.subject,
          }))
        )
        .select();

      if (error) throw error;
      setCards((prev) => [...prev, ...(data || [])]);
      return data || [];
    } catch (error) {
      console.error("Error adding flashcards:", error);
      return [];
    }
  };

  const updateCardAfterReview = async (
    cardId: string,
    rating: "easy" | "confusing" | "almost" | "forgot"
  ) => {
    if (!user) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    // SM-2 Algorithm implementation
    let { ease_factor, interval_days, repetitions } = card;
    
    const qualityMap = { easy: 5, confusing: 3, almost: 2, forgot: 0 };
    const quality = qualityMap[rating];

    if (quality < 3) {
      // Reset on poor recall
      repetitions = 0;
      interval_days = 1;
    } else {
      repetitions += 1;
      if (repetitions === 1) {
        interval_days = 1;
      } else if (repetitions === 2) {
        interval_days = 6;
      } else {
        interval_days = Math.round(interval_days * ease_factor);
      }
    }

    // Update ease factor
    ease_factor = Math.max(
      1.3,
      ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval_days);

    try {
      // Update flashcard
      const { error: cardError } = await supabase
        .from("flashcards")
        .update({
          ease_factor,
          interval_days,
          repetitions,
          next_review: nextReview.toISOString(),
        })
        .eq("id", cardId);

      if (cardError) throw cardError;

      // Record review history
      await supabase.from("review_history").insert({
        user_id: user.id,
        flashcard_id: cardId,
        rating,
      });

      // Update local state
      setCards((prev) =>
        prev.map((c) =>
          c.id === cardId
            ? { ...c, ease_factor, interval_days, repetitions, next_review: nextReview.toISOString() }
            : c
        )
      );
    } catch (error) {
      console.error("Error updating card after review:", error);
    }
  };

  const getDueCards = () => {
    const now = new Date();
    return cards.filter((card) => new Date(card.next_review) <= now);
  };

  return {
    cards,
    loading,
    addCard,
    addMultipleCards,
    updateCardAfterReview,
    getDueCards,
    refetch: fetchCards,
  };
};
