-- Add gallery_images column to store array of image URLs
ALTER TABLE public.news 
ADD COLUMN gallery_images jsonb DEFAULT '[]'::jsonb;