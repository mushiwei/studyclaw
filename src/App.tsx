/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Sparkles, 
  Menu, 
  BookOpen, 
  CheckSquare, 
  ShieldAlert, 
  X,
  Home,
  Compass,
  GraduationCap
} from 'lucide-react';
import { TabType, Toast } from './types';
import HomeView from './components/HomeView';
import HomeworkAgent from './components/HomeworkAgent';
import TeacherAgent from './components/TeacherAgent';
import PreviewAgent from './components/PreviewAgent';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Function to trigger elegant toast alerts in client area
  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    const newToast: Toast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto purge toast after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleSwitchTab = (tab: TabType) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      
      {/* Sticky Floating Glass Navigation Bar - UI/UX Pro Max Guideline */}
      <div className="sticky top-4 z-40 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 hidden sm:block">
        <nav id="applet_navbar" className="bg-white/90 backdrop-blur-md shadow-md border border-slate-200/80 rounded-2xl">
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            
            {/* Logo Brand Layout */}
            <div 
              id="navbar_logo_brand"
              onClick={() => handleSwitchTab('home')}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-650 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-blue-500/15 group-hover:scale-105 transition-all duration-200">
                S
              </div>
              
              <div>
                <div className="text-sm font-extrabold text-slate-900 leading-tight">StudyClaw</div>
                <div className="text-[10px] text-slate-500 font-semibold tracking-wide">全闭环学情诊断系统</div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="hidden sm:flex gap-1.5 items-center overflow-x-auto scrollbar-none" id="navbar_tab_controller">
              <button 
                type="button"
                id="tab_trigger_home"
                onClick={() => handleSwitchTab('home')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'home' 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.01]' 
                    : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>首页</span>
              </button>

              <button 
                type="button"
                id="tab_trigger_homework"
                onClick={() => handleSwitchTab('homework')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'homework' 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.01]' 
                    : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>作业宝</span>
              </button>

              <button 
                type="button"
                id="tab_trigger_classroom"
                onClick={() => handleSwitchTab('classroom')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'classroom' 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.01]' 
                    : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>听课宝</span>
              </button>

              <button 
                type="button"
                id="tab_trigger_preview"
                onClick={() => handleSwitchTab('preview')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'preview' 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.01]' 
                    : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>预习宝</span>
              </button>
            </div>

          </div>
        </nav>
      </div>

      {/* Main Core View Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 sm:py-10 w-full flex-grow">
        
        {currentTab === 'home' && (
          <HomeView onSwitchTab={handleSwitchTab} />
        )}

        {currentTab === 'homework' && (
          <HomeworkAgent onShowToast={showToast} />
        )}

        {currentTab === 'classroom' && (
          <TeacherAgent onShowToast={showToast} />
        )}

        {currentTab === 'preview' && (
          <PreviewAgent onShowToast={showToast} />
        )}

      </main>

      {/* Mobile Bottom Navigation Dock */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/60 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-4 py-2.5 px-2">
          {[
            { id: 'home', name: '首页', icon: Home },
            { id: 'homework', name: '作业宝', icon: BookOpen },
            { id: 'classroom', name: '听课宝', icon: GraduationCap },
            { id: 'preview', name: '预习宝', icon: Compass }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                id={`mobile_tab_${tab.id}`}
                onClick={() => handleSwitchTab(tab.id as TabType)}
                className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isActive 
                    ? 'text-indigo-600 font-bold scale-102' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-405'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] mt-0.5 leading-none transition-colors ${isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 font-medium'}`}>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Footer Section */}
      <footer className="w-full bg-white border-t border-slate-150 py-6 text-center text-xs text-slate-400 font-medium pb-24 sm:pb-6">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p>© 2026 StudyClaw 数字化智能诊断伴学系统 · 体验演示版</p>
          <p className="text-[10px] text-slate-300">所有数据为仿真模拟生成，用于功能演示与流程体验，完美闭环可测试性</p>
        </div>
      </footer>

      {/* Global Fixed floating alert Toasts list box */}
      <div 
        id="applet_toast_portal" 
        className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map(toast => {
          const colors = {
            info: 'bg-blue-600 text-white shadow-blue-500/15',
            success: 'bg-emerald-600 text-white shadow-emerald-500/15',
            warning: 'bg-amber-500 text-white shadow-amber-500/15',
            error: 'bg-red-600 text-white shadow-red-500/15'
          };

          return (
            <div 
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-xl shadow-lg border border-white/10 animate-fade-in-up flex items-start gap-2.5 transition-all duration-300 ${colors[toast.type]}`}
            >
              <div className="flex-1 text-xs font-semibold leading-normal">
                {toast.message}
              </div>
              
              <button 
                type="button"
                onClick={() => removeToast(toast.id)}
                className="hover:scale-105 active:scale-95 text-white/80 hover:text-white transition-transform cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
