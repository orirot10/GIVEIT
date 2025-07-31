import React from 'react';
import givitIcon from '../../resources/givit.svg';

const PageWrapper = ({ children }) => {
  return (
    <div className="relative w-full min-h-screen">
      <img
        src={givitIcon}
        alt="givit"
        className="absolute top-2 left-2 w-8 h-8"
      />
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
