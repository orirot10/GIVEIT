import React from 'react';
import logo from '../assets/logoGiveIt.jpg';
import { useAuthContext } from '../context/AuthContext';

const Header = () => {
    const { user } = useAuthContext();
    return (
        <header className="flex flex-col sm:flex-row justify-between items-center p-4">
            {/* Logo & Greeting */}
            <div className="flex flex-col items-center sm:items-start">
                {/* <img src={logo} alt="GiveIt Logo" className="w-40 h-auto mb-1" /> */}
                {user && (
                    <div className="flex flex-col">
                        <div className="text-2xl text-gray-700 font-semibold mt-2 ml-2">
                            Hello {user.user?.firstName || user.firstName || 'User'}! 👋
                        </div>
                        <div className="text-lg text-gray-500 ml-2">
                            nice to see you again:)
                        </div>
                    </div>
                )}
            </div>

            {/* Centered Title */}

        </header>
    );
};

export default Header;