import { AppState, SavedCase } from '../types';

const STORAGE_KEY = 'WEALTHTECH_CASES_V1';

export const saveCase = (state: AppState, description: string): SavedCase => {
    const existingData = localStorage.getItem(STORAGE_KEY);
    const cases: SavedCase[] = existingData ? JSON.parse(existingData) : [];

    const clientName = state.taxProfiles.map(p => p.name).join(' & ');
    
    const newCase: SavedCase = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        clientName: clientName,
        description: description,
        state: state
    };

    cases.push(newCase);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    return newCase;
};

export const loadCases = (): SavedCase[] => {
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (!existingData) return [];
    try {
        // Sort by newest first
        const cases: SavedCase[] = JSON.parse(existingData);
        return cases.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (e) {
        console.error("Error loading cases", e);
        return [];
    }
};

export const deleteCase = (id: string): void => {
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (!existingData) return;
    const cases: SavedCase[] = JSON.parse(existingData);
    const filtered = cases.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }).format(date);
};