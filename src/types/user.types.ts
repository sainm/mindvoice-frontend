/**
 * 用户角色枚举
 */
export enum UserRole {
  USER = 'USER',        // 普通用户/来访者/患者
  COUNSELOR = 'COUNSELOR', // 心理咨询师
  ADMIN = 'ADMIN'       // 管理员
}

/**
 * 用户状态枚举
 */
export enum UserStatus {
  ACTIVE = 1,    // 活跃
  INACTIVE = 0,  // 非活跃
  BLOCKED = -1   // 已封禁
}

/**
 * 用户基本信息接口
 */
export interface User {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  status: number;
  role?: UserRole;
  name?: string;
  avatar?: string;
  lastLoginTime?: string;
  createdAt?: string;
}

/**
 * 用户详细信息接口
 */
export interface UserProfile extends User {
  gender?: string;
  age?: number;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalHistory?: string;
  emotionalStatus?: EmotionalStatus;
}

/**
 * 情绪状态接口
 */
export interface EmotionalStatus {
  anxietyIndex?: number;  // 焦虑指数 (0-100)
  depressionIndex?: number; // 抑郁指数 (0-100)
  lastUpdated?: string;  // 最后更新时间
  trend?: 'up' | 'down' | 'stable'; // 趋势
}

/**
 * 待完成测评接口
 */
export interface Assessment {
  id: number;
  title: string;
  type: string;
  description?: string;
  deadline?: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt?: string;
}

/**
 * 历史报告接口
 */
export interface Report {
  id: number;
  title: string;
  assessmentId: number;
  assessmentTitle: string;
  createdAt: string;
  status: 'unread' | 'read';
  summary?: string;
  counselorId?: number;
  counselorName?: string;
}

/**
 * 预约接口
 */
export interface Appointment {
  id: number;
  userId: number;
  counselorId: number;
  counselorName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'canceled' | 'missed';
  notes?: string;
  location?: string;
  type: 'online' | 'offline';
}

/**
 * 系统通知接口
 */
export interface Notification {
  id: number;
  title: string;
  content: string;
  type: 'system' | 'message' | 'report' | 'appointment' | 'emergency';
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: number;
    name: string;
    role: UserRole;
  };
}

/**
 * 心理小贴士接口
 */
export interface PsychTip {
  id: number;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
} 