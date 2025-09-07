import React from 'react';
import { Link } from 'react-router-dom';
import givitIcon from '../../resources/logo.svg';

const PageWrapper = ({ children }) => {
  return (
    <div className="relative w-full min-h-screen">
      <Link to="/">
        <img
          src={givitIcon}
          alt="givit"
          className="absolute top-0 left-2 w-10 h-3 z-4 cursor-pointer"
        />
      </Link>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
