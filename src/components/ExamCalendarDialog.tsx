import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExamDates } from "@/hooks/useExamDates";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Plus, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { format } from "date-fns";

const subjects = [
  "Biology", "Chemistry", "Physics", "Mathematics",
  "Arabic", "English", "History", "Geography", "Other"
];

export const ExamCalendarDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examType, setExamType] = useState<"monthly" | "midterm" | "final">("monthly");
  const [subject, setSubject] = useState("");
  const [adding, setAdding] = useState(false);
  const { exams, addExam, deleteExam, getDaysUntilExam, loading } = useExamDates();
  const { toast } = useToast();

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !examDate || !examType) return;

    setAdding(true);
    const result = await addExam({ title, exam_date: examDate, exam_type: examType, subject });
    setAdding(false);

    if (result) {
      toast({ title: "Exam Added! 📅", description: `${title} has been added to your calendar.` });
      setTitle("");
      setExamDate("");
      setExamType("monthly");
      setSubject("");
    }
  };

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case "final": return "bg-destructive text-destructive-foreground";
      case "midterm": return "bg-warning text-warning-foreground";
      default: return "bg-primary text-primary-foreground";
    }
  };

  const getUrgencyLabel = (days: number) => {
    if (days <= 3) return { label: "URGENT!", color: "text-destructive" };
    if (days <= 7) return { label: "Soon", color: "text-warning" };
    return { label: `${days} days`, color: "text-muted-foreground" };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar className="w-4 h-4" />
          Exam Calendar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-5 h-5 text-primary" />
            Exam Calendar
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAddExam} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Exam Title</Label>
              <Input id="title" placeholder="e.g., Biology Chapter 5" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Exam Type</Label>
              <Select value={examType} onValueChange={(v) => setExamType(v as "monthly" | "midterm" | "final")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly Exam</SelectItem>
                  <SelectItem value="midterm">Midterm Exam</SelectItem>
                  <SelectItem value="final">Final Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject (Optional)</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" variant="hero" className="w-full" disabled={adding}>
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Exam
          </Button>
        </form>

        <div className="mt-6 space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Upcoming Exams</h4>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : exams.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No exams scheduled. Add your first exam above!</p>
          ) : (
            <div className="space-y-2">
              {exams.map((exam) => {
                const days = getDaysUntilExam(exam.exam_date);
                const urgency = getUrgencyLabel(days);
                const isPast = days < 0;
                return (
                  <div key={exam.id} className={`flex items-center justify-between p-3 rounded-lg bg-secondary/50 ${isPast ? "opacity-50" : ""}`}>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getExamTypeColor(exam.exam_type)}`}>{exam.exam_type}</span>
                      <div>
                        <p className="font-medium">{exam.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(exam.exam_date), "MMM d, yyyy")}
                          {exam.subject && ` • ${exam.subject}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isPast && (
                        <span className={`text-sm font-medium ${urgency.color}`}>
                          {days <= 3 && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                          {urgency.label}
                        </span>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteExam(exam.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
