import React, { useState, useEffect } from 'react';
import { Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { imageStorage, compressImage, type Image } from '../lib/images';
import toast from 'react-hot-toast';

export function AdminPanel() {
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('hero');
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'images' | 'logo'>('images');
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const allImages = await imageStorage.getAll();
      setImages(allImages);
    } catch (error) {
      console.error('Erreur chargement images:', error);
      setError('Erreur lors du chargement des images');
      toast.error('Erreur lors du chargement des images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image trop volumineuse (max 5MB)');
      }

      const compressedFile = await compressImage(file);
      const currentCategory = activeTab === 'logo' ? 'logo' : category;

      await imageStorage.add(compressedFile, currentCategory);
      await loadImages();
      toast.success('Image ajoutée avec succès');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors du téléchargement');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      toast.error('Veuillez déposer uniquement des images');
      return;
    }

    for (const file of imageFiles) {
      await handleImageUpload(file);
    }
  };

  const handleImageDelete = async (imageId: string) => {
    try {
      await imageStorage.remove(imageId);
      await loadImages();
      toast.success('Image supprimée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const categoryLabels = {
    hero: 'Image d\'en-tête',
    products: 'Nos Produits',
    'projects-kitchens': 'Réalisations - Cuisines',
    'projects-bathrooms': 'Réalisations - Salles de bains',
    'projects-misc': 'Réalisations - Divers',
    logo: 'Logo'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-axe-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const logoImage = images.find(img => img.category === 'logo');

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-axe-blue mb-6">Administration</h2>

          <div className="flex gap-4 mb-8 border-b">
            <button
              onClick={() => setActiveTab('images')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === 'images'
                  ? 'border-axe-blue text-axe-blue'
                  : 'border-transparent text-gray-600 hover:text-axe-blue'
              }`}
            >
              Gestion des Images
            </button>
            <button
              onClick={() => setActiveTab('logo')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === 'logo'
                  ? 'border-axe-blue text-axe-blue'
                  : 'border-transparent text-gray-600 hover:text-axe-blue'
              }`}
            >
              Gestion du Logo
            </button>
          </div>
          
          {activeTab === 'images' ? (
            <div>
              <div className="mb-8">
                <div className="flex gap-4 mb-4">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:ring-axe-blue focus:border-axe-blue"
                  >
                    <option value="hero">Image d'en-tête</option>
                    <option value="products">Nos Produits</option>
                    <option value="projects-kitchens">Réalisations - Cuisines</option>
                    <option value="projects-bathrooms">Réalisations - Salles de bains</option>
                    <option value="projects-misc">Réalisations - Divers</option>
                  </select>

                  <label className="flex items-center gap-2 px-4 py-2 bg-axe-blue text-white rounded-lg cursor-pointer hover:bg-opacity-90">
                    <Upload className="w-5 h-5" />
                    {uploading ? 'Téléchargement...' : 'Télécharger une image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                <div 
                  className={`border-4 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer hover:border-axe-blue ${
                    isDragging ? 'border-axe-blue bg-axe-blue bg-opacity-5' : 'border-gray-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium text-gray-600 mb-2">
                    {isDragging ? 'Déposez vos images ici' : 'Glissez et déposez vos images ici'}
                  </p>
                  <p className="text-sm text-gray-500">
                    ou cliquez pour sélectionner des fichiers
                  </p>
                </div>
              </div>

              <div>
                {Object.entries(categoryLabels)
                  .filter(([cat]) => cat !== 'logo')
                  .map(([cat, label]) => (
                    <div key={cat} className="mb-8">
                      <h3 className="text-xl font-semibold text-axe-blue mb-4">{label}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images
                          .filter(image => image.category === cat)
                          .map((image) => (
                            <div key={image.id} className="relative group">
                              <img
                                src={image.url}
                                alt=""
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                                <button
                                  onClick={() => handleImageDelete(image.id)}
                                  className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Logo actuel</h3>
                {logoImage ? (
                  <div className="relative inline-block group">
                    <img
                      src={logoImage.url}
                      alt="Logo"
                      className="h-24 w-auto object-contain"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded flex items-center justify-center">
                      <button
                        onClick={() => handleImageDelete(logoImage.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Aucun logo téléchargé
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Télécharger un nouveau logo</h3>
                <label className="flex items-center gap-2 px-4 py-2 bg-axe-blue text-white rounded-lg cursor-pointer hover:bg-opacity-90 w-fit">
                  <Upload className="w-5 h-5" />
                  {uploading ? 'Téléchargement...' : 'Télécharger un logo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500">
                  Format recommandé : PNG transparent
                  <br />
                  Taille recommandée : 500x200 pixels
                </p>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600 space-y-1 mt-8">
            <p>• Double-cliquez sur le logo pour accéder/quitter l'interface admin</p>
            <p>• Sélectionnez une catégorie avant de télécharger une image</p>
            <p>• Glissez-déposez vos images ou utilisez le bouton de téléchargement</p>
            <p>• Passez la souris sur une image pour afficher le bouton de suppression</p>
          </div>
        </div>
      </div>
    </div>
  );
}