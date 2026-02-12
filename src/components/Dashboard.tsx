import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StatsGrid } from "@/components/StatsGrid";
import { FlashcardReview } from "@/components/FlashcardReview";
import { AddKnowledgeDialog } from "@/components/AddKnowledgeDialog";
import { AIFlashcardGenerator } from "@/components/AIFlashcardGenerator";
import { ExamCalendarDialog } from "@/components/ExamCalendarDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, BookOpen, Trophy, Clock, AlertTriangle, PenLine, Eye } from "lucide-react";
import { useFlashcards } from "@/hooks/useFlashcards";
import { useUserStats } from "@/hooks/useUserStats";
import { useExamDates } from "@/hooks/useExamDates";
import { useAuth } from "@/hooks/useAuth";

type ReviewMode = "show" | "write";

interface DashboardProps {
  onBack: () => void;
}

export const Dashboard = ({ onBack }: DashboardProps) => {
  const { cards, addCard, updateCardAfterReview, getDueCards, loading: cardsLoading, refetch: refetchCards } = useFlashcards();
  const { stats, updateStatsAfterReview, getRetentionRate } = useUserStats();
  const { getUpcomingExams, getIntensiveReviewMultiplier } = useExamDates();
  
  const [isReviewing, setIsReviewing] = useState(false);
  const [showModeSelection, setShowModeSelection] = useState(false);
  const [reviewMode, setReviewMode] = useState<ReviewMode>("show");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const dueCards = getDueCards();
  const upcomingExams = getUpcomingExams(7);
  const intensiveMultiplier = getIntensiveReviewMultiplier();
  const streak = stats?.current_streak || 0;
  const retention = getRetentionRate();

  const handleAddCard = async (newCard: { question: string; answer: string; subject: string }) => {
    await addCard(newCard);
  };

  const handleRate = async (rating: "easy" | "confusing" | "almost" | "forgot") => {
    const card = dueCards[currentCardIndex];
    if (card) {
      await updateCardAfterReview(card.id, rating);
      await updateStatsAfterReview(rating === "easy" || rating === "confusing");
    }
    
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setIsReviewing(false);
      setCurrentCardIndex(0);
    }
  };

  // Mode selection screen
  if (showModeSelection && dueCards.length > 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar streak={streak} />
        <main className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-2xl">
            <Button variant="ghost" onClick={() => setShowModeSelection(false)} className="mb-6 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Choose Review Mode</h2>
              <p className="text-muted-foreground">How would you like to practice today?</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card 
                variant="interactive" 
                className="cursor-pointer p-6 text-center hover:border-primary transition-colors"
                onClick={() => {
                  setReviewMode("write");
                  setShowModeSelection(false);
                  setIsReviewing(true);
                }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <PenLine className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Write Answer</h3>
                    <p className="text-sm text-muted-foreground">
                      Type your answer first, then compare with the correct one. Best for active recall practice.
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card 
                variant="interactive" 
                className="cursor-pointer p-6 text-center hover:border-primary transition-colors"
                onClick={() => {
                  setReviewMode("show");
                  setShowModeSelection(false);
                  setIsReviewing(true);
                }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <Eye className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Show Answer</h3>
                    <p className="text-sm text-muted-foreground">
                      Tap to reveal the answer, then rate your recall. Classic flashcard experience.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isReviewing && dueCards.length > 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar streak={streak} />
        <main className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <Button variant="ghost" onClick={() => setIsReviewing(false)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Exit Review
                </Button>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                    {reviewMode === "write" ? "Write Mode" : "Show Mode"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Card {currentCardIndex + 1} of {dueCards.length}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full hero-gradient transition-all duration-300"
                  style={{ width: `${((currentCardIndex + 1) / dueCards.length) * 100}%` }}
                />
              </div>
            </div>
            <FlashcardReview card={dueCards[currentCardIndex]} onRate={handleRate} mode={reviewMode} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar streak={streak} />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Button variant="ghost" onClick={onBack} className="mb-2 -ml-3">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
              <p className="text-muted-foreground">Ready for your daily brain training?</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ExamCalendarDialog />
              <AIFlashcardGenerator onCardsAdded={refetchCards} />
              <AddKnowledgeDialog onAdd={handleAddCard} />
            </div>
          </div>

          {/* Exam Alert */}
          {upcomingExams.length > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
              <div>
                <p className="font-medium text-warning">Exam approaching!</p>
                <p className="text-sm text-muted-foreground">
                  {upcomingExams[0].title} in {Math.ceil((new Date(upcomingExams[0].exam_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days. 
                  Intensive review mode active ({intensiveMultiplier}x cards).
                </p>
              </div>
            </div>
          )}

          <StatsGrid streak={streak} todayCards={dueCards.length} totalCards={cards.length} retention={retention} />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="interactive" className="md:col-span-2 lg:col-span-1 group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  Daily Review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  You have <span className="font-bold text-foreground">{dueCards.length} cards</span> ready for review.
                </p>
                <Button variant="hero" className="w-full" onClick={() => setShowModeSelection(true)} disabled={dueCards.length === 0}>
                  <Play className="w-4 h-4" />
                  Start Review Session
                </Button>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  Estimated Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold gradient-text">{Math.max(5, dueCards.length * 2)} min</div>
                <p className="text-sm text-muted-foreground mt-1">For today's session</p>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-warning" />
                  Next Milestone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{Math.ceil((streak + 1) / 10) * 10} 🔥</div>
                <p className="text-sm text-muted-foreground mt-1">Day streak ({Math.ceil((streak + 1) / 10) * 10 - streak} more days!)</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Your Knowledge Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cards.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No cards yet</p>
                  <p className="text-sm">Add your first knowledge card to get started!</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {cards.slice(0, 10).map((card) => (
                    <div key={card.id} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{card.subject}</span>
                      <p className="flex-1 truncate font-medium">{card.question}</p>
                    </div>
                  ))}
                  {cards.length > 10 && <p className="text-center text-sm text-muted-foreground">And {cards.length - 10} more cards...</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
