
-- Drop public policies and restore user-specific RLS

-- flashcards
DROP POLICY IF EXISTS "Public read flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Public insert flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Public update flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Public delete flashcards" ON public.flashcards;

CREATE POLICY "Users can view their own flashcards" ON public.flashcards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own flashcards" ON public.flashcards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own flashcards" ON public.flashcards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own flashcards" ON public.flashcards FOR DELETE USING (auth.uid() = user_id);

-- exam_dates
DROP POLICY IF EXISTS "Public read exam_dates" ON public.exam_dates;
DROP POLICY IF EXISTS "Public insert exam_dates" ON public.exam_dates;
DROP POLICY IF EXISTS "Public update exam_dates" ON public.exam_dates;
DROP POLICY IF EXISTS "Public delete exam_dates" ON public.exam_dates;

CREATE POLICY "Users can view their own exam dates" ON public.exam_dates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own exam dates" ON public.exam_dates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own exam dates" ON public.exam_dates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own exam dates" ON public.exam_dates FOR DELETE USING (auth.uid() = user_id);

-- profiles
DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public update profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- user_stats
DROP POLICY IF EXISTS "Public read user_stats" ON public.user_stats;
DROP POLICY IF EXISTS "Public insert user_stats" ON public.user_stats;
DROP POLICY IF EXISTS "Public update user_stats" ON public.user_stats;

CREATE POLICY "Users can view their own stats" ON public.user_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own stats" ON public.user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stats" ON public.user_stats FOR UPDATE USING (auth.uid() = user_id);

-- review_history
DROP POLICY IF EXISTS "Public read review_history" ON public.review_history;
DROP POLICY IF EXISTS "Public insert review_history" ON public.review_history;

CREATE POLICY "Users can view their own review history" ON public.review_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own review history" ON public.review_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger to auto-create profile and user_stats on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Student'));
  
  INSERT INTO public.user_stats (user_id, current_streak, longest_streak, total_reviews, correct_reviews)
  VALUES (NEW.id, 0, 0, 0, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
