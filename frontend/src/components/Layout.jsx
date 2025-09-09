import Navbar from './Navbar';
import Header from './Header'; // if you have a header component
import { Outlet } from 'react-router-dom';
import PageWrapper from './PageWrapper';
import PersistentMap from './PersistentMap';
import PageOverlay from './PageOverlay';

const Layout = () => {
    return (
        <PageWrapper>
            <PersistentMap />
            <div className="flex flex-col min-h-screen" style={{ position: 'relative', zIndex: 10 }}>
                <Navbar />
                {/* <Header /> */}
                <main className="flex-grow">
                    <PageOverlay>
                        <Outlet />
                    </PageOverlay>
                </main>
            </div>
        </PageWrapper>
    );
};

export default Layout;