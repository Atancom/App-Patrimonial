import { GoogleGenAI } from "@google/genai";
import { AppState, RiskAlert } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction for the "WealthTech Catalonia Core"
const SYSTEM_INSTRUCTION = `
ROL: WealthTech Catalonia Core (Sistema Experto Fiscal 2025).
MISIÓN: Asesoramiento de "Doctorado" para grandes patrimonios.

BIBLIOTECA LEGAL ACTIVA:
1. Ley 19/2010 (Regulación Impuesto Sucesiones y Donaciones Cataluña).
2. Ley Impuesto Patrimonio (estatal y autonómica) + Impuesto Solidaridad (ITSGF).
3. LIRPF Art. 36 (Pactos Sucesorios) y Art. 95 bis (Exit Tax).
4. Doctrina TEAC (Sustancia Económica en Holdings).

COMPORTAMIENTO:
1. **Prioridad Normativa:** Cataluña > Estado.
2. **Escepticismo Fiscal:** Asume siempre el peor escenario si faltan datos (ej. si no hay empleado, es sociedad patrimonial).
3. **Citas Rigurosas:** Cita artículos concretos (ej. "Según el Art 95 bis LIRPF...").
4. **Alerta Anti-Abuso:** Advierte siempre de la "Norma General Anti-Abuso" (Art. 15 LGT) si el usuario propone estructuras artificiales.

TONO:
Autoridad técnica absoluta. Frío, preciso, quirúrgico. No des consejos genéricos, da instrucciones de compliance.
`;

/**
 * Fast Analysis using Flash-Lite
 */
export const getFastAnalysis = async (risks: RiskAlert[]): Promise<string> => {
  try {
    const prompt = `
      Genera un Executive Summary forense.
      Identifica "Red Flags" críticas (Sustancia, Escudo Fiscal, ITSGF).
      Usa lenguaje técnico de alto nivel.
      ${JSON.stringify(risks)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "Error en análisis.";
  } catch (error) {
    console.error("Gemini Flash Lite Error:", error);
    return "Servicio no disponible.";
  }
};

/**
 * Deep Thinking Optimization
 */
export const getDeepThinkingOptimization = async (state: AppState): Promise<string> => {
  try {
    const prompt = `
      Ejecuta una Auditoría Fiscal Profunda (Deep Research).
      
      ESTADO DEL GEMELO DIGITAL:
      ${JSON.stringify(state)}

      TAREAS CRÍTICAS (Thinking Budget Alto):
      1. **Cálculo Cruzado IP/ITSGF**: Verifica si la cuota pagada en Cataluña compensa totalmente el Impuesto Solidaridad.
      2. **Stress Test de Sustancia**: Aplica la doctrina TEAC a las holdings. ¿Resistirían una inspección hoy?
      3. **Simulación 2030**: Proyecta la inflación de bases y la expiración de pactos.
      4. **Hoja de Ruta**: Define 3 acciones inmediatas con fundamento legal (Cita Leyes).
      
      Output: Informe Pericial.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    return response.text || "Error en optimización.";
  } catch (error) {
    console.error("Gemini Thinking Error:", error);
    return "Error en servicio de pensamiento profundo.";
  }
};

export const createChatSession = () => {
    return ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION
        }
    });
};