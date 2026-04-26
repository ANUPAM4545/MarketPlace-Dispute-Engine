import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../lib/api";
import { ShoppingCart, Tag, User, Box, X, Info, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    seller_name: string;
    image_url?: string;
    average_rating?: number;
    review_count?: number;
}

interface Review {
    id: number;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

interface ProductCatalogProps {
    onOrderPlaced?: () => void;
}

export default function ProductCatalog({ onOrderPlaced }: ProductCatalogProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [buyingId, setBuyingId] = useState<number | null>(null);
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productReviews, setProductReviews] = useState<Review[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get("search") || "";

    const handleProductSelect = async (product: Product) => {
        setSelectedProduct(product);
        setReviewsLoading(true);
        try {
            const res = await api.get(`/products/${product.id}/reviews`);
            setProductReviews(res.data);
        } catch (err) {
            console.error("Failed to fetch reviews", err);
        } finally {
            setReviewsLoading(false);
        }
    };

    useEffect(() => {
        api.get("/products/").then(res => {
            setProducts(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const handleQuantityChange = (productId: number, val: number, max: number) => {
        let newQty = val;
        if (newQty > max) newQty = max;
        if (newQty < 1) newQty = 1;
        setQuantities(prev => ({...prev, [productId]: newQty}));
    };

    const handleBuy = async (productId: number) => {
        setBuyingId(productId);
        const qty = quantities[productId] || 1;
        try {
            await api.post("/orders/", { product_id: productId, quantity: qty });
            toast.success("Order placed successfully!");
            if (onOrderPlaced) onOrderPlaced();
        } catch (err: any) {
            toast.error(err.response?.data?.msg || "Failed to place order");
        } finally {
            setBuyingId(null);
            setSelectedProduct(null); // Close modal on successful buy
        }
    };

    const filteredProducts = useMemo(() => {
        if (!searchQuery) return products;
        return products.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [products, searchQuery]);

    if (loading) return <div className="p-8 text-center text-gray-500 font-light italic">Gathering marketplace data...</div>;

    return (
        <div className="space-y-6">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                <motion.div 
                    key={product.id}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-appcard rounded-2xl border border-gray-100 dark:border-appborder/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                    <div className="h-48 w-full bg-gray-100 dark:bg-appbg relative overflow-hidden group cursor-pointer" onClick={() => handleProductSelect(product)}>
                        {product.image_url ? (
                            <img 
                                src={product.image_url.startsWith('http') ? product.image_url : `${api.defaults.baseURL?.replace('/api', '')}${product.image_url}`} 
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Box className="w-12 h-12" />
                            </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-appbg/90 backdrop-blur-md px-3 py-1 rounded-lg text-lg font-bold text-gray-900 dark:text-gold-500 shadow-sm pointer-events-none">
                            ${product.price.toFixed(2)}
                        </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gold-500 mb-2 tracking-tight cursor-pointer hover:underline" onClick={() => handleProductSelect(product)}>
                                {product.name}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                                {product.description}
                            </p>
                            
                            {product.review_count !== undefined && product.review_count > 0 && (
                                <div className="flex items-center gap-1.5 mb-4">
                                    <span className="text-gold-500 text-sm">★</span>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{product.average_rating}</span>
                                    <span className="text-xs text-gray-400 font-light">({product.review_count} reviews)</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 mb-6">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                <User className="w-3.5 h-3.5" />
                                Seller: <span className="text-gray-600 dark:text-gray-300">{product.seller_name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                <Tag className="w-3.5 h-3.5" />
                                Stock: <span className={product.stock > 0 ? "text-green-500" : "text-red-500"}>
                                    {product.stock > 0 ? `${product.stock} units available` : "Out of Stock"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Qty</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max={product.stock}
                                    value={quantities[product.id] || 1}
                                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1, product.stock)}
                                    disabled={product.stock <= 0}
                                    className="w-full bg-gray-50 dark:bg-appbg border border-gray-200 dark:border-appborder rounded-lg py-2 px-3 text-sm text-gray-900 dark:text-white disabled:opacity-50"
                                />
                            </div>
                            <button
                                onClick={() => handleBuy(product.id)}
                                disabled={buyingId === product.id || product.stock <= 0}
                                className={`flex-[2] flex items-center justify-center gap-2 py-3 mt-5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                                    product.stock > 0 
                                        ? "bg-gold-600 dark:bg-gold-500 text-white dark:text-black hover:bg-gold-700 dark:hover:bg-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.2)]" 
                                        : "bg-gray-100 dark:bg-appbg text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                <ShoppingCart className="w-4 h-4" />
                                {buyingId === product.id ? "Processing..." : "Checkout"}
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
            
            {filteredProducts.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                    {searchQuery ? (
                        <>
                            <div className="w-20 h-20 bg-gray-50 dark:bg-appcard rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-appborder/50">
                        <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">No items match your search</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">Try checking your spelling or using more general keywords.</p>
                    <button 
                        onClick={() => {
                            searchParams.delete("search");
                            setSearchParams(searchParams);
                        }}
                        className="mt-6 px-6 py-2 bg-gray-900 dark:bg-gold-500 text-white dark:text-black rounded-lg text-sm font-bold"
                    >
                        Reset Search
                    </button>
                        </>
                    ) : (
                        <div className="py-12 text-center text-gray-500 dark:text-gray-400 font-light italic">
                            The catalog is currently empty.
                        </div>
                    )}
                </div>
            ) : null}
        </div>

        
            {/* Product Details Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setSelectedProduct(null)}
                        />
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl bg-white dark:bg-appbg rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[90vh] md:h-auto"
                        >
                            <button 
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-md"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Modal Image Section */}
                            <div className="w-full md:w-1/2 h-64 md:h-[600px] bg-gray-100 dark:bg-appcard relative flex-shrink-0">
                                {selectedProduct.image_url ? (
                                    <img 
                                        src={selectedProduct.image_url.startsWith('http') ? selectedProduct.image_url : `${api.defaults.baseURL?.replace('/api', '')}${selectedProduct.image_url}`} 
                                        alt={selectedProduct.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Box className="w-24 h-24" />
                                    </div>
                                )}
                            </div>

                            {/* Modal Details Section */}
                            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                            {selectedProduct.name}
                                        </h2>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-appborder">
                                        <div className="text-2xl md:text-3xl font-light text-gold-600 dark:text-gold-500">
                                            ${selectedProduct.price.toFixed(2)}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 border-l border-gray-200 dark:border-appborder pl-4">
                                            <User className="w-4 h-4" />
                                            <span className="truncate max-w-[100px] md:max-w-none">Sold by {selectedProduct.seller_name}</span>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Info className="w-4 h-4 text-gold-500" />
                                            Description
                                        </h4>
                                        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed bg-gray-50 dark:bg-appcard p-4 rounded-xl border border-gray-100 dark:border-appborder/50">
                                            {selectedProduct.description}
                                        </div>
                                    </div>

                                    {/* Reviews Section */}
                                    <div className="mb-8">
                                        <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-3">
                                            Customer Reviews ({productReviews.length})
                                        </h4>
                                        {reviewsLoading ? (
                                            <p className="text-sm text-gray-500">Loading reviews...</p>
                                        ) : productReviews.length === 0 ? (
                                            <p className="text-sm text-gray-500 italic">No reviews yet.</p>
                                        ) : (
                                            <div className="space-y-4">
                                                {productReviews.map(review => (
                                                    <div key={review.id} className="bg-gray-50 dark:bg-appcard p-4 rounded-xl border border-gray-100 dark:border-appborder/50">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-semibold text-sm text-gray-900 dark:text-white">{review.user_name}</span>
                                                            <div className="flex gap-0.5">
                                                                {[1, 2, 3, 4, 5].map(star => (
                                                                    <span key={star} className={`text-[10px] ${star <= review.rating ? 'text-gold-500' : 'text-gray-300 dark:text-gray-600'}`}>★</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        {review.comment && (
                                                            <p className="text-xs text-gray-600 dark:text-gray-300 font-light">{review.comment}</p>
                                                        )}
                                                        <p className="text-[10px] text-gray-400 mt-2">
                                                            {new Date(review.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Modal Footer (Sticky-like on mobile) */}
                                <div className="mt-auto pt-6 border-t border-gray-200 dark:border-appborder bg-white dark:bg-appbg sticky bottom-0 z-10 -mx-6 -mb-6 p-6 md:static md:m-0 md:p-0">
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-4">
                                        <Tag className="w-4 h-4" />
                                        Availability: <span className={selectedProduct.stock > 0 ? "text-green-500" : "text-red-500"}>
                                            {selectedProduct.stock > 0 ? `${selectedProduct.stock} units in stock` : "Out of Stock"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="w-20 md:w-32">
                                            <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1">Qty</label>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                max={selectedProduct.stock}
                                                value={quantities[selectedProduct.id] || 1}
                                                onChange={(e) => handleQuantityChange(selectedProduct.id, parseInt(e.target.value) || 1, selectedProduct.stock)}
                                                disabled={selectedProduct.stock <= 0}
                                                className="w-full bg-gray-50 dark:bg-appcard border border-gray-200 dark:border-appborder rounded-xl py-2 md:py-3 px-3 md:px-4 text-sm md:text-base text-gray-900 dark:text-white disabled:opacity-50"
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleBuy(selectedProduct.id)}
                                            disabled={buyingId === selectedProduct.id || selectedProduct.stock <= 0}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 md:py-4 mt-5 md:mt-0 rounded-xl font-bold text-sm md:text-base transition-all active:scale-95 ${
                                                selectedProduct.stock > 0 
                                                    ? "bg-gold-600 dark:bg-gold-500 text-white dark:text-black hover:bg-gold-700 dark:hover:bg-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.3)]" 
                                                    : "bg-gray-100 dark:bg-appbg text-gray-400 cursor-not-allowed"
                                            }`}
                                        >
                                            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                                            {buyingId === selectedProduct.id ? "Processing..." : "Buy Now"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
