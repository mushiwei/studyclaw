import { VercelRequest, VercelResponse } from '@vercel/node';

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  const { subject, grade, chapter, score } = req.body;
  
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
