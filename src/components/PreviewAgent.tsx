/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { 
  Compass, 
  HelpCircle, 
  MessageSquare, 
  Send, 
  ListTodo, 
  Smile, 
  Zap, 
  RotateCcw, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  PlusCircle, 
  AlertCircle,
  BookOpen,
  GraduationCap,
  Sparkles,
  Brain,
  BarChart3,
  Search,
  Award,
  TrendingUp,
  Check,
  FileText,
  PlayCircle
} from 'lucide-react';
import { ChatMessage, PvQuizItem } from '../types';

interface PreviewAgentProps {
  onShowToast: (msg: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

const getFrontendFallback = (sub: string, gd: string, ch: string) => {
  const s = sub || "数学";
  const g = gd || "三年级";
  const c = ch || "认识分数";

  if (s === "语文") {
    const isLiBai =
      c.includes("天门山") || c.includes("李白") || c.includes("古诗") || c.includes("碧水");

    if (isLiBai) {
      return {
        generalOutline: "预习李白《望天门山》的景物描写和关键词语，理解诗句中的动态画面与情感表达。",
        keyConcepts: [
          { label: "“中断”", detail: "写长江从天门山中间奔流而过，突出山势和水势的开阔。" },
          { label: "“回”", detail: "写江水在山势影响下转向或回旋，表现水流变化。" },
          { label: "“两岸青山”", detail: "写船行江上时看到两岸青山不断进入视野，形成动态画面。" }
        ],
        questions: [
          "“两岸青山相对出”中的“出”表现了怎样的画面感？",
          "“碧水东流至此回”中的“回”可以怎样理解？",
          "诗中哪些词语表现了长江水势和山势的特点？",
          "预习时可以用哪一句诗概括整首诗的主要画面？"
        ],
        scenario: "想象自己坐在江面小船上，远处是天门山，江水从两山之间流过。请结合诗句，标出山、水、船、太阳四个画面元素。",
        presetChatQuestions: [
          { q: "天门山真的被江水冲断了吗？", a: "不是字面意义上的冲断。诗句通过想象和夸张，表现长江水势很强、两岸山势分明。" },
          { q: "什么是“相对出”？", a: "这是从船上看两岸青山时产生的动态感。山本身不动，但船向前行，读者会感觉青山迎面出现。" },
          { q: "怎么更有效地背古诗？", a: "先理解每句诗的画面，再按“水势、山势、船影、太阳”的顺序复述。理解画面后再朗读，会比只背字形更稳定。" }
        ],
        quizItems: [
          { id: 1, question: "《望天门山》的作者是哪位唐代诗人？", options: ["杜甫", "李白", "白居易", "王维"], correct: 1, analysis: "《望天门山》的作者是李白，预习时可结合作者风格理解诗中的开阔想象。" },
          { id: 2, question: "“孤帆一片日边来”中的“孤帆”在诗里指代什么？", options: ["江面上的船", "天空中的云", "山顶的树", "岸边的亭子"], correct: 0, analysis: "“孤帆”借船帆代指江面上的船，是古诗中常见的借代写法。" },
          { id: 3, question: "预习古诗时勾勒诗中画面，主要作用是什么？", options: ["帮助理解诗句内容和意境", "替代课文朗读", "只为了画画", "忽略关键词语"], correct: 0, analysis: "画面想象要服务于诗句理解，重点仍是词语、句意和情感。" }
        ]
      };
    }

    return {
      generalOutline: `预习课文《${c}》的主要内容、关键词句和表达特点，初步形成自己的阅读疑问。`,
      keyConcepts: [
        { label: "主要内容", detail: "先通读课文，弄清文章写了什么、按什么顺序写。" },
        { label: "关键词句", detail: "圈出生字词、中心句和不理解的句子，便于课堂重点听讲。" },
        { label: "表达特点", detail: `关注《${c}》中描写、说明、对话或修辞等表达方式。` }
      ],
      questions: [
        `读完《${c}》后，你能用一句话概括主要内容吗？`,
        `文中有哪些词语或句子需要重点理解？`,
        "有没有哪一段你能读懂大意，但还说不清为什么这样写？",
        `明天课堂上，你最想请老师解释《${c}》中的哪个问题？`
      ],
      scenario: `明天课堂将学习《${c}》。请你先通读课文，圈出生字词、标出不理解的句子，并写下一个想在课堂上解决的问题。`,
      presetChatQuestions: [
        { q: `怎么才能比较准确地朗读《${c}》？`, a: `可以先读准字音，再根据句意停顿。遇到描写景物或情感变化的句子，要结合内容调整语气。` },
        { q: `《${c}》中的“意境”可以怎样理解？`, a: `意境是文字呈现出的画面和情感。预习时可以先找景物、人物或动作，再思考作者想表达的感受。` },
        { q: `预习《${c}》可以做哪些事？`, a: `建议完成三步：朗读课文、圈出生字词和关键词、写下一个不理解的问题。这样上课更容易跟上重点。` }
      ],
      quizItems: [
        { id: 1, question: `预习《${c}》遇到生字时，比较合理的做法是？`, options: ["借助拼音或字典读准字音并做标记", "直接跳过所有生字", "只看插图不读课文", "等课堂上再打开书"], correct: 0, analysis: "预习时先解决字音和基本词义，有助于课堂理解课文内容。" },
        { id: 2, question: `预习《${c}》时想象画面的主要目的是什么？`, options: ["帮助理解内容和情感", "替代朗读课文", "只完成绘画任务", "忽略关键词句"], correct: 0, analysis: "画面想象要服务于文本理解，不能代替朗读和词句分析。" },
        { id: 3, question: `如果想把《${c}》预习得更扎实，下面哪一种方法最值得坚持？`, options: ["边朗读边圈重点字词，再写下疑问", "只看标题", "完全依赖别人讲解", "遇到不懂的地方不做记录"], correct: 0, analysis: "主动朗读、标记和提问，是比较有效的课前预习方法。" }
      ]
    };
  }

  if (s === "英语") {
    return {
      generalOutline: `围绕 ${g}《${c}》的核心词汇、发音规则和会话句型，完成课前朗读和句型理解。`,
      keyConcepts: [
        { label: "Phonics 拼读", detail: "把长单词拆成几个小音节，一段一段读，会比硬背字母顺口得多。" },
        { label: "句型骨架", detail: `先抓住《${c}》里最常用的核心问答框架，再往里面替换人物、地点和动作。` },
        { label: "情景表达", detail: "把课本内容放进真实生活场景里，口语会更自然，也更容易记住。" }
      ],
      questions: [
        `这一课《${c}》里，哪些新单词需要先读准？`,
        "本课重点句型的问答结构是什么？",
        "有没有哪一句英文你能看懂，但还不能准确说出来？",
        "如果把本课句型放到校园生活中，可以怎样替换人物、地点或动作？"
      ],
      scenario: `明天课堂将练习《${c}》的词汇和句型。请先读准新单词，再用本课句型写出一组简单问答。`,
      presetChatQuestions: [
        { q: `Word pronunciation tips for 《${c}》? (发音建议)`, a: "先按音节或字母组合分段读，再连起来读。遇到不确定的发音，要标记下来，课堂上重点听老师示范。" },
        { q: `What key conversation patterns does 《${c}》 focus on? (重点句式)`, a: "先找出本课固定句型，再确认可以替换的人物、地点、动作或物品。" },
        { q: "怎么克服不敢开口读英文的问题？", a: "先从短句开始，读准关键词和重音。能稳定读出句型后，再进行对话练习。" }
      ],
      quizItems: [
        { id: 1, question: `When meeting a new word during 《${c}》, what is a good preview strategy?`, options: ["Break it into sounds and read it aloud", "Ignore the word", "Copy it without reading", "Skip the whole sentence"], correct: 0, analysis: "Breaking a word into sounds helps pronunciation and memory." },
        { id: 2, question: `Why should we practice the key sentence pattern in 《${c}》?`, options: ["To understand how to ask and answer", "To avoid reading", "To change the topic", "To ignore new words"], correct: 0, analysis: "A sentence pattern helps students use words in a real communication structure." },
        { id: 3, question: `Which response is polite when a classmate finishes a role-play well?`, options: ["Good job!", "Stop reading.", "That is wrong without reason.", "I do not listen."], correct: 0, analysis: "“Good job!” is a simple and polite classroom response." }
      ]
    };
  }

  const isFraction = c.includes("分数") || c.includes("几分之几") || c.includes("分母");
  const isDecimal = c.includes("小数") || c.includes("零点几") || c.includes("小数点");

  if (isFraction) {
    return {
      generalOutline: `理解分数表示“把一个整体平均分后取其中几份”，会读写简单分数并能用图形说明。`,
      keyConcepts: [
        { label: "分母 (下方数据)", detail: "总共均匀被切分的瓣数，表示整体被平均分成了多少份。" },
        { label: "分子 (上方数据)", detail: "表示你拿走、圈定或涂色了其中的几份。" },
        { label: "分数线 (横折杠)", detail: "它提醒我们：上面和下面的数字描述的是同一个整体里的部分关系。" }
      ],
      questions: [
        "如果你和妈妈对半分一个苹果，每个人得到的一半用什么数来准确描述？",
        "画一个矩形切成 4 份，给其中 2 份涂上颜色。请问这和切成 2 份取 1 份一样大吗？",
        "分母可以为 0 吗？为什么平均分成 0 份没有意义？",
        "一块巧克力有 8 小格，吃了 3 格，还剩下这块巧克力的几分之几？"
      ],
      scenario: "把一张圆形纸片平均分成 8 份，其中 2 份涂上颜色。请用分数表示涂色部分，并说明分子和分母分别表示什么。",
      presetChatQuestions: [
        { q: "1/2 和 2/4 哪个大？", a: "它们一样大。把同一个整体平均分成 2 份取 1 份，和平均分成 4 份取 2 份，表示的面积相同，这叫等值分数。" },
        { q: "3/4 怎么在草稿本里画？", a: "先画一个长方形，平均切成 4 小格，再给其中 3 格涂色。总格数是分母，涂色格数是分子，这样一下就明白了。" },
        { q: "怎么记分子和分母谁在上谁在下？", a: "可以记住：分母表示平均分成的总份数，写在下面；分子表示取了几份，写在上面。" }
      ],
      quizItems: [
        { id: 1, question: "把一个整体平均分给 4 个人，每人得到这个整体的几分之几？", options: ["1/2", "1/4", "2/4", "4/1"], correct: 1, analysis: "分母 4 代表平均分成 4 份，分子 1 代表每人取其中 1 份，所以是 1/4。" },
        { id: 2, question: "1/2 块西瓜和 1/4 块西瓜相比，下面哪句说得合理？", options: ["1/2 块更大一些", "1/4 块更大一些", "它们一样大", "西瓜不能这样比较"], correct: 0, analysis: "同一个西瓜分得越少，每一块反而越大，所以 1/2 会大于 1/4。" },
        { id: 3, question: "一根 1 米长的绳子平均剪成 5 段。每段是全长的几分之几？", options: ["1/2", "1/3", "1/5", "5/1"], correct: 2, analysis: "1 米平均剪成 5 段，每段占全长的五分之一。" }
      ]
    };
  }

  if (isDecimal) {
    return {
      generalOutline: "理解小数表示比 1 更细的十进制数量，会读写一位小数并能联系长度、钱币等情境。",
      keyConcepts: [
        { label: "小数点 (小小分水岭)", detail: "隔开整数部分与小数部分，就像一条清晰的界线。" },
        { label: "十分之一 (0.1)", detail: "把 1 个完整单位平均分成 10 份，其中 1 份就是 0.1。" },
        { label: "十分之几", detail: "像 0.3、0.7 这样的数，都表示把 1 平均分成 10 份后取了其中几份。" }
      ],
      questions: [
        "在温度计、直尺或者价签上，你最常在哪里看到小数点？",
        "一元钱等于 10 角，那么 3 角钱写成用“元”做单位的小数应该怎么记？",
        "0.5 块橡皮擦和半块橡皮擦，它们表示的分量一致吗？",
        "数轴上 0 和 1 中间，除了 0.5，还可以找到哪些一位小数？"
      ],
      scenario: "用直尺测量一条线段，长度是 3 厘米又 5 毫米。请把 5 毫米换成厘米，并用小数表示总长度。",
      presetChatQuestions: [
        { q: "0.1 是什么意思？", a: "0.1 就是把 1 个完整的东西平均分成 10 份，其中拿出 1 份，所以也叫十分之一。" },
        { q: "怎么读带小数点的数？", a: "先读小数点左边的整数部分，再读“点”，最后把右边的数字一个一个念出来。例如 12.55 读作“十二点五五”。" },
        { q: "0.9 加上 0.1 等于多少？", a: "把一个完整单位平均分成 10 份，0.9 是其中 9 份，0.1 是其中 1 份，加起来刚好是完整的 1。" }
      ],
      quizItems: [
        { id: 1, question: "一角钱是 1 元的十分之一。如果用小数来表示 7 角钱，应该记作多少元？", options: ["0.1 元", "0.7 元", "7.0 元", "0.07 元"], correct: 1, analysis: "7 角钱等于十分之七元，我们用小数记作 0.7 元。" },
        { id: 2, question: "在 0.4 和 0.6 之间，下面哪一个数合适？", options: ["0.3", "0.5", "0.7", "0.05"], correct: 1, analysis: "0.5 大于 0.4 且小于 0.6。" },
        { id: 3, question: "把 1 根竹竿平均分成 10 节，刚好拿走全部 10 节。用小数表示，这等同于数字几？", options: ["0", "1", "10", "0.1"], correct: 1, analysis: "拿走 10/10 也就是拿走完整的 1 根，所以结果等于 1。" }
      ]
    };
  }

  return {
      generalOutline: `帮助 ${g} 学生围绕《${c}》建立核心概念、基本步骤和易错点意识。`,
    keyConcepts: [
      { label: "核心规则", detail: `掌握《${c}》这一节最关键的计算法则或图形规律，这是解题的骨架。` },
      { label: "运算步骤", detail: "数学是一门讲逻辑顺序的学科，把每一步走稳，结果才更可靠。" },
        { label: "例题验证", detail: "用一道基础例题检查自己是否理解概念和步骤。" }
    ],
    questions: [
      `本节《${c}》里，最核心的定义或规则是什么？`,
      "这个知识点在例题中通常先看什么条件？",
      `在解决《${c}》相关练习题时，最容易在哪一步产生偏差或疑问？`,
      "明天课堂上你最需要老师解释哪个步骤？"
    ],
    scenario: `请从《${c}》中选一道基础例题，先圈出已知条件，再写出第一步应该使用的规则或公式。`,
    presetChatQuestions: [
      { q: `这个《${c}》公式应该怎么用才不容易混淆？`, a: "先分清楚已知条件和目标，再把公式当成桥梁去连接它们。每一步都说出理由，公式就不容易用反。" },
      { q: `为什么很多同学在预习《${c}》时容易卡住？`, a: "通常是因为只看结论，没有弄清定义、条件和第一步。建议先标出已知条件，再对照例题。" },
      { q: "明天数学课上怎样表达自己的预习结果？", a: "可以说出一个已经理解的概念，再提出一个仍不确定的步骤。这样老师能更准确地帮助你。" }
    ],
    quizItems: [
      { id: 1, question: `学习《${c}》时，如果涉及“平均分”，它的核心要求是什么？`, options: ["每一份大小相等", "份数越多越好", "可以随意分", "只看其中一份"], correct: 0, analysis: "平均分的关键是每一份大小相等，这样后续比较和计算才有意义。" },
      { id: 2, question: `如果我们在预习《${c}》时，把一张纸连续对折 3 次，最后会被平均分成多少份？`, options: ["3 份", "4 份", "8 份", "6 份"], correct: 2, analysis: "每对折一次，份数就翻一倍，所以 2 x 2 x 2 = 8 份。" },
      { id: 3, question: `在《${c}》自查中，如果有一题选错，比较合理的做法是什么？`, options: ["对照解析找出薄弱点", "说明自己学不会", "不再看这类题", "只记住答案不看原因"], correct: 0, analysis: "预习时发现问题，是为了第二天课堂更有针对性地理解新知识。" }
    ]
  };
};

export default function PreviewAgent({ onShowToast }: PreviewAgentProps) {
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

  const [subject, setSubject] = useState('数学');
  const [grade, setGrade] = useState('三年级');
  const [chapter, setChapter] = useState('认识分数');

  const [currentStep, setCurrentStep] = useState(1); // progress indicator steps (1, 2, 3)
  const [visibleSteps, setVisibleSteps] = useState<number[]>([1]);
  const [stepLoading, setStepLoading] = useState<Record<number, boolean>>({});

  // Personalized questionnaire questions
  const [profileSelectionCompleted, setProfileSelectionCompleted] = useState(false);
  const [currentProfileQ, setCurrentProfileQ] = useState(0);
  const [profileAnswers, setProfileAnswers] = useState<Record<string, string>>({});

  const [taskCardGenerated, setTaskCardGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Chatbot state
  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    { id: 'start', sender: 'ai', text: '你好，我是你的课前预习助手。\n在预习《认识分数》时，如果遇到概念、例题步骤或易错点问题，可以点击下方问题或直接输入。' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatIsTyping, setChatIsTyping] = useState(false);

  // Quiz states in Step 3
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Dynamic forecast compre level numbers
  const [forecastBefore] = useState(65);
  const [forecastAfter, setForecastAfter] = useState(65);
  const microLessonVideoId = '771EB95BBA9BDBA1B463AB73BD4C026B';
  const microLessonSiteId = '3BF7C9738A6F67BC';
  const microLessonVideoUrl = `https://p.bokecc.com/playhtml.bo?vid=${microLessonVideoId}&siteid=${microLessonSiteId}&autoStart=false`;

  const [aiCustomContent, setAiCustomContent] = useState<{
    generalOutline: string;
    keyConcepts: Array<{ label: string; detail: string }>;
    questions: string[];
    scenario: string;
    presetChatQuestions?: Array<{ q: string; a: string }>;
    quizItems?: Array<{ id: number; question: string; options: string[]; correct: number; analysis: string }>;
  } | null>(null);

  const [customEval, setCustomEval] = useState<{
    summary: string;
    classLink: { question: string; answer: string };
    forecastLeap: string;
    scoreValue: number;
  } | null>(null);
  const [evalLoading, setEvalLoading] = useState(false);

  const stepRefs = {
    1: useRef<HTMLDivElement>(null),
    2: useRef<HTMLDivElement>(null),
    3: useRef<HTMLDivElement>(null)
  };

  // Dynamic questionnaire, preset chats and quizzes based on subject & chapter
  const getProfileQuestions = () => {
    if (subject === '语文') {
      const isLiBai = chapter.includes("天门山") || chapter.includes("李白") || chapter.includes("古诗");
      const authorText = isLiBai ? "李白" : "文章作者";
      return [
        { 
          key: 'difficulty',
          question: `作为一门全新的语文课文，你直觉觉得自己预习《${chapter}》最可能在哪里遇到挑战呢？`, 
          options: ["课文画面和情感不容易理解", "有一些生字词读音和词义记不准", `不清楚${authorText}或课文背景`, "朗读停顿、重音和语气把握不准"]
        },
        { 
          key: 'style',
          question: `学习古诗词或课文时，你更习惯用哪种方式预习？`,
          options: ["画出课文中的主要画面", `了解《${chapter}》或${authorText}的相关背景`, "朗读课文并标注停顿", "拆解关键词句和表达方法"]
        }
      ];
    } else if (subject === '英语') {
      return [
        { 
          key: 'difficulty',
          question: `面对新单元的英语模块，你直觉觉得在预习《${chapter}》时最可能卡壳在哪呢？`, 
          options: ["长单词较多，拼读不够稳定", "情境对话较长，容易读断", "核心句型不够清楚", "跟读时担心发音不准确"]
        },
        { 
          key: 'style',
          question: `平常记忆英语词汇和句型时，你更适合哪种方式？`,
          options: ["跟读标准音频并模仿重音", "结合情境理解句子用途", "进行简短角色对话练习", "按自然拼读拆分音节记忆"]
        }
      ];
    } else {
      const isFraction = chapter.includes('分数') || chapter.includes('部分') || chapter.includes('分母');
      const diffOptions = isFraction 
        ? ["不确定分子分母分别指什么", "分数大小比较容易混淆", "不知道怎么用图形表示", "基础概念已理解，想做进阶练习"]
        : [`对《${chapter}》的基本数量关系感到抽象`, `公式或者算法规律记不准，怕用错`, `不知道如何通过图形进行数形结合`, `基础内容已理解，想做进阶练习`];
      return [
        { 
          key: 'difficulty',
          question: `作为全新的数学知识，你直觉觉得自己预习《${chapter}》最可能在哪里卡住呢？或者已经掌握了哪些部分？`, 
          options: diffOptions
        },
        { 
          key: 'style',
          question: "平常学习数学概念和公式时，你更适合哪种方式？",
          options: ["看图形或动态演示", "听老师讲解概念来源", "动手画图或操作实物", "跟着例题拆解步骤"]
        }
      ];
    }
  };

  const getPresetChatQuestions = () => {
    return getFrontendFallback(subject, grade, chapter).presetChatQuestions || [];
  };

  const getQuizItems = () => {
    return getFrontendFallback(subject, grade, chapter).quizItems || [];
  };

  const profileQuestions = getProfileQuestions();
  const presetChatQuestions = aiCustomContent?.presetChatQuestions || getPresetChatQuestions();
  const quizItems = aiCustomContent?.quizItems || getQuizItems();

  // Reset/sync welcome chat log greeting and reset cached AI content dynamically
  useEffect(() => {
    setChatLog([
      { id: 'start', sender: 'ai', text: `你好，我是你的课前预习助手。\n在预习《${chapter || '当前知识点'}》时，如果遇到概念、例题步骤或易错点问题，可以点击下方问题或直接输入。` }
    ]);
    setAiCustomContent(null);
    setCustomEval(null);
    setEvalLoading(false);
    setTaskCardGenerated(false);
    setIsGenerating(false);
    setProfileAnswers({});
    setCurrentProfileQ(0);
    setProfileSelectionCompleted(false);
  }, [subject, chapter]);

  const startTaskGen = async () => {
    // Show Questions first
    setProfileSelectionCompleted(false);
    setCurrentProfileQ(0);
    setProfileAnswers({});
    setTaskCardGenerated(false);
    setIsGenerating(true);
  };

  const selectProfileOption = async (option: string) => {
    const activeQ = profileQuestions[currentProfileQ];
    const updated = { ...profileAnswers, [activeQ.key]: option };
    setProfileAnswers(updated);

    if (currentProfileQ < profileQuestions.length - 1) {
      setCurrentProfileQ(prev => prev + 1);
    } else {
      setProfileSelectionCompleted(true);
      // Now start animating the task generation
      setStepLoading(prev => ({ ...prev, 1: true }));
      
      try {
        const res = await fetch("/api/generate-preview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            subject,
            grade,
            chapter,
            profileAnswers: updated
          })
        });
        
        let parsedData = null;
        if (res.ok) {
          try {
            parsedData = await res.json();
          } catch (jsonErr) {
            console.error("Failed to parse JSON response:", jsonErr);
          }
        }
        
        if (parsedData && parsedData.generalOutline && parsedData.keyConcepts && parsedData.questions) {
          setAiCustomContent(parsedData);
        } else {
          console.warn("API responds with incomplete content, using intelligent local matching...");
          setAiCustomContent(getFrontendFallback(subject, grade, chapter));
        }
      } catch (e) {
        console.error("Failed to load Qwen AI preview task content, using intelligent local matching:", e);
        setAiCustomContent(getFrontendFallback(subject, grade, chapter));
      }

      setStepLoading(prev => ({ ...prev, 1: false }));
      setTaskCardGenerated(true);
      onShowToast('✓ 预习包私人定制生成成功！快收下任务卡', 'success');

      // Expand step 2 automatically
      await sleep(1000);
      setVisibleSteps(prev => [...prev, 2]);
      setCurrentStep(2);
      setStepLoading(prev => ({ ...prev, 2: true }));
      scrollToSection(2);
      await sleep(1000);
      setStepLoading(prev => ({ ...prev, 2: false }));
      onShowToast('✓ 预习互动伴学专家已准备就绪', 'info');
    }
  };

  const handleChatPresetClick = async (q: string, a: string) => {
    const userMsg: ChatMessage = { id: Math.random().toString(), sender: 'user', text: q };
    const firstUpdate = [...chatLog, userMsg];
    setChatLog(firstUpdate);
    setChatIsTyping(true);

    const chatArea = document.getElementById('pv-chat-scroller');
    scrollChatBottom(chatArea);

    await sleep(1000);
    setChatIsTyping(false);
    const aiMsg: ChatMessage = { id: Math.random().toString(), sender: 'ai', text: a };
    const finalUpdate = [...firstUpdate, aiMsg];
    setChatLog(finalUpdate);
    scrollChatBottom(chatArea);
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    const txt = chatInput;
    setChatInput('');

    const userMsg: ChatMessage = { id: Math.random().toString(), sender: 'user', text: txt };
    const firstUpdate = [...chatLog, userMsg];
    setChatLog(firstUpdate);
    setChatIsTyping(true);

    const chatArea = document.getElementById('pv-chat-scroller');
    scrollChatBottom(chatArea);

    await sleep(1200);
    setChatIsTyping(false);

    // Filter preset match
    const matched = presetChatQuestions.find(p => txt.includes(p.q) || p.q.includes(txt));
    let responseText = "";
    if (matched) {
      responseText = matched.a;
    } else {
      if (subject === '语文') {
        responseText = `关于“${txt}”，建议先回到课文原句，找出关键词，再结合上下文判断它表达的画面或情感。\n\n提示：可以尝试提问“这句话的关键词是什么？”或“这个词在句中有什么作用？”`;
      } else if (subject === '英语') {
        responseText = `关于“${txt}”，建议先确认关键词读音，再看它在句型中的位置和作用。如果是句型问题，可以先找主语、动词和可替换内容。\n\n提示：可以尝试提问“这个单词怎么分音节？”或“这个句型可以替换哪些词？”`;
      } else {
        responseText = `关于“${txt}”，建议先明确题目中的已知条件和要求，再对照定义或例题步骤判断。以分数为例，分母表示平均分成的总份数，分子表示取了其中几份。\n\n提示：可以尝试提问“这个概念的使用条件是什么？”或“这一步为什么这样做？”`;
      }
    }

    const aiMsg: ChatMessage = { id: Math.random().toString(), sender: 'ai', text: responseText };
    const finalUpdate = [...firstUpdate, aiMsg];
    setChatLog(finalUpdate);
    scrollChatBottom(chatArea);
  };

  const handleFinishPreviewSection = () => {
    setVisibleSteps(prev => [...prev, 3]);
    setCurrentStep(3);
    setStepLoading(prev => ({ ...prev, 3: true }));
    scrollToSection(3);
    setTimeout(() => {
      setStepLoading(prev => ({ ...prev, 3: false }));
      onShowToast(`✓ 针对《${chapter}》的 3 道巩固测评题已经配发`, 'info');
    }, 1200);
  };

  const handleQuizSubmit = async () => {
    // Check if any answers selected
    const correctCount = quizItems.filter(q => selectedAnswers[q.id] === q.correct).length;
    
    // Fill outstanding questions as mockup defaults
    const updated = { ...selectedAnswers };
    let filledAny = false;
    quizItems.forEach(q => {
      if (updated[q.id] === undefined) {
        // Mock default option selection (one wrong)
        updated[q.id] = q.id === 2 ? 1 : q.correct;
        filledAny = true;
      }
    });

    if (filledAny) {
      setSelectedAnswers(updated);
      onShowToast('已自动为您未答题目填充答案并进行批阅中...', 'info');
    }

    setQuizSubmitted(true);
    setEvalLoading(true);
    onShowToast('✓ 自查测验批改完毕！AI名师深度评估中...', 'success');

    let finalScoreValue = 87; // fallback target
    try {
      const resp = await fetch("/api/generate-evaluation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          subject,
          grade,
          chapter,
          score: correctCount
        })
      });
      if (resp.ok) {
        const parsed = await resp.json();
        setCustomEval(parsed);
        if (parsed && typeof parsed.scoreValue === 'number') {
          finalScoreValue = parsed.scoreValue;
        }
      } else {
        console.warn("API responds with non-ok stat:", resp.status);
        const localFallback = {
          summary: `你完成了《${chapter}》的课前自测，答对 ${correctCount} / ${quizItems.length} 题，说明已经形成初步理解。建议继续关注错题解析和概念使用条件。`,
          classLink: {
            question: `“大家在预习完《${chapter}》后，最能体会到哪些深刻应用和特色呢？”`,
            answer: `“老师，我会先说明核心定义，再结合一个例题或图形解释它的使用条件。”`
          },
          forecastLeap: `根据本次预习结果，明天课堂理解度预计可达到 ${65 + correctCount * 10}%。建议重点听概念来源和易错步骤。`,
          scoreValue: 65 + correctCount * 10
        };
        setCustomEval(localFallback);
        finalScoreValue = localFallback.scoreValue;
      }
    } catch (e) {
      console.error("Failed to load Qwen evaluation:", e);
      const localFallback = {
        summary: `你完成了《${chapter}》的课前自测，答对 ${correctCount} / ${quizItems.length} 题，说明已经形成初步理解。建议继续关注错题解析和概念使用条件。`,
        classLink: {
          question: `“大家在预习完《${chapter}》后，最能体会到哪些深刻应用和特色呢？”`,
          answer: `“老师，我会先说明核心定义，再结合一个例题或图形解释它的使用条件。”`
        },
        forecastLeap: `根据本次预习结果，明天课堂理解度预计可达到 ${65 + correctCount * 10}%。建议重点听概念来源和易错步骤。`,
        scoreValue: 65 + correctCount * 10
      };
      setCustomEval(localFallback);
      finalScoreValue = localFallback.scoreValue;
    } finally {
      setEvalLoading(false);
    }

    // Trigger score rating numerical bar animation up to dynamic target
    let counter = forecastBefore;
    const interval = setInterval(() => {
      if (counter >= finalScoreValue) {
        clearInterval(interval);
        setForecastAfter(finalScoreValue);
      } else {
        counter += 1;
        setForecastAfter(counter);
      }
    }, 40);
  };

  const handleReset = () => {
    setVisibleSteps([1]);
    setCurrentStep(1);
    setProfileSelectionCompleted(false);
    setCurrentProfileQ(0);
    setProfileAnswers({});
    setTaskCardGenerated(false);
    setIsGenerating(false);
    const defaultChat: ChatMessage[] = [
      { id: 'start', sender: 'ai', text: `你好，我是你的课前预习助手。\n在预习《${chapter}》时，如果遇到概念、例题步骤或易错点问题，可以点击下方问题或直接输入。` }
    ];
    setChatLog(defaultChat);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setForecastAfter(65);
    setStepLoading({});
    setCustomEval(null);
    setEvalLoading(false);
    onShowToast('已清空预习记录，可重新演示配置', 'success');
  };

  const scrollToSection = (step: number) => {
    setTimeout(() => {
      const ref = stepRefs[step as keyof typeof stepRefs];
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };


  const scrollChatBottom = (el: HTMLElement | null) => {
    setTimeout(() => {
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  };

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up px-1.5 sm:px-0">
      {/* Preview workspace header */}
      <div className={`relative overflow-hidden rounded-2xl ${!isGenerating ? 'border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/70 to-sky-50/80 shadow-sm' : 'border-none bg-transparent shadow-none'}`}>
        <div className={`grid gap-8 ${!isGenerating ? 'p-6 sm:p-8 lg:grid-cols-12 lg:items-stretch animate-fade-in' : 'grid-cols-1 p-0'}`}>
          <div className={`flex flex-col justify-between gap-6 text-left ${!isGenerating ? 'lg:col-span-7' : 'hidden'}`}>
            <div className="space-y-4">
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-[10px] font-bold text-emerald-700 shadow-sm sm:text-xs">
                <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                <span>Preview Agent · 课前预习工作台</span>
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                  课前 15 分钟，把新课变成可掌握的任务
                </h2>
                <p className="max-w-2xl text-xs font-semibold leading-relaxed text-slate-600 sm:text-sm">
                  输入科目、年级和知识点，系统会生成预习目标、知识小地图、伴读问题和自测反馈，让学生带着问题走进课堂。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:max-w-xl">
              {[
                { label: '定制任务', icon: FileText, active: currentStep >= 1 },
                { label: '互动伴读', icon: MessageSquare, active: currentStep >= 2 },
                { label: '自测反馈', icon: ListTodo, active: currentStep >= 3 }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`rounded-xl border px-2.5 py-3 text-center shadow-sm transition-all ${
                      item.active
                        ? 'border-emerald-200 bg-white text-emerald-800'
                        : 'border-white/70 bg-white/50 text-slate-400'
                    }`}
                  >
                    <div className="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
                      <Icon className={`h-3.5 w-3.5 ${item.active ? 'text-emerald-600' : 'text-slate-400'}`} />
                    </div>
                    <div className="text-[10px] font-black text-slate-400">0{index + 1}</div>
                    <div className="text-[11px] font-bold">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`transition-all duration-300 ${!isGenerating ? 'rounded-2xl border border-white/80 bg-white/90 p-4 shadow-lg shadow-emerald-900/5 sm:p-5 lg:col-span-5' : 'w-full max-w-none border-none bg-transparent p-0 shadow-none lg:col-span-12'}`}>
            {isGenerating && profileSelectionCompleted && (
              <div className="relative mb-6 flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50/70 p-4 shadow-sm sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                      <BookOpen className="h-3 w-3" />
                      <span>{subject} · {grade}</span>
                    </div>
                    <h3 className="mt-1 text-base font-extrabold leading-tight text-slate-950">
                      《{chapter || "新学期概念"}》自学导学与课前探究
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 border-t border-slate-200/50 pt-3 text-[11px] font-bold sm:gap-2.5 sm:border-t-0 sm:pt-0">
                  {[
                    { label: '定制目标', active: currentStep >= 1 },
                    { label: '伴学探究', active: currentStep >= 2 },
                    { label: '自测学情', active: currentStep >= 3 }
                  ].map((item, index) => (
                    <div key={item.label} className="flex items-center gap-1 font-semibold text-slate-400">
                      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black ${
                        item.active ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'bg-slate-200 text-slate-500'
                      }`}>
                        0{index + 1}
                      </span>
                      <span className={item.active ? 'font-bold text-emerald-800' : 'text-xs text-slate-400'}>{item.label}</span>
                      {index < 2 && <span className="text-slate-300">→</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isGenerating && (
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">生成课前任务</h3>
                  <p className="text-[11px] font-medium text-slate-500">先选学习范围，再生成专属预习包</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
                  <Compass className="h-5 w-5" />
                </div>
              </div>
            )}

            {/* Form elements */}
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1 text-xs font-bold text-slate-700">
                  <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                  <span>科目</span>
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="min-h-[42px] w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                >
                  <option>数学</option>
                  <option>语文</option>
                  <option>英语</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1 text-xs font-bold text-slate-700">
                  <GraduationCap className="h-3.5 w-3.5 text-emerald-600" />
                  <span>年级</span>
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="min-h-[42px] w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                >
                  <option>三年级</option>
                  <option>二年级</option>
                  <option>四年级</option>
                  <option>五年级</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 flex items-center gap-1 text-xs font-bold text-slate-700">
                  <FileText className="h-3.5 w-3.5 text-emerald-600" />
                  <span>知识点</span>
                </label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="认识分数"
                  className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Generate triggers and Questionnaire modal */}
            {!isGenerating ? (
              <div className="pt-4">
                <button
                  type="button"
                  onClick={startTaskGen}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] sm:text-sm"
                >
                  <Sparkles className="h-4 w-4 text-white" />
                  <span>{isMobile ? "生成智能课前预习任务" : "生成预习任务（首次使用会询问 2 个个性化问题）"}</span>
                </button>
              </div>
        ) : !profileSelectionCompleted ? (
          <div className="bg-slate-50 border border-slate-100 p-4 sm:p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-1.5">
              <Compass className="w-5 h-5 text-emerald-600 animate-spin" />
              <h4 className="font-bold text-slate-800 text-xs">明天新课的专属小调查（只需回答 2 个小问题哦）：</h4>
            </div>

            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/55 space-y-4 animate-fade-in-up">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded-full font-bold">
                  我的学习小偏好 · {currentProfileQ + 1} / {profileQuestions.length}
                </span>
                <span className="text-[10px] text-slate-400">仅首次做档案需要</span>
              </div>

              <p className="text-xs font-semibold text-slate-750 flex items-start gap-1.5">
                <span>😊</span>
                <span className="leading-relaxed">{profileQuestions[currentProfileQ].question}</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {profileQuestions[currentProfileQ].options.map((opt, i) => (
                  <button 
                    key={i}
                    type="button"
                    onClick={() => selectProfileOption(opt)}
                    className="px-4 py-3 border border-emerald-200 bg-white hover:bg-emerald-50/50 hover:border-emerald-400 active:scale-95 text-xs font-semibold rounded-xl text-slate-700 text-left transition-all cursor-pointer shadow-sm min-h-[44px] flex items-center"
                  >
                    <span className="w-5 h-5 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center font-bold text-[10px] mr-2 flex-shrink-0">{i + 1}</span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* When profile is complete */
          <div className="space-y-6">
            {stepLoading[1] ? (
              <div className="flex items-center justify-center py-12 gap-3" id="pv_loader">
                <div className="flex gap-1 animate-pulse">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full [animation-delay:0.1s]" />
                  <div className="w-3 h-3 bg-emerald-500 rounded-full [animation-delay:0.2s]" />
                </div>
                <span className="text-slate-500 text-xs font-medium">私人匹配定制，过滤《${chapter}》难易断点中...</span>
              </div>
            ) : (
              taskCardGenerated && (
                /* Generated Task Card with elegant UI visuals */
                <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm ring-1 ring-emerald-50 sm:p-6 space-y-4 sm:space-y-5 animate-fade-in-up" id="pv_task_card">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-emerald-50/70 px-3.5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                        <FileText className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">明日自学导案卡 (小学 {grade})</h4>
                        <p className="text-[10px] text-slate-550">定制方向：{profileAnswers.style}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-bold text-emerald-800 shadow-sm">专属学习小档案</span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Goal & time - Two columns on PC/iPad, stacked on Mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
                      <div className="flex h-full flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                        <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 mb-1">
                          <Compass className="w-3.5 h-3.5 text-emerald-600" />
                          <span>预习小目标</span>
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3 text-left">
                          {aiCustomContent?.generalOutline || "理解认识分数的数理本质，读懂写对 1/2, 3/4 等简单比例型，建立草稿纸切块作图直觉。"}
                        </p>
                      </div>

                      <div className="flex h-full flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                        <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" style={{ animation: 'pulse 2s infinite' }} />
                          <span>预计要花的时间</span>
                        </span>
                        <div className="flex items-end justify-between mt-1">
                          <span className="text-[10px] text-slate-400">轻松学，不怕难</span>
                          <div className="text-right font-display flex items-baseline gap-0.5 text-emerald-600">
                            <span className="text-2xl font-black font-mono leading-none">12</span>
                            <span className="text-[10px] font-bold text-slate-500">分钟</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Micro lesson video is placed after the goal, before AI reading help. */}
                    <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-3 shadow-sm">
                      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px] md:items-center">
                        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-900 aspect-video">
                          <iframe
                            id={`cciframe_${microLessonVideoId}`}
                            title="课前微课视频"
                            src={microLessonVideoUrl}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="h-full w-full bg-slate-950"
                          />
                        </div>

                        <div className="space-y-2 text-left">
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-bold text-emerald-200">
                            <PlayCircle className="h-3.5 w-3.5" />
                            <span>课前微课视频 · 演示</span>
                          </div>
                          <h5 className="text-sm font-extrabold text-white">先看演示视频，再进入伴读答疑</h5>
                          <p className="text-[11px] leading-relaxed text-slate-300">
                            建议放置知识点导入、例题拆解或实物演示视频。学生看完后，下面的知识地图和思考问题会更容易理解。
                          </p>
                          <div className="grid grid-cols-3 gap-1.5 text-center">
                            {['导入', '例题', '提问'].map((item) => (
                              <span key={item} className="rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold text-white/80">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Simple structured mindmap */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
                      <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                        <Brain className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                        <span>《{chapter}》重点知识小地图</span>
                      </span>
                      <div className="space-y-1.5 font-sans text-[11px] text-slate-600 leading-relaxed pl-1">
                        <p className="font-bold text-slate-800 flex items-center gap-1">
                          <Brain className="w-3.5 h-3.5 text-emerald-500" />
                          <span>核心方法：怎么平均分和表示</span>
                        </p>
                        <div className="mt-4 relative pl-8 sm:pl-10 before:absolute before:left-3.5 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-emerald-100 before:rounded-full space-y-4">
                          {aiCustomContent?.keyConcepts ? (
                            aiCustomContent.keyConcepts.map((concept, i) => (
                              <div key={i} className="relative">
                                <div className="absolute -left-5 sm:-left-7 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-0.5 bg-emerald-200"></div>
                                <div className="absolute -left-[23px] sm:-left-[31px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white shadow-sm z-10"></div>
                                  <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-white p-3.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg w-fit">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    {concept.label}
                                  </span>
                                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">
                                    {concept.detail}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <>
                              <div className="relative">
                                <div className="absolute -left-5 sm:-left-7 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-0.5 bg-emerald-200"></div>
                                <div className="absolute -left-[23px] sm:-left-[31px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white shadow-sm z-10"></div>
                                <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-white p-3.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg w-fit">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    分母 (下方数据)
                                  </span>
                                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">一个整体被平均分成的总份数。</p>
                                </div>
                              </div>
                              <div className="relative">
                                <div className="absolute -left-5 sm:-left-7 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-0.5 bg-emerald-200"></div>
                                <div className="absolute -left-[23px] sm:-left-[31px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white shadow-sm z-10"></div>
                                <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-white p-3.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg w-fit">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    分子 (上方数据)
                                  </span>
                                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">其中被选取、涂色或使用的份数。</p>
                                </div>
                              </div>
                              <div className="relative">
                                <div className="absolute -left-5 sm:-left-7 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-0.5 bg-emerald-200"></div>
                                <div className="absolute -left-[23px] sm:-left-[31px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white shadow-sm z-10"></div>
                                <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-white p-3.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg w-fit">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    分线 (居中横杆)
                                  </span>
                                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">表示分子和分母共同描述同一个整体中的部分关系。</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5 space-y-3">
                    <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{aiCustomContent ? "AI 定制 4 个预习问题" : "伴读思考问题"}</span>
                    </span>
                    <ol className="text-xs text-slate-600 space-y-2.5 leading-relaxed text-left">
                      {aiCustomContent?.questions ? (
                        aiCustomContent.questions.map((q, idx) => (
                          <li className="flex gap-2.5" key={idx}>
                            <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">{idx + 1}</span>
                            <span className="flex-1">{q}</span>
                          </li>
                        ))
                      ) : (
                        <>
                          <li className="flex gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">1</span>
                            <span className="flex-1">分数表示一个整体中的一部分，还是表示某一个具体物品？</span>
                          </li>
                          <li className="flex gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">2</span>
                            <span className="flex-1">同一个整体中，1/2 和 1/4 哪个更大？为什么？</span>
                          </li>
                          <li className="flex gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">3</span>
                            <span className="flex-1">分母可以是 1 或 0 吗？分别代表什么含义？</span>
                          </li>
                        </>
                      )}
                    </ol>
                  </div>

                  {/* Scenario questions */}
                  <div className="rounded-xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm space-y-1.5 text-left">
                    <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-emerald-600" />
                      <span>应用场景（结合：{profileAnswers.style}）</span>
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                      {aiCustomContent?.scenario || "把一张圆形纸片平均分成 8 份，其中 2 份涂色。请用分数表示涂色部分，并说明分子和分母分别表示什么。"}
                    </p>
                  </div>

                  {/* Forecast indicator slider */}
                  <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 text-xs">
                      <span className="font-bold text-amber-850 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                        <span>课堂理解度预估</span>
                      </span>
                      <span className="font-mono text-amber-700 font-bold text-sm">{forecastBefore}% 听透可能性</span>
                    </div>

                    <div className="w-full bg-white h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse" style={{ width: `${forecastBefore}%` }} />
                    </div>

                    <span className="text-[10px] text-slate-500 leading-normal flex items-start gap-1 text-left">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>完成预习后，明天课堂上可重点关注定义来源、例题步骤和易错点。</span>
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {profileSelectionCompleted && !taskCardGenerated && (
          <button 
            type="button" 
            onClick={startTaskGen}
            className="text-xs text-emerald-600 underline font-semibold flex items-center gap-0.5 cursor-pointer ml-1 animate-pulse"
          >
            <RotateCcw className="w-3 h-3 text-emerald-600" />
            <span>重新设定并激活问答问卷</span>
          </button>
        )}
      </div>
      </div>
      </div>

      {/* STEP 2: Chat helper and Preset tags */}
      {visibleSteps.includes(2) && (
        <div ref={stepRefs[2]} id="preview_step_2" className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm sm:p-6 space-y-5 sm:space-y-6 animate-fade-in-up">
          <div className="flex items-center gap-3 rounded-xl bg-sky-50/70 px-3.5 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-xs font-bold font-mono text-sky-700 shadow-sm">02</span>
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-1.5 justify-start">
                <MessageSquare className="w-4 h-4 text-sky-600 animate-pulse" />
                <span>互动答疑：有问题随时问我哦</span>
              </h3>
              <div className="text-[10px] sm:text-[11px] text-slate-400">围绕概念、例题步骤和易错点进行课前答疑</div>
            </div>
          </div>

          {stepLoading[2] ? (
            <div className="flex items-center justify-center py-12 gap-3" id="cls_step_2_loading">
              <div className="flex gap-1 flex-row">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping [animation-delay:0.1s]" />
              </div>
              <span className="text-slate-500 text-xs font-semibold">小助手正在赶来...</span>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in-up md:px-1" id="pv_step_2_content">
              <div className="text-[11px] text-slate-555 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>大家都在问这些（点一下直接问）：</span>
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {presetChatQuestions.map((item, id) => (
                  <button 
                    key={id}
                    type="button"
                    onClick={() => handleChatPresetClick(item.q, item.a)}
                    className="flex cursor-pointer items-center gap-1 rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-emerald-800 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-50 active:scale-95 sm:px-3.5 sm:py-1.5 sm:text-[10.5px]"
                  >
                    <Search className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{item.q}</span>
                  </button>
                ))}
              </div>

              {/* Chat window box */}
              <div className="flex flex-col space-y-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3 sm:p-4 sm:space-y-4">
                <div 
                  id="pv-chat-scroller"
                    className="h-60 overflow-y-auto space-y-3.5 pr-1 scroll-smooth sm:h-72"
                >
                  {chatLog.map((chat) => {
                    const isAi = chat.sender === 'ai';
                    return (
                      <div key={chat.id} className={`flex gap-2 sm:gap-3.5 ${isAi ? '' : 'justify-end'}`}>
                        {isAi && (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0 animate-glow-pulse shadow">
                            <BookOpen className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                        
                        <div 
                          className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 text-xs leading-normal max-w-[90%] sm:max-w-[85%] whitespace-pre-line ${
                            isAi 
                              ? 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm' 
                              : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none shadow-sm'
                          }`}
                        >
                          {chat.text}
                        </div>

                        {!isAi && (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-400 text-white flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 shadow">
                            <Smile className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {chatIsTyping && (
                    <div className="flex gap-2 sm:gap-3.5 animate-fade-in-up">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                        <BookOpen className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-none px-3.5 py-2.5 border border-slate-100 max-w-sm">
                        <div className="flex gap-1.5 items-end justify-center py-1">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Text entry field */}
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter') handleChatSend(); }}
                    placeholder={isMobile ? "输入您的新疑惑..." : "输入或询问您的新疑惑 (例如: 什么是等值分数?)"}
                    className="min-h-[42px] flex-grow rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  />
                  <button 
                    type="button"
                    onClick={handleChatSend}
                    className="flex min-h-[42px] cursor-pointer items-center justify-center rounded-xl bg-emerald-600 px-3 py-2 text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-center pt-2">
                <button 
                  type="button"
                  id="btn_pv_go_quiz"
                  onClick={handleFinishPreviewSection}
                  className="mx-auto flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] sm:w-auto sm:px-8 sm:text-sm"
                >
                  <Compass className="w-4 h-4 text-white animate-spin-slow" />
                  <span>{isMobile ? "完成伴读，开始自测小练习" : "我已阅读完毕且完成伴读，开始自测小练习"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Self checking & Alignment with classes */}
      {visibleSteps.includes(3) && (
        <div ref={stepRefs[3]} id="preview_step_3" className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm sm:p-6 space-y-5 sm:space-y-6 animate-fade-in-up">
          <div className="flex items-center gap-3 rounded-xl bg-amber-50/80 px-3.5 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-xs font-bold font-mono text-amber-700 shadow-sm">03</span>
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-1.5 justify-start">
                <ListTodo className="w-4.5 h-4.5 text-amber-600 animate-pulse" />
                <span>随堂小测验：看看你学会了吗</span>
              </h3>
              <div className="text-[10px] sm:text-[11px] text-slate-400">做完这 3 道题，系统会帮你批改，明天听课会更轻松哦！</div>
            </div>
          </div>

          {stepLoading[3] ? (
            <div className="flex items-center justify-center py-12 gap-3" id="cls_step_3_loading">
              <div className="flex gap-1 animate-pulse">
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
              </div>
              <span className="text-slate-500 text-xs font-semibold">正在准备小测验...</span>
            </div>
          ) : (
            <div className="space-y-5 sm:space-y-6 animate-fade-in-up" id="pv_step_3_content">
              {/* Questionnaire options lists */}
              <div className="space-y-3.5">
                {quizItems.map((item, idx) => {
                  return (
                    <div 
                      key={item.id} 
                      className={`rounded-xl border p-3.5 shadow-sm transition-all sm:p-4 space-y-3 ${
                        quizSubmitted 
                          ? selectedAnswers[item.id] === item.correct 
                            ? 'border-emerald-200 bg-emerald-50/40'
                            : 'border-rose-200 bg-rose-50/40'
                          : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-2 sm:gap-2.5">
                        <span className="w-5 h-5 sm:w-5.5 sm:h-5.5 bg-slate-100 text-slate-650 rounded-full font-bold flex items-center justify-center text-[10px] sm:text-[10.5px] flex-shrink-0 mt-0.5">
                          {item.id}
                        </span>
                        
                        <p className="text-xs font-bold text-slate-800 leading-relaxed flex-1">{item.question}</p>
                        
                        {quizSubmitted && (
                          <span className="text-sm sm:text-base flex-shrink-0 flex items-center">
                            {selectedAnswers[item.id] === item.correct ? (
                              <Check className="w-4.5 h-4.5 text-emerald-600" />
                            ) : (
                              <AlertCircle className="w-4.5 h-4.5 text-rose-500" />
                            )}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-0 sm:pl-8">
                        {item.options.map((opt, i) => {
                          const isSelected = selectedAnswers[item.id] === i;
                          const isCorrect = item.correct === i;
                          
                          return (
                            <label 
                              key={i} 
                              className={`flex cursor-pointer select-none items-center gap-2 rounded-xl border p-2 text-[11px] font-semibold transition-all sm:p-2.5 sm:text-xs ${
                                isSelected 
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm'
                                  : quizSubmitted && isCorrect 
                                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                    : 'border-slate-200 bg-slate-50/60 text-slate-705 hover:bg-white hover:border-amber-200'
                              }`}
                            >
                              <input 
                                type="radio" 
                                name={`pv-q-item-${item.id}`} 
                                disabled={quizSubmitted}
                                checked={isSelected}
                                onChange={() => setSelectedAnswers(prev => ({ ...prev, [item.id]: i }))}
                                className="w-4 h-4 accent-emerald-600 border-slate-250 cursor-pointer"
                              />
                              <span className="flex-1 text-slate-750">{String.fromCharCode(65 + i)}. {opt.replace(/^[A-D][.、]\s*/i, '')}</span>
                            </label>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="pl-0 sm:pl-8 pt-2.5 text-[10.5px] leading-relaxed border-t border-slate-100 space-y-1">
                          <p className="font-bold text-slate-600">
                            【自查释义】 正确对应：<span className="text-emerald-700 font-semibold">{item.options[item.correct]}</span>
                          </p>
                          <p className="text-slate-500 italic">知识漏洞解析：{item.analysis}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button 
                  type="button"
                  id="btn_pv_submit_quiz"
                  onClick={handleQuizSubmit}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:from-amber-600 hover:to-orange-700 active:scale-[0.99] sm:w-auto sm:px-8 sm:py-3 sm:text-sm"
                >
                  <Send className="w-4 h-4 text-white animate-pulse" />
                  <span>提交答案，查看预习理解度</span>
                </button>
              ) : (
                <div className="space-y-5 sm:space-y-6">
                  {evalLoading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="p-3.5 sm:p-4 bg-emerald-50/20 text-emerald-800 rounded-xl border border-emerald-100 space-y-2">
                        <div className="h-4 bg-emerald-100 rounded w-1/4 animate-pulse" />
                        <div className="h-3 bg-emerald-100/70 rounded w-full animate-pulse" />
                        <div className="h-3 bg-emerald-100/50 rounded w-5/6 animate-pulse" />
                      </div>
                      
                      <div className="border border-slate-150 rounded-xl p-3.5 sm:p-4.5 bg-sky-50/20 space-y-3">
                        <div className="h-4 bg-sky-100 rounded w-1/3 animate-pulse" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="h-16 bg-white/70 rounded-lg border border-slate-100 animate-pulse" />
                          <div className="h-16 bg-white/70 rounded-lg border border-slate-100 animate-pulse" />
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-amber-50/30 to-orange-50/30 border border-amber-100 p-4 sm:p-5 rounded-2xl flex items-center justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-amber-100 rounded w-1/3 animate-pulse" />
                          <div className="h-3 bg-amber-100/50 rounded w-2/3 animate-pulse" />
                        </div>
                        <div className="w-16 h-12 bg-amber-100/50 rounded-xl animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    customEval && (
                      <div className="space-y-5 sm:space-y-6 animate-fade-in-up">
                        {/* Performance evaluation review */}
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-emerald-850 shadow-sm sm:p-4 space-y-1.5 animate-fade-in">
                          <h4 className="font-extrabold text-xs flex items-center gap-1.5">
                            <Award className="w-4.5 h-4.5 text-emerald-600 animate-bounce" />
                            <span>你的专属学习小评价</span>
                          </h4>
                          <p className="text-[11px] sm:text-xs leading-relaxed text-slate-705">
                            {customEval.summary}
                          </p>
                        </div>

                        {/* Tips for Classroom alignment */}
                        <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-3.5 shadow-sm sm:p-4.5 space-y-3 animate-fade-in">
                          <span className="text-[11px] sm:text-xs font-bold text-sky-900 flex items-center gap-1.5 flex-wrap">
                            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500 animate-glow-pulse" />
                            <span>明天课堂上的回答建议</span>
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold block flex items-center gap-1">
                                <Check className="w-3 h-3 text-slate-400" />
                                <span>老师很可能会问这些哦</span>
                              </span>
                              <p className="text-[11px] sm:text-xs text-slate-800 font-semibold leading-relaxed">
                                {customEval.classLink?.question || `“大家能在现实生活中举几个分数的巧妙应用案例么？”`}
                              </p>
                            </div>

                            <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                              <span className="text-[9px] sm:text-[10px] text-emerald-500 font-bold block flex items-center gap-1">
                                <Smile className="w-3 h-3 text-emerald-500" />
                                <span>建议你可以这样回答：</span>
                              </span>
                              <p className="text-[11px] sm:text-xs text-slate-800 font-semibold leading-relaxed">
                                {customEval.classLink?.answer || `“把同一个整体平均分成 8 份，取其中 2 份就是 2/8；它可以约分成 1/4，这两个分数表示的大小相同。”`}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Forecast forecast percentage upgrade details */}
                        <div className="relative rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-sm sm:p-5 animate-fade-in">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                            <div className="space-y-1 flex-1">
                              <span className="text-xs font-bold text-amber-850 block flex items-center gap-1">
                                <TrendingUp className="w-4 h-4 text-amber-600 animate-pulse" />
                                <span>课堂理解度预计达到 {forecastAfter}%</span>
                              </span>
                              <p className="text-[10px] sm:text-[10.5px] text-slate-605 leading-relaxed font-semibold">
                                {customEval.forecastLeap}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-amber-200/50 pt-2.5 sm:pt-0 sm:pl-3 flex-row">
                              <div className="text-center min-w-[36px]">
                                <p className="text-slate-400 text-lg sm:text-xl font-bold line-through">{forecastBefore}%</p>
                                <p className="text-[9px] text-slate-400 font-medium">预习前</p>
                              </div>
                              <span className="text-lg text-amber-500 font-bold animate-glow-pulse">
                                <ArrowRight className="w-4 h-4 text-amber-500" />
                              </span>
                              <div className="text-center font-display min-w-[50px]">
                                <p className="text-amber-600 text-2xl sm:text-3xl font-black">{forecastAfter}%</p>
                                <p className="text-[9px] text-amber-800 font-semibold">自测后估值</p>
                              </div>
                            </div>
                          </div>

                          <div className="w-full bg-white h-2 rounded-full overflow-hidden mt-3">
                            <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000" style={{ width: `${forecastAfter}%` }} />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* Global Bottom Reset control shown at the very bottom of PreviewAgent page */}
      <div className="flex justify-center pt-6 border-t border-slate-100/30">
        <button 
          type="button"
          onClick={handleReset}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1.5 transition-all cursor-pointer bg-blue-50/40 hover:bg-blue-50 hover:scale-102 border border-blue-200/40 px-3.5 py-1.5 rounded-xl shadow-xs"
        >
          <span>🔄 重新演示</span>
        </button>
      </div>
    </div>
  );
}
