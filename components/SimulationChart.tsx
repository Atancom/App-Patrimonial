import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SimulationChart: React.FC = () => {
    // Hardcoded simulation data for the demo
    const data = [
      {
        name: 'Opción A: Donación Vida',
        ISD: 45000,
        IRPF_Donante: 85000,
        Plusvalia_Muni: 12000,
      },
      {
        name: 'Opción B: Herencia (Futuro)',
        ISD: 25000, // Cheaper due to reductions
        IRPF_Donante: 0, // "Plusvalía del muerto"
        Plusvalia_Muni: 12000,
      },
    ];
  
    return (
      <div className="h-80 w-full bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Escenario: Transmisión Inmueble (Valor 1M€)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 12}} />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()}€`} />
            <Legend />
            <Bar dataKey="ISD" stackId="a" fill="#8884d8" name="Impuesto Sucesiones/Donaciones" />
            <Bar dataKey="IRPF_Donante" stackId="a" fill="#ff8042" name="IRPF (Ganancia Patrimonial)" />
            <Bar dataKey="Plusvalia_Muni" stackId="a" fill="#82ca9d" name="Plusvalía Municipal" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default SimulationChart;