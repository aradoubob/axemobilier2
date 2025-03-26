/*
  # Add default images and fix display

  1. Changes
    - Add default images for all categories
    - Use direct URLs for initial content
    - Ensure proper image URLs
*/

-- Delete existing images to start fresh
DELETE FROM images;

-- Insert default images
INSERT INTO images (url, category, created_at)
VALUES 
  -- Hero image
  ('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=3272&auto=format&fit=crop', 'hero', now()),
  
  -- Logo
  ('https://axemobilier.fr/wp-content/uploads/2023/10/Logo-AXE-MOBILIER.png', 'logo', now()),
  
  -- Products
  ('https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2940&fit=crop', 'products', now()),
  ('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2940&fit=crop', 'products', now()),
  ('https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2940&fit=crop', 'products', now()),
  
  -- Kitchens
  ('https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2968&auto=format&fit=crop', 'projects-kitchens', now()),
  ('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2970&auto=format&fit=crop', 'projects-kitchens', now()),
  
  -- Bathrooms
  ('https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2969&auto=format&fit=crop', 'projects-bathrooms', now()),
  ('https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2970&auto=format&fit=crop', 'projects-bathrooms', now()),
  
  -- Misc
  ('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=3272&auto=format&fit=crop', 'projects-misc', now()),
  ('https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2927&auto=format&fit=crop', 'projects-misc', now());