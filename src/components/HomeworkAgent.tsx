/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Check, 
  AlertCircle, 
  X, 
  HelpCircle, 
  Sparkles, 
  RotateCcw, 
  Award, 
  Zap, 
  BarChart3, 
  Grid, 
  BookOpen, 
  Flame, 
  ArrowRight,
  TrendingUp,
  Brain,
  Search,
  GraduationCap,
  Compass,
  FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend 
} from 'recharts';
import { 
  HwCorrectionStep, 
  HwGapItem, 
  HwVariationQuestion, 
  Toast 
} from '../types';
import { Badge, Button, Card, FieldLabel, Input, SectionTitle, Select, cn } from './ui';

interface HomeworkAgentProps {
  onShowToast: (msg: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

export default function HomeworkAgent({ onShowToast }: HomeworkAgentProps) {
  // Configured inputs
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia('(max-width: 640px)').matches);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [subject, setSubject] = useState('数学');
  const [grade, setGrade] = useState('三年级');
  const [questionText, setQuestionText] = useState('鸡兔同笼，共有头35个，脚94个，问鸡和兔各有几只？');

  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // steps: 1 to 6
  const [visibleSteps, setVisibleSteps] = useState<number[]>([1]);
  const [stepLoading, setStepLoading] = useState<Record<number, boolean>>({});

  // Variation question answers input state
  const [variationAnswers, setVariationAnswers] = useState<Record<number, string>>({
    1: '',
    2: '',
    3: '',
    4: ''
  });
  const [variationSubmitted, setVariationSubmitted] = useState(false);

  // References for smooth scrolling as features unlock
  const stepRefs = {
    1: useRef<HTMLDivElement>(null),
    2: useRef<HTMLDivElement>(null),
    3: useRef<HTMLDivElement>(null),
    4: useRef<HTMLDivElement>(null),
    5: useRef<HTMLDivElement>(null),
    6: useRef<HTMLDivElement>(null)
  };

  // Mock static data for Homework Agent values
  const correctionData = {
    total_score: 65,
    overall_comment: "整体方程列式完全正确，思维灵活。但在解题的过程中出现非整数中间值（y = 23.5 - 0.5x）时未做自然数合理性自检，且最终缺少「解后代回代」的闭环验证。建议学生养成『解完即验』的良好习惯。",
    steps: [
      { step: 1, student: "设鸡有 x 只，兔有 y 只", standard: "设鸡有 x 只，兔有 y 只", score: 10, max: 10, comment: "设未知数正确，代数规范", error_type: "none" },
      { step: 2, student: "x + y = 35;  2x + 4y = 94", standard: "x + y = 35;  2x + 4y = 94", score: 15, max: 15, comment: "方程组列式完全契合题意", error_type: "none" },
      { step: 3, student: "由②得 y = (94-2x)/4 = 23.5 - 0.5x，代入①解得 x = 23, y = 12", standard: "由②得 4y = 94 - 2x，直接整除消元，解得 x = 23, y = 12", score: 20, max: 30, comment: "计算结果虽对，但在中间步骤算出 23.5 只兔子未引起疑虑核实，小数缺乏物理解释", error_type: "calculation" },
      { step: 4, student: "答：鸡 23 只，兔 12 只", standard: "将 x=23, y=12 带回原方程验证后作答", score: 20, max: 45, comment: "关键扣分项！缺少代回验算说明，没有做到计算自检验证的严谨作风", error_type: "method" }
    ] as HwCorrectionStep[]
  };

  const diagnosisData = {
    gaps: ["二元方程消元（防越界/小数截断）", "整数解常识性逻辑约束", "解后带入验算闭环"],
    method_errors: ["分步求解未作整数域校验", "思维自检链断裂（‘算完了就不管’）"],
    blind_spots: ["忽略了鸡的数量必须是非负整数这种隐藏的生活常理约束", "缺乏数理结果的物理解释自省"],
    cognitive_level: "思维模型不完整（缺少后置验证机制）",
    weak_chain: [
      { gap: "代回方程验证习惯缺失", root_cause: "二年级末期「加减逆算验数」不扎实", grade: "二年级" },
      { gap: "数物一致性常理受阻", root_cause: "一年级「个数必须是非负整数」概念理解死板", grade: "一年级" }
    ],
    detailed: "该生具有极佳的代数建模直觉，能在第一时间构筑正确的联立二元一次方程组。但其推理链路存在『模型结果未回退到现实进行自检』的隐形缺陷。简言之，属于典型的“考试型直线性思维”。其在计算中途解出非整型的23.5时并未触发停顿检查机制，反映出对生活应用实物的概念脱节。该漏洞在溯源链路中直接指向了二年级阶段代数检验习惯的漏失。后续应引导建立每步整除边界校验以及“答前复验”机制。"
  };

  const portraitData = {
    summary: "本次习题作业暴露了学生在「应用验证」与「约束识别」上的突出卡点。计算基础非常不错，但思维边界严谨性偏弱。",
    gaps: [
      { knowledge_point: "解后代回校验机制", severity: "高", frequency: 3, root_chain: "二年级验数算律 → 三年级消元法验证" },
      { knowledge_point: "整型解边界校验", severity: "高", frequency: 2, root_chain: "一年级计量基础 → 三年级代数约束" },
      { knowledge_point: "分类求證严谨性", severity: "中", frequency: 1, root_chain: "二年级应用比大小 → 三年级分类讨论" }
    ] as HwGapItem[],
    radar_data: [
      { name: '计算能力', value: 75, full: 100 },
      { name: '概念理解', value: 60, full: 100 },
      { name: '应用能力', value: 45, full: 100 },
      { name: '方程思想', value: 35, full: 100 },
      { name: '逻辑推理', value: 55, full: 100 },
      { name: '表达能力', value: 70, full: 100 }
    ],
    suggestion: "重点攻克「方程思想」与「应用检验」。建议采用：1. 强制生成『检验区』草稿；2. 配合同类变式，连续进行带有‘非整数干扰项’的分类辨析专项训练。"
  };

  const variations: HwVariationQuestion[] = [
    { id: 1, difficulty: "基础", question: "笼子里有鸡和兔共 10 只，脚共 26 只。鸡和兔各有几只？", reference_answer: "鸡 7 只，兔 3 只", analysis: "设鸡 x 只兔 y 只：x + y = 10，2x + 4y = 26。解得 x=7, y=3。做完代入：7×2 + 3×4 = 26 ✓，全为非负整型，成立。" },
    { id: 2, difficulty: "中等", question: "学校组织 38 人去公园划船，租了 10 条船刚好坐满。大船坐 4 人，小船坐 3 人。问大船和小船各几条？", reference_answer: "大船 8 条，小船 2 条", analysis: "设大船 x 条，小船 y 条：x + y = 10，4x + 3y = 38。解得 x=8, y=2。代入验证：8×4 + 2×3 = 38 ✓。" },
    { id: 3, difficulty: "中等", question: "停车场停放了自行车和三轮车共 25 辆，轮子共 65 个。这两种车辆各有多少辆？", reference_answer: "自行车 10 辆，三轮车 15 辆", analysis: "设自行车 x 辆，三轮车 y 辆：x + y = 25，2x + 3y = 65。解得 x=10, y=15。轮子数：20 + 45 = 65 ✓。" },
    { id: 4, difficulty: "挑战", question: "笼中共有鸡、兔和蜘蛛三类动物共 13 只，共 62 条腿（已知蜘蛛有 8 条腿）。求鸡、兔和蜘蛛各多少只？", reference_answer: "鸡 4 只，兔 7 只，蜘蛛 2 只", analysis: "列三元一次方程组，再配合只数大于等于0的自然数限定进行消元剪枝求解：x + y + z = 13，2x + 4y + 8z = 62。经自推验证得此唯一解。" }
  ];

  const compareRadarData = [
    { name: '计算能力', 巩固前: 75, 巩固后: 82 },
    { name: '概念理解', 巩固前: 60, 巩固后: 75 },
    { name: '应用能力', 巩固前: 45, 巩固后: 70 },
    { name: '方程思想', 巩固前: 35, 巩固后: 78 },
    { name: '逻辑推理', 巩固前: 55, 巩固后: 72 },
    { name: '表达能力', 巩固前: 70, 巩固后: 80 }
  ];

  // Progressive skill pipeline trigger animation
  const triggerCorrectionSequence = async () => {
    setIsRunning(true);
    setCurrentStep(1);
    setVisibleSteps([1]);
    
    // Step 2: Multimodal Correction
    setStepLoading(prev => ({ ...prev, 2: true }));
    setVisibleSteps(prev => [...prev, 2]);
    setCurrentStep(2);
    scrollToSection(2);
    await sleep(1500);
    setStepLoading(prev => ({ ...prev, 2: false }));
    onShowToast('✓ 图像OCR解析完成！分步作业批改已生成', 'success');

    // Step 3: Vulnerability Diagnosis
    setStepLoading(prev => ({ ...prev, 3: true }));
    setVisibleSteps(prev => [...prev, 3]);
    setCurrentStep(3);
    scrollToSection(3);
    await sleep(1300);
    setStepLoading(prev => ({ ...prev, 3: false }));
    onShowToast('✓ 漏洞溯源定性成功！发现 2 个跨学年断点', 'info');

    // Step 4: Long-term Portrait
    setStepLoading(prev => ({ ...prev, 4: true }));
    setVisibleSteps(prev => [...prev, 4]);
    setCurrentStep(4);
    scrollToSection(4);
    await sleep(1500);
    setStepLoading(prev => ({ ...prev, 4: false }));
    onShowToast('✓ 结构化知识画像构建完成', 'success');

    // Step 5: Variations
    setStepLoading(prev => ({ ...prev, 5: true }));
    setVisibleSteps(prev => [...prev, 5]);
    setCurrentStep(5);
    scrollToSection(5);
    await sleep(1200);
    setStepLoading(prev => ({ ...prev, 5: false }));
    setIsRunning(false);
    onShowToast('✓ 针对性变式题推送就绪，请进行练习', 'info');
  };

  const handleVariationSubmit = async () => {
    // Fill the empty ones
    const autoAnswers = {
      1: '鸡7只，兔3只',
      2: '大船8条，小船2条',
      3: '自行车10辆，三轮车15辆',
      4: '鸡4只，兔7只，蜘蛛2只'
    };
    
    const updated = { ...variationAnswers };
    let hasAnyInput = false;
    
    Object.keys(autoAnswers).forEach(k => {
      const idx = Number(k);
      if (updated[idx] && updated[idx].trim() !== '') {
        hasAnyInput = true;
      }
    });

    if (!hasAnyInput) {
      setVariationAnswers(autoAnswers);
      onShowToast('💡 检测到留空，已自动填充优秀解答并批改中...', 'info');
    } else {
      onShowToast('💡 正在批改变式题回答中...', 'info');
    }

    setStepLoading(prev => ({ ...prev, 6: true }));
    setVisibleSteps(prev => [...prev, 6]);
    setCurrentStep(6);
    scrollToSection(6);

    await sleep(1600);
    setStepLoading(prev => ({ ...prev, 6: false }));
    setVariationSubmitted(true);
    onShowToast('🎉 闭环巩固通过！方程思想与应用验证指标大幅改善！', 'success');
  };

  const handleReset = () => {
    setVisibleSteps([1]);
    setCurrentStep(1);
    setVariationSubmitted(false);
    setVariationAnswers({ 1: '', 2: '', 3: '', 4: '' });
    setStepLoading({});
    setIsRunning(false);
    onShowToast('已重置状态，可重新开启批改演示', 'success');
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
      <Card className="border-blue-100/80 bg-gradient-to-br from-white via-blue-50/65 to-slate-50 p-5 text-left sm:p-7">
        <Badge tone="blue" className="px-3 py-1 text-xs">
          <Brain className="w-3.5 h-3.5" />
          <span>ai学堂 · 复习宝</span>
        </Badge>
        <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionTitle
            title="复习宝 · 把一次作业整理成后续巩固方向"
            description="围绕一次作业中的错因、薄弱点和后续巩固练习，帮助学生把问题及时看清、及时补上。"
          />
          <div className="grid grid-cols-3 gap-2 text-center sm:min-w-[320px]">
            {[
              ['65', '初始得分'],
              ['6', '诊断步骤'],
              ['4', '变式训练']
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm">
                <div className="font-display text-xl font-semibold tracking-[-0.02em] text-slate-900">{value}</div>
                <div className="text-[10px] font-semibold text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Step Progress Indicators */}
      <Card className="p-5">
        <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1">
          {['习题采集', '多维批改', '成因诊断', '学情画像', '随堂变式', '巩固评估'].map((name, idx) => {
            const stepNum = idx + 1;
            const isUnlocked = visibleSteps.includes(stepNum);
            const isCurrent = currentStep === stepNum;
            const isLoading = stepLoading[stepNum];

            return (
              <div key={idx} className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <div 
                  className={cn(`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300`, isCurrent 
                      ? 'bg-slate-900 text-white shadow-sm active:scale-105' 
                      : isUnlocked 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-400')}
                  
                >
                  {isUnlocked && stepNum < currentStep && !isLoading ? '✓' : stepNum}
                </div>
                
                <span className={`text-xs whitespace-nowrap font-medium ${isCurrent ? 'text-blue-600 font-bold' : isUnlocked ? 'text-slate-700' : 'text-slate-400'}`}>
                  {name}
                </span>

                {idx < 5 && (
                  <div className={`h-[1px] w-6 sm:w-10 ${visibleSteps.includes(stepNum + 1) ? 'bg-emerald-200' : 'bg-slate-100'}`} />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* STEP 1: Question Input Screen */}
      <Card 
        ref={stepRefs[1]} 
        id="homework_step_1"
        className="p-5 sm:p-6 space-y-6"
      >
        <div className="flex items-center justify-between rounded-2xl border border-blue-100/80 bg-blue-50/70 px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 bg-white text-blue-700 rounded-xl flex items-center justify-center text-xs font-bold shadow-sm">01</span>
            <div>
              <h3 className="font-bold text-slate-800 text-base">一键题目录入面板</h3>
              <div className="text-[11px] text-slate-400">选择学科和年级，载入学生原始解题切片</div>
            </div>
          </div>
          <Badge tone="blue" className="px-2 py-0.5 text-[10px] font-medium">触发源头</Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel className="mb-1 text-xs">
                  <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                  <span>学习科目</span>
                </FieldLabel>
                <Select
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                  className="min-h-[40px] text-xs font-medium focus:border-blue-500 focus:ring-blue-100"
                >
                  <option>数学</option>
                  <option>语文</option>
                  <option>英语</option>
                  <option>科学</option>
                </Select>
              </div>

              <div>
                <FieldLabel className="mb-1 text-xs">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                  <span>服务年级</span>
                </FieldLabel>
                <Select
                  value={grade} 
                  onChange={(e) => setGrade(e.target.value)}
                  className="min-h-[40px] text-xs font-medium focus:border-blue-500 focus:ring-blue-100"
                >
                  <option>三年级</option>
                  <option>二年级</option>
                  <option>四年级</option>
                  <option>五年级</option>
                </Select>
              </div>
            </div>

            <div>
              <FieldLabel className="mb-1 text-xs">❓ 题目内容</FieldLabel>
              <textarea 
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium leading-relaxed transition focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-slate-500 leading-relaxed space-y-1">
              <span className="font-semibold text-slate-700 block text-[11px]">💡 演示向导说明</span>
              <span>
                系统已预填小学名题“鸡兔同笼”及一份特意含有思维瑕疵的“手写解题案”。点击下方<b>开始批改</b>按钮，您将全程观看系统如何在多端反馈模块间自动流转并定位该生的认知漏洞。
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 block">📷 原始学生手写解题（切片多模态输入）</label>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-gradient-to-b from-amber-50 to-amber-100/50 p-4 relative min-h-[220px] flex items-center justify-center">
              {/* Hands-written simulation canvas using modern elegant UI vectors */}
              <div className="w-full space-y-4 font-mono select-none px-2 text-slate-750">
                <div className="text-sm font-semibold text-indigo-900 border-b border-dashed border-indigo-200 pb-2">
                  解：设鸡有 x 只，兔有 y 只。
                </div>
                <div className="text-xs space-y-2">
                  <p>x + y = 35 <span className="text-slate-400">①</span></p>
                  <p>2x + 4y = 94 <span className="text-slate-400">②</span></p>
                  <p className="text-rose-600 font-semibold underline decoration-wavy decoration-rose-400">
                    由②得 y = (94-2x)/4 = 23.5 - 0.5x
                  </p>
                  <p className="text-rose-600 font-semibold">
                    带入①: x + 23.5 - 0.5x = 35
                  </p>
                  <p className="text-rose-600 font-semibold font-sans">
                    解得 x = 23, y = 12
                  </p>
                </div>
                <div className="text-sm font-semibold text-indigo-900 pt-1">
                  答：鸡有 23 只，兔有 12 只。
                </div>
              </div>
              <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-white/85 border border-slate-100 rounded-md text-[10px] text-slate-400 italic">
                <span>📷 OCR Camera.jpg</span>
              </div>
            </div>
          </div>
        </div>

        <Button
          id="btn_hw_start_correction"
          onClick={triggerCorrectionSequence}
          disabled={currentStep > 1 || isRunning}
          variant={currentStep > 1 ? 'emerald' : 'primary'}
          className={cn(
            'w-full',
            currentStep > 1 && 'cursor-not-allowed hover:translate-y-0 hover:from-emerald-600 hover:to-teal-600'
          )}
        >
          {currentStep > 1 ? (
            <>
              <Check className="w-4 h-4" />
              <span>精准学情档案已就绪 (可下拉阅览全链条报告)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>开始智能批改 (自动启动多维学情诊断工作流)</span>
            </>
          )}
        </Button>
      </Card>

      {/* STEP 2: Skill 1 Multimodal Correction */}
      {visibleSteps.includes(2) && (
        <div
          ref={stepRefs[2]}
          id="homework_step_2"
          className="space-y-6 rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.04)] animate-fade-in-up"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xs font-bold">02</span>
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                <Check className="w-4.5 h-4.5 text-blue-600" />
                <span>特色功能：智能分步批改反馈</span>
              </h3>
              <div className="text-[11px] text-slate-400">对识别的公式进行整步断域，对比精算解集给出步骤评分</div>
            </div>
          </div>

          {stepLoading[2] ? (
            <div className="flex items-center justify-center py-12 gap-3" id="hw_step_2_loader">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" />
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-slate-500 text-xs font-medium">正在对比知识库整步运算解中...</span>
            </div>
          ) : (
            <div className="space-y-6" id="hw_step_2_content">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 p-5 text-center md:col-span-1 flex flex-col items-center justify-center">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    {/* Ring progress bar representation */}
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                      <circle 
                        cx="48" cy="48" r="40" stroke="#3b82f6" strokeWidth="8" fill="transparent" 
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 * (1 - correctionData.total_score / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="text-center">
                      <p className="font-display text-3xl font-semibold tracking-[-0.03em] text-slate-900">{correctionData.total_score}</p>
                      <p className="text-[10px] text-slate-400">/ 100 分</p>
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-slate-700">本次计算合规特级评分</h4>
                </div>

                <div className="space-y-1.5 rounded-2xl border border-slate-200/80 bg-slate-50 p-5 md:col-span-2 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-650">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span>总评阅结论</span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">{correctionData.overall_comment}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <span>🔬</span>
                  <span>各步骤推导诊断明细：</span>
                </div>

                {correctionData.steps.map((st, i) => {
                  return (
                    <div 
                      key={i} 
                      className="flex flex-col items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm sm:flex-row sm:items-center"
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
                        {st.step}
                      </div>

                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="text-xs text-slate-800">
                          <span className="font-semibold text-slate-500">学生书写：</span>
                          <code className="font-mono bg-slate-50 px-1 py-0.5 rounded text-indigo-700">{st.student}</code>
                        </div>
                        <div className="text-[11px] text-slate-400 border-l-2 border-slate-150 pl-2">
                          参考：{st.standard}
                        </div>
                        <div className="text-xs text-slate-550 italic pt-0.5 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                          <span>评注：{st.comment}</span>
                        </div>
                      </div>

                      <div className="sm:text-right flex-shrink-0 flex sm:flex-col justify-between w-full sm:w-auto items-center sm:items-end border-t sm:border-t-0 border-slate-50 pt-2 sm:pt-0">
                        <div className="text-sm font-bold text-slate-850">
                          <span className="text-blue-600 font-display text-base">{st.score}</span>
                          <span className="text-slate-300 text-xs"> /{st.max}</span>
                        </div>
                        
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${
                          st.error_type === 'none' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : st.error_type === 'calculation' 
                              ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                              : 'bg-rose-55 text-rose-700 border border-rose-100'
                        }`}>
                          {st.error_type === 'none' ? '✓ 正确' : st.error_type === 'calculation' ? '⚠ 中间值未警觉' : '✗ 缺少验证'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Skill 2 Vulnerability Diagnosis */}
      {visibleSteps.includes(3) && (
        <div
          ref={stepRefs[3]}
          id="homework_step_3"
          className="space-y-6 rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.04)] animate-fade-in-up"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="w-8 h-8 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xs font-bold">03</span>
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                <Search className="w-4.5 h-4.5 text-amber-600" />
                <span>深层溯源：错因与认知漏洞诊断</span>
              </h3>
              <div className="text-[11px] text-slate-400">穿透表面算术瑕疵，溯寻学习链路底层的认知缺失与前置年级失误</div>
            </div>
          </div>

          {stepLoading[3] ? (
            <div className="flex items-center justify-center py-12 gap-3" id="hw_step_3_loader">
              <div className="flex gap-1 animate-pulse">
                <div className="loading-dot w-2 h-2 bg-amber-500 rounded-full" />
                <div className="loading-dot w-2 h-2 bg-amber-500 rounded-full" />
                <div className="loading-dot w-2 h-2 bg-amber-500 rounded-full" />
              </div>
              <span className="text-slate-500 text-xs font-medium">正在跨越知识链路溯源中...</span>
            </div>
          ) : (
            <div className="space-y-6" id="hw_step_3_content">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-3 rounded-2xl border border-sky-100/80 bg-sky-50/50 p-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4.5 h-4.5 text-sky-600" />
                    <h4 className="font-bold text-slate-800 text-xs">知识库缺失 (Gaps)</h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {diagnosisData.gaps.map((item, idx) => (
                      <li key={idx} className="flex gap-1"><span className="text-sky-500">•</span>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 rounded-2xl border border-amber-100/80 bg-amber-50/55 p-4">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4.5 h-4.5 text-amber-600" />
                    <h4 className="font-bold text-slate-800 text-xs">方法论缺陷 (Method Error)</h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {diagnosisData.method_errors.map((item, idx) => (
                      <li key={idx} className="flex gap-1"><span className="text-amber-500">•</span>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 rounded-2xl border border-rose-100/80 bg-rose-50/50 p-4">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4.5 h-4.5 text-rose-600" />
                    <h4 className="font-bold text-slate-800 text-xs">易错盲区 (Blind Spots)</h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {diagnosisData.blind_spots.map((item, idx) => (
                      <li key={idx} className="flex gap-1"><span className="text-rose-500">•</span>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 rounded-2xl border border-purple-100/80 bg-purple-50/50 p-4 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4.5 h-4.5 text-purple-650" />
                    <h4 className="font-bold text-slate-800 text-xs">深度认知级别</h4>
                  </div>
                  <p className="text-xs text-purple-700 font-semibold">{diagnosisData.cognitive_level}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    表现为过度追求解题流水，而忽略结果在应用原点处的合理性审视。
                  </p>
                </div>

                <div className="space-y-3 rounded-2xl border border-emerald-100/80 bg-emerald-50/50 p-4 sm:col-span-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4.5 h-4.5 text-emerald-600 animate-pulse" />
                    <h4 className="font-bold text-slate-800 text-xs">历史链式追回断点 (Weak Chain)</h4>
                  </div>
                  <div className="space-y-2">
                    {diagnosisData.weak_chain.map((c, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs border-b border-emerald-100 pb-1.5 last:border-0 last:pb-0">
                        <div>
                          <p className="font-semibold text-slate-700">{c.gap}</p>
                          <p className="text-[10px] text-slate-400">底层错因：{c.root_cause}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[9px] font-mono flex-shrink-0">{c.grade}漏洞</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-slate-50 p-4">
                <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5 justify-start">
                  <FileText className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>学情漏洞深层穿透诊断报告</span>
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">{diagnosisData.detailed}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: Skill 3 Long-term Portrait */}
      {visibleSteps.includes(4) && (
        <div
          ref={stepRefs[4]}
          id="homework_step_4"
          className="space-y-6 rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.04)] animate-fade-in-up"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="w-8 h-8 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xs font-bold">04</span>
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                <BarChart3 className="w-4.5 h-4.5 text-purple-600" />
                <span>跨周期呈现：学生长期知识结构画像</span>
              </h3>
              <div className="text-[11px] text-slate-400">基于多模态测试评级，将错因汇总注入该名学生的六维学情档案</div>
            </div>
          </div>

          {stepLoading[4] ? (
            <div className="flex items-center justify-center py-12 gap-3" id="hw_step_4_loader">
              <div className="flex gap-1 animate-pulse">
                <div className="w-2.5 h-2.5 bg-purple-600 rounded-full" />
                <div className="w-2.5 h-2.5 bg-purple-600 rounded-full [animation-delay:0.15s]" />
                <div className="w-2.5 h-2.5 bg-purple-600 rounded-full [animation-delay:0.3s]" />
              </div>
              <span className="text-slate-500 text-xs font-medium">画像渲染构筑中...</span>
            </div>
          ) : (
            <div className="space-y-6" id="hw_step_4_content">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <BarChart3 className="w-4 h-4 text-purple-500" />
                    <span>六项核心思维能力评级</span>
                  </div>
                  
                  {/* Recharts Radar Chart */}
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={isMobile ? "55%" : "75%"} data={portraitData.radar_data}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                        <Radar name="学生档案" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span>本次暴露主要知识点漏洞库 (按严重度排列)</span>
                  </div>
                  
                  <div className="space-y-2">
                    {portraitData.gaps.map((item, id) => {
                      return (
                        <div key={id} className="space-y-1 rounded-2xl border border-slate-200/80 bg-white p-3.5 transition-all hover:border-purple-200 hover:shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-800">{item.knowledge_point}</span>
                            <span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                              item.severity === '高' 
                                ? 'bg-rose-50 text-rose-700 border border-rose-150' 
                                : 'bg-amber-50 text-amber-700 border border-amber-150'
                            }`}>
                              {item.severity}严重级
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>出现频率：<span className="font-semibold text-slate-600">{item.frequency}次记录</span></span>
                            <span>断点溯回：{item.root_chain}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-2 rounded-2xl border border-purple-100/80 bg-gradient-to-r from-blue-50/50 to-purple-50/50 p-4 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-purple-900">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>精准诊断与干预方案建议</span>
                </div>
                <p className="text-slate-650 leading-relaxed">{portraitData.suggestion}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 5: Skill 4 Variant Generation */}
      {visibleSteps.includes(5) && (
        <div
          ref={stepRefs[5]}
          id="homework_step_5"
          className="space-y-6 rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.04)] animate-fade-in-up"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xs font-bold">05</span>
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                <Award className="w-4.5 h-4.5 text-emerald-600" />
                <span>循序渐进：定制适配型变式巩固训练</span>
              </h3>
              <div className="text-[11px] text-slate-400">基于画像漏洞阻击性定制 3-4 道同维/变异场景训练题，巩固解完自检闭环</div>
            </div>
          </div>

          {stepLoading[5] ? (
            <div className="flex items-center justify-center py-12 gap-3" id="hw_step_5_loader">
              <div className="flex gap-1 animate-pulse">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              </div>
              <span className="text-slate-500 text-xs font-medium">正在针对性生成梯度变式题中...</span>
            </div>
          ) : (
            <div className="space-y-6" id="hw_step_5_content">
              <div className="flex items-center gap-1.5 rounded-2xl border border-emerald-100/80 bg-emerald-50/30 p-4 text-xs text-slate-500">
                <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>系统针对 <b>方程检验不闭环</b> 和 <b>约束性缺失</b> 生成了 4 道针对性练习，请通过回答并提交进行巩固测试。（允许留空，直接点击下方提交将自动填充优秀回答进行模拟）</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {variations.map((item, idx) => {
                  return (
                    <div 
                      key={idx} 
                      className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200/80 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-750">
                            {item.id}
                          </span>
                          
                          <span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                            item.difficulty === '基础' 
                              ? 'bg-slate-100 text-slate-600' 
                              : item.difficulty === '中等' 
                                ? 'bg-blue-50 text-blue-700' 
                                : 'bg-amber-50 text-amber-700'
                          }`}>
                            {item.difficulty}梯度
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-800 leading-relaxed min-h-[48px]">{item.question}</p>
                      </div>

                      <div className="space-y-2">
                        <Input
                          type="text"
                          value={variationAnswers[item.id]}
                          onChange={(e) => setVariationAnswers(prev => ({ ...prev, [item.id]: e.target.value }))}
                          placeholder="写下您的计算口算答案 (例如: 7只鸡，3只兔)"
                          className="rounded-xl px-3 py-2 text-xs font-medium focus:border-emerald-500 focus:ring-emerald-100"
                        />

                        <details className="group">
                          <summary className="text-[10px] text-slate-400 hover:text-slate-650 cursor-pointer list-none flex items-center gap-1 select-none">
                            <span className="transition-transform group-open:rotate-90">▶</span>
                            <span>查看本题推荐解法与算理</span>
                          </summary>
                          <div className="mt-2 p-3 bg-slate-50 border border-slate-100 rounded-lg text-[10px] text-slate-500 leading-relaxed space-y-1">
                            <p className="font-bold text-slate-700">参考解集：{item.reference_answer}</p>
                            <p>解析依据：{item.analysis}</p>
                          </div>
                        </details>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!variationSubmitted ? (
                <Button
                  id="btn_hw_submit_variations"
                  onClick={handleVariationSubmit}
                  variant="emerald"
                  className="w-full sm:w-auto px-8"
                >
                  <Zap className="w-4 h-4 text-white animate-pulse" />
                  <span>提交练习，进入学情巩固评估</span>
                </Button>
              ) : (
                <div className="text-center font-bold text-xs text-emerald-600">
                  ✓ 练习已提交，可在下方查看巩固性学情提升评估报告 
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* STEP 6: Skill 5 Correction Feedback loop */}
      {visibleSteps.includes(6) && (
        <div
          ref={stepRefs[6]}
          id="homework_step_6"
          className="space-y-6 rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.04)] animate-fade-in-up"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="w-8 h-8 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center text-xs font-bold">06</span>
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                <RotateCcw className="w-4.5 h-4.5 text-rose-600 animate-spin-slow" />
                <span>闭环评估：学生近期学情提升评估</span>
              </h3>
              <div className="text-[11px] text-slate-400">将二次巩固练习结果重新回灌系统，更新此学生六维模型与薄弱指标</div>
            </div>
          </div>

          {stepLoading[6] ? (
            <div className="flex items-center justify-center py-12 gap-3" id="hw_step_6_loader">
              <div className="flex gap-1 animate-bounce">
                <div className="w-2 h-2 bg-rose-500 rounded-full" />
                <div className="w-2 h-2 bg-rose-500 rounded-full [animation-delay:0.15s]" />
                <div className="w-2 h-2 bg-rose-500 rounded-full [animation-delay:0.3s]" />
              </div>
              <span className="text-slate-500 text-xs font-medium">重算进步值，重新映射多模态成长曲线中...</span>
            </div>
          ) : (
            <div className="space-y-6" id="hw_step_6_content">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-150 bg-gradient-to-r from-emerald-50 to-teal-50 p-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-800">
                    <Award className="w-4 h-4 text-emerald-600 animate-glow-pulse" />
                    <span>专项闭环成功通过！</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">
                    针对变式题 4/4 题全对，答前验证规范已 100% 达成
                  </h4>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center font-display">
                    <p className="text-2xl font-semibold text-slate-400 line-through">65</p>
                    <p className="text-[9px] text-slate-450">首次评估</p>
                  </div>
                  <span className="text-lg text-emerald-500 font-bold">→</span>
                  <div className="text-center font-display">
                    <p className="text-3xl font-semibold tracking-[-0.03em] text-slate-900 animate-scale">100</p>
                    <p className="text-[9px] text-emerald-800 font-semibold">巩固终评</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-705">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>巩固前后：六维能力结构进化对比</span>
                  </div>

                  {/* Overlaid Radar Chart comparing Before and After values */}
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={isMobile ? "55%" : "75%"} data={compareRadarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 8 }} />
                        <Radar name="练习前 (65分)" dataKey="巩固前" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.05} />
                        <Radar name="练习后 (100分)" dataKey="巩固后" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                        <Legend wrapperStyle={{ fontSize: 11, pt: 10 }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-4 flex flex-col justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                    <div className="flex flex-col justify-center space-y-1.5 rounded-2xl border border-emerald-100/80 bg-emerald-50/50 p-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>显著改善指标</span>
                      </div>
                      <p className="text-[11px] text-slate-650 leading-relaxed">
                        【方程思想】从 35 大幅飞跃至 78（+43点）。每次解二元一次联立方程均建立了自觉自检机制。
                      </p>
                    </div>

                    <div className="flex flex-col justify-center space-y-1.5 rounded-2xl border border-amber-100/80 bg-amber-50/60 p-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>潜在遗留细微卡点</span>
                      </div>
                      <ul className="text-[10px] text-slate-600 list-disc pl-3 space-y-1">
                        <li>多变量极限解规划</li>
                        <li>复合不规则图形分解</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-2xl border border-indigo-150 bg-indigo-50/50 p-4 text-xs">
                    <h5 className="flex items-center gap-1.5 font-semibold text-indigo-900">
                      <Brain className="w-4 h-4 text-indigo-600" />
                      <span>下一阶段个性化学习导向</span>
                    </h5>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      今日份闭环训练已全胜通关。下阶段系统将结合语文及科学错题，引入多边界分类讨论及分数计算专项。建议继续保持“草稿右侧绘制验算区”的优异作法。
                    </p>
                  </div>
                </div>
              </div>

              {/* Reset control */}
              <div className="text-center pt-4">
                <Button
                  id="btn_hw_reset_all"
                  onClick={handleReset}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-slate-400 hover:bg-transparent hover:text-slate-600 hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>清除批改缓存，重新体验演示</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
