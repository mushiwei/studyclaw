/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import {
  Bot,
  ArrowRight,
  GraduationCap,
  Compass,
  Camera,
  BarChart3,
  Lightbulb,
  ClipboardCheck
} from 'lucide-react';
import { TabType } from '../types';
import { Badge, Button, Card, SectionTitle } from './ui';

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
      <Card
        glow
        className="relative overflow-hidden px-6 py-12 text-center md:px-12 md:py-16"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98)), radial-gradient(60% 60% at 10% 0%, rgba(219,234,254,0.7) 0%, transparent 72%), radial-gradient(50% 60% at 90% 10%, rgba(226,232,240,0.7) 0%, transparent 70%)'
        }}
        id="home_hero_section"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-100/80 to-transparent" />
        <Badge tone="slate" className="relative mb-6 px-4 py-1.5 text-xs">
          <span>ai学堂 · 陪孩子走完整个学习过程</span>
        </Badge>
        
        <h1 className="relative mx-auto mb-6 max-w-4xl font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-slate-900 sm:text-5xl">
          ai学堂，让预习、听课和复习<br className="sm:hidden" />连成一条线
        </h1>
        
        <p className="relative mx-auto mb-8 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          从课前准备到课后巩固，把零散的学习环节整理成连续可跟进的过程，
          让学生更清楚、老师更省心、家长也更容易看懂。
        </p>
        
        <div className="relative flex w-full max-w-sm flex-col justify-center gap-3.5 mx-auto sm:max-w-none sm:flex-row">
          <Button
            id="btn_home_start_experience"
            onClick={() => {
              const el = document.getElementById('agents-highlight-title');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
          >
            <span>查看三大功能</span>
          </Button>
          
          <Button
            id="btn_home_direct_homework"
            onClick={() => onSwitchTab('homework')}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            <ClipboardCheck className="w-4 h-4 text-slate-500" />
            <span>直接进入复习宝</span>
          </Button>
        </div>

        <div className="section-divider mx-auto mt-8 max-w-3xl" />
        <div className="relative mt-6 grid gap-3 text-left sm:grid-cols-3">
          {[
            ['预习宝', '课前准备', '提前梳理重点，减少课堂陌生感', 'text-emerald-600 bg-emerald-50'],
            ['听课宝', '课堂跟进', '记录掌握情况，便于老师及时调整', 'text-amber-600 bg-amber-50'],
            ['复习宝', '课后巩固', '从错因到练习，形成持续改进', 'text-blue-600 bg-blue-50'],
          ].map(([name, title, desc, tone]) => (
            <div key={name} className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-4">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${tone}`}>{name}</span>
                <div className="text-sm font-semibold tracking-[-0.01em] text-slate-900">{title}</div>
              </div>
              <div className="mt-2 text-xs leading-6 text-slate-500">{desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Agents Spotlight */}
      <div id="agents-section" className="space-y-8">
        <SectionTitle
          align="center"
          title={<span id="agents-highlight-title">三大学习模块，组成 ai学堂 的完整学习链路</span>}
          description="每个模块各自独立使用，也可以从课前到课后连续衔接"
        />

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 3: Homework Agent */}
          <Card
            id="card_home_agent_homework"
            onClick={() => onSwitchTab('homework')}
            className="order-3 group relative cursor-pointer overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(37,99,235,0.08)]"
          >
            <div className="absolute inset-x-6 top-0 h-px bg-slate-200" />
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-xl font-bold text-slate-800">复习宝</h3>
              <span className="text-xs text-slate-400">课后巩固</span>
            </div>
            
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              围绕作业批改、错因整理和同类题巩固，帮助孩子把一次练习真正转化成稳定掌握。
            </p>
            
            <div className="flex flex-wrap gap-1.5 mb-6">
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-600 rounded-lg">分步批改</span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-600 rounded-lg">错因整理</span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-600 rounded-lg">巩固练习</span>
            </div>
            
            <div className="flex items-center gap-1 text-[13px] font-semibold text-blue-600 group-hover:gap-2 transition-all">
              <span>立即体验</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Card>

          {/* Card 2: Classroom Teacher Agent */}
          <Card
            id="card_home_agent_teacher"
            onClick={() => onSwitchTab('classroom')}
            className="order-2 group relative cursor-pointer overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(245,158,11,0.08)]"
          >
            <div className="absolute inset-x-6 top-0 h-px bg-slate-200" />
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
              <GraduationCap className="w-6 h-6" />
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-xl font-bold text-slate-800">听课宝</h3>
              <span className="text-xs text-slate-400">课堂支持</span>
            </div>
            
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              围绕板书、语音和课堂记录，帮助老师更快梳理重难点、掌握情况和需要重点关注的学生。
            </p>
            
            <div className="flex flex-wrap gap-1.5 mb-6">
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-600 rounded-lg">课堂记录</span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-600 rounded-lg">掌握分析</span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-600 rounded-lg">跟进建议</span>
            </div>
            
            <div className="flex items-center gap-1 text-[13px] font-semibold text-amber-600 group-hover:gap-2 transition-all">
              <span>立即体验</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Card>

          {/* Card 1: Preview Agent */}
          <Card
            id="card_home_agent_preview"
            onClick={() => onSwitchTab('preview')}
            className="order-1 group relative cursor-pointer overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(5,150,105,0.08)]"
          >
            <div className="absolute inset-x-6 top-0 h-px bg-slate-200" />
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
              <Compass className="w-6 h-6" />
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-xl font-bold text-slate-800">预习宝</h3>
              <span className="text-xs text-slate-400">课前准备</span>
            </div>
            
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              提前梳理新课目标、重点概念和随堂小测，让学生带着问题进课堂，减少上课时的陌生感。
            </p>
            
            <div className="flex flex-wrap gap-1.5 mb-6">
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-600 rounded-lg">目标梳理</span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-600 rounded-lg">伴读提问</span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-600 rounded-lg">课前自测</span>
            </div>
            
            <div className="flex items-center gap-1 text-[13px] font-semibold text-emerald-600 group-hover:gap-2 transition-all">
              <span>立即体验</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Card>
        </div>
      </div>

      {/* Numeric Highlights Wall */}
      <Card className="p-8" id="home_stats_wall">
        <SectionTitle
          align="center"
          eyebrow={<Badge tone="slate">平台概览</Badge>}
          title="平台能力总览"
          description="围绕小学课堂和作业场景，提供可持续跟进的学习支持能力"
        />

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 px-5 py-6 text-center space-y-1">
            <div className="text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
              {subjects}
            </div>
            <div className="text-xs font-semibold tracking-[0.01em] text-slate-600">覆盖学科</div>
            <div className="text-[11px] text-slate-400">语数英 + 科学 + 道德法治</div>
          </div>
          
          <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 px-5 py-6 text-center space-y-1">
            <div className="text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
              {grades}
            </div>
            <div className="text-xs font-semibold tracking-[0.01em] text-slate-600">服务学段</div>
            <div className="text-[11px] text-slate-400">小学 1-6 年级</div>
          </div>
          
          <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 px-5 py-6 text-center space-y-1">
            <div className="text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
              {modules}
            </div>
            <div className="text-xs font-semibold tracking-[0.01em] text-slate-600">评估诊断维度</div>
            <div className="text-[11px] text-slate-400">5 + 4 + 3 = 12 项核心学情考核机制</div>
          </div>
          
          <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 px-5 py-6 text-center space-y-1">
            <div className="text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
              {simulations.toLocaleString()}
            </div>
            <div className="text-xs font-semibold tracking-[0.01em] text-slate-600">已处理学情量</div>
            <div className="text-[11px] text-slate-400">页面演示中的学习任务处理量</div>
          </div>
        </div>
      </Card>

      {/* Infrastructure Platform Base */}
      <Card className="bg-gradient-to-br from-white via-slate-50/80 to-blue-50/60 p-8" id="home_platform_features">
        <SectionTitle
          align="center"
          eyebrow={<Badge tone="emerald">底层能力</Badge>}
          title="ai学堂 系统基础能力"
          description="为三个学习场景提供统一的数据整理、分析与跟进能力"
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col space-y-3 rounded-3xl border border-slate-200/70 bg-white/95 p-5">
            <div className="text-indigo-600"><Bot className="w-8 h-8" /></div>
            <h3 className="font-bold text-slate-800 text-sm">多环节协同诊断</h3>
            <p className="text-slate-500 text-xs leading-relaxed flex-1">
              围绕预习、听课和复习建立连续衔接，让同一个学习问题能被持续跟进。
            </p>
          </div>

          <div className="flex flex-col space-y-3 rounded-3xl border border-slate-200/70 bg-white/95 p-5">
            <div className="text-blue-600"><Camera className="w-8 h-8" /></div>
            <h3 className="font-bold text-slate-800 text-sm">多模态采集与识别</h3>
            <p className="text-slate-500 text-xs leading-relaxed flex-1">
              支持课堂语音、板书照片和文本记录，让线下学习过程也能被清晰整理。
            </p>
          </div>

          <div className="flex flex-col space-y-3 rounded-3xl border border-slate-200/70 bg-white/95 p-5">
            <div className="text-amber-600"><BarChart3 className="w-8 h-8" /></div>
            <h3 className="font-bold text-slate-800 text-sm">长期数字画像存储</h3>
            <p className="text-slate-500 text-xs leading-relaxed flex-1">
              用更连续的方式记录成长变化，帮助老师和家长回看阶段表现和进步趋势。
            </p>
          </div>

          <div className="flex flex-col space-y-3 rounded-3xl border border-slate-200/70 bg-white/95 p-5">
            <div className="text-emerald-600"><Lightbulb className="w-8 h-8" /></div>
            <h3 className="font-bold text-slate-800 text-sm">可解释性诊断底座</h3>
            <p className="text-slate-500 text-xs leading-relaxed flex-1">
              每一次判断都尽量对应真实的学习表现，让反馈更容易理解，也更便于后续跟进。
            </p>
          </div>
        </div>
      </Card>

      {/* Whole Day Cycle Progress List */}
      <Card className="p-6 sm:p-8" id="home_daily_cycle">
        <SectionTitle
          align="center"
          eyebrow={<Badge tone="amber">学习闭环</Badge>}
          title="一天的完整闭环学情协同"
          description="把课前、课中、课后的信息串联起来，减少重复判断和断层跟进"
        />

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="relative rounded-3xl border border-emerald-200/70 bg-emerald-50/50 p-6">
            <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow-md">1</div>
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-5 h-5 text-emerald-650" />
              <span className="font-bold text-emerald-800 text-sm">课前预习 · 预习宝</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">学生输入三年级“认识分数”</p>
            <p className="text-xs text-emerald-600 font-semibold leading-relaxed">
              帮助学生先认识重点概念，并带着明确问题进入课堂。
            </p>
          </div>

          <div className="relative rounded-3xl border border-amber-200/70 bg-amber-50/50 p-6">
            <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white shadow-md">2</div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-5 h-5 text-amber-650" />
              <span className="font-bold text-amber-800 text-sm">课中听讲 · 听课宝</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">老师一键拍照板书 / 录入练习表现</p>
            <p className="text-xs text-amber-600 font-semibold leading-relaxed">
              帮助老师快速看到课堂掌握情况，并及时调整提问和讲解重点。
            </p>
          </div>

          <div className="relative rounded-3xl border border-blue-200/70 bg-blue-50/50 p-6">
            <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-md">3</div>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardCheck className="w-5 h-5 text-blue-650" />
              <span className="font-bold text-blue-800 text-sm">课后消化 · 复习宝</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">孩子拍照上传手写习题解答</p>
            <p className="text-xs text-blue-600 font-semibold leading-relaxed">
              及时发现错因和薄弱点，并配合相近练习完成巩固。
            </p>
          </div>
        </div>
      </Card>

      {/* Empty gap for beautiful clean baseline */}
      <div className="h-4" />
    </div>
  );
}
