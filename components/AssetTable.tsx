import React from 'react';
import { Asset } from '../types';

interface AssetTableProps {
  assets: Asset[];
}

const AssetTable: React.FC<AssetTableProps> = ({ assets }) => {
  return (
    <div className="overflow-hidden bg-white rounded shadow-sm border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-[#0f172a] text-white">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Activo</th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Tipo</th>
            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest">Valor Mercado</th>
            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest">V. Referencia</th>
            <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest">Pacto</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {assets.map((asset, idx) => (
            <tr key={asset.id} className={`hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'}`}>
              <td className="px-6 py-4 font-serif text-slate-900 font-medium">{asset.name}</td>
              <td className="px-6 py-4 text-slate-500 text-xs uppercase tracking-wide">{asset.type}</td>
              <td className="px-6 py-4 text-right font-mono text-slate-700">{asset.marketValue.toLocaleString()} €</td>
              <td className={`px-6 py-4 text-right font-mono ${asset.referenceValue > asset.marketValue ? 'text-red-700 font-bold' : 'text-slate-500'}`}>
                {asset.referenceValue.toLocaleString()} €
              </td>
              <td className="px-6 py-4 text-center">
                {asset.isSuccessionPact ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-100">
                        Bloqueado 5a
                    </span>
                ) : (
                    <span className="text-slate-300">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetTable;