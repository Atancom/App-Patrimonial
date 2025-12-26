import React from 'react';
import { Asset, RiskAlert, AssetType } from '../types';
import { Icons } from './Icons';

interface CryptoProps {
    assets: Asset[];
    risks: RiskAlert[];
}

const CryptoDashboard: React.FC<CryptoProps> = ({ assets, risks }) => {
    
    const cryptoAssets = assets.filter(a => a.type === AssetType.CRYPTO);
    
    // Model 721 Calculation
    const foreignCustodialValue = cryptoAssets
        .filter(a => a.walletType === 'EXCHANGE_CUSTODIAL' && a.custodyCountry === 'FOREIGN')
        .reduce((sum, a) => sum + a.marketValue, 0);
    const limit721 = 50000;
    const usage721 = Math.min((foreignCustodialValue / limit721) * 100, 100);
    const is721Risk = foreignCustodialValue > limit721;

    // Staking Analysis
    const activeStakingValue = cryptoAssets
        .filter(a => a.stakingType === 'ACTIVE_VALIDATOR')
        .reduce((sum, a) => sum + a.marketValue, 0);
    const passiveStakingValue = cryptoAssets
        .filter(a => a.stakingType === 'PASSIVE')
        .reduce((sum, a) => sum + a.marketValue, 0);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Icons.Crypto /> Cripto & Web3 (Punto 6)
                <span className="text-xs font-normal text-slate-500 ml-2">Planificación Fiscal 2025</span>
            </h2>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                {/* 1. MODEL 721 WATCHDOG */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Monitor Modelo 721 (Extranjero)</h3>
                            <p className="text-xs text-slate-500 mt-1">Límite informativo de 50.000€ en custodia ajena.</p>
                        </div>
                        {is721Risk ? (
                            <span className="bg-rose-50 text-rose-900 border border-rose-200 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">OBLIGADO</span>
                        ) : (
                            <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">EXENTO</span>
                        )}
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between text-sm font-medium mb-1">
                            <span>Saldo Custodia Extranjera</span>
                            <span className={is721Risk ? "text-rose-700 font-bold" : "text-slate-600"}>
                                {foreignCustodialValue.toLocaleString()}€ / 50.000€
                            </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3">
                            <div 
                                className={`h-3 rounded-full transition-all duration-500 ${is721Risk ? 'bg-rose-800' : 'bg-emerald-700'}`} 
                                style={{ width: `${usage721}%` }}
                            ></div>
                        </div>
                    </div>

                    {is721Risk && (
                        <div className="bg-rose-50 border-l-4 border-rose-800 p-3 text-sm text-rose-900 mb-4">
                            <strong>Acción Requerida:</strong> Superas el límite. Mueve fondos a <em>Cold Wallet</em> (Ledger/Trezor) antes del 31/12 para recuperar la exención por "Auto-Custodia".
                        </div>
                    )}

                    <div className="border-t pt-3">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Desglose Custodia</h4>
                        {cryptoAssets.map(a => (
                            <div key={a.id} className="flex justify-between text-xs py-1">
                                <span className="flex items-center gap-2 text-slate-700">
                                    {a.name}
                                </span>
                                <span className="text-slate-600 font-mono">{a.marketValue.toLocaleString()}€</span>
                                <span className="text-[10px] bg-slate-100 px-1 rounded text-slate-500 border border-slate-200">
                                    {a.walletType === 'COLD_WALLET' ? 'EXENTO (Self-Custody)' : a.custodyCountry === 'ES' ? 'EXENTO (España)' : 'COMPUTA (Ext.)'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. STAKING & YIELD CLASSIFIER */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">Calificación de Staking (IRPF)</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-indigo-50 p-3 rounded border border-indigo-100">
                            <div className="text-xs text-indigo-800 font-bold uppercase">Base del Ahorro (~21%)</div>
                            <div className="text-2xl font-bold text-indigo-900">{passiveStakingValue.toLocaleString()}€</div>
                            <p className="text-[10px] text-indigo-700 mt-1">Staking Delegado (Lido/CEX)</p>
                        </div>
                        <div className={`p-3 rounded border ${activeStakingValue > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-100'}`}>
                            <div className={`text-xs font-bold uppercase ${activeStakingValue > 0 ? 'text-yellow-800' : 'text-slate-400'}`}>Base General (~45%)</div>
                            <div className={`text-2xl font-bold ${activeStakingValue > 0 ? 'text-yellow-900' : 'text-slate-300'}`}>{activeStakingValue.toLocaleString()}€</div>
                            <p className={`text-[10px] mt-1 ${activeStakingValue > 0 ? 'text-yellow-800' : 'text-slate-400'}`}>Validador Activo (Nodo Propio)</p>
                        </div>
                    </div>

                    {activeStakingValue > 0 && (
                         <div className="text-xs text-yellow-900 bg-yellow-50 p-2 rounded mb-4 border border-yellow-100">
                             ⚠️ Tienes activos clasificados como "Actividad Económica". Requiere alta en RETA y contabilidad, o reestructurar a delegado.
                         </div>
                    )}

                    <div className="border-t pt-3">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Estrategia de Optimización</h4>
                        <ul className="text-xs space-y-2 text-slate-600 list-disc list-inside">
                            <li><strong>Airdrops:</strong> Vender inmediatamente al recibir para evitar tributar en Base General por un valor que luego puede caer (Wash Sale Trap).</li>
                            <li><strong>NFTs:</strong> Tributan como servicios digitales (IVA). Usar OSS si vendes a consumidores UE.</li>
                        </ul>
                    </div>
                </div>

                 {/* 3. EXIT TAX SIMULATOR */}
                 <div className="col-span-1 xl:col-span-2 bg-slate-900 text-slate-300 p-6 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wide">
                             Simulador Exit Tax (Cambio de Residencia)
                        </h3>
                        <span className="text-xs bg-indigo-900 border border-indigo-700 text-indigo-200 px-2 py-1 rounded font-mono">DGT V0666-25</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-sm font-bold text-slate-400 mb-2 uppercase">Tenencia Directa (Persona Física)</h4>
                            <div className="p-4 bg-slate-800 rounded border border-slate-600">
                                <div className="text-3xl font-bold text-emerald-400">0€</div>
                                <div className="text-sm text-slate-400">Coste Fiscal de Salida</div>
                                <p className="text-xs mt-3 text-slate-500">
                                    Las criptomonedas NO se consideran "valores" a efectos del Art. 95 bis LIRPF. Puedes emigrar sin tributar por plusvalías latentes.
                                </p>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-400 mb-2 uppercase">Tenencia Societaria (Holding)</h4>
                             <div className="p-4 bg-slate-800 rounded border border-slate-600 relative overflow-hidden">
                                {cryptoAssets.some(a => !!a.companyId) && (
                                    <div className="absolute top-0 right-0 bg-rose-900 text-white text-[10px] px-2 py-0.5 font-bold uppercase">RIESGO DETECTADO</div>
                                )}
                                <div className="text-3xl font-bold text-rose-400">{(cryptoAssets.filter(a => !!a.companyId).reduce((s, a) => s + (a.marketValue - a.acquisitionValue), 0) * 0.23).toLocaleString()}€</div>
                                <div className="text-sm text-slate-400">Coste Fiscal Estimado (Latente)</div>
                                <p className="text-xs mt-3 text-slate-500">
                                    Al tener cripto en una SL, posees "participaciones". Estas SÍ están sujetas al Exit Tax. Se valora la SL por su NAV (valor cripto).
                                </p>
                            </div>
                        </div>
                    </div>
                 </div>

            </div>
        </div>
    );
};

export default CryptoDashboard;