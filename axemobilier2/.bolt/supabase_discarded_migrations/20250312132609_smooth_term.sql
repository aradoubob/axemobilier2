/*
  # Add default images

  1. Changes
    - Add default images for hero section and products
    - Ensure images table exists with correct structure
    - Add sample data for testing
*/

-- Ensure images table exists with correct structure
CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT category_check CHECK (category IN ('hero', 'logo', 'products', 'projects-kitchens', 'projects-bathrooms', 'projects-misc'))
);

-- Insert default images if they don't exist
INSERT INTO images (url, category) 
VALUES 
  -- Hero image
  ('https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2968&auto=format&fit=crop', 'hero'),
  
  -- Products
  ('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2970&auto=format&fit=crop', 'products'),
  ('https://images.unsplash.com/photo-1556909172-8c2f041fca1e?q=80&w=2971&auto=format&fit=crop', 'products'),
  ('https://images.unsplash.com/photo-1556909190-10e42100fee1?q=80&w=2970&auto=format&fit=crop', 'products'),
  
  -- Kitchen projects
  ('https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=2970&auto=format&fit=crop', 'projects-kitchens'),
  ('https://images.unsplash.com/photo-1556912167-f556f1f39fdf?q=80&w=2970&auto=format&fit=crop', 'projects-kitchens'),
  
  -- Bathroom projects
  ('https://images.unsplash.com/photo-1556911261-6bd341186b2f?q=80&w=2970&auto=format&fit=crop', 'projects-bathrooms'),
  ('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2970&auto=format&fit=crop', 'projects-bathrooms'),
  
  -- Misc projects
  ('https://images.unsplash.com/photo-1556909190-d9b2a089a0fb?q=80&w=2970&auto=format&fit=crop', 'projects-misc'),
  ('https://images.unsplash.com/photo-1556909172-89c1c6c8e162?q=80&w=2970&auto=format&fit=crop', 'projects-misc')
ON CONFLICT DO NOTHING;