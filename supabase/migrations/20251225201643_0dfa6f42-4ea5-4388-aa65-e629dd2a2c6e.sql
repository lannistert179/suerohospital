-- Add display_order column to news table for custom ordering
ALTER TABLE public.news ADD COLUMN display_order integer DEFAULT 0;

-- Set initial display_order based on published_at for existing articles
UPDATE public.news 
SET display_order = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY published_at DESC NULLS LAST) as rn 
  FROM public.news
) sub 
WHERE public.news.id = sub.id;