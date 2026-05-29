export type ManticoreHit = {
  _id?: number | string;
  _score?: number;
  _source?: {
    id?: number | string;
    name?: string;
    allname?: string;
    ccid?: string;
    [key: string]: unknown;
  };
  _rank_score?: number;
  _source_query?: string;
};

export type VideoSearchPayload = {
  query?: string;
  subject?: string;
  grade?: string;
  chapter?: string;
  questions?: string[];
};

const SUBJECTS = ['\u6570\u5b66', '\u8bed\u6587', '\u82f1\u8bed'];
const SUBJECT_WEIGHT: Record<string, string[]> = {
  '\u6570\u5b66': ['\u5206\u6570', '\u5c0f\u6570', '\u8ba1\u7b97', '\u56fe\u5f62', '\u5355\u4f4d', '\u9762\u79ef', '\u5468\u957f'],
  '\u8bed\u6587': ['\u8bfe\u6587', '\u53e4\u8bd7', '\u8bd7', '\u8bcd\u8bed', '\u9605\u8bfb', '\u4f5c\u8005'],
  '\u82f1\u8bed': ['word', 'words', 'sentence', 'unit', 'grammar', '\u5355\u8bcd', '\u53e5\u578b']
};

const normalizeText = (value: unknown) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[\s\-_\/()[\]{}"'.,!?;:，。！？；：《》“”‘’、（）【】]/g, '');

const getManticoreHost = () =>
  ((globalThis as any).Netlify?.env.get('MANTICORE_SEARCH_HOST') ??
    process.env.MANTICORE_SEARCH_HOST ??
    'http://search.aixuetang.com.cn').replace(/\/$/, '');

const uniq = (items: string[]) => {
  const seen = new Set<string>();
  return items
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => {
      const key = normalizeText(item);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const buildGradeAliases = (grade: string) => {
  const aliases = [grade];
  const compact = grade.replace(/[\s\u4e0a\u4e0b\u518c]/g, '');

  if (compact && compact !== grade) aliases.push(compact);
  if (compact.endsWith('\u5e74\u7ea7')) {
    aliases.push(`${compact}\u4e0a`, `${compact}\u4e0b`, `${compact}\u4e0a\u518c`, `${compact}\u4e0b\u518c`);
  }

  return uniq(aliases);
};

const buildChapterTerms = (chapter: string) => {
  const cleaned = chapter.replace(/[《》“”‘']/g, '').trim();
  const parts = cleaned
    .split(/[\s\-_\/()[\]{}"'.,!?;:，。！？；：《》“”‘’、（）【】]+/g)
    .map((part) => part.trim())
    .filter((part) => part.length >= 2);

  return uniq([cleaned, ...parts]);
};

const extractQuestionTerms = (questions: string[]) =>
  uniq(
    questions.flatMap((question) =>
      String(question)
        .split(/[\s\-_\/()[\]{}"'.,!?;:，。！？；：《》“”‘’、（）【】]+/g)
        .map((part) => part.trim())
        .filter((part) => part.length >= 3 && part.length <= 12)
    )
  ).slice(0, 6);

const buildCandidateQueries = (payload: VideoSearchPayload) => {
  const query = String(payload.query ?? '').trim();
  const subject = String(payload.subject ?? '').trim();
  const grade = String(payload.grade ?? '').trim();
  const chapter = String(payload.chapter ?? query).trim();
  const questions = Array.isArray(payload.questions) ? payload.questions : [];

  return uniq([
    chapter,
    query,
    subject && chapter ? `${subject} ${chapter}` : '',
    grade && chapter ? `${grade} ${chapter}` : '',
    subject && grade && chapter ? `${subject} ${grade} ${chapter}` : '',
    ...buildChapterTerms(chapter),
    ...extractQuestionTerms(questions)
  ]).slice(0, 10);
};

const buildSearchRequest = (query: string) => ({
  table: 'axtvideo',
  query: {
    match: {
      'name,allname': query
    }
  },
  _source: ['id', 'name', 'allname', 'ccid']
});

const countMatches = (normalizedText: string, terms: string[]) =>
  terms.reduce((total, term) => total + (term && normalizedText.includes(term) ? 1 : 0), 0);

const scoreHit = (hit: ManticoreHit, payload: VideoSearchPayload) => {
  const source = hit._source ?? {};
  const name = String(source.name ?? '');
  const allname = String(source.allname ?? '');
  const normalized = normalizeText(`${name} ${allname}`);
  const subject = String(payload.subject ?? '').trim();
  const grade = String(payload.grade ?? '').trim();
  const chapter = String(payload.chapter ?? payload.query ?? '').trim();
  const chapterTerms = buildChapterTerms(chapter).map(normalizeText).filter(Boolean);
  const gradeAliases = buildGradeAliases(grade).map(normalizeText).filter(Boolean);
  const subjectTerms = (SUBJECT_WEIGHT[subject] ?? []).map(normalizeText);
  let score = Number(hit._score ?? 0);

  if (chapter && normalized.includes(normalizeText(chapter))) score += 20000;
  score += countMatches(normalized, chapterTerms) * 8000;
  if (subject && normalized.includes(normalizeText(subject))) score += 5000;
  score += countMatches(normalized, subjectTerms) * 1200;
  score += countMatches(normalized, gradeAliases) * 3500;
  if (name && normalizeText(name) === normalizeText(chapter)) score += 6000;

  const mismatchedSubject = SUBJECTS.find(
    (candidate) => candidate !== subject && normalized.includes(normalizeText(candidate))
  );
  if (subject && mismatchedSubject) score -= 12000;

  if (chapterTerms.length > 0 && countMatches(normalized, chapterTerms) === 0) {
    score -= 8000;
  }

  return score;
};

const dedupeRankAndSortVideoHits = (hits: ManticoreHit[], payload: VideoSearchPayload) => {
  const bestByCcid = new Map<string, ManticoreHit>();

  hits.forEach((hit) => {
    const ccid = String(hit._source?.ccid ?? '');
    if (!ccid) return;

    const rankedHit = {
      ...hit,
      _rank_score: scoreHit(hit, payload)
    };
    const current = bestByCcid.get(ccid);
    if (!current || (rankedHit._rank_score ?? 0) > (current._rank_score ?? 0)) {
      bestByCcid.set(ccid, rankedHit);
    }
  });

  return Array.from(bestByCcid.values())
    .sort((a, b) => (b._rank_score ?? 0) - (a._rank_score ?? 0))
    .slice(0, 12);
};

async function searchManticore(query: string, host: string) {
  const response = await fetch(`${host}/search`, {
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
  const hits = Array.isArray(data?.hits?.hits) ? data.hits.hits : [];
  return hits.map((hit: ManticoreHit) => ({ ...hit, _source_query: query }));
}

export async function searchPreviewVideos(payload: VideoSearchPayload) {
  const candidateQueries = buildCandidateQueries(payload);
  if (candidateQueries.length === 0) {
    return { hits: [], candidate_queries: [] };
  }

  const host = getManticoreHost();
  const nestedHits = await Promise.all(candidateQueries.map((query) => searchManticore(query, host)));
  const hits = dedupeRankAndSortVideoHits(nestedHits.flat(), payload);
  return { hits, candidate_queries: candidateQueries };
}
