import React, { useState, useEffect } from 'react';
import { DRLOverview } from './DRLOverview';
import { ActivityList } from './ActivityList';
import { Award, ListFilter } from 'lucide-react';
export const DRLModule = () => {
    const [currentSubTab, setCurrentSubTab] = useState(() => {
        return localStorage.getItem('ueh_tracker_drl_subtab') || 'overview';
    });
    useEffect(() => {
        localStorage.setItem('ueh_tracker_drl_subtab', currentSubTab);
    }, [currentSubTab]);
    return (<div className="space-y-6">
      {/* Sub Navigation Bar - Flat & Minimal */}
      <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 border border-slate-200 w-fit mx-auto">
        <button onClick={() => setCurrentSubTab('overview')} className={`py-1.5 px-4 rounded-md text-xs font-medium transition-colors flex items-center gap-2 ${currentSubTab === 'overview'
            ? 'bg-white text-slate-900 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'}`}>
          <Award className="w-3.5 h-3.5"/>
          <span>Tổng quan & Tiêu chí</span>
        </button>

        <button onClick={() => setCurrentSubTab('activities')} className={`py-1.5 px-4 rounded-md text-xs font-medium transition-colors flex items-center gap-2 ${currentSubTab === 'activities'
            ? 'bg-white text-slate-900 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'}`}>
          <ListFilter className="w-3.5 h-3.5"/>
          <span>Danh sách Hoạt động</span>
        </button>
      </div>

      {/* Tab Contents */}
      {currentSubTab === 'overview' ? (<DRLOverview onSwitchToActivities={() => setCurrentSubTab('activities')}/>) : (<ActivityList />)}
    </div>);
};
