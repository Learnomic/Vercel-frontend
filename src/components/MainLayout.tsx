import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow w-full">
        <div className="w-full mx-auto px-0 sm:px-6 lg:px-0 py-0 sm:py-0 lg:py-0 overflow-x-hidden">
          {children || <Outlet />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 