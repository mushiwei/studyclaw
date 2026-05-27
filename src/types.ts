/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TabType = 'home' | 'homework' | 'classroom' | 'preview';

// ==================== Shared / Toast types ====================
export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// ==================== Homework Agent Types ====================
export interface HwCorrectionStep {
  step: number;
  student: string;
  standard: string;
  score: number;
  max: number;
  comment: string;
  error_type: 'none' | 'calculation' | 'concept' | 'method';
}

export interface HwDiagnosisWeakChain {
  gap: string;
  root_cause: string;
  grade: string;
}

export interface HwGapItem {
  knowledge_point: string;
  severity: '高' | '中' | '轻';
  frequency: number;
  root_chain: string;
}

export interface HwVariationQuestion {
  id: number;
  difficulty: '基础' | '中等' | '拔高' | '挑战';
  question: string;
  reference_answer: string;
  analysis: string;
}

// ==================== Teacher Agent Types ====================
export type NotesSourceType = 'board' | 'voice' | 'text';

export interface ClKnowledgePoint {
  point: string;
  mastery: number;
  evidence: string;
  suggestion: string;
}

export interface ClWeakPoint {
  rank: number;
  content: string;
  student_count: number;
  severity: 'high' | 'mid' | 'low';
}

export interface ClReviewItem {
  id: number;
  content: string;
  priority: '高' | '中' | '低';
}

export interface ClKnowledgePointHistory {
  point: string;
  w3: number | null;
  w6: number | null;
  w9: number | null;
  w12: number | null;
  trend: 'up' | 'down' | 'stable';
}

// ==================== Preview Agent Types ====================
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export interface PvQuizItem {
  id: number;
  question: string;
  options: string[];
  correct: number;
  analysis: string;
}
