import React, { useState, useEffect, useCallback } from 'react';
import { AppState, Asset, AssetType, Company, RiskAlert, TaxProfile, CivilRegime, SavedCase } from './types';
import { auditWealthStructure } from './services/taxEngine';
import { getFastAnalysis, getDeepThinkingOptimization, createChatSession } from './services/geminiService';
import { saveCase } from './services/storageService';
import RiskCard from './components/RiskCard';
import AssetTable from './components/AssetTable';
import SuccessionSimulator from './components/SuccessionSimulator';
import ComplianceDashboard from './components/ComplianceDashboard';
import CryptoDashboard from './components/CryptoDashboard';
import CaseManager from './components/CaseManager';
import DataEditor from './components/DataEditor';
import HypothesisLab from './components/HypothesisLab';
import RegulatoryLibrary from './components/RegulatoryLibrary';
import { Icons } from './components/Icons';

// --- INITIAL MOCK DATA ---
const INITIAL_STATE: AppState = {
  taxProfiles: [
    {
        name: 'Yolanda',
        civilNeighborhood: 'Catalana',
        civilRegime: CivilRegime.SEPARATION,
        irpfBaseGeneral: 80000,
        irpfBaseSavings: 250000,
        irpfQuota: 90000,
        ipQuota: 45000
    },
    {
        name: 'María Dolores',
        civilNeighborhood: 'Catalana',
        civilRegime: CivilRegime.SEPARATION,
        irpfBaseGeneral: 40000,
        irpfBaseSavings: 20000,
        irpfQuota: 12000,
        ipQuota: 5000
    }
  ],
  assets: [
    {
      id: '1', name: 'Vivienda Habitual (Vilanova)', type: AssetType.REAL_ESTATE,
      marketValue: 1200000, referenceValue: 1400000, landValue: 400000, 
      acquisitionValue: 300000, acquisitionDate: '1995-05-20', 
      isSuccessionPact: false, isMainHome: true, isAffect: false
    },
    {
      id: '2', name: 'Nave Industrial (Pacto)', type: AssetType.REAL_ESTATE,
      marketValue: 800000, referenceValue: 700000, landValue: 300000,
      acquisitionValue: 200000, acquisitionDate: '2024-01-01', 
      isSuccessionPact: true, pactDate: '2024-06-15', isMainHome: false, isAffect: true 
    },
    {
      id: '3', name: 'Cartera Fondos (Yolanda)', type: AssetType.SHARES,
      marketValue: 2500000, referenceValue: 0,
      acquisitionValue: 1800000, acquisitionDate: '2015-06-15', 
      isSuccessionPact: false, isMainHome: false, isAffect: false
    },
    {
      id: 'c-btc-1', name: 'Bitcoin (Ledger Vault)', type: AssetType.CRYPTO,
      marketValue: 150000, referenceValue: 0, acquisitionValue: 20000, acquisitionDate: '2018-01-01',
      isSuccessionPact: false, isMainHome: false, isAffect: false,
      walletType: 'COLD_WALLET', custodyCountry: 'ES', stakingType: 'NONE'
    },
    {
      id: 'c-eth-1', name: 'Ethereum (Binance)', type: AssetType.CRYPTO,
      marketValue: 60000, referenceValue: 0, acquisitionValue: 10000, acquisitionDate: '2020-01-01',
      isSuccessionPact: false, isMainHome: false, isAffect: false,
      walletType: 'EXCHANGE_CUSTODIAL', custodyCountry: 'FOREIGN', stakingType: 'PASSIVE'
    },
    {
      id: 'c-sol-1', name: 'Solana Validator Node', type: AssetType.CRYPTO,
      marketValue: 25000, referenceValue: 0, acquisitionValue: 1000, acquisitionDate: '2023-01-01',
      isSuccessionPact: false, isMainHome: false, isAffect: false,
      walletType: 'DEFI_PROTOCOL', custodyCountry: 'ES', stakingType: 'ACTIVE_VALIDATOR'
    }
  ],
  companies: [
    {
      id: 'c1', name: 'Holding Y&D S.L.',
      equity: 3000000,
      turnover: 1500000,
      familyParticipation: 100, 
      hasFullTimeEmployee: false, 
      directorSalary: 45000,
      directorTotalIncome: 120000, 
      assetsAffectRatio: 0.60, 
      isProfessional: false,
      directorContractStatus: 'GRATUITOUS',
      hasExecutiveContract: false,
      relatedTransactions: [
          { 
              id: 'rt1', type: 'MANAGEMENT_FEE', counterparty: 'Filial 1', 
              amount: 120000, hasBenefitTest: false, documentationStatus: 'NONE' 
          }
      ]
    },
    {
      id: 'c2', name: 'Yolanda Consultoría S.L.P.',
      equity: 500000,
      turnover: 600000,
      familyParticipation: 100, 
      hasFullTimeEmployee: true,
      directorSalary: 0,
      directorTotalIncome: 200000,
      assetsAffectRatio: 1,
      isProfessional: true,
      profActivityIncomeRatio: 1, 
      adjustedResult: 500000,
      partnerRemuneration: 300000, 
      directorContractStatus: 'RETRIBUTED',
      hasExecutiveContract: true,
      relatedTransactions: []
    }
  ]
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [risks, setRisks] = useState<RiskAlert[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [thinkingResult, setThinkingResult] = useState<string>('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'COMPLIANCE' | 'SIMULATOR' | 'LAB' | 'CRYPTO' | 'LAWS' | 'CASES'>('DASHBOARD');
  const [currentCaseInfo, setCurrentCaseInfo] = useState<{name: string, date: string} | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatSession, setChatSession] = useState(() => createChatSession());

  useEffect(() => {
    const detectedRisks = auditWealthStructure(state.taxProfiles, state.companies, state.assets);
    setRisks(detectedRisks);
  }, [state]);

  const handleFastAnalysis = useCallback(async () => {
    setIsSummarizing(true);
    const summary = await getFastAnalysis(risks);
    setAiSummary(summary);
    setIsSummarizing(false);
  }, [risks]);

  const handleDeepAnalysis = useCallback(async () => {
    setIsThinking(true);
    const result = await getDeepThinkingOptimization(state);
    setThinkingResult(result);
    setIsThinking(false);
  }, [state]);

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');

    try {
        const result = await chatSession.sendMessage({ message: userMsg });
        setChatHistory(prev => [...prev, { role: 'model', text: result.text || "Error" }]);
    } catch (e) {
        setChatHistory(prev => [...prev, { role: 'model', text: "Error de conexión con Gemini." }]);
    }
  };

  const handleSaveCurrentCase = () => {
      const desc = prompt("Introduce una descripción para este expediente (ej: 'Escenario Base 2025'):");
      if (desc) {
          const saved = saveCase(state, desc);
          setCurrentCaseInfo({ name: desc, date: saved.timestamp });
          alert("✅ Expediente guardado correctamente.");
      }
  };

  const handleLoadCase = (savedCase: SavedCase) => {
      setState(savedCase.state);
      setCurrentCaseInfo({ name: savedCase.description, date: savedCase.timestamp });
      setAiSummary('');
      setThinkingResult('');
      const newSession = createChatSession();
      newSession.sendMessage({ message: `He cargado un nuevo expediente histórico del cliente: ${savedCase.clientName} con fecha ${savedCase.timestamp}. Contextualiza tus respuestas a esta foto fija.` });
      setChatSession(newSession);
      setActiveTab('DASHBOARD');
  };

  const handleEditSave = (newState: AppState) => {
      setState(newState);
      setIsEditing(false);
      setAiSummary('');
      setThinkingResult('');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-800 bg-[#f4f5f7]">
      
      {/* Sidebar Navigation - Corporate Theme */}
      <aside className="w-full md:w-72 bg-[#0f172a] text-white flex flex-col shrink-0 border-r border-slate-800 z-20 shadow-2xl">
        <div className="p-8 pb-4">
            <h1 className="text-2xl font-serif tracking-wide text-white">SOLFICO</h1>
            <div className="h-0.5 w-12 bg-[#b49b67] mt-2 mb-1"></div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Tax & Legal Intelligence</p>
        </div>
        
        <div className="px-6 mb-6">
            <div className="bg-[#1e293b] p-4 rounded border border-slate-700 relative overflow-hidden group transition-all hover:border-[#b49b67]/50">
                {currentCaseInfo && (
                     <div className="absolute top-0 right-0 bg-[#b49b67] text-slate-900 text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider">
                        Histórico
                     </div>
                )}
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Expediente Activo</div>
                <div className="font-medium text-sm truncate text-white">
                    {currentCaseInfo ? currentCaseInfo.name : state.taxProfiles.map(p => p.name).join(' & ')}
                </div>
                {!currentCaseInfo && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="mt-3 w-full text-[10px] uppercase tracking-wide bg-slate-800 hover:bg-[#b49b67] hover:text-slate-900 text-slate-300 py-2 rounded transition-all border border-slate-600 hover:border-[#b49b67] flex items-center justify-center gap-2"
                    >
                        <Icons.Edit /> Editar Origen
                    </button>
                )}
            </div>
        </div>

        <nav className="space-y-1 flex-1 px-4 overflow-y-auto">
          {[
            { id: 'DASHBOARD', icon: <Icons.Dashboard />, label: 'Visión Global' },
            { id: 'LAB', icon: <Icons.Lab />, label: 'Lab Hipótesis' },
            { id: 'COMPLIANCE', icon: <Icons.Compliance />, label: 'Compliance' },
            { id: 'LAWS', icon: <Icons.Laws />, label: 'Normativa 2025' },
            { id: 'SIMULATOR', icon: <Icons.Simulator />, label: 'Sucesiones' },
            { id: 'CRYPTO', icon: <Icons.Crypto />, label: 'Activos Digitales' },
            { id: 'CASES', icon: <Icons.Cases />, label: 'Expedientes' },
          ].map(item => (
            <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 py-3 px-4 rounded font-medium text-sm transition-all duration-200 border-l-4 ${activeTab === item.id ? 'bg-[#1e293b] text-white border-[#b49b67]' : 'border-transparent text-slate-400 hover:text-white hover:bg-[#1e293b]/50'}`}
            >
                <span className="opacity-70">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 bg-[#0f172a]">
            <button 
                onClick={handleSaveCurrentCase}
                className="w-full flex items-center justify-center gap-2 bg-[#b49b67] hover:bg-[#a38a58] text-slate-900 py-2.5 px-4 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
            >
                <Icons.Save /> <span>Guardar Sesión</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto relative bg-[#f8fafc]">
        
        {isEditing && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
                <div className="w-full max-w-5xl h-full shadow-2xl rounded-xl overflow-hidden">
                    <DataEditor 
                        initialState={state} 
                        onSave={handleEditSave} 
                        onCancel={() => setIsEditing(false)} 
                    />
                </div>
            </div>
        )}

        <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-3xl font-serif text-slate-900 tracking-tight">
                {activeTab === 'DASHBOARD' && 'Auditoría Patrimonial'}
                {activeTab === 'LAB' && 'Optimización Fiscal'}
                {activeTab === 'COMPLIANCE' && 'Compliance Corporativo'}
                {activeTab === 'LAWS' && 'Repositorio Legal'}
                {activeTab === 'SIMULATOR' && 'Planificación Sucesoria'}
                {activeTab === 'CRYPTO' && 'Fiscalidad Digital'}
                {activeTab === 'CASES' && 'Expedientes'}
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">
                {currentCaseInfo 
                    ? `Expediente: ${currentCaseInfo.name} (${new Date(currentCaseInfo.date).toLocaleDateString()})` 
                    : 'Análisis en tiempo real • Ejercicio Fiscal 2025'}
            </p>
          </div>
          {activeTab !== 'CASES' && (
              <button 
                onClick={handleDeepAnalysis}
                disabled={isThinking}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#0f172a] text-white px-6 py-3 rounded hover:bg-slate-800 transition-all shadow-md text-xs font-bold uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Icons.AI /> {isThinking ? 'Procesando Análisis...' : 'Ejecutar Auditoría IA'}
              </button>
          )}
        </header>

        {thinkingResult && (
             <div className="mb-8 bg-white p-8 rounded border-l-4 border-[#b49b67] shadow-sm animate-fade-in">
                <h3 className="text-lg font-serif text-slate-900 mb-4 flex items-center gap-2">
                    <Icons.Laws /> Dictamen Pericial (IA)
                </h3>
                <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line font-serif">
                    {thinkingResult}
                </div>
            </div>
        )}

        {activeTab === 'DASHBOARD' && (
            <div className="space-y-8 animate-fade-in">
                {/* Summary Card */}
                <div className="bg-white rounded shadow-sm border border-slate-200 p-8">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Icons.Check /> Wealth Health Check
                        </h3>
                        {!aiSummary && (
                            <button onClick={handleFastAnalysis} disabled={isSummarizing} className="text-xs font-bold text-[#b49b67] hover:underline uppercase tracking-wide">
                                {isSummarizing ? 'Analizando...' : 'Generar Diagnóstico'}
                            </button>
                        )}
                    </div>
                    <div className={`p-6 rounded border ${aiSummary ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 border-dashed border-slate-300'} text-sm text-slate-700 leading-relaxed font-serif`}>
                        {aiSummary ? aiSummary : "El sistema está listo para evaluar la estructura patrimonial. Pulse 'Generar Diagnóstico' para un resumen ejecutivo."}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <section>
                        <h3 className="text-lg font-serif text-slate-800 mb-6 pb-2 border-b border-slate-200">Alertas de Riesgo</h3>
                        <div className="space-y-4">
                            {risks.length === 0 ? (
                                <div className="p-8 bg-white rounded border border-slate-200 text-center text-slate-400 font-serif italic">Sin riesgos detectados</div>
                            ) : (
                                risks.slice(0, 5).map(risk => <RiskCard key={risk.id} alert={risk} />)
                            )}
                        </div>
                    </section>
                     <section>
                        <h3 className="text-lg font-serif text-slate-800 mb-6 pb-2 border-b border-slate-200">Inventario de Activos</h3>
                        <AssetTable assets={state.assets} />
                     </section>
                </div>
            </div>
        )}

        {activeTab === 'LAB' && (
            <HypothesisLab currentState={state} />
        )}

        {activeTab === 'COMPLIANCE' && (
             <ComplianceDashboard companies={state.companies} assets={state.assets} risks={risks} taxProfiles={state.taxProfiles} />
        )}

        {activeTab === 'LAWS' && (
            <RegulatoryLibrary />
        )}

        {activeTab === 'SIMULATOR' && (
            <div className="space-y-8 animate-fade-in">
                 <SuccessionSimulator assets={state.assets} />
            </div>
        )}

        {activeTab === 'CRYPTO' && (
            <CryptoDashboard assets={state.assets} risks={risks} />
        )}

        {activeTab === 'CASES' && (
            <CaseManager onLoadCase={handleLoadCase} />
        )}

      </main>

      {/* Chat Button */}
      <button 
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-8 right-8 bg-[#0f172a] text-white p-4 rounded-full shadow-2xl hover:bg-[#1e293b] transition-all z-40 border-2 border-[#b49b67]"
      >
         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
      </button>

      {/* Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-28 right-8 w-96 h-[500px] bg-white rounded shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-fade-in-up">
            <div className="bg-[#0f172a] text-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="font-serif tracking-wide text-sm">SOLFICO ASSISTANT</span>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white">×</button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
                {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded p-3 text-sm shadow-sm ${msg.role === 'user' ? 'bg-[#b49b67] text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                        className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#b49b67]"
                        placeholder="Escriba su consulta..."
                    />
                    <button onClick={handleChatSend} className="bg-[#0f172a] text-white px-4 py-2 rounded text-xs font-bold uppercase hover:bg-slate-800">Enviar</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default App;