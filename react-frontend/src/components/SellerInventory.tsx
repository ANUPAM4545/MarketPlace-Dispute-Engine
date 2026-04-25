import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Trash2, Package, Info, DollarSign, Database, Edit2, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/api";
import { toast } from "react-hot-toast";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url?: string;
}

export default function SellerInventory() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", stock: "10" });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get("search") || "";

    const fetchMyProducts = async () => {
        try {
            const res = await api.get("/products/");
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('description', newProduct.description);
        formData.append('price', newProduct.price);
        formData.append('stock', newProduct.stock);
        if (imageFile) formData.append('image', imageFile);

        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post("/products/", formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            handleCancelForm();
            fetchMyProducts();
            toast.success(editingId ? "Product updated successfully" : "Product listed successfully");
        } catch (err: any) {
            toast.error(err.response?.data?.msg || "Failed to list/update product");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (product: Product) => {
        setNewProduct({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            stock: product.stock.toString()
        });
        setEditingId(product.id);
        setImageFile(null);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingId(null);
        setNewProduct({ name: "", description: "", price: "", stock: "10" });
        setImageFile(null);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to remove this listing?")) return;
        try {
            await api.delete(`/products/${id}`);
            fetchMyProducts();
            toast.success("Product deleted");
        } catch (err: any) {
            toast.error(err.response?.data?.msg || "Failed to delete");
        }
    };

    const filteredProducts = useMemo(() => {
        if (!searchQuery) return products;
        return products.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [products, searchQuery]);

    if (loading) return <div className="p-8 text-center text-gray-500 font-light">Loading inventory...</div>;

    return (
        <div className="space-y-8">
            <AnimatePresence>
                {searchQuery && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between p-4 bg-gold-500/5 border border-gold-500/20 rounded-xl mb-6"
                    >
                        <div className="flex items-center gap-3">
                            <Search className="w-4 h-4 text-gold-600" />
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Showing results for "<span className="text-gold-600 font-bold">{searchQuery}</span>" 
                                <span className="ml-2 text-xs text-gray-400 font-normal">({filteredProducts.length} items found)</span>
                            </p>
                        </div>
                        <button 
                            onClick={() => {
                                searchParams.delete("search");
                                setSearchParams(searchParams);
                            }}
                            className="flex items-center gap-1.5 text-xs font-bold text-gold-600 hover:text-gold-700 uppercase"
                        >
                            <X className="w-3.5 h-3.5" />
                            Clear Search
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-between items-center">
                <h3 className="text-xl font-serif italic text-gray-800 dark:text-white font-medium">Your Active Listings</h3>
                <button
                    onClick={() => showForm ? handleCancelForm() : setShowForm(true)}
                    className="flex items-center gap-2 bg-gold-600 dark:bg-gold-500 text-white dark:text-black px-4 py-2 rounded-xl font-bold text-sm hover:bg-gold-700 dark:hover:bg-gold-400 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                >
                    {showForm ? "Cancel" : <><Plus className="w-4 h-4" /> List New Product</>}
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-white dark:bg-appcard rounded-2xl p-8 border border-gold-200/50 dark:border-gold-500/20 shadow-xl overflow-hidden"
                    >
                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Package className="w-3.5 h-3.5" /> Product Name
                                </label>
                                <input 
                                    type="text" required placeholder="e.g. Professional Camera Drone"
                                    className="w-full bg-gray-50 dark:bg-appbg border-none rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 transition-all"
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Info className="w-3.5 h-3.5" /> Description
                                </label>
                                <textarea 
                                    required placeholder="Describe your product in detail..."
                                    className="w-full bg-gray-50 dark:bg-appbg border-none rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 transition-all h-24 resize-none"
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <DollarSign className="w-3.5 h-3.5" /> Price ($)
                                </label>
                                <input 
                                    type="number" required step="0.01" min="0.01"
                                    className="w-full bg-gray-50 dark:bg-appbg border-none rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 transition-all"
                                    value={newProduct.price}
                                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Database className="w-3.5 h-3.5" /> Stock Quantity
                                </label>
                                <input 
                                    type="number" required min="1"
                                    className="w-full bg-gray-50 dark:bg-appbg border-none rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 transition-all"
                                    value={newProduct.stock}
                                    onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    Product Image
                                </label>
                                <input 
                                    type="file" accept="image/*"
                                    className="w-full bg-gray-50 dark:bg-appbg border-none rounded-xl py-3 px-4 text-gray-500 dark:text-gray-400 focus:ring-2 focus:ring-gold-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold-50 file:text-gold-700 hover:file:bg-gold-100"
                                    onChange={e => setImageFile(e.target.files?.[0] || null)}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <button
                                    type="submit" disabled={submitting}
                                    className="w-full bg-gray-900 dark:bg-gold-500 text-white dark:text-black py-4 rounded-xl font-bold shadow-lg hover:bg-black dark:hover:bg-gold-400 transition-all active:scale-[0.99]"
                                >
                                    {submitting ? (editingId ? "Saving..." : "Publishing...") : (editingId ? "Save Changes" : "Publish Listing")}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                        {searchQuery ? (
                            <>
                                <div className="w-20 h-20 bg-gray-50 dark:bg-appcard rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-appborder/50">
                                    <Search className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">No listings match your search</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">Try a different keyword or clear your search filter.</p>
                                <button 
                                    onClick={() => {
                                        searchParams.delete("search");
                                        setSearchParams(searchParams);
                                    }}
                                    className="mt-6 px-6 py-2 bg-gray-900 dark:bg-gold-500 text-white dark:text-black rounded-lg text-sm font-bold"
                                >
                                    Reset Filter
                                </button>
                            </>
                        ) : (
                            <div className="py-12 text-center text-gray-500 dark:text-gray-400 font-light border-2 border-dashed border-gray-100 dark:border-appborder/30 rounded-2xl">
                                You haven't listed any products yet.
                            </div>
                        )}
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white dark:bg-appcard rounded-2xl border border-gray-100 dark:border-appborder/50 shadow-sm flex flex-col justify-between overflow-hidden">
                            {/* Product Image Section */}
                            <div className="h-48 w-full bg-gray-100 dark:bg-appbg/50 border-b border-gray-100 dark:border-appborder/50 flex items-center justify-center relative overflow-hidden">
                                {product.image_url ? (
                                    <img 
                                        src={`http://127.0.0.1:5001${product.image_url}`} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-appbg dark:to-appcard/50">
                                        <Package className="w-12 h-12 text-gray-300 dark:text-gray-600/50" />
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-gold-500">{product.name}</h4>
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => handleEdit(product)}
                                                className="text-gray-300 hover:text-gold-500 transition-colors"
                                                title="Edit Listing"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product.id)}
                                                className="text-gray-300 hover:text-red-500 transition-colors"
                                                title="Delete Listing"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                                    <div className="flex justify-between items-center text-sm font-medium">
                                        <span className="text-gray-400 uppercase tracking-tighter text-xs">Stock: {product.stock}</span>
                                        <span className="text-gray-900 dark:text-white font-bold">${product.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
