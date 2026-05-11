import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import apiClient from '../utils/apiClient';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiAlertTriangle, FiPackage } from 'react-icons/fi';

export default function ManageProducts() {
  const [search, setSearch]             = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await apiClient.get('/products');
      return Array.isArray(res.data) ? res.data : (res.data?.products || []);
    },
    staleTime: 2 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product deleted');
      setConfirmDelete(null);
    },
    onError: () => toast.error('Failed to delete product'),
  });

  const filtered = products.filter(p =>
    (p.name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 text-sm">
        Failed to load products. Make sure the backend is running.
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-5xl">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {products.length} product{products.length !== 1 ? 's' : ''} in the database
          </p>
        </div>
        <Link
          to="/admin/products/create"
          className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm self-start sm:self-auto"
        >
          <FiPlus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
        />
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <FiPackage className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">
            {search ? 'No products match your search' : 'No products yet'}
          </p>
          {!search && (
            <Link
              to="/admin/products/create"
              className="mt-4 inline-block text-sm text-green-700 font-semibold hover:underline"
            >
              Add your first product →
            </Link>
          )}
        </div>
      )}

      {/* ── Mobile cards (< md) ── */}
      {filtered.length > 0 && (
        <div className="md:hidden space-y-3">
          {filtered.map(product => {
            const imgSrc = product.image || product.images?.[0]?.url || product.images?.[0];
            const inStock = product.countInStock ?? 0;
            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
              >
                {/* Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiPackage className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="font-semibold text-amber-700 text-xs">
                      GHS {Number(product.price || 0).toFixed(2)}
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className={`text-xs font-medium ${inStock === 0 ? 'text-red-500' : 'text-gray-500'}`}>
                      {inStock === 0 ? 'Out of stock' : `${inStock} in stock`}
                    </span>
                  </div>
                  <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                    product.status === 'inactive'
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {product.status || 'active'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Link
                    to={`/admin/products/edit/${product._id}`}
                    className="p-2 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setConfirmDelete(product)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Desktop table (≥ md) ── */}
      {filtered.length > 0 && (
        <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Stock</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(product => {
                  const imgSrc = product.image || product.images?.[0]?.url || product.images?.[0];
                  const inStock = product.countInStock ?? 0;
                  return (
                    <tr key={product._id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={e => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FiPackage className="w-5 h-5 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate max-w-[220px]">{product.name}</p>
                            <p className="text-gray-400 text-xs truncate max-w-[220px] mt-0.5">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-bold text-amber-700 text-sm">
                          GHS {Number(product.price || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${inStock === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                          {inStock}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                          product.status === 'inactive'
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {product.status || 'active'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="p-1.5 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit product"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setConfirmDelete(product)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete product"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiAlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900">Delete Product?</h3>
                <p className="text-gray-500 text-sm">This action cannot be undone.</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3.5 mb-5 flex items-center gap-3">
              {(confirmDelete.image || confirmDelete.images?.[0]) && (
                <img
                  src={confirmDelete.image || confirmDelete.images?.[0]}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              )}
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{confirmDelete.name}</p>
                <p className="text-amber-700 text-xs font-semibold mt-0.5">
                  GHS {Number(confirmDelete.price || 0).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(confirmDelete._id)}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white rounded-xl text-sm font-bold transition-colors"
              >
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
