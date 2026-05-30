/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  BookOpen, 
  X,
  Home,
  Compass,
  GraduationCap,
  NotebookPen,
  Sparkles
} from 'lucide-react';
import { TabType, Toast } from './types';
import HomeView from './components/HomeView';
import HomeworkAgent from './components/HomeworkAgent';
import TeacherAgent from './components/TeacherAgent';
import PreviewAgent from './components/PreviewAgent';
import { Badge, Card, cn } from './components/ui';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const navItems: Array<{ id: TabType; name: string; icon: typeof Home; note: string; accent: string }> = [
    { id: 'home', name: '首页', icon: Home, note: '品牌总览', accent: 'bg-slate-100 text-slate-500' },
    { id: 'preview', name: '预习宝', icon: Compass, note: '课前准备', accent: 'bg-emerald-50 text-emerald-600' },
    { id: 'classroom', name: '听课宝', icon: GraduationCap, note: '课堂跟进', accent: 'bg-amber-50 text-amber-600' },
    { id: 'homework', name: '复习宝', icon: BookOpen, note: '课后巩固', accent: 'bg-blue-50 text-blue-600' },
  ];

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e2e8f0_0,transparent_28rem),radial-gradient(circle_at_top_right,#dbeafe_0,transparent_24rem),#f8fafc] flex flex-col justify-between">
      
      {/* Sticky Floating Glass Navigation Bar - UI/UX Pro Max Guideline */}
      <div className="sticky top-4 z-40 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 hidden sm:block">
        <nav id="applet_navbar" className="rounded-[28px] border border-slate-200/80 bg-white/95 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            
            {/* Logo Brand Layout */}
            <div
              id="navbar_logo_brand"
              onClick={() => handleSwitchTab('home')}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className="relative flex h-11 w-11 items-center justify-center rounded-[18px] bg-slate-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)] transition-all duration-200 group-hover:scale-105">
                <NotebookPen className="h-4.5 w-4.5" />
                <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                  <Sparkles className="h-2.5 w-2.5" />
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-extrabold tracking-[-0.02em] text-slate-900 leading-tight">ai学堂</div>
                  <Badge tone="slate" className="px-2 py-0.5 text-[9px]">学习支持平台</Badge>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-medium tracking-wide text-slate-500">
                  <span>让预习、听课与复习更连贯</span>
                  <span className="hidden md:block h-1 w-1 rounded-full bg-slate-300" />
                  <span className="hidden md:block">专注小学学习过程</span>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="hidden sm:flex gap-2 items-center overflow-x-auto scrollbar-none" id="navbar_tab_controller">
              {navItems.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    id={`tab_trigger_${tab.id}`}
                    onClick={() => handleSwitchTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-200',
                      isActive
                        ? 'bg-slate-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.12)] scale-[1.01]'
                        : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                    )}
                  >
                    <div className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-xl',
                      isActive ? 'bg-white/10' : tab.accent
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left leading-tight">
                      <div>{tab.name}</div>
                      <div className={cn('text-[10px] font-medium', isActive ? 'text-slate-300' : 'text-slate-400')}>
                        {tab.note}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </nav>
      </div>

      {/* Main Core View Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 sm:py-10 w-full flex-grow">
        {currentTab !== 'home' && (
          <div className="mb-6 hidden items-center justify-between sm:flex">
            <div className="space-y-1">
                <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">ai学堂 Workspace</div>
              <div className="text-lg font-semibold tracking-[-0.02em] text-slate-900">
                {navItems.find((item) => item.id === currentTab)?.name}
              </div>
            </div>
            <Badge tone="slate" className="px-3 py-1.5 text-[10px]">
              当前页面为学习流程演示模块
            </Badge>
          </div>
        )}
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
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-[0_-10px_30px_rgba(15,23,42,0.08)]">
        <div className="grid grid-cols-4 px-2 py-2.5">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                id={`mobile_tab_${tab.id}`}
                onClick={() => handleSwitchTab(tab.id as TabType)}
                className={`flex flex-col items-center justify-center rounded-2xl px-1.5 py-1 transition-all cursor-pointer ${
                  isActive 
                    ? 'text-slate-900 font-bold scale-102' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`p-2 rounded-2xl transition-all ${
                  isActive ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-405'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`mt-1 text-[10px] leading-none transition-colors ${isActive ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'}`}>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Footer Section */}
      <footer className="w-full border-t border-slate-150 bg-white/85 py-6 text-center text-xs font-medium text-slate-400 backdrop-blur pb-24 sm:pb-6">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p>© 2026 ai学堂 学习支持平台 · 体验版</p>
          <p className="text-[10px] text-slate-300">页面内容与数据均为功能演示所用，主要用于展示产品流程与交互形态</p>
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
            <Card
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-2.5 border-white/10 p-4 text-white animate-fade-in-up transition-all duration-300 ${colors[toast.type]}`}
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
            </Card>
          );
        })}
      </div>

    </div>
  );
}
