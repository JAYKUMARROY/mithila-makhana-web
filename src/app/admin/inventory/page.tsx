"use client"

import { useState, useEffect } from 'react'
import { Search, FilterX, AlertTriangle, Edit, X } from 'lucide-react'
import { getProducts, updateProduct } from '@/app/actions/products'

export default function InventoryControl() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('All Items');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const data = await getProducts();
    const parsedData = data.map((p: any) => {
      let meta: any = {};
      try { meta = JSON.parse(p.description || '{}') } catch (e) {}
      
      let mappedSizes = [{ size: "250g", price: p.price.toString(), discountedPrice: "", stock: p.stock_quantity || 0 }];
      if (meta.sizes && meta.sizes.length > 0) {
        if (typeof meta.sizes[0] === 'string') {
          mappedSizes = meta.sizes.map((s: string) => ({ size: s, price: p.price.toString(), discountedPrice: meta.discountedPrice || "", stock: p.stock_quantity || 0 }));
        } else {
          mappedSizes = meta.sizes.map((s: any) => ({ ...s, stock: s.stock || 0 }));
        }
      }

      const totalStock = mappedSizes.reduce((acc: number, s: any) => acc + Number(s.stock), 0);
      const isLowStock = totalStock > 0 && mappedSizes.some((s: any) => Number(s.stock) <= 10);
      const isOutOfStock = totalStock === 0;

      return {
        id: p.id,
        name: p.name,
        sku: meta.sku || `SKU-${p.id.substring(0, 4)}`,
        sizes: mappedSizes,
        totalStock,
        isLowStock,
        isOutOfStock,
        meta // keep meta to re-stringify later
      }
    });
    setInventory(parsedData);
    setLoading(false);
  }

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editedSizes, setEditedSizes] = useState<any[]>([]);

  const openModal = (id?: string) => {
    const productToUpdate = id ? inventory.find(p => p.id === id) : inventory[0];
    if (productToUpdate) {
      setSelectedProduct(productToUpdate);
      setEditedSizes([...productToUpdate.sizes]);
    }
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    const updatedMeta = { ...selectedProduct.meta, sizes: editedSizes };
    await updateProduct(selectedProduct.id, { description: JSON.stringify(updatedMeta) });
    setIsUpdateModalOpen(false);
    fetchInventory();
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStock = true;
    if (stockFilter === 'In Stock') matchesStock = !item.isOutOfStock && !item.isLowStock;
    if (stockFilter === 'Low Stock') matchesStock = item.isLowStock;
    if (stockFilter === 'Out of Stock') matchesStock = item.isOutOfStock;

    return matchesSearch && matchesStock;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStockFilter('All Items');
  };

  return (
    <div className="relative z-10 max-w-[1280px] mx-auto w-full">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">Loading inventory...</div>
      ) : (
        <>
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-forest-deep mb-2">Inventory Control</h2>
          <p className="text-on-surface-variant font-body-md max-w-2xl">
            Track your stock levels, manage warehouses, and set restocking alerts to ensure you never run out of Makhana.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => openModal()}
            className="bg-forest-deep text-white px-6 py-2.5 rounded-lg font-label-lg flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-md"
          >
            <Edit className="w-5 h-5" /> Update Stock
          </button>
        </div>
      </header>

      {/* Filters & Search Bento Card */}
      <div className="bg-surface-container-lowest rounded-xl p-6 mb-8 shadow-sm border border-outline-variant/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Search */}
          <div className="md:col-span-6 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-5 h-5" />
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-gold-accent outline-none transition-all font-body-md" placeholder="Search by Product Name or SKU..." type="text" />
          </div>
          {/* Filter Status */}
          <div className="md:col-span-5 flex items-center gap-3">
            <span className="font-label-lg text-on-surface-variant">Stock Level:</span>
            <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} className="flex-1 py-3 px-4 bg-surface-container-low border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-gold-accent outline-none font-body-md appearance-none">
              <option value="All Items">All Items</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
          {/* Clear */}
          <div className="md:col-span-1 flex justify-end">
            <button onClick={clearFilters} className="p-3 text-on-surface-variant hover:text-tertiary transition-colors" title="Clear Filters">
              <FilterX className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table Container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20">
                <th className="px-6 py-5 font-label-lg text-forest-deep">Product</th>
                <th className="px-6 py-5 font-label-lg text-forest-deep">SKU</th>
                <th className="px-6 py-5 font-label-lg text-forest-deep">Available Stock (Per Size)</th>
                <th className="px-6 py-5 font-label-lg text-forest-deep text-center">Status</th>
                <th className="px-6 py-5 font-label-lg text-forest-deep text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-on-surface-variant">No items found.</td>
                </tr>
              )}
              {filteredInventory.map(item => (
                <tr key={item.id} className={`transition-colors ${item.isOutOfStock ? 'bg-surface-container-high/30 hover:bg-surface-container-high/40' : item.isLowStock ? 'bg-error-container/10 hover:bg-error-container/20' : 'hover:bg-cream-bg'}`}>
                  <td className={`px-6 py-4 font-label-lg ${item.isOutOfStock ? 'text-on-surface-variant/70' : 'text-forest-deep'}`}>{item.name}</td>
                  <td className="px-6 py-4 font-body-md text-on-surface-variant">{item.sku}</td>
                  <td className="px-6 py-4 font-headline-md">
                    <div className="space-y-1">
                      {item.sizes.map((s: any, idx: number) => (
                        <div key={idx} className={`text-sm ${Number(s.stock) === 0 ? 'text-on-surface-variant' : Number(s.stock) <= 10 ? 'text-error' : 'text-forest-deep'}`}>
                          <span className="text-on-surface-variant mr-2">{s.size}:</span>{s.stock}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.isOutOfStock ? (
                      <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                        Out of Stock
                      </span>
                    ) : item.isLowStock ? (
                      <span className="bg-error-container text-error px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    ) : (
                      <span className="bg-secondary-container/50 text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModal(item.id)} className="text-primary-custom hover:underline font-label-sm">
                      {item.isLowStock || item.isOutOfStock ? 'Restock' : 'Adjust'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Stock Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-surface-container">
              <h3 className="font-headline-md text-forest-deep">Update Stock</h3>
              <button onClick={() => setIsUpdateModalOpen(false)} className="text-on-surface-variant hover:text-error transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateStock} className="p-6 space-y-4">
              <div>
                <label className="block font-label-sm text-on-surface-variant mb-1">Product</label>
                <select 
                  value={selectedProduct?.id || ''} 
                  onChange={e => {
                    const newId = e.target.value;
                    const prod = inventory.find(p => p.id === newId);
                    if(prod) {
                      setSelectedProduct(prod);
                      setEditedSizes([...prod.sizes]);
                    }
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant/30 focus:ring-2 focus:ring-primary-custom outline-none"
                >
                  {inventory.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-3">
                <label className="block font-label-sm text-on-surface-variant mb-1">Stock per Size</label>
                {editedSizes.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-cream-bg p-3 rounded-lg border border-outline-variant/10">
                    <span className="w-16 font-label-lg text-forest-deep">{s.size}</span>
                    <input 
                      required min="0" 
                      value={s.stock} 
                      onChange={e => {
                        const newSizes = [...editedSizes];
                        newSizes[idx].stock = e.target.value;
                        setEditedSizes(newSizes);
                      }} 
                      className="flex-1 px-4 py-2 rounded-lg border border-outline-variant/30 focus:ring-2 focus:ring-primary-custom outline-none" 
                      type="number" 
                    />
                  </div>
                ))}
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsUpdateModalOpen(false)} className="px-5 py-2 font-label-lg text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 font-label-lg bg-forest-deep text-white rounded-lg shadow-md hover:opacity-90 transition-all active:scale-95">Update</button>
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
