import React, { useState, useEffect } from 'react';
import { X, ImageOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { imageStorage, type Image } from '../lib/images';

interface ImageGalleryProps {
  category: string;
  className?: string;
}

export function ImageGallery({ category, className = '' }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
  }, [category]);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedImages = await imageStorage.getByCategory(category);
      setImages(fetchedImages);
    } catch (error) {
      console.error('Erreur lors du chargement des images:', error);
      setError('Erreur lors du chargement des images');
      toast.error('Erreur lors du chargement des images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = (imageId: string) => {
    setLoadedImages(prev => new Set([...prev, imageId]));
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageId);
      return newSet;
    });
  };

  const handleImageError = (imageId: string) => {
    setFailedImages(prev => new Set([...prev, imageId]));
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageId);
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-axe-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune image disponible pour cette catégorie
      </div>
    );
  }

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
        {images.map((image) => (
          <div 
            key={image.id} 
            className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
            onClick={() => !failedImages.has(image.id) && setSelectedImage(image)}
          >
            <div className="aspect-video w-full relative bg-gray-100">
              {failedImages.has(image.id) ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center text-gray-400">
                    <ImageOff className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-sm">Image non disponible</span>
                  </div>
                </div>
              ) : (
                <>
                  <div 
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      loadedImages.has(image.id) ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    <div className="animate-pulse w-full h-full bg-gray-200"></div>
                  </div>
                  <img 
                    src={image.url}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
                      loadedImages.has(image.id) 
                        ? 'opacity-100 transform group-hover:scale-105' 
                        : 'opacity-0'
                    }`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(image.id)}
                    onError={() => handleImageError(image.id)}
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-[90vw] max-h-[90vh] relative">
            <img 
              src={selectedImage.url}
              alt=""
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
              onError={() => {
                handleImageError(selectedImage.id);
                setSelectedImage(null);
                toast.error('Impossible de charger l\'image');
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}