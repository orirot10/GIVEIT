import Navbar from './Navbar';
import Header from './Header'; // if you have a header component
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
        <Navbar />
        {/* <Header /> */}
        <main>
            <Outlet />
        </main>
        </>
    );
};

export default Layout;