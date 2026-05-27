import { VercelRequest, VercelResponse } from '@vercel/node';

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  const { subject, grade, chapter, profileAnswers } = req.body;
  
  try {
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
    return res.status(200).json(parsed);

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
