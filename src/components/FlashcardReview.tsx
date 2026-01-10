import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, HelpCircle, XCircle, RotateCcw } from "lucide-react";
import { Flashcard } from "@/hooks/useFlashcards";

interface FlashcardReviewProps {
  card: Flashcard;
  onRate: (rating: "easy" | "confusing" | "almost" | "forgot") => void;
}

export const FlashcardReview = ({ card, onRate }: FlashcardReviewProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Subject Badge */}
      <div className="mb-4 flex justify-center">
        <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          {card.subject}
        </span>
      </div>

      {/* Flashcard */}
      <div
        className="relative w-full h-80 cursor-pointer perspective-1000"
        onClick={handleFlip}
        style={{ perspective: "1000px" }}
      >
        <div
          className={`absolute inset-0 transition-transform duration-500 preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front - Question */}
          <Card
            variant="elevated"
            className="absolute inset-0 flex flex-col items-center justify-center p-8 backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Question</p>
            <p className="text-2xl font-semibold text-center leading-relaxed">{card.question}</p>
            <p className="text-sm text-muted-foreground mt-6">Tap to reveal answer</p>
          </Card>

          {/* Back - Answer */}
          <Card
            variant="elevated"
            className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-primary/5"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-xs uppercase tracking-wider text-primary mb-4">Answer</p>
            <p className="text-2xl font-semibold text-center leading-relaxed">{card.answer}</p>
          </Card>
        </div>
      </div>

      {/* Rating Buttons */}
      {isFlipped && (
        <div className="mt-8 animate-slide-up">
          <p className="text-center text-sm text-muted-foreground mb-4">How well did you remember?</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="success"
              className="flex flex-col h-auto py-4 gap-1"
              onClick={() => onRate("easy")}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-semibold">Easy</span>
              <span className="text-xs opacity-80">Remembered well</span>
            </Button>
            <Button
              variant="warning"
              className="flex flex-col h-auto py-4 gap-1"
              onClick={() => onRate("confusing")}
            >
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">Confusing</span>
              <span className="text-xs opacity-80">Almost forgot</span>
            </Button>
            <Button
              variant="secondary"
              className="flex flex-col h-auto py-4 gap-1"
              onClick={() => onRate("almost")}
            >
              <HelpCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">Struggled</span>
              <span className="text-xs opacity-80">Took effort</span>
            </Button>
            <Button
              variant="destructive"
              className="flex flex-col h-auto py-4 gap-1"
              onClick={() => onRate("forgot")}
            >
              <XCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">Forgot</span>
              <span className="text-xs opacity-80">Need more practice</span>
            </Button>
          </div>
        </div>
      )}

      {/* Flip Again Button */}
      {isFlipped && (
        <div className="mt-4 flex justify-center">
          <Button variant="ghost" onClick={handleFlip} className="text-muted-foreground">
            <RotateCcw className="w-4 h-4 mr-2" />
            Flip back
          </Button>
        </div>
      )}
    </div>
  );
};
