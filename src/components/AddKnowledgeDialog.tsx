import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, BookOpen, Sparkles } from "lucide-react";

const defaultSubjects = [
  "Biology",
  "Chemistry", 
  "Physics",
  "Mathematics",
  "Arabic",
  "English",
  "History",
  "Geography",
  "Other",
];

interface AddKnowledgeDialogProps {
  onAdd: (card: { question: string; answer: string; subject: string }) => void;
}

export const AddKnowledgeDialog = ({ onAdd }: AddKnowledgeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSubjectClick = (s: string) => {
    if (s === "Other") {
      setShowCustomInput(true);
      setSubject("");
    } else {
      setShowCustomInput(false);
      setCustomSubject("");
      setSubject(s);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSubject = showCustomInput ? customSubject : subject;
    if (question && answer && finalSubject) {
      onAdd({ question, answer, subject: finalSubject });
      setQuestion("");
      setAnswer("");
      setSubject("");
      setCustomSubject("");
      setShowCustomInput(false);
      setOpen(false);
    }
  };

  const isValid = question && answer && (showCustomInput ? customSubject : subject);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Add Knowledge
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-accent" />
            Add New Knowledge
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Subject Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Subject</Label>
            <div className="flex flex-wrap gap-2">
              {defaultSubjects.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSubjectClick(s)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    (s === "Other" && showCustomInput) || (!showCustomInput && subject === s)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            
            {/* Custom Subject Input */}
            {showCustomInput && (
              <Input
                placeholder="Enter your custom subject..."
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="mt-2"
                autoFocus
              />
            )}
          </div>

          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question" className="text-sm font-medium">
              Question / What to Remember
            </Label>
            <Textarea
              id="question"
              placeholder="e.g., What are the main organs of the digestive system?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Answer */}
          <div className="space-y-2">
            <Label htmlFor="answer" className="text-sm font-medium">
              Answer / Correct Response
            </Label>
            <Textarea
              id="answer"
              placeholder="e.g., Mouth, Esophagus, Stomach, Small Intestine, Large Intestine"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="hero" className="flex-1" disabled={!isValid}>
              <BookOpen className="w-4 h-4" />
              Save Card
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
