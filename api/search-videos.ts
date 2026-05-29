import { VercelRequest, VercelResponse } from '@vercel/node';

type ManticoreHit = {
  _id?: number | string;
  _score?: number;
  _source?: {
    id?: number | string;
    name?: string;
    allname?: string;
    ccid?: string;
    [key: string]: unknown;
  };
};

const MANTICORE_SEARCH_HOST =
  globalThis.Netlify?.env.get('MANTICORE_SEARCH_HOST') ??
  process.env.MANTICORE_SEARCH_HOST ??
  'http://search.aixuetang.com.cn';

const buildSearchRequest = (query: string) => ({
  table: 'axtvideo',
  query: {
    match: {
      'name,allname': query
    }
  },
  _source: ['id', 'name', 'allname', 'ccid']
});

const dedupeAndSortVideoHits = (hits: ManticoreHit[]) => {
  const seen = new Set<string>();

  return hits
    .filter((hit) => Boolean(hit?._source?.ccid))
    .sort((a, b) => (b._score ?? 0) - (a._score ?? 0))
    .filter((hit) => {
      const ccid = String(hit._source?.ccid ?? '');
      if (!ccid || seen.has(ccid)) return false;
      seen.add(ccid);
      return true;
    });
};

async function searchVideos(query: string) {
  const response = await fetch(`${MANTICORE_SEARCH_HOST.replace(/\/$/, '')}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(buildSearchRequest(query))
  });

  if (!response.ok) {
    throw new Error(`Manticore search failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const hits = data?.hits?.hits;
  return dedupeAndSortVideoHits(Array.isArray(hits) ? hits : []);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const query = String(req.body?.query ?? '').trim();
  if (!query) {
    return res.status(400).json({ error: 'query is required' });
  }

  try {
    const hits = await searchVideos(query);
    return res.status(200).json({ hits });
  } catch (err: any) {
    return res.status(500).json({ error: err.message, hits: [] });
  }
}
