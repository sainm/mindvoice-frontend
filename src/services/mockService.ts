import { User, UserRole } from '../types/user.types';

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@mindvoice.com',
    phone: '13800000001',
    status: 1,
    role: UserRole.ADMIN,
    name: '系统管理员',
    avatar: '',
    lastLoginTime: new Date().toISOString(),
    createdAt: '2025-01-01T00:00:00'
  },
  {
    id: 2,
    username: 'doctor',
    email: 'doctor@mindvoice.com',
    phone: '13800000002',
    status: 1,
    role: UserRole.COUNSELOR,
    name: '王医生',
    avatar: '',
    lastLoginTime: new Date().toISOString(),
    createdAt: '2025-01-02T00:00:00'
  },
  {
    id: 3,
    username: 'user',
    email: 'user@example.com',
    phone: '13800000003',
    status: 1,
    role: UserRole.USER,
    name: '张三',
    avatar: '',
    lastLoginTime: new Date().toISOString(),
    createdAt: '2025-01-03T00:00:00'
  }
];

// 模拟登录函数
export const mockLogin = (username: string, password: string): { success: boolean; user?: User; token?: string; message?: string } => {
  // 简单的模拟登录逻辑，实际应用中应该进行加密和安全处理
  const user = mockUsers.find(u => u.username === username);
  
  // 在模拟环境中，任何密码都能登录，实际应用中应该进行密码验证
  if (user) {
    return {
      success: true,
      user,
      token: `mock-token-${user.id}-${Date.now()}`
    };
  }
  
  return {
    success: false,
    message: '用户名或密码错误'
  };
};

// 获取模拟用户
export const getMockUser = (id: number): User | undefined => {
  return mockUsers.find(u => u.id === id);
}; 