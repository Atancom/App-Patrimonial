import React from 'react';
import { RiskAlert, RiskLevel } from '../types';
import { Icons } from './Icons';

interface RiskCardProps {
  alert: RiskAlert;
}

const RiskCard: React.FC<RiskCardProps> = ({ alert }) => {
  const getStyles = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.HIGH:
        return {
            border: 'border-rose-900', // Muted dark red/burgundy
            bg: 'bg-white',
            badge: 'bg-rose-900 text-white',
            title: 'text-rose-950'
        };
      case RiskLevel.MEDIUM:
        return {
            border: 'border-yellow-700', // Bronze/Gold tone
            bg: 'bg-white',
            badge: 'bg-yellow-700 text-white',
            title: 'text-yellow-900'
        };
      case RiskLevel.LOW:
        return {
            border: 'border-emerald-800', // Deep green
            bg: 'bg-white',
            badge: 'bg-emerald-800 text-white',
            title: 'text-emerald-900'
        };
      default:
        return { border: 'border-slate-400', bg: 'bg-white', badge: 'bg-slate-600 text-white', title: 'text-slate-800' };
    }
  };

  const styles = getStyles(alert.level);

  return (
    <div className={`p-5 rounded shadow-sm border-l-4 ${styles.border} bg-white transition-all hover:shadow-md border-y border-r border-slate-200`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-serif font-bold text-sm uppercase tracking-wide flex items-center gap-2 ${styles.title}`}>
           {alert.title}
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
            {alert.category}
        </span>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed font-light">{alert.description}</p>
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Recomendación:</span>
        <span className="text-xs font-medium text-slate-800">{alert.recommendation}</span>
      </div>
    </div>
  );
};

export default RiskCard;