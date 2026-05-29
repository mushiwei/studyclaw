import { VercelRequest, VercelResponse } from '@vercel/node';
import { searchPreviewVideos } from '../video-search';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const query = String(req.body?.query ?? req.body?.chapter ?? '').trim();
  if (!query) {
    return res.status(400).json({ error: 'query is required' });
  }

  try {
    const result = await searchPreviewVideos({
      query,
      subject: req.body?.subject,
      grade: req.body?.grade,
      chapter: req.body?.chapter,
      questions: req.body?.questions
    });
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message, hits: [], candidate_queries: [] });
  }
}
