import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Dossier de stockage des images
const UPLOAD_DIR = join(__dirname, 'uploads');

// Création du dossier uploads s'il n'existe pas
try {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
} catch (error) {
  console.error('Erreur création dossier uploads:', error);
}

app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

// Middleware de gestion des erreurs CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Endpoint pour uploader une image
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucune image fournie' });
    }

    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ error: 'Catégorie requise' });
    }

    // Génération d'un nom de fichier unique
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;
    const filepath = join(UPLOAD_DIR, filename);

    // Compression et conversion en WebP
    await sharp(req.file.buffer)
      .resize(1920, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filepath);

    // Si c'est un logo ou une image hero, on supprime les anciennes images
    if (category === 'logo' || category === 'hero') {
      const files = await fs.readdir(UPLOAD_DIR);
      for (const file of files) {
        if (file.endsWith('.metadata.json')) {
          const metadataPath = join(UPLOAD_DIR, file);
          try {
            const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));
            if (metadata.category === category) {
              await fs.unlink(join(UPLOAD_DIR, metadata.id + '.webp')).catch(console.error);
              await fs.unlink(metadataPath).catch(console.error);
            }
          } catch (error) {
            console.error('Erreur lecture metadata:', error);
          }
        }
      }
    }

    // Sauvegarde des métadonnées
    const metadata = {
      id: filename.split('.')[0],
      url: `/uploads/${filename}`,
      category,
      createdAt: new Date().toISOString()
    };

    await fs.writeFile(
      join(UPLOAD_DIR, `${filename.split('.')[0]}.metadata.json`),
      JSON.stringify(metadata),
      'utf-8'
    );

    res.json(metadata);
  } catch (error) {
    console.error('Erreur upload:', error);
    res.status(500).json({ error: 'Erreur lors du traitement de l\'image' });
  }
});

// Endpoint pour récupérer les images
app.get('/api/images', async (req, res) => {
  try {
    const files = await fs.readdir(UPLOAD_DIR);
    const images = [];

    for (const file of files) {
      if (file.endsWith('.metadata.json')) {
        try {
          const metadata = await fs.readFile(
            join(UPLOAD_DIR, file),
            'utf-8'
          );
          images.push(JSON.parse(metadata));
        } catch (error) {
          console.error(`Erreur lecture metadata ${file}:`, error);
          // Continue avec le fichier suivant
          continue;
        }
      }
    }

    res.json(images);
  } catch (error) {
    console.error('Erreur lecture images:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des images' });
  }
});

// Endpoint pour supprimer une image
app.delete('/api/images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const metadataPath = join(UPLOAD_DIR, `${id}.metadata.json`);
    
    try {
      const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));
      await fs.unlink(join(UPLOAD_DIR, id + '.webp')).catch(console.error);
      await fs.unlink(metadataPath);
      res.json({ success: true });
    } catch (error) {
      res.status(404).json({ error: 'Image non trouvée' });
    }
  } catch (error) {
    console.error('Erreur suppression:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});