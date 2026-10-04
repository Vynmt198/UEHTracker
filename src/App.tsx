import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { OnboardingModal } from './components/OnboardingModal';
import { GPADashboard } from './components/gpa/GPADashboard';
import { DRLModule } from './components/drl/DRLModule';
import { SmartPlanner } from './components/planner/SmartPlanner';
import { ForumPlaceholder } from './components/forum/ForumPlaceholder';
import { GraduationCap } from 'lucide-react';

const MainLayout: React.FC = () => {
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
          <div key={activeTab} className="animate-in fade-in duration-200 ease-in-out">
            {activeTab === 'planner' && <SmartPlanner isMainView={true} />}
            {activeTab === 'gpa' && <GPADashboard />}
            {activeTab === 'drl' && <DRLModule />}
            {activeTab === 'forum' && <ForumPlaceholder />}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2.5">
              <img 
                src="/logo.png" 
                alt="UEH Tracker Logo" 
                className="w-6 h-6 rounded-md object-contain" 
              />
              <span className="font-semibold text-slate-800">UEH Tracker</span>
              <span>• Dành riêng cho sinh viên Đại học Kinh tế TP. Hồ Chí Minh (UEH)</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span>Chuẩn hóa thang điểm 4.0 & quy chế ĐRL Đại học Kinh tế TP. Hồ Chí Minh</span>
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

export const App: React.FC = () => {
  return <MainLayout />;
};

export default App;
