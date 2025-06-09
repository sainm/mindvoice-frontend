import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  Button, 
  Divider, 
  Stack, 
  Chip, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Avatar,
  IconButton,
  LinearProgress,
  Grid
} from '@mui/material';
import { 
  Assignment, 
  AssignmentTurnedIn, 
  CalendarMonth, 
  Message, 
  Notifications, 
  SelfImprovement, 
  Warning, 
  TrendingUp, 
  TrendingDown, 
  TrendingFlat,
  Phone
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { UserProfile, Assessment, Report, Appointment, Notification, PsychTip } from '../../types/user.types';

// 模拟数据
const mockEmotionalStatus = {
  anxietyIndex: 65,
  depressionIndex: 42,
  lastUpdated: '2025-06-08T14:30:00',
  trend: 'down' as const
};

const mockAssessments = [
  {
    id: 1,
    title: 'SCL-90 症状自评量表',
    type: 'clinical',
    description: '用于评估个体的心理健康状况',
    deadline: '2025-06-10T23:59:59',
    status: 'pending' as const,
    createdAt: '2025-06-05T10:00:00'
  },
  {
    id: 2,
    title: 'PHQ-9 抑郁症筛查量表',
    type: 'depression',
    description: '用于筛查抑郁症状的严重程度',
    deadline: '2025-06-12T23:59:59',
    status: 'in_progress' as const,
    createdAt: '2025-06-06T14:30:00',
    updatedAt: '2025-06-07T09:15:00'
  }
];

const mockReports = [
  {
    id: 1,
    title: '心理健康评估报告',
    assessmentId: 3,
    assessmentTitle: 'MMPI 明尼苏达多项人格测验',
    createdAt: '2025-06-01T15:45:00',
    status: 'unread',
    summary: '根据测评结果，您的整体心理状态稳定，建议继续保持良好的生活习惯...',
    counselorId: 5,
    counselorName: '王医生'
  },
  {
    id: 2,
    title: '抑郁症状跟踪报告',
    assessmentId: 4,
    assessmentTitle: 'PHQ-9 抑郁症筛查量表',
    createdAt: '2025-05-20T11:30:00',
    status: 'read',
    counselorId: 5,
    counselorName: '王医生'
  }
];

const mockAppointments = [
  {
    id: 1,
    userId: 10,
    counselorId: 5,
    counselorName: '王医生',
    date: '2025-06-15',
    startTime: '14:00',
    endTime: '15:00',
    status: 'scheduled' as const,
    notes: '初次咨询，请提前5分钟进入',
    location: '线上咨询室1',
    type: 'online' as const
  }
];

const mockNotifications = [
  {
    id: 1,
    title: '新报告已生成',
    content: '您的心理健康评估报告已生成，请查看',
    type: 'report' as const,
    isRead: false,
    createdAt: '2025-06-08T09:30:00'
  },
  {
    id: 2,
    title: '咨询师留言',
    content: '请记得完成本周的情绪日记记录，这对跟踪您的情绪变化很重要',
    type: 'message' as const,
    isRead: false,
    createdAt: '2025-06-07T16:45:00',
    sender: {
      id: 5,
      name: '王医生',
      role: 'COUNSELOR' as const
    }
  }
];

const mockTips = [
  {
    id: 1,
    title: '如何应对突发焦虑',
    content: '当感到焦虑时，尝试深呼吸练习：吸气4秒，屏息4秒，呼气6秒，重复5次...',
    category: '焦虑管理',
    imageUrl: '/images/anxiety.jpg',
    createdAt: '2025-06-08T00:00:00'
  }
];

interface UserHomeProps {
  user: UserProfile;
}

const UserHome: React.FC<UserHomeProps> = ({ user }) => {
  const navigate = useNavigate();
  const [pendingAssessments, setPendingAssessments] = useState<Assessment[]>([]);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dailyTip, setDailyTip] = useState<PsychTip | null>(null);
  const [emotionalStatus, setEmotionalStatus] = useState(user.emotionalStatus || mockEmotionalStatus);

  // 模拟数据加载
  useEffect(() => {
    // 实际应用中，这里应该从API获取数据
    setPendingAssessments(mockAssessments);
    setRecentReports(mockReports);
    setUpcomingAppointments(mockAppointments);
    setNotifications(mockNotifications);
    setDailyTip(mockTips[0]);
  }, []);

  // 获取趋势图标
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp color="error" />;
      case 'down':
        return <TrendingDown color="success" />;
      default:
        return <TrendingFlat color="info" />;
    }
  };

  // 紧急求助处理函数
  const handleEmergencyHelp = () => {
    console.log('紧急求助按钮点击');
    // 实际应用中，这里应该触发紧急联系流程
    alert('紧急求助已发送，咨询师将尽快联系您');
  };

  // 开始新测评处理函数
  const handleStartNewAssessment = () => {
    console.log('开始新测评按钮点击');
    // 导航到测评选择页面
    console.log('导航到评测列表页面');
    navigate('/assessments');
    
    // 确保导航后不会立即尝试访问特定评测
    setTimeout(() => {
      console.log('当前路径:', window.location.pathname);
    }, 100);
  };

  return (
    <Box sx={{ 
      '& .MuiPaper-root': { borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }
    }}>
      <Grid container spacing={3}>
        {/* 个人信息摘要 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, mb: { xs: 2, md: 0 } }}>
              <Avatar 
                sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}
                src={user.avatar}
              >
                {user.name?.charAt(0) || user.username.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h5">{user.name || user.username}</Typography>
                <Typography variant="body2" color="text.secondary">
                  上次登录: {new Date(user.lastLoginTime || Date.now()).toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                <Typography variant="body2" color="text.secondary">焦虑指数</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h6" color={emotionalStatus.anxietyIndex > 70 ? 'error.main' : 'text.primary'}>
                    {emotionalStatus.anxietyIndex}%
                  </Typography>
                  {getTrendIcon(emotionalStatus.trend)}
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={emotionalStatus.anxietyIndex} 
                  color={emotionalStatus.anxietyIndex > 70 ? 'error' : 'primary'} 
                  sx={{ mt: 0.5 }}
                />
              </Box>

              <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                <Typography variant="body2" color="text.secondary">抑郁指数</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h6" color={emotionalStatus.depressionIndex > 70 ? 'error.main' : 'text.primary'}>
                    {emotionalStatus.depressionIndex}%
                  </Typography>
                  {getTrendIcon(emotionalStatus.trend)}
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={emotionalStatus.depressionIndex} 
                  color={emotionalStatus.depressionIndex > 70 ? 'error' : 'primary'} 
                  sx={{ mt: 0.5 }}
                />
              </Box>

              <Button 
                variant="contained" 
                color="error" 
                startIcon={<Phone />}
                onClick={handleEmergencyHelp}
                sx={{ ml: 2, height: 48 }}
              >
                紧急求助
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* 核心功能区 */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* 待完成测评 */}
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Assignment sx={{ mr: 1 }} /> 待完成测评
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={handleStartNewAssessment}
                >
                  开始新测评
                </Button>
              </Box>
              
              {pendingAssessments.length > 0 ? (
                <List>
                  {pendingAssessments.map((assessment) => (
                    <ListItem 
                      key={assessment.id}
                      secondaryAction={
                        <Button 
                          variant="contained" 
                          size="small"
                          color={assessment.status === 'in_progress' ? 'secondary' : 'primary'}
                          onClick={() => {
                            console.log('点击评测项按钮:', assessment.id, assessment.title);
                            navigate(`/assessments/${assessment.id}`);
                          }}
                        >
                          {assessment.status === 'pending' ? '开始测评' : '继续测评'}
                        </Button>
                      }
                      sx={{ 
                        bgcolor: 'background.default', 
                        mb: 1, 
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <ListItemIcon>
                        {assessment.status === 'pending' ? 
                          <Assignment color="primary" /> : 
                          <AssignmentTurnedIn color="secondary" />
                        }
                      </ListItemIcon>
                      <ListItemText 
                        primary={assessment.title}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {assessment.description}
                            </Typography>
                            <Typography variant="caption" component="div" color="error">
                              截止日期: {new Date(assessment.deadline || '').toLocaleDateString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  暂无待完成测评
                </Typography>
              )}
            </Paper>

            {/* 历史报告 */}
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <AssignmentTurnedIn sx={{ mr: 1 }} /> 历史报告
                </Typography>
                <Button variant="text" size="small">查看全部</Button>
              </Box>
              
              {recentReports.length > 0 ? (
                <List>
                  {recentReports.map((report) => (
                    <ListItem 
                      key={report.id}
                      secondaryAction={
                        <Chip 
                          label={report.status === 'unread' ? '未读' : '已读'} 
                          color={report.status === 'unread' ? 'primary' : 'default'}
                          size="small"
                        />
                      }
                      sx={{ 
                        bgcolor: 'background.default', 
                        mb: 1, 
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <ListItemText 
                        primary={report.title}
                        secondary={
                          <>
                            <Typography variant="caption" component="div">
                              测评: {report.assessmentTitle}
                            </Typography>
                            <Typography variant="caption" component="div">
                              生成时间: {new Date(report.createdAt).toLocaleDateString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  暂无历史报告
                </Typography>
              )}
            </Paper>

            {/* 预约管理 */}
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarMonth sx={{ mr: 1 }} /> 预约管理
                </Typography>
                <Button variant="text" size="small">预约咨询</Button>
              </Box>
              
              {upcomingAppointments.length > 0 ? (
                <List>
                  {upcomingAppointments.map((appointment) => (
                    <ListItem 
                      key={appointment.id}
                      secondaryAction={
                        <Stack direction="row" spacing={1}>
                          <Button variant="outlined" size="small" color="primary">
                            修改
                          </Button>
                          <Button variant="outlined" size="small" color="error">
                            取消
                          </Button>
                        </Stack>
                      }
                      sx={{ 
                        bgcolor: 'background.default', 
                        mb: 1, 
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <ListItemIcon>
                        <CalendarMonth color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`咨询师: ${appointment.counselorName}`}
                        secondary={
                          <>
                            <Typography variant="body2" component="div">
                              时间: {appointment.date} {appointment.startTime}-{appointment.endTime}
                            </Typography>
                            <Typography variant="caption" component="div">
                              地点: {appointment.type === 'online' ? '线上' : '线下'} - {appointment.location}
                            </Typography>
                            {appointment.notes && (
                              <Typography variant="caption" component="div">
                                备注: {appointment.notes}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  暂无预约记录
                </Typography>
              )}
            </Paper>
          </Stack>
        </Grid>

        {/* 侧边栏 */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* 动态信息区 */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Notifications sx={{ mr: 1 }} /> 动态信息
              </Typography>
              
              {notifications.length > 0 ? (
                <List>
                  {notifications.map((notification) => (
                    <ListItem 
                      key={notification.id}
                      sx={{ 
                        bgcolor: notification.isRead ? 'transparent' : 'rgba(25, 118, 210, 0.05)', 
                        mb: 1, 
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <ListItemIcon>
                        {notification.type === 'message' ? (
                          <Message color="primary" />
                        ) : notification.type === 'report' ? (
                          <AssignmentTurnedIn color="success" />
                        ) : notification.type === 'emergency' ? (
                          <Warning color="error" />
                        ) : (
                          <Notifications color="info" />
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={notification.title}
                        secondary={
                          <>
                            <Typography variant="body2" component="div">
                              {notification.content}
                            </Typography>
                            <Typography variant="caption" component="div" color="text.secondary">
                              {new Date(notification.createdAt).toLocaleString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  暂无通知
                </Typography>
              )}
            </Paper>

            {/* 每日心理小贴士 */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <SelfImprovement sx={{ mr: 1 }} /> 每日心理小贴士
              </Typography>
              
              {dailyTip ? (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {dailyTip.title}
                    </Typography>
                    <Typography variant="body2">
                      {dailyTip.content}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip size="small" label={dailyTip.category} />
                      <Button size="small" color="primary">
                        查看更多
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  今日小贴士加载中...
                </Typography>
              )}
            </Paper>

            {/* 快速操作 */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>快速操作</Typography>
              <Stack spacing={2}>
                <Button 
                  variant="contained" 
                  color="error" 
                  fullWidth 
                  startIcon={<Warning />}
                  onClick={handleEmergencyHelp}
                >
                  发起紧急求助
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  startIcon={<Assignment />}
                  onClick={handleStartNewAssessment}
                >
                  开始新测评
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserHome; 