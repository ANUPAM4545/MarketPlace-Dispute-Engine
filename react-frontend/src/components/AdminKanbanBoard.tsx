import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { 
    AlertCircle, 
    FileText, 
    CheckCircle, 
    RefreshCcw, 
    Handshake, 
    TrendingUp, 
    DollarSign,
    AlertTriangle,
    ArrowRight
} from 'lucide-react';
import api from '../lib/api';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Dispute {
    id: number;
    status: string;
    category: string;
    description: string;
    created_at: string;
    is_suspicious?: boolean;
    order_amount?: number;
    product_name?: string;
}

const COLUMNS = [
    { id: 'OPEN', title: 'Open', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'UNDER_REVIEW', title: 'Under Review', icon: RefreshCcw, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'SELLER_RESPONDED', title: 'Seller Responded', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { id: 'RESOLVED', title: 'Resolved', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'REJECTED', title: 'Rejected', icon: Handshake, color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

export default function AdminKanbanBoard() {
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState('');
    const navigate = useNavigate();

    const fetchDisputes = async () => {
        try {
            const res = await api.get('/disputes/');
            setDisputes(res.data);
            setError('');
        } catch (err) {
            const e = err as any;
            setError(e.message || 'Failed to fetch disputes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDisputes();
    }, []);

    const onDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result;
        if (!destination || source.droppableId === destination.droppableId) return;

        const newStatus = destination.droppableId;
        const targetId = parseInt(draggableId);
        
        setDisputes(prev => 
            prev.map(d => (d.id === targetId ? { ...d, status: newStatus } : d))
        );

        try {
            await api.put(`/disputes/${targetId}/status`, { status: newStatus });
        } catch (err) {
            console.error('Failed to update status:', err);
            fetchDisputes();
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full"
            />
            <p className="text-gold-600 dark:text-gold-500 font-light tracking-widest uppercase text-sm animate-pulse">
                Synchronizing Board...
            </p>
        </div>
    );

    const groupedDisputes = COLUMNS.reduce((acc, col) => {
        acc[col.id] = disputes.filter(d => d.status === col.id);
        return acc;
    }, {} as Record<string, Dispute[]>);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-full flex flex-col p-2 lg:p-6 bg-transparent"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-light text-gray-900 dark:text-white flex items-center gap-3">
                        Dispute <span className="font-serif italic text-gold-600 dark:text-gold-500 font-medium">Orchestration</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage and resolve marketplace conflicts in real-time.</p>
                </div>
                
                <div className="flex items-center gap-6 bg-white dark:bg-appcard p-4 rounded-2xl border border-gray-100 dark:border-appborder shadow-sm">
                    <div className="flex items-center gap-3 pr-6 border-r border-gray-100 dark:border-appborder">
                        <div className="p-2 bg-blue-500/10 rounded-xl">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Total Volume</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                ${disputes.reduce((acc, d) => acc + (d.order_amount || 0), 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-xl">
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Active Disputes</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{disputes.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 md:gap-6 items-start h-[calc(100vh-320px)] min-h-[500px] pb-4 overflow-x-auto custom-scrollbar">
                    {COLUMNS.map((col) => (
                        <div key={col.id} className="flex-shrink-0 w-[280px] sm:w-[320px] flex flex-col h-full group/col">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <div className="flex items-center gap-2">
                                    <div className={clsx("p-1.5 rounded-lg", col.bg)}>
                                        <col.icon className={clsx("w-4 h-4", col.color)} />
                                    </div>
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm tracking-tight capitalize">
                                        {col.title}
                                    </h3>
                                </div>
                                <span className={clsx("text-xs font-bold px-2 py-0.5 rounded-full", col.bg, col.color)}>
                                    {groupedDisputes[col.id]?.length || 0}
                                </span>
                            </div>

                            <Droppable droppableId={col.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={clsx(
                                            "flex-1 p-2 rounded-2xl transition-all duration-300 border-2 border-dashed",
                                            snapshot.isDraggingOver 
                                                ? "bg-gold-500/5 border-gold-500/30 ring-4 ring-gold-500/5" 
                                                : "bg-gray-50/50 dark:bg-appcard/30 border-transparent group-hover/col:border-gray-200 dark:group-hover/col:border-appborder/50"
                                        )}
                                    >
                                        <div className="space-y-4 h-full overflow-y-auto no-scrollbar pb-2">
                                            <AnimatePresence>
                                                {groupedDisputes[col.id]?.map((dispute, index) => (
                                                    <Draggable key={dispute.id} draggableId={dispute.id.toString()} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                    userSelect: 'none'
                                                                }}
                                                            >
                                                                <motion.div
                                                                    layout
                                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                                    className={clsx(
                                                                        "group relative bg-white dark:bg-appcard p-5 rounded-2xl border transition-all duration-200",
                                                                        snapshot.isDragging 
                                                                            ? "shadow-2xl border-gold-500 scale-[1.02] z-50 ring-1 ring-gold-500/50" 
                                                                            : "shadow-sm border-gray-100 dark:border-appborder hover:border-gold-300 dark:hover:border-gold-500/40 hover:shadow-lg"
                                                                    )}
                                                                >
                                                                {/* Status indicator pill */}
                                                                <div className="flex justify-between items-start mb-3">
                                                                    <span className="text-[10px] font-black tracking-widest text-gray-400 dark:text-gray-600">
                                                                        #{dispute.id}
                                                                    </span>
                                                                    {dispute.is_suspicious && (
                                                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-rose-500/10 text-rose-500 rounded-md animate-pulse">
                                                                            <AlertTriangle className="w-3 h-3" />
                                                                            <span className="text-[10px] font-bold uppercase">Suspicious</span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                                                                    {dispute.category}
                                                                </h4>
                                                                
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed font-light">
                                                                    {dispute.description}
                                                                </p>

                                                                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-appborder/50">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex items-center gap-1 text-gold-600 dark:text-gold-500">
                                                                            <DollarSign className="w-3 h-3" />
                                                                            <span className="text-sm font-bold tracking-tight">
                                                                                {dispute.order_amount?.toLocaleString()}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => navigate(`/disputes/${dispute.id}`)}
                                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-appbg text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gold-500 hover:text-white transition-all text-[11px] font-bold"
                                                                    >
                                                                        Details
                                                                        <ArrowRight className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                                
                                                                {/* Hover overlay decorator */}
                                                                <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
                                                                </motion.div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            </AnimatePresence>
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </motion.div>
    );
}
