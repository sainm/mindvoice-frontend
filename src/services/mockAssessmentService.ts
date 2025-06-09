import { Assessment, Question, QuestionType, AssessmentSession, Answer, AssessmentResult } from '../types/assessment.types';

// 模拟SCL-90评测量表
const mockScl90Assessment: Assessment = {
  id: 1,
  title: 'SCL-90 症状自评量表',
  description: 'SCL-90是一种自评量表，用于评估个体的心理健康状况和精神症状。',
  instructions: '请仔细阅读每个问题，根据您最近一周（包括今天）的实际感受，选择最符合您情况的选项。',
  timeLimit: 20,
  category: '临床评估',
  tags: ['症状自评', '心理健康', '精神症状'],
  createdAt: '2025-01-01T00:00:00',
  questions: [
    {
      id: 1,
      text: '头痛',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '没有', value: 1 },
        { id: 2, text: '很轻', value: 2 },
        { id: 3, text: '中等', value: 3 },
        { id: 4, text: '偏重', value: 4 },
        { id: 5, text: '严重', value: 5 }
      ]
    },
    {
      id: 2,
      text: '神经过敏，心中不踏实',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '没有', value: 1 },
        { id: 2, text: '很轻', value: 2 },
        { id: 3, text: '中等', value: 3 },
        { id: 4, text: '偏重', value: 4 },
        { id: 5, text: '严重', value: 5 }
      ]
    },
    {
      id: 3,
      text: '头脑中有不必要的想法或词句盘旋',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '没有', value: 1 },
        { id: 2, text: '很轻', value: 2 },
        { id: 3, text: '中等', value: 3 },
        { id: 4, text: '偏重', value: 4 },
        { id: 5, text: '严重', value: 5 }
      ]
    },
    {
      id: 4,
      text: '头晕或昏倒',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '没有', value: 1 },
        { id: 2, text: '很轻', value: 2 },
        { id: 3, text: '中等', value: 3 },
        { id: 4, text: '偏重', value: 4 },
        { id: 5, text: '严重', value: 5 }
      ]
    },
    {
      id: 5,
      text: '对异性的兴趣减退',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '没有', value: 1 },
        { id: 2, text: '很轻', value: 2 },
        { id: 3, text: '中等', value: 3 },
        { id: 4, text: '偏重', value: 4 },
        { id: 5, text: '严重', value: 5 }
      ]
    },
    // 更多问题...
  ]
};

// 模拟PHQ-9抑郁量表
const mockPhq9Assessment: Assessment = {
  id: 2,
  title: 'PHQ-9 抑郁症筛查量表',
  description: 'PHQ-9是一种简短的抑郁症筛查工具，用于评估抑郁症状的严重程度。',
  instructions: '在过去的两周内，您有多少天受到以下问题的困扰？请选择最符合您情况的选项。',
  timeLimit: 5,
  category: '抑郁筛查',
  tags: ['抑郁', '情绪', '筛查'],
  createdAt: '2025-01-02T00:00:00',
  questions: [
    {
      id: 1,
      text: '做事时提不起劲或没有兴趣',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '完全没有', value: 0 },
        { id: 2, text: '有几天', value: 1 },
        { id: 3, text: '一半以上时间', value: 2 },
        { id: 4, text: '几乎每天', value: 3 }
      ]
    },
    {
      id: 2,
      text: '感到心情低落、沮丧或绝望',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '完全没有', value: 0 },
        { id: 2, text: '有几天', value: 1 },
        { id: 3, text: '一半以上时间', value: 2 },
        { id: 4, text: '几乎每天', value: 3 }
      ]
    },
    {
      id: 3,
      text: '入睡困难、睡不安稳或睡眠过多',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '完全没有', value: 0 },
        { id: 2, text: '有几天', value: 1 },
        { id: 3, text: '一半以上时间', value: 2 },
        { id: 4, text: '几乎每天', value: 3 }
      ]
    },
    {
      id: 4,
      text: '感到疲倦或没有活力',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '完全没有', value: 0 },
        { id: 2, text: '有几天', value: 1 },
        { id: 3, text: '一半以上时间', value: 2 },
        { id: 4, text: '几乎每天', value: 3 }
      ]
    },
    {
      id: 5,
      text: '食欲不振或吃太多',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '完全没有', value: 0 },
        { id: 2, text: '有几天', value: 1 },
        { id: 3, text: '一半以上时间', value: 2 },
        { id: 4, text: '几乎每天', value: 3 }
      ]
    },
    // 更多问题...
  ]
};

// 模拟GAD-7焦虑量表
const mockGad7Assessment: Assessment = {
  id: 3,
  title: 'GAD-7 广泛性焦虑量表',
  description: 'GAD-7是一种简短的广泛性焦虑障碍筛查工具，用于评估焦虑症状的严重程度。',
  instructions: '在过去的两周内，您有多少天受到以下问题的困扰？请选择最符合您情况的选项。',
  timeLimit: 5,
  category: '焦虑筛查',
  tags: ['焦虑', '情绪', '筛查'],
  createdAt: '2025-01-03T00:00:00',
  questions: [
    {
      id: 1,
      text: '感到紧张、焦虑或心烦意乱',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '完全没有', value: 0 },
        { id: 2, text: '有几天', value: 1 },
        { id: 3, text: '一半以上时间', value: 2 },
        { id: 4, text: '几乎每天', value: 3 }
      ]
    },
    {
      id: 2,
      text: '无法停止或控制担忧',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '完全没有', value: 0 },
        { id: 2, text: '有几天', value: 1 },
        { id: 3, text: '一半以上时间', value: 2 },
        { id: 4, text: '几乎每天', value: 3 }
      ]
    },
    {
      id: 3,
      text: '对各种各样的事情担忧过多',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '完全没有', value: 0 },
        { id: 2, text: '有几天', value: 1 },
        { id: 3, text: '一半以上时间', value: 2 },
        { id: 4, text: '几乎每天', value: 3 }
      ]
    },
    {
      id: 4,
      text: '很难放松下来',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '完全没有', value: 0 },
        { id: 2, text: '有几天', value: 1 },
        { id: 3, text: '一半以上时间', value: 2 },
        { id: 4, text: '几乎每天', value: 3 }
      ]
    },
    {
      id: 5,
      text: '由于不安而无法静坐',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '完全没有', value: 0 },
        { id: 2, text: '有几天', value: 1 },
        { id: 3, text: '一半以上时间', value: 2 },
        { id: 4, text: '几乎每天', value: 3 }
      ]
    },
    // 更多问题...
  ]
};

// 新增测评量表 - MBTI人格测试
const mockMbtiAssessment: Assessment = {
  id: 4,
  title: 'MBTI 人格类型测试',
  description: 'MBTI(迈尔斯-布里格斯类型指标)是一种广泛使用的人格类型测试，帮助您了解自己的性格特点和偏好。',
  instructions: '请根据您的真实感受回答以下问题，选择最符合您通常表现的选项。没有对错之分，请选择最能反映真实的您的答案。',
  timeLimit: 15,
  category: '人格测试',
  tags: ['人格', '性格', '自我认知'],
  createdAt: '2025-02-01T00:00:00',
  questions: [
    {
      id: 1,
      text: '在社交场合中，您通常：',
      type: QuestionType.SINGLE_CHOICE,
      required: true,
      options: [
        { id: 1, text: '认识很多人，喜欢主动与陌生人交谈', value: 1 },
        { id: 2, text: '认识少数人，通常等待他人来与您交谈', value: 2 }
      ]
    },
    {
      id: 2,
      text: '您更喜欢：',
      type: QuestionType.SINGLE_CHOICE,
      required: true,
      options: [
        { id: 1, text: '关注现实和实际的细节', value: 1 },
        { id: 2, text: '想象未来的可能性和创意', value: 2 }
      ]
    },
    {
      id: 3,
      text: '做决定时，您通常会：',
      type: QuestionType.SINGLE_CHOICE,
      required: true,
      options: [
        { id: 1, text: '考虑逻辑和客观分析', value: 1 },
        { id: 2, text: '考虑人的感受和价值观', value: 2 }
      ]
    },
    {
      id: 4,
      text: '您更倾向于：',
      type: QuestionType.SINGLE_CHOICE,
      required: true,
      options: [
        { id: 1, text: '提前计划并按计划行事', value: 1 },
        { id: 2, text: '保持灵活，随机应变', value: 2 }
      ]
    },
    {
      id: 5,
      text: '您更喜欢的工作环境是：',
      type: QuestionType.SINGLE_CHOICE,
      required: true,
      options: [
        { id: 1, text: '与团队合作，有很多互动', value: 1 },
        { id: 2, text: '独立工作，有自己的空间', value: 2 }
      ]
    }
    // 更多问题...
  ]
};

// 新增测评量表 - 职业兴趣测试
const mockCareerInterestAssessment: Assessment = {
  id: 5,
  title: '霍兰德职业兴趣测试',
  description: '霍兰德职业兴趣测试帮助您发现自己的职业兴趣类型，为职业选择和发展提供指导。',
  instructions: '请根据您对以下活动的兴趣程度进行评分，1表示完全没有兴趣，5表示非常有兴趣。',
  timeLimit: 10,
  category: '职业发展',
  tags: ['职业', '兴趣', '生涯规划'],
  createdAt: '2025-02-15T00:00:00',
  questions: [
    {
      id: 1,
      text: '修理电器或机械设备',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '完全没有兴趣', value: 1 },
        { id: 2, text: '有点兴趣', value: 2 },
        { id: 3, text: '一般兴趣', value: 3 },
        { id: 4, text: '比较有兴趣', value: 4 },
        { id: 5, text: '非常有兴趣', value: 5 }
      ]
    },
    {
      id: 2,
      text: '进行科学研究或实验',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '完全没有兴趣', value: 1 },
        { id: 2, text: '有点兴趣', value: 2 },
        { id: 3, text: '一般兴趣', value: 3 },
        { id: 4, text: '比较有兴趣', value: 4 },
        { id: 5, text: '非常有兴趣', value: 5 }
      ]
    },
    {
      id: 3,
      text: '创作艺术作品或音乐',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '完全没有兴趣', value: 1 },
        { id: 2, text: '有点兴趣', value: 2 },
        { id: 3, text: '一般兴趣', value: 3 },
        { id: 4, text: '比较有兴趣', value: 4 },
        { id: 5, text: '非常有兴趣', value: 5 }
      ]
    },
    {
      id: 4,
      text: '教导或帮助他人',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '完全没有兴趣', value: 1 },
        { id: 2, text: '有点兴趣', value: 2 },
        { id: 3, text: '一般兴趣', value: 3 },
        { id: 4, text: '比较有兴趣', value: 4 },
        { id: 5, text: '非常有兴趣', value: 5 }
      ]
    },
    {
      id: 5,
      text: '领导团队或组织活动',
      type: QuestionType.LIKERT_SCALE,
      required: true,
      options: [
        { id: 1, text: '完全没有兴趣', value: 1 },
        { id: 2, text: '有点兴趣', value: 2 },
        { id: 3, text: '一般兴趣', value: 3 },
        { id: 4, text: '比较有兴趣', value: 4 },
        { id: 5, text: '非常有兴趣', value: 5 }
      ]
    }
    // 更多问题...
  ]
};

// 所有模拟评测量表
export const mockAssessments: Assessment[] = [
  mockScl90Assessment,
  mockPhq9Assessment,
  mockGad7Assessment,
  mockMbtiAssessment,
  mockCareerInterestAssessment
];

// 模拟获取所有评测量表
export const getAllAssessments = (): Promise<Assessment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAssessments);
    }, 500);
  });
};

// 模拟获取单个评测量表
export const getAssessmentById = (id: number): Promise<Assessment | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 确保id是数字类型
      const numericId = typeof id === 'string' ? parseInt(id) : id;
      console.log('查找评测ID:', numericId, '可用评测:', mockAssessments.map(a => a.id));
      
      // 检查ID是否为有效数字
      if (isNaN(numericId)) {
        console.error('无效的评测ID:', id);
        resolve(null);
        return;
      }
      
      // 查找评测
      const assessment = mockAssessments.find(a => a.id === numericId);
      
      // 打印结果
      if (assessment) {
        console.log('找到评测:', assessment.title);
      } else {
        console.error('未找到评测, 可用ID:', mockAssessments.map(a => a.id));
      }
      
      resolve(assessment || null);
    }, 300);
  });
};

// 模拟创建评测会话
export const createAssessmentSession = (assessmentId: number, userId: number): Promise<AssessmentSession> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const session: AssessmentSession = {
        id: Math.floor(Math.random() * 10000),
        assessmentId,
        userId,
        startTime: new Date().toISOString(),
        status: 'in_progress',
        answers: [],
        progress: 0
      };
      resolve(session);
    }, 300);
  });
};

// 模拟保存答案
export const saveAnswers = (sessionId: number, answers: Answer[]): Promise<AssessmentSession> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 在实际应用中，这里应该从存储中获取会话并更新
      const session: AssessmentSession = {
        id: sessionId,
        assessmentId: 1, // 假设是SCL-90
        userId: 1,
        startTime: new Date().toISOString(),
        status: 'in_progress',
        answers,
        progress: Math.min(100, Math.floor((answers.length / 10) * 100)) // 假设总共10个问题
      };
      resolve(session);
    }, 300);
  });
};

// 模拟完成评测
export const completeAssessment = (sessionId: number, answers: Answer[]): Promise<AssessmentResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 在实际应用中，这里应该计算实际得分和解释
      const result: AssessmentResult = {
        sessionId,
        assessmentId: 1, // 假设是SCL-90
        userId: 1,
        completionTime: new Date().toISOString(),
        scores: [
          {
            category: '焦虑',
            score: 65,
            interpretation: '中度焦虑',
            level: 'medium'
          },
          {
            category: '抑郁',
            score: 45,
            interpretation: '轻度抑郁',
            level: 'low'
          },
          {
            category: '强迫',
            score: 70,
            interpretation: '中度强迫',
            level: 'medium'
          }
        ],
        summary: '根据测评结果，您目前表现出中度焦虑和轻度抑郁症状，同时有一定的强迫倾向。建议您关注自己的心理健康状况，适当寻求专业帮助。',
        recommendations: [
          '保持规律的作息时间，确保充足的睡眠',
          '每天进行适量的体育锻炼，如散步、慢跑等',
          '学习并实践放松技巧，如深呼吸、渐进性肌肉放松等',
          '考虑寻求心理咨询师的专业帮助'
        ]
      };
      resolve(result);
    }, 1000);
  });
}; 