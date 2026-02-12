
-- Clean up all duplicate/old policies to have only user-specific ones

-- flashcards
DROP POLICY IF EXISTS "Public read flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Public insert flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Public update flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Public delete flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Users can create own flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Users can update own flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Users can delete own flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Users can view own flashcards" ON public.flashcards;

-- exam_dates
DROP POLICY IF EXISTS "Public read exam_dates" ON public.exam_dates;
DROP POLICY IF EXISTS "Public insert exam_dates" ON public.exam_dates;
DROP POLICY IF EXISTS "Public update exam_dates" ON public.exam_dates;
DROP POLICY IF EXISTS "Public delete exam_dates" ON public.exam_dates;
DROP POLICY IF EXISTS "Users can create own exam dates" ON public.exam_dates;
DROP POLICY IF EXISTS "Users can update own exam dates" ON public.exam_dates;
DROP POLICY IF EXISTS "Users can delete own exam dates" ON public.exam_dates;
DROP POLICY IF EXISTS "Users can view own exam dates" ON public.exam_dates;

-- profiles
DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- user_stats
DROP POLICY IF EXISTS "Public read user_stats" ON public.user_stats;
DROP POLICY IF EXISTS "Public insert user_stats" ON public.user_stats;
DROP POLICY IF EXISTS "Public update user_stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can insert own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can view own stats" ON public.user_stats;

-- review_history
DROP POLICY IF EXISTS "Public read review_history" ON public.review_history;
DROP POLICY IF EXISTS "Public insert review_history" ON public.review_history;
DROP POLICY IF EXISTS "Users can insert own review history" ON public.review_history;
DROP POLICY IF EXISTS "Users can view own review history" ON public.review_history;
