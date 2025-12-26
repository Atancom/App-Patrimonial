import React, { useState } from 'react';
import { LEGAL_DB, DOCUMENTS_DB, searchLaws, getLawsByCategory } from '../services/legalDatabase';
import { LawCategory, LegalArticle, LegalDocument } from '../types';
import { Icons } from './Icons';

const RegulatoryLibrary: React.FC = () => {
    const [viewMode, setViewMode] = useState<'DOCS' | 'RULES'>('DOCS');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<LawCategory | 'ALL'>('ALL');
    const [selectedArticle, setSelectedArticle] = useState<LegalArticle | null>(null);
    const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);

    const getCount = (cat: LawCategory | 'ALL') => {
        if (cat === 'ALL') return LEGAL_DB.length;
        return LEGAL_DB.filter(l => l.category === cat).length;
    };

    const categories: {id: LawCategory | 'ALL', label: string}[] = [
        { id: 'ALL', label: 'Todo' },
        { id: 'CIVIL_CAT', label: 'Civil Cataluña (Libro I)' },
        { id: 'ISD_CAT', label: 'Sucesiones (Cat)' },
        { id: 'ISD_ESTATAL', label: 'Sucesiones (Estatal)' },
        { id: 'IP_ESTATAL', label: 'Patrimonio (Ley 19/1991)' },
        { id: 'ITSGF', label: 'Solidaridad (3M+)' },
        { id: 'IRPF', label: 'IRPF / Pactos' },
    ];

    const displayedLaws = searchTerm 
        ? searchLaws(searchTerm)
        : activeCategory === 'ALL' 
            ? LEGAL_DB 
            : getLawsByCategory(activeCategory);

    const handleDocumentToggle = (doc: LegalDocument) => {
        setSelectedDocument(selectedDocument?.id === doc.id ? null : doc);
    };

    return (
        <div className="flex flex-col h-full space-y-6 animate-fade-in pb-12">
            {/* Cabecera */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-serif text-slate-900">Repositorio Normativo</h2>
                        <p className="text-sm text-slate-500 font-medium mt-1">Consulta la base legal consolidada para Cataluña 2025.</p>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button 
                            onClick={() => setViewMode('DOCS')}
                            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'DOCS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Leyes Completas
                        </button>
                        <button 
                            onClick={() => setViewMode('RULES')}
                            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'RULES' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Buscador de Artículos
                        </button>
                    </div>
                </div>

                {viewMode === 'RULES' && (
                    <div className="relative max-w-xl">
                        <input 
                            type="text" 
                            placeholder="Buscar por artículo, término o etiqueta (ej: 'Legítima')..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#b49b67] focus:border-transparent outline-none transition-all"
                        />
                        <span className="absolute left-4 top-3.5 text-slate-400">
                            <Icons.Search />
                        </span>
                    </div>
                )}
            </div>

            {viewMode === 'DOCS' ? (
                /* VISTA DE DOCUMENTOS COMPLETOS */
                <div className="max-w-5xl mx-auto w-full space-y-8 px-4">
                    {DOCUMENTS_DB.map(doc => {
                        const isOpen = selectedDocument?.id === doc.id;
                        return (
                            <div key={doc.id} className={`bg-white rounded-2xl border transition-all duration-700 ${isOpen ? 'shadow-2xl border-slate-900 ring-1 ring-slate-900/5' : 'shadow-sm border-slate-200 hover:border-[#b49b67]'}`}>
                                <button 
                                    onClick={() => handleDocumentToggle(doc)}
                                    className={`w-full text-left p-10 flex justify-between items-center transition-all ${isOpen ? 'bg-slate-900 text-white rounded-t-2xl' : 'bg-white text-slate-800 hover:bg-slate-50 rounded-2xl'}`}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className={`p-4 rounded-xl ${isOpen ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            <Icons.Laws />
                                        </div>
                                        <div>
                                            <div className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${isOpen ? 'text-[#b49b67]' : 'text-slate-500'}`}>
                                                {doc.source} • ACTUALIZACIÓN {doc.lastUpdated}
                                            </div>
                                            <h3 className={`text-2xl font-serif font-bold ${isOpen ? 'text-white' : 'text-slate-900'}`}>
                                                {doc.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className={`text-3xl font-light transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
                                        {isOpen ? '−' : '+'}
                                    </div>
                                </button>

                                {isOpen && (
                                    <div className="p-12 md:p-20 bg-white border-t border-slate-100 animate-fade-in max-h-[1200px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                                        <div className="prose prose-slate max-w-none font-serif text-lg leading-[2.2] text-slate-800 text-justify whitespace-pre-line">
                                            {/* Renderizado de Markdown Simple */}
                                            {doc.fullText.split('\n').map((line, i) => {
                                                if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-bold text-slate-900 mb-10 border-b-2 border-slate-100 pb-4 mt-8">{line.replace('# ', '')}</h1>;
                                                if (line.startsWith('## ')) return <h2 key={i} className="text-3xl font-bold text-slate-800 mb-8 mt-12 bg-slate-50 p-4 rounded-lg">{line.replace('## ', '')}</h2>;
                                                if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-slate-700 mb-6 mt-10 uppercase tracking-wider border-l-4 border-[#b49b67] pl-4">{line.replace('### ', '')}</h3>;
                                                if (line.includes('**')) {
                                                    const parts = line.split('**');
                                                    return <p key={i} className="mb-6">{parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-slate-950">{p}</strong> : p)}</p>;
                                                }
                                                return <p key={i} className="mb-6">{line}</p>;
                                            })}
                                        </div>
                                        <div className="mt-20 pt-10 border-t border-slate-100 flex justify-center">
                                            <button 
                                                onClick={() => {
                                                    setSelectedDocument(null);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className="px-12 py-4 bg-slate-900 text-white text-xs font-bold uppercase tracking-[0.3em] rounded-full hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1"
                                            >
                                                Cerrar y Volver al Índice ↑
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* VISTA DE REGLAS ATÓMICAS */
                <div className="flex gap-8 h-[700px]">
                    <div className="w-80 shrink-0 flex flex-col gap-2 pr-2 overflow-y-auto">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => { setActiveCategory(cat.id); setSearchTerm(''); }}
                                className={`flex justify-between items-center px-6 py-5 rounded-xl transition-all text-left ${activeCategory === cat.id ? 'bg-slate-900 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:bg-white hover:text-slate-800 border border-transparent hover:border-slate-200'}`}
                            >
                                <span className="text-[11px] font-bold uppercase tracking-widest">{cat.label}</span>
                                <span className={`text-[10px] font-mono py-1 px-3 rounded-full ${activeCategory === cat.id ? 'bg-[#b49b67] text-slate-900' : 'bg-slate-200 text-slate-500'}`}>
                                    {getCount(cat.id)}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {displayedLaws.map(law => (
                            <div 
                                key={law.id} 
                                onClick={() => setSelectedArticle(law)}
                                className={`p-8 rounded-2xl border cursor-pointer transition-all hover:shadow-xl ${selectedArticle?.id === law.id ? 'border-slate-900 bg-white ring-2 ring-slate-100 shadow-lg' : 'border-slate-200 bg-white'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                        {law.code}
                                    </span>
                                    {law.relevance === 'CRITICAL' && (
                                        <span className="text-[9px] bg-rose-950 text-white px-3 py-1.5 rounded-full font-bold uppercase tracking-tighter">Impacto Crítico</span>
                                    )}
                                </div>
                                <h3 className="font-serif font-bold text-slate-900 text-xl mb-4">{law.title}</h3>
                                <p className="text-base text-slate-600 line-clamp-2 leading-relaxed font-light">{law.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="w-[450px] bg-white border border-slate-200 rounded-2xl p-10 overflow-y-auto shadow-sm sticky top-0 h-full">
                        {selectedArticle ? (
                            <div className="space-y-10 animate-fade-in">
                                <div className="border-b border-slate-100 pb-8">
                                    <span className="text-[10px] font-bold text-[#b49b67] uppercase tracking-[0.3em]">{selectedArticle.category}</span>
                                    <h2 className="text-3xl font-bold text-slate-900 mt-4 font-serif">{selectedArticle.code}</h2>
                                    <h3 className="text-base font-medium text-slate-500 mt-2 italic leading-relaxed">{selectedArticle.title}</h3>
                                </div>
                                <div className="bg-slate-50 p-10 rounded-2xl border border-slate-100 font-serif text-lg leading-loose text-slate-800 text-justify relative shadow-inner">
                                    <span className="absolute -top-6 -left-4 text-8xl text-slate-200/50 font-serif select-none italic">"</span>
                                    {selectedArticle.text}
                                </div>
                                <div className="space-y-4">
                                    <strong className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold block">Palabras Clave:</strong>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedArticle.tags.map(tag => (
                                            <span key={tag} className="text-[11px] font-bold bg-white text-slate-700 px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:border-[#b49b67] transition-colors">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-200 text-center">
                                <span className="text-9xl mb-8 opacity-20">⚖️</span>
                                <p className="text-[11px] font-bold uppercase tracking-[0.4em] leading-loose text-slate-400 max-w-[200px]">
                                    Selecciona un precepto para auditar su literalidad
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegulatoryLibrary;
