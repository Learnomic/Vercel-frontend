import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isYoutubePlayerPage = location.pathname === '/learn';

  return (
    <div className="scrollbar-hide min-h-screen bg-gray-50 flex flex-col">
      <ToastContainer />
      <Navbar />
      <main className="scrollbar-hide flex-grow w-full mt-0"> {/* Added margin-top to account for fixed navbar */}
        <div className="w-full mx-auto px-0 sm:px-0 lg:px-0 py-0 sm:py-0 lg:py-0 overflow-x-hidden">
          {children || <Outlet />}
        </div>
      </main>
      {!isYoutubePlayerPage && <Footer />}
    </div>
  );
};

export default MainLayout;