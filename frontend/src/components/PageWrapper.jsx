import React from 'react';
import givitIcon from '../../resources/givit.svg';

const PageWrapper = ({ children }) => {
  return (
    <div className="relative w-full min-h-screen">
      <img
        src={givitIcon}
        alt="givit"
        className="absolute top-0.5 left-2 w-2 h-3 z-200"
      />
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
