import axios from 'axios';
import { Assessment, Question, QuestionType } from '../types/assessment.types';
import { getApiBaseUrl } from '../config/api.config';
import { mockAssessments } from './mockAssessmentService';

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

// 模拟数据 - 使用mockAssessmentService中的数据
let managedAssessments: Assessment[] = [...mockAssessments];

/**
 * 获取所有评测量表
 * @param page 页码
 * @param pageSize 每页数量
 * @param filters 筛选条件
 * @returns 评测量表列表和总数
 */
export const getAssessments = async (
  page: number = 1,
  pageSize: number = 10,
  filters: {
    category?: string;
    searchTerm?: string;
  } = {}
): Promise<{ assessments: Assessment[]; total: number }> => {
  try {
    if (USE_MOCK) {
      // 使用模拟数据
      let filteredAssessments = [...managedAssessments];
      
      // 应用筛选条件
      if (filters.category) {
        filteredAssessments = filteredAssessments.filter(assessment => 
          assessment.category === filters.category
        );
      }
      
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        filteredAssessments = filteredAssessments.filter(assessment => 
          assessment.title.toLowerCase().includes(searchTerm) ||
          assessment.description.toLowerCase().includes(searchTerm) ||
          assessment.category.toLowerCase().includes(searchTerm) ||
          assessment.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      // 计算分页
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedAssessments = filteredAssessments.slice(startIndex, endIndex);
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        assessments: paginatedAssessments,
        total: filteredAssessments.length
      };
    } else {
      // 使用实际API
      const response = await api.get('/assessments', {
        params: {
          page,
          pageSize,
          ...filters
        }
      });
      
      return response.data;
    }
  } catch (error) {
    console.error('获取评测量表列表失败', error);
    throw error;
  }
};

/**
 * 获取评测量表详情
 * @param id 评测量表ID
 * @returns 评测量表详情
 */
export const getAssessmentById = async (id: number): Promise<Assessment | null> => {
  try {
    if (USE_MOCK) {
      // 使用模拟数据
      const assessment = managedAssessments.find(a => a.id === id);
      
      if (!assessment) {
        throw new Error('评测量表不存在');
      }
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return assessment;
    } else {
      // 使用实际API
      const response = await api.get(`/assessments/${id}`);
      return response.data;
    }
  } catch (error) {
    console.error(`获取评测量表 ${id} 详情失败`, error);
    throw error;
  }
};

/**
 * 创建评测量表
 * @param assessmentData 评测量表数据
 * @returns 创建的评测量表
 */
export const createAssessment = async (assessmentData: Partial<Assessment>): Promise<Assessment> => {
  try {
    if (USE_MOCK) {
      // 使用模拟数据
      const newId = Math.max(...managedAssessments.map(a => a.id)) + 1;
      
      const newAssessment: Assessment = {
        id: newId,
        title: assessmentData.title || '',
        description: assessmentData.description || '',
        instructions: assessmentData.instructions || '',
        timeLimit: assessmentData.timeLimit,
        category: assessmentData.category || '其他',
        tags: assessmentData.tags || [],
        questions: assessmentData.questions || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 添加到模拟数据
      managedAssessments.push(newAssessment);
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return newAssessment;
    } else {
      // 使用实际API
      const response = await api.post('/assessments', assessmentData);
      return response.data;
    }
  } catch (error) {
    console.error('创建评测量表失败', error);
    throw error;
  }
};

/**
 * 更新评测量表
 * @param id 评测量表ID
 * @param assessmentData 评测量表数据
 * @returns 更新后的评测量表
 */
export const updateAssessment = async (id: number, assessmentData: Partial<Assessment>): Promise<Assessment> => {
  try {
    if (USE_MOCK) {
      // 使用模拟数据
      const assessmentIndex = managedAssessments.findIndex(a => a.id === id);
      
      if (assessmentIndex === -1) {
        throw new Error('评测量表不存在');
      }
      
      // 更新评测量表
      const updatedAssessment = {
        ...managedAssessments[assessmentIndex],
        ...assessmentData,
        updatedAt: new Date().toISOString()
      };
      
      managedAssessments[assessmentIndex] = updatedAssessment;
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return updatedAssessment;
    } else {
      // 使用实际API
      const response = await api.put(`/assessments/${id}`, assessmentData);
      return response.data;
    }
  } catch (error) {
    console.error(`更新评测量表 ${id} 失败`, error);
    throw error;
  }
};

/**
 * 删除评测量表
 * @param id 评测量表ID
 * @returns 是否成功
 */
export const deleteAssessment = async (id: number): Promise<boolean> => {
  try {
    if (USE_MOCK) {
      // 使用模拟数据
      const assessmentIndex = managedAssessments.findIndex(a => a.id === id);
      
      if (assessmentIndex === -1) {
        throw new Error('评测量表不存在');
      }
      
      // 从模拟数据中删除
      managedAssessments.splice(assessmentIndex, 1);
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return true;
    } else {
      // 使用实际API
      await api.delete(`/assessments/${id}`);
      return true;
    }
  } catch (error) {
    console.error(`删除评测量表 ${id} 失败`, error);
    throw error;
  }
};

/**
 * 导出评测量表为JSON文件
 * @param id 评测量表ID，如果为空则导出所有量表
 * @returns 导出的JSON数据
 */
export const exportAssessment = async (id?: number): Promise<string> => {
  try {
    let dataToExport: Assessment | Assessment[];
    
    if (id) {
      // 导出单个评测量表
      const assessment = await getAssessmentById(id);
      if (!assessment) {
        throw new Error('评测量表不存在');
      }
      dataToExport = assessment;
    } else {
      // 导出所有评测量表
      const result = await getAssessments(1, 1000);
      dataToExport = result.assessments;
    }
    
    // 转换为JSON字符串
    const jsonData = JSON.stringify(dataToExport, null, 2);
    
    // 创建下载链接
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // 创建下载链接并模拟点击
    const a = document.createElement('a');
    a.href = url;
    a.download = id ? `assessment_${id}.json` : 'all_assessments.json';
    document.body.appendChild(a);
    a.click();
    
    // 清理
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return jsonData;
  } catch (error) {
    console.error('导出评测量表失败', error);
    throw error;
  }
};

/**
 * 导入评测量表
 * @param jsonData 评测量表JSON数据
 * @returns 导入的评测量表
 */
export const importAssessment = async (jsonData: string): Promise<Assessment | Assessment[]> => {
  try {
    // 解析JSON数据
    const parsedData = JSON.parse(jsonData);
    
    if (Array.isArray(parsedData)) {
      // 导入多个评测量表
      const importedAssessments: Assessment[] = [];
      
      for (const assessmentData of parsedData) {
        // 验证数据格式
        if (!assessmentData.title || !assessmentData.questions) {
          throw new Error('评测量表数据格式无效');
        }
        
        // 创建新的评测量表
        const newAssessment = await createAssessment({
          ...assessmentData,
          id: undefined, // 不使用导入数据的ID，而是生成新ID
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        importedAssessments.push(newAssessment);
      }
      
      return importedAssessments;
    } else {
      // 导入单个评测量表
      if (!parsedData.title || !parsedData.questions) {
        throw new Error('评测量表数据格式无效');
      }
      
      // 创建新的评测量表
      const newAssessment = await createAssessment({
        ...parsedData,
        id: undefined, // 不使用导入数据的ID，而是生成新ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return newAssessment;
    }
  } catch (error) {
    console.error('导入评测量表失败', error);
    throw error;
  }
};

/**
 * 获取评测量表统计信息
 * @returns 评测量表统计信息
 */
export const getAssessmentStats = async (): Promise<{
  totalAssessments: number;
  categoryCounts: Record<string, number>;
  questionTypeCounts: Record<string, number>;
}> => {
  try {
    if (USE_MOCK) {
      // 使用模拟数据
      const totalAssessments = managedAssessments.length;
      
      // 统计各类别的数量
      const categoryCounts: Record<string, number> = {};
      managedAssessments.forEach(assessment => {
        const category = assessment.category;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
      
      // 统计各问题类型的数量
      const questionTypeCounts: Record<string, number> = {};
      managedAssessments.forEach(assessment => {
        assessment.questions.forEach(question => {
          questionTypeCounts[question.type] = (questionTypeCounts[question.type] || 0) + 1;
        });
      });
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        totalAssessments,
        categoryCounts,
        questionTypeCounts
      };
    } else {
      // 使用实际API
      const response = await api.get('/assessments/stats');
      return response.data;
    }
  } catch (error) {
    console.error('获取评测量表统计信息失败', error);
    throw error;
  }
}; 