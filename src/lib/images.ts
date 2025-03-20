import imageCompression from 'browser-image-compression';

export interface Image {
  id: string;
  url: string;
  category: string;
  createdAt: string;
}

class ImageStorage {
  private readonly STORAGE_KEY = 'axe-mobilier-images';
  private readonly SESSION_KEY = 'axe-mobilier-session';
  private images: Image[] = [];
  private initialized = false;

  constructor() {
    this.loadFromStorage();
    this.setupStorageSync();
  }

  private setupStorageSync() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === this.STORAGE_KEY) {
          this.loadFromStorage();
        }
      });

      window.addEventListener('beforeunload', () => {
        this.saveToStorage();
      });
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      let stored = sessionStorage.getItem(this.SESSION_KEY);
      
      if (!stored) {
        stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          sessionStorage.setItem(this.SESSION_KEY, stored);
        }
      }

      if (stored) {
        const parsed = JSON.parse(stored);
        this.images = Array.isArray(parsed) ? parsed : [];
      }

      this.initialized = true;
    } catch (error) {
      console.error('Error loading storage:', error);
      this.images = [];
      this.initialized = true;
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const data = JSON.stringify(this.images);
      localStorage.setItem(this.STORAGE_KEY, data);
      sessionStorage.setItem(this.SESSION_KEY, data);
    } catch (error) {
      console.error('Error saving:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.cleanOldImages();
        this.saveToStorage();
      }
    }
  }

  private cleanOldImages(): void {
    const important = this.images.filter(img => 
      img.category === 'logo' || img.category === 'hero'
    );
    
    const others = this.images
      .filter(img => img.category !== 'logo' && img.category !== 'hero')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 30);

    this.images = [...important, ...others];
  }

  getAll(): Image[] {
    if (!this.initialized) {
      this.loadFromStorage();
    }
    return [...this.images].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getByCategory(category: string): Image[] {
    if (!this.initialized) {
      this.loadFromStorage();
    }
    return this.images
      .filter(img => img.category === category)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getSingle(category: string): Image | null {
    if (!this.initialized) {
      this.loadFromStorage();
    }
    const images = this.getByCategory(category);
    return images.length > 0 ? images[0] : null;
  }

  add(image: Image): void {
    if (!this.initialized) {
      this.loadFromStorage();
    }

    if (image.category === 'logo' || image.category === 'hero') {
      this.images = this.images.filter(img => img.category !== image.category);
    }

    const newImage = {
      ...image,
      createdAt: new Date().toISOString()
    };

    this.images.push(newImage);
    this.saveToStorage();
  }

  remove(id: string): void {
    if (!this.initialized) {
      this.loadFromStorage();
    }
    this.images = this.images.filter(img => img.id !== id);
    this.saveToStorage();
  }
}

export const imageStorage = new ImageStorage();

export async function compressImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type');
  }

  const options = {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.7
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(compressedFile);
    });
  } catch (error) {
    throw new Error('Compression failed');
  }
}