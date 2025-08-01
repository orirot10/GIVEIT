import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { user } = useAuthContext();
    const { t } = useTranslation();

    return (
        <header className="flex flex-col sm:flex-row justify-between items-center p-4" dir={t('navigation.home') === 'מוצרים' ? 'rtl' : 'ltr'}>
            <div className="flex flex-col items-center sm:items-start">
                {user && (
                    <div className="flex flex-col">
                        <div className="text-2xl text-gray-700 font-semibold mt-2 ml-2">
                            {t('common.welcome')} {user.user?.firstName || user.firstName || t('common.user')}! 👋
                        </div>
                        <div className="text-lg text-gray-500 ml-2">
                            {t('common.welcome_back')}
                        </div>
                    </div>
                )}
            </div>

            {/* Centered Title */}

        </header>
    );
};

export default Header;