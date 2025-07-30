import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminNavbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="admin-navbar">
      <div className="admin-brand">Admin Panel</div>
      <div className="admin-links">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/products">Products</Link>
        <Link to="/admin/products/create">Create Product</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default AdminNavbar;