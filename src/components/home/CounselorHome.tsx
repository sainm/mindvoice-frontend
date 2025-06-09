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
  LinearProgress,
  Badge,
  Tooltip
} from '@mui/material';
import { 
  Assignment, 
  AssignmentTurnedIn, 
  CalendarMonth, 
  PriorityHigh, 
  Warning, 
  Person, 
  Psychology, 
  Forum, 
  Notifications,
  BarChart,
  AccessTime
} from '@mui/icons-material';
import { User, UserRole } from '../../types/user.types';

// 模拟数据 - 高风险来访者
const mockHighRiskClients = [
  {
    id: 101,
    name: '张三',
    username: 'client1',
    avatar: '',
    riskLevel: 'high',
    lastAssessment: '2025-06-07',
    anxietyIndex: 85,
    depressionIndex: 78,
    notes: '近期情绪波动较大，需密切关注'
  },
  {
    id: 102,
    name: '李四',
    username: 'client2',
    avatar: '',
    riskLevel: 'medium',
    lastAssessment: '2025-06-06',
    anxietyIndex: 72,
    depressionIndex: 65,
    notes: '睡眠质量差，有轻度自伤倾向'
  }
];

// 模拟数据 - 今日预约
const mockTodayAppointments = [
  {
    id: 201,
    clientId: 101,
    clientName: '张三',
    avatar: '',
    startTime: '10:00',
    endTime: '11:00',
    status: 'upcoming',
    type: 'online',
    room: '线上咨询室1',
    notes: '第三次咨询，关注睡眠问题'
  },
  {
    id: 202,
    clientId: 103,
    clientName: '王五',
    avatar: '',
    startTime: '14:30',
    endTime: '15:30',
    status: 'completed',
    type: 'offline',
    room: '面询室2',
    notes: '初次咨询，家庭关系问题'
  },
  {
    id: 203,
    clientId: 104,
    clientName: '赵六',
    avatar: '',
    startTime: '16:00',
    endTime: '17:00',
    status: 'upcoming',
    type: 'online',
    room: '线上咨询室2',
    notes: '职场压力问题跟进'
  }
];

// 模拟数据 - 待处理报告
const mockPendingReports = [
  {
    id: 301,
    clientId: 101,
    clientName: '张三',
    assessmentTitle: 'SCL-90 症状自评量表',
    submittedDate: '2025-06-07',
    urgency: 'high',
    status: 'pending'
  },
  {
    id: 302,
    clientId: 102,
    clientName: '李四',
    assessmentTitle: 'PHQ-9 抑郁症筛查量表',
    submittedDate: '2025-06-06',
    urgency: 'medium',
    status: 'pending'
  }
];

// 模拟数据 - 工作统计
const mockWorkStats = {
  thisWeek: {
    consultationHours: 12.5,
    reportsCompleted: 8,
    newClients: 3
  },
  lastWeek: {
    consultationHours: 10,
    reportsCompleted: 6,
    newClients: 2
  },
  trend: 'up'
};

interface CounselorHomeProps {
  user: User;
}

const CounselorHome: React.FC<CounselorHomeProps> = ({ user }) => {
  const [highRiskClients, setHighRiskClients] = useState<any[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [pendingReports, setPendingReports] = useState<any[]>([]);
  const [workStats, setWorkStats] = useState<any>(null);
  
  // 模拟数据加载
  useEffect(() => {
    // 实际应用中，这里应该从API获取数据
    setHighRiskClients(mockHighRiskClients);
    setTodayAppointments(mockTodayAppointments);
    setPendingReports(mockPendingReports);
    setWorkStats(mockWorkStats);
  }, []);

  // 获取当前时间段的预约
  const getCurrentAppointments = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeValue = currentHour + currentMinutes / 60;
    
    return todayAppointments.filter(appointment => {
      const startHour = parseInt(appointment.startTime.split(':')[0]);
      const startMinutes = parseInt(appointment.startTime.split(':')[1]);
      const startTimeValue = startHour + startMinutes / 60;
      
      const endHour = parseInt(appointment.endTime.split(':')[0]);
      const endMinutes = parseInt(appointment.endTime.split(':')[1]);
      const endTimeValue = endHour + endMinutes / 60;
      
      // 当前时间前后1小时内的预约
      return (
        appointment.status === 'upcoming' && 
        startTimeValue - currentTimeValue <= 1 && 
        currentTimeValue <= endTimeValue
      );
    });
  };

  // 获取紧急报告数量
  const getUrgentReportsCount = () => {
    return pendingReports.filter(report => report.urgency === 'high').length;
  };

  return (
    <Box sx={{ 
      '& .MuiPaper-root': { borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }
    }}>
      <Grid container spacing={3}>
        {/* 工作台总览 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>工作台总览</Typography>
            <Grid container spacing={3}>
              {/* 今日待处理事项 */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTime sx={{ mr: 1 }} /> 今日待处理
                    </Typography>
                    <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">
                          {todayAppointments.filter(a => a.status === 'upcoming').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">预约咨询</Typography>
                      </Box>
                      <Divider orientation="vertical" flexItem />
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color={getUrgentReportsCount() > 0 ? 'error' : 'primary'}>
                          {pendingReports.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">待处理报告</Typography>
                      </Box>
                      <Divider orientation="vertical" flexItem />
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color={highRiskClients.length > 0 ? 'error' : 'primary'}>
                          {highRiskClients.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">高风险来访者</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* 工作统计 */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <BarChart sx={{ mr: 1 }} /> 本周工作统计
                    </Typography>
                    {workStats && (
                      <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" color="primary">
                            {workStats.thisWeek.consultationHours}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">咨询时长(小时)</Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" color="primary">
                            {workStats.thisWeek.reportsCompleted}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">完成报告数</Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" color="primary">
                            {workStats.thisWeek.newClients}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">新增来访者</Typography>
                        </Box>
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* 左侧区域 */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* 重点关注列表 */}
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Warning sx={{ mr: 1, color: 'error.main' }} /> 重点关注列表
                </Typography>
                <Button variant="text" size="small">查看全部</Button>
              </Box>
              
              {highRiskClients.length > 0 ? (
                <List>
                  {highRiskClients.map((client) => (
                    <ListItem 
                      key={client.id}
                      secondaryAction={
                        <Button variant="contained" size="small" color="primary">
                          查看详情
                        </Button>
                      }
                      sx={{ 
                        bgcolor: client.riskLevel === 'high' ? 'rgba(244, 67, 54, 0.05)' : 'background.default', 
                        mb: 1, 
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: client.riskLevel === 'high' ? 'error.light' : 'divider'
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            client.riskLevel === 'high' ? (
                              <PriorityHigh fontSize="small" color="error" />
                            ) : null
                          }
                        >
                          <Avatar>{client.name.charAt(0)}</Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={
                          <Typography variant="subtitle2">
                            {client.name}
                            <Chip 
                              label={client.riskLevel === 'high' ? '高风险' : '中风险'} 
                              color={client.riskLevel === 'high' ? 'error' : 'warning'}
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" component="div">
                              焦虑指数: {client.anxietyIndex}% | 抑郁指数: {client.depressionIndex}%
                            </Typography>
                            <Typography variant="caption" component="div">
                              {client.notes}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  暂无高风险来访者
                </Typography>
              )}
            </Paper>
            
            {/* 预约看板 */}
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarMonth sx={{ mr: 1 }} /> 今日预约看板
                </Typography>
                <Button variant="text" size="small">查看日历</Button>
              </Box>
              
              {todayAppointments.length > 0 ? (
                <>
                  {/* 时间轴 */}
                  <Box sx={{ position: 'relative', pt: 1, pb: 1 }}>
                    <Divider sx={{ position: 'absolute', top: '50%', left: 0, right: 0 }} />
                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      {['09:00', '12:00', '15:00', '18:00'].map((time) => (
                        <Box key={time} sx={{ position: 'relative', textAlign: 'center' }}>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              bgcolor: 'background.paper', 
                              px: 1, 
                              position: 'relative'
                            }}
                          >
                            {time}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                  
                  <List sx={{ mt: 2 }}>
                    {todayAppointments.map((appointment) => (
                      <ListItem 
                        key={appointment.id}
                        secondaryAction={
                          appointment.status === 'upcoming' ? (
                            <Button variant="contained" size="small" color="primary">
                              开始咨询
                            </Button>
                          ) : (
                            <Chip 
                              label="已完成" 
                              color="success"
                              size="small"
                            />
                          )
                        }
                        sx={{ 
                          bgcolor: appointment.status === 'upcoming' ? 'rgba(25, 118, 210, 0.05)' : 'background.default', 
                          mb: 1, 
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar>{appointment.clientName.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle2">
                              {appointment.clientName}
                              <Chip 
                                label={appointment.type === 'online' ? '线上' : '线下'} 
                                color={appointment.type === 'online' ? 'info' : 'default'}
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" component="div">
                                {appointment.startTime} - {appointment.endTime} | {appointment.room}
                              </Typography>
                              <Typography variant="caption" component="div">
                                {appointment.notes}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  今日暂无预约
                </Typography>
              )}
            </Paper>
          </Stack>
        </Grid>
        
        {/* 右侧区域 */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* 待办事项 */}
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Assignment sx={{ mr: 1 }} /> 待处理报告
                </Typography>
                <Button variant="text" size="small">全部报告</Button>
              </Box>
              
              {pendingReports.length > 0 ? (
                <List>
                  {pendingReports.map((report) => (
                    <ListItem 
                      key={report.id}
                      secondaryAction={
                        <Button 
                          variant="contained" 
                          size="small"
                          color={report.urgency === 'high' ? 'error' : 'primary'}
                        >
                          处理
                        </Button>
                      }
                      sx={{ 
                        bgcolor: report.urgency === 'high' ? 'rgba(244, 67, 54, 0.05)' : 'background.default', 
                        mb: 1, 
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: report.urgency === 'high' ? 'error.light' : 'divider'
                      }}
                    >
                      <ListItemIcon>
                        {report.urgency === 'high' ? 
                          <AssignmentTurnedIn color="error" /> : 
                          <AssignmentTurnedIn color="primary" />
                        }
                      </ListItemIcon>
                      <ListItemText 
                        primary={report.assessmentTitle}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              来访者: {report.clientName}
                            </Typography>
                            <Typography variant="caption" component="div">
                              提交时间: {report.submittedDate}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  暂无待处理报告
                </Typography>
              )}
            </Paper>
            
            {/* 专业工具 */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>专业工具</Typography>
              <Stack spacing={2}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<Psychology />}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  创建干预方案
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<Assignment />}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  量表解读参考库
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<Person />}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  来访者档案管理
                </Button>
              </Stack>
            </Paper>
            
            {/* 协作模块 */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>协作模块</Typography>
              <List>
                <ListItem 
                  sx={{ 
                    bgcolor: 'rgba(25, 118, 210, 0.05)', 
                    mb: 1, 
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'primary.light'
                  }}
                >
                  <ListItemIcon>
                    <Forum color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="案例讨论区有新回复"
                    secondary="李医生回复了您的咨询"
                  />
                  <Badge badgeContent={3} color="primary">
                    <IconButton size="small">
                      <Notifications />
                    </IconButton>
                  </Badge>
                </ListItem>
                <ListItem 
                  sx={{ 
                    bgcolor: 'background.default', 
                    mb: 1, 
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <ListItemIcon>
                    <Psychology color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="督导会议提醒"
                    secondary="周五 15:00-17:00 线上会议"
                  />
                </ListItem>
              </List>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CounselorHome; 