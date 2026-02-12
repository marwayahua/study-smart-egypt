
-- Re-create clean user-specific RLS policies (PERMISSIVE)

CREATE POLICY "Users can view own flashcards" ON public.flashcards FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own flashcards" ON public.flashcards FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own flashcards" ON public.flashcards FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own flashcards" ON public.flashcards FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view own exam_dates" ON public.exam_dates FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own exam_dates" ON public.exam_dates FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own exam_dates" ON public.exam_dates FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own exam_dates" ON public.exam_dates FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view own stats" ON public.user_stats FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own stats" ON public.user_stats FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON public.user_stats FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view own review_history" ON public.review_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own review_history" ON public.review_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
