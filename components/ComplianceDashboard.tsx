import React from 'react';
import { Company, Asset, RiskAlert, AssetType, TaxProfile } from '../types';
import { Icons } from './Icons';

interface ComplianceProps {
    companies: Company[];
    assets: Asset[];
    risks: RiskAlert[];
    taxProfiles: TaxProfile[]; // NEW PROP
}

const ComplianceDashboard: React.FC<ComplianceProps> = ({ companies, assets, risks, taxProfiles }) => {
    
    const getRiskBadge = (category: string) => {
        const catRisks = risks.filter(r => r.category === category);
        if (catRisks.some(r => r.level === 'HIGH')) return <span className="bg-rose-50 text-rose-900 border border-rose-200 text-[10px] px-2 py-1 rounded font-bold tracking-wider uppercase">Crítico</span>;
        if (catRisks.length > 0 && catRisks.some(r => r.level !== 'LOW')) return <span className="bg-yellow-50 text-yellow-800 border border-yellow-200 text-[10px] px-2 py-1 rounded font-bold tracking-wider uppercase">Alerta</span>;
        if (catRisks.some(r => r.level === 'LOW')) return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] px-2 py-1 rounded font-bold tracking-wider uppercase">Activo</span>;
        return <span className="bg-slate-50 text-slate-600 border border-slate-200 text-[10px] px-2 py-1 rounded font-bold tracking-wider uppercase">OK</span>;
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Icons.Compliance /> Blindaje Operativo & Escudo Fiscal
                <span className="text-xs font-normal text-slate-500 ml-2">Compliance 2025</span>
            </h2>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* 0. TAX SHIELD MONITOR (NEW) */}
                <div className="col-span-1 xl:col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wide">
                            Monitor Escudo Fiscal (IP + IRPF)
                         </h3>
                         {getRiskBadge('SHIELD')}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {taxProfiles.map(p => {
                            const income = p.irpfBaseGeneral + p.irpfBaseSavings;
                            const limit = income * 0.60;
                            const currentTotal = p.irpfQuota + p.ipQuota;
                            const floor = p.ipQuota * 0.20;
                            const usagePct = (currentTotal / limit) * 100;
                            const isBreached = currentTotal > limit && (currentTotal - limit) > (p.ipQuota - floor);

                            return (
                                <div key={p.name} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-sm">{p.name}</span>
                                        <span className="text-xs text-slate-400">Límite 60%: {limit.toLocaleString()}€</span>
                                    </div>
                                    
                                    <div className="relative pt-1">
                                        <div className="flex mb-2 items-center justify-between">
                                            <div>
                                                <span className="text-xs font-semibold inline-block text-indigo-200">
                                                    Cuota Conjunta: {currentTotal.toLocaleString()}€
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-xs font-bold inline-block ${isBreached ? "text-rose-400" : "text-emerald-400"}`}>
                                                    {usagePct.toFixed(1)}% del Límite
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-600">
                                            <div style={{ width: `${Math.min(usagePct, 100)}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${isBreached ? 'bg-rose-500' : usagePct > 90 ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-300">
                                        <div className="bg-slate-800 p-2 rounded">
                                            <div className="text-slate-500">Cuota IRPF</div>
                                            <div className="font-mono">{p.irpfQuota.toLocaleString()}€</div>
                                        </div>
                                        <div className="bg-slate-800 p-2 rounded">
                                            <div className="text-slate-500">Cuota IP</div>
                                            <div className="font-mono">{p.ipQuota.toLocaleString()}€</div>
                                        </div>
                                        <div className="bg-slate-800 p-2 rounded border border-slate-600">
                                            <div className="text-slate-500">Suelo 20% IP</div>
                                            <div className="font-mono text-indigo-300">{floor.toLocaleString()}€</div>
                                        </div>
                                    </div>
                                    {isBreached && <p className="mt-2 text-xs text-rose-300">⚠️ Rompe el escudo. Topa con el suelo mínimo del 20%.</p>}
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {/* 1. FAMILY BUSINESS: REMUNERATION & SUBSTANCE */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Empresa Familiar (Exención IP)</h3>
                        {getRiskBadge('FAMILY_BIZ')}
                    </div>
                    {companies.map(co => {
                        const remRatio = co.directorTotalIncome > 0 ? co.directorSalary / co.directorTotalIncome : 0;
                        return (
                             <div key={co.id} className="mb-4 last:mb-0 bg-slate-50 p-3 rounded border border-slate-100">
                                <div className="font-bold text-sm text-slate-800 mb-2">{co.name}</div>
                                
                                <div className="space-y-2">
                                    {/* Substance */}
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500">Sustancia (Empleado)</span>
                                        {co.hasFullTimeEmployee ? (
                                            <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">CUMPLE</span>
                                        ) : (
                                            <span className="text-rose-800 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-100">INCUMPLE</span>
                                        )}
                                    </div>

                                    {/* Remuneration 50% Rule */}
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500">Regla Remuneración &gt;50%</span>
                                        <span className={remRatio > 0.5 ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                                            {(remRatio * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                                        <div className={`h-1.5 rounded-full ${remRatio > 0.5 ? 'bg-emerald-600' : 'bg-rose-600'}`} style={{ width: `${Math.min(remRatio*100, 100)}%` }}></div>
                                    </div>
                                    {remRatio < 0.5 && <div className="text-[10px] text-rose-600 mt-1">La nómina de dirección debe ser la fuente principal de renta.</div>}
                                </div>
                             </div>
                        );
                    })}
                </div>

                {/* 2. DIRECTOR REMUNERATION SHIELD */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Blindaje Deducibilidad (IS)</h3>
                        {getRiskBadge('DIRECTOR')}
                    </div>
                    {companies.map(co => (
                        <div key={co.id} className="mb-4 last:mb-0">
                            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-t border border-b-0 border-slate-200">
                                <span className="text-sm font-bold text-slate-700">{co.name}</span>
                                <span className="text-xs bg-white border px-2 py-0.5 rounded text-slate-500">Salario: {co.directorSalary.toLocaleString()}€</span>
                            </div>
                            <div className="border border-slate-200 rounded-b p-3 grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <p className="text-slate-500 uppercase font-semibold">Estatutos</p>
                                    <p className={co.directorContractStatus === 'RETRIBUTED' ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                                        {co.directorContractStatus === 'RETRIBUTED' ? 'RETRIBUIDO' : 'GRATUITO (RIESGO)'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500 uppercase font-semibold">Contrato Art. 249</p>
                                    <p className={co.hasExecutiveContract ? "text-emerald-700 font-bold" : "text-yellow-700 font-bold"}>
                                        {co.hasExecutiveContract ? 'FIRMADO' : 'PENDIENTE'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. VRC WATCHDOG */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Valor Referencia (VRC)</h3>
                        {getRiskBadge('VRC')}
                    </div>
                    <div className="space-y-3">
                        {assets.filter(a => a.type === AssetType.REAL_ESTATE).map(a => {
                            const diff = a.referenceValue - a.marketValue;
                            const pct = (diff / a.marketValue) * 100;
                            const isRisk = diff > 0;
                            
                            return (
                                <div key={a.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                                    <div>
                                        <div className="font-medium text-slate-800">{a.name}</div>
                                        <div className="text-xs text-slate-500">Mercado: {a.marketValue.toLocaleString()}€</div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-mono font-bold ${isRisk ? 'text-rose-700' : 'text-emerald-700'}`}>
                                            VRC: {a.referenceValue.toLocaleString()}€
                                        </div>
                                        {isRisk && (
                                            <div className="text-[10px] text-rose-700 font-bold">
                                                +{pct.toFixed(1)}% Sobrevalorado
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ComplianceDashboard;