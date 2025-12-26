export enum AssetType {
  REAL_ESTATE = 'Inmueble',
  SHARES = 'Acciones/Participaciones',
  CASH = 'Tesorería/Fondos',
  CRYPTO = 'Criptoactivos',
  LUXURY = 'Joyas/Arte/Vehículos', // New for Tax Shield Exclusion
  OTHER = 'Otros'
}

export enum RiskLevel {
  LOW = 'LOW',    // Green
  MEDIUM = 'MEDIUM', // Amber
  HIGH = 'HIGH'   // Red
}

export enum CivilRegime {
  SEPARATION = 'Separación de Bienes',
  GANANCIALES = 'Gananciales',
  UNDEFINED = 'Indefinido'
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  marketValue: number;
  referenceValue: number; // VRC
  acquisitionValue: number;
  acquisitionDate: string; // ISO Date
  landValue?: number; // For Plusvalia
  isSuccessionPact: boolean; // "Pacto Sucesorio"
  pactDate?: string; // Date of the pact for 5-year rule
  isMainHome: boolean; // Vivienda Habitual
  companyId?: string; // If belongs to a holding
  isAffect?: boolean; // For Family Biz Exemption
  
  // Point 6: Crypto Specifics
  walletType?: 'EXCHANGE_CUSTODIAL' | 'COLD_WALLET' | 'DEFI_PROTOCOL';
  custodyCountry?: 'ES' | 'FOREIGN'; // For Model 721
  stakingType?: 'NONE' | 'PASSIVE' | 'ACTIVE_VALIDATOR';
  isNFT?: boolean;
}

// UPDATED: Company with Point 5 fields
export interface Company {
  id: string;
  name: string;
  equity: number; 
  turnover: number; // INCN
  familyParticipation: number; 
  hasFullTimeEmployee: boolean; 
  directorSalary: number;
  directorTotalIncome: number;
  assetsAffectRatio: number; 
  
  // Point 5: Professional & Directors
  isProfessional: boolean; // Sociedad Profesional Interpuesta?
  profActivityIncomeRatio?: number; // % Ingresos actividad profesional
  partnerRemuneration?: number; // Retribución socios
  adjustedResult?: number; // Resultado Previo Ajustado (Safe Harbor)
  
  directorContractStatus: 'GRATUITOUS' | 'RETRIBUTED' | 'UNDEFINED'; // Estatutos
  hasExecutiveContract: boolean; // Art. 249 LSC
  
  relatedTransactions: RelatedTransaction[];
}

export interface RelatedTransaction {
  id: string;
  type: 'MANAGEMENT_FEE' | 'LOAN' | 'SERVICE' | 'RENT';
  counterparty: string;
  amount: number;
  hasBenefitTest: boolean; // For Mgmt Fees
  documentationStatus: 'NONE' | 'SIMPLIFIED' | 'LOCAL_FILE' | 'MASTER_FILE';
}

export interface TaxProfile {
  name: string;
  civilNeighborhood: 'Catalana' | 'Común';
  civilRegime: CivilRegime;
  irpfBaseGeneral: number;
  irpfBaseSavings: number;
  irpfQuota: number;
  ipQuota: number; // Cuota teórica IP antes de límite
}

export interface RiskAlert {
  id: string;
  title: string;
  description: string;
  level: RiskLevel;
  category: 'SHIELD' | 'FAMILY_BIZ' | 'SUCCESSION' | 'VALUATION' | 'CIVIL' | 'PLUSVALIA' | 'RELATED_PARTY' | 'DIRECTOR' | 'VRC' | 'CRYPTO_721' | 'CRYPTO_STAKING' | 'CRYPTO_EXIT_TAX' | 'ITSGF';
  recommendation: string;
}

export interface Heir {
  id: string;
  name: string;
  relation: 'SPOUSE' | 'CHILD_U21' | 'CHILD_O21' | 'NEPHEW' | 'OTHER';
  age: number;
  preExistingWealth: number;
  role: 'HEIR' | 'FIDUCIARY' | 'FIDEICOMMISSARY';
}

export interface TaxScenario {
  type: 'DONATION' | 'INHERITANCE' | 'PACT';
  totalCost: number;
  taxes: {
    isd: number;
    irpf_donor: number; 
    iivtnu: number; 
  };
  details: string[];
  warnings: string[];
}

export interface SimulationResult {
  assetName: string;
  scenarios: TaxScenario[];
  recommendedScenario: 'DONATION' | 'INHERITANCE' | 'PACT';
  usufructValue?: number; 
}

export interface AppState {
  taxProfiles: TaxProfile[]; 
  assets: Asset[];
  companies: Company[];
}

// NEW: Digital Twin Snapshot
export interface SavedCase {
  id: string;
  timestamp: string; // ISO Date of the snapshot
  clientName: string;
  description: string;
  state: AppState; // The full frozen state
}

// NEW: Lab Interfaces
export interface OptimizationResult {
    originalBurden: number;
    optimizedBurden: number;
    savings: number;
    details: {
        ip: { before: number, after: number };
        itsgf: { before: number, after: number }; // Impuesto Solidaridad
        irpf: { before: number, after: number };
        operationalCost: number; // Cost of the measure (e.g. salary, employee)
    };
    appliedTactics: string[];
}

export interface ScenarioModifiers {
    forceFullTimeEmployee: boolean; // Hire employee
    forceDirectorSalaryIncrease: boolean; // Raise salary to >50%
    forceSafeHarbor: boolean; // Adjust professional company
    forceColdWallet: boolean; // Move crypto
}

// NEW: Legal Repository Interfaces
export type LawCategory = 'ISD_ESTATAL' | 'ISD_CAT' | 'IP_ESTATAL' | 'ITSGF' | 'IRPF' | 'JURISPRUDENCIA' | 'MERCANTIL' | 'CIVIL_CAT';

export interface LegalArticle {
    id: string;
    code: string; // e.g., "Art. 4"
    title: string;
    text: string;
    category: LawCategory;
    tags: string[];
    relevance: 'CRITICAL' | 'HIGH' | 'NORMAL';
}

// NEW: Full Document Interface
export interface LegalDocument {
    id: string;
    title: string;
    fullText: string;
    source: string;
    lastUpdated: string;
}