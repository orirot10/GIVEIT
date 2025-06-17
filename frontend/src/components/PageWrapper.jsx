import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';

const PageWrapper = ({ children }) => {
  return (
    <div className="relative w-full min-h-screen">
        <LanguageSwitcher />
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper; 