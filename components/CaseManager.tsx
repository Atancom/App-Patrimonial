import React, { useEffect, useState } from 'react';
import { SavedCase } from '../types';
import { loadCases, deleteCase, formatDate } from '../services/storageService';
import { Icons } from './Icons';

interface CaseManagerProps {
    onLoadCase: (savedCase: SavedCase) => void;
}

const CaseManager: React.FC<CaseManagerProps> = ({ onLoadCase }) => {
    const [cases, setCases] = useState<SavedCase[]>([]);

    useEffect(() => {
        setCases(loadCases());
    }, []);

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("¿Seguro que deseas eliminar este Expediente Fiscal? Esta acción no se puede deshacer.")) {
            deleteCase(id);
            setCases(loadCases());
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Icons.Cases /> Expedientes Digitales (Digital Twins)
                <span className="text-xs font-normal text-slate-500 ml-2">Memoria Histórica</span>
            </h2>

            {cases.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                    <div className="text-4xl mb-3 opacity-20 text-slate-400">
                        <Icons.Save />
                    </div>
                    <h3 className="text-slate-600 font-medium">No hay expedientes guardados</h3>
                    <p className="text-sm text-slate-400 mt-1">Guarda una "Foto" del estado actual desde la barra lateral.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cases.map((c) => (
                        <div 
                            key={c.id} 
                            className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer group"
                            onClick={() => onLoadCase(c)}
                        >
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-[#0f172a] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                                        Snapshot
                                    </span>
                                    <button 
                                        onClick={(e) => handleDelete(c.id, e)}
                                        className="text-slate-300 hover:text-rose-700 transition-colors p-1"
                                        title="Eliminar expediente"
                                    >
                                        <span className="text-lg">×</span>
                                    </button>
                                </div>
                                <h4 className="font-bold text-slate-800 text-lg mb-1">{c.clientName}</h4>
                                <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[40px] font-light">{c.description}</p>
                                
                                <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-slate-100 pt-3 mt-2">
                                    <span>📅 {formatDate(c.timestamp)}</span>
                                </div>
                            </div>
                            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center rounded-b-xl">
                                <span className="text-xs font-semibold text-slate-500">
                                    {c.state.assets.length} Activos • {c.state.companies.length} Sociedades
                                </span>
                                <span className="text-[#b49b67] text-xs font-bold uppercase tracking-wide group-hover:underline">
                                    Abrir Caso →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CaseManager;