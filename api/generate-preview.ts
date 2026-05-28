import { VercelRequest, VercelResponse } from '@vercel/node';

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;

type PreviewPayload = {
  generalOutline?: string;
  keyConcepts?: Array<{ label?: string; detail?: string }>;
  questions?: string[];
  scenario?: string;
  presetChatQuestions?: Array<{ q?: string; a?: string }>;
  quizItems?: Array<{
    id?: number;
    question?: string;
    options?: string[];
    correct?: number;
    analysis?: string;
  }>;
};

const blockedTextRules: Array<[RegExp, string]> = [
  [/加油鸭/g, '继续加油'],
  [/大朋友/g, '同学'],
  [/小天才/g, '学习状态更稳定的学生'],
  [/魔法/g, '关键方法'],
  [/脑筋急转弯/g, '辨析问题'],
  [/火箭般飞跃|飙升|秒懂/g, '稳步提升'],
  [/绝妙|惊艳|狂欢/g, '有价值'],
  [/去玩游戏|哭|生气|装作看不见|毫无用处/g, '暂时跳过且不做记录'],
  [/野鸭/g, '无关事物'],
  [/披萨/g, '圆形纸片']
];

const sanitizeText = (value: unknown, fallback = '') => {
  let text = typeof value === 'string' ? value.trim() : fallback;
  blockedTextRules.forEach(([rule, replacement]) => {
    text = text.replace(rule, replacement);
  });
  return text;
};

const normalizePreviewPayload = (input: PreviewPayload, subject: string, grade: string, chapter: string) => {
  const fallbackQuestion = `关于《${chapter}》，请说明一个你已经理解的概念和一个还需要上课确认的问题。`;
  const concepts = Array.isArray(input.keyConcepts) ? input.keyConcepts.slice(0, 3) : [];
  const questions = Array.isArray(input.questions) ? input.questions.slice(0, 4) : [];
  const chats = Array.isArray(input.presetChatQuestions) ? input.presetChatQuestions.slice(0, 3) : [];
  const quizItems = Array.isArray(input.quizItems) ? input.quizItems.slice(0, 3) : [];

  return {
    generalOutline: sanitizeText(
      input.generalOutline,
      `围绕${grade}${subject}《${chapter}》建立基本概念、关键方法和预习疑问。`
    ),
    keyConcepts: concepts.length === 3 ? concepts.map((item, index) => ({
      label: sanitizeText(item.label, `核心概念 ${index + 1}`),
      detail: sanitizeText(item.detail, `请结合《${chapter}》说明这个概念的含义和使用条件。`)
    })) : [
      { label: '核心概念', detail: `先弄清《${chapter}》中最重要的定义、符号或规则。` },
      { label: '使用条件', detail: '关注这个方法在什么情况下可以使用，哪些地方容易混淆。' },
      { label: '例题验证', detail: '用一道简单例题检查自己是否真正理解。' }
    ],
    questions: [...questions, fallbackQuestion, fallbackQuestion, fallbackQuestion, fallbackQuestion]
      .slice(0, 4)
      .map(q => sanitizeText(q, fallbackQuestion)),
    scenario: sanitizeText(
      input.scenario,
      `请用一个与《${chapter}》直接相关的课堂或生活例子，说明这个知识点可以解决什么问题。`
    ),
    presetChatQuestions: chats.length === 3 ? chats.map((item, index) => ({
      q: sanitizeText(item.q, `《${chapter}》中第 ${index + 1} 个容易混淆的问题是什么？`),
      a: sanitizeText(item.a, '先看定义，再结合一个简单例子判断，最后说清使用条件。')
    })) : [
      { q: `《${chapter}》最核心的概念是什么？`, a: '先找教材中的定义，再用自己的话复述，并配一个简单例子。' },
      { q: `预习《${chapter}》时最容易错在哪里？`, a: '通常容易错在条件、单位、符号或步骤顺序，需要边读边标注。' },
      { q: `明天上课我应该重点听什么？`, a: '重点听老师如何解释概念来源、例题步骤和易错点。' }
    ],
    quizItems: quizItems.length === 3 ? quizItems.map((item, index) => {
      const options = Array.isArray(item.options) ? item.options.slice(0, 4).map(opt => sanitizeText(opt, '待判断选项')) : [];
      return {
        id: index + 1,
        question: sanitizeText(item.question, `关于《${chapter}》的第 ${index + 1} 道基础辨析题。`),
        options: [...options, '概念表述正确', '概念表述不完整', '条件使用错误', '与题目无关'].slice(0, 4),
        correct: Number.isInteger(item.correct) && item.correct! >= 0 && item.correct! <= 3 ? item.correct : 0,
        analysis: sanitizeText(item.analysis, '根据定义、条件和例题步骤进行判断。')
      };
    }) : [
      {
        id: 1,
        question: `预习《${chapter}》时，最应该先确认什么？`,
        options: ['核心定义和使用条件', '只记住题目答案', '只看标题', '跳过例题'],
        correct: 0,
        analysis: '课前预习要先抓住定义、条件和例题结构。'
      },
      {
        id: 2,
        question: `遇到《${chapter}》中不理解的步骤，比较合理的做法是？`,
        options: ['标记疑问并带到课堂', '直接忽略', '只抄答案', '更换无关题目'],
        correct: 0,
        analysis: '预习的价值在于发现问题，课堂上再重点解决。'
      },
      {
        id: 3,
        question: `判断自己是否理解《${chapter}》，最有效的方式是？`,
        options: ['用自己的话解释并做一道例题', '只背一个词', '看完就算完成', '只看图片'],
        correct: 0,
        analysis: '能解释、能举例、能完成基础题，才说明理解比较稳定。'
      }
    ]
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  const { subject, grade, chapter, profileAnswers } = req.body;
  
  try {
    const prompt = `你是一个专业、严谨、懂小学生认知特点的${subject || '数学'}老师。你需要为一名正在进行课前15分钟预习的${grade || '三年级'}学生，生成一份围绕《${chapter || '认识分数'}》知识点本身的课前预习任务卡。
当前学生情况：
- 科目：${subject || '数学'}
- 年级：${grade || '三年级'}
- 预习知识点：《${chapter || '认识分数'}》
- 遇到难点设想：${profileAnswers?.difficulty || '对核心概念的推导过程和严谨定义理解不够深入'}
- 学习风格：${profileAnswers?.style || '需要逻辑清晰、数形结合或语境丰富的专业解释'}

内容规范：
1. 所有内容必须紧扣《${chapter || '认识分数'}》本身，不能编造无关故事、无关角色或离题场景。
2. 语言适合小学生，但要保持教师专业表达；不要使用“加油鸭、大朋友、小天才、魔法、脑筋急转弯、火箭飞跃、惊艳、狂欢”等夸张或玩闹表达。
3. 选择题必须是有效的学科题：题干清楚、四个选项均为可判断的学习选项，不能出现“去玩游戏、哭、装作看不见、毫无用处”等不专业干扰项。
4. 答案解析必须说明依据：定义、条件、步骤、易错点或例题方法，不能只写鼓励语。
5. 场景只用于帮助理解知识点，应真实、简洁、可教学，不要使用夸张剧情。

要求：输出严格的 JSON 格式，结构必须如下（不要有多余的 markdown 符号，不要包裹在 \`\`\`json 中）：
{
  "generalOutline": "用一两句清晰、适合小学生的话概括该知识点的核心目标。",
  "keyConcepts": [
    { "label": "核心知识词 1", "detail": "解释含义、使用条件或易错点" },
    { "label": "核心知识词 2", "detail": "解释含义、使用条件或易错点" },
    { "label": "核心知识词 3", "detail": "解释含义、使用条件或易错点" }
  ],
  "questions": [
    "第一个围绕核心定义的基础问题",
    "第二个围绕使用条件或图形/文本证据的问题",
    "第三个围绕易错点辨析的问题",
    "第四个联系课堂例题或生活应用的问题（保证总共正好4个问题）"
  ],
  "scenario": "设计一个与该知识点直接相关的课堂或生活场景（150字以内）。",
  "presetChatQuestions": [
    { "q": "学生可能会问的常见疑问 1", "a": "用教师口吻清晰解答，包含依据或例子" },
    { "q": "常见疑问 2", "a": "清晰解答，包含依据或例子" },
    { "q": "常见疑问 3", "a": "清晰解答，包含依据或例子" }
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
4. 保持清楚、专业、适龄，优先关注题目本身、概念本身和课堂衔接。`;

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
    const normalized = normalizePreviewPayload(
      parsed,
      subject || '数学',
      grade || '三年级',
      chapter || '认识分数'
    );
    return res.status(200).json(normalized);

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
