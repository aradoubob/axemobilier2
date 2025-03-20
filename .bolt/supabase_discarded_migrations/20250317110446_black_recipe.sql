/*
  # Fix storage configuration and default images

  1. Changes
    - Reset storage configuration
    - Update policies for better security
    - Add default images using Unsplash URLs
*/

-- Désactivation temporaire de RLS
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- Suppression des politiques existantes
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "storage_public_read" ON storage.objects;
DROP POLICY IF EXISTS "storage_auth_all" ON storage.objects;
DROP POLICY IF EXISTS "storage_public_read_v3" ON storage.objects;
DROP POLICY IF EXISTS "storage_auth_all_v3" ON storage.objects;

-- Configuration du bucket
UPDATE storage.buckets
SET 
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[],
    updated_at = now()
WHERE id = 'images';

-- Création des politiques de base
CREATE POLICY "storage_public_read_v4"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

CREATE POLICY "storage_auth_all_v4"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Attribution des permissions
GRANT USAGE ON SCHEMA storage TO public;
GRANT USAGE ON SCHEMA storage TO authenticated;

GRANT SELECT ON storage.objects TO public;
GRANT ALL ON storage.objects TO authenticated;

GRANT SELECT ON storage.buckets TO public;
GRANT ALL ON storage.buckets TO authenticated;

-- Réactivation de RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Réinitialisation de la table images
TRUNCATE TABLE images;

-- Insertion des images avec des URLs Unsplash valides
INSERT INTO images (url, category, created_at)
VALUES 
  -- Hero image (Image d'en-tête moderne et élégante d'un intérieur)
  ('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=3272&auto=format&fit=crop', 'hero', now()),
  
  -- Logo (URL directe du site web)
  ('https://axemobilier.fr/wp-content/uploads/2023/10/Logo-AXE-MOBILIER.png', 'logo', now()),
  
  -- Products (Mobilier professionnel et aménagements)
  ('https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2940&fit=crop', 'products', now()),
  ('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2940&fit=crop', 'products', now()),
  ('https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2940&fit=crop', 'products', now()),
  
  -- Cuisines (Cuisines professionnelles et aménagements)
  ('https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2968&auto=format&fit=crop', 'projects-kitchens', now()),
  ('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2970&auto=format&fit=crop', 'projects-kitchens', now()),
  
  -- Salles de bains (Salles de bains professionnelles)
  ('https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2969&auto=format&fit=crop', 'projects-bathrooms', now()),
  ('https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2970&auto=format&fit=crop', 'projects-bathrooms', now()),
  
  -- Divers (Autres aménagements professionnels)
  ('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=3272&auto=format&fit=crop', 'projects-misc', now()),
  ('https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2927&auto=format&fit=crop', 'projects-misc', now());