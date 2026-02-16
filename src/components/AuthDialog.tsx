import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/sonner";
import { LogIn, UserPlus, Loader2, Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuthDialogProps {
  trigger?: React.ReactNode;
  defaultMode?: "login" | "signup";
}

export const AuthDialog = ({ trigger, defaultMode = "login" }: AuthDialogProps) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error);
      } else {
        toast.success("تم تسجيل الدخول بنجاح! 🎉");
        setOpen(false);
        resetForm();
        navigate("/dashboard");
      }
    } else {
      if (password.length < 6) {
        toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, displayName);
      if (error) {
        toast.error(error);
      } else {
        toast.success("تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني لتأكيد الحساب. ✉️");
        setOpen(false);
        resetForm();
      }
    }

    setLoading(false);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setDisplayName("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="hero" size="sm" className="gap-2">
            <LogIn className="w-4 h-4" />
            تسجيل الدخول
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="displayName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                الاسم
              </Label>
              <Input
                id="displayName"
                placeholder="أدخل اسمك"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                dir="rtl"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              البريد الإلكتروني
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              كلمة المرور
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              dir="ltr"
            />
          </div>

          <Button type="submit" variant="hero" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === "login" ? (
              <>
                <LogIn className="w-4 h-4" />
                دخول
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                إنشاء حساب
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <p>
                ليس لديك حساب؟{" "}
                <button type="button" className="text-primary font-semibold hover:underline" onClick={() => setMode("signup")}>
                  سجّل الآن
                </button>
              </p>
            ) : (
              <p>
                لديك حساب بالفعل؟{" "}
                <button type="button" className="text-primary font-semibold hover:underline" onClick={() => setMode("login")}>
                  سجّل دخولك
                </button>
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
