/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  BookOpen, 
  Layout, 
  Layers, 
  Database, 
  Eye, 
  HelpCircle, 
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Compass,
  Camera,
  BarChart3,
  Lightbulb,
  ClipboardCheck
} from 'lucide-react';
import { TabType } from '../types';

interface HomeViewProps {
  onSwitchTab: (tab: TabType) => void;
}

export default function HomeView({ onSwitchTab }: HomeViewProps) {
  // Animated statistics counters
  const [subjects, setSubjects] = useState(0);
  const [grades, setGrades] = useState(0);
  const [modules, setModules] = useState(0);
  const [simulations, setSimulations] = useState(0);

  useEffect(() => {
    // Subject timer (aiming for 5)
    let subTimer = setInterval(() => {
      setSubjects(prev => {
        if (prev >= 5) {
          clearInterval(subTimer);
          return 5;
        }
        return prev + 1;
      });
    }, 120);

    // Grades timer (aiming for 6)
    let gradeTimer = setInterval(() => {
      setGrades(prev => {
        if (prev >= 6) {
          clearInterval(gradeTimer);
          return 6;
        }
        return prev + 1;
      });
    }, 100);

    // Modules timer (aiming for 12)
    let moduleTimer = setInterval(() => {
      setModules(prev => {
        if (prev >= 12) {
          clearInterval(moduleTimer);
          return 12;
        }
        return prev + 1;
      });
    }, 80);

    // Simulations timer (aiming for 9826)
    const targetSims = 9826;
    const startTime = Date.now();
    const duration = 1200; // 1.2s

    const runSim = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function
      const value = Math.floor(progress * targetSims);
      setSimulations(value);
      if (progress < 1) {
        requestAnimationFrame(runSim);
      }
    };
    runSim();

    return () => {
      clearInterval(subTimer);
      clearInterval(gradeTimer);
      clearInterval(moduleTimer);
    };
  }, []);

  return (
    <div className="space-y-10 animate-fade-in-up md:px-2">
      {/* Hero Section */}
      <div 
        className="relative rounded-2xl py-12 md:py-16 px-6 md:px-12 text-center overflow-hidden border border-white/80 bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-200/60"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(240,253,250,0.88)), radial-gradient(70% 70% at 10% 0%, var(--color-blue-100) 0%, transparent 72%), radial-gradient(60% 70% at 90% 10%, var(--color-emerald-100) 0%, transparent 70%)'
        }}
        id="home_hero_section"
      >
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/80 border border-blue-100 text-blue-700 text-xs font-bold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ai学堂 教育智能体平台 · Demo333</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 mb-6 tracking-tight leading-tight max-w-4xl mx-auto">
          让 AI 走进每一堂课、<br className="sm:hidden" />每一份作业、每一次预习
        </h1>
        
        <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          三大智能体协同作战，从课前预习到课中听讲，再到课后作业诊断，
          让因材施教从理论变成可量化、可追溯、可闭环的真实学习产品。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3.5 justify-center w-full max-w-sm mx-auto sm:max-w-none">
          <button 
            type="button"
            id="btn_home_start_experience"
            onClick={() => {
              const el = document.getElementById('agents-highlight-title');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer text-sm sm:text-base"
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-100 animate-pulse" />
              <span>智能闭环体验</span>
            </div>
          </button>
          
          <button 
            type="button"
            id="btn_home_direct_homework"
            onClick={() => onSwitchTab('homework')}
            className="w-full sm:w-auto px-8 py-3.5 bg-white/90 hover:bg-white text-slate-700 rounded-xl font-semibold border border-slate-200 shadow-sm active:scale-[0.98] transition-all cursor-pointer text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <ClipboardCheck className="w-4 h-4 text-slate-500" />
            <span>直接看复习宝</span>
          </button>
        </div>
      </div>

      {/* Agents Spotlight */}
      <div id="agents-section" className="space-y-8">
        <div className="text-center space-y-2">
          <h2 id="agents-highlight-title" className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            三大智能体，覆盖学习全场景
          </h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm">
            每一个智能体都是一整套多技能协同的 Agent 工作流，可独立运行、交叉反馈
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 3: Homework Agent */}
          <div 
            id="card_home_agent_homework"
            onClick={() => onSwitchTab('homework')}
            className="order-3 group bg-white rounded-2xl border border-slate-100 shadow-sm p-6 cursor-pointer hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-xl font-bold text-slate-800">复习宝</h3>
              <span className="text-xs font-mono text-slate-400">Homework Agent</span>
            </div>
            
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              一键多模态批改 → 5维漏洞诊断 → 长期知识画像 → 梯度变式训练。协助孩子实现“做一道题，会一类题”。
            </p>
            
            <div className="flex flex-wrap gap-1.5 mb-6">
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-600 rounded-lg">5项核心技能</span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-600 rounded-lg">小学全科支持</span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-600 rounded-lg">动态画像</span>
            </div>
            
            <div className="flex items-center gap-1 text-[13px] font-semibold text-blue-600 group-hover:gap-2 transition-all">
              <span>立即体验</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Classroom Teacher Agent */}
          <div 
            id="card_home_agent_teacher"
            onClick={() => onSwitchTab('classroom')}
            className="order-2 group bg-white rounded-2xl border border-slate-100 shadow-sm p-6 cursor-pointer hover:-translate-y-1.5 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:bg-amber-100 transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-xl font-bold text-slate-800">听课宝</h3>
              <span className="text-xs font-mono text-slate-400">Teacher Agent</span>
            </div>
            
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              支持板写、语音 or 文字多入口采集笔记，一键提取关键学情！提供教学质量评分和精确到人的易错点名单。
            </p>
            
            <div className="flex flex-wrap gap-1.5 mb-6">
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-600 rounded-lg">4项高能技能</span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-600 rounded-lg">老师/班主任提效</span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-600 rounded-lg">长期学情追溯</span>
            </div>
            
            <div className="flex items-center gap-1 text-[13px] font-semibold text-amber-600 group-hover:gap-2 transition-all">
              <span>立即体验</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 1: Preview Agent */}
          <div 
            id="card_home_agent_preview"
            onClick={() => onSwitchTab('preview')}
            className="order-1 group bg-white rounded-2xl border border-slate-100 shadow-sm p-6 cursor-pointer hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors">
              <Compass className="w-6 h-6" />
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-xl font-bold text-slate-800">预习宝</h3>
              <span className="text-xs font-mono text-slate-400">Preview Agent</span>
            </div>
            
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              输入即将上的新章，基于学生个性化学习偏好与痛点生成定制任务卡、答疑伴学并预测课堂听透率。
            </p>
            
            <div className="flex flex-wrap gap-1.5 mb-6">
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-600 rounded-lg">3项高效技能</span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-600 rounded-lg">大朋友式伴写</span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-600 rounded-lg">自查闭环</span>
            </div>
            
            <div className="flex items-center gap-1 text-[13px] font-semibold text-emerald-600 group-hover:gap-2 transition-all">
              <span>立即体验</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Numeric Highlights Wall */}
      <div className="bg-white/95 rounded-2xl border border-white/80 shadow-sm ring-1 ring-slate-200/60 p-8" id="home_stats_wall">
        <div className="text-center mb-8 space-y-1">
          <h2 className="text-xl font-bold text-slate-800">平台能力总览</h2>
          <p className="text-xs text-slate-400">基于 ai学堂 系统的 Agent 编排与长期数字画像存储支撑</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent font-display">
              {subjects}
            </div>
            <div className="text-xs font-semibold text-slate-600">覆盖学科</div>
            <div className="text-[11px] text-slate-400">语数英 + 科学 + 道德法治</div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-amber-500 to-orange-600 bg-clip-text text-transparent font-display">
              {grades}
            </div>
            <div className="text-xs font-semibold text-slate-600">服务学段</div>
            <div className="text-[11px] text-slate-400">小学 1-6 年级</div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-emerald-500 to-teal-600 bg-clip-text text-transparent font-display">
              {modules}
            </div>
            <div className="text-xs font-semibold text-slate-600">评估诊断维度</div>
            <div className="text-[11px] text-slate-400">5 + 4 + 3 = 12 项核心学情考核机制</div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-rose-500 to-pink-600 bg-clip-text text-transparent font-display">
              {simulations.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-slate-600">已处理学情量</div>
            <div className="text-[11px] text-slate-400">模拟批改与伴学实测数据</div>
          </div>
        </div>
      </div>

      {/* Infrastructure Platform Base */}
      <div className="bg-gradient-to-br from-white via-blue-50/70 to-emerald-50/60 rounded-2xl p-8 border border-white/80 shadow-sm ring-1 ring-slate-200/60" id="home_platform_features">
        <div className="text-center mb-8 space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">ai学堂 系统基础底座</h2>
          <p className="text-xs md:text-sm text-slate-600">为三个智能体提供一致的基础编排、多模态解析和长期档案库</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-slate-150 shadow-sm flex flex-col space-y-3">
            <div className="text-indigo-600"><Bot className="w-8 h-8" /></div>
            <h3 className="font-bold text-slate-800 text-sm">多环节协同诊断</h3>
            <p className="text-slate-500 text-xs leading-relaxed flex-1">
              基于精细化的链式调起定位机制，全面打通并承接课前课后个性化辅导决策流。
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-slate-150 shadow-sm flex flex-col space-y-3">
            <div className="text-blue-600"><Camera className="w-8 h-8" /></div>
            <h3 className="font-bold text-slate-800 text-sm">多模态采集与识别</h3>
            <p className="text-slate-500 text-xs leading-relaxed flex-1">
              支持语音ASR、黑板/解题草纸拍照OCR文字识别，将线下物理纸张与声波无电离感知。
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-slate-150 shadow-sm flex flex-col space-y-3">
            <div className="text-amber-600"><BarChart3 className="w-8 h-8" /></div>
            <h3 className="font-bold text-slate-800 text-sm">长期数字画像存储</h3>
            <p className="text-slate-500 text-xs leading-relaxed flex-1">
              建立跨学期、多学科的成长行为数据库；实现从低到高学年的错因、认知盲点跨级追索。
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-slate-150 shadow-sm flex flex-col space-y-3">
            <div className="text-emerald-600"><Lightbulb className="w-8 h-8" /></div>
            <h3 className="font-bold text-slate-800 text-sm">可解释性诊断底座</h3>
            <p className="text-slate-500 text-xs leading-relaxed flex-1">
              杜绝黑盒评分，所有的能力定性均有直接解题错步作为扎实依据，输出让家长跟老师放心的报告。
            </p>
          </div>
        </div>
      </div>

      {/* Whole Day Cycle Progress List */}
      <div className="bg-white/95 rounded-2xl border border-white/80 shadow-sm ring-1 ring-slate-200/60 p-6 sm:p-8" id="home_daily_cycle">
        <div className="text-center mb-8 space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">一天的完整闭环学情协同</h2>
          <p className="text-xs md:text-sm text-slate-500">学情随场景流转，实现无死角服务链条</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="relative bg-emerald-50/50 p-5 rounded-xl border border-emerald-200/60">
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-500 text-white font-extrabold flex items-center justify-center text-xs shadow-md">1</div>
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-5 h-5 text-emerald-650" />
              <span className="font-bold text-emerald-800 text-sm">课前预习 · 预习宝</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">学生输入三年级“认识分数”</p>
            <p className="text-xs text-emerald-600 font-semibold leading-relaxed">
              → 提供12分钟个性预习包 + 辅导答疑，预估上课听透率从65%提升。
            </p>
          </div>

          <div className="relative bg-amber-50/50 p-5 rounded-xl border border-amber-200/60">
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-amber-500 text-white font-extrabold flex items-center justify-center text-xs shadow-md">2</div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-5 h-5 text-amber-650" />
              <span className="font-bold text-amber-800 text-sm">课中听讲 · 听课宝</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">老师一键拍照板书 / 录入练习表现</p>
            <p className="text-xs text-amber-600 font-semibold leading-relaxed">
              → 5分钟生成全班多维度掌握矩阵与重难点纠偏建议，并精准预埋提问点。
            </p>
          </div>

          <div className="relative bg-blue-50/50 p-5 rounded-xl border border-blue-200/60">
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-500 text-white font-extrabold flex items-center justify-center text-xs shadow-md">3</div>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardCheck className="w-5 h-5 text-blue-650" />
              <span className="font-bold text-blue-800 text-sm">课后消化 · 复习宝</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">孩子拍照上传手写习题解答</p>
            <p className="text-xs text-blue-600 font-semibold leading-relaxed">
              → 获得无痛批改与知识漏洞跨学年定性溯源，提供同源变式巩固，确保会做一类题。
            </p>
          </div>
        </div>
      </div>

      {/* Empty gap for beautiful clean baseline */}
      <div className="h-4" />
    </div>
  );
}
