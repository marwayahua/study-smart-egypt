import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StatsGrid } from "@/components/StatsGrid";
import { FlashcardReview } from "@/components/FlashcardReview";
import { AddKnowledgeDialog } from "@/components/AddKnowledgeDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, BookOpen, Trophy, Clock } from "lucide-react";

interface DashboardProps {
  onBack: () => void;
}

// Mock data
const mockCards = [
  {
    id: "1",
    question: "What is the function of the mitochondria?",
    answer: "The mitochondria is the powerhouse of the cell, producing ATP through cellular respiration.",
    subject: "Biology",
    nextReview: new Date(),
  },
  {
    id: "2",
    question: "What is the chemical formula for water?",
    answer: "H₂O (two hydrogen atoms and one oxygen atom)",
    subject: "Chemistry",
    nextReview: new Date(),
  },
  {
    id: "3",
    question: "What is the Pythagorean theorem?",
    answer: "a² + b² = c², where c is the hypotenuse of a right triangle",
    subject: "Mathematics",
    nextReview: new Date(),
  },
];

export const Dashboard = ({ onBack }: DashboardProps) => {
  const [cards, setCards] = useState(mockCards);
  const [isReviewing, setIsReviewing] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [streak] = useState(7);

  const handleAddCard = (newCard: { question: string; answer: string; subject: string }) => {
    setCards([
      ...cards,
      {
        id: Date.now().toString(),
        ...newCard,
        nextReview: new Date(),
      },
    ]);
  };

  const handleRate = (rating: "easy" | "confusing" | "almost" | "forgot") => {
    // Move to next card
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // All cards reviewed
      setIsReviewing(false);
      setCurrentCardIndex(0);
    }
  };

  if (isReviewing && cards.length > 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar streak={streak} />
        <main className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-4xl">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <Button variant="ghost" onClick={() => setIsReviewing(false)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Exit Review
                </Button>
                <span className="text-sm text-muted-foreground">
                  Card {currentCardIndex + 1} of {cards.length}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full hero-gradient transition-all duration-300"
                  style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Flashcard */}
            <FlashcardReview card={cards[currentCardIndex]} onRate={handleRate} />
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
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Button variant="ghost" onClick={onBack} className="mb-2 -ml-3">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
              <p className="text-muted-foreground">Ready for your daily brain training?</p>
            </div>
            <AddKnowledgeDialog onAdd={handleAddCard} />
          </div>

          {/* Stats Grid */}
          <StatsGrid streak={streak} todayCards={cards.length} totalCards={cards.length} retention={92} />

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Start Review Card */}
            <Card variant="interactive" className="md:col-span-2 lg:col-span-1 group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  Daily Review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  You have <span className="font-bold text-foreground">{cards.length} cards</span> ready for review today.
                </p>
                <Button
                  variant="hero"
                  className="w-full"
                  onClick={() => setIsReviewing(true)}
                  disabled={cards.length === 0}
                >
                  <Play className="w-4 h-4" />
                  Start Review Session
                </Button>
              </CardContent>
            </Card>

            {/* Study Time Card */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  Estimated Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold gradient-text">{Math.max(5, cards.length * 2)} min</div>
                <p className="text-sm text-muted-foreground mt-1">For today's session</p>
              </CardContent>
            </Card>

            {/* Achievement Card */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-warning" />
                  Next Milestone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">10 🔥</div>
                <p className="text-sm text-muted-foreground mt-1">Day streak (3 more days!)</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Cards */}
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
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {card.subject}
                      </span>
                      <p className="flex-1 truncate font-medium">{card.question}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
