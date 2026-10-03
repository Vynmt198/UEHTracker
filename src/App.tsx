import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { OnboardingModal } from './components/OnboardingModal';
import { GPADashboard } from './components/gpa/GPADashboard';
import { DRLModule } from './components/drl/DRLModule';
import { ScheduleDashboard } from './components/schedule/ScheduleDashboard';
import { ForumPlaceholder } from './components/forum/ForumPlaceholder';
import { Heart, Sparkles, GraduationCap } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, profile } = useApp();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Trigger onboarding modal on initial visit if not onboarded yet
  useEffect(() => {
    if (!profile.isOnboarded) {
      setShowOnboarding(true);
    }
  }, [profile.isOnboarded]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navigation */}
      <Navigation onOpenOnboarding={() => setShowOnboarding(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'gpa' && <GPADashboard />}
        {activeTab === 'drl' && <DRLModule />}
        {activeTab === 'schedule' && <ScheduleDashboard />}
        {activeTab === 'forum' && <ForumPlaceholder />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-800">UEH Tracker</span>
            <span>• Dành riêng cho sinh viên Đại học Kinh tế TP. Hồ Chí Minh (UEH)</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>Chuẩn hóa thang điểm 4.0 & quy chế ĐRL Đại học Kinh tế TP. Hồ Chí Minh</span>
          </div>
        </div>
      </footer>

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
