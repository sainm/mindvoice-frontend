import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  Button, 
  Stack, 
  Chip, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Divider,
  Grid,
  IconButton,
  Badge,
  Alert,
  AlertTitle,
  LinearProgress
} from '@mui/material';
import { 
  Security, 
  People, 
  Settings, 
  Warning, 
  Storage, 
  Backup, 
  BarChart, 
  PersonAdd,
  Visibility,
  Edit,
  Delete,
  AdminPanelSettings,
  NotificationsActive
} from '@mui/icons-material';
import { User, UserRole } from '../../types/user.types';

// 模拟数据 - 系统监控
const mockSystemStats = {
  activeUsers: 128,
  highRiskUsers: 12,
  systemLoad: 42,
  lastBackup: '2025-06-07T03:00:00',
  unusualActivities: [
    {
      id: 1,
      type: 'login_attempt',
      description: '多次登录失败',
      ip: '192.168.1.105',
      timestamp: '2025-06-08T10:23:15',
      severity: 'high'
    },
    {
      id: 2,
      type: 'data_access',
      description: '非工作时间访问敏感数据',
      ip: '192.168.1.87',
      timestamp: '2025-06-08T02:15:30',
      severity: 'medium'
    }
  ]
};

// 模拟数据 - 用户管理
const mockUsers = [
  {
    id: 1,
    name: '王医生',
    username: 'doctor_wang',
    avatar: '',
    role: UserRole.COUNSELOR,
    status: 1,
    lastLogin: '2025-06-08T09:30:00'
  },
  {
    id: 2,
    name: '李医生',
    username: 'doctor_li',
    avatar: '',
    role: UserRole.COUNSELOR,
    status: 1,
    lastLogin: '2025-06-08T08:45:00'
  },
  {
    id: 3,
    name: '张三',
    username: 'client1',
    avatar: '',
    role: UserRole.USER,
    status: 1,
    lastLogin: '2025-06-07T15:20:00'
  }
];

// 模拟数据 - 问卷库更新状态
const mockQuestionnaireUpdates = [
  {
    id: 1,
    name: 'SCL-90 症状自评量表',
    updatedAt: '2025-06-05T14:30:00',
    updatedBy: '系统管理员',
    changes: '更新了评分标准'
  },
  {
    id: 2,
    name: 'PHQ-9 抑郁症筛查量表',
    updatedAt: '2025-06-01T11:15:00',
    updatedBy: '王医生',
    changes: '修正了第7题的描述文本'
  }
];

// 模拟数据 - 统计分析
const mockAnalytics = {
  userGrowth: {
    thisMonth: 45,
    lastMonth: 38,
    trend: 'up'
  },
  topQuestionnaires: [
    { name: 'SCL-90 症状自评量表', count: 156 },
    { name: 'PHQ-9 抑郁症筛查量表', count: 124 },
    { name: 'GAD-7 广泛性焦虑量表', count: 98 }
  ],
  counselorPerformance: [
    { name: '王医生', completedSessions: 28, reportsSubmitted: 25 },
    { name: '李医生', completedSessions: 32, reportsSubmitted: 30 }
  ]
};

interface AdminHomeProps {
  user: User;
}

const AdminHome: React.FC<AdminHomeProps> = ({ user }) => {
  const [systemStats, setSystemStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [questionnaireUpdates, setQuestionnaireUpdates] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  
  // 模拟数据加载
  useEffect(() => {
    // 实际应用中，这里应该从API获取数据
    setSystemStats(mockSystemStats);
    setUsers(mockUsers);
    setQuestionnaireUpdates(mockQuestionnaireUpdates);
    setAnalytics(mockAnalytics);
  }, []);

  // 获取用户角色显示文本
  const getRoleText = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return '管理员';
      case UserRole.COUNSELOR:
        return '咨询师';
      case UserRole.USER:
        return '普通用户';
      default:
        return '未知角色';
    }
  };

  // 获取用户角色颜色
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'error';
      case UserRole.COUNSELOR:
        return 'primary';
      case UserRole.USER:
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ 
      '& .MuiPaper-root': { borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }
    }}>
      <Grid container spacing={3}>
        {/* 系统监控面板 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Security sx={{ mr: 1 }} /> 系统监控面板
            </Typography>
            
            {systemStats && (
              <>
                {/* 安全警报 */}
                {systemStats.unusualActivities.length > 0 && (
                  <Alert 
                    severity="warning" 
                    sx={{ mb: 3 }}
                    action={
                      <Button color="inherit" size="small">
                        查看全部
                      </Button>
                    }
                  >
                    <AlertTitle>安全警报</AlertTitle>
                    检测到 {systemStats.unusualActivities.length} 个异常活动，请及时处理
                  </Alert>
                )}
                
                <Grid container spacing={3}>
                  {/* 实时数据 */}
                  <Grid item xs={12} md={8}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          实时数据
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4" color="primary">
                                {systemStats.activeUsers}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                活跃用户数
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography 
                                variant="h4" 
                                color={systemStats.highRiskUsers > 10 ? 'error' : 'warning'}
                              >
                                {systemStats.highRiskUsers}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                高风险用户数
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4" color="info.main">
                                {systemStats.systemLoad}%
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                系统负载
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={systemStats.systemLoad} 
                                color={systemStats.systemLoad > 80 ? 'error' : 'primary'} 
                                sx={{ mt: 1 }}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* 异常活动 */}
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <NotificationsActive sx={{ mr: 1, color: 'error.main' }} /> 
                          异常活动
                        </Typography>
                        <List dense>
                          {systemStats.unusualActivities.map((activity: any) => (
                            <ListItem 
                              key={activity.id}
                              sx={{ 
                                mb: 1, 
                                bgcolor: activity.severity === 'high' ? 'rgba(244, 67, 54, 0.05)' : 'transparent',
                                borderRadius: 1
                              }}
                            >
                              <ListItemIcon>
                                <Warning color={activity.severity === 'high' ? 'error' : 'warning'} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={activity.description}
                                secondary={`${activity.ip} | ${new Date(activity.timestamp).toLocaleString()}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            )}
          </Paper>
        </Grid>
        
        {/* 左侧区域 */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* 用户管理 */}
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <People sx={{ mr: 1 }} /> 用户管理
                </Typography>
                <Button 
                  variant="contained" 
                  size="small" 
                  startIcon={<PersonAdd />}
                >
                  新增用户
                </Button>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1}>
                  <Chip 
                    label="全部" 
                    color="default" 
                    variant="outlined" 
                    onClick={() => console.log('全部')}
                  />
                  <Chip 
                    label="管理员" 
                    color="error" 
                    variant="outlined" 
                    onClick={() => console.log('管理员')}
                  />
                  <Chip 
                    label="咨询师" 
                    color="primary" 
                    variant="outlined" 
                    onClick={() => console.log('咨询师')}
                  />
                  <Chip 
                    label="普通用户" 
                    color="success" 
                    variant="outlined" 
                    onClick={() => console.log('普通用户')}
                  />
                </Stack>
              </Box>
              
              {users.length > 0 ? (
                <List>
                  {users.map((user) => (
                    <ListItem 
                      key={user.id}
                      secondaryAction={
                        <Stack direction="row" spacing={1}>
                          <IconButton size="small" color="primary">
                            <Visibility fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="info">
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
                      }
                      sx={{ 
                        mb: 1, 
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar>{user.name.charAt(0)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {user.name}
                            <Chip 
                              label={getRoleText(user.role)} 
                              color={getRoleColor(user.role) as any}
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="caption" component="div">
                              用户名: {user.username}
                            </Typography>
                            <Typography variant="caption" component="div">
                              最后登录: {new Date(user.lastLogin).toLocaleString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  暂无用户数据
                </Typography>
              )}
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button variant="text">查看更多</Button>
              </Box>
            </Paper>
            
            {/* 统计分析 */}
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <BarChart sx={{ mr: 1 }} /> 统计分析
                </Typography>
                <Button variant="text" size="small">导出报告</Button>
              </Box>
              
              {analytics && (
                <Grid container spacing={3}>
                  {/* 用户增长 */}
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          用户增长率
                        </Typography>
                        <Box sx={{ textAlign: 'center', my: 2 }}>
                          <Typography variant="h4" color="primary">
                            {analytics.userGrowth.thisMonth}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            本月新增用户
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                            <Typography variant="body2" color={analytics.userGrowth.trend === 'up' ? 'success.main' : 'error.main'}>
                              {analytics.userGrowth.trend === 'up' ? '+' : '-'}
                              {Math.abs(analytics.userGrowth.thisMonth - analytics.userGrowth.lastMonth)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                              相比上月
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* 常用量表 */}
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          常用量表 TOP3
                        </Typography>
                        <List dense>
                          {analytics.topQuestionnaires.map((item: any, index: number) => (
                            <ListItem key={index} sx={{ px: 0 }}>
                              <ListItemText 
                                primary={item.name}
                                secondary={`使用次数: ${item.count}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* 咨询师效率 */}
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          咨询师工作效率
                        </Typography>
                        <List dense>
                          {analytics.counselorPerformance.map((item: any, index: number) => (
                            <ListItem key={index} sx={{ px: 0 }}>
                              <ListItemText 
                                primary={item.name}
                                secondary={`咨询: ${item.completedSessions} | 报告: ${item.reportsSubmitted}`}
                              />
                              <LinearProgress 
                                variant="determinate" 
                                value={(item.reportsSubmitted / item.completedSessions) * 100} 
                                sx={{ width: 60 }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Paper>
          </Stack>
        </Grid>
        
        {/* 右侧区域 */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* 权限控制 */}
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <AdminPanelSettings sx={{ mr: 1 }} /> 权限控制
                </Typography>
                <Button variant="text" size="small">设置</Button>
              </Box>
              
              <List>
                <ListItem 
                  sx={{ 
                    mb: 1, 
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <ListItemIcon>
                    <Settings color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="角色权限配置"
                    secondary="管理不同角色的系统权限"
                  />
                </ListItem>
                <ListItem 
                  sx={{ 
                    mb: 1, 
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <ListItemIcon>
                    <Security color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="安全策略设置"
                    secondary="密码强度、登录限制等"
                  />
                </ListItem>
              </List>
            </Paper>
            
            {/* 运维中心 */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Storage sx={{ mr: 1 }} /> 运维中心
              </Typography>
              
              <List>
                {/* 问卷库更新状态 */}
                <ListItem 
                  sx={{ 
                    mb: 1, 
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2">问卷库更新状态</Typography>
                        <Chip label={`${questionnaireUpdates.length} 项更新`} size="small" color="info" />
                      </Box>
                    }
                    secondary={
                      questionnaireUpdates.length > 0 ? (
                        <Typography variant="caption" component="div">
                          最近更新: {questionnaireUpdates[0].name} ({new Date(questionnaireUpdates[0].updatedAt).toLocaleDateString()})
                        </Typography>
                      ) : '暂无更新'
                    }
                  />
                </ListItem>
                
                {/* 数据备份日志 */}
                <ListItem 
                  sx={{ 
                    mb: 1, 
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2">数据备份日志</Typography>
                        <IconButton size="small" color="primary">
                          <Backup />
                        </IconButton>
                      </Box>
                    }
                    secondary={
                      systemStats ? (
                        <Typography variant="caption" component="div">
                          最后备份: {new Date(systemStats.lastBackup).toLocaleString()}
                        </Typography>
                      ) : '加载中...'
                    }
                  />
                </ListItem>
              </List>
              
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mt: 2 }}
              >
                查看系统日志
              </Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminHome; 