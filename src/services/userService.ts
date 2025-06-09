import axios from 'axios';
import { User, UserRole, UserStatus } from '../types/user.types';
import { getApiBaseUrl, API_ENDPOINTS } from '../config/api.config';
import { mockUsers } from './mockService';

// 是否使用模拟数据
const USE_MOCK = true;

// 创建axios实例
const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// 添加请求拦截器，为请求添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 模拟用户数据 - 扩展mockUsers数据，添加更多用户
const extendedMockUsers: User[] = [
  ...mockUsers,
  {
    id: 4,
    username: 'doctor2',
    email: 'doctor2@mindvoice.com',
    phone: '13800000004',
    status: 1,
    role: UserRole.COUNSELOR,
    name: '李医生',
    avatar: '',
    lastLoginTime: '2025-06-01T10:30:00',
    createdAt: '2025-01-05T00:00:00'
  },
  {
    id: 5,
    username: 'doctor3',
    email: 'doctor3@mindvoice.com',
    phone: '13800000005',
    status: 1,
    role: UserRole.COUNSELOR,
    name: '赵医生',
    avatar: '',
    lastLoginTime: '2025-06-02T09:15:00',
    createdAt: '2025-01-10T00:00:00'
  },
  {
    id: 6,
    username: 'user2',
    email: 'user2@example.com',
    phone: '13800000006',
    status: 1,
    role: UserRole.USER,
    name: '李四',
    avatar: '',
    lastLoginTime: '2025-06-01T14:20:00',
    createdAt: '2025-02-01T00:00:00'
  },
  {
    id: 7,
    username: 'user3',
    email: 'user3@example.com',
    phone: '13800000007',
    status: 1,
    role: UserRole.USER,
    name: '王五',
    avatar: '',
    lastLoginTime: '2025-06-02T16:45:00',
    createdAt: '2025-02-15T00:00:00'
  },
  {
    id: 8,
    username: 'user4',
    email: 'user4@example.com',
    phone: '13800000008',
    status: 0,
    role: UserRole.USER,
    name: '赵六',
    avatar: '',
    lastLoginTime: '2025-05-15T11:30:00',
    createdAt: '2025-03-01T00:00:00'
  },
  {
    id: 9,
    username: 'user5',
    email: 'user5@example.com',
    phone: '13800000009',
    status: -1,
    role: UserRole.USER,
    name: '钱七',
    avatar: '',
    lastLoginTime: '2025-04-20T09:10:00',
    createdAt: '2025-03-15T00:00:00'
  },
  {
    id: 10,
    username: 'admin2',
    email: 'admin2@mindvoice.com',
    phone: '13800000010',
    status: 1,
    role: UserRole.ADMIN,
    name: '副管理员',
    avatar: '',
    lastLoginTime: '2025-06-01T08:30:00',
    createdAt: '2025-01-15T00:00:00'
  }
];

/**
 * 获取用户列表
 * @param page 页码
 * @param pageSize 每页数量
 * @param filters 筛选条件
 * @returns 用户列表和总数
 */
export const getUsers = async (
  page: number = 1,
  pageSize: number = 10,
  filters: {
    role?: UserRole;
    status?: UserStatus;
    searchTerm?: string;
  } = {}
): Promise<{ users: User[]; total: number }> => {
  try {
    if (USE_MOCK) {
      // 使用模拟数据
      let filteredUsers = [...extendedMockUsers];
      
      // 应用筛选条件
      if (filters.role !== undefined) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }
      
      if (filters.status !== undefined) {
        filteredUsers = filteredUsers.filter(user => user.status === filters.status);
      }
      
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.username.toLowerCase().includes(searchTerm) ||
          (user.name && user.name.toLowerCase().includes(searchTerm)) ||
          (user.email && user.email.toLowerCase().includes(searchTerm)) ||
          (user.phone && user.phone.includes(searchTerm))
        );
      }
      
      // 计算分页
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        users: paginatedUsers,
        total: filteredUsers.length
      };
    } else {
      // 使用实际API
      const response = await api.get('/users', {
        params: {
          page,
          pageSize,
          ...filters
        }
      });
      
      return response.data;
    }
  } catch (error) {
    console.error('获取用户列表失败', error);
    throw error;
  }
};

/**
 * 获取用户详情
 * @param userId 用户ID
 * @returns 用户详情
 */
export const getUserById = async (userId: number): Promise<User> => {
  try {
    if (USE_MOCK) {
      // 使用模拟数据
      const user = extendedMockUsers.find(u => u.id === userId);
      
      if (!user) {
        throw new Error('用户不存在');
      }
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return user;
    } else {
      // 使用实际API
      const response = await api.get(`/users/${userId}`);
      return response.data;
    }
  } catch (error) {
    console.error(`获取用户 ${userId} 详情失败`, error);
    throw error;
  }
};

/**
 * 创建用户
 * @param userData 用户数据
 * @returns 创建的用户
 */
export const createUser = async (userData: Partial<User>): Promise<User> => {
  try {
    if (USE_MOCK) {
      // 使用模拟数据
      const newId = Math.max(...extendedMockUsers.map(u => u.id)) + 1;
      
      const newUser: User = {
        id: newId,
        username: userData.username || '',
        email: userData.email,
        phone: userData.phone,
        status: userData.status || 1,
        role: userData.role || UserRole.USER,
        name: userData.name,
        avatar: userData.avatar || '',
        lastLoginTime: '',
        createdAt: new Date().toISOString()
      };
      
      // 检查用户名是否已存在
      if (extendedMockUsers.some(u => u.username === newUser.username)) {
        throw new Error('用户名已存在');
      }
      
      // 添加到模拟数据
      extendedMockUsers.push(newUser);
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return newUser;
    } else {
      // 使用实际API
      const response = await api.post('/users', userData);
      return response.data;
    }
  } catch (error) {
    console.error('创建用户失败', error);
    throw error;
  }
};

/**
 * 更新用户
 * @param userId 用户ID
 * @param userData 用户数据
 * @returns 更新后的用户
 */
export const updateUser = async (userId: number, userData: Partial<User>): Promise<User> => {
  try {
    if (USE_MOCK) {
      // 使用模拟数据
      const userIndex = extendedMockUsers.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error('用户不存在');
      }
      
      // 检查用户名是否已被其他用户使用
      if (userData.username && userData.username !== extendedMockUsers[userIndex].username) {
        const usernameExists = extendedMockUsers.some(u => u.id !== userId && u.username === userData.username);
        if (usernameExists) {
          throw new Error('用户名已存在');
        }
      }
      
      // 更新用户
      const updatedUser = {
        ...extendedMockUsers[userIndex],
        ...userData
      };
      
      extendedMockUsers[userIndex] = updatedUser;
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return updatedUser;
    } else {
      // 使用实际API
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    }
  } catch (error) {
    console.error(`更新用户 ${userId} 失败`, error);
    throw error;
  }
};

/**
 * 删除用户
 * @param userId 用户ID
 * @returns 是否成功
 */
export const deleteUser = async (userId: number): Promise<boolean> => {
  try {
    if (USE_MOCK) {
      // 使用模拟数据
      const userIndex = extendedMockUsers.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error('用户不存在');
      }
      
      // 从模拟数据中删除
      extendedMockUsers.splice(userIndex, 1);
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return true;
    } else {
      // 使用实际API
      await api.delete(`/users/${userId}`);
      return true;
    }
  } catch (error) {
    console.error(`删除用户 ${userId} 失败`, error);
    throw error;
  }
};

/**
 * 更新用户状态
 * @param userId 用户ID
 * @param status 新状态
 * @returns 更新后的用户
 */
export const updateUserStatus = async (userId: number, status: UserStatus): Promise<User> => {
  return updateUser(userId, { status });
};

/**
 * 重置用户密码
 * @param userId 用户ID
 * @param newPassword 新密码
 * @returns 是否成功
 */
export const resetUserPassword = async (userId: number, newPassword: string): Promise<boolean> => {
  try {
    if (USE_MOCK) {
      // 使用模拟数据
      const userIndex = extendedMockUsers.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error('用户不存在');
      }
      
      // 模拟密码重置成功
      // 在实际应用中，这里应该进行密码加密等操作
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return true;
    } else {
      // 使用实际API
      await api.post(`/users/${userId}/reset-password`, { newPassword });
      return true;
    }
  } catch (error) {
    console.error(`重置用户 ${userId} 密码失败`, error);
    throw error;
  }
};

/**
 * 获取用户统计信息
 * @returns 用户统计信息
 */
export const getUserStats = async (): Promise<{
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  blockedUsers: number;
  usersByRole: Record<UserRole, number>;
}> => {
  try {
    if (USE_MOCK) {
      // 使用模拟数据
      const totalUsers = extendedMockUsers.length;
      const activeUsers = extendedMockUsers.filter(u => u.status === UserStatus.ACTIVE).length;
      const inactiveUsers = extendedMockUsers.filter(u => u.status === UserStatus.INACTIVE).length;
      const blockedUsers = extendedMockUsers.filter(u => u.status === UserStatus.BLOCKED).length;
      
      const usersByRole = {
        [UserRole.USER]: extendedMockUsers.filter(u => u.role === UserRole.USER).length,
        [UserRole.COUNSELOR]: extendedMockUsers.filter(u => u.role === UserRole.COUNSELOR).length,
        [UserRole.ADMIN]: extendedMockUsers.filter(u => u.role === UserRole.ADMIN).length
      };
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        totalUsers,
        activeUsers,
        inactiveUsers,
        blockedUsers,
        usersByRole
      };
    } else {
      // 使用实际API
      const response = await api.get('/users/stats');
      return response.data;
    }
  } catch (error) {
    console.error('获取用户统计信息失败', error);
    throw error;
  }
}; 