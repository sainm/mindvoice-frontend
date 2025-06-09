import axios, { InternalAxiosRequestConfig } from 'axios';
import { getApiBaseUrl, API_ENDPOINTS } from '../config/api.config';
import { User as UserType, UserRole } from '../types/user.types';
import { mockLogin } from './mockService';

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
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// 登录请求参数类型
export interface LoginRequest {
  loginId: string;
  password: string;
}

// 登录响应类型
export interface LoginResponse {
  token: string;
  tokenType: string;
  user: UserType;
}

// 错误响应类型
export interface ErrorResponse {
  code: number;
  message: string;
}

/**
 * 登录API
 * @param credentials 登录凭证
 * @returns 登录结果
 */
export const login = async (credentials: { username: string; password: string }): Promise<{ success: boolean; message?: string; user?: UserType }> => {
  try {
    if (USE_MOCK) {
      // 使用模拟数据
      const mockResult = mockLogin(credentials.username, credentials.password);
      
      if (mockResult.success && mockResult.user && mockResult.token) {
        // 存储token和用户信息
        localStorage.setItem('token', mockResult.token);
        localStorage.setItem('tokenType', 'Bearer');
        localStorage.setItem('user', JSON.stringify(mockResult.user));
        localStorage.setItem('isLoggedIn', 'true');
        
        return {
          success: true,
          user: mockResult.user
        };
      } else {
        return {
          success: false,
          message: mockResult.message || '登录失败'
        };
      }
    } else {
      // 使用实际API
      // 转换为API期望的格式
      const loginRequest: LoginRequest = {
        loginId: credentials.username,
        password: credentials.password
      };
      
      // 调用登录API
      const response = await api.post<LoginResponse>(API_ENDPOINTS.LOGIN, loginRequest);
      
      // 存储token和用户信息
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('tokenType', response.data.tokenType);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('isLoggedIn', 'true');
      
      return {
        success: true,
        user: response.data.user
      };
    }
  } catch (error: unknown) {
    // 处理错误
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as ErrorResponse;
      return {
        success: false,
        message: errorData.message || '登录失败'
      };
    }
    
    return {
      success: false,
      message: '网络错误，请稍后再试'
    };
  }
};

/**
 * 退出登录
 */
export const logout = async (): Promise<void> => {
  try {
    if (!USE_MOCK) {
      // 如果有后端登出API，可以调用
      // await api.post(API_ENDPOINTS.LOGOUT);
    }
    
    // 清除本地存储的认证信息
    localStorage.removeItem('token');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  } catch (error) {
    console.error('登出时发生错误', error);
    // 即使API调用失败，也清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  }
};

/**
 * 获取当前登录用户
 * @returns 当前用户或null
 */
export const getCurrentUser = (): UserType | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as UserType;
  } catch (e) {
    return null;
  }
};

/**
 * 检查用户是否已登录
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null && localStorage.getItem('isLoggedIn') === 'true';
};

/**
 * 获取当前用户角色
 * @returns 用户角色或null
 */
export const getUserRole = (): UserRole | null => {
  const user = getCurrentUser();
  return user?.role || null;
};

/**
 * 检查用户是否有指定角色
 * @param role 要检查的角色
 * @returns 是否有该角色
 */
export const hasRole = (role: UserRole): boolean => {
  const userRole = getUserRole();
  return userRole === role;
};

/**
 * 检查用户是否是管理员
 * @returns 是否是管理员
 */
export const isAdmin = (): boolean => {
  return hasRole(UserRole.ADMIN);
};

/**
 * 检查用户是否是咨询师
 * @returns 是否是咨询师
 */
export const isCounselor = (): boolean => {
  return hasRole(UserRole.COUNSELOR);
};

/**
 * 检查用户是否是普通用户
 * @returns 是否是普通用户
 */
export const isRegularUser = (): boolean => {
  return hasRole(UserRole.USER);
}; 