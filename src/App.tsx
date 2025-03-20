import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, ChevronRight, Menu, X, Settings } from 'lucide-react';
import { AdminPanel } from './components/AdminPanel';
import { LoginPanel } from './components/LoginPanel';
import { ImageGallery } from './components/ImageGallery';
import { LanguageSelector } from './components/LanguageSelector';
import { imageStorage } from './lib/images';
import { useLanguageStore, translations } from './lib/i18n';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

function HomePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHero = async () => {
      try {
        setLoading(true);
        setError(null);
        const image = await imageStorage.getSingle('hero');
        setHeroImage(image ? image.url : null);
      } catch (error) {
        console.error('Failed to load hero image:', error);
        setError('Erreur lors du chargement de l\'image');
      } finally {
        setLoading(false);
      }
    };

    loadHero();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-axe-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <div className="absolute inset-0">
          {heroImage ? (
            <img 
              src={heroImage}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-400">Image non disponible</p>
            </div>
          )}
          <div className="absolute inset-0 bg-black opacity-50" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t.hero.title}
            </h1>
            <button 
              onClick={() => onNavigate('produits')}
              className="bg-axe-gold text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-2"
            >
              <span>{t.hero.cta}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-axe-blue mb-12 text-center">
            {t.nav.products}
          </h2>
          <ImageGallery category="products" className="mb-8" />
        </div>
      </section>
    </div>
  );
}

function ProductsPage() {
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-axe-blue mb-12">
          {t.nav.products}
        </h1>
        <ImageGallery category="products" />
      </div>
    </div>
  );
}

function ProjectsPage() {
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-axe-blue mb-12">
          {t.projects.title}
        </h1>
        
        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-semibold text-axe-blue mb-8">
              {t.projects.categories.kitchens}
            </h2>
            <ImageGallery category="projects-kitchens" />
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-axe-blue mb-8">
              {t.projects.categories.bathrooms}
            </h2>
            <ImageGallery category="projects-bathrooms" />
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-axe-blue mb-8">
              {t.projects.categories.misc}
            </h2>
            <ImageGallery category="projects-misc" />
          </section>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const subject = encodeURIComponent('Contact depuis le site web');
      const body = encodeURIComponent(`
Nom: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}
      `);
      
      window.location.href = `mailto:info@axemoblier.com?subject=${subject}&body=${body}`;
      
      toast.success('Votre client mail a été ouvert');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de l\'ouverture du client mail');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-axe-blue mb-12">
          {t.contact.title}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-axe-blue mb-6">
              {t.contact.title}
            </h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-axe-gold" />
                <a 
                  href="tel:0040786256027"
                  className="hover:text-axe-blue transition-colors"
                >
                  00 40 786 256 027
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-axe-gold" />
                <a 
                  href="mailto:info@axemoblier.com"
                  className="hover:text-axe-blue transition-colors"
                >
                  info@axemoblier.com
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-axe-gold" />
                <p>Strada 602 n°32 - 317235 PECICA</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Suivez-nous
              </h3>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/AxeMobilier"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-axe-gold hover:text-axe-blue transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.instagram.com/axe.mobilier/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-axe-gold hover:text-axe-blue transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.contact.form.name}
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-axe-blue focus:border-axe-blue"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.contact.form.email}
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-axe-blue focus:border-axe-blue"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.contact.form.message}
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-axe-blue focus:border-axe-blue"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="bg-axe-blue text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Envoi en cours...' : t.contact.form.send}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('accueil');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguageStore();
  const t = translations[language];

  useEffect(() => {
    const loadLogo = async () => {
      try {
        setLoading(true);
        setError(null);
        const logo = await imageStorage.getSingle('logo');
        setLogoUrl(logo ? logo.url : null);
      } catch (error) {
        console.error('Failed to load logo:', error);
        setError('Erreur lors du chargement du logo');
      } finally {
        setLoading(false);
      }
    };

    loadLogo();
  }, []);

  const handleLogout = () => {
    setIsAdmin(false);
    setIsAuthenticated(false);
    setShowAdminPanel(false);
    toast.success('Déconnexion réussie');
  };

  const toggleAdminPanel = () => {
    if (isAuthenticated) {
      setShowAdminPanel(!showAdminPanel);
    } else {
      setIsAdmin(true);
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (isAdmin && !isAuthenticated) {
      setIsAdmin(false);
    }
    setShowAdminPanel(false);
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowAdminPanel(true);
    toast.success('Connexion réussie');
  };

  const renderContent = () => {
    if (isAdmin && !isAuthenticated) {
      return <LoginPanel onLogin={handleLogin} />;
    }

    if (showAdminPanel) {
      return (
        <div>
          <div className="bg-white shadow-sm p-4 mb-6">
            <div className="container mx-auto flex justify-end">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
          <AdminPanel />
        </div>
      );
    }

    switch (currentPage) {
      case 'produits':
        return <ProductsPage />;
      case 'realisations':
        return <ProjectsPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-axe-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              {logoUrl && (
                <img 
                  src={logoUrl}
                  alt="Axe Mobilier Logo" 
                  className="h-12"
                />
              )}
              <span className="text-2xl font-bold text-axe-blue hidden sm:block">AXE MOBILIER</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => handleNavigate('accueil')}
                className={`${currentPage === 'accueil' ? 'text-axe-blue font-semibold' : 'text-gray-600'} hover:text-axe-blue`}
              >
                {t.nav.home}
              </button>
              <button 
                onClick={() => handleNavigate('produits')}
                className={`${currentPage === 'produits' ? 'text-axe-blue font-semibold' : 'text-gray-600'} hover:text-axe-blue`}
              >
                {t.nav.products}
              </button>
              <button 
                onClick={() => handleNavigate('realisations')}
                className={`${currentPage === 'realisations' ? 'text-axe-blue font-semibold' : 'text-gray-600'} hover:text-axe-blue`}
              >
                {t.nav.projects}
              </button>
              <button 
                onClick={() => handleNavigate('contact')}
                className={`${currentPage === 'contact' ? 'text-axe-blue font-semibold' : 'text-gray-600'} hover:text-axe-blue`}
              >
                {t.nav.contact}
              </button>
              <LanguageSelector />
            </nav>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleAdminPanel}
                className="p-2 text-gray-600 hover:text-axe-blue transition-colors"
                title="Administration"
              >
                <Settings className="w-6 h-6" />
              </button>
              <button 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-axe-blue" />
                ) : (
                  <Menu className="w-6 h-6 text-axe-blue" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <button 
                onClick={() => handleNavigate('accueil')}
                className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                {t.nav.home}
              </button>
              <button 
                onClick={() => handleNavigate('produits')}
                className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                {t.nav.products}
              </button>
              <button 
                onClick={() => handleNavigate('realisations')}
                className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                {t.nav.projects}
              </button>
              <button 
                onClick={() => handleNavigate('contact')}
                className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                {t.nav.contact}
              </button>
              <LanguageSelector />
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-axe-blue text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex flex-col items-start space-y-4">
                {logoUrl && (
                  <img 
                    src={logoUrl}
                    alt="Axe Mobilier Logo" 
                    className="h-12"
                  />
                )}
                <span className="text-xl font-bold text-white">AXE MOBILIER</span>
              </div>
              <p className="text-gray-300 mt-4">{t.footer.reference}</p>
              <div className="space-y-2 mt-4 text-gray-300">
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-axe-gold" />
                  <a 
                    href="tel:0040786256027"
                    className="hover:text-white transition-colors"
                  >
                    00 40 786 256 027
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-axe-gold" />
                  <a 
                    href="mailto:info@axemoblier.com"
                    className="hover:text-white transition-colors"
                  >
                    info@axemoblier.com
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-axe-gold" />
                  <p>Strada 602 n°32 - 317235 PECICA</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">{t.footer.quickLinks}</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => handleNavigate('accueil')}
                    className="text-gray-300 hover:text-white"
                  >
                    {t.nav.home}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigate('produits')}
                    className="text-gray-300 hover:text-white"
                  >
                    {t.nav.products}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigate('realisations')}
                    className="text-gray-300 hover:text-white"
                  >
                    {t.nav.projects}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigate('contact')}
                    className="text-gray-300 hover:text-white"
                  >
                    {t.nav.contact}
                  </button>
                </li>
              </ul>
              <div className="flex space-x-4 mt-6">
                <a 
                  href="https://www.facebook.com/AxeMobilier"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-axe-gold hover:text-white transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.instagram.com/axe.mobilier/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-axe-gold hover:text-white transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Axe Mobilier. {t.footer.rights}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;