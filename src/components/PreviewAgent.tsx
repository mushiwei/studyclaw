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
  FileText
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
        generalOutline: "身临其境感受李白《望天门山》的雄丽风光和浪漫气魄，理解生动词眼词译，建立头脑风暴画面感。",
        keyConcepts: [
          { label: "“中断” (天地大裂变)", detail: "浩荡的长江水像一把开天辟地的绝世屠龙宝刀，生生把天门山劈成两半！" },
          { label: "“回” (江水蹦跳打转)", detail: "水流遇到山脉包夹，在峡谷处回旋转弯，撞击出滔天彩色大浪花。" },
          { label: "“两岸青山” (青山大长腿)", detail: "远处的群山像活过来一样，迈着大步，伴着一叶轻舟探出头来迎接你。" }
        ],
        questions: [
          "读完“两岸青山相对出，孤帆一片日边来”，你脑海中那一轮太阳是什么颜色的？",
          "为什么李白不写“两岸青山一动不动”，而要写群山“相对出”？群山真的会走路吗？",
          "“碧水东流至此回”中的“回”，你觉得是回旋、转向还是回到老家？",
          "如果是你在一叶扁舟上，看着长江滔滔迎风扑面，你会高歌一首什么诗章？"
        ],
        scenario: "唐代的某个艳阳天，浪漫奇才李白正醉眼朦胧地立在摇晃的木船头。两岸天门山青翠如画，一轮红日映照着江面。作为他的伴读童子，你会怎么帮他递上彩铅，把这种天地巨变的一幕画在草纸上？",
        presetChatQuestions: [
          { q: "天门山真的被江水冲断了吗？", a: "在古代神话和李白充满想象力的脑海中，长江江水水势太大、太猛了，就好像一把巨大的水仙刀，把巍峨的天门山一劈为二！这体现了李白极其阔大、天马行空的浪漫胸怀唷！" },
          { q: "什么是“相对出”呀？", a: "这是一种神奇的「运动视觉效果」！当你乘着小木船快速顺流而下时，两岸原本静止的绿色大山，会像拉开舞台帷幕一样，接连不断地向你迎面扑过来，就好像大山长了长腿在向你招手致敬呢！" },
          { q: "怎么背古诗最快？", a: "不要死记字形哦！闭上眼，在脑海里放一部 15 秒极速色彩大电影：\n1️⃣ 先看到山被劈开，水在打转；\n2️⃣ 再看到绿山在飘走，日边滑来一条金色小船。\n跟着画面去联想，读个三遍，你就能秒背成功啦！" }
        ],
        quizItems: [
          { id: 1, question: "《望天门山》的作者是唐代赫赫有名的哪位伟大诗人（人称“诗仙”）？", options: ["杜甫", "李白", "白居易", "王维"], correct: 1, analysis: "李白是唐代的豪放浪漫派诗仙，天门山这首诗就是他青年时期写下的传世名篇。" },
          { id: 2, question: "“孤帆一片日边来”中的“孤帆”在诗里指代的是什么？", options: ["一只孤零零的野鸭", "载着作者李白迎着红日铺来的一叶小木船", "一片白花花的天空", "天门山顶的白云"], correct: 1, analysis: "“孤帆”用帆船的船帆，来代指行驶在碧波白浪间的江船，在金色红日下徐徐铺来，极富意境。" },
          { id: 3, question: "在预习案中，用 15 分钟闭眼勾勒诗里的意境画，主要是为了：", options: ["完成美术作业", "在脑中建立空间画面感知网络，从而在上课时秒懂课文、产生深度记忆", "为了让草稿纸变满", "以上都不对"], correct: 1, analysis: "语文的最高境界是意境，建立起脑中电影院，会让你第二天的课堂专注力和吸收效果实现火箭般飞跃！" }
        ]
      };
    }

    return {
      generalOutline: `预习感受课文《${c}》的行文画面感与特色意境，大方读记重点生词拼读，深入领会文章要义。`,
      keyConcepts: [
        { label: "意境画面 (思维电影)", detail: "阅读课文时闭上双眼，把文字拆分组合，在脑海里建立专属的高清电影大片段。" },
        { label: "字词圈记 (拼音偏旁法)", detail: "拆解全新生词的拼音发音、笔顺、部首偏旁，像拆积木一样轻松攻克朗读屏障。" },
        { label: "作者心灵 (写作大背景)", detail: `联系课本里提到的小故事或历史，看看作者在什么样奇妙的心境中一鼓作气写下了这篇巨作《${c}》。` }
      ],
      questions: [
        `当你大声而流畅地初读完一遍这篇《${c}》，你心里的第一重直觉感受是什么？`,
        `文章里有没有哪一个角色、一个比喻或者一句话，让你耳目一新，忍不住多读了两遍？`,
        "这一节内容里有没有写得非常妙、但第一部分你却觉得有一些绕口或者不理解其用意的段落？",
        `明天去学校听老师讲《${c}》，由你做主当 3 分钟老师，你打算给全班同学抛出什么样的趣味探秘问题？`
      ],
      scenario: `夕阳西下，你们学校的小黑板上贴出了一则重磅通知，班级读书分享会将在明日开启，主题就是这篇《${c}》！作为书香智囊团推荐代表，你打算在 15 分钟内圈记哪些精彩段落和生字，从而惊艳亮出你们小组的名片呢？`,
      presetChatQuestions: [
        { q: `怎么才能富有感情地朗读《${c}》呢？`, a: `这非常有趣！《${c}》的朗读就像一幅声音的彩色画卷：\n1️⃣ 遇到开阔、愉悦的段落，声音要清脆、挺直；\n2️⃣ 遇到修辞优美或思念、感悟句段，音调可以放轻放缓。\n多练两遍，你准能发现自主朗朗读诵的非凡魅力！` },
        { q: `《${c}》字句中的“意境”是什么意思呀？`, a: `问得太好了！意境就是“字里的彩色电影”。\n当读完《${c}》时，你的脑袋里不应该只看到黑白的汉字，而是变成了一个高清立体电影院。作者用文字画了一幅彩绘，你能在脑海画出彩色的场景和角色，就是懂意境了噢！` },
        { q: `预习《${c}》有什么妙招呀？`, a: `这非常简单！你可以尝试这三步：\n1️⃣ 朗读课文，圈出最有趣或是不好念的 3 个词眼；\n2️⃣ 闭上眼睛，想象课文里的世界是什么样子；\n3️⃣ 给自己提出一个小问题。这样明天的讨论中你准能表现惊艳！` }
      ],
      quizItems: [
        { id: 1, question: `在深入预习《${c}》这一节内容时，如果遇到新课文里从没学过的生字，最科学的做法是？`, options: ["跳过去装作看不见", "借助拼音或者字典先念准声音，顺手圈出生字偏旁笔顺", "觉得太累直接合上书去玩游戏", "要求父母替自己做"], correct: 1, analysis: "亲自动手查阅字音并勾勒偏旁，一气呵成建立肌肉记忆，明天一定能受到老师赞赏！" },
        { id: 2, question: `在预习《${c}》时，我们提倡在脑海里建立“彩色电影院”的根本用意在于：`, options: ["纯属浪费草稿纸", "激发右脑视觉潜能，把白纸黑字变成跳跃的立体大片，明天听讲更专注", "只为了应对考试", "毫无用处"], correct: 1, analysis: "把阅读转化为大脑中的视觉电影，能帮助我们更牢固地记住课文内容和情境。" },
        { id: 3, question: `如果你想把《${c}》预习得更扎实，下面哪一种方法最值得坚持？`, options: ["只看标题就算预习完成", "边朗读边圈重点字词，再写下 1 个自己真正想问的问题", "完全依赖别人讲解", "遇到不懂的地方立刻跳过"], correct: 1, analysis: "预习最有效的方式是主动朗读、标记和提问，这样上课时才能迅速对上老师讲的重点。" }
      ]
    };
  }

  if (s === "英语") {
    return {
      generalOutline: `围绕 ${g}《${c}》的核心词汇和会话句型，先把单词敢读、句子敢说、场景敢演。`,
      keyConcepts: [
        { label: "Phonics 拼读", detail: "把长单词拆成几个小音节，一段一段读，会比硬背字母顺口得多。" },
        { label: "句型骨架", detail: `先抓住《${c}》里最常用的核心问答框架，再往里面替换人物、地点和动作。` },
        { label: "情景表达", detail: "把课本内容放进真实生活场景里，口语会更自然，也更容易记住。" }
      ],
      questions: [
        `这一课《${c}》里，哪一个新单词你一看到就想先开口读读看？`,
        "如果把本课重点句型搬到校园生活里，你最想拿它和同桌聊什么？",
        "有没有哪一句英文你会认、会看，却还不太敢大声说出来？",
        "要是把今天最响亮的生活对话唱成一段 Rap，你会挑选哪两句作为切入口？"
      ],
      scenario: `一位来自遥远国度的国际交换生今天来到了你们的小组。你正好可以用刚预习的《${c}》热词和句型跟他 say hello！`,
      presetChatQuestions: [
        { q: `Word pronunciation tips for 《${c}》? (发音建议)`, a: "单词要大声跟着 AI 伴读拼念！只要勇敢说出来，舌头肌肉就会瞬间建立起流畅记忆档案，超级有效哦！" },
        { q: `What key conversation patterns does 《${c}》 focus on? (重点句式)`, a: "该单元的核心主要关注在日常角色问答。记住火车头框架并塞入各种你感兴趣的事物积木吧！" },
        { q: "怎么克服不敢大声用英文开口对话的问题？", a: "最酷的口语就是有自信！歪果仁最重视勇敢沟通，多试两次，你会发现你也能说得特别地道顺溜！" }
      ],
      quizItems: [
        { id: 1, question: `When meeting a new word during our study of 《${c}》, what is the best strategy?`, options: ["Ignore it completely", "Slice it by syllables (phonics) and read it out loud step by step", "Cry and stop studying", "Scribble wildly"], correct: 1, analysis: "把长单词拆散按元音音节分段，比如 fan-tas-tic，读得轻松，记忆也更扎实。" },
        { id: 2, question: `In our 《${c}》 dialogues, why do we practice saying the key sentence model loudly?`, options: ["For nothing but fun", "To build muscle memory in our tongue and speak naturally with confidence", "To disturb nearby friends", "To make drawing easy"], correct: 1, analysis: "口语是舌头肌肉的练习。大声念出来能有效激活你的口语记忆，明天和同桌对话更自然。" },
        { id: 3, question: `If your classmate does a fantastic job on English role-play in class, what polite comment should you give?`, options: ["Oh boring!", "Thank you!", "Excellent job! You are so awesome!", "Goodbye!"], correct: 2, analysis: "用一句赞叹词给同学点赞，是英语交流中自然又有礼貌的表达方式。" }
      ]
    };
  }

  const isFraction = c.includes("分数") || c.includes("几分之几") || c.includes("分母");
  const isDecimal = c.includes("小数") || c.includes("零点几") || c.includes("小数点");

  if (isFraction) {
    return {
      generalOutline: `理解认识分数与比例的数理本质，读读写对简单分子分母形式，建立切分作图的第一直觉。`,
      keyConcepts: [
        { label: "分母 (下方数据)", detail: "总共均匀被切分的瓣数，表示整体被平均分成了多少份。" },
        { label: "分子 (上方数据)", detail: "表示你拿走、圈定或涂色了其中的几份。" },
        { label: "分数线 (横折杠)", detail: "它提醒我们：上面和下面的数字描述的是同一个整体里的部分关系。" }
      ],
      questions: [
        "如果你和妈妈对半分一个苹果，每个人得到的一半用什么数来准确描述？",
        "画一个矩形切成 4 份，给其中 2 份涂上颜色。请问这和切成 2 份取 1 份一样大吗？",
        "分母可以为数字零吗？如果切成 0 份，我们还能怎么去拿走红苹果呢？",
        "家里的巧克力有 8 小格，你奖励自己吃了 3 格，还剩下几分之几留给爸爸保鲜？"
      ],
      scenario: "周末全家点了一个超大 12 寸至尊披萨。大厨把它平均切成 8 瓣，你和爸爸各拿了一瓣。请问你们合力吃掉了这整盒披萨的几分之几？",
      presetChatQuestions: [
        { q: "1/2 和 2/4 哪个大？", a: "其实它们是一样大的哦！想象同一个圆饼，一种切成 2 份拿 1 份，另一种切成 4 份拿 2 份，吃到嘴里的量是一样的，这就叫等值分数。" },
        { q: "3/4 怎么在草稿本里画？", a: "先画一个长方形，平均切成 4 小格，再给其中 3 格涂色。总格数是分母，涂色格数是分子，这样一下就明白了。" },
        { q: "怎么记分子和分母谁在上谁在下？", a: "记住一句话：总份数在下面，拿走的份数在上面。这样看分数时就不容易混淆啦！" }
      ],
      quizItems: [
        { id: 1, question: "妈妈烤了一个甜甜圈蛋糕，准备平均分给 4 个小朋友。请问每个人拿到这个蛋糕的几分之几？", options: ["1/2", "1/4", "2/4", "4/1"], correct: 1, analysis: "分母 4 代表蛋糕平均切 4 份，分子 1 代表每个人拿走 1 块，所以是 1/4。" },
        { id: 2, question: "1/2 块西瓜和 1/4 块西瓜相比，下面哪句说得合理？", options: ["1/2 块更大一些", "1/4 块更大一些", "它们一样大", "西瓜不能这样比较"], correct: 0, analysis: "同一个西瓜分得越少，每一块反而越大，所以 1/2 会大于 1/4。" },
        { id: 3, question: "小明有一根 1 米长的七彩毛线，平均剪成 5 截。请问每小截是多长？", options: ["1/2 米", "1/3 米", "1/5 米", "5 米"], correct: 2, analysis: "1 米平均剪成 5 段，每小段就占全长的五分之一，所以长度标记为 1/5 米。" }
      ]
    };
  }

  if (isDecimal) {
    return {
      generalOutline: "打通从分数过渡到零点几的数理盲区，读准小数点位，初步建立十进制细分度量的敏锐数感。",
      keyConcepts: [
        { label: "小数点 (小小分水岭)", detail: "隔开整数部分与小数部分，就像一条清晰的界线。" },
        { label: "十分之一 (0.1)", detail: "把 1 个完整单位平均分成 10 份，其中 1 份就是 0.1。" },
        { label: "十分之几", detail: "像 0.3、0.7 这样的数，都表示把 1 平均分成 10 份后取了其中几份。" }
      ],
      questions: [
        "在温度计、直尺或者价签上，你最常在哪里看到小数点？",
        "一元钱等于 10 角，那么 3 角钱写成用“元”做单位的小数应该怎么记？",
        "0.5 块橡皮擦和半块橡皮擦，它们表示的分量一致吗？",
        "数轴上 0 和 1 中间，除了 0.5，还藏着哪些小数小精灵？"
      ],
      scenario: "下过雨的清晨，小明拿着一把塑料直尺去草坪上量彩虹蜗牛。蜗牛爬行了 3 厘米又多出 5 毫米。多出来的 5 毫米如果用厘米做单位，该怎么用小数记录？",
      presetChatQuestions: [
        { q: "0.1 是什么意思？", a: "0.1 就是把 1 个完整的东西平均分成 10 份，其中拿出 1 份，所以也叫十分之一。" },
        { q: "怎么读带小数点的数？", a: "先读小数点左边的整数部分，再读“点”，最后把右边的数字一个一个念出来。例如 12.55 读作“十二点五五”。" },
        { q: "0.9 加上 0.1 等于多少？", a: "把一个完整单位平均分成 10 份，0.9 是其中 9 份，0.1 是其中 1 份，加起来刚好是完整的 1。" }
      ],
      quizItems: [
        { id: 1, question: "一角钱是 1 元的十分之一。如果用小数来表示 7 角钱，应该记作多少元？", options: ["0.1 元", "0.7 元", "7.0 元", "0.07 元"], correct: 1, analysis: "7 角钱等于十分之七元，我们用小数记作 0.7 元。" },
        { id: 2, question: "在 0.4 和 0.6 之间，藏着下面哪一个数小精灵？", options: ["0.3", "0.5", "0.7", "0.05"], correct: 1, analysis: "0.4 和 0.6 的中间正好是 0.5。" },
        { id: 3, question: "把 1 根竹竿平均分成 10 节，刚好拿走全部 10 节。用小数表示，这等同于数字几？", options: ["0", "1", "10", "0.1"], correct: 1, analysis: "拿走 10/10 也就是拿走完整的 1 根，所以结果等于 1。" }
      ]
    };
  }

  return {
    generalOutline: `帮助 ${g} 学生围绕《${c}》建立核心数学感知，在动手和类比中体会解题要领。`,
    keyConcepts: [
      { label: "核心规则", detail: `掌握《${c}》这一节最关键的计算法则或图形规律，这是解题的骨架。` },
      { label: "运算步骤", detail: "数学是一门讲逻辑顺序的学科，把每一步走稳，结果才更可靠。" },
      { label: "生活类比", detail: "把数字、图形和生活中的水果、折纸、钱币联系起来，概念会更容易理解。" }
    ],
    questions: [
      `本节《${c}》里，最吸引你注意力的第一个数学现象是什么？`,
      "你觉得有什么日常现象或生活小物，也能套用这节课的数学规律？",
      `在解决《${c}》相关练习题时，最容易在哪一步产生偏差或疑问？`,
      "明天课堂上如果要大声分享你的数学新发现，你最想聊什么？"
    ],
    scenario: `你手中的《${c}》探秘手记翻到了最精彩的一页。明天你要代表学习小组在讲台上展示趣味算理推导，你会挑选什么样的实例呢？`,
    presetChatQuestions: [
      { q: `这个《${c}》公式应该怎么用才不容易混淆？`, a: "先分清楚已知条件和目标，再把公式当成桥梁去连接它们。每一步都说出理由，公式就不容易用反。" },
      { q: `为什么很多同学在预习《${c}》时容易卡壳？`, a: "因为只盯着符号很容易抽象。把它换成切蛋糕、分糖果、折纸条这类生活故事，概念一下就会亮起来。" },
      { q: "怎么能让明天的数学课上让老师大赞一通？", a: "把你今天预习时发现的规律，用一个自己画的小图或小例子讲出来。能说清楚来龙去脉，老师最容易看到你的思考力。" }
    ],
    quizItems: [
      { id: 1, question: `在深入探寻《${c}》这一节的规律时，数学中“均分”概念的终极精髓是什么？`, options: ["想切多大就多大看心情", "一视同仁，每一小份的大小都应尽量相等", "大份留给自己，小份给别人", "不能进行切分"], correct: 1, analysis: "均分的关键就在于每一份都一样大，这样后面的比较和计算才有意义。" },
      { id: 2, question: `如果我们在预习《${c}》时，把一张纸连续对折 3 次，最后会被平均分成多少份？`, options: ["3 份", "4 份", "8 份", "6 份"], correct: 2, analysis: "每对折一次，份数就翻一倍，所以 2 x 2 x 2 = 8 份。" },
      { id: 3, question: `在本次《${c}》的自查小测试中，如果你有一题选错或者感到卡壳，最好的想法是什么？`, options: ["说明我学不会数学", "这是发现薄弱点的好机会，顺着解析就能补上", "生气并把笔丢开", "以后不做这类题了"], correct: 1, analysis: "预习时发现问题，本来就是为了第二天课堂更有针对性地理解新知识。" }
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
    { id: 'start', sender: 'ai', text: '嗨！大朋友，我是你的预习助兴小能手 🌟\n在预习《认识分数》的内容时，只要有任何地方犯迷糊，哪怕是最简单的好奇，都可以随时点击下面的气泡来问我。加油鸭！💪' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatIsTyping, setChatIsTyping] = useState(false);

  // Quiz states in Step 3
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Dynamic forecast compre level numbers
  const [forecastBefore] = useState(65);
  const [forecastAfter, setForecastAfter] = useState(65);

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
          options: ["课文意境高深，脑海里没有画面感", "有一些生僻、多音生字词读音和词义记不准", `不知道${authorText}当时是在什么样的背景环境下创作此篇内容的`, "朗读技巧不够到位，不知道轻重音和情感起伏"] 
        },
        { 
          key: 'style',
          question: `想一想，平常学习优秀古诗词和文学，你最喜欢用哪种妙招来加深预习记忆呢？`, 
          options: ["🎨 制作彩色卡片，尝试手绘本篇内容描绘的画卷", `📖 讲大白话，听一听和这篇《${chapter}》/ ${authorText} 背景有关的奇闻趣事`, "✋ 大声并用极具表现力的手势、腔调读诵课文内容", "👂 跟着伴读AI拆解字词意像的字里行间玄机"] 
        }
      ];
    } else if (subject === '英语') {
      return [
        { 
          key: 'difficulty',
          question: `面对新单元的英语模块，你直觉觉得在预习《${chapter}》时最可能卡壳在哪呢？`, 
          options: ["长难单词特别多，拼读时舌头容易打结 🤪", "口语情境对话特别繁琐，读下来时续时断", "不能很好地参悟核心语法框架并用到真实交谈中", "大声跟读说口语时没有底气，怕发音不纯正"] 
        },
        { 
          key: 'style',
          question: `大朋友，平常记忆英语高频热词、玩口语互动，你更青睐采用什么有趣的小技巧？`, 
          options: ["🎹 听带感有韵律英文拼读童谣，把句子唱着记", "🎥 结合短片动画情境，联想日常生活实景", "💬 随时找AI伴学高手开展一唱一和的角色扮演", "📖 像切面包一样拆分自然拼读（Phonics）音节记忆"] 
        }
      ];
    } else {
      const isFraction = chapter.includes('分数') || chapter.includes('部分') || chapter.includes('分母');
      const diffOptions = isFraction 
        ? ["不确定分子分母分别指什么", "分数的大小感觉很容易比反 😵", "不知道怎么把它们画在纸上", "我都还行，挑战一下 😎"]
        : [`对《${chapter}》的基本数量关系感到抽象`, `公式或者算法规律记不准，怕用错`, `不知道如何通过图形或者身边的算盘来数形结合`, `我没问题，挑战自学 😎`];
      return [
        { 
          key: 'difficulty',
          question: `作为全新的数学知识，你直觉觉得自己预习《${chapter}》最可能在哪里卡住呢？或者已经掌握了哪些部分？`, 
          options: diffOptions
        },
        { 
          key: 'style',
          question: "大朋友，你平常解数学题、背公式，最喜欢采用哪种妙招吸收呢？", 
          options: ["📷 喜欢看动态画画拼图、圆饼折纸法", "📖 喜欢听趣味历史段子或数数学故事", "✋ 喜欢动手折纸条算切口、生活实物演算", "👂 喜欢跟着老师拆解例题规律"] 
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
      { id: 'start', sender: 'ai', text: `嗨！大朋友，我是你的预习助兴小能手 🌟\n在预习《${chapter || '当前知识点'}》的内容时，只要有任何地方犯迷糊，哪怕是最简单的好奇，都可以随时点击下面的气泡来问我。加油鸭！💪` }
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
        responseText = `大朋友，针对你提问的“${txt}”，这真是一个极其绝妙的语文预习切入点！在欣赏优美古诗词时，我们不仅要读准字音，最关键的是要在脑海里勾勒活灵活现的彩色画面和揣摩李白豪迈浪漫的胸襟噢。你愿意在明天上课时，当一回小小朗诵家并和同学老师探索解答吗？\n\n💡 提示：可以在隔壁黑板试一下常用快捷提问：“怎么才能富有感情地朗读诗歌呢？” 或 “诗句中的‘意境’是什么意思呀？”`;
      } else if (subject === '英语') {
        responseText = `大朋友，对于你疑惑的“${txt}”，这充分显示了你极佳的英语触觉和勇敢探索精神！在预习英语单元时，大声念出来感知肌肉记忆比什么都见效，不要有任何心理压力。你想在明天的口语角色扮演课上大放异彩吗？\n\n💡 提示：可以在隔壁黑板试一下常用快捷提问：“怎么快速拼读一个很长的英文单词？” 或 “口语对话总是不好意思说出口怎么办？”`;
      } else {
        responseText = `大朋友，针对你提问的“${txt}”，这真是一个极其爱思考的小细节！我们可以利用分数线来解答，分母（在下面辛苦托举的妈妈）把饼等额划成更多小格，分子（骑在妈妈肩头数苹果的小孩）就是你想咬的那几口噢。你愿意明天的几何课上，和老师分享你的奇思妙想吗？\n\n💡 提示：可以在隔壁黑板试一下常用快捷提问：“1/2 和 2/4 哪个大？” 或 “3/4 怎么在草稿本里画？”`;
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
          summary: `你太牛啦！你对《${chapter}》中的核心概念吃得很透。小自测验证明，你对相关知识要点理解已经越过了全班 ${65 + correctCount*10}% 小学生的预备直觉！`,
          classLink: {
            question: `“大家在预习完《${chapter}》后，最能体会到哪些深刻应用和特色呢？”`,
            answer: `“老师，我是这样看的：我们可以把这些概念和我们的日常生活模型连接，用立体和更惊艳的直觉去剖析，从而更透彻地学进去！”`
          },
          forecastLeap: `恭喜！由于你在脑瓜中建立了核心模型并大获成功，你的《${chapter}》明日听课学习效率值完成了华丽升级！`,
          scoreValue: 65 + correctCount * 10
        };
        setCustomEval(localFallback);
        finalScoreValue = localFallback.scoreValue;
      }
    } catch (e) {
      console.error("Failed to load Qwen evaluation:", e);
      const localFallback = {
        summary: `你太牛啦！你对《${chapter}》中的核心概念吃得很透。小自测验证明，你对相关知识要点理解已经越过了全班 ${65 + correctCount*10}% 小学生的预备直觉！`,
        classLink: {
          question: `“大家在预习完《${chapter}》后，最能体会到哪些深刻应用和特色呢？”`,
          answer: `“老师，我是这样看的：我们可以把这些概念和我们的日常生活模型连接，用立体和更惊艳的直觉去剖析，从而更透彻地学进去！”`
        },
        forecastLeap: `恭喜！由于你在脑瓜中建立了核心模型并大获成功，你的《${chapter}》明日听课学习效率值完成了华丽升级！`,
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
      { id: 'start', sender: 'ai', text: `嗨！大朋友，我是你的预习助兴小能手 🌟\n在预习《${chapter}》的内容时，只要有任何地方犯迷糊，哪怕是最简单的好奇，都可以随时点击下面的气泡来问我。加油鸭！💪` }
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
      {/* Informative description header */}
      <div className="text-center space-y-2 px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/70 text-emerald-700 text-[10px] sm:text-xs font-semibold rounded-full border border-emerald-200">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Preview Agent · 3 个技能协同</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">课前 15 分钟小挑战</h2>
        <p className="text-slate-500 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed px-1">
          输入知识点，马上获得你的专属学习小卡片和趣味小测试！
        </p>
         {/* Form elements */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>科目</span>
            </label>
            <select 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-400 bg-white"
            >
              <option>数学</option>
              <option>语文</option>
              <option>英语</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
              <span>年级</span>
            </label>
            <select 
              value={grade} 
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-400 bg-white"
            >
              <option>三年级</option>
              <option>二年级</option>
              <option>四年级</option>
              <option>五年级</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>知识点</span>
            </label>
            <input 
              type="text" 
              value={chapter} 
              onChange={(e) => setChapter(e.target.value)}
              placeholder="认识分数"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-400 bg-white"
            />
          </div>
        </div>

        {/* Generate triggers and Questionnaire modal */}
        {!isGenerating ? (
          <div className="pt-1">
            <button
              type="button"
              onClick={startTaskGen}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-[1.002] active:scale-[0.99] transition-all cursor-pointer px-4"
            >
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
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
                <div className="bg-gradient-to-br from-emerald-50/50 via-teal-50/10 to-slate-50 border border-emerald-150 rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 animate-fade-in-up" id="pv_task_card">
                  <div className="flex justify-between items-center border-b border-emerald-100/60 pb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-600 animate-bounce" />
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">明日自学导案卡 (小学 {grade})</h4>
                        <p className="text-[10px] text-slate-550">定制方向：{profileAnswers.style}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] bg-emerald-100 text-emerald-800 rounded font-semibold">专属学习小档案</span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Goal & time - Two columns on PC/iPad, stacked on Mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
                        <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 mb-1">
                          <Compass className="w-3.5 h-3.5 text-emerald-600" />
                          <span>预习小目标</span>
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3 text-left">
                          {aiCustomContent?.generalOutline || "理解认识分数的数理本质，读懂写对 1/2, 3/4 等简单比例型，建立草稿纸切块作图直觉。"}
                        </p>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
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

                    {/* Simple structured mindmap */}
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
                      <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                        <Brain className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                        <span>《{chapter}》重点知识小地图</span>
                      </span>
                      <div className="space-y-1.5 font-sans text-[11px] text-slate-600 leading-relaxed pl-1">
                        <p className="font-bold text-slate-800 flex items-center gap-1">
                          <Brain className="w-3.5 h-3.5 text-emerald-500" />
                          <span>核心魔法：怎么平均分和表示</span>
                        </p>
                        <div className="mt-4 relative pl-8 sm:pl-10 before:absolute before:left-3.5 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-emerald-100 before:rounded-full space-y-4">
                          {aiCustomContent?.keyConcepts ? (
                            aiCustomContent.keyConcepts.map((concept, i) => (
                              <div key={i} className="relative">
                                <div className="absolute -left-5 sm:-left-7 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-0.5 bg-emerald-200"></div>
                                <div className="absolute -left-[23px] sm:-left-[31px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white shadow-sm z-10"></div>
                                <div className="bg-gradient-to-r from-white to-slate-50 border border-slate-100 p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow hover:scale-[1.01] flex flex-col gap-2 text-left">
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
                                <div className="bg-gradient-to-r from-white to-slate-50 border border-slate-100 p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow hover:scale-[1.01] flex flex-col gap-2 text-left">
                                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg w-fit">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    分母 (下方数据)
                                  </span>
                                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">总共被砍切的均等总瓣数 [切蛋糕数]</p>
                                </div>
                              </div>
                              <div className="relative">
                                <div className="absolute -left-5 sm:-left-7 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-0.5 bg-emerald-200"></div>
                                <div className="absolute -left-[23px] sm:-left-[31px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white shadow-sm z-10"></div>
                                <div className="bg-gradient-to-r from-white to-slate-50 border border-slate-100 p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow hover:scale-[1.01] flex flex-col gap-2 text-left">
                                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg w-fit">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    分子 (上方数据)
                                  </span>
                                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">你分到、占有或拿走的那几瓣 [取走格数]</p>
                                </div>
                              </div>
                              <div className="relative">
                                <div className="absolute -left-5 sm:-left-7 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-0.5 bg-emerald-200"></div>
                                <div className="absolute -left-[23px] sm:-left-[31px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white shadow-sm z-10"></div>
                                <div className="bg-gradient-to-r from-white to-slate-50 border border-slate-100 p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow hover:scale-[1.01] flex flex-col gap-2 text-left">
                                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg w-fit">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    分线 (居中横杆)
                                  </span>
                                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">代表物理本质“平均分”，切忌多寡不均</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
                    <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{aiCustomContent ? "AI 智能定制 4 大思考小扣" : "伴读思考小挑战"}</span>
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
                            <span className="flex-1">分数代表西瓜的“一瓣”还是“切块整体”？能用来算绳线测绘吗？</span>
                          </li>
                          <li className="flex gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">2</span>
                            <span className="flex-1">1/2 块草莓生日饼 和 1/4 瓣究竟谁更大一些呢？为什么？</span>
                          </li>
                          <li className="flex gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">3</span>
                            <span className="flex-1">分母可否是数字一或数字零呢？为什么？</span>
                          </li>
                        </>
                      )}
                    </ol>
                  </div>

                  {/* Pizza slice scenario questions */}
                  <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-sm space-y-1.5 text-left">
                    <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-emerald-600" />
                      <span>趣味小故事（结合：{profileAnswers.style}）</span>
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                      {aiCustomContent?.scenario || "周末狂欢，全家团聚点了一个超大12寸至尊披萨饼。大厨 average 均匀下切分了 8 瓣。你、爸爸、妈妈、以及小弟弟，规定每个人由于肚量拿一瓣垫肚子。请问：你们大家合力吃掉了这整盒披萨的几分之几？铁盘里还能生还几分之几？"}
                    </p>
                  </div>

                  {/* Forecast indicator slider */}
                  <div className="bg-gradient-to-r from-amber-50/70 to-orange-50/70 border border-amber-150 p-4 rounded-xl space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 text-xs">
                      <span className="font-bold text-amber-850 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                        <span>听课秒懂率预估（看看你能听懂多少）</span>
                      </span>
                      <span className="font-mono text-amber-700 font-bold text-sm">{forecastBefore}% 听透可能性</span>
                    </div>

                    <div className="w-full bg-white h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse" style={{ width: `${forecastBefore}%` }} />
                    </div>

                    <span className="text-[10px] text-slate-500 leading-normal flex items-start gap-1 text-left">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>别担心！跟着小助手热热身，明天上课你一定会变成“秒懂”小天才！</span>
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

      {/* STEP 2: Chat helper and Preset tags */}
      {visibleSteps.includes(2) && (
        <div ref={stepRefs[2]} id="preview_step_2" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-5 sm:space-y-6 animate-fade-in-up">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xs font-bold font-mono">02</span>
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-1.5 justify-start">
                <MessageSquare className="w-4 h-4 text-blue-600 animate-pulse" />
                <span>互动答疑：有问题随时问我哦</span>
              </h3>
              <div className="text-[10px] sm:text-[11px] text-slate-400">像大朋友一样陪你读书，有不懂的随时点我问！</div>
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
                    className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 border border-emerald-150 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-800 rounded-full text-[10px] sm:text-[10.5px] font-semibold active:scale-95 transition-all cursor-pointer shadow-sm flex items-center gap-1"
                  >
                    <Search className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{item.q}</span>
                  </button>
                ))}
              </div>

              {/* Chat window box */}
              <div className="bg-slate-50 border border-slate-205 rounded-2xl p-3 sm:p-4 flex flex-col space-y-3 sm:space-y-4">
                <div 
                  id="pv-chat-scroller"
                  className="h-56 sm:h-64 overflow-y-auto space-y-3.5 pr-1 scroll-smooth"
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
                              : 'bg-emerald-600 text-white rounded-tr-none shadow-sm'
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
                    className="flex-grow px-3 py-2 bg-white border border-slate-205 focus:border-emerald-400 rounded-xl text-xs font-semibold focus:outline-none min-h-[40px]"
                  />
                  <button 
                    type="button"
                    onClick={handleChatSend}
                    className="p-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl active:scale-95 transition-all cursor-pointer shadow-sm flex items-center justify-center min-h-[40px]"
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
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-705 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
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
        <div ref={stepRefs[3]} id="preview_step_3" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-5 sm:space-y-6 animate-fade-in-up">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="w-8 h-8 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xs font-bold font-mono">03</span>
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
                      className={`border border-slate-205 rounded-xl p-3.5 sm:p-4 space-y-3 transition-all ${
                        quizSubmitted 
                          ? selectedAnswers[item.id] === item.correct 
                            ? 'border-emerald-200 bg-emerald-50/20' 
                            : 'border-rose-200 bg-rose-50/20'
                          : 'bg-white hover:border-slate-300'
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
                              className={`flex items-center gap-2 p-2 sm:p-2.5 border rounded-lg cursor-pointer transition-all text-[11px] sm:text-xs font-semibold select-none ${
                                isSelected 
                                  ? 'border-emerald-500 bg-emerald-50/30 text-emerald-800 shadow-sm' 
                                  : quizSubmitted && isCorrect 
                                    ? 'border-emerald-300 bg-emerald-50/20 text-emerald-700'
                                    : 'border-slate-200 hover:bg-slate-50 text-slate-705'
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
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md cursor-pointer active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-white animate-pulse" />
                  <span>提交答案，看看我的秒懂率！</span>
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
                        <div className="p-3.5 sm:p-4 bg-emerald-50/70 text-emerald-850 rounded-xl border border-emerald-150 space-y-1.5 animate-fade-in">
                          <h4 className="font-extrabold text-xs flex items-center gap-1.5">
                            <Award className="w-4.5 h-4.5 text-emerald-600 animate-bounce" />
                            <span>你的专属学习小评价</span>
                          </h4>
                          <p className="text-[11px] sm:text-xs leading-relaxed text-slate-705">
                            {customEval.summary}
                          </p>
                        </div>

                        {/* Tips for Classroom alignment */}
                        <div className="border border-slate-150 rounded-xl p-3.5 sm:p-4.5 bg-sky-50/50 space-y-3 shadow-none animate-fade-in">
                          <span className="text-[11px] sm:text-xs font-bold text-sky-900 flex items-center gap-1.5 flex-wrap">
                            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500 animate-glow-pulse" />
                            <span>明天课堂上的表现秘籍（答出这些，老师肯定夸你！）</span>
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-white p-3 rounded-lg border border-slate-100 flex flex-col justify-between gap-15">
                              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold block flex items-center gap-1">
                                <Check className="w-3 h-3 text-slate-400" />
                                <span>老师很可能会问这些哦</span>
                              </span>
                              <p className="text-[11px] sm:text-xs text-slate-800 font-semibold leading-relaxed">
                                {customEval.classLink?.question || `“大家能在现实生活中举几个分数的巧妙应用案例么？”`}
                              </p>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-slate-100 flex flex-col justify-between gap-15">
                              <span className="text-[9px] sm:text-[10px] text-emerald-500 font-bold block flex items-center gap-1">
                                <Smile className="w-3 h-3 text-emerald-500" />
                                <span>建议你可以这样回答：</span>
                              </span>
                              <p className="text-[11px] sm:text-xs text-slate-800 font-semibold leading-relaxed">
                                {customEval.classLink?.answer || `“吃至尊披萨饼时切成8块，我合吞2格就是 1/4，它和4/8是一样饱腹的，这叫等值！”`}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Forecast forecast percentage upgrade details */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-55 border border-amber-205 p-4 sm:p-5 rounded-2xl relative animate-fade-in">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                            <div className="space-y-1 flex-1">
                              <span className="text-xs font-bold text-amber-850 block flex items-center gap-1">
                                <TrendingUp className="w-4 h-4 text-amber-600 animate-pulse" />
                                <span>听课秒懂率飙升到 {forecastAfter}% 啦！</span>
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
