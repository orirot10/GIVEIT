import React from 'react';

const PageWrapper = ({ children }) => {
  return (
    <div className="relative w-full min-h-screen">
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper; 