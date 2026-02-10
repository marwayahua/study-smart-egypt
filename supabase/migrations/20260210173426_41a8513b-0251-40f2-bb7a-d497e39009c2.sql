
-- Drop all existing RLS policies and replace with public access

-- flashcards
DROP POLICY IF EXISTS "Users can view their own flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Users can create their own flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Users can update their own flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Users can delete their own flashcards" ON public.flashcards;

CREATE POLICY "Public read flashcards" ON public.flashcards FOR SELECT USING (true);
CREATE POLICY "Public insert flashcards" ON public.flashcards FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update flashcards" ON public.flashcards FOR UPDATE USING (true);
CREATE POLICY "Public delete flashcards" ON public.flashcards FOR DELETE USING (true);

-- exam_dates
DROP POLICY IF EXISTS "Users can view their own exam dates" ON public.exam_dates;
DROP POLICY IF EXISTS "Users can create their own exam dates" ON public.exam_dates;
DROP POLICY IF EXISTS "Users can update their own exam dates" ON public.exam_dates;
DROP POLICY IF EXISTS "Users can delete their own exam dates" ON public.exam_dates;

CREATE POLICY "Public read exam_dates" ON public.exam_dates FOR SELECT USING (true);
CREATE POLICY "Public insert exam_dates" ON public.exam_dates FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update exam_dates" ON public.exam_dates FOR UPDATE USING (true);
CREATE POLICY "Public delete exam_dates" ON public.exam_dates FOR DELETE USING (true);

-- profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update profiles" ON public.profiles FOR UPDATE USING (true);

-- user_stats
DROP POLICY IF EXISTS "Users can view their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can create their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;

CREATE POLICY "Public read user_stats" ON public.user_stats FOR SELECT USING (true);
CREATE POLICY "Public insert user_stats" ON public.user_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update user_stats" ON public.user_stats FOR UPDATE USING (true);

-- review_history
DROP POLICY IF EXISTS "Users can view their own review history" ON public.review_history;
DROP POLICY IF EXISTS "Users can create their own review history" ON public.review_history;

CREATE POLICY "Public read review_history" ON public.review_history FOR SELECT USING (true);
CREATE POLICY "Public insert review_history" ON public.review_history FOR INSERT WITH CHECK (true);
