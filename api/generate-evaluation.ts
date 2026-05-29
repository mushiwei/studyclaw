import { VercelRequest, VercelResponse } from '@vercel/node';

const getDashscopeApiKey = () => {
  return globalThis.Netlify?.env.get('DASHSCOPE_API_KEY') ?? process.env.DASHSCOPE_API_KEY;
};

type EvaluationPayload = {
  summary?: string;
  classLink?: {
    question?: string;
    answer?: string;
  };
  forecastLeap?: string;
  scoreValue?: number;
};

const sanitizeEvaluationText = (value: unknown, fallback: string) => {
  if (typeof value !== 'string') return fallback;
  return value
    .replace(/哇|呀|啦|飙升|秒懂率|小天才|惊艳|夸你|漂亮地/g, '')
    .replace(/加油鸭|大朋友/g, '同学')
    .trim() || fallback;
};

const normalizeScoreValue = (value: unknown, score: number) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(75, Math.min(98, Math.round(value)));
  }
  return Math.max(75, Math.min(98, 75 + score * 7));
};

const normalizeEvaluationPayload = (input: EvaluationPayload, subject: string, grade: string, chapter: string, score: number) => {
  const scoreValue = normalizeScoreValue(input.scoreValue, score);
  return {
    summary: sanitizeEvaluationText(
      input.summary,
      `${grade}${subject}《${chapter}》预习完成度为 ${score}/3，已经形成初步理解，建议继续关注易错点。`
    ),
    classLink: {
      question: sanitizeEvaluationText(
        input.classLink?.question,
        `老师可能会请你说明《${chapter}》中的一个核心概念或例题步骤。`
      ),
      answer: sanitizeEvaluationText(
        input.classLink?.answer,
        '回答时先说定义，再说明使用条件，最后结合一个简单例子。'
      )
    },
    forecastLeap: sanitizeEvaluationText(
      input.forecastLeap,
      `根据本次预习结果，明天课堂理解度预计可达到 ${scoreValue}%。建议重点听概念来源和易错步骤。`
    ),
    scoreValue
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  const { subject, grade, chapter, score } = req.body;
  
  try {
    const prompt = `你是一个资深、严谨的${subject || '数学'}老师。现在一名${grade || '三年级'}学生完成了关于《${chapter || '认识分数'}》知识点的课前预习小测试。
根据他的正确答题数量（${score ?? 3} / 3），请给出针对这名小学生的表扬、评估和明天课堂上的表现建议。
要求输出必须是严格的JSON格式（不要包裹在\`\`\`json中，直接输出对象），结构如下：
{
  "summary": "一句专业、适龄的评价，总结他对该知识点的掌握水平。",
  "classLink": {
    "question": "预测老师明天在课堂上可能会问的一个关于该知识点的问题",
    "answer": "教学生如何清楚、准确地回答这个问题"
  },
  "forecastLeap": "一句专业表达，预估他明天课堂理解度可达到多少，并指出还需要重点听什么",
  "scoreValue": 一个75到98之间的整数（根据答对的题数${score ?? 3}来定）
}

内容规范：
1. 不要使用“哇、飙升、秒懂率、小天才、惊艳、夸你”等夸张营销式表达。
2. 建议必须围绕《${chapter || '认识分数'}》知识点本身，不能泛泛鼓励。
3. 回答建议要包含“定义、条件、步骤、例子、易错点”中的至少两个方面。
4. 输出必须适合教师给学生或家长展示，表达清楚、可信、专业。

参考信息：
- 科目：${subject || '数学'}
- 年级：${grade || '三年级'}
- 预习知识点：《${chapter || '认识分数'}》
- 测验得分（共3题）：答对了 ${score ?? 3} 题（满分3题）
`;

    const dashscopeApiKey = getDashscopeApiKey();
    if (!dashscopeApiKey) {
      throw new Error("DASHSCOPE_API_KEY is not set");
    }

    const response = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${dashscopeApiKey}`
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
    const normalized = normalizeEvaluationPayload(
      parsed,
      subject || '数学',
      grade || '三年级',
      chapter || '认识分数',
      score ?? 3
    );
    return res.status(200).json(normalized);

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
