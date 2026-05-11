import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../utils/apiClient';
import { FiSave, FiArrowLeft, FiUploadCloud, FiX } from 'react-icons/fi';

const STATUS_OPTIONS = ['active', 'inactive'];

const EMPTY = { name: '', description: '', price: '', countInStock: '', status: 'active' };

export default function CreateProduct() {
  const { id }     = useParams();
  const isEditing  = Boolean(id);
  const navigate   = useNavigate();
  const fileRef    = useRef(null);

  const [form,         setForm]         = useState(EMPTY);
  const [imageFile,    setImageFile]    = useState(null);   // new file selected by admin
  const [imagePreview, setImagePreview] = useState(null);   // data-URL for preview
  const [existingImg,  setExistingImg]  = useState(null);   // URL stored in DB (edit mode)
  const [loading,      setLoading]      = useState(false);
  const [fetching,     setFetching]     = useState(false);
  const [error,        setError]        = useState('');

  // Load existing product when editing
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
          status:       p.status       || 'active',
        });
        setExistingImg(p.image || null);
      })
      .catch(() => setError('Failed to load product details'))
      .finally(() => setFetching(false));
  }, [id, isEditing]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate
    if (!isEditing && !imageFile) {
      setError('Please select a product image');
      setLoading(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append('name',         form.name.trim());
      fd.append('description',  form.description.trim());
      fd.append('price',        form.price);
      fd.append('countInStock', form.countInStock);
      fd.append('status',       form.status);
      if (imageFile) fd.append('image', imageFile);

      if (isEditing) {
        await apiClient.put(`/products/${id}`, fd);
        toast.success('Product updated successfully');
      } else {
        await apiClient.post('/products', fd);
        toast.success('Product created successfully');
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.data?.message || err.message || `Failed to ${isEditing ? 'update' : 'create'} product`);
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

        {/* Product Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Product Image {!isEditing && <span className="text-red-500">*</span>}
            {isEditing && <span className="text-gray-400 font-normal"> (leave empty to keep current)</span>}
          </label>

          {/* Preview area */}
          <div className="flex items-start gap-4">
            {/* New file preview OR existing image */}
            <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0 relative">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    title="Remove selected image"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </>
              ) : existingImg ? (
                <img
                  src={existingImg}
                  alt="Current"
                  className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="text-center px-2">
                  <FiUploadCloud className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                  <p className="text-xs text-gray-400">No image</p>
                </div>
              )}
            </div>

            {/* Upload button + instructions */}
            <div className="flex-1">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="product-image-input"
              />
              <label
                htmlFor="product-image-input"
                className="inline-flex items-center gap-2 cursor-pointer bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                <FiUploadCloud className="w-4 h-4" />
                {imageFile ? 'Change Image' : isEditing ? 'Upload New Image' : 'Choose Image'}
              </label>
              {imageFile && (
                <p className="text-xs text-gray-500 mt-2 truncate max-w-[180px]">
                  {imageFile.name}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                JPG, PNG or WebP · Max 5 MB<br />
                Auto-resized to 800 × 640 px
              </p>
            </div>
          </div>
        </div>

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
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

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
