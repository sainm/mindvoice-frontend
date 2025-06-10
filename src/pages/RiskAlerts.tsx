import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid as MuiGrid,
  Card,
  CardContent,
  Tab,
  Tabs,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Avatar,
  IconButton,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import {
  Warning as WarningIcon,
  ErrorOutline as ErrorOutlineIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  MedicalServices as MedicalServicesIcon,
  Event as EventIcon,
  Message as MessageIcon,
  Phone as PhoneIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  PriorityHigh as PriorityHighIcon,
  NotificationsActive as NotificationsActiveIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { RiskAlert, RiskLevel, RiskType, RiskAlertStatus, UserRole } from '../types/user.types';
import { getCounselorRiskAlerts, createRiskAlert, getAllCounselors } from '../services/mockService';

// 创建一个没有TypeScript错误的Grid组件
const Grid = MuiGrid;

// 标签页枚举
enum TabValue {
  ALL = 0,
  PENDING = 1,
  IN_PROGRESS = 2,
  RESOLVED = 3
}

/**
 * 高风险预警页面组件
 */
const RiskAlerts: React.FC = () => {
  // 状态管理
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<TabValue>(TabValue.ALL);
  
  // 创建预警对话框状态
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newAlert, setNewAlert] = useState<Partial<RiskAlert>>({
    counselorId: 0,
    counselorName: '',
    userId: 0,
    userName: '',
    riskLevel: RiskLevel.MEDIUM,
    riskType: RiskType.OTHER,
    description: '',
    status: RiskAlertStatus.PENDING,
    triggerSource: '人工标记'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // 当前咨询师ID (模拟，实际应从用户会话中获取)
  const currentCounselorId = 2;
  const currentCounselorName = '王医生'; // 模拟当前咨询师姓名

  // 获取咨询师的风险预警
  useEffect(() => {
    const fetchData = async () => {
      try {
        const alertsData = await getCounselorRiskAlerts(currentCounselorId);
        setRiskAlerts(alertsData);
        setFilteredAlerts(alertsData);
        setLoading(false);
      } catch (error) {
        console.error('获取风险预警列表失败', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 处理标签页切换
  const handleTabChange = (event: React.SyntheticEvent, newValue: TabValue) => {
    setCurrentTab(newValue);
    filterAlerts(newValue);
  };

  // 根据标签页过滤风险预警
  const filterAlerts = (tab: TabValue) => {
    switch (tab) {
      case TabValue.PENDING:
        setFilteredAlerts(riskAlerts.filter(alert => alert.status === RiskAlertStatus.PENDING));
        break;
      case TabValue.IN_PROGRESS:
        setFilteredAlerts(riskAlerts.filter(alert => alert.status === RiskAlertStatus.IN_PROGRESS));
        break;
      case TabValue.RESOLVED:
        setFilteredAlerts(riskAlerts.filter(alert => 
          alert.status === RiskAlertStatus.RESOLVED || 
          alert.status === RiskAlertStatus.DISMISSED
        ));
        break;
      default:
        setFilteredAlerts(riskAlerts);
        break;
    }
  };

  // 获取风险等级对应的颜色和图标
  const getRiskLevelInfo = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.CRITICAL:
        return { color: 'error', icon: <ErrorOutlineIcon color="error" />, text: '紧急风险' };
      case RiskLevel.HIGH:
        return { color: 'error', icon: <WarningIcon color="error" />, text: '高风险' };
      case RiskLevel.MEDIUM:
        return { color: 'warning', icon: <WarningIcon color="warning" />, text: '中等风险' };
      case RiskLevel.LOW:
        return { color: 'info', icon: <WarningIcon color="info" />, text: '低风险' };
      default:
        return { color: 'default', icon: <WarningIcon />, text: '未知风险' };
    }
  };

  // 获取状态对应的颜色和文本
  const getStatusInfo = (status: RiskAlertStatus) => {
    switch (status) {
      case RiskAlertStatus.PENDING:
        return { color: 'error', text: '待处理' };
      case RiskAlertStatus.IN_PROGRESS:
        return { color: 'warning', text: '处理中' };
      case RiskAlertStatus.RESOLVED:
        return { color: 'success', text: '已解决' };
      case RiskAlertStatus.DISMISSED:
        return { color: 'default', text: '已忽略' };
      default:
        return { color: 'default', text: '未知状态' };
    }
  };

  // 获取风险类型对应的文本
  const getRiskTypeText = (type: string): string => {
    switch (type) {
      case 'SUICIDE':
        return '自杀风险';
      case 'SELF_HARM':
        return '自伤风险';
      case 'VIOLENCE':
        return '暴力风险';
      case 'SUBSTANCE_ABUSE':
        return '药物滥用';
      case 'SEVERE_DEPRESSION':
        return '严重抑郁';
      case 'SEVERE_ANXIETY':
        return '严重焦虑';
      case 'OTHER':
        return '其他风险';
      default:
        return type;
    }
  };

  // 格式化日期时间
  const formatDateTime = (dateTimeString: string): string => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 修复处理查看详情
  const handleViewDetails = (id: number) => {
    window.alert(`查看ID为${id}的风险预警详情功能开发中`);
  };

  // 修复处理编辑
  const handleEdit = (id: number) => {
    window.alert(`编辑ID为${id}的风险预警功能开发中`);
  };

  // 修复处理联系患者
  const handleContactPatient = (id: number) => {
    window.alert(`联系患者功能开发中`);
  };

  // 处理表单字段变更
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setNewAlert({
        ...newAlert,
        [name]: value
      });
      
      // 清除该字段的错误
      if (formErrors[name]) {
        setFormErrors({
          ...formErrors,
          [name]: ''
        });
      }
    }
  };

  // 打开创建预警对话框
  const handleOpenCreateDialog = () => {
    setNewAlert({
      ...newAlert,
      counselorId: currentCounselorId,
      counselorName: currentCounselorName
    });
    setFormErrors({});
    setOpenCreateDialog(true);
  };

  // 关闭创建预警对话框
  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  // 验证表单
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!newAlert.userId) {
      errors.userId = '请输入患者ID';
    }
    
    if (!newAlert.userName) {
      errors.userName = '请输入患者姓名';
    }
    
    if (!newAlert.description) {
      errors.description = '请输入风险描述';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 修复创建新预警
  const handleCreateAlert = () => {
    if (validateForm()) {
      try {
        const createdAlert = createRiskAlert(newAlert as Omit<RiskAlert, 'id'>);
        setRiskAlerts([...riskAlerts, createdAlert]);
        filterAlerts(currentTab);
        setOpenCreateDialog(false);
        window.alert('风险预警创建成功');
      } catch (error) {
        console.error('创建风险预警失败', error);
        window.alert('创建风险预警失败');
      }
    }
  };

  // 渲染风险预警卡片
  const renderRiskAlertCards = () => {
    if (filteredAlerts.length === 0) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center', mt: 2 }}>
          <Typography variant="body1" color="text.secondary">
            暂无风险预警记录
          </Typography>
        </Paper>
      );
    }

    return (
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {filteredAlerts.map((alert) => {
          const riskLevelInfo = getRiskLevelInfo(alert.riskLevel);
          const statusInfo = getStatusInfo(alert.status);
          
          return (
            <Grid item xs={12} md={6} key={alert.id}>
              <Card 
                sx={{ 
                  mb: 2,
                  height: 350, // 固定高度
                  width: '100%', // 确保宽度100%
                  display: 'flex',
                  flexDirection: 'column',
                  border: alert.riskLevel === RiskLevel.CRITICAL ? '1px solid #f44336' : 'none',
                  boxShadow: alert.riskLevel === RiskLevel.CRITICAL ? '0 0 10px rgba(244, 67, 54, 0.5)' : undefined
                }}
              >
                <CardContent sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: 2 // 统一内边距
                }}>
                  {/* 头部：风险等级和状态 */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {riskLevelInfo.icon}
                      <Typography
                        variant="subtitle1"
                        color={`${riskLevelInfo.color}.main`}
                        sx={{ ml: 1, fontWeight: 'bold' }}
                      >
                        {riskLevelInfo.text}
                      </Typography>
                      <Chip
                        label={getRiskTypeText(alert.riskType)}
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                    <Chip
                      label={statusInfo.text}
                      color={statusInfo.color as any}
                      size="small"
                    />
                  </Box>

                  {/* 患者信息 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {alert.userName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{alert.userName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        患者ID: {alert.userId}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* 风险描述 - 添加溢出处理 */}
                  <Box sx={{ mb: 2, overflow: 'hidden', flex: 1 }}>
                    <Typography variant="body1" sx={{ 
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {alert.description}
                    </Typography>
                  </Box>

                  {/* 其他信息 */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip
                      icon={<EventIcon fontSize="small" />}
                      label={`创建于: ${formatDateTime(alert.createdAt)}`}
                      variant="outlined"
                      size="small"
                    />
                    {alert.triggerSource && (
                      <Chip
                        icon={<AssignmentIcon fontSize="small" />}
                        label={`来源: ${alert.triggerSource}`}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Box>

                  {/* 已采取的行动 - 添加溢出处理 */}
                  {alert.actionTaken && (
                    <Box sx={{ mb: 2, overflow: 'hidden' }}>
                      <Typography variant="body2" color="text.secondary">
                        已采取的行动:
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {alert.actionTaken}
                      </Typography>
                    </Box>
                  )}

                  {/* 操作按钮 */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
                    {alert.status === RiskAlertStatus.PENDING && (
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="small"
                        startIcon={<MedicalServicesIcon />}
                        onClick={() => handleEdit(alert.id)}
                        sx={{ mr: 1 }}
                      >
                        开始处理
                      </Button>
                    )}
                    <Tooltip title="联系患者">
                      <IconButton 
                        color="primary"
                        onClick={() => handleContactPatient(alert.id)}
                      >
                        <PhoneIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="发送消息">
                      <IconButton 
                        color="primary"
                        onClick={() => window.alert('发送消息功能开发中')}
                      >
                        <MessageIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="查看详情">
                      <IconButton 
                        onClick={() => handleViewDetails(alert.id)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="编辑">
                      <IconButton 
                        onClick={() => handleEdit(alert.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
        {/* 页面标题 */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontWeight: 'bold',
              color: 'error.main'
            }}
          >
            <ErrorOutlineIcon sx={{ mr: 1, fontSize: 32 }} />
            高风险预警
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleOpenCreateDialog}
            startIcon={<NotificationsActiveIcon />}
          >
            创建预警
          </Button>
        </Box>

        {/* 统计卡片 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  总风险预警
                </Typography>
                <Typography variant="h4" component="div">
                  {riskAlerts.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  待处理
                </Typography>
                <Typography variant="h4" component="div" sx={{ color: 'error.main' }}>
                  {riskAlerts.filter(alert => alert.status === RiskAlertStatus.PENDING).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  处理中
                </Typography>
                <Typography variant="h4" component="div" sx={{ color: 'warning.main' }}>
                  {riskAlerts.filter(alert => alert.status === RiskAlertStatus.IN_PROGRESS).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  已解决/忽略
                </Typography>
                <Typography variant="h4" component="div" sx={{ color: 'success.main' }}>
                  {riskAlerts.filter(alert => 
                    alert.status === RiskAlertStatus.RESOLVED || 
                    alert.status === RiskAlertStatus.DISMISSED
                  ).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 标签页 */}
        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab 
              icon={<WarningIcon />} 
              label="全部预警" 
              value={TabValue.ALL}
            />
            <Tab 
              icon={<Badge 
                badgeContent={riskAlerts.filter(alert => alert.status === RiskAlertStatus.PENDING).length} 
                color="error"
              >
                <HourglassEmptyIcon />
              </Badge>} 
              label="待处理" 
              value={TabValue.PENDING}
            />
            <Tab 
              icon={<MedicalServicesIcon />} 
              label="处理中" 
              value={TabValue.IN_PROGRESS}
            />
            <Tab 
              icon={<CheckCircleIcon />} 
              label="已解决" 
              value={TabValue.RESOLVED}
            />
          </Tabs>
        </Paper>

        {/* 主要内容 */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                找到 {filteredAlerts.length} 条风险预警记录
              </Typography>
            </Box>
            {renderRiskAlertCards()}
          </Box>
        )}

        {/* 创建预警对话框 */}
        <Dialog
          open={openCreateDialog}
          onClose={handleCloseCreateDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>创建风险预警</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  咨询师信息
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="咨询师ID"
                  value={newAlert.counselorId || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="咨询师姓名"
                  value={newAlert.counselorName || ''}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  患者信息
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="患者ID"
                  name="userId"
                  type="number"
                  value={newAlert.userId || ''}
                  onChange={handleFormChange}
                  error={!!formErrors.userId}
                  helperText={formErrors.userId}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="患者姓名"
                  name="userName"
                  value={newAlert.userName || ''}
                  onChange={handleFormChange}
                  error={!!formErrors.userName}
                  helperText={formErrors.userName}
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  风险信息
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="risk-level-label">风险等级</InputLabel>
                  <Select
                    labelId="risk-level-label"
                    name="riskLevel"
                    value={newAlert.riskLevel || ''}
                    label="风险等级"
                    onChange={handleFormChange as any}
                  >
                    <MenuItem value={RiskLevel.LOW}>低风险</MenuItem>
                    <MenuItem value={RiskLevel.MEDIUM}>中等风险</MenuItem>
                    <MenuItem value={RiskLevel.HIGH}>高风险</MenuItem>
                    <MenuItem value={RiskLevel.CRITICAL}>紧急风险</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="risk-type-label">风险类型</InputLabel>
                  <Select
                    labelId="risk-type-label"
                    name="riskType"
                    value={newAlert.riskType || ''}
                    label="风险类型"
                    onChange={handleFormChange as any}
                  >
                    <MenuItem value={RiskType.SUICIDE}>自杀风险</MenuItem>
                    <MenuItem value={RiskType.SELF_HARM}>自伤风险</MenuItem>
                    <MenuItem value={RiskType.VIOLENCE}>暴力风险</MenuItem>
                    <MenuItem value={RiskType.SUBSTANCE_ABUSE}>药物滥用</MenuItem>
                    <MenuItem value={RiskType.SEVERE_DEPRESSION}>严重抑郁</MenuItem>
                    <MenuItem value={RiskType.SEVERE_ANXIETY}>严重焦虑</MenuItem>
                    <MenuItem value={RiskType.OTHER}>其他风险</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="风险描述"
                  name="description"
                  value={newAlert.description || ''}
                  onChange={handleFormChange}
                  multiline
                  rows={4}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  placeholder="请详细描述患者表现出的风险行为、言论或症状"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="trigger-source-label">预警来源</InputLabel>
                  <Select
                    labelId="trigger-source-label"
                    name="triggerSource"
                    value={newAlert.triggerSource || ''}
                    label="预警来源"
                    onChange={handleFormChange as any}
                  >
                    <MenuItem value="评测结果">评测结果</MenuItem>
                    <MenuItem value="咨询记录">咨询记录</MenuItem>
                    <MenuItem value="人工标记">人工标记</MenuItem>
                    <MenuItem value="定期评估">定期评估</MenuItem>
                    <MenuItem value="系统监测">系统监测</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreateDialog}>取消</Button>
            <Button 
              onClick={handleCreateAlert} 
              variant="contained" 
              color="primary"
              startIcon={<WarningIcon />}
            >
              创建预警
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
};

export default RiskAlerts; 