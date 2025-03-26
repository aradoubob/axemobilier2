import { init } from '@emailjs/browser';

export const initEmailJS = () => {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  
  if (!publicKey || publicKey === 'YOUR_PUBLIC_KEY') {
    console.warn('EmailJS is not configured. Contact form will be disabled.');
    return false;
  }
  
  try {
    init(publicKey);
    return true;
  } catch (error) {
    console.warn('Failed to initialize EmailJS:', error);
    return false;
  }
};