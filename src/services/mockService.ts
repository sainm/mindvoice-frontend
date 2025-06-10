import { User, UserRole, Appointment, RiskAlert, RiskLevel, RiskType, RiskAlertStatus } from '../types/user.types';

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

// 模拟咨询师数据
export const mockCounselors: User[] = [
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
    id: 4,
    username: 'doctor2',
    email: 'doctor2@mindvoice.com',
    phone: '13800000004',
    status: 1,
    role: UserRole.COUNSELOR,
    name: '李医生',
    avatar: '',
    lastLoginTime: new Date().toISOString(),
    createdAt: '2025-01-04T00:00:00'
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
    lastLoginTime: new Date().toISOString(),
    createdAt: '2025-01-05T00:00:00'
  }
];

// 模拟预约数据
export const mockAppointments: Appointment[] = [
  {
    id: 1,
    userId: 3,
    counselorId: 2,
    counselorName: '王医生',
    date: '2025-06-15',
    startTime: '09:00',
    endTime: '10:00',
    status: 'scheduled',
    notes: '首次咨询',
    location: '线上会议室1',
    type: 'online'
  },
  {
    id: 2,
    userId: 3,
    counselorId: 4,
    counselorName: '李医生',
    date: '2025-06-18',
    startTime: '14:00',
    endTime: '15:00',
    status: 'scheduled',
    notes: '焦虑症状随访',
    location: '心理咨询室2号',
    type: 'offline'
  },
  {
    id: 3,
    userId: 3,
    counselorId: 2,
    counselorName: '王医生',
    date: '2025-06-10',
    startTime: '10:00',
    endTime: '11:00',
    status: 'completed',
    notes: '初步评估',
    location: '线上会议室2',
    type: 'online'
  }
];

// 模拟风险预警数据
export const mockRiskAlerts: RiskAlert[] = [
  {
    id: 1,
    userId: 3,
    userName: '张三',
    counselorId: 2,
    counselorName: '王医生',
    riskLevel: RiskLevel.HIGH,
    riskType: RiskType.SUICIDE,
    description: '患者在最近的评估中表现出较强的自杀意念，并提到"活着没有意义"',
    createdAt: '2025-06-10T09:30:00',
    updatedAt: '2025-06-10T14:20:00',
    status: RiskAlertStatus.IN_PROGRESS,
    notes: '已联系患者家属，安排紧急面谈',
    triggerSource: '评测结果',
    actionTaken: '已电话联系患者，确认安全状况'
  },
  {
    id: 2,
    userId: 6,
    userName: '李四',
    counselorId: 2,
    counselorName: '王医生',
    riskLevel: RiskLevel.CRITICAL,
    riskType: RiskType.SELF_HARM,
    description: '患者承认有自伤行为，手腕有明显伤痕',
    createdAt: '2025-06-11T10:15:00',
    status: RiskAlertStatus.PENDING,
    triggerSource: '咨询记录',
  },
  {
    id: 3,
    userId: 8,
    userName: '王五',
    counselorId: 4,
    counselorName: '李医生',
    riskLevel: RiskLevel.MEDIUM,
    riskType: RiskType.SEVERE_DEPRESSION,
    description: '患者连续两周无法入睡，食欲下降明显，情绪低落',
    createdAt: '2025-06-08T16:45:00',
    updatedAt: '2025-06-09T11:30:00',
    status: RiskAlertStatus.RESOLVED,
    notes: '已完成评估，制定干预计划',
    triggerSource: '定期评估',
    actionTaken: '已安排每周随访，推荐适当药物治疗'
  },
  {
    id: 4,
    userId: 10,
    userName: '赵六',
    counselorId: 5,
    counselorName: '赵医生',
    riskLevel: RiskLevel.MEDIUM,
    riskType: RiskType.VIOLENCE,
    description: '患者表现出对同事的强烈敌意，曾提及"想教训他们一顿"',
    createdAt: '2025-06-09T14:20:00',
    status: RiskAlertStatus.IN_PROGRESS,
    notes: '需进一步评估暴力风险',
    triggerSource: '咨询记录'
  },
  {
    id: 5,
    userId: 12,
    userName: '钱七',
    counselorId: 2,
    counselorName: '王医生',
    riskLevel: RiskLevel.LOW,
    riskType: RiskType.SUBSTANCE_ABUSE,
    description: '患者承认周末饮酒过量，但否认依赖',
    createdAt: '2025-06-07T09:10:00',
    updatedAt: '2025-06-07T15:45:00',
    status: RiskAlertStatus.DISMISSED,
    notes: '经评估，未达到物质滥用标准',
    triggerSource: '人工标记',
    actionTaken: '已提供健康饮酒指导'
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

// 获取所有咨询师
export const getAllCounselors = (): User[] => {
  return mockCounselors;
};

// 获取特定用户的预约列表
export const getUserAppointments = (userId: number): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.userId === userId);
};

// 获取特定咨询师的预约列表
export const getCounselorAppointments = (counselorId: number): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.counselorId === counselorId);
};

// 获取所有预约
export const getAllAppointments = (): Appointment[] => {
  return mockAppointments;
};

// 创建新预约
export const createAppointment = (appointment: Omit<Appointment, 'id'>): Appointment => {
  const newAppointment = {
    ...appointment,
    id: mockAppointments.length + 1
  };
  
  mockAppointments.push(newAppointment);
  return newAppointment;
};

// 更新预约
export const updateAppointment = (id: number, updates: Partial<Appointment>): Appointment | undefined => {
  const index = mockAppointments.findIndex(appointment => appointment.id === id);
  
  if (index !== -1) {
    mockAppointments[index] = { ...mockAppointments[index], ...updates };
    return mockAppointments[index];
  }
  
  return undefined;
};

// 删除预约
export const deleteAppointment = (id: number): boolean => {
  const index = mockAppointments.findIndex(appointment => appointment.id === id);
  
  if (index !== -1) {
    mockAppointments.splice(index, 1);
    return true;
  }
  
  return false;
};

// 获取所有风险预警
export const getAllRiskAlerts = (): RiskAlert[] => {
  return mockRiskAlerts;
};

// 获取特定咨询师的风险预警
export const getCounselorRiskAlerts = (counselorId: number): RiskAlert[] => {
  return mockRiskAlerts.filter(alert => alert.counselorId === counselorId);
};

// 获取特定用户的风险预警
export const getUserRiskAlerts = (userId: number): RiskAlert[] => {
  return mockRiskAlerts.filter(alert => alert.userId === userId);
};

// 创建新的风险预警
export const createRiskAlert = (alert: Omit<RiskAlert, 'id'>): RiskAlert => {
  const newAlert = {
    ...alert,
    id: mockRiskAlerts.length + 1,
    createdAt: new Date().toISOString()
  };
  
  mockRiskAlerts.push(newAlert);
  return newAlert;
};

// 更新风险预警
export const updateRiskAlert = (id: number, updates: Partial<RiskAlert>): RiskAlert | undefined => {
  const index = mockRiskAlerts.findIndex(alert => alert.id === id);
  
  if (index !== -1) {
    mockRiskAlerts[index] = { 
      ...mockRiskAlerts[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return mockRiskAlerts[index];
  }
  
  return undefined;
};

// 删除风险预警
export const deleteRiskAlert = (id: number): boolean => {
  const index = mockRiskAlerts.findIndex(alert => alert.id === id);
  
  if (index !== -1) {
    mockRiskAlerts.splice(index, 1);
    return true;
  }
  
  return false;
}; 