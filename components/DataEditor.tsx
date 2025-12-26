import React, { useState } from 'react';
import { AppState, Asset, AssetType, Company, TaxProfile, CivilRegime } from '../types';

interface DataEditorProps {
    initialState: AppState;
    onSave: (newState: AppState) => void;
    onCancel: () => void;
}

const DataEditor: React.FC<DataEditorProps> = ({ initialState, onSave, onCancel }) => {
    const [state, setState] = useState<AppState>(JSON.parse(JSON.stringify(initialState)));
    const [activeTab, setActiveTab] = useState<'PROFILE' | 'ASSETS' | 'COMPANIES'>('PROFILE');

    const handleSave = () => {
        onSave(state);
    };

    // --- PROFILE HANDLERS ---
    const updateProfile = (index: number, field: keyof TaxProfile, value: any) => {
        const newProfiles = [...state.taxProfiles];
        newProfiles[index] = { ...newProfiles[index], [field]: value };
        setState({ ...state, taxProfiles: newProfiles });
    };

    // --- ASSET HANDLERS ---
    const addAsset = () => {
        const newAsset: Asset = {
            id: crypto.randomUUID(),
            name: 'Nuevo Activo',
            type: AssetType.OTHER,
            marketValue: 0,
            referenceValue: 0,
            acquisitionValue: 0,
            acquisitionDate: new Date().toISOString().split('T')[0],
            isSuccessionPact: false,
            isMainHome: false
        };
        setState({ ...state, assets: [...state.assets, newAsset] });
    };

    const updateAsset = (id: string, field: keyof Asset, value: any) => {
        const newAssets = state.assets.map(a => a.id === id ? { ...a, [field]: value } : a);
        setState({ ...state, assets: newAssets });
    };

    const deleteAsset = (id: string) => {
        setState({ ...state, assets: state.assets.filter(a => a.id !== id) });
    };

    const mockImportCatastro = (id: string, marketVal: number) => {
        // Simulate VRC > Market Value risk
        updateAsset(id, 'referenceValue', Math.round(marketVal * 1.15));
        alert("✅ Datos importados de Sede Electrónica del Catastro (Simulación)");
    };

    // --- COMPANY HANDLERS ---
    const addCompany = () => {
        const newCo: Company = {
            id: crypto.randomUUID(),
            name: 'Nueva Sociedad',
            equity: 3000,
            turnover: 0,
            familyParticipation: 100,
            hasFullTimeEmployee: false,
            directorSalary: 0,
            directorTotalIncome: 0,
            assetsAffectRatio: 1,
            isProfessional: false,
            directorContractStatus: 'UNDEFINED',
            hasExecutiveContract: false,
            relatedTransactions: []
        };
        setState({ ...state, companies: [...state.companies, newCo] });
    };

    const updateCompany = (id: string, field: keyof Company, value: any) => {
        const newCos = state.companies.map(c => c.id === id ? { ...c, [field]: value } : c);
        setState({ ...state, companies: newCos });
    };

    const deleteCompany = (id: string) => {
        setState({ ...state, companies: state.companies.filter(c => c.id !== id) });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-full max-h-[80vh]">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">📸 La Foto Inicial</h2>
                    <p className="text-sm text-slate-500">Define los datos del contribuyente para el análisis.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-sm">
                        Guardar Cambios
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
                <button 
                    className={`flex-1 py-3 text-sm font-bold border-b-2 ${activeTab === 'PROFILE' ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                    onClick={() => setActiveTab('PROFILE')}
                >
                    👤 Personas & Renta
                </button>
                <button 
                    className={`flex-1 py-3 text-sm font-bold border-b-2 ${activeTab === 'ASSETS' ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                    onClick={() => setActiveTab('ASSETS')}
                >
                    🏠 Inventario Activos
                </button>
                <button 
                    className={`flex-1 py-3 text-sm font-bold border-b-2 ${activeTab === 'COMPANIES' ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                    onClick={() => setActiveTab('COMPANIES')}
                >
                    🏢 Estructura Societaria
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                
                {/* --- PROFILE TAB --- */}
                {activeTab === 'PROFILE' && (
                    <div className="space-y-6">
                        {state.taxProfiles.map((p, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-700 mb-3 border-b pb-2">Contribuyente {idx + 1}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Nombre</label>
                                        <input 
                                            type="text" value={p.name} 
                                            onChange={(e) => updateProfile(idx, 'name', e.target.value)}
                                            className="w-full border rounded p-2 text-sm" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Vecindad Civil</label>
                                        <select 
                                            value={p.civilNeighborhood} 
                                            onChange={(e) => updateProfile(idx, 'civilNeighborhood', e.target.value)}
                                            className="w-full border rounded p-2 text-sm"
                                        >
                                            <option value="Catalana">Catalana</option>
                                            <option value="Común">Común</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Base IRPF General</label>
                                        <input 
                                            type="number" value={p.irpfBaseGeneral} 
                                            onChange={(e) => updateProfile(idx, 'irpfBaseGeneral', Number(e.target.value))}
                                            className="w-full border rounded p-2 text-sm" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Base IRPF Ahorro</label>
                                        <input 
                                            type="number" value={p.irpfBaseSavings} 
                                            onChange={(e) => updateProfile(idx, 'irpfBaseSavings', Number(e.target.value))}
                                            className="w-full border rounded p-2 text-sm" 
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 border border-blue-200">
                            ℹ️ La "Mochila Fiscal" se usa para calcular el límite conjunto Renta-Patrimonio (Escudo Fiscal).
                        </div>
                    </div>
                )}

                {/* --- ASSETS TAB --- */}
                {activeTab === 'ASSETS' && (
                    <div className="space-y-4">
                         <div className="flex justify-between items-center">
                            <h3 className="font-bold text-slate-700">Patrimonio Global</h3>
                            <button onClick={addAsset} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">+ Añadir Activo</button>
                         </div>
                         {state.assets.map(a => (
                             <div key={a.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative group">
                                 <button onClick={() => deleteAsset(a.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 text-xl">×</button>
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                     <div className="col-span-1 md:col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Nombre Activo</label>
                                        <input 
                                            type="text" value={a.name} 
                                            onChange={(e) => updateAsset(a.id, 'name', e.target.value)}
                                            className="w-full border rounded p-2 text-sm font-medium" 
                                        />
                                     </div>
                                     <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Tipo</label>
                                        <select 
                                            value={a.type} 
                                            onChange={(e) => updateAsset(a.id, 'type', e.target.value)}
                                            className="w-full border rounded p-2 text-sm"
                                        >
                                            <option value="Inmueble">Inmueble</option>
                                            <option value="Acciones/Participaciones">Acciones/Participaciones</option>
                                            <option value="Tesorería/Fondos">Tesorería/Fondos</option>
                                            <option value="Criptoactivos">Criptoactivos</option>
                                        </select>
                                     </div>
                                     <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Valor Mercado</label>
                                        <input 
                                            type="number" value={a.marketValue} 
                                            onChange={(e) => updateAsset(a.id, 'marketValue', Number(e.target.value))}
                                            className="w-full border rounded p-2 text-sm" 
                                        />
                                     </div>
                                     
                                     {a.type === 'Inmueble' && (
                                         <div className="col-span-full bg-slate-50 p-3 rounded border border-slate-100 grid grid-cols-3 gap-3">
                                             <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Valor Referencia (VRC)</label>
                                                <div className="flex gap-2">
                                                    <input 
                                                        type="number" value={a.referenceValue} 
                                                        onChange={(e) => updateAsset(a.id, 'referenceValue', Number(e.target.value))}
                                                        className="w-full border rounded p-2 text-sm" 
                                                    />
                                                    <button 
                                                        onClick={() => mockImportCatastro(a.id, a.marketValue)}
                                                        className="bg-purple-100 text-purple-700 px-2 rounded text-xs hover:bg-purple-200" 
                                                        title="Importar de Catastro"
                                                    >
                                                        🔮
                                                    </button>
                                                </div>
                                             </div>
                                             <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Fecha Adquisición</label>
                                                <input 
                                                    type="date" value={a.acquisitionDate} 
                                                    onChange={(e) => updateAsset(a.id, 'acquisitionDate', e.target.value)}
                                                    className="w-full border rounded p-2 text-sm" 
                                                />
                                             </div>
                                             <div className="flex items-center mt-4">
                                                 <input 
                                                    type="checkbox" checked={a.isMainHome}
                                                    onChange={(e) => updateAsset(a.id, 'isMainHome', e.target.checked)}
                                                    className="mr-2"
                                                 />
                                                 <span className="text-sm">Vivienda Habitual</span>
                                             </div>
                                         </div>
                                     )}

                                     {a.type === 'Criptoactivos' && (
                                         <div className="col-span-full bg-slate-50 p-3 rounded border border-slate-100 grid grid-cols-3 gap-3">
                                             <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Tipo Wallet</label>
                                                <select 
                                                    value={a.walletType || 'EXCHANGE_CUSTODIAL'} 
                                                    onChange={(e) => updateAsset(a.id, 'walletType', e.target.value)}
                                                    className="w-full border rounded p-2 text-sm"
                                                >
                                                    <option value="EXCHANGE_CUSTODIAL">Exchange (Custodia)</option>
                                                    <option value="COLD_WALLET">Cold Wallet (Propia)</option>
                                                </select>
                                             </div>
                                             <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">País Custodia</label>
                                                <select 
                                                    value={a.custodyCountry || 'ES'} 
                                                    onChange={(e) => updateAsset(a.id, 'custodyCountry', e.target.value)}
                                                    className="w-full border rounded p-2 text-sm"
                                                >
                                                    <option value="ES">España</option>
                                                    <option value="FOREIGN">Extranjero</option>
                                                </select>
                                             </div>
                                         </div>
                                     )}
                                 </div>
                             </div>
                         ))}
                    </div>
                )}

                {/* --- COMPANIES TAB --- */}
                {activeTab === 'COMPANIES' && (
                    <div className="space-y-4">
                         <div className="flex justify-between items-center">
                            <h3 className="font-bold text-slate-700">Participaciones Empresariales</h3>
                            <button onClick={addCompany} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">+ Añadir Sociedad</button>
                         </div>
                         {state.companies.map(c => (
                             <div key={c.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative">
                                 <button onClick={() => deleteCompany(c.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 text-xl">×</button>
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                                     <div className="col-span-1 md:col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Razón Social</label>
                                        <input 
                                            type="text" value={c.name} 
                                            onChange={(e) => updateCompany(c.id, 'name', e.target.value)}
                                            className="w-full border rounded p-2 text-sm font-medium" 
                                        />
                                     </div>
                                     <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Patrimonio Neto</label>
                                        <input 
                                            type="number" value={c.equity} 
                                            onChange={(e) => updateCompany(c.id, 'equity', Number(e.target.value))}
                                            className="w-full border rounded p-2 text-sm" 
                                        />
                                     </div>
                                 </div>
                                 
                                 {/* Point 5 Checklist */}
                                 <div className="bg-orange-50 p-3 rounded border border-orange-100">
                                     <h4 className="text-xs font-bold text-orange-800 uppercase mb-2">Checklist Exención Empresa Familiar</h4>
                                     <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                         <div>
                                            <label className="block text-xs text-slate-500 mb-1">Sueldo Administrador</label>
                                            <input 
                                                type="number" value={c.directorSalary} 
                                                onChange={(e) => updateCompany(c.id, 'directorSalary', Number(e.target.value))}
                                                className="w-full border rounded p-1 text-sm bg-white" 
                                            />
                                         </div>
                                         <div className="flex items-center mt-5">
                                             <label className="flex items-center text-sm">
                                                <input 
                                                    type="checkbox" checked={c.hasFullTimeEmployee}
                                                    onChange={(e) => updateCompany(c.id, 'hasFullTimeEmployee', e.target.checked)}
                                                    className="mr-2"
                                                />
                                                Empleado Jornada Completa
                                             </label>
                                         </div>
                                         <div>
                                            <label className="block text-xs text-slate-500 mb-1">Estatutos (Cargo)</label>
                                            <select 
                                                value={c.directorContractStatus} 
                                                onChange={(e) => updateCompany(c.id, 'directorContractStatus', e.target.value)}
                                                className="w-full border rounded p-1 text-sm bg-white"
                                            >
                                                <option value="UNDEFINED">Sin definir</option>
                                                <option value="GRATUITOUS">Gratuito</option>
                                                <option value="RETRIBUTED">Retribuido</option>
                                            </select>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataEditor;