-- Add category column to news table
ALTER TABLE public.news ADD COLUMN category text DEFAULT 'news';

-- Update existing articles to have 'news' category
UPDATE public.news SET category = 'news' WHERE category IS NULL;