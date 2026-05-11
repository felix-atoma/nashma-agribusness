import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../utils/apiClient';
import { FiSave, FiArrowLeft, FiPackage } from 'react-icons/fi';

const CATEGORIES = [
  'Cocoa Potash',
  'African Black Soap',
  'Farm Inputs',
  'Training Kits',
  'Agro-Commodities',
];

const STATUS_OPTIONS = ['active', 'inactive'];

const EMPTY = { name: '', description: '', price: '', countInStock: '', image: '', status: 'active' };

export default function CreateProduct() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate  = useNavigate();

  const [form,    setForm]    = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!isEditing) return;
    setFetching(true);
    apiClient.get(`/products/${id}`)
      .then(res => {
        const p = res.data?.data?.product || res.data?.product || res.data;
        setForm({
          name:         p.name         || '',
          description:  p.description  || '',
          price:        p.price        != null ? String(p.price) : '',
          countInStock: p.countInStock != null ? String(p.countInStock) : '',
          image:        p.image        || '',
          status:       p.status       || 'active',
        });
      })
      .catch(() => setError('Failed to load product details'))
      .finally(() => setFetching(false));
  }, [id, isEditing]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      name:         form.name.trim(),
      description:  form.description.trim(),
      price:        Number(form.price),
      countInStock: Number(form.countInStock),
      image:        form.image.trim(),
      status:       form.status,
    };

    try {
      if (isEditing) {
        await apiClient.put(`/products/${id}`, payload);
        toast.success('Product updated successfully');
      } else {
        await apiClient.post('/products', payload);
        toast.success('Product created successfully');
      }
      navigate('/admin/products');
    } catch (err) {
      const msg = err.data?.message || err.message || `Failed to ${isEditing ? 'update' : 'create'} product`;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all';

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {isEditing ? 'Update product details and pricing' : 'Add a new product to your catalogue'}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Cocoa Potash — 5 kg"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className={inputClass}
            placeholder="Describe the product…"
            required
          />
        </div>

        {/* Price + Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (GHS) *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium select-none">GHS</span>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`${inputClass} pl-12`}
                placeholder="0.00"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock Quantity *</label>
            <input
              type="number"
              name="countInStock"
              value={form.countInStock}
              onChange={handleChange}
              min="0"
              className={inputClass}
              placeholder="e.g. 100"
              required
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image URL *</label>
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. /cocoa-potash-1kg.jpg  or  https://…"
            required
          />
          <p className="text-xs text-gray-400 mt-1.5">
            Use a path like <code className="bg-gray-100 px-1 rounded">/cocoa-potash-1kg.jpg</code> for local images, or paste any full URL.
          </p>
        </div>

        {/* Image preview */}
        {form.image && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Preview</label>
            <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={form.image}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <FiSave className="w-4 h-4" />
            {loading
              ? (isEditing ? 'Saving…' : 'Creating…')
              : (isEditing ? 'Save Changes' : 'Create Product')
            }
          </button>
        </div>
      </form>
    </div>
  );
}
