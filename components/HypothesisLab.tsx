import React, { useState, useEffect } from 'react';
import { AppState, ScenarioModifiers, OptimizationResult } from '../types';
import { calculateScenarioBurden } from '../services/taxEngine';

interface LabProps {
    currentState: AppState;
}

const HypothesisLab: React.FC<LabProps> = ({ currentState }) => {
    const [modifiers, setModifiers] = useState<ScenarioModifiers>({
        forceFullTimeEmployee: false,
        forceDirectorSalaryIncrease: false,
        forceSafeHarbor: false,
        forceColdWallet: false
    });

    const [result, setResult] = useState<OptimizationResult | null>(null);

    useEffect(() => {
        const baseline = calculateScenarioBurden(currentState, {
            forceFullTimeEmployee: false,
            forceDirectorSalaryIncrease: false,
            forceSafeHarbor: false,
            forceColdWallet: false
        });

        const hypothesis = calculateScenarioBurden(currentState, modifiers);

        setResult({
            ...hypothesis,
            originalBurden: baseline.optimizedBurden,
            savings: baseline.optimizedBurden - hypothesis.optimizedBurden,
            details: {
                ...hypothesis.details,
                ip: { before: baseline.details.ip.after, after: hypothesis.details.ip.after },
                itsgf: { before: baseline.details.itsgf.after, after: hypothesis.details.itsgf.after },
                irpf: { before: baseline.details.irpf.after, after: hypothesis.details.irpf.after }
            }
        });

    }, [currentState, modifiers]);

    const toggleModifier = (key: keyof ScenarioModifiers) => {
        setModifiers(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!result) return <div className="p-8 text-center text-slate-500 font-serif">Calculando modelo econométrico...</div>;

    const netSavings = result.savings - result.details.operationalCost;

    return (
        <div className="space-y-8 animate-fade-in">
             <div className="bg-[#0f172a] text-white p-8 rounded shadow-lg border-t-4 border-[#b49b67]">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h2 className="text-2xl font-serif tracking-wide text-white mb-2">
                            Laboratorio de Optimización
                        </h2>
                        <p className="text-slate-400 text-sm font-light">
                            Simulación de impacto fiscal mediante reestructuración operativa.
                        </p>
                    </div>
                    <div className="flex items-center gap-6 bg-[#1e293b] p-6 rounded border border-slate-700">
                        <div className="text-right">
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Ahorro Fiscal Bruto</div>
                            <div className="text-xl font-mono text-emerald-400">{result.savings.toLocaleString()} €</div>
                        </div>
                        <div className="h-8 w-px bg-slate-600"></div>
                        <div className="text-right">
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Coste Implementación</div>
                            <div className="text-xl font-mono text-red-400">{result.details.operationalCost.toLocaleString()} €</div>
                        </div>
                        <div className="h-8 w-px bg-slate-600"></div>
                        <div className="text-right">
                            <div className="text-[10px] text-[#b49b67] uppercase tracking-widest font-bold mb-1">Impacto Neto (Año 1)</div>
                            <div className={`text-3xl font-mono font-bold ${netSavings > 0 ? 'text-white' : 'text-slate-400'}`}>
                                {netSavings > 0 ? '+' : ''}{netSavings.toLocaleString()} €
                            </div>
                        </div>
                    </div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. CONTROLS */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
                        <span className="text-lg">🛠️</span>
                        <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Palancas Operativas</h3>
                    </div>
                    
                    {[
                        { key: 'forceFullTimeEmployee', label: 'Contratar Empleado', desc: 'Sustancia Económica (+28k/año)' },
                        { key: 'forceDirectorSalaryIncrease', label: 'Ajuste Retributivo', desc: 'Cumplir regla del 50% (IP)' },
                        { key: 'forceColdWallet', label: 'Auto-Custodia Cripto', desc: 'Evitar Modelo 721' }
                    ].map((item) => (
                        <div 
                            key={item.key}
                            onClick={() => toggleModifier(item.key as keyof ScenarioModifiers)}
                            className={`p-5 rounded border cursor-pointer transition-all duration-300 group ${modifiers[item.key as keyof ScenarioModifiers] ? 'bg-[#0f172a] border-[#0f172a] shadow-lg transform -translate-y-1' : 'bg-white border-slate-200 hover:border-[#b49b67]'}`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className={`font-bold text-sm ${modifiers[item.key as keyof ScenarioModifiers] ? 'text-white' : 'text-slate-700'}`}>{item.label}</span>
                                <div className={`w-3 h-3 rounded-full border ${modifiers[item.key as keyof ScenarioModifiers] ? 'bg-[#b49b67] border-[#b49b67]' : 'bg-white border-slate-300'}`}></div>
                            </div>
                            <p className={`text-xs ${modifiers[item.key as keyof ScenarioModifiers] ? 'text-slate-400' : 'text-slate-500'}`}>
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* 2. VISUALIZATION */}
                <div className="lg:col-span-2 bg-white rounded shadow-sm border border-slate-200 p-8">
                    <h3 className="font-serif text-slate-800 text-lg mb-8 border-b border-slate-100 pb-4">
                        Proyección de Carga Tributaria
                    </h3>

                    <div className="grid grid-cols-2 gap-12 mb-8 items-end">
                        {/* BEFORE */}
                        <div className="text-center relative">
                            <div className="absolute -top-4 left-0 w-full text-center">
                                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Escenario Actual</span>
                            </div>
                            <div className="h-48 flex items-end justify-center gap-1 border-b border-slate-200 pb-2 px-8">
                                <div className="w-16 bg-slate-300 rounded-t relative group transition-all" style={{ height: `${(result.details.ip.before / (result.originalBurden || 1)) * 100}%` }}>
                                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100">IP</div>
                                </div>
                                <div className="w-16 bg-slate-400 rounded-t relative group transition-all" style={{ height: `${(result.details.itsgf.before / (result.originalBurden || 1)) * 100}%` }}>
                                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100">Solidaridad</div>
                                </div>
                            </div>
                            <div className="mt-4 font-mono font-bold text-slate-700 text-xl">{result.originalBurden.toLocaleString()} €</div>
                        </div>

                        {/* AFTER */}
                        <div className="text-center relative">
                            <div className="absolute -top-4 left-0 w-full text-center">
                                <span className="bg-[#b49b67] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">Optimizado</span>
                            </div>
                            <div className="h-48 flex items-end justify-center gap-1 border-b border-slate-200 pb-2 px-8">
                                <div className="w-16 bg-emerald-600 rounded-t relative group transition-all" style={{ height: `${Math.max(2, (result.details.ip.after / (result.originalBurden || 1)) * 100)}%` }}>
                                </div>
                                <div className="w-16 bg-emerald-400 rounded-t relative group transition-all" style={{ height: `${Math.max(2, (result.details.itsgf.after / (result.originalBurden || 1)) * 100)}%` }}>
                                </div>
                            </div>
                            <div className="mt-4 font-mono font-bold text-emerald-600 text-xl">{result.optimizedBurden.toLocaleString()} €</div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded border-l-4 border-slate-300 text-sm text-slate-600 font-serif leading-relaxed">
                        <strong className="text-slate-900 block mb-2 uppercase tracking-wide text-xs">Análisis Técnico</strong>
                        {result.originalBurden > result.optimizedBurden ? (
                            <p>
                                La reestructuración permite recuperar la exención plena en el Impuesto sobre el Patrimonio y elimina la sujeción al Impuesto de Solidaridad de Grandes Fortunas (ITSGF), compensando el coste de implementación.
                            </p>
                        ) : (
                            <p>
                                La estructura actual ya se encuentra en un punto óptimo de eficiencia fiscal o el coste de las medidas correctoras supera el ahorro tributario potencial.
                            </p>
                        )}
                    </div>
                </div>
             </div>
        </div>
    );
};

export default HypothesisLab;