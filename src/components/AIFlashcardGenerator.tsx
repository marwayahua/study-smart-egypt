import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFlashcards } from "@/hooks/useFlashcards";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Loader2, Wand2, Check } from "lucide-react";

const subjects = [
  "Biology", "Chemistry", "Physics", "Mathematics",
  "Arabic", "English", "History", "Geography"
];

const grades = [
  "Primary 4", "Primary 5", "Primary 6",
  "Preparatory 1", "Preparatory 2", "Preparatory 3",
  "Secondary 1", "Secondary 2", "Secondary 3"
];

interface GeneratedCard {
  question: string;
  answer: string;
  selected: boolean;
}

interface AIFlashcardGeneratorProps {
  onCardsAdded?: () => void;
}

export const AIFlashcardGenerator = ({ onCardsAdded }: AIFlashcardGeneratorProps) => {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [count, setCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
  const [saving, setSaving] = useState(false);
  const { addMultipleCards } = useFlashcards();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic || !subject) {
      toast({
        title: "Missing Information",
        description: "Please enter a topic and select a subject.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    setGeneratedCards([]);

    try {
      const { data, error } = await supabase.functions.invoke("generate-flashcards", {
        body: { topic, subject, grade, count },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      const cards = (data.flashcards || []).map((card: { question: string; answer: string }) => ({
        ...card,
        selected: true,
      }));

      if (cards.length === 0) {
        throw new Error("No flashcards were generated. Please try again.");
      }

      setGeneratedCards(cards);
      toast({
        title: "Flashcards Generated! ✨",
        description: `${cards.length} cards created based on Egyptian curriculum.`,
      });
    } catch (error) {
      console.error("Error generating flashcards:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate flashcards",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const toggleCard = (index: number) => {
    setGeneratedCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, selected: !card.selected } : card))
    );
  };

  const handleSaveSelected = async () => {
    const selectedCards = generatedCards.filter((card) => card.selected);
    if (selectedCards.length === 0) {
      toast({
        title: "No Cards Selected",
        description: "Please select at least one card to save.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const result = await addMultipleCards(
        selectedCards.map((card) => ({
          question: card.question,
          answer: card.answer,
          subject,
        }))
      );

      if (result.length === 0) {
        throw new Error("No cards were saved. Please try again.");
      }

      toast({
        title: "Cards Saved! 🎉",
        description: `${result.length} flashcards added to your library.`,
      });

      setOpen(false);
      setTopic("");
      setSubject("");
      setGrade("");
      setGeneratedCards([]);
      onCardsAdded?.();
    } catch (error) {
      console.error("Error saving generated flashcards:", error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save flashcards",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-accent text-accent hover:bg-accent/10">
          <Sparkles className="w-4 h-4" />
          AI Generate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Wand2 className="w-5 h-5 text-accent" />
            AI Flashcard Generator
            <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
              Egyptian Curriculum
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic / Lesson Title</Label>
              <Input
                id="topic"
                placeholder="e.g., Digestive System, Photosynthesis, Quadratic Equations"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Grade Level</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                  <SelectContent>
                    {grades.map((g) => (<SelectItem key={g} value={g}>{g}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Number of Cards</Label>
                <Select value={count.toString()} onValueChange={(v) => setCount(parseInt(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[3, 5, 8, 10].map((n) => (<SelectItem key={n} value={n.toString()}>{n} cards</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button variant="hero" className="w-full" onClick={handleGenerate} disabled={generating || !topic || !subject}>
              {generating ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Generating with AI...</>
              ) : (
                <><Sparkles className="w-4 h-4" />Generate Flashcards</>
              )}
            </Button>
          </div>

          {generatedCards.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Generated Cards ({generatedCards.filter((c) => c.selected).length} selected)</h4>
                <Button variant="hero" onClick={handleSaveSelected} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save Selected
                </Button>
              </div>
              <div className="space-y-3">
                {generatedCards.map((card, index) => (
                  <div
                    key={index}
                    onClick={() => toggleCard(index)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      card.selected ? "border-primary bg-primary/5" : "border-border bg-secondary/30 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        card.selected ? "bg-primary border-primary" : "border-muted-foreground"
                      }`}>
                        {card.selected && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="font-medium text-sm">{card.question}</p>
                        <p className="text-sm text-muted-foreground">{card.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
