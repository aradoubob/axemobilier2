/*
  # Configuration du stockage des images

  1. Création des buckets
    - `images` : stockage principal des images du site
      - Accès public en lecture
      - Accès restreint en écriture aux utilisateurs authentifiés
  
  2. Politiques
    - Lecture publique pour toutes les images
    - Écriture/suppression uniquement pour les utilisateurs authentifiés
*/

-- Création du bucket pour les images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

-- Politique de lecture publique
CREATE POLICY "Images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Politique d'insertion pour les utilisateurs authentifiés
CREATE POLICY "Users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Politique de suppression pour les utilisateurs authentifiés
CREATE POLICY "Users can delete their images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');