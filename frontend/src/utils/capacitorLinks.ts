import { Capacitor } from '@capacitor/core';

// Lazy imports for Capacitor plugins to avoid errors in web environment
let App: any = null;
let Browser: any = null;

const loadCapacitorPlugins = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      const { App: AppPlugin } = await import('@capacitor/app');
      const { Browser: BrowserPlugin } = await import('@capacitor/browser');
      App = AppPlugin;
      Browser = BrowserPlugin;
    } catch (error) {
      console.warn('Capacitor plugins not available:', error);
    }
  }
};

export const openPhoneDialer = async (phoneNumber: string): Promise<void> => {
  const telUrl = `tel:${phoneNumber}`;
  
  if (Capacitor.isNativePlatform()) {
    await loadCapacitorPlugins();
    if (App) {
      try {
        await App.openUrl({ url: telUrl });
        return;
      } catch (error) {
        console.error('Failed to open phone dialer with Capacitor:', error);
      }
    }
  }
  
  // Fallback to web
  window.open(telUrl, '_self');
};

export const openWhatsApp = async (phoneNumber: string, message?: string): Promise<void> => {
  const whatsappUrl = `whatsapp://send?phone=${phoneNumber}${message ? `&text=${encodeURIComponent(message)}` : ''}`;
  const webWhatsappUrl = `https://wa.me/${phoneNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
  
  if (Capacitor.isNativePlatform()) {
    await loadCapacitorPlugins();
    if (App) {
      try {
        await App.openUrl({ url: whatsappUrl });
        return;
      } catch (error) {
        console.error('Failed to open WhatsApp app, trying browser:', error);
        if (Browser) {
          try {
            await Browser.open({ url: webWhatsappUrl });
            return;
          } catch (browserError) {
            console.error('Failed to open WhatsApp in browser:', browserError);
          }
        }
      }
    }
  }
  
  // Fallback to web
  window.open(webWhatsappUrl, '_blank');
};