import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { AlertCircle, FileText, CheckCircle, RefreshCcw, Handshake } from 'lucide-react';
import api from '../lib/api';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

interface Dispute {
    id: number;
    status: string;
    category: string;
    description: string;
    created_at: string;
}

const COLUMNS = [
    { id: 'OPEN', title: 'Open', icon: AlertCircle, color: 'bg-gold-500/20 text-gold-600 dark:bg-gold-500/10 dark:text-gold-500' },
    { id: 'UNDER_REVIEW', title: 'Under Review', icon: RefreshCcw, color: 'bg-gold-500/20 text-gold-600 dark:bg-gold-500/10 dark:text-gold-500' },
    { id: 'SELLER_RESPONDED', title: 'Seller Responded', icon: FileText, color: 'bg-gold-500/20 text-gold-600 dark:bg-gold-500/10 dark:text-gold-500' },
    { id: 'RESOLVED', title: 'Resolved', icon: CheckCircle, color: 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
    { id: 'REJECTED', title: 'Rejected', icon: Handshake, color: 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
];

export default function AdminKanbanBoard() {
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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
        
        // Dropped outside a valid column
        if (!destination) return;
        
        // Dropped in the same column
        if (source.droppableId === destination.droppableId) return;

        const newStatus = destination.droppableId;
        const targetDispute = disputes.find(d => d.id.toString() === draggableId);
        
        if (!targetDispute) return;

        // Optimistic UI Update
        setDisputes(prev => 
            prev.map(d => (d.id.toString() === draggableId ? { ...d, status: newStatus } : d))
        );

        // API Call
        try {
            await api.put(`/disputes/${targetDispute.id}/status`, { status: newStatus });
        } catch (err) {
            console.error('Failed to update status:', err);
            // Revert on failure
            fetchDisputes();
            alert('Failed to update dispute status on the server.');
        }
    };

    if (loading) return <div className="text-center py-10 animate-pulse text-gold-600 dark:text-gold-500 font-light tracking-widest uppercase text-sm">Loading Kanban Board...</div>;
    if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

    const groupedDisputes = COLUMNS.reduce((acc, col) => {
        acc[col.id] = disputes.filter(d => d.status === col.id);
        return acc;
    }, {} as Record<string, Dispute[]>);

    return (
        <div className="w-full flex-1 overflow-x-auto p-4 lg:p-6 bg-white dark:bg-appbg rounded-xl border border-gray-100 dark:border-appborder transition-colors duration-200" style={{ minHeight: '600px'}}>
            <h2 className="text-2xl font-serif italic text-gray-900 dark:text-white mb-6 flex items-center tracking-wide">
                Dispute Management Board
                <span className="ml-4 text-sm font-sans font-medium px-3 py-1 bg-gold-50 dark:bg-gold-500/10 text-gold-700 dark:text-gold-500 rounded-full border border-gold-200 dark:border-gold-500/30">
                    {disputes.length} Disputes
                </span>
            </h2>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 items-start h-full pb-8">
                    {COLUMNS.map((col) => (
                        <div key={col.id} className="flex-shrink-0 w-[300px] flex flex-col bg-gray-50/50 dark:bg-appcard rounded-xl max-h-[75vh] overflow-hidden border border-gray-200 dark:border-appborder shadow-sm">
                            <div className="p-4 border-b border-gray-200 dark:border-appborder bg-white dark:bg-appcard/50">
                                <h3 className="flex justify-between items-center font-medium text-gray-800 dark:text-gray-200 tracking-wide text-sm uppercase">
                                    <span className="flex items-center gap-2">
                                        <col.icon className={clsx("w-5 h-5", col.color.split(' ')[1], col.color.split(' ')[3])} />
                                        {col.title}
                                    </span>
                                    <span className={clsx("text-xs font-bold px-2 py-1 rounded-full", col.color)}>
                                        {groupedDisputes[col.id]?.length || 0}
                                    </span>
                                </h3>
                            </div>

                            <Droppable droppableId={col.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={clsx(
                                            "flex-1 p-3 overflow-y-auto space-y-3 transition-colors duration-200 ease-in-out",
                                            snapshot.isDraggingOver ? "bg-gold-50 dark:bg-gold-500/5" : "bg-transparent"
                                        )}
                                        style={{ minHeight: "150px" }}
                                    >
                                        {groupedDisputes[col.id]?.map((dispute, index) => (
                                            <Draggable key={dispute.id} draggableId={dispute.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={() => navigate(`/disputes/${dispute.id}`)}
                                                        className={clsx(
                                                            "bg-white dark:bg-appbg p-4 rounded-lg shadow-sm border cursor-grab select-none group",
                                                            "transition-all duration-200 relative overflow-hidden",
                                                            snapshot.isDragging 
                                                                ? "border-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.2)] dark:border-gold-500 scale-105 z-50 ring-1 ring-gold-400/50" 
                                                                : "border-gray-200 dark:border-appborder hover:border-gold-300 dark:hover:border-gold-500/50 hover:shadow-md hover:-translate-y-0.5"
                                                        )}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                        }}
                                                    >
                                                        <div className="absolute top-0 left-0 w-1 h-full bg-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                                                                #{dispute.id}
                                                            </span>
                                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gold-50 text-gold-700 border border-gold-100 dark:bg-gold-500/10 dark:text-gold-400 dark:border-gold-500/20">
                                                                {dispute.category?.substring(0, 15)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 mt-1 font-light leading-relaxed">
                                                            {dispute.description}
                                                        </p>
                                                        <div className="mt-3 text-xs text-gray-400 dark:text-gray-500 font-light flex items-center">
                                                            {new Date(dispute.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
