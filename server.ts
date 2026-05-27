import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(express.json());

  // Curriculum Knowledge Base (Simulated Core Database)
  const curriculumDB: Record<string, Record<string, any>> = {
    "数学": {
      "认识分数": {
        generalOutline: "理解分数与比例的数理本质，掌握等分概念与分数的读写规则，建立数形结合的逻辑直觉。",
        keyConcepts: [
          { label: "分母 (分数线下方)", detail: "表示把一个整体（单位“1”）平均分成的总份数，是分数的基础。" },
          { label: "分子 (分数线上方)", detail: "表示从平均分好的总份数中，实际取出的份数。" },
          { label: "分数线 (中间横线)", detail: "表示“平均分”这一数学动作，确保每一份的大小绝对相等。" }
        ],
        questions: [
          "在将一个苹果平均分给两个人的过程中，“平均”这个动作在数学上有什么重要意义？",
          "画一个矩形切成 4 份，给其中 2 份涂上颜色。请问这和切成 2 份取 1 份一样大吗？",
          "分母可以为数字零吗？在数学运算中，除数为什么不能为零？",
          "在生活中，你还能发现哪些运用分数原理来分配资源的例子？"
        ],
        scenario: "假设一个标准的 12 寸披萨被均分为 8 等份。如果两个人各自取用了 1 份，他们共消耗了整体的几分之几？剩余部分用分数应如何严谨表达？",
        presetChatQuestions: [
          { q: "1/2 和 2/4 哪个大？", a: "1/2 和 2/4 是一样大的，这在数学上称为「等值分数」。\n1/2 表示把一个整体平均分成 2 份取 1 份；2/4 表示平均分成 4 份取 2 份。如果在纸上画两个相同大小的图形分别涂色，你会发现涂色面积完全相等。根据分数的基本性质：分数的分子和分母同时乘或除以同一个不为零的数，分数的大小不变。" },
          { q: "3/4 怎么在草稿本里画？", a: "可以通过以下严谨的数学作图步骤来表示：\n1️⃣ 确定整体：画一个规则的图形（如长方形或圆形）。\n2️⃣ 平均分：分母是 4，意味着必须将图形「完全平均」地分成 4 等份（比如长方形用直尺三等分线划开）。\n3️⃣ 取份数：分子是 3，将其中 3 份涂上颜色。涂色部分即为整体的 3/4。" },
          { q: "怎么记分子和分母谁在上谁在下？", a: "可以从「数学定义」和「历史渊源」来科学记忆：\n👉 位置与定义：下方是分母，表示把整体平均分成的总份数，是基础；上方是分子，表示取出的份数。\n👉 历史渊源：我国古代数学著作《九章算术》中指出，整体被均分后产生的基础份额就像母亲孕育孩子。作为基础的总份数叫“分母”在下方；派生出具体取出的份数叫“分子”在上方。" }
        ],
        quizItems: [
          { id: 1, question: "将一个蛋糕平均分给 4 个人，每个人得到的份额用分数表示是多少？", options: ["1/2", "1/4", "2/4", "4/1"], correct: 1, analysis: "分母 4 代表将整体平均分成 4 份，分子 1 代表每人获取 1 份，因此表示为 1/4。" },
          { id: 2, question: "比较 1/2 和 1/4 的大小，以下判断正确的是？", options: ["1/2 大于 1/4", "1/4 大于 1/2", "两者完全相等", "无法比较"], correct: 0, analysis: "在整体相同的前提下，分母越小，表示被平均分成的份数越少，每一份的实际数值就越大。因此 1/2 > 1/4。" },
          { id: 3, question: "一条 1 米长的线段被平均分成 5 段，每一段的长度是多少？", options: ["1/2 米", "1/3 米", "1/5 米", "5 米"], correct: 2, analysis: "将 1 米的整体平均分成 5 份，每 1 份即为全长的五分之一，记作 1/5 米。" }
        ]
      },
      "认识小数": {
        generalOutline: "理解小数的意义与十进制的扩展，掌握小数的读写规则，初步建立小数的数学数感。",
        keyConcepts: [
          { label: "小数点", detail: "分隔整数部分与小数部分的符号，用于确定数值的数位。" },
          { label: "十分之一 (0.1)", detail: "将单位“1”平均分成 10 份，其中的 1 份即为十分之一，记作 0.1。" },
          { label: "十分之三 (0.3)", detail: "将单位“1”平均分成 10 份，其中的 3 份即为十分之三，记作 0.3。" }
        ],
        questions: [
          "在我们的温度计、直尺中，哪个符号最为显眼？它在度量中起到什么作用？",
          "一元等于 10 角，请问 3 角用“元”作单位的小数应该怎么表示？",
          "0.5 和 1/2 表示的数值是一样的吗？为什么？",
          "在数轴上，0 和 1 之间还可以表示哪些小数？"
        ],
        scenario: "测量物体的长度时，如果结果不是整厘米数，例如 3 厘米又多出 5 毫米，我们可以使用小数来精确记录这个物理长度。",
        presetChatQuestions: [
          { q: "0.1 是什么意思？", a: "0.1 是十进制小数的基础单位之一。它表示将一个整体（单位“1”）平均分成 10 等份，取其中的 1 份。在分数中，它等同于十分之一（1/10）。" },
          { q: "怎么读带小数点的数？", a: "读小数时，小数点左边的整数部分按照整数的读法来读（例如 12 读作十二），小数点读作“点”，小数点右边的小数部分则按顺序依次读出每一个数字（例如 55 读作五五）。所以 12.55 读作：十二点五五。" },
          { q: "0.9 加上 0.1 等于多少？", a: "0.9 表示 9 个 0.1，再加上 1 个 0.1，一共是 10 个 0.1。在十进制中，满十进一，因此 0.9 + 0.1 = 1.0，即整数 1。" }
        ],
        quizItems: [
          { id: 1, question: "一角是 1 元的十分之一。如果用小数来表示 7 角，应该记作多少元？", options: ["0.1 元", "0.7 元", "7.0 元", "0.07 元"], correct: 1, analysis: "1 元 = 10 角，7 角是十分之七元，用小数表示为 0.7 元。" },
          { id: 2, question: "在数轴上，位于 0.4 和 0.6 正中间的小数是哪一个？", options: ["0.3", "0.5", "0.7", "0.05"], correct: 1, analysis: "0.4 表示 4 个 0.1，0.6 表示 6 个 0.1，它们中间的值是 5 个 0.1，即 0.5。" },
          { id: 3, question: "把一条线段平均分成 10 段，取其中的 10 段。用小数表示是多少？", options: ["0", "1", "10", "1.0"], correct: 3, analysis: "取 10 段即取了整体的全部（10/10），在数值上等于 1，用小数表示为 1.0。" }
        ]
      }
    },
    "语文": {
      "望天门山": {
        generalOutline: "感受李白《望天门山》的雄奇意境与浪漫主义风格，理解重点字词的含义，体会诗人的思想感情。",
        keyConcepts: [
          { label: "“中断”", detail: "指天门山被长江水势冲开，体现了江水波澜壮阔、不可阻挡的自然气势。" },
          { label: "“回”", detail: "指江水在天门山受阻后回旋、转向，表现了水流的湍急与地理地形的险要。" },
          { label: "“两岸青山相对出”", detail: "运用化静为动的动感描写，表现了行船过程中两岸山峰迎面而来的视觉效果。" }
        ],
        questions: [
          "“两岸青山相对出，孤帆一片日边来”在你的脑海中勾勒出了一幅怎样的画面？",
          "为什么李白要用“相对出”来描写原本静止的群山？",
          "“碧水东流至此回”中的“回”字，表现了长江水怎样的动态特征？",
          "这首诗表达了诗人怎样的心境与人生态度？"
        ],
        scenario: "这首诗是李白在开元十三年（725年）乘舟赴吴楚途中，经过天门山时所作。诗人通过对壮丽山河的描绘，抒发了对祖国大好河山的热爱和豁达、乐观的精神。",
        presetChatQuestions: [
          { q: "天门山真的被江水冲断了吗？", a: "这是诗人运用的夸张与想象的文学手法。长江水势浩大，仿佛将巍峨的天门山劈开，这种描写极具视觉冲击力，体现了李白诗歌的浪漫主义色彩。" },
          { q: "什么是“相对出”？", a: "这是一种视觉上的相对运动效果。诗人乘船顺流而下，由于船只在快速行进，两岸原本静止的青山在视觉上就像是迎面走来一样。这种“化静为动”的手法使画面充满生机。" },
          { q: "如何更好地背诵和理解古诗？", a: "理解意境是背诵的基础。可以通过联想诗中描绘的画面：先是长江冲破天门山、水流回旋的磅礴气势，接着是青山迎面而来、孤帆伴随红日出现的旷达远景。将文字转化为画面，能有效加深文学记忆。" }
        ],
        quizItems: [
          { id: 1, question: "《望天门山》的作者是唐代哪位著名的浪漫主义诗人？", options: ["杜甫", "李白", "白居易", "王维"], correct: 1, analysis: "《望天门山》是唐代浪漫主义诗人李白（被后人誉为“诗仙”）的作品。" },
          { id: 2, question: "“孤帆一片日边来”中的“孤帆”运用了什么修辞手法？", options: ["拟人", "借代", "比喻", "夸张"], correct: 1, analysis: "“孤帆”用船的帆来代指整只船，这是文学中常见的借代修辞手法。" },
          { id: 3, question: "课前预习古诗时，在脑海中构建诗句的画面，主要目的是什么？", options: ["完成美术作业", "帮助深入理解诗歌意境，增强对文字的感知力和鉴赏能力", "为了打发时间", "以上都不对"], correct: 1, analysis: "将诗句转化为视觉意象，有助于跨越语言的障碍，直接体会诗人传达的意境与情感，从而提升语文学科的素养。" }
        ]
      }
    },
    "英语": {
      "What would you like": {
        generalOutline: "掌握英语中关于点餐和表达需求的常用交际句型，理解礼貌用语的语境，提升跨文化交际能力。",
        keyConcepts: [
          { label: "“Would like”", detail: "表示“想要”，是“want”的委婉和礼貌形式，常用于正式或客气的社交场合（如餐厅点餐）。" },
          { label: "食物类词汇", detail: "掌握如 noodles, beef, pizza 等常见食物词汇的拼写与自然发音规律。" },
          { label: "“Here you are”", detail: "意为“给你”，是递给别人东西时的常用交际应答语，体现了服务与社交的礼仪。" }
        ],
        questions: [
          "在西餐厅点餐时，为了表达礼貌，我们通常用哪个句式来代替“I want”？",
          "如何通过划分音节来高效记忆“vegetable”这样较长的单词？",
          "当服务员把食物递给你并说“Here you are”时，你应如何进行得体的回应？",
          "你能用“I would like...”造一个完整的句子来表达你今天的就餐需求吗？"
        ],
        scenario: "在真实的餐厅情境中，掌握得体的点餐用语非常重要。当服务员询问 'What would you like to order?' 时，使用礼貌的句型不仅能准确传达需求，还能体现良好的跨文化交际素养。",
        presetChatQuestions: [
          { q: "What would you like to... 应该怎么使用？", a: "它是一个常用的表达意愿的句型。后面接动词原形，用于礼貌地询问对方想做什么。例如：`What would you like to eat?`（你想吃什么？）或者 `What would you like to do?`（你想做什么？）。" },
          { q: "如何更高效地记忆较长的英语单词？", a: "可以使用自然拼读法（Phonics）和音节划分法。以 noodles 为例，可以将其划分为 noo-dles 两个音节，结合字母发音规律进行记忆，这样比死记硬背字母顺序更科学高效。" },
          { q: "在西餐厅点餐，说 I want 会不礼貌吗？", a: "“I want”在语法上是正确的，但在服务或正式场合中显得过于直接和生硬。使用“I would like...”作为委婉语，能够展现出更好的礼貌和教养，符合英语国家的社交习惯。" }
        ],
        quizItems: [
          { id: 1, question: "在餐厅点餐时，以下哪种表达最为得体、礼貌？", options: ["I want spaghetti!", "Give me spaghetti!", "I would like some spaghetti, please.", "Spaghetti now!"], correct: 2, analysis: "使用 'I would like...' 并加上 'please' 是英语中最标准的礼貌请求句型。" },
          { id: 2, question: "以下哪个单词表示“蔬菜”？", options: ["Fruit", "Vegetable", "Chicken", "Orange juice"], correct: 1, analysis: "Fruit 意为水果，Chicken 意为鸡肉，Vegetable 意为蔬菜。" },
          { id: 3, question: "当别人把东西递给你并说 'Here you are' 时，最得体的回答是：", options: ["Bye bye!", "Thank you!", "No!", "Pleased to meet you."], correct: 1, analysis: "在接受别人的物品或服务时，说 'Thank you' 是基本的国际社交礼仪。" }
        ]
      }
    }
  };

  // Helper for dynamic subject/chapter fallback matching inside database
  function getFallbackContent(sub: string, gd: string, ch: string) {
    const s = sub || "数学";
    const g = gd || "三年级";
    const c = ch || "认识分数";

    // 1st Layer: Exact Match inside our rich Dynamic Curriculum DB
    const subDB = curriculumDB[s];
    if (subDB) {
      // Find matching keys
      const matchedKey = Object.keys(subDB).find(key => c.includes(key) || key.includes(c));
      if (matchedKey) {
        console.log(`[Database Hit] Matched structured entry: ${s} -> ${matchedKey}`);
        return subDB[matchedKey];
      }
    }

    // 2nd Layer: If no match is found, generate elegant PARAMETERIZED contents on the fly!
    console.log(`[Database Miss] Dynamically constructing specialized templated database entry for: ${s} - ${c}`);
    if (s === "语文") {
      return {
        generalOutline: `预习《${c}》的核心篇章与意境特色，体会其文学价值与人文思想。`,
        keyConcepts: [
          { label: "意境联想", detail: `在阅读《${c}》时，将文字转化为生动的视觉画面，加深对文章的理解。` },
          { label: "字词结构分析", detail: `圈出文章中的生字词，通过部首拆解和上下文语境，准确掌握其读音和多重含义。` },
          { label: "创作背景共情", detail: `结合时代背景，体会作者在创作《${c}》时的心境与情感表达。` }
        ],
        questions: [
          `在阅读《${c}》后，哪些句子最能引发你的思考？请结合文本进行分析。`,
          `如果将《${c}》改编为短剧，你会如何塑造其中的核心人物或场景？`,
          `古人写文章讲究炼字，你认为文中哪个词语堪称“诗眼”或“文眼”？为什么？`,
          `在朗读《${c}》时，你认为应该采用怎样的语气和节奏来契合文章的情感？`
        ],
        scenario: `在预习《${c}》时，尝试总结文章的核心思想与生字词，将其整理成一份知识导图，以便在课堂上进行高效的学术探讨。`,
        presetChatQuestions: [
          { q: `如何深入理解《${c}》的核心思想？`, a: `可以通过关注课文下方的注释，结合文章的段落结构和时代背景，逐步梳理作者的写作逻辑与情感脉络。` },
          { q: "课前预习语文的最佳方法是什么？", a: "建议大声朗读课文以培养语感，同时圈画出重点词句，并在旁边写下自己的批注和疑问，带着问题去听课。" },
          { q: `了解《${c}》的创作背景有何意义？`, a: "文学作品往往是时代和作者个人境遇的反映。知人论世，能够帮助我们更准确地把握文章的深层含义，与作者产生跨越时空的思想共鸣。" }
        ],
        quizItems: [
          { id: 1, question: `在预习《${c}》遇到生词时，最科学的做法是：`, options: ["直接跳过不看", "查阅字典，掌握其读音、笔顺及释义", "根据偏旁主观猜测读音", "等待老师上课讲解"], correct: 1, analysis: "主动查阅字典并书写，能够建立深刻的记忆，是培养自主学习能力的良好习惯。" },
          { id: 2, question: `预习《${c}》时提倡“在脑海中构建画面”，其科学依据是：`, options: ["纯粹为了消磨时间", "利用视觉化思维辅助文本理解，增强记忆深度与情感体验", "仅仅为了构图训练", "没有实际科学依据"], correct: 1, analysis: "将文本转化为视觉意象是高效的阅读策略，能够有效提升对文学作品的鉴赏能力。" },
          { id: 3, question: `了解《${c}》的创作背景对学习有什么实质性帮助？`, options: ["有助于知人论世，深入理解作者的创作意图与文章的深层内涵", "增加不必要的学习负担", "只用于应付考试的填空题", "没有任何关系"], correct: 0, analysis: "文学批评中的“知人论世”原则，强调结合时代与作者生平来解析文本，这是深度阅读的重要方法。" }
        ]
      };
    } else if (s === "英语") {
      return {
        generalOutline: `掌握英语单元《${c}》的核心词汇与交际句型，提升跨文化交流的准确性与流利度。`,
        keyConcepts: [
          { label: "自然拼读与音节", detail: `针对《${c}》中的长难单词，利用自然拼读法进行音节拆分，科学记忆单词拼写与发音。` },
          { label: "核心句式结构", detail: `熟练掌握本课对话中的关键句型语法结构，以便在实际语境中灵活替换词汇并应用。` },
          { label: "语境交际应用", detail: `将所学英语知识代入真实的英美文化场景中，体会语言在实际生活中的交际功能。` }
        ],
        questions: [
          `在预习本单元《${c}》时，哪个长单词的发音规律最值得总结？`,
          `课文对话中使用了哪些体现英语国家礼仪的交际用语？`,
          `如何将本课的核心长句拆解为基础的主谓宾结构？`,
          `如果明天在课堂上进行角色扮演，你会如何运用本单元的句型来开启对话？`
        ],
        scenario: `假设你正在参加一场国际交流活动，你需要运用刚预习的《${c}》中的交际句型，与外国友人进行得体、流利的对话。`,
        presetChatQuestions: [
          { q: `记忆《${c}》单元的单词有什么科学方法？`, a: "推荐使用自然拼读法（Phonics）。将单词按照元音音节进行拆分，将发音与字母组合建立联系，这比机械背诵字母顺序更符合大脑的记忆规律。" },
          { q: "如何克服开口说英语的紧张感？", a: "语言的核心是交流。可以通过跟读标准的音频材料来建立语感，不要害怕犯错。自信的表达和得体的肢体语言同样是跨文化交际的重要组成部分。" },
          { q: `《${c}》单元的核心语法应该如何理解？`, a: "可以将句型结构视为一个框架，掌握了主干框架后，只需根据具体语境替换相应的名词或动词即可。多做句型替换练习有助于内化语法规则。" }
        ],
        quizItems: [
          { id: 1, question: `在学习《${c}》时遇到较长的生词，最科学的拼读策略是：`, options: ["完全忽略", "根据元音规律划分音节，逐节拼读", "死记硬背字母顺序", "随意乱读"], correct: 1, analysis: "按照音节拆分单词符合自然拼读规律，有助于高效记忆与发音。" },
          { id: 2, question: `在《${c}》的对话练习中，大声朗读核心句型的科学原理是：`, options: ["为了制造噪音", "通过发声训练建立口腔肌肉记忆，培养语感", "为了引起他人注意", "为了完成作业"], correct: 1, analysis: "口语表达需要发音器官的配合，大声朗读能够有效建立肌肉记忆，提升语言的流利度与自然度。" },
          { id: 3, question: `当同学在英语角色扮演中表现优异时，得体的英文评价是：`, options: ["Just so so.", "Thank you!", "Excellent job! You are so awesome!", "Goodbye!"], correct: 2, analysis: "给予他人真诚的赞美（如 'Excellent job!'）是英语国家重要的社交礼仪，有助于营造良好的交流氛围。" }
        ]
      };
    }

    // Default Math Dynamic Parametric Fallback
    return {
      generalOutline: `探究数学章节《${c}》的核心逻辑与定理原理，掌握数学公式的推导过程及其实际应用。`,
      keyConcepts: [
        { label: "数学原理", detail: `深入理解书本定义新概念与公式的数学背景，它们是为了解决何种实际问题而产生的。` },
        { label: "数形结合", detail: `将抽象的数学公式与直观的几何图形相结合，通过图形来辅助理解代数关系。` },
        { label: "逻辑推演", detail: `在《${c}》的知识体系中，注重因果关系和逻辑推导，避免对数学结论的机械记忆。` }
      ],
      questions: [
        `如何将《${c}》中的抽象数学概念，应用到实际的物理测量或生活统计中？`,
        `为什么数学定义中往往要求“绝对相等”或“严格均分”？这体现了数学的什么特性？`,
        "该章节公式中的参数（如分母或除数）有限制条件吗（比如不能为零）？为什么？",
        `如果要向同学讲解这一章节的核心难点，你会绘制怎样的示意图来辅助说明？`
      ],
      scenario: `在解决与《${c}》相关的实际应用题时，通过构建数学模型和绘制草图，将复杂的生活问题转化为严谨的数学方程式进行求解。`,
      presetChatQuestions: [
        { q: `如何准确记忆《${c}》中的公式而不易混淆？`, a: "不要死记硬背，而应理解公式的推导过程。明确公式中每个变量所代表的物理意义或几何意义，通过数形结合的方法来加深理解。" },
        { q: `预习《${c}》时遇到难以理解的抽象概念怎么办？`, a: "尝试将抽象概念具象化。可以寻找生活中的实际案例，或者在草稿纸上绘制图表。数学概念往往是对现实规律的抽象概括。" },
        { q: "如何在几何课程中提高空间想象力？", a: "可以通过动手操作（如绘制草图）或使用几何软件来直观感受图形的变化规律，从而建立清晰的空间思维模型。" }
      ],
      quizItems: [
        { id: 1, question: `在探究《${c}》的相关规律时，“平均分”这一概念在数学上的严谨定义是：`, options: ["根据主观意愿进行划分", "确保划分出的每一份在数值或几何量度上绝对相等", "大小大致差不多即可", "无法进行划分"], correct: 1, analysis: "在数学中，“平均分”要求严格的等量划分，这是保证后续运算逻辑严密性的基础。" },
        { id: 2, question: `预习《${c}》时，如果将一条线段连续对折三次，实际上是将线段均分成了多少份？`, options: ["3份", "4份", "8份", "6份"], correct: 2, analysis: "每一次对折，份数都按2的指数级增长。连续对折三次即为 2³ = 8 份。这体现了指数增长的数学规律。" },
        { id: 3, question: `在进行《${c}》的自测练习时，如果发现错误，最科学的学习态度是：`, options: ["认为自己缺乏数学天赋", "将其视为诊断知识盲点的依据，深入分析错误原因并查漏补缺", "直接放弃该题", "忽略错误，只看正确率"], correct: 1, analysis: "错误是认知过程中的重要反馈。通过错题分析来修正认知模型，是提升数学能力的必经之路。" }
      ]
    };
  }

  // Helper for evaluation fallbacks
  function getFallbackEvaluation(sub: string, gd: string, ch: string, score: number) {
    const s = sub || "数学";
    const g = gd || "三年级";
    const c = ch || "认识分数";
    const percent = Math.min(65 + score * 10, 95);
    
    if (s === "语文") {
      const isLiBai = c.includes("天门山") || c.includes("李白") || c.includes("古诗") || c.includes("碧水");
      if (isLiBai) {
        return {
          summary: `表现优异！在本次《${c}》的预习自测中，你准确掌握了古诗的意境与字词释义。你对文学背景及诗人浪漫主义笔触的理解超越了 ${percent}% 的同级学生。建议在明日课堂上积极分享你对古诗画面的见解，深化文学素养。`,
          classLink: {
            question: `“大家在这首古诗《${c}》中，最能体会到作者什么样的思想感情和视觉意象呢？”`,
            answer: `“老师，这首诗展现了李白浪漫主义的风格。‘碧水东流至此回’等句运用化静为动的手法，在脑海中构建了长江突破天门山向东流去的壮丽画面，体现了诗人豁达的胸襟。”`
          },
          forecastLeap: `恭喜！通过建立诗歌的意象感知与节奏朗读模型，你已为明日的语文鉴赏课打下了坚实的基础，课堂吸收效率将显著提升。`,
          scoreValue: percent
        };
      }
      return {
        summary: `预习表现出色！在《${c}》的自测中，你对文本核心要义和字词结构的理解超越了 ${percent}% 的同级学生。请保持这种严谨的阅读习惯，明日课堂上可结合时代背景进一步探讨文章深意。`,
        classLink: {
          question: `“大家在预习完《${c}》后，最能体会到作者怎样的核心思想与写作手法呢？”`,
          answer: `“老师，在预习《${c}》时，我梳理了文章的段落结构，并结合创作背景理解了核心意象。这有助于我们更深层次地领会作者的写作意图与情感表达。”`
        },
        forecastLeap: `恭喜！得益于你对文本逻辑的梳理和核心主旨的把握，你的阅读理解能力已得到锻炼，明日听课将更加有的放矢。`,
        scoreValue: percent
      };
    } else if (s === "英语") {
      return {
        summary: `非常扎实的预习成果！针对《${c}》的词汇拼读与交际句型练习，你的准确率表现优异，超越了 ${percent}% 的同龄学生。请继续运用自然拼读法巩固词汇，并在明日课堂中积极参与口语交际训练。`,
        classLink: {
          question: `“Who can use the new key sentence structures in this chapter to simulate a daily life scenario?”`,
          answer: `“Teacher, if we are at a restaurant, we can politely say: 'What would you like to order? I would like some noodles, please.' This sentence structure is very practical for daily communication.”`
        },
        forecastLeap: `优秀！掌握自然拼读规律并熟悉核心交际句型，将大幅提升你在《${c}》英语课堂上的口语表达自信与准确度。`,
        scoreValue: percent
      };
    }

    // Default Math fallback
    return {
      summary: `逻辑思维严密！在《${c}》的自测中，你对数学概念与数形结合的掌握非常透彻。你对概念属性的理解超过了 ${percent}% 的同级学生。明日数学课上，建议多关注公式的推导过程及其实际应用。`,
      classLink: {
        question: `“学习完本节课，大家能举出《${c}》相关数学原理在日常生活中的实际应用吗？”`,
        answer: `“老师，比如在分配资源时，我们可以运用等值分数的原理。将整体分成 8 份取 2 份，与分成 4 份取 1 份在数值上是绝对相等的。这体现了数学在实际问题中的严谨性。”`
      },
      forecastLeap: `出色！通过构建清晰的数学模型和深刻理解核心概念，你在《${c}》的逻辑推演能力已得到有效提升，课堂学习将更加高效。`,
      scoreValue: percent
    };
  }

  // API endpoint
  app.post("/api/generate-preview", async (req, res) => {
    const { subject, grade, chapter, profileAnswers } = req.body;
    console.log(`[Generate Preview Request] Subject: ${subject}, Grade: ${grade}, Chapter: ${chapter}`);
    
    try {
      // Construct a prompt for Qwen to generate custom questions
      const prompt = `你是一个非常专业且懂小学生的${subject || '数学'}老师。你需要为一名正在进行课前15分钟预习的${grade || '三年级'}学生生成一份生动、有趣的关于《${chapter || '认识分数'}》知识点的课前预习任务卡与 4 个思考题。
当前学生情况：
- 科目：${subject || '数学'}
- 年级：${grade || '三年级'}
- 预习知识点：《${chapter || '认识分数'}》
- 遇到难点设想：${profileAnswers?.difficulty || '对核心概念的推导过程和严谨定义理解不够深入'}
- 学习风格：${profileAnswers?.style || '需要逻辑清晰、数形结合或语境丰富的专业解释'}

要求：输出严格的 JSON 格式，结构必须如下（不要有多余的 markdown 符号，不要包裹在 \`\`\`json 中）：
{
  "generalOutline": "用一两句活泼、适合小学生的话概括该知识点的核心目标。",
  "keyConcepts": [
    { "label": "核心知识词 1", "detail": "用最通俗易懂的大白话解释这个词" },
    { "label": "核心知识词 2", "detail": "通俗解释" },
    { "label": "核心知识词 3", "detail": "通俗解释" }
  ],
  "questions": [
    "第一个启发小学生思考的基础问题",
    "第二个联系生活或图形的问题",
    "第三个有趣的脑筋急转弯问题",
    "第四个联系实际生活的问题（保证是第4个问题，总共正好4个问题）"
  ],
  "scenario": "设计一个与该知识点相关的趣味小故事或生活场景（150字以内）。",
  "presetChatQuestions": [
    { "q": "学生可能会问的常见疑问 1", "a": "用大朋友的口吻耐心解答" },
    { "q": "常见疑问 2", "a": "解答" },
    { "q": "常见疑问 3", "a": "解答" }
  ],
  "quizItems": [
    {
      "id": 1,
      "question": "第 1 道选择题（考察基础概念），必须为四选一单选题",
      "options": ["选项 A", "选项 B", "选项 C", "选项 D"],
      "correct": 0,
      "analysis": "简单的错题分析和知识点回顾"
    },
    { "id": 2, "question": "第 2 道选择题（考察应用或辨析）", "options": ["选项A", "选项B", "选项C", "选项D"], "correct": 1, "analysis": "简单的错题分析" },
    { "id": 3, "question": "第 3 道选择题（考察综合或拓展）", "options": ["选项A", "选项B", "选项C", "选项D"], "correct": 2, "analysis": "简单的错题分析" }
  ]
}

重要：
1. 请只输出合法、可直接 JSON.parse 的 JSON 字符串。
2. 不要包含任何 markdown 的 \`\`\`json 标记，只需输出 JSON 本身。
3. 问题必须为 4 个（不多也不少）。
4. 确保语言风格生动、有趣，符合小学生（1-5年级）的阅读习惯，避免过于成人化或生涩难懂的学术词汇。`;

      console.log(`[Qwen Request] Sending prompt for ${subject} - ${chapter}`);
      if (!DASHSCOPE_API_KEY) {
        throw new Error("DASHSCOPE_API_KEY is not set");
      }

      const response = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${DASHSCOPE_API_KEY}`
        },
        body: JSON.stringify({
          model: "qwen-plus",
          messages: [
            { role: "system", content: "你是一个专门输出JSON的专业教研专家AI。" },
            { role: "user", content: prompt }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to call Qwen API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = (data.choices?.[0]?.message?.content || "").trim();
      console.log(`[Qwen Response] Raw content retrieved successfully (${content.length} chars)`);
      
      // Clean string if Qwen added markdown fences anyway, or match JSON block
      let cleanContent = content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanContent = jsonMatch[0];
      } else {
        if (cleanContent.startsWith("```json")) {
          cleanContent = cleanContent.substring(7);
        } else if (cleanContent.startsWith("```")) {
          cleanContent = cleanContent.substring(3);
        }
        if (cleanContent.endsWith("```")) {
          cleanContent = cleanContent.substring(0, cleanContent.length - 3);
        }
      }
      cleanContent = cleanContent.trim();

      const parsed = JSON.parse(cleanContent);
      console.log("[Qwen Response] Parsed response JSON successfully!");
      res.json(parsed);

    } catch (err: any) {
      console.error("[Qwen API Error or Parsing Failed]", err.message);
      // Fallback response with beautiful dynamic questions
      console.log(`[Fallback Triggered] Generating subject-specific fallback for ${subject}`);
      const fallback = getFallbackContent(subject, grade, chapter);
      res.status(200).json(fallback);
    }
  });

  // API endpoint for evaluations & class alignments
  app.post("/api/generate-evaluation", async (req, res) => {
    const { subject, grade, chapter, score } = req.body;
    console.log(`[Generate Evaluation Request] Subject: ${subject}, Grade: ${grade}, Chapter: ${chapter}, Score: ${score}`);
    
    try {
      const prompt = `你是一个资深的${subject || '数学'}老师。现在一名${grade || '三年级'}学生完成了关于《${chapter || '认识分数'}》知识点的课前预习小测试。
根据他的正确答题数量（${score ?? 3} / 3），请给出针对这名小学生的表扬、评估和明天课堂上的表现建议。
要求输出必须是严格的JSON格式（不要包裹在\`\`\`json中，直接输出对象），结构如下：
{
  "summary": "一句活泼的鼓励，总结他对该知识点的掌握水平。",
  "classLink": {
    "question": "预测老师明天在课堂上可能会问的一个关于该知识点的问题",
    "answer": "教学生如何巧妙、漂亮地回答这个问题"
  },
  "forecastLeap": "一句话预估他明天上课的秒懂率会飙升到多少（带点夸张和鼓励，比如：哇！秒懂率直接飙升到95%！）",
  "scoreValue": 一个75到98之间的整数（根据答对的题数${score ?? 3}来定）
}

参考信息：
- 科目：${subject || '数学'}
- 年级：${grade || '三年级'}
- 预习知识点：《${chapter || '认识分数'}》
- 测验得分（共3题）：答对了 ${score ?? 3} 题（满分3题）
`;

      console.log(`[Qwen Evaluation Request] Sending prompt for ${subject} - ${chapter}`);
      if (!DASHSCOPE_API_KEY) {
        throw new Error("DASHSCOPE_API_KEY is not set");
      }

      const response = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${DASHSCOPE_API_KEY}`
        },
        body: JSON.stringify({
          model: "qwen-plus",
          messages: [
            { role: "system", content: "你是一个专门输出JSON的专业教研评估AI。" },
            { role: "user", content: prompt }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to call Qwen API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = (data.choices?.[0]?.message?.content || "").trim();
      console.log(`[Qwen Evaluation Response] Raw content retrieved successfully (${content.length} chars)`);
      
      let cleanContent = content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanContent = jsonMatch[0];
      } else {
        if (cleanContent.startsWith("```json")) {
          cleanContent = cleanContent.substring(7);
        } else if (cleanContent.startsWith("```")) {
          cleanContent = cleanContent.substring(3);
        }
        if (cleanContent.endsWith("```")) {
          cleanContent = cleanContent.substring(0, cleanContent.length - 3);
        }
      }
      cleanContent = cleanContent.trim();

      const parsed = JSON.parse(cleanContent);
      console.log("[Qwen Evaluation Response] Parsed response JSON successfully!");
      res.json(parsed);

    } catch (err: any) {
      console.error("[Qwen Evaluation API Error or Parsing Failed]", err.message);
      const fallback = getFallbackEvaluation(subject, grade, chapter, score ?? 3);
      res.status(200).json(fallback);
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default startServer;