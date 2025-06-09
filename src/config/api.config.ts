/**
 * API配置文件
 * 根据不同环境提供不同的API基础URL
 */

// 开发环境API基础URL
export const DEV_API_BASE_URL = 'http://localhost:8080';

// 测试环境API基础URL
export const TEST_API_BASE_URL = 'https://test-api.mindvoice.com';

// 生产环境API基础URL
export const PROD_API_BASE_URL = 'https://api.mindvoice.com';

// 获取当前环境的API基础URL
export const getApiBaseUrl = (): string => {
  const env = import.meta.env.MODE;
  
  switch (env) {
    case 'development':
      return DEV_API_BASE_URL;
    case 'test':
      return TEST_API_BASE_URL;
    case 'production':
      return PROD_API_BASE_URL;
    default:
      return DEV_API_BASE_URL;
  }
};

// API端点
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  USER_PROFILE: '/api/users/profile',
  // 其他API端点...
}; 