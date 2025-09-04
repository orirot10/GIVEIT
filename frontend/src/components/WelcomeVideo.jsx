import React, { useEffect, useState } from 'react';
import splashLogo from '../../images/logogood.png';

const WelcomeVideo = ({ onVideoEnd }) => {
  const [videoError, setVideoError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Fallback timer in case video takes too long to load
    const fallbackTimer = setTimeout(() => {
      setShowFallback(true);
      // End after showing fallback for 2 seconds
      setTimeout(() => {
        if (onVideoEnd) onVideoEnd();
      }, 2000);
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(fallbackTimer);
  }, [onVideoEnd]);

  const handleVideoEnd = () => {
    if (onVideoEnd) {
      onVideoEnd();
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
    setShowFallback(true);
    // Show fallback for 2 seconds then end
    setTimeout(() => {
      if (onVideoEnd) onVideoEnd();
    }, 2000);
  };

  const handleVideoCanPlay = () => {
    setVideoError(false);
  };

  if (showFallback || videoError) {
    return (
      <div className="splash-screen">
        <img src={splashLogo} alt="GIVIT" />
      </div>
    );
  }

  return (
    <div className="welcome-video-container">
      <video
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        onError={handleVideoError}
        onCanPlay={handleVideoCanPlay}
        className="welcome-video"
      >
        <source src="/welcome_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default WelcomeVideo;