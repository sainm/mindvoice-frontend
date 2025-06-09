/**
 * 问题类型枚举
 */
export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',   // 单选题
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE', // 多选题
  LIKERT_SCALE = 'LIKERT_SCALE',     // 李克特量表题
  TEXT = 'TEXT',                     // 文本题
  SLIDER = 'SLIDER'                  // 滑块题
}

/**
 * 选项接口
 */
export interface Option {
  id: number;
  text: string;
  value: number;
}

/**
 * 问题接口
 */
export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  required: boolean;
  options?: Option[];
  minValue?: number;
  maxValue?: number;
  step?: number;
}

/**
 * 评测量表接口
 */
export interface Assessment {
  id: number;
  title: string;
  description: string;
  instructions: string;
  timeLimit?: number; // 分钟
  questions: Question[];
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

/**
 * 用户回答接口
 */
export interface Answer {
  questionId: number;
  value: string | number | number[]; // 根据问题类型不同，答案格式不同
}

/**
 * 评测会话接口
 */
export interface AssessmentSession {
  id: number;
  assessmentId: number;
  userId: number;
  startTime: string;
  endTime?: string;
  status: 'in_progress' | 'completed' | 'expired';
  answers: Answer[];
  progress: number; // 0-100
}

/**
 * 评测结果接口
 */
export interface AssessmentResult {
  sessionId: number;
  assessmentId: number;
  userId: number;
  completionTime: string;
  scores: {
    category: string;
    score: number;
    interpretation: string;
    level: 'low' | 'medium' | 'high' | 'severe';
  }[];
  summary: string;
  recommendations: string[];
} 