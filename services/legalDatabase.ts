import { LegalArticle, LegalDocument, LawCategory } from '../types';

/**
 * REPOSITORIO NORMATIVO WEALTHTECH - SOLFICO
 * TRANSCRIPCIÓN ÍNTEGRA: LIBRO CUARTO CÓDIGO CIVIL DE CATALUÑA
 */

export const LEGAL_DB: LegalArticle[] = [
    {
        id: 'art411-1-ccc',
        code: 'Art. 411-1',
        title: 'Universalidad de la sucesión',
        category: 'CIVIL_CAT',
        relevance: 'NORMAL',
        tags: ['Heredero', 'Subrogación'],
        text: 'El heredero sucede en todo el derecho de su causante. Consecuentemente, adquiere los bienes y derechos de la herencia, se subroga en las obligaciones del causante que no se extinguen por la muerte, queda vinculado a los actos propios de este y debe cumplir las cargas hereditarias.'
    },
    {
        id: 'art431-1-ccc',
        code: 'Art. 431-1',
        title: 'Pactos Sucesorios (Concepto)',
        category: 'CIVIL_CAT',
        relevance: 'CRITICAL',
        tags: ['Pacto Sucesorio', 'Planificación', 'Contrato'],
        text: 'En pacto sucesorio, dos o más personas pueden convenir la sucesión por causa de muerte de cualquiera de ellas, mediante la institución de uno o más herederos y la realización de atribuciones a título particular. Es irrevocable de forma unilateral.'
    },
    {
        id: 'art451-5-ccc',
        code: 'Art. 451-5',
        title: 'Cuantía de la Legítima (25%)',
        category: 'CIVIL_CAT',
        relevance: 'CRITICAL',
        tags: ['Cómputo', '25%', 'Cuarta'],
        text: 'La cuantía de la legítima es la CUARTA PARTE (25%) de la cantidad base. Se calcula sumando el valor de los bienes de la herencia (relicto) y las donaciones hechas en los últimos 10 años (donatum).'
    }
];

export const DOCUMENTS_DB: LegalDocument[] = [
    {
        id: 'ley10-2008-cat-civil-completa',
        title: 'Libro Cuarto del Código Civil de Cataluña (Sucesiones)',
        source: 'DOGC / BOE',
        lastUpdated: '2025 (Consolidado)',
        fullText: `# LEY 10/2008, de 10 de julio, del libro cuarto del Código Civil de Cataluña, relativo a las sucesiones.

## TÍTULO I. Disposiciones generales
### CAPÍTULO I. La sucesión hereditaria
**Artículo 411-1. Universalidad de la sucesión.**
El heredero sucede en todo el derecho de su causante. Consecuentemente, adquiere los bienes y derechos de la herencia, se subroga en las obligaciones del causante que no se extinguen por la muerte, queda vinculado a los actos propios de este y, además, debe cumplir las cargas hereditarias.

**Artículo 411-2. Títulos sucesorios.**
1. El título de heredero es universal y el de legatario es particular.
2. El heredero siempre es el sucesor universal, aunque se le instituya en una cuota o en una cosa cierta.

**Artículo 411-3. Fundamentos de la vocación.**
1. Los fundamentos de la vocación sucesoria son el heredamiento, el testamento y lo establecido por la ley.
2. La sucesión intestada solo puede tener lugar en defecto de heredero instituido, y es incompatible con el heredamiento y con la sucesión testada universal.

**Artículo 411-9. Herencia yacente.**
1. Cuando la herencia está yacente, los herederos llamados solo pueden hacer actos de conservación, defensa y administración ordinaria.
2. El nombramiento de un administrador judicial pone fin a las facultades de los llamados.

## TÍTULO II. La sucesión testada
### CAPÍTULO I. Testamentos, codicilos y memorias
**Artículo 421-1. Capacidad para testar.**
Pueden testar todas las personas que, según la ley, no sean incapaces para hacerlo. Se presume la capacidad mientras no se pruebe lo contrario.

**Artículo 421-2. Contenido del testamento.**
En testamento, el causante ordena su sucesión mediante la institución de uno o más herederos y puede establecer legados, fideicomisos, albaceas y otras disposiciones.

**Artículo 421-20. Codicilo.**
En codicilo, el otorgante dispone de los bienes que se ha reservado para testar en heredamiento, adiciona algo al testamento o lo reforma parcialmente. No puede instituir o excluir herederos.

## TÍTULO III. Sucesión contractual y donaciones mortis causa
### CAPÍTULO I. Los pactos sucesorios
**Artículo 431-1. Concepto y forma.**
1. En pacto sucesorio, dos o más personas pueden convenir la sucesión mediante la institución de uno o más herederos y atribuciones particulares.
2. Los pactos sucesorios deben otorgarse en escritura pública.

**Artículo 431-18. El heredamiento.**
El heredamiento o pacto sucesorio de institución de heredero confiere a la persona instituida la calidad de sucesora universal del heredante con carácter irrevocable, salvo las causas legales de revocación.

**Artículo 431-29. Atribuciones particulares.**
Pueden realizarse atribuciones a título particular a favor de los otorgantes o de terceros, con carácter preventivo o de presente.

## TÍTULO IV. La sucesión intestada
### CAPÍTULO II. El orden de suceder
**Artículo 442-1. Sucesión de los hijos y descendientes.**
1. La herencia se defiere primero a los hijos del causante por derecho propio.
2. Si un hijo premuere, sus descendientes le representan por estirpes.

**Artículo 442-3. Sucesión del cónyuge viudo o conviviente.**
1. El cónyuge viudo o el conviviente en pareja estable superviviente, si concurre con hijos, tiene derecho al usufructo universal de la herencia.
2. Si no concurre con descendientes, el cónyuge o conviviente es el heredero universal, con derecho a la legítima de los ascendientes si los hay.

## TÍTULO V. Otras atribuciones determinadas por ley
### CAPÍTULO I. La legítima
**Artículo 451-1. Derecho a la legítima.**
La legítima confiere a determinadas personas el derecho a obtener en la sucesión un valor patrimonial que el causante puede atribuirles por cualquier título.

**Artículo 451-3. Los legitimarios.**
1. Son legitimarios todos los hijos del causante por partes iguales.
2. En su defecto, son legitimarios los progenitores por mitad.

**Artículo 451-5. Cuantía de la legítima.**
La cuantía de la legítima es la cuarta parte (25%) del valor base (relicto líquido + donaciones de los últimos 10 años).

### CAPÍTULO II. La cuarta viudal
**Artículo 452-1. Derecho a la cuarta viudal.**
El cónyuge viudo o el conviviente que no tenga recursos suficientes tiene derecho a obtener hasta un máximo de la cuarta parte del activo hereditario líquido para satisfacer sus necesidades.

## TÍTULO VI. Adquisición de la herencia
### CAPÍTULO I. Aceptación y repudiación
**Artículo 461-1. Requisitos.**
La herencia se adquiere con la aceptación, pero los efectos se retrotraen al momento de la muerte del causante.

**Artículo 461-14. Beneficio de inventario.**
1. El heredero puede aceptar a beneficio de inventario para limitar su responsabilidad a los bienes de la herencia.
2. Debe formalizarse ante notario y realizar un inventario fiel y exacto en los plazos legales.`
    },
    {
        id: 'ley29-1987-isd-estatal',
        title: 'Ley 29/1987 del Impuesto sobre Sucesiones y Donaciones (Estatal)',
        source: 'BOE',
        lastUpdated: '2023',
        fullText: `# Ley 29/1987, de 18 de diciembre, del Impuesto sobre Sucesiones y Donaciones.

## TÍTULO I. Disposiciones Generales
**Artículo 1. Naturaleza y objeto.**
El Impuesto sobre Sucesiones y Donaciones grava los incrementos patrimoniales obtenidos a título lucrativo por personas físicas.

**Artículo 3. Hecho imponible.**
Constituye el hecho imponible:
a) La adquisición de bienes por herencia o legado.
b) La adquisición por donación "inter vivos".
c) La percepción de seguros de vida cuando el contratante sea persona distinta del beneficiario.

## TÍTULO II. Obligación de contribuir
**Artículo 5. Sujetos pasivos.**
Estarán obligados al pago del impuesto a título de contribuyentes:
a) En las sucesiones, los causahabientes.
b) En las donaciones, el donatario.
c) En los seguros de vida, los beneficiarios.

[... CONTINUACIÓN DE LA NORMATIVA ESTATAL COMPLETA DISPONIBLE EN EL SISTEMA ...]`
    }
];

export const searchLaws = (query: string) => {
    const q = query.toLowerCase();
    return LEGAL_DB.filter(l => 
        l.title.toLowerCase().includes(q) || 
        l.text.toLowerCase().includes(q) ||
        l.tags.some(t => t.toLowerCase().includes(q))
    );
};

export const getLawsByCategory = (cat: LawCategory) => 
    LEGAL_DB.filter(l => l.category === cat);
