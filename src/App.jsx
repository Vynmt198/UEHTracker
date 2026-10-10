import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { OnboardingModal } from './components/OnboardingModal';
import { Loader2 } from 'lucide-react';

// Code Splitting & Dynamic Imports for large screens
const SmartPlanner = lazy(() =>
  import('./components/planner/SmartPlanner').then((m) => ({ default: m.SmartPlanner }))
);
const GPADashboard = lazy(() =>
  import('./components/gpa/GPADashboard').then((m) => ({ default: m.GPADashboard }))
);
const DRLModule = lazy(() =>
  import('./components/drl/DRLModule').then((m) => ({ default: m.DRLModule }))
);
const ForumPlaceholder = lazy(() =>
  import('./components/forum/ForumPlaceholder').then((m) => ({ default: m.ForumPlaceholder }))
);

const ModuleLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-slate-500 animate-in fade-in duration-300">
    <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200">
      <Loader2 className="w-6 h-6 animate-spin text-[#49C8D6]" />
    </div>
    <span className="text-xs font-medium text-slate-500">Đang tải phân hệ...</span>
  </div>
);

const MainLayout = () => {
  const { activeTab, profile } = useApp();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Trigger onboarding modal on initial visit if not onboarded yet
  useEffect(() => {
    if (!profile.isOnboarded) {
      setShowOnboarding(true);
    }
  }, [profile.isOnboarded]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* 1. Menu thanh trượt có thể đóng mở (Collapsible Slide Bar) */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onOpenOnboarding={() => setShowOnboarding(true)}
      />

      {/* Main Content Area with dynamic transition for sidebar */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Suspense fallback={<ModuleLoadingFallback />}>
            <div key={activeTab} className="animate-in fade-in duration-200 ease-in-out">
              {activeTab === 'planner' && <SmartPlanner isMainView={true} />}
              {activeTab === 'gpa' && <GPADashboard />}
              {activeTab === 'drl' && <DRLModule />}
              {activeTab === 'forum' && <ForumPlaceholder />}
            </div>
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="UEH Tracker Logo" 
                className="w-5 h-5 rounded object-contain" 
              />
              <span className="font-semibold text-slate-700">UEH Tracker</span>
              <span>• Đồng hành cùng sinh viên UEH</span>
            </div>

            <div className="text-[11px]">
              <span>Chuẩn hóa thang điểm 4.0 & quy chế ĐRL UEH</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </div>
  );
};

export const App = () => {
  return <MainLayout />;
};

export default App;
