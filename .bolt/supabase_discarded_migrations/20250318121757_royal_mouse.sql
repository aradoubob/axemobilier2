/*
  # Création de la table images

  1. Nouvelle Table
    - `images`
      - `id` (uuid, clé primaire)
      - `url` (text, non null)
      - `category` (text, non null)
      - `filename` (text, non null)
      - `created_at` (timestamp avec fuseau horaire)

  2. Sécurité
    - Activation RLS sur la table `images`
    - Politiques pour les utilisateurs authentifiés
*/

CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  category text NOT NULL,
  filename text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT category_check CHECK (category IN ('hero', 'logo', 'products', 'projects-kitchens', 'projects-bathrooms', 'projects-misc'))
);

ALTER TABLE images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs authentifiés peuvent lire toutes les images"
  ON images
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent insérer des images"
  ON images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent mettre à jour leurs images"
  ON images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent supprimer leurs images"
  ON images
  FOR DELETE
  TO authenticated
  USING (true);