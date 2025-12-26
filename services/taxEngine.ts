import { Asset, AssetType, Company, RiskAlert, RiskLevel, TaxProfile, Heir, SimulationResult, TaxScenario, AppState, OptimizationResult, ScenarioModifiers } from '../types';

/**
 * WEALTHTECH ENGINE - CATALUNYA 2025 CORE
 * "Fiscal Skepticism Mode" Enabled
 */

const RULES_2025 = {
  ISD_TARIFF: [
    { upTo: 50000, quota: 0, rate: 0.07 },
    { upTo: 150000, quota: 3500, rate: 0.11 },
    { upTo: 400000, quota: 14500, rate: 0.17 },
    { upTo: 800000, quota: 57000, rate: 0.24 },
    { upTo: Infinity, quota: 153000, rate: 0.32 }
  ],
  IP_TARIFF_CAT: [ // Simplified Max Rate
      { upTo: 10000000, rate: 0.0275 }, // Max rate aprox
  ],
  ITSGF_TARIFF: [ // Impuesto Solidaridad (State)
      { limit: 3000000, rate: 0.0 }, // Minimum exempt
      { limit: 5000000, rate: 0.017 },
      { limit: 10000000, rate: 0.021 },
      { limit: Infinity, rate: 0.035 }
  ],
  DONATION_TARIFF_REDUCED: [
    { upTo: 200000, rate: 0.05 },
    { upTo: 600000, rate: 0.07 },
    { upTo: Infinity, rate: 0.09 }
  ],
  PLUSVALIA_BCN_COEFFS: { 
    YEAR_1_TO_5: 0.14,
    YEAR_20: 0.45,
    MAX_RATE: 0.30
  },
  COST_EMPLOYEE_YEAR: 28000, // SS included aprox
};

// --- CORE CALCULATORS ---

const calculateIP_Catalunya = (netWealth: number): number => {
    // 500k minimum exempt in Catalonia
    const taxable = Math.max(0, netWealth - 500000);
    if (taxable === 0) return 0;
    
    // Simplified progressive calculation for estimation
    // In strict mode we would use the full table, here we approximate effective rate
    let rate = 0.01;
    if (taxable > 2500000) rate = 0.02;
    if (taxable > 10000000) rate = 0.0275;
    
    return taxable * rate;
};

const calculateITSGF = (netWealth: number, ipQuotaPaid: number): number => {
    // State Solidarity Tax
    // 700k minimum exempt + 300k deduction = 1M effective threshold
    // BUT only applies if netWealth > 3M
    if (netWealth < 3000000) return 0;

    const taxable = Math.max(0, netWealth - 700000);
    let rawQuota = 0;
    
    // Tramos ITSGF
    if (taxable > 0) {
        // Simplified brackets
        if (taxable <= 3000000) rawQuota = 0; // Covered by Exemptions mostly
        else if (taxable <= 5000000) rawQuota = (taxable - 3000000) * 0.017;
        else if (taxable <= 10000000) rawQuota = 34000 + (taxable - 5000000) * 0.021;
        else rawQuota = 139000 + (taxable - 10000000) * 0.035;
    }

    // Deduction of IP paid in Autonomous Community
    return Math.max(0, rawQuota - ipQuotaPaid);
};

// --- FISCAL SKEPTICISM ENGINE ---
// Determines if assets/companies are truly exempt or "polluted"

const assessCompanyCompliance = (co: Company, modifiers?: ScenarioModifiers): { isExempt: boolean, flaws: string[] } => {
    const flaws: string[] = [];
    
    // 1. Substance Check (Overrides from Modifiers)
    const hasEmployee = modifiers?.forceFullTimeEmployee ? true : co.hasFullTimeEmployee;
    
    if (!hasEmployee && co.equity > 0) {
        flaws.push("Falta Sustancia Económica (Art. 4.8.Dos LIP): Requiere medios materiales y humanos.");
    }

    // 2. Remuneration Check
    let salary = co.directorSalary;
    if (modifiers?.forceDirectorSalaryIncrease) {
        // Hypothesize salary increase to 51% of total income
        // We assume Total Income = Salary + External Income. If we raise Salary, Total Income raises too.
        // Heuristic: Set Salary to (CurrentExternal * 1.1) to be safe
        const externalIncome = co.directorTotalIncome - co.directorSalary;
        salary = Math.max(co.directorSalary, externalIncome + 1000); 
    }

    const totalIncome = (co.directorTotalIncome - co.directorSalary) + salary;
    const ratio = totalIncome > 0 ? salary / totalIncome : 0;

    if (ratio <= 0.50) {
        flaws.push("Incumplimiento Regla >50% Remuneración (Art. 4.8.Dos.c LIP).");
    }

    return {
        isExempt: flaws.length === 0,
        flaws
    };
};

/**
 * CALCULATE GLOBAL BURDEN (LABORATORY MODE)
 */
export const calculateScenarioBurden = (state: AppState, modifiers: ScenarioModifiers): OptimizationResult => {
    let totalNetWealth = 0;
    let totalIP = 0;
    let totalITSGF = 0;
    let totalIRPF = 0; // Simplified delta
    let opCosts = 0;

    // 1. Calculate Wealth & Exemptions
    state.assets.forEach(asset => {
        let value = asset.marketValue; // Skepticism: Use Market Value, not Reference if Market is higher (prudence)
        
        // Is it a Company Share?
        const linkedCo = state.companies.find(c => c.id === asset.companyId);
        if (linkedCo) {
            const compliance = assessCompanyCompliance(linkedCo, modifiers);
            if (compliance.isExempt && asset.isAffect) {
                value = 0; // Exempt!!
            }
            // If we forced an employee, add cost
            if (modifiers.forceFullTimeEmployee && !linkedCo.hasFullTimeEmployee) {
                opCosts += RULES_2025.COST_EMPLOYEE_YEAR;
            }
            // If we forced salary increase, calculate IRPF Cost delta (approx 45%)
            if (modifiers.forceDirectorSalaryIncrease) {
                const complianceNow = assessCompanyCompliance(linkedCo); // Check original
                if (!complianceNow.isExempt) {
                    // Cost of increasing salary
                    const currentExt = linkedCo.directorTotalIncome - linkedCo.directorSalary;
                    const targetSalary = currentExt + 2000;
                    const increase = Math.max(0, targetSalary - linkedCo.directorSalary);
                    opCosts += increase * 0.45; // IRPF Cost
                }
            }
        }
        totalNetWealth += value;
    });

    // 2. Calculate Taxes
    // Assuming single taxpayer for the hypothesis aggregation (simplified for demo)
    totalIP = calculateIP_Catalunya(totalNetWealth);
    totalITSGF = calculateITSGF(totalNetWealth, totalIP);

    const totalBurden = totalIP + totalITSGF + totalIRPF;

    return {
        originalBurden: 0, // Filled by caller comparing two runs
        optimizedBurden: totalBurden,
        savings: 0,
        details: {
            ip: { before: 0, after: totalIP },
            itsgf: { before: 0, after: totalITSGF },
            irpf: { before: 0, after: totalIRPF },
            operationalCost: opCosts
        },
        appliedTactics: []
    };
};

// --- SIMULATION ENGINE ---

const calculateISD = (base: number, type: 'MORTIS' | 'INTER_VIVOS', heir: Heir): number => {
    let quota = 0;
    if (type === 'INTER_VIVOS' && (heir.relation === 'SPOUSE' || heir.relation.startsWith('CHILD'))) {
        let remaining = base;
        let prevLimit = 0;
        for (const bracket of RULES_2025.DONATION_TARIFF_REDUCED) {
            if (remaining <= 0) break;
            const taxable = Math.min(base, bracket.upTo) - prevLimit;
            quota += taxable * bracket.rate;
            prevLimit = bracket.upTo;
        }
    } else {
        quota = 0; 
        let lastLimit = 0;
        for (const b of RULES_2025.ISD_TARIFF) {
            if (base > lastLimit) {
                const taxable = Math.min(base, b.upTo) - lastLimit;
                quota += taxable * b.rate;
                lastLimit = b.upTo;
            }
        }
    }
    return quota;
};

const calculateIRPFDonor = (asset: Asset): number => {
    if (asset.type === AssetType.CASH) return 0;
    const gain = asset.marketValue - asset.acquisitionValue;
    if (gain <= 0) return 0;
    let tax = 0;
    if (gain > 200000) tax += (gain - 200000) * 0.27 + 43880; 
    else tax += gain * 0.23; 
    return tax;
};

const calculateIIVTNU = (asset: Asset, mode: 'MORTIS' | 'INTER_VIVOS'): { quota: number, method: 'OBJECTIVE' | 'REAL' } => {
    if (asset.type !== AssetType.REAL_ESTATE || !asset.landValue) return { quota: 0, method: 'OBJECTIVE' };
    const baseObjective = asset.landValue * RULES_2025.PLUSVALIA_BCN_COEFFS.YEAR_20; 
    const quotaObjective = baseObjective * RULES_2025.PLUSVALIA_BCN_COEFFS.MAX_RATE;
    const gain = asset.marketValue - asset.acquisitionValue;
    let quotaReal = 0;
    if (gain <= 0) {
        quotaReal = 0; 
    } else {
        const landRatio = asset.landValue / (asset.referenceValue || asset.marketValue);
        const baseReal = gain * landRatio;
        quotaReal = baseReal * RULES_2025.PLUSVALIA_BCN_COEFFS.MAX_RATE;
    }
    let finalQuota = Math.min(quotaObjective, quotaReal);
    const method = quotaReal < quotaObjective ? 'REAL' : 'OBJECTIVE';
    if (mode === 'MORTIS' && asset.isMainHome) finalQuota *= 0.05; 
    return { quota: finalQuota, method };
};

export const runComparativeSimulation = (asset: Asset, heir: Heir): SimulationResult => {
  const isdDonation = calculateISD(asset.marketValue, 'INTER_VIVOS', heir);
  const irpfDonation = calculateIRPFDonor(asset); 
  const plusvaliaDonation = calculateIIVTNU(asset, 'INTER_VIVOS');
  const costDonation = isdDonation + irpfDonation + plusvaliaDonation.quota;
  const scenarioDonation: TaxScenario = {
      type: 'DONATION', totalCost: costDonation,
      taxes: { isd: isdDonation, irpf_donor: irpfDonation, iivtnu: plusvaliaDonation.quota },
      details: [`IRPF Donante: ${(irpfDonation).toLocaleString()}€`, `Plusvalía: Método ${plusvaliaDonation.method}`],
      warnings: irpfDonation > 5000 ? ["INEFICIENCIA: IRPF se dispara."] : []
  };

  let isdInheritance = calculateISD(asset.marketValue, 'MORTIS', heir);
  if (heir.relation === 'SPOUSE') isdInheritance *= 0.01; 
  if (asset.isMainHome && (heir.relation === 'SPOUSE' || heir.relation.startsWith('CHILD'))) isdInheritance *= 0.1; 
  const plusvaliaInheritance = calculateIIVTNU(asset, 'MORTIS'); 
  const costInheritance = isdInheritance + plusvaliaInheritance.quota;
  const scenarioInheritance: TaxScenario = {
      type: 'INHERITANCE', totalCost: costInheritance,
      taxes: { isd: isdInheritance, irpf_donor: 0, iivtnu: plusvaliaInheritance.quota },
      details: [`Plusvalía del Muerto (Ahorro IRPF)`, `Bonif. Vivienda`],
      warnings: []
  };

  const costPact = costInheritance + (plusvaliaDonation.quota - plusvaliaInheritance.quota); 
  const scenarioPact: TaxScenario = {
      type: 'PACT', totalCost: costPact,
      taxes: { isd: isdInheritance, irpf_donor: 0, iivtnu: plusvaliaDonation.quota },
      details: [`ISD Sucesiones`, `Plusvalía IV`],
      warnings: ["CAUTELA 5 AÑOS (Art. 36 LIRPF)"]
  };

  let recommended: 'DONATION' | 'INHERITANCE' | 'PACT' = 'INHERITANCE';
  if (asset.type === AssetType.CASH) recommended = 'DONATION';
  else if (costPact < costInheritance && costPact < costDonation) recommended = 'PACT';
  else if (costDonation < costInheritance) recommended = 'DONATION';

  return { assetName: asset.name, scenarios: [scenarioDonation, scenarioInheritance, scenarioPact], recommendedScenario: recommended, usufructValue: heir.age ? Math.max(10, 89 - heir.age) : 0 };
};

export const auditTaxShield = (profiles: TaxProfile[]): RiskAlert[] => {
    const risks: RiskAlert[] = [];
    profiles.forEach(p => {
        const totalIncome = p.irpfBaseGeneral + p.irpfBaseSavings;
        if (totalIncome === 0) return;
        const limit60 = totalIncome * 0.60;
        const totalQuota = p.irpfQuota + p.ipQuota;
        const minIpQuota = p.ipQuota * 0.20; 
        if (totalQuota > limit60) {
            const maxReduction = p.ipQuota - minIpQuota;
            const neededReduction = totalQuota - limit60;
            if (neededReduction > maxReduction) {
                risks.push({ id: `shield-breach-${p.name}`, title: `Rotura Escudo Fiscal (Art. 31 LIP)`, description: `Topa con suelo 20% IP.`, level: RiskLevel.HIGH, category: 'SHIELD', recommendation: 'Aumentar base imponible.' });
            }
        }
    });
    return risks;
};

export const auditWealthStructure = (profiles: TaxProfile[], companies: Company[], assets: Asset[]): RiskAlert[] => {
    let risks: RiskAlert[] = [];
    
    // FISCAL SKEPTICISM: Analyze ITSGF Exposure
    const totalWealth = assets.reduce((s, a) => s + a.marketValue, 0);
    if (totalWealth > 3000000) {
         risks.push({ id: `itsgf-risk`, title: `Exposición a ITSGF (Solidaridad)`, description: `Patrimonio > 3M€ sujeto a Impuesto Solidaridad. Requiere coordinar con cuota IP Catalunya.`, level: RiskLevel.MEDIUM, category: 'ITSGF', recommendation: 'Verificar deducción cuota IP.' });
    }

    companies.forEach(co => {
        const check = assessCompanyCompliance(co);
        if (!check.isExempt) {
             risks.push({ id: `fam-biz-fail-${co.id}`, title: `Fallo Exención ${co.name}`, description: `Causas: ${check.flaws.join(', ')}`, level: RiskLevel.HIGH, category: 'FAMILY_BIZ', recommendation: 'Usar Laboratorio de Hipótesis para corregir.' });
        }
    });

    assets.filter(a => a.type === AssetType.REAL_ESTATE).forEach(a => {
        if (a.referenceValue > a.marketValue * 1.1) {
            risks.push({ id: `vrc-over-${a.id}`, title: `Sobrevaloración VRC`, description: `VRC > Mercado (+${((a.referenceValue/a.marketValue)-1)*100 | 0}%). Contradice Art. 10 LIP.`, level: RiskLevel.MEDIUM, category: 'VRC', recommendation: 'Pericial Contradictoria.' });
        }
    });

    return [...risks, ...auditTaxShield(profiles)];
};