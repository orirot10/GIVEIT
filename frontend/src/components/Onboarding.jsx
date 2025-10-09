import React, { useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { useTranslation } from 'react-i18next';
import './onboarding.css';

const Onboarding = ({ lang = 'he', onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const { t } = useTranslation();

  // Fallback texts in case translations fail
  const fallbackTexts = {
    he: {
      slides: [
        {
          title: "ברוך הבא ל-Givit 💚",
          description: "אפליקציה שמחברת בין אנשים שמציעים עזרה, מוצרים או שירותים לבין כאלה שמבקשים.",
          icon: "🤝"
        },
        {
          title: "הצעות ובקשות",
          description: "בלשונית הצעות תראה מה אנשים מציעים, ובבקשות תוכל לפרסם מה אתה מחפש.",
          icon: "📋"
        },
        {
          title: "שירותים ומוצרים",
          description: "בשירותים תמצא עזרה, שיעורים ותיקונים; במוצרים תוכל למסור או לבקש פריטים יד שנייה.",
          icon: "🛠️"
        }
      ],
      startButton: "התחלת שימוש"
    },
    en: {
      slides: [
        {
          title: "Welcome to Givit 💚",
          description: "The app that connects people who offer help, products, or services with those who need them.",
          icon: "🤝"
        },
        {
          title: "Offers and Requests",
          description: "In the 'Offers' tab you'll see what people are offering, and in 'Requests' you can post what you're looking for.",
          icon: "📋"
        },
        {
          title: "Services and Products",
          description: "'Services' include help, lessons, or repairs; 'Products' are for giving or requesting second-hand items.",
          icon: "🛠️"
        }
      ],
      startButton: "Start using Givit"
    }
  };

  const slides = [
    {
      title: t('onboarding.slide1_title') || fallbackTexts[lang].slides[0].title,
      description: t('onboarding.slide1_description') || fallbackTexts[lang].slides[0].description,
      icon: "🤝"
    },
    {
      title: t('onboarding.slide2_title') || fallbackTexts[lang].slides[1].title,
      description: t('onboarding.slide2_description') || fallbackTexts[lang].slides[1].description,
      icon: "📋"
    },
    {
      title: t('onboarding.slide3_title') || fallbackTexts[lang].slides[2].title,
      description: t('onboarding.slide3_description') || fallbackTexts[lang].slides[2].description,
      icon: "🛠️"
    }
  ];

  const startButtonText = t('onboarding.start_button') || fallbackTexts[lang].startButton;
  const isRTL = lang === 'he';

  const handleStart = async () => {
    setIsClosing(true);
    try {
      await Preferences.set({
        key: 'givit_onboarding_done',
        value: 'true'
      });
    } catch (error) {
      console.error('Error saving onboarding flag:', error);
    }
    
    // Add a small delay for fade animation
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className={`onboarding-overlay ${isRTL ? 'rtl' : 'ltr'} ${isClosing ? 'closing' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="onboarding-content">
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
        
        <div className="slides-container">
          {slides.map((slide, index) => (
            <div key={index} className={`slide ${index === currentSlide ? 'active' : ''}`}>
              <div className="slide-content">
                <div className="slide-icon">{slide.icon}</div>
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-description">{slide.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="navigation-controls">
         
          <button 
            className="nav-btn next" 
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
          >
            {isRTL ? '›' : '‹'}
          </button>

           <button 
            className="nav-btn prev" 
            onClick={prevSlide}
            disabled={currentSlide === 0}
          >
            {isRTL ? '‹' : '›'}
          </button>
        </div>

        <div className="onboarding-footer">
          <button 
            className="btn btn-primary btn-start"
            onClick={handleStart}
            disabled={isClosing}
          >
            {startButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;