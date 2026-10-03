import React, { useState } from 'react';
import { DRLOverview } from './DRLOverview';
import { ActivityList } from './ActivityList';
import { Award, ListFilter, Sparkles } from 'lucide-react';

export const DRLModule: React.FC = () => {
  const [currentSubTab, setCurrentSubTab] = useState<'overview' | 'activities'>('overview');

  return (
    <div className="space-y-6">
      {/* Sub Navigation Bar */}
      <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs max-w-md mx-auto">
        <button
          onClick={() => setCurrentSubTab('overview')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            currentSubTab === 'overview'
              ? 'bg-[#29B3C2] text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Tổng quan & Tiêu chí</span>
        </button>

        <button
          onClick={() => setCurrentSubTab('activities')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            currentSubTab === 'activities'
              ? 'bg-[#29B3C2] text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>Danh sách Hoạt động</span>
        </button>
      </div>

      {/* Tab Contents */}
      {currentSubTab === 'overview' ? (
        <DRLOverview onSwitchToActivities={() => setCurrentSubTab('activities')} />
      ) : (
        <ActivityList />
      )}
    </div>
  );
};
