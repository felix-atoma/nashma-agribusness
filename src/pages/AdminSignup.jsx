// AdminSignup.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretKey: '' // Add a secret key for admin registration
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.secretKey !== process.env.REACT_APP_ADMIN_SECRET) {
      setError('Invalid admin secret key');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const { confirmPassword, secretKey, ...adminData } = formData;
      const response = await apiClient.post('/api/auth/signup', {
        ...adminData,
        role: 'admin' // Set role to admin
      });
      
      if (response.data.success) {
        navigate('/admin/dashboard');
      } else {
        setError(response.data.message || 'Admin registration failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Admin registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Registration</h2>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="w-full p-2 border rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            className="w-full p-2 border rounded"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            className="w-full p-2 border rounded"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength="8"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="secretKey">
            Admin Secret Key
          </label>
          <input
            id="secretKey"
            type="password"
            name="secretKey"
            className="w-full p-2 border rounded"
            value={formData.secretKey}
            onChange={handleChange}
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Creating admin account...' : 'Register Admin'}
        </button>
      </form>
    </div>
  );
};

export default AdminSignup;