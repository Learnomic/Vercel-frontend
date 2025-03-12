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
      <main className="w-full mx-auto px-0 sm:px-0 lg:px-0 py-0 flex-grow">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 