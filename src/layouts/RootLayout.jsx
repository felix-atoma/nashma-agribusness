import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-md">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-100">
        <Footer />
      </footer>
    </div>
  );
};

export default RootLayout;
