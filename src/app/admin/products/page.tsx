"use client"
import { useState, useEffect } from 'react'
import { Plus, Search, FilterX, Edit, Trash2, X, Upload, PackageSearch, Package, Image as ImageIcon } from 'lucide-react'
import { getProducts, addProduct, deleteProduct, updateProduct, deleteStorageImage } from '@/app/actions/products'

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
    image_url: "",
    images: [] as string[]
  };

  const [newProduct, setNewProduct] = useState(initialProductState);
  const [editingProduct, setEditingProduct] = useState({ id: 0, ...initialProductState });
  const [localImages, setLocalImages] = useState<{ url?: string, file?: File }[]>([]);
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
      
      let mappedSizes = [{ size: "250g", price: p.price?.toString() || "", discountedPrice: "", stock: p.stock_quantity || "0" }];
      if (meta.sizes && meta.sizes.length > 0) {
        if (typeof meta.sizes[0] === 'string') {
          mappedSizes = meta.sizes.map((s: string) => ({ size: s, price: p.price?.toString() || "", discountedPrice: meta.discountedPrice || "", stock: p.stock_quantity || "0" }));
        } else {
          mappedSizes = meta.sizes.map((s: any) => ({ ...s, stock: s.stock || "0" }));
        }
      }

      return {
        id: p.id,
        name: p.name,
        sku: meta.sku || `SKU-${p.id.substring(0, 4)}`,
        category: meta.category || 'Raw Makhana',
        price: p.price,
        sizes: mappedSizes,
        nutrition: meta.nutrition || initialProductState.nutrition,
        status: p.is_active ? 'Active' : 'Draft',
        image_url: p.image_url || 'https://via.placeholder.com/150',
        images: meta.images || (p.image_url ? [p.image_url] : [])
      }
    });
    setProducts(parsedData);
    setLoading(false);
  }

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const data = await res.json();
      return data.publicUrl;
    }
    return null;
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.sku || newProduct.sizes.length === 0 || !newProduct.sizes[0].price) return;
    setUploading(true);

    let finalImages: string[] = [];
    for (const item of localImages) {
      if (item.file) {
        const uploadedUrl = await uploadImage(item.file);
        if (uploadedUrl) finalImages.push(uploadedUrl);
      } else if (item.url) {
        finalImages.push(item.url);
      }
    }
    
    const finalImageUrl = finalImages.length > 0 ? finalImages[0] : newProduct.image_url;

    const meta = {
      sku: newProduct.sku,
      category: newProduct.category,
      sizes: newProduct.sizes,
      nutrition: newProduct.nutrition,
      images: finalImages
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
    setLocalImages([]);
    setUploading(false);
    fetchProducts();
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.sku || editingProduct.sizes.length === 0 || !editingProduct.sizes[0].price) return;
    setUploading(true);
    
    let finalImages: string[] = [];
    const remainingUrls: string[] = [];
    
    for (const item of localImages) {
      if (item.file) {
        const uploadedUrl = await uploadImage(item.file);
        if (uploadedUrl) finalImages.push(uploadedUrl);
      } else if (item.url) {
        finalImages.push(item.url);
        remainingUrls.push(item.url);
      }
    }

    const originalImageUrls = editingProduct.images || [];
    const urlsToDelete = originalImageUrls.filter(url => !remainingUrls.includes(url));
    
    if (urlsToDelete.length > 0) {
      for (const url of urlsToDelete) {
        await deleteStorageImage(url);
      }
    }

    const finalImageUrl = finalImages.length > 0 ? finalImages[0] : editingProduct.image_url;

    const meta = {
      sku: editingProduct.sku,
      category: editingProduct.category,
      sizes: editingProduct.sizes,
      nutrition: editingProduct.nutrition,
      images: finalImages
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
    setLocalImages([]);
    setUploading(false);
    fetchProducts();
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setLocalImages(product.images.map((url: string) => ({ url })));
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

  const activeCount = products.filter(p => p.status === 'Active').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-custom via-[#5a4800] to-[#2c2400] p-8 md:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none transform translate-x-8 -translate-y-8">
          <Package className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-display-lg mb-3 tracking-tight text-white flex items-center gap-3">
              Product Inventory
            </h1>
            <p className="text-white/80 font-body-lg max-w-2xl text-lg">
              Manage your Mithila Makhana catalog. Add new flavors, organize sizes, update pricing, and modify stock levels.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-lg">
              <div className="flex flex-col">
                <span className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1">Total Items</span>
                <span className="text-2xl font-bold">{products.length}</span>
              </div>
              <div className="w-px h-10 bg-white/20 mx-2"></div>
              <div className="flex flex-col">
                <span className="text-xs text-emerald-400/80 uppercase tracking-wider font-bold mb-1">Active</span>
                <span className="text-2xl font-bold text-emerald-50">{activeCount}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setNewProduct(initialProductState);
                setLocalImages([]);
                setIsAddModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-primary-custom rounded-2xl font-label-lg font-bold hover:bg-cream-bg transition-all hover:scale-[1.02] hover:shadow-xl w-full sm:w-auto"
            >
              <Plus className="w-5 h-5" /> Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30 overflow-hidden flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
        
        {/* Filters Toolbar */}
        <div className="p-6 border-b border-outline-variant/20 bg-surface-container-lowest flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-5 h-5" />
            <input 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary-custom/30 focus:border-primary-custom outline-none transition-all font-body-sm text-sm" 
              placeholder="Search by Product Name or SKU..." 
              type="text" 
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="flex-1 sm:flex-none relative">
              <select 
                value={categoryFilter} 
                onChange={e => setCategoryFilter(e.target.value)} 
                className="w-full sm:w-48 py-3 pl-4 pr-10 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary-custom/30 outline-none font-body-sm text-sm appearance-none cursor-pointer"
              >
                <option value="All Categories">All Categories</option>
                <option value="Flavored Makhana">Flavored Makhana</option>
                <option value="Raw Makhana">Raw Makhana</option>
                <option value="Bundles">Bundles</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-on-surface-variant/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            <div className="flex-1 sm:flex-none relative">
              <select 
                value={statusFilter} 
                onChange={e => setStatusFilter(e.target.value)} 
                className="w-full sm:w-40 py-3 pl-4 pr-10 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary-custom/30 outline-none font-body-sm text-sm appearance-none cursor-pointer"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-on-surface-variant/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            <button 
              onClick={clearFilters} 
              className="p-3 text-on-surface-variant hover:text-primary-custom hover:bg-primary-container/20 rounded-xl transition-all border border-outline-variant/30 sm:border-transparent shrink-0 flex justify-center items-center" 
              title="Clear Filters"
            >
              <FilterX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm whitespace-nowrap">
            <thead className="bg-surface-container-low/30 text-on-surface-variant text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-8 py-5">Product Details</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Variant Pricing</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-on-surface-variant">
                      <div className="w-8 h-8 border-4 border-primary-custom border-t-transparent rounded-full animate-spin mb-4 opacity-70"></div>
                      <p className="font-label-md">Loading products...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-on-surface-variant opacity-60">
                      <PackageSearch className="w-16 h-16 mb-4 opacity-50 text-outline-variant" />
                      <p className="font-label-lg text-lg mb-1">No products found</p>
                      <p className="font-body-sm">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-surface-container-lowest/80 transition-colors group cursor-pointer" onClick={() => openEditModal(product)}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-surface-container overflow-hidden shrink-0 border border-outline-variant/30 shadow-sm relative">
                          <img className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt={product.name} src={product.image_url} />
                          {product.images?.length > 1 && (
                            <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 rounded flex items-center gap-0.5 backdrop-blur-sm">
                              <ImageIcon className="w-2.5 h-2.5" /> {product.images.length}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-headline-md text-forest-deep text-base mb-1">{product.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-on-surface-variant/70 bg-surface-container-low px-1.5 py-0.5 rounded border border-outline-variant/20">
                              {product.sku}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex px-3 py-1 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs font-bold text-on-surface-variant">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1.5">
                        {product.sizes.map((s: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase w-12">{s.size}</span>
                            <span className="font-bold text-forest-deep text-sm">₹{s.discountedPrice || s.price || '0'}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      {product.status === 'Active' ? (
                        <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border bg-surface-container-high text-on-surface-variant border-outline-variant/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={(e) => { e.stopPropagation(); openEditModal(product); }} 
                          className="flex items-center justify-center w-10 h-10 bg-white border border-outline-variant/40 rounded-xl text-forest-deep hover:text-primary-custom hover:border-primary-custom/40 hover:bg-primary-container/10 transition-all shadow-sm"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id.toString()); }} 
                          className="flex items-center justify-center w-10 h-10 bg-white border border-outline-variant/40 rounded-xl text-error/80 hover:text-error hover:border-error/40 hover:bg-error-container/20 transition-all shadow-sm"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal Components */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="bg-surface-container-lowest w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/20 shrink-0">
              <h3 className="font-headline-md text-xl text-forest-deep flex items-center gap-2">
                {isEditModalOpen ? <Edit className="w-5 h-5 text-primary-custom" /> : <Plus className="w-5 h-5 text-primary-custom" />}
                {isEditModalOpen ? "Edit Product Details" : "Create New Product"}
              </h3>
              <button 
                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-error-container hover:text-error text-on-surface-variant transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Modal Body - Scrollable */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
              <form id="product-form" onSubmit={isEditModalOpen ? handleEditProduct : handleAddProduct} className="space-y-8 pb-4">
                {(() => {
                  const formData = isEditModalOpen ? editingProduct : newProduct;
                  const setFormData: any = isEditModalOpen ? setEditingProduct : setNewProduct;

                  return (
                    <>
                      {/* Basic Details Section */}
                      <div>
                        <h4 className="font-label-lg text-forest-deep mb-4 flex items-center gap-2 border-b border-outline-variant/10 pb-2">Basic Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                            <label className="block font-bold text-[11px] uppercase tracking-wider text-on-surface-variant">Product Name <span className="text-error">*</span></label>
                            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value} as any)} className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary-custom/30 focus:border-primary-custom outline-none transition-all shadow-sm font-body-md" type="text" placeholder="e.g., Spicy Peri Peri Makhana" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="block font-bold text-[11px] uppercase tracking-wider text-on-surface-variant">Stock Keeping Unit (SKU) <span className="text-error">*</span></label>
                            <input required value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value} as any)} className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary-custom/30 focus:border-primary-custom outline-none transition-all shadow-sm font-body-md font-mono text-sm" type="text" placeholder="SKU-12345" />
                          </div>
                          <div className="space-y-1.5 relative">
                            <label className="block font-bold text-[11px] uppercase tracking-wider text-on-surface-variant">Category</label>
                            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value} as any)} className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary-custom/30 focus:border-primary-custom outline-none transition-all shadow-sm font-body-md appearance-none">
                              <option>Raw Makhana</option>
                              <option>Flavored Makhana</option>
                              <option>Bundles</option>
                            </select>
                            <div className="absolute right-4 top-[38px] pointer-events-none">
                              <svg className="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                          </div>
                          <div className="space-y-1.5 relative">
                            <label className="block font-bold text-[11px] uppercase tracking-wider text-on-surface-variant">Visibility Status</label>
                            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value} as any)} className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary-custom/30 focus:border-primary-custom outline-none transition-all shadow-sm font-body-md appearance-none">
                              <option>Active</option>
                              <option>Draft</option>
                            </select>
                            <div className="absolute right-4 top-[38px] pointer-events-none">
                              <svg className="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Product Images Section */}
                      <div>
                        <h4 className="font-label-lg text-forest-deep mb-4 flex items-center gap-2 border-b border-outline-variant/10 pb-2">Product Images</h4>
                        <div className="space-y-4">
                          <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-surface-container hover:bg-surface-container-high rounded-xl border border-outline-variant/40 text-forest-deep font-bold text-sm transition-colors shadow-sm">
                            <Upload className="w-4 h-4" />
                            Add More Images
                            <input type="file" accept="image/*" multiple className="hidden" onChange={e => {
                              if (e.target.files) {
                                const newFiles = Array.from(e.target.files).map(file => ({ file, url: URL.createObjectURL(file) }));
                                setLocalImages([...localImages, ...newFiles]);
                              }
                            }} />
                          </label>
                          <p className="text-xs text-on-surface-variant/70">
                            You can upload multiple images. The first image will be used as the primary thumbnail. Use the replace button to swap a specific image.
                          </p>

                          <div className="flex flex-wrap gap-4 mt-4">
                            {localImages.map((imgObj, idx) => (
                              <div key={`img-${idx}`} className="relative w-28 h-28 rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm group">
                                <img src={imgObj.url} className="w-full h-full object-cover" alt="Preview" />
                                
                                {/* Overlay actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <label className="cursor-pointer p-1.5 bg-white text-forest-deep rounded hover:bg-cream-bg transition-colors" title="Replace Image">
                                    <Upload className="w-3.5 h-3.5" />
                                    <input type="file" accept="image/*" className="hidden" onChange={e => {
                                      if (e.target.files && e.target.files[0]) {
                                        const newLocal = [...localImages];
                                        newLocal[idx] = { file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]) };
                                        setLocalImages(newLocal);
                                      }
                                    }} />
                                  </label>
                                  <button type="button" onClick={() => setLocalImages(localImages.filter((_, i) => i !== idx))} className="p-1.5 bg-error text-white rounded hover:bg-error/90 transition-colors" title="Delete Image">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                
                                {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-primary-custom/90 text-white text-[9px] font-bold text-center py-0.5 pointer-events-none">PRIMARY</span>}
                                {imgObj.file && <span className="absolute top-1 left-1 bg-amber-400 text-amber-950 text-[8px] font-bold px-1 rounded pointer-events-none">NEW</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Variants & Pricing Section */}
                      <div>
                        <div className="flex justify-between items-center mb-4 border-b border-outline-variant/10 pb-2">
                          <h4 className="font-label-lg text-forest-deep flex items-center gap-2">Variants & Pricing</h4>
                          <button type="button" onClick={() => setFormData({...formData, sizes: [...formData.sizes, { size: '100g', price: '', discountedPrice: '', stock: '0' }]})} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-container/20 text-primary-custom hover:bg-primary-container/40 rounded-lg text-sm font-bold transition-colors">
                            <Plus className="w-4 h-4" /> Add Variant
                          </button>
                        </div>
                        
                        <div className="bg-surface-container-low/50 rounded-2xl border border-outline-variant/20 p-2 space-y-2">
                          {/* Headers */}
                          <div className="hidden sm:grid grid-cols-12 gap-2 px-2 py-1">
                            <div className="col-span-3 text-[10px] uppercase font-bold text-on-surface-variant">Size/Weight</div>
                            <div className="col-span-3 text-[10px] uppercase font-bold text-on-surface-variant">Regular Price (₹)</div>
                            <div className="col-span-3 text-[10px] uppercase font-bold text-on-surface-variant">Final Sale Price (₹)</div>
                            <div className="col-span-2 text-[10px] uppercase font-bold text-on-surface-variant">Stock Quantity</div>
                            <div className="col-span-1"></div>
                          </div>

                          {formData.sizes.map((s: any, idx: number) => (
                            <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-white p-4 sm:p-2 rounded-xl shadow-sm border border-outline-variant/20 relative">
                              <div className="sm:hidden flex items-center justify-between mb-2 col-span-1 border-b border-outline-variant/10 pb-2">
                                <span className="font-bold text-forest-deep text-sm">Variant {idx + 1}</span>
                                <button type="button" onClick={() => { const newSizes = [...formData.sizes]; newSizes.splice(idx, 1); setFormData({...formData, sizes: newSizes})}} className="p-1.5 bg-error-container/50 hover:bg-error-container text-error rounded-lg">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              
                              <div className="col-span-1 sm:col-span-3">
                                <span className="sm:hidden text-xs text-on-surface-variant mb-1 block font-bold uppercase tracking-wider">Size/Weight:</span>
                                <input required className="w-full px-3 py-2 text-sm bg-surface-container-lowest rounded-lg border border-outline-variant/40 focus:border-primary-custom outline-none font-bold" value={s.size} onChange={e => { const newSizes = [...formData.sizes]; newSizes[idx].size = e.target.value; setFormData({...formData, sizes: newSizes})}} placeholder="e.g. 250g" />
                              </div>
                              <div className="col-span-1 sm:col-span-3 relative">
                                <span className="sm:hidden text-xs text-on-surface-variant mb-1 block font-bold uppercase tracking-wider">Regular Price:</span>
                                <span className="absolute left-3 top-[34px] sm:top-1/2 sm:-translate-y-1/2 text-on-surface-variant/50 font-bold">₹</span>
                                <input required type="number" min="0" step="0.01" className="w-full pl-7 pr-3 py-2 text-sm bg-surface-container-lowest rounded-lg border border-outline-variant/40 focus:border-primary-custom outline-none font-bold text-on-surface-variant" value={s.price} onChange={e => { const newSizes = [...formData.sizes]; newSizes[idx].price = e.target.value; setFormData({...formData, sizes: newSizes})}} placeholder="MRP" />
                              </div>
                              <div className="col-span-1 sm:col-span-3 relative">
                                <span className="sm:hidden text-xs text-on-surface-variant mb-1 block font-bold uppercase tracking-wider">Final Sale Price:</span>
                                <span className="absolute left-3 top-[34px] sm:top-1/2 sm:-translate-y-1/2 text-on-surface-variant/50 font-bold">₹</span>
                                <input type="number" min="0" step="0.01" className="w-full pl-7 pr-3 py-2 text-sm bg-surface-container-lowest rounded-lg border border-outline-variant/40 focus:border-primary-custom outline-none font-bold text-forest-deep" value={s.discountedPrice} onChange={e => { const newSizes = [...formData.sizes]; newSizes[idx].discountedPrice = e.target.value; setFormData({...formData, sizes: newSizes})}} placeholder="Selling Price" />
                              </div>
                              <div className="col-span-1 sm:col-span-2">
                                <span className="sm:hidden text-xs text-on-surface-variant mb-1 block font-bold uppercase tracking-wider">Stock Quantity:</span>
                                <input required type="number" min="0" className="w-full px-3 py-2 text-sm bg-surface-container-lowest rounded-lg border border-outline-variant/40 focus:border-primary-custom outline-none font-bold text-forest-deep" value={s.stock} onChange={e => { const newSizes = [...formData.sizes]; newSizes[idx].stock = e.target.value; setFormData({...formData, sizes: newSizes})}} placeholder="0" />
                              </div>
                              <div className="hidden sm:flex col-span-1 justify-center">
                                <button type="button" onClick={() => { const newSizes = [...formData.sizes]; newSizes.splice(idx, 1); setFormData({...formData, sizes: newSizes})}} className="p-2 hover:bg-error-container text-error/70 hover:text-error transition-colors rounded-lg" title="Remove Variant">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        {formData.sizes.length === 0 && <p className="text-xs font-bold text-error mt-2 flex items-center gap-1"><X className="w-3 h-3" /> Please add at least one product variant.</p>}
                      </div>

                      {/* Nutritional Info Section */}
                      <div>
                        <h4 className="font-label-lg text-forest-deep mb-4 flex items-center gap-2 border-b border-outline-variant/10 pb-2">Nutritional Information</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-container-low/50 p-4 rounded-2xl border border-outline-variant/20">
                          <div className="space-y-1">
                            <label className="block text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Calories</label>
                            <input className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-outline-variant/40 focus:border-primary-custom outline-none font-bold text-forest-deep" value={formData.nutrition.calories} onChange={e => setFormData({...formData, nutrition: {...formData.nutrition, calories: e.target.value}})} placeholder="347 kcal" />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Protein</label>
                            <input className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-outline-variant/40 focus:border-primary-custom outline-none font-bold text-forest-deep" value={formData.nutrition.protein} onChange={e => setFormData({...formData, nutrition: {...formData.nutrition, protein: e.target.value}})} placeholder="9.7g" />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Carbs</label>
                            <input className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-outline-variant/40 focus:border-primary-custom outline-none font-bold text-forest-deep" value={formData.nutrition.carbohydrate} onChange={e => setFormData({...formData, nutrition: {...formData.nutrition, carbohydrate: e.target.value}})} placeholder="76.9g" />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Fat</label>
                            <input className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-outline-variant/40 focus:border-primary-custom outline-none font-bold text-forest-deep" value={formData.nutrition.fat} onChange={e => setFormData({...formData, nutrition: {...formData.nutrition, fat: e.target.value}})} placeholder="0.1g" />
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </form>
            </div>
            
            {/* Modal Footer - Fixed at bottom */}
            <div className="p-6 border-t border-outline-variant/20 bg-surface-container-lowest shrink-0 flex flex-col-reverse sm:flex-row justify-end gap-3 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
              <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="px-6 py-3 font-label-lg text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors w-full sm:w-auto">
                Cancel
              </button>
              <button 
                form="product-form"
                type="submit" 
                disabled={uploading || (isEditModalOpen ? editingProduct : newProduct).sizes.length === 0} 
                className="px-6 py-3 font-label-lg bg-forest-deep text-white rounded-xl shadow-lg shadow-forest-deep/20 hover:opacity-90 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                {uploading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0"></span>
                ) : null}
                {uploading ? "Saving Details..." : (isEditModalOpen ? "Save Changes" : "Publish Product")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
