import React, { useState, useEffect } from 'react';
import { Asset, Heir, SimulationResult, AssetType } from '../types';
import { runComparativeSimulation } from '../services/taxEngine';
import { Icons } from './Icons';

interface SimulatorProps {
    assets: Asset[];
}

const SuccessionSimulator: React.FC<SimulatorProps> = ({ assets }) => {
    const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || '');
    const [selectedHeirRelation, setSelectedHeirRelation] = useState<'CHILD_O21' | 'SPOUSE'>('CHILD_O21');
    const [simulation, setSimulation] = useState<SimulationResult | null>(null);

    useEffect(() => {
        const asset = assets.find(a => a.id === selectedAssetId);
        if (asset) {
            // Create mock heir based on selection
            const heir: Heir = {
                id: 'mock', name: 'Beneficiario', 
                relation: selectedHeirRelation, 
                age: selectedHeirRelation === 'SPOUSE' ? 70 : 40,
                preExistingWealth: 0,
                role: 'HEIR'
            };
            const result = runComparativeSimulation(asset, heir);
            setSimulation(result);
        }
    }, [selectedAssetId, selectedHeirRelation, assets]);

    if (!simulation) return <div>Cargando simulador...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-4">
                <Icons.Simulator /> Matriz de Escenarios "What-If" (Cataluña 2025)
            </h3>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Activo a Analizar</label>
                    <select 
                        value={selectedAssetId} 
                        onChange={(e) => setSelectedAssetId(e.target.value)}
                        className="w-full border border-slate-300 rounded p-2 text-sm bg-white"
                    >
                        {assets.map(a => (
                            <option key={a.id} value={a.id}>{a.name} ({a.marketValue.toLocaleString()}€)</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Beneficiario</label>
                    <select 
                        value={selectedHeirRelation} 
                        onChange={(e) => setSelectedHeirRelation(e.target.value as any)}
                        className="w-full border border-slate-300 rounded p-2 text-sm bg-white"
                    >
                        <option value="CHILD_O21">Hijo (&gt;21 años)</option>
                        <option value="SPOUSE">Cónyuge</option>
                    </select>
                </div>
            </div>

            {/* Matrix Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {simulation.scenarios.map((sc) => {
                    const isRecommended = simulation.recommendedScenario === sc.type;
                    return (
                        <div key={sc.type} className={`relative border rounded-xl p-4 transition-all ${isRecommended ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-200' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                            {isRecommended && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                                    Opción Óptima
                                </div>
                            )}
                            <h4 className="text-center font-bold text-slate-700 mb-2 uppercase text-xs tracking-wide">
                                {sc.type === 'DONATION' ? 'Donación (Vida)' : 
                                 sc.type === 'INHERITANCE' ? 'Herencia (Futuro)' : 'Pacto Sucesorio'}
                            </h4>
                            
                            <div className="text-center mb-4">
                                <span className="text-2xl font-serif font-bold text-slate-800">{sc.totalCost.toLocaleString()}€</span>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Coste Fiscal Total</p>
                            </div>

                            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">ISD:</span>
                                    <span className="font-mono text-slate-700">{sc.taxes.isd.toLocaleString()}€</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">IRPF (Donante):</span>
                                    <span className="font-mono font-bold text-yellow-800">{sc.taxes.irpf_donor.toLocaleString()}€</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Plusvalía Muni:</span>
                                    <span className="font-mono text-indigo-700">{sc.taxes.iivtnu.toLocaleString()}€</span>
                                </div>
                            </div>

                            {/* Details List */}
                            <ul className="mt-4 space-y-1">
                                {sc.details.map((detail, idx) => (
                                    <li key={idx} className="text-[10px] text-slate-500 flex items-start gap-1">
                                        <span className="text-slate-300">•</span> {detail}
                                    </li>
                                ))}
                            </ul>

                            {sc.warnings.length > 0 && (
                                <div className="mt-3 bg-rose-50 border border-rose-100 text-rose-800 p-2 rounded text-[10px] font-medium leading-tight">
                                    ⚠️ {sc.warnings[0]}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Analysis Box */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-600">
                <h5 className="font-bold text-slate-800 mb-2 flex items-center gap-2 uppercase text-xs tracking-wide">
                    <Icons.AI /> Inteligencia Fiscal
                </h5>
                <p className="opacity-90 font-light leading-relaxed">
                    El sistema ha optimizado la <strong>Plusvalía Municipal</strong> seleccionando automáticamente el método más favorable (Objetivo vs Real) para cada escenario. 
                    {simulation.recommendedScenario === 'INHERITANCE' && " Se recomienda esperar a la sucesión para aprovechar la 'Plusvalía del Muerto' y eliminar el IRPF latente."}
                    {simulation.recommendedScenario === 'DONATION' && " La donación en vida es favorable para activos líquidos o con poca ganancia patrimonial."}
                </p>
            </div>
        </div>
    );
};

export default SuccessionSimulator;