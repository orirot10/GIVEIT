import Navbar from './Navbar';
import Header from './Header'; // if you have a header component
import { Outlet } from 'react-router-dom';
import PageWrapper from './PageWrapper';

const Layout = () => {
    return (
        <PageWrapper>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                {/* <Header /> */}
                <main className="flex-grow">
                    <Outlet />
                </main>
            </div>
        </PageWrapper>
    );
};

export default Layout;