"use client"

import { useState, useEffect } from 'react'
import { Plus, Search, FilterX, Edit, Trash2, X, Upload } from 'lucide-react'
import { getProducts, addProduct, deleteProduct, updateProduct } from '@/app/actions/products'
import { createClient } from '@/utils/supabase/client'

export default function ProductManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const initialProductState = {
    name: "",
    sku: "",
    category: "Raw Makhana",
    sizes: [{ size: "250g", price: "", discountedPrice: "", stock: "0" }] as any[],
    status: "Active",
    nutrition: {
      servingSize: "100g",
      calories: "347 kcal",
      protein: "9g",
      carbohydrate: "77g",
      fiber: "0.6g",
      fat: "0.1g"
    },
    image_url: ""
  };

  const [newProduct, setNewProduct] = useState(initialProductState);
  const [editingProduct, setEditingProduct] = useState({ id: 0, ...initialProductState });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await getProducts();
    const parsedData = data.map((p: any) => {
      let meta: any = {};
      try { meta = JSON.parse(p.description || '{}') } catch (e) {}
      
      let mappedSizes = [{ size: "250g", price: p.price.toString(), discountedPrice: "", stock: p.stock_quantity || "0" }];
      if (meta.sizes && meta.sizes.length > 0) {
        if (typeof meta.sizes[0] === 'string') {
          mappedSizes = meta.sizes.map((s: string) => ({ size: s, price: p.price.toString(), discountedPrice: meta.discountedPrice || "", stock: p.stock_quantity || "0" }));
        } else {
          mappedSizes = meta.sizes.map((s: any) => ({ ...s, stock: s.stock || "0" }));
        }
      }

      return {
        id: p.id,
        name: p.name,
        sku: meta.sku || `SKU-${p.id.substring(0, 4)}`,
        category: meta.category || 'Raw Makhana',
        sizes: mappedSizes,
        nutrition: meta.nutrition || initialProductState.nutrition,
        status: p.is_active ? 'Active' : 'Draft',
        image_url: p.image_url || 'https://via.placeholder.com/150'
      }
    });
    setProducts(parsedData);
    setLoading(false);
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.sku || newProduct.sizes.length === 0 || !newProduct.sizes[0].price) return;
    setUploading(true);

    let finalImageUrl = newProduct.image_url;
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        finalImageUrl = data.publicUrl;
      } else {
        console.error("Upload error:", await res.text());
      }
    }

    const meta = {
      sku: newProduct.sku,
      category: newProduct.category,
      sizes: newProduct.sizes,
      nutrition: newProduct.nutrition
    };

    const result = await addProduct({
      name: newProduct.name,
      slug: newProduct.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000),
      price: parseFloat(newProduct.sizes[0].price),
      description: JSON.stringify(meta),
      image_url: finalImageUrl
    });

    if (result.error) {
      alert("Failed to add product: " + result.error);
      setUploading(false);
      return;
    }

    setIsAddModalOpen(false);
    setNewProduct(initialProductState);
    setImageFile(null);
    setUploading(false);
    fetchProducts();
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.sku || editingProduct.sizes.length === 0 || !editingProduct.sizes[0].price) return;
    setUploading(true);
    
    let finalImageUrl = editingProduct.image_url;
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        finalImageUrl = data.publicUrl;
      } else {
        console.error("Upload error:", await res.text());
      }
    }

    const meta = {
      sku: editingProduct.sku,
      category: editingProduct.category,
      sizes: editingProduct.sizes,
      nutrition: editingProduct.nutrition
    };

    const result = await updateProduct(editingProduct.id.toString(), {
      name: editingProduct.name,
      price: parseFloat(editingProduct.sizes[0].price),
      description: JSON.stringify(meta),
      image_url: finalImageUrl,
      is_active: editingProduct.status === 'Active'
    });

    if (result.error) {
      alert("Failed to update product: " + result.error);
      setUploading(false);
      return;
    }

    setIsEditModalOpen(false);
    setEditingProduct({ id: 0, ...initialProductState });
    setImageFile(null);
    setUploading(false);
    fetchProducts();
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    fetchProducts();
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All Categories' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'All Statuses' || product.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All Categories');
    setStatusFilter('All Statuses');
  };

  return (
    <div className="relative z-10 max-w-[1280px] mx-auto w-full">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">Loading products...</div>
      ) : (
        <>
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-forest-deep mb-2">Product Management</h2>
          <p className="text-on-surface-variant font-body-md max-w-2xl">
            Manage your Mithila Makhana product catalog. Add new flavors, update pricing, and modify product descriptions.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-forest-deep text-white px-6 py-2.5 rounded-lg font-label-lg flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-md"
          >
            <Plus className="w-5 h-5" /> Add Product
          </button>
        </div>
      </header>

      {/* Filters & Search Bento Card */}
      <div className="bg-surface-container-lowest rounded-xl p-6 mb-8 shadow-sm border border-outline-variant/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-5 h-5" />
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-gold-accent outline-none transition-all font-body-md" placeholder="Search by Product Name or SKU..." type="text" />
          </div>
          <div className="md:col-span-3 flex items-center gap-3">
            <span className="font-label-lg text-on-surface-variant">Category:</span>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="flex-1 py-3 px-4 bg-surface-container-low border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-gold-accent outline-none font-body-md appearance-none">
              <option value="All Categories">All Categories</option>
              <option value="Flavored Makhana">Flavored Makhana</option>
              <option value="Raw Makhana">Raw Makhana</option>
              <option value="Bundles">Bundles</option>
            </select>
          </div>
          <div className="md:col-span-3 flex items-center gap-3">
            <span className="font-label-lg text-on-surface-variant">Status:</span>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="flex-1 py-3 px-4 bg-surface-container-low border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-gold-accent outline-none font-body-md appearance-none">
              <option value="All Statuses">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <div className="md:col-span-1 flex justify-end">
            <button onClick={clearFilters} className="p-3 text-on-surface-variant hover:text-tertiary transition-colors" title="Clear Filters">
              <FilterX className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Table Container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20">
                <th className="px-6 py-5 font-label-lg text-forest-deep">Product</th>
                <th className="px-6 py-5 font-label-lg text-forest-deep">Category</th>
                <th className="px-6 py-5 font-label-lg text-forest-deep">Price</th>
                <th className="px-6 py-5 font-label-lg text-forest-deep">Status</th>
                <th className="px-6 py-5 font-label-lg text-forest-deep text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-cream-bg transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden shrink-0 border border-outline-variant/20">
                        <img className="w-full h-full object-cover" alt={product.name} src={product.image_url} />
                      </div>
                      <div>
                        <p className="font-label-lg text-forest-deep leading-tight">{product.name}</p>
                        <p className="text-[11px] text-on-surface-variant">SKU: {product.sku} • {product.sizes.join(", ")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-body-md text-on-surface-variant">{product.category}</td>
                  <td className="px-6 py-4">
                    <span className="font-label-lg text-forest-deep">₹{product.price}</span>
                    {product.discountedPrice && (
                      <span className="block text-xs text-error line-through">₹{product.discountedPrice}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {product.status === 'Active' ? (
                      <span className="bg-secondary-container/50 text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Active
                      </span>
                    ) : (
                      <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(product)} className="p-2 text-on-surface-variant hover:text-primary-custom transition-colors rounded-full hover:bg-surface-container-high">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id.toString())} className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-full hover:bg-surface-container-high">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal Components */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-surface-container">
              <h3 className="font-headline-md text-forest-deep">
                {isEditModalOpen ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="text-on-surface-variant hover:text-error transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={isEditModalOpen ? handleEditProduct : handleAddProduct} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Common Form Fields */}
              {(() => {
                const formData = isEditModalOpen ? editingProduct : newProduct;
                const setFormData: any = isEditModalOpen ? setEditingProduct : setNewProduct;

                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-label-sm text-on-surface-variant mb-1">Product Name</label>
                        <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value} as any)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/30 focus:ring-2 focus:ring-primary-custom outline-none" type="text" placeholder="e.g., Spicy Peri Peri" />
                      </div>
                      <div>
                        <label className="block font-label-sm text-on-surface-variant mb-1">SKU</label>
                        <input required value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value} as any)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/30 focus:ring-2 focus:ring-primary-custom outline-none" type="text" placeholder="SKU-123" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-label-sm text-on-surface-variant mb-1">Category</label>
                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value} as any)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/30 focus:ring-2 focus:ring-primary-custom outline-none">
                          <option>Raw Makhana</option>
                          <option>Flavored Makhana</option>
                          <option>Bundles</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-label-sm text-on-surface-variant mb-1">Status</label>
                        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value} as any)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/30 focus:ring-2 focus:ring-primary-custom outline-none">
                          <option>Active</option>
                          <option>Draft</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-label-sm text-on-surface-variant mb-1">Product Image</label>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer bg-surface-container hover:bg-surface-container-high transition-colors px-4 py-2 rounded-lg border border-outline-variant/30 flex items-center gap-2">
                          <Upload className="w-4 h-4 text-forest-deep" />
                          <span className="font-label-sm text-forest-deep">Upload Image</span>
                          <input type="file" accept="image/*" className="hidden" onChange={e => {
                            if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
                          }} />
                        </label>
                        <span className="text-xs text-on-surface-variant truncate max-w-[200px]">
                          {imageFile ? imageFile.name : (formData.image_url ? 'Existing image set' : 'No file chosen')}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-outline-variant/20 pt-4 mt-2">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-label-lg text-forest-deep">Sizes, Pricing & Stock</h4>
                        <button type="button" onClick={() => setFormData({...formData, sizes: [...formData.sizes, { size: '250g', price: '', discountedPrice: '', stock: '0' }]})} className="text-primary-custom text-xs font-bold hover:underline">+ Add Size</button>
                      </div>
                      <div className="space-y-2">
                        {formData.sizes.map((s: any, idx: number) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input required className="w-1/4 px-2 py-2 text-sm rounded-lg border border-outline-variant/30 outline-none" value={s.size} onChange={e => { const newSizes = [...formData.sizes]; newSizes[idx].size = e.target.value; setFormData({...formData, sizes: newSizes})}} placeholder="Size (e.g. 250g)" />
                            <input required type="number" min="0" step="0.01" className="w-1/4 px-2 py-2 text-sm rounded-lg border border-outline-variant/30 outline-none" value={s.price} onChange={e => { const newSizes = [...formData.sizes]; newSizes[idx].price = e.target.value; setFormData({...formData, sizes: newSizes})}} placeholder="Price (₹)" />
                            <input type="number" min="0" step="0.01" className="w-1/4 px-2 py-2 text-sm rounded-lg border border-outline-variant/30 outline-none" value={s.discountedPrice} onChange={e => { const newSizes = [...formData.sizes]; newSizes[idx].discountedPrice = e.target.value; setFormData({...formData, sizes: newSizes})}} placeholder="Sale (₹)" />
                            <input required type="number" min="0" className="w-1/4 px-2 py-2 text-sm rounded-lg border border-outline-variant/30 outline-none" value={s.stock} onChange={e => { const newSizes = [...formData.sizes]; newSizes[idx].stock = e.target.value; setFormData({...formData, sizes: newSizes})}} placeholder="Stock" />
                            <button type="button" onClick={() => { const newSizes = [...formData.sizes]; newSizes.splice(idx, 1); setFormData({...formData, sizes: newSizes})}} className="p-1 hover:bg-error/10 rounded">
                              <X className="w-4 h-4 text-error" />
                            </button>
                          </div>
                        ))}
                      </div>
                      {formData.sizes.length === 0 && <p className="text-xs text-error mt-1">Please add at least one size.</p>}
                    </div>

                    <div className="border-t border-outline-variant/20 pt-4 mt-2">
                      <h4 className="font-label-lg text-forest-deep mb-2">Nutritional Info (per 100g)</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[10px] text-on-surface-variant uppercase">Calories</label>
                          <input className="w-full px-2 py-1.5 text-sm rounded border border-outline-variant/30 outline-none" value={formData.nutrition.calories} onChange={e => setFormData({...formData, nutrition: {...formData.nutrition, calories: e.target.value}})} placeholder="347 kcal" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-on-surface-variant uppercase">Protein</label>
                          <input className="w-full px-2 py-1.5 text-sm rounded border border-outline-variant/30 outline-none" value={formData.nutrition.protein} onChange={e => setFormData({...formData, nutrition: {...formData.nutrition, protein: e.target.value}})} placeholder="9.7g" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-on-surface-variant uppercase">Carbs</label>
                          <input className="w-full px-2 py-1.5 text-sm rounded border border-outline-variant/30 outline-none" value={formData.nutrition.carbohydrate} onChange={e => setFormData({...formData, nutrition: {...formData.nutrition, carbohydrate: e.target.value}})} placeholder="76.9g" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-on-surface-variant uppercase">Fat</label>
                          <input className="w-full px-2 py-1.5 text-sm rounded border border-outline-variant/30 outline-none" value={formData.nutrition.fat} onChange={e => setFormData({...formData, nutrition: {...formData.nutrition, fat: e.target.value}})} placeholder="0.1g" />
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
              
              <div className="pt-4 flex justify-end gap-3 border-t border-surface-container">
                <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="px-5 py-2 font-label-lg text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={uploading || (isEditModalOpen ? editingProduct : newProduct).sizes.length === 0} className="px-5 py-2 font-label-lg bg-forest-deep text-white rounded-lg shadow-md hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {uploading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : null}
                  {uploading ? "Saving..." : (isEditModalOpen ? "Update Product" : "Save Product")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  )
}
