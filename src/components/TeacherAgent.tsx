/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Mic, 
  FileText, 
  TrendingUp, 
  CheckSquare, 
  Check, 
  RotateCcw, 
  Sparkles, 
  User, 
  Users, 
  Share2, 
  Download, 
  AlertTriangle,
  BookOpen,
  BarChart3,
  Folder,
  Link,
  AlertCircle,
  Calendar,
  Shield
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  LineChart, 
  Line 
} from 'recharts';
import { NotesSourceType, ClKnowledgePoint, ClWeakPoint, ClReviewItem, ClKnowledgePointHistory } from '../types';

interface TeacherAgentProps {
  onShowToast: (msg: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

export default function TeacherAgent({ onShowToast }: TeacherAgentProps) {
  // Configured states
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia('(max-width: 640px)').matches);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [activeTab, setActiveTab] = useState<NotesSourceType>('board');
  const [selectedClass, setSelectedClass] = useState('三年级 2 班');
  const [selectedTopic, setSelectedTopic] = useState('多边形面积');

  const [isRunning, setIsRunning] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([1]);
  const [stepLoading, setStepLoading] = useState<Record<number, boolean>>({});
  const [currentStep, setCurrentStep] = useState(1);

  // Student list & trend states in Step 4
  const [archiveMode, setArchiveMode] = useState<'student' | 'class'>('student');
  const [selectedStudent, setSelectedStudent] = useState('小明');

  const stepRefs = {
    1: useRef<HTMLDivElement>(null),
    2: useRef<HTMLDivElement>(null),
    3: useRef<HTMLDivElement>(null),
    4: useRef<HTMLDivElement>(null)
  };

  // Mock static data for Classroom note elements
  const notesContent = {
    manualText: `1. 长方形 S = ab（a代表长，b代表宽）\n2. 正方形 S = a²\n3. 三角形 S = ah/2（核心易错点：必须÷2）\n4. 平行四边形 S = ah（注意：h是垂直的高，千万不要把斜边当成高）\n5. 梯形 S = (a+b)h/2（a代表上底，b代表下底）\n6. 易错点备记：三角形与梯形求解忘记÷2，属于最常见的漏除粗心错误\n7. 堂内课堂测试数据：3道面积求积算法套用训练，全班答错率集中在平行四边形高和梯形公式运算顺序上\n8. 需要重点关注的学生：小明、李华、张伟在梯形代数和斜边换算上连续三次解错`,
    voiceSnippet: `好，今天这节课我们来学习多边形面积的计算公式。首先回顾一下长方形的面积是长乘宽，正方形是边长自乘。重点是三角形面积，等于底乘高再除以二，大家一定要刻意留心这个“除以二”，因为一个三角形在面积上只能算等底等高长方形的一半。平行四边形则是底乘高，要尤其注意这个“高”一定是两条底线之间的垂直高度，不要被题目特意画出的侧斜边骗了，这个特别容易算错。最后是梯形公式，上底加下底的和，乘高再除以二。同学们重点留意三角形与梯形公式末端的除以二。接下来我们进入几道测试题看看大家课内消化的程度...`
  };

  const masteryData: ClKnowledgePoint[] = [
    { point: "长方形面积 S=ab", mastery: 95, evidence: "课内基础随堂全对", suggestion: "已完全巩固" },
    { point: "正方形面积 S=a²", mastery: 92, evidence: "边长换算完全掌握", suggestion: "已完全巩固" },
    { point: "三角形面积得解", mastery: 70, evidence: "30%的学生解题忘记末尾除以2", suggestion: "在下次上课黑板上进行折纸演示" },
    { point: "平行四边形的高认定", mastery: 58, evidence: "42%的学生误把侧面斜线边高当成高", suggestion: "设计垂直高动态教具辨析" },
    { point: "梯形面积复合求算", mastery: 45, evidence: "未理解括号运算，计算顺序与除以2大量做错", suggestion: "公式推导回退，重点面授重讲" }
  ];

  const weakPoints: ClWeakPoint[] = [
    { rank: 1, content: "梯形复杂代数公式：多达 12 名学生因弄错运算优先级，将 (上底+下底)×高÷2 写错，或漏掉括号漏乘", student_count: 12, severity: "high" },
    { rank: 2, content: "平行四边形高的找寻：误认“斜面倾斜长”为对应的垂直高，被图谱斜边诱导", student_count: 9, severity: "high" },
    { rank: 3, content: "三角形漏除以 2 事故：单纯套公式忘记乘 1/2 的物理对称切片意义", student_count: 7, severity: "mid" },
    { rank: 4, content: "求积单位不一致：分米、平方分米、米在混合运算前未作前提换算", student_count: 5, severity: "mid" },
    { rank: 5, content: "复合拼接多边形求面积：多边形整体分割和填补拼接法缺乏几何直觉力", student_count: 4, severity: "low" }
  ];

  const reportComparison = {
    class_score: 82,
    previous_score: 76,
    improvement: 6,
    radar_dimensions: [
      { name: '公式套用率', 本节课: 80, 上节课: 75 },
      { name: '高垂直掌握', 本节课: 70, 上节课: 68 },
      { name: '计算防错率', 本节课: 78, 上节课: 72 },
      { name: '几何分割直觉', 本节课: 60, 上节课: 58 },
      { name: '课代表效率', 本节课: 75, 上节课: 70 },
      { name: '笔记完整度', 本节课: 88, 上节课: 80 }
    ],
    bar_indicators: [
      { name: '学生参与度', 本节课: 85, 上节课: 78 },
      { name: '笔记收录率', 本节课: 88, 上节课: 80 },
      { name: '基本公式合格', 本节课: 75, 上节课: 72 },
      { name: '重难点破冰率', 本节课: 78, 上节课: 70 }
    ],
    teaching_advice: "建议在接下来的下节课开头进行5分钟复习：\n1. 利用“拼折法”或硬卡纸将两个完全一样的三角形拼接成长方形，强化“三角形是长方形一半”的硬直觉，防漏「÷2」；\n2. 面授时通过垂直教具演示，若高发生倾斜，实际高度（垂直面）在缩短这一常理，区分倾斜边与垂直高；\n3. 安排一到两组梯形（包含括号级混合）计算作为快闪测验。\n\n⚠️ 本次重灾预估需要个性点名辅导的学生：小明、李华、张伟（他们在多边形和高的识别概念上连续出错）。",
    reviewList: [
      { id: 1, content: "演示三角形面积除以 2 的硬拼折法", priority: "高" },
      { id: 2, content: "平行四边形“垂直高”与斜边的高度教具折射讲解", priority: "高" },
      { id: 3, content: "梯形面积混合计算题排错会", priority: "高" },
      { id: 4, content: "长度与面积多重换算机制复讲", priority: "中" },
      { id: 5, content: "拼接组合形状分割方法实践", priority: "中" }
    ] as ClReviewItem[]
  };

  // Student trend mock data
  const studentTrends = {
    labels: ["第1周", "第2周", "第3周", "第4周", "第5周", "第6周", "第7周", "第8周", "第9周", "第10周", "第11周", "第12周"],
    student: [
      { name: '数学', data: [62, 65, 68, 70, 72, 71, 75, 78, 80, 79, 82, 85] },
      { name: '语文', data: [70, 72, 71, 75, 73, 76, 78, 77, 80, 82, 81, 83] },
      { name: '英语', data: [55, 58, 62, 60, 65, 68, 66, 70, 72, 74, 73, 76] }
    ],
    class: [
      { name: '数学', data: [68, 70, 71, 73, 74, 75, 77, 78, 80, 79, 81, 82] },
      { name: '语文', data: [72, 73, 75, 76, 75, 77, 78, 80, 81, 80, 82, 84] },
      { name: '英语', data: [60, 62, 64, 66, 67, 68, 70, 71, 72, 73, 74, 75] }
    ]
  };

  const archiveData: ClKnowledgePointHistory[] = [
    { point: "整数连算率", w3: 75, w6: 80, w9: 85, w12: 88, trend: "up" },
    { point: "小数加减精算", w3: 60, w6: 65, w9: 72, w12: 78, trend: "up" },
    { point: "分数基本比高", w3: null, w6: 50, w9: 65, w12: 72, trend: "up" },
    { point: "简易代数平面图形", w3: 70, w6: 72, w9: 75, w12: 82, trend: "up" },
    { point: "多边面积套用法", w3: null, w6: null, w9: 60, w12: 75, trend: "up" },
    { point: "分数建模应用题", w3: 55, w6: 58, w9: 62, w12: 68, trend: "up" }
  ];

  // Helper mapping 1-12 weeks line data
  const getLineData = () => {
    const list = archiveMode === 'class' ? studentTrends.class : studentTrends.student;
    const array = studentTrends.labels.map((lbl, idx) => {
      return {
        name: lbl,
        数学: list[0].data[idx] + (archiveMode === 'student' && selectedStudent === '小红' ? 5 : 0), // small variations for student toggle
        语文: list[1].data[idx],
        英语: list[2].data[idx]
      };
    });
    return array;
  };

  const startAnalysisSequence = async () => {
    setIsRunning(true);
    setCurrentStep(1);
    setVisibleSteps([1]);

    // Step 2: Classroom Intelligent Engine
    setStepLoading(prev => ({ ...prev, 2: true }));
    setVisibleSteps(prev => [...prev, 2]);
    setCurrentStep(2);
    scrollToSection(2);
    await sleep(2000);
    setStepLoading(prev => ({ ...prev, 2: false }));
    onShowToast('✓ 提取课堂关键公式知识结构成功！全班掌握度已完成统计', 'success');

    // Step 3: School report
    setStepLoading(prev => ({ ...prev, 3: true }));
    setVisibleSteps(prev => [...prev, 3]);
    setCurrentStep(3);
    scrollToSection(3);
    await sleep(1800);
    setStepLoading(prev => ({ ...prev, 3: false }));
    onShowToast('✓ 针对性学情报告（包含对比雷达）及AI教学方案已导出', 'success');

    // Step 4: Archive trace
    setStepLoading(prev => ({ ...prev, 4: true }));
    setVisibleSteps(prev => [...prev, 4]);
    setCurrentStep(4);
    scrollToSection(4);
    await sleep(1500);
    setStepLoading(prev => ({ ...prev, 4: false }));
    setIsRunning(false);
    onShowToast('✓ 关联至该班长期学生画像数据库成功，开启长期追本溯源', 'success');
  };

  const handleReset = () => {
    setVisibleSteps([1]);
    setCurrentStep(1);
    setIsRunning(false);
    setStepLoading({});
    onShowToast('已重置分析面板，可再次添加演示', 'success');
  };

  const scrollToSection = (step: number) => {
    setTimeout(() => {
      const ref = stepRefs[step as keyof typeof stepRefs];
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Intro Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/70 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>听课学情分析中心 · 4 项全链路诊断流</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">听课宝 · 课堂重难点提取与错题透视演示</h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
          通过上传任意黑板照、上课原声甚至随堂演课笔记，提取全班知识掌握谱，定位易错人员、定制下一步干预方案。
        </p>
      </div>

      {/* Progress Indicators */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none py-1">
          {['手稿采集', '学情分析诊断', '课堂对比报告', '成长档案归纳'].map((name, idx) => {
            const stepNum = idx + 1;
            const isUnlocked = visibleSteps.includes(stepNum);
            const isCurrent = currentStep === stepNum;
            const isLoading = stepLoading[stepNum];

            return (
              <div key={idx} className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-350 ${
                    isCurrent 
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20 active:scale-105 animate-pulse' 
                      : isUnlocked 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isUnlocked && stepNum < currentStep && !isLoading ? '✓' : stepNum}
                </div>
                
                <span className={`text-xs whitespace-nowrap font-medium ${isCurrent ? 'text-amber-600 font-bold' : isUnlocked ? 'text-slate-750' : 'text-slate-400'}`}>
                  {name}
                </span>

                {idx < 3 && (
                  <div className={`h-[1px] w-6 sm:w-16 ${visibleSteps.includes(stepNum + 1) ? 'bg-amber-200' : 'bg-slate-100'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Capture Source面板 */}
      <div ref={stepRefs[1]} id="teacher_step_1" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-50 pb-4 gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <span className="w-8 h-8 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center text-xs font-bold font-mono flex-shrink-0">01</span>
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">班级课程与源生教材收录</h3>
              <div className="text-[10px] sm:text-[11px] text-slate-400">设定基本的班课维度，选用不同的多模态感知路径</div>
            </div>
          </div>
          <span className="px-2 py-0.5 text-[10px] bg-amber-50 text-amber-700 border border-amber-100 rounded-full font-medium w-fit">老师伴手</span>
        </div>

        {/* Configurations */}
        <div className="grid sm:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-650 block">👥 归属班级</label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none"
            >
              <option>三年级 2 班</option>
              <option>三年级 1 班</option>
              <option>四年级 1 班</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-650 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-500 animate-pulse" />
              <span>上课课题</span>
            </label>
            <input 
              type="text" 
              value={selectedTopic} 
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full mt-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-650 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>对应学科</span>
            </label>
            <div className="w-full mt-1.5 px-3 py-2 border border-slate-50 bg-slate-50 text-slate-700 rounded-lg text-xs font-bold">
              数学几何课
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-650 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>授课日期</span>
            </label>
            <div className="w-full mt-1.5 px-3 py-2 border border-slate-50 bg-slate-50 text-slate-500 rounded-lg text-xs font-mono">
              2026年5月25日
            </div>
          </div>
        </div>

        {/* Tabs for Multiple modalities */}
        <div className="border-b border-slate-100 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 -mb-px flex-nowrap whitespace-nowrap pb-1">
            <button 
              type="button"
              id="btn_cls_tab_board"
              onClick={() => setActiveTab('board')}
              className={`pb-2 px-4 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'board' 
                  ? 'border-amber-500 text-amber-700 font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>📷 拍照板书</span>
            </button>

            <button 
              type="button"
              id="btn_cls_tab_voice"
              onClick={() => setActiveTab('voice')}
              className={`pb-2 px-4 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'voice' 
                  ? 'border-amber-500 text-amber-700 font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>🎤 语音转写</span>
            </button>

            <button 
              type="button"
              id="btn_cls_tab_text"
              onClick={() => setActiveTab('text')}
              className={`pb-2 px-4 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'text' 
                  ? 'border-amber-500 text-amber-700 font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>手动文字</span>
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 min-h-[160px] flex flex-col justify-center">
          {activeTab === 'board' && (
            <div className="grid md:grid-cols-2 gap-4 animate-fade-in-up" id="cls_board_container">
              <div className="bg-slate-900 border-4 border-amber-900/40 rounded-xl p-4 text-emerald-450 relative aspect-[1.4/1] sm:aspect-[1.8/1] min-h-[170px] flex flex-col justify-between shadow-inner">
                {/* Board chalkboard vector simulation */}
                <div className="space-y-2 font-mono" id="cls_blackboard">
                  <p className="text-amber-400 font-bold text-sm">三年级2班 (李老师主讲)</p>
                  <div className="h-[1px] bg-emerald-800/60" />
                  <p className="text-xs text-slate-200">長方形 S = a × b  |  正方形 S = a²</p>
                  <p className="text-xs text-yellow-300">三角形 S = b × h ÷ 2  [注意: 除以2 ！]</p>
                  <p className="text-xs text-slate-200">平行四邊形 S = b × h  [注意: 高必须是垂直线]</p>
                  <p className="text-xs text-yellow-300">梯形 S = (a+b)h ÷ 2   [注意: 需除以2]</p>
                </div>
                <div className="text-[10px] text-slate-500 italic text-right">★ 板书OCR拍照上传.jpg</div>
              </div>

              <div className="flex flex-col justify-between text-xs space-y-2">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-xl text-amber-800 border border-amber-200/50 w-fit">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                  <span className="font-semibold text-[11px]">板书关键公式 OCR 智能识别流</span>
                </div>
                <div className="bg-white border border-slate-150 rounded-xl p-3 shadow-inner flex-1 flex flex-col min-h-0 overflow-hidden">
                  <pre className="font-mono text-[11px] leading-relaxed text-slate-600 overflow-y-auto max-h-[140px] whitespace-pre-wrap flex-1 scrollbar-thin">
                    {notesContent.manualText}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="space-y-4 animate-fade-in-up" id="cls_voice_container">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-rose-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center animate-pulse flex-shrink-0">
                    <Mic className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-800 break-all">classroom_geom_session_20260525.mp3</h4>
                    <p className="text-[10px] text-slate-400">音频大小 45MB | 上课实测时长 42分钟</p>
                  </div>
                </div>

                {/* Pulsating animation graph */}
                <div className="flex items-end gap-0.5 h-6 flex-shrink-0">
                  {[12, 24, 10, 32, 16, 28, 6, 20, 14, 30, 8, 22].map((h, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-rose-500 rounded-full flex-shrink-0 animate-glow-pulse" 
                      style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }} 
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white p-3 border border-slate-200 rounded-lg text-xs leading-relaxed space-y-1">
                <div className="text-[11px] font-bold text-slate-400 select-none border-b border-slate-50 pb-1 flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-slate-400" />
                  <span>语音提取流片段 (ASR) :</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed italic">“{notesContent.voiceSnippet}”</p>
              </div>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="animate-fade-in-up space-y-2" id="cls_text_container">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>老师备课笔记/课堂效果实录（支持自由修改）：</span>
              </span>
              <textarea 
                rows={6}
                value={notesContent.manualText}
                readOnly
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs leading-relaxed font-mono focus:outline-none"
              />
            </div>
          )}
        </div>

        <button 
          id="btn_cls_analyze"
          onClick={startAnalysisSequence}
          disabled={isRunning || currentStep > 1}
          className={`w-full py-3 px-6 rounded-xl text-white font-medium shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
            currentStep > 1 
              ? 'bg-emerald-500 shadow-emerald-550/10 cursor-not-allowed' 
              : 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-500/10 hover:from-amber-600 hover:to-orange-700 active:scale-[0.995]'
          }`}
        >
          {currentStep > 1 ? (
            <>
              <Check className="w-4 h-4" />
              <span>智能课堂分析已就绪 (可下拉阅览报告与长期档案)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" />
              <span>开始课堂透视 (自动流转后续评估模块)</span>
            </>
          )}
        </button>
      </div>

      {/* STEP 2: Classroom Intelligent Engine */}
      {visibleSteps.includes(2) && (
        <div ref={stepRefs[2]} id="teacher_step_2" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 animate-fade-in-up">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xs font-bold font-mono">02</span>
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-blue-600 animate-pulse" />
                <span>一、课堂学情分析诊断</span>
              </h3>
              <div className="text-[11px] text-slate-400">对板书/录音的教学重点及随堂表现交叉检索，量化全班掌握度边界</div>
            </div>
          </div>

          {stepLoading[2] ? (
            <div className="flex items-center justify-center py-12 gap-3" id="cls_step_2_loader">
              <div className="flex gap-1 animate-pulse">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full [animation-delay:0.1s]" />
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full [animation-delay:0.2s]" />
              </div>
              <span className="text-slate-500 text-xs font-medium">数学几何知识树与多维错因对映中...</span>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in-up" id="cls_step_2_content">
              {/* Analytics grid widget */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100/70 p-4 text-center flex flex-col justify-center">
                  <span className="text-[11px] font-semibold text-amber-800">全班当堂综合评分</span>
                  <div className="text-3xl font-extrabold text-amber-600 font-display mt-2">82</div>
                  <span className="text-[10px] text-slate-400 mt-1">/ 100 分 · 良等评定</span>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-105 p-4 flex flex-col justify-center">
                  <div className="flex justify-between items-center text-[11px] font-semibold text-blue-800">
                    <span>重难点覆盖饱和度</span>
                    <span>78%</span>
                  </div>
                  
                  <div className="w-full bg-white h-2.5 rounded-full overflow-hidden mt-3">
                    <div className="h-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{ width: '78%' }} />
                  </div>
                  <span className="text-[10px] text-slate-450 mt-2">5项重点，已扎实覆盖4项</span>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-4 flex flex-col justify-center text-center">
                  <span className="text-[11px] font-semibold text-emerald-800">李老师教学手稿完整评分</span>
                  <div className="text-2xl font-black text-emerald-600 font-display mt-1">88分</div>
                  <span className="text-[10px] text-slate-400 mt-1">含教学重点 + 例题，结构良好</span>
                </div>
              </div>

              {/* Horizontal Bar Chart for Knowledge structures */}
              <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-705">
                  <span>📈 几何概念当堂掌握度矩阵 (全班均值对照)</span>
                  <span className="text-[10px] text-slate-400">基于堂内互动表现评测</span>
                </div>

                <div className="w-full h-64 font-sans text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical" 
                      data={masteryData} 
                      margin={{ top: 10, right: 10, left: 4, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} />
                      <YAxis 
                        dataKey="point" 
                        type="category" 
                        tick={{ fill: '#334155', fontSize: isMobile ? 8 : 9.5 }} 
                        width={isMobile ? 70 : 100} 
                      />
                      <Tooltip />
                      <Bar dataKey="mastery" fill="#eab308" radius={[0, 6, 6, 0]} barSize={14}>
                        {
                          masteryData.map((entry, index) => {
                            const color = entry.mastery >= 80 ? '#10b981' : entry.mastery >= 60 ? '#f59e0b' : '#ef4444';
                            return <Bar key={`cell-${index}`} fill={color} />;
                          })
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Weak spots cards */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 justify-start">
                  <Shield className="w-4 h-4 text-slate-500 animate-pulse" />
                  <span>漏洞雷区 & 提问点预警点 (按严重错人数排序)</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-3">
                  {weakPoints.map((item, id) => {
                    return (
                      <div key={id} className="border border-slate-150 p-4 bg-white rounded-xl flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {item.rank}
                        </div>
                        
                        <div className="space-y-2 flex-1">
                          <p className="text-xs font-semibold text-slate-750 leading-relaxed">{item.content}</p>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">
                              涉及本班：<span className="text-slate-700 font-bold">{item.student_count} 名学生</span>
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              item.severity === 'high' 
                                ? 'bg-red-50 text-red-700 border border-red-100' 
                                : item.severity === 'mid' 
                                  ? 'bg-amber-50 text-amber-700' 
                                  : 'bg-emerald-50 text-emerald-800'
                            }`}>
                              {item.severity === 'high' ? '核心高危' : '中度卡点'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: School report generation */}
      {visibleSteps.includes(3) && (
        <div ref={stepRefs[3]} id="teacher_step_3" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 animate-fade-in-up">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="w-8 h-8 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xs font-bold font-mono">03</span>
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                <BarChart3 className="w-4.5 h-4.5 text-purple-600" />
                <span>二、学期对比与干预设计报告</span>
              </h3>
              <div className="text-[11px] text-slate-400">拉取历史指标进行本场多层级追涨对比，多维解析班级掌握情况</div>
            </div>
          </div>

          {stepLoading[3] ? (
            <div className="flex items-center justify-center py-12 gap-3" id="cls_step_3_loader">
              <div className="flex gap-1 animate-pulse">
                <div className="w-2 h-2 bg-purple-600 rounded-full" />
                <div className="w-2 h-2 bg-purple-600 rounded-full" />
                <div className="w-2 h-2 bg-purple-600 rounded-full" />
              </div>
              <span className="text-slate-500 text-xs font-medium">对比雷达及备课排课干预方案导出中...</span>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in-up" id="cls_step_3_content">
              {/* Report summary card */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-150 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-purple-700 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    本堂课 vs 历史同维长方形主题
                  </span>
                  <h4 className="text-slate-800 text-sm font-bold">班级数学总分均值提升 +6.0 分</h4>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-slate-400 line-through text-2xl font-black">76</p>
                    <p className="text-[10px] text-slate-400">上节平均</p>
                  </div>
                  <span className="text-lg text-purple-500 font-bold">→</span>
                  <div className="text-center font-display">
                    <p className="text-purple-600 text-3xl font-black">82</p>
                    <p className="text-[10px] text-purple-705 font-semibold">当堂平均</p>
                  </div>
                </div>
              </div>

              {/* Chart Side by side comparison */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-purple-500" />
                    <span>6维课堂教法评测能力雷达对比图</span>
                  </span>
                  <div className="w-full h-64 text-xs font-sans">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={isMobile ? "55%" : "75%"} data={reportComparison.radar_dimensions}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: '#334155' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: '#94a3b8' }} />
                        <Radar name="上节课" dataKey="上节课" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.02} strokeDasharray="3 3" />
                        <Radar name="本节课" dataKey="本节课" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.12} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-purple-500" />
                    <span>当堂学情细能数据条形对比图</span>
                  </span>
                  <div className="w-full h-64 text-xs font-sans">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportComparison.bar_indicators}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <YAxis tick={{ fill: '#64748b' }} domain={[0, 100]} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="上节课" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="本节课" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Teaching suggestions */}
              <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl p-4.5 space-y-2.5">
                <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1">
                  <span>👨‍🏫</span>
                  <span>AI 提效备课干预引导专栏</span>
                </h4>
                <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line">{reportComparison.teaching_advice}</p>
              </div>

              {/* Action item check notes */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-705">
                  <span className="flex items-center gap-1">
                    <CheckSquare className="w-4 h-4 text-amber-500 animate-bounce" />
                    <span>下节课提效排期复核表(学生可自勾选)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">一指禅备忘簿</span>
                </div>

                <div className="space-y-2">
                  {reportComparison.reviewList.map((st) => (
                    <label 
                      key={st.id} 
                      className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-slate-100 hover:bg-amber-50/20 cursor-pointer select-none transition-colors"
                    >
                      <input type="checkbox" className="w-4 h-4 accent-amber-500 rounded border-slate-200" />
                      <span className="text-xs text-slate-700 font-medium flex-1">{st.content}</span>
                      <span className={`px-1.5 py-0.5 text-[9px] rounded font-bold ${
                        st.priority === '高' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {st.priority}优先
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Button outputs */}
              <div className="flex flex-wrap gap-3">
                <button 
                  type="button"
                  id="btn_cls_export"
                  onClick={() => onShowToast('📄 当堂多边形学情透视诊断报告已一键导出至 Downloads/文件夹', 'success')}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold hover:from-purple-700 hover:to-indigo-700 text-white text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  <span>一键下载PDF详尽报告书</span>
                </button>

                <button 
                  type="button"
                  id="btn_cls_share"
                  onClick={() => onShowToast('报告概要 H5 卡片已成功投递至“三年级 2 班家校互联群”', 'success')}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-xs font-semibold hover:bg-slate-50 text-slate-700 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <Share2 className="w-4 h-4 text-slate-400" />
                  <span>分发到家长社群</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: Skill 4 Semester profile track */}
      {visibleSteps.includes(4) && (
        <div ref={stepRefs[4]} id="teacher_step_4" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 animate-fade-in-up">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="w-8 h-8 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center text-xs font-bold font-mono">04</span>
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                <Folder className="w-4.5 h-4.5 text-rose-600" />
                <span>三、长期数字成长档案关联</span>
              </h3>
              <div className="text-[11px] text-slate-400">将本堂表现沉淀并挂载到班级数字库中，开启学期跨越式成长轨迹回溯</div>
            </div>
          </div>

          {stepLoading[4] ? (
            <div className="flex items-center justify-center py-12 gap-3" id="cls_step_4_loader">
              <div className="flex gap-1 animate-pulse">
                <div className="w-2 h-2 bg-rose-600 rounded-full" />
                <div className="w-2 h-2 bg-rose-600 rounded-full" />
                <div className="w-2 h-2 bg-rose-600 rounded-full" />
              </div>
              <span className="text-slate-500 text-xs font-medium">成长归档与关联历史数据库中...</span>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in-up" id="cls_step_4_content">
              {/* Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/50">
                  <button 
                    type="button"
                    onClick={() => {
                      setArchiveMode('student');
                      onShowToast('已选中“个体档案”回溯', 'info');
                    }}
                    className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      archiveMode === 'student' 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-450 hover:text-slate-600'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>👤 学生个体画像</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      setArchiveMode('class');
                      onShowToast('已选中“班级平均”回溯', 'info');
                    }}
                    className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      archiveMode === 'class' 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-450 hover:text-slate-600'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>👥 班级平均趋势</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">检索关联学生：</span>
                  <select 
                    value={selectedStudent} 
                    onChange={(e) => {
                      setSelectedStudent(e.target.value);
                      onShowToast(`已载入 ${e.target.value} 的长期学情轨迹`, 'success');
                    }}
                    disabled={archiveMode === 'class'}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none bg-white font-sans text-slate-800 disabled:opacity-40"
                  >
                    {['小明', '小红', '李华', '王芳', '张伟'].map(name => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* semester trend Line chart */}
              <div className="bg-gradient-to-br from-rose-50/50 to-pink-50/50 rounded-xl p-5 border border-rose-100/80">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-slate-750 flex items-center gap-1">
                    <span>📈</span>
                    <span>{archiveMode === 'class' ? '三年级2班均线' : `${selectedStudent}`} · 语数英学学期双周波动趋势线</span>
                  </span>
                  <span className="text-[10px] text-slate-400">12 周滚动考点回追</span>
                </div>

                <div className="w-full h-80 text-xs font-sans">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getLineData()} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3/30" />
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
                      <YAxis domain={[40, 100]} tick={{ fill: '#64748b' }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="数学" stroke="#2563eb" strokeWidth={3} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="语文" stroke="#ea580c" strokeWidth={2} />
                      <Line type="monotone" dataKey="英语" stroke="#16a34a" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* semester trace details table charts */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span>历史错点跨周期自动挂网监测表（数学几何考卷）</span>
                  </span>
                  {isMobile && (
                    <span className="text-[10px] text-amber-600 font-semibold animate-pulse">← 左右滑动以查看完整内容 →</span>
                  )}
                </div>
                
                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-xs text-left whitespace-nowrap min-w-[640px]">
                    <thead className="bg-slate-50 uppercase text-slate-500 border-b border-slate-100">
                      <tr>
                        <th className="p-2 sm:p-3 font-semibold">几何知识细点</th>
                        <th className="p-2 sm:p-3 font-semibold text-center">第 3 周表现</th>
                        <th className="p-2 sm:p-3 font-semibold text-center">第 6 周表现</th>
                        <th className="p-2 sm:p-3 font-semibold text-center">第 9 周表现</th>
                        <th className="p-2 sm:p-3 font-semibold text-center">第 12 周表现</th>
                        <th className="p-2 sm:p-3 font-semibold text-center">波动评估</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-105">
                      {archiveData.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/55 transition-colors">
                          <td className="p-2 sm:p-3 font-bold text-slate-750">{item.point}</td>
                          <td className="p-2 sm:p-3 text-center">
                            {item.w3 === null ? (
                              <span className="text-slate-300">未开课</span>
                            ) : (
                              <span className={`font-semibold ${item.w3 >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{item.w3}</span>
                            )}
                          </td>
                          <td className="p-2 sm:p-3 text-center">
                            {item.w6 === null ? (
                              <span className="text-slate-300">未开课</span>
                            ) : (
                              <span className={`font-semibold ${item.w6 >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{item.w6}</span>
                            )}
                          </td>
                          <td className="p-2 sm:p-3 text-center">
                            {item.w9 === null ? (
                              <span className="text-slate-300">未开课</span>
                            ) : (
                              <span className={`font-semibold ${item.w9 >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{item.w9}</span>
                            )}
                          </td>
                          <td className="p-2 sm:p-3 text-center">
                            <span className="font-semibold text-emerald-800">{item.w12}分 当堂</span>
                          </td>
                          <td className="p-2 sm:p-3 text-center text-emerald-605 font-bold">持续上扬 ↑</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* End button actions */}
              <div className="flex flex-wrap gap-2.5">
                <button 
                  type="button"
                  id="btn_cls_download_semester"
                  onClick={() => onShowToast(`📅 ${selectedStudent} 本学期12周全阶段成长档案已生成下载！`, 'success')}
                  className="px-5 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-655 hover:to-pink-700 text-white font-semibold text-xs rounded-lg shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Folder className="w-3.5 h-3.5 text-white" />
                  <span>下载学期跨科全景数据报告</span>
                </button>

                <button 
                  type="button"
                  id="btn_cls_copy_link"
                  onClick={() => onShowToast('🔗 已经复制长期轨迹分享加密链接: studyclaw.cn/record/p_9841', 'info')}
                  className="px-5 py-2 bg-white border border-slate-200 text-slate-805 hover:bg-slate-50 font-semibold text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Link className="w-3.5 h-3.5 text-slate-500" />
                  <span>拷贝一链通分享给教务</span>
                </button>
              </div>

              {/* Reset control */}
              <div className="text-center pt-4">
                <button 
                  type="button"
                  id="btn_cls_reset_all"
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-slate-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>清除老师课中诊断缓存，重新加载手稿</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
