import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Alert,
  Snackbar,
  FormHelperText,
  CircularProgress,
  Tab,
  Tabs,
  Avatar,
  Rating,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon, 
  CalendarMonth as CalendarIcon,
  Event as EventIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  InsertInvitation as InvitationIcon,
  VideoCameraFront as VideoCameraIcon,
  MeetingRoom as MeetingRoomIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { Appointment } from '../types/user.types';
import { 
  getUserAppointments, 
  getAllCounselors, 
  createAppointment 
} from '../services/mockService';

// 标签页枚举
enum TabValue {
  UPCOMING = 0,
  HISTORY = 1,
  NEW = 2
}

/**
 * 用户预约咨询页面组件
 */
const Appointments: React.FC = () => {
  // 状态管理
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<TabValue>(TabValue.UPCOMING);
  
  // 创建预约对话框状态
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Partial<Appointment>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // 提示消息状态
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');
  
  // 咨询师列表
  const [counselors, setCounselors] = useState<{id: number, name: string, avatar?: string, speciality?: string}[]>([]);
  
  // 当前用户ID (模拟，实际应从用户会话中获取)
  const currentUserId = 3;

  // 获取用户预约和咨询师列表
  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsData = await getUserAppointments(currentUserId);
        const counselorsData = await getAllCounselors();
        
        setAppointments(appointmentsData);
        // 默认展示即将到来的预约
        setFilteredAppointments(filterAppointmentsByTab(appointmentsData, TabValue.UPCOMING));
        
        // 为咨询师数据添加一些模拟的额外信息
        const enhancedCounselors = counselorsData.map(c => ({ 
          id: c.id, 
          name: c.name || c.username,
          avatar: c.avatar,
          speciality: getRandomSpeciality() // 模拟数据
        }));
        
        setCounselors(enhancedCounselors);
        setLoading(false);
      } catch (error) {
        console.error('获取预约列表失败', error);
        setLoading(false);
        showSnackbar('获取预约列表失败', 'error');
      }
    };

    fetchData();
  }, []);

  // 根据标签页过滤预约
  const filterAppointmentsByTab = (appts: Appointment[], tab: TabValue): Appointment[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (tab) {
      case TabValue.UPCOMING:
        return appts.filter(appt => {
          const apptDate = new Date(appt.date);
          return apptDate >= today && appt.status === 'scheduled';
        });
      case TabValue.HISTORY:
        return appts.filter(appt => {
          const apptDate = new Date(appt.date);
          return apptDate < today || ['completed', 'canceled', 'missed'].includes(appt.status);
        });
      case TabValue.NEW:
        return []; // 新预约标签页不显示预约列表
      default:
        return appts;
    }
  };

  // 处理标签页切换
  const handleTabChange = (event: React.SyntheticEvent, newValue: TabValue) => {
    setCurrentTab(newValue);
    setFilteredAppointments(filterAppointmentsByTab(appointments, newValue));
  };

  // 创建新预约
  const handleCreateAppointment = () => {
    setCurrentAppointment({
      userId: currentUserId,
      counselorId: undefined,
      counselorName: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      status: 'scheduled',
      type: 'online'
    });
    setFormErrors({});
    setOpenFormDialog(true);
  };

  // 表单字段变更
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      // 如果选择了咨询师，同时更新咨询师名称
      if (name === 'counselorId') {
        const selectedCounselor = counselors.find(c => c.id === value);
        setCurrentAppointment({
          ...currentAppointment,
          [name]: value,
          counselorName: selectedCounselor?.name || ''
        });
      } else {
        setCurrentAppointment({
          ...currentAppointment,
          [name]: value
        });
      }
      
      // 清除该字段的错误
      if (formErrors[name]) {
        setFormErrors({
          ...formErrors,
          [name]: ''
        });
      }
    }
  };

  // 验证表单
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!currentAppointment.counselorId) {
      errors.counselorId = '请选择咨询师';
    }
    
    if (!currentAppointment.date) {
      errors.date = '请选择日期';
    } else {
      // 验证日期不能是过去的日期
      const selectedDate = new Date(currentAppointment.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = '不能选择过去的日期';
      }
    }
    
    if (!currentAppointment.startTime) {
      errors.startTime = '请选择开始时间';
    }
    
    if (!currentAppointment.endTime) {
      errors.endTime = '请选择结束时间';
    }
    
    if (currentAppointment.startTime && currentAppointment.endTime && 
        currentAppointment.startTime >= currentAppointment.endTime) {
      errors.endTime = '结束时间必须晚于开始时间';
    }
    
    if (!currentAppointment.type) {
      errors.type = '请选择咨询类型';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 保存预约
  const handleSaveAppointment = () => {
    if (validateForm()) {
      try {
        // 创建新预约
        const newAppointment = createAppointment(currentAppointment as Omit<Appointment, 'id'>);
        setAppointments([...appointments, newAppointment]);
        
        // 如果当前是"即将到来"标签页，更新过滤后的预约列表
        if (currentTab === TabValue.UPCOMING) {
          setFilteredAppointments(filterAppointmentsByTab([...appointments, newAppointment], TabValue.UPCOMING));
        }
        
        showSnackbar('预约已成功创建', 'success');
        setOpenFormDialog(false);
        
        // 切换到即将到来的预约标签页
        setCurrentTab(TabValue.UPCOMING);
        setFilteredAppointments(filterAppointmentsByTab([...appointments, newAppointment], TabValue.UPCOMING));
      } catch (error) {
        console.error('保存预约出错', error);
        showSnackbar('保存预约出错', 'error');
      }
    }
  };

  // 关闭表单对话框
  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
  };

  // 显示提示消息
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // 获取状态标签颜色
  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'canceled':
        return 'error';
      case 'missed':
        return 'warning';
      default:
        return 'default';
    }
  };

  // 获取状态显示文本
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'scheduled':
        return '已预约';
      case 'completed':
        return '已完成';
      case 'canceled':
        return '已取消';
      case 'missed':
        return '未出席';
      default:
        return status;
    }
  };

  // 获取咨询类型显示文本
  const getTypeText = (type: string): string => {
    switch (type) {
      case 'online':
        return '线上';
      case 'offline':
        return '线下';
      default:
        return type;
    }
  };
  
  // 获取随机专业方向（模拟数据）
  const getRandomSpeciality = (): string => {
    const specialities = [
      '抑郁症', '焦虑症', '强迫症', '人际关系', '婚姻家庭', 
      '青少年心理', '职业发展', '情绪管理', '压力管理', '创伤治疗'
    ];
    return specialities[Math.floor(Math.random() * specialities.length)];
  };
  
  // 生成随机评分（模拟数据）
  const getRandomRating = (): number => {
    return 3.5 + Math.random() * 1.5;
  };
  
  // 计算两个日期之间的天数
  const getDaysDifference = (dateString: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(dateString);
    const diffTime = appointmentDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // 渲染即将到来的预约卡片
  const renderUpcomingAppointments = () => {
    if (filteredAppointments.length === 0) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center', mt: 2 }}>
          <Typography variant="body1" color="text.secondary">
            您目前没有即将到来的预约
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleCreateAppointment}
            sx={{ mt: 2 }}
          >
            立即预约
          </Button>
        </Paper>
      );
    }
    
    return (
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {filteredAppointments.map((appointment) => {
          const daysDifference = getDaysDifference(appointment.date);
          
          return (
            <Grid size={{ xs: 12, md: 6 }} key={appointment.id}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        {appointment.counselorName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{appointment.counselorName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {getRandomSpeciality()} 专家
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={daysDifference === 0 ? '今天' : `${daysDifference}天后`} 
                      color={daysDifference <= 1 ? 'error' : daysDifference <= 3 ? 'warning' : 'primary'} 
                      size="small"
                    />
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">
                        {appointment.date}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">
                        {`${appointment.startTime} - ${appointment.endTime}`}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {appointment.type === 'online' ? (
                        <VideoCameraIcon sx={{ mr: 1, color: 'info.main' }} />
                      ) : (
                        <MeetingRoomIcon sx={{ mr: 1, color: 'secondary.main' }} />
                      )}
                      <Typography variant="body1">
                        {getTypeText(appointment.type)} · {appointment.location || '待定'}
                      </Typography>
                    </Box>
                    
                    {appointment.notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        备注: {appointment.notes}
                      </Typography>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small"
                      onClick={() => showSnackbar('取消功能开发中，请联系客服取消预约', 'info')}
                    >
                      取消预约
                    </Button>
                    {appointment.type === 'online' && daysDifference === 0 && (
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="small"
                        sx={{ ml: 1 }}
                        onClick={() => showSnackbar('线上会议功能开发中，即将上线', 'info')}
                      >
                        进入会议
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  // 渲染历史预约表格
  const renderHistoryAppointments = () => {
    if (filteredAppointments.length === 0) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center', mt: 2 }}>
          <Typography variant="body1" color="text.secondary">
            暂无历史预约记录
          </Typography>
        </Paper>
      );
    }
    
    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table aria-label="历史预约表格">
          <TableHead>
            <TableRow>
              <TableCell>咨询师</TableCell>
              <TableCell>日期</TableCell>
              <TableCell>时间</TableCell>
              <TableCell>类型</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>备注</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                    {appointment.counselorName}
                  </Box>
                </TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{`${appointment.startTime} - ${appointment.endTime}`}</TableCell>
                <TableCell>
                  <Chip 
                    label={getTypeText(appointment.type)} 
                    size="small" 
                    color={appointment.type === 'online' ? 'info' : 'secondary'} 
                    variant="outlined" 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getStatusText(appointment.status)} 
                    size="small" 
                    color={getStatusColor(appointment.status)} 
                  />
                </TableCell>
                <TableCell>{appointment.notes || '-'}</TableCell>
                <TableCell align="right">
                  {appointment.status === 'completed' && (
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => showSnackbar('评价功能开发中，即将上线', 'info')}
                    >
                      评价
                    </Button>
                  )}
                  {appointment.status === 'completed' && (
                    <Button 
                      size="small" 
                      variant="outlined"
                      sx={{ ml: 1 }}
                      onClick={() => showSnackbar('预约记录功能开发中，即将上线', 'info')}
                    >
                      查看记录
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // 渲染咨询师选择卡片
  const renderCounselorCards = () => {
    return (
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {counselors.map((counselor) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={counselor.id}>
            <Card 
              sx={{ 
                mb: 2, 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => {
                setCurrentAppointment({
                  ...currentAppointment,
                  counselorId: counselor.id,
                  counselorName: counselor.name
                });
                setOpenFormDialog(true);
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', mr: 2 }}>
                    {counselor.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{counselor.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {counselor.speciality} 专家
                    </Typography>
                    <Rating 
                      value={getRandomRating()} 
                      precision={0.5} 
                      readOnly 
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  拥有多年心理咨询经验，擅长处理各类心理问题，帮助来访者解决心理困扰，提升生活质量。
                </Typography>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  startIcon={<EventAvailableIcon />}
                >
                  预约咨询
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
        {/* 页面标题 */}
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 3
          }}
        >
          <CalendarIcon sx={{ mr: 1, fontSize: 32 }} />
          预约咨询
        </Typography>

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
              icon={<EventAvailableIcon />} 
              label="即将到来的预约" 
              value={TabValue.UPCOMING}
            />
            <Tab 
              icon={<EventBusyIcon />} 
              label="历史预约" 
              value={TabValue.HISTORY}
            />
            <Tab 
              icon={<AddIcon />} 
              label="新预约" 
              value={TabValue.NEW}
            />
          </Tabs>
        </Paper>

        {/* 根据当前标签页显示不同内容 */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {currentTab === TabValue.UPCOMING && renderUpcomingAppointments()}
            {currentTab === TabValue.HISTORY && renderHistoryAppointments()}
            {currentTab === TabValue.NEW && renderCounselorCards()}
          </>
        )}

        {/* 创建预约对话框 */}
        <Dialog
          open={openFormDialog}
          onClose={handleCloseFormDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            预约咨询
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={12}>
                <FormControl fullWidth error={!!formErrors.counselorId}>
                  <InputLabel id="counselor-select-label">咨询师</InputLabel>
                  <Select
                    labelId="counselor-select-label"
                    name="counselorId"
                    value={currentAppointment.counselorId || ''}
                    label="咨询师"
                    onChange={handleFormChange}
                  >
                    {counselors.map((counselor) => (
                      <MenuItem key={counselor.id} value={counselor.id}>
                        {counselor.name} - {counselor.speciality} 专家
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.counselorId && (
                    <FormHelperText>{formErrors.counselorId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="日期"
                  type="date"
                  name="date"
                  value={currentAppointment.date || ''}
                  onChange={handleFormChange}
                  error={!!formErrors.date}
                  helperText={formErrors.date}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="开始时间"
                  type="time"
                  name="startTime"
                  value={currentAppointment.startTime || ''}
                  onChange={handleFormChange}
                  error={!!formErrors.startTime}
                  helperText={formErrors.startTime}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="结束时间"
                  type="time"
                  name="endTime"
                  value={currentAppointment.endTime || ''}
                  onChange={handleFormChange}
                  error={!!formErrors.endTime}
                  helperText={formErrors.endTime}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              <Grid size={12}>
                <FormControl fullWidth error={!!formErrors.type}>
                  <InputLabel id="type-select-label">咨询类型</InputLabel>
                  <Select
                    labelId="type-select-label"
                    name="type"
                    value={currentAppointment.type || ''}
                    label="咨询类型"
                    onChange={handleFormChange}
                  >
                    <MenuItem value="online">线上咨询</MenuItem>
                    <MenuItem value="offline">线下咨询</MenuItem>
                  </Select>
                  {formErrors.type && (
                    <FormHelperText>{formErrors.type}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="地点"
                  name="location"
                  value={currentAppointment.location || ''}
                  onChange={handleFormChange}
                  placeholder={currentAppointment.type === 'online' ? '例如：线上会议室1' : '例如：心理咨询室2号'}
                />
              </Grid>
              
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="备注 (选填)"
                  name="notes"
                  value={currentAppointment.notes || ''}
                  onChange={handleFormChange}
                  multiline
                  rows={3}
                  placeholder="请描述您希望咨询的问题或需要特别说明的事项"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFormDialog}>
              取消
            </Button>
            <Button onClick={handleSaveAppointment} variant="contained" color="primary">
              确认预约
            </Button>
          </DialogActions>
        </Dialog>

        {/* 提示消息 */}
        <Snackbar 
          open={openSnackbar} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbarSeverity} 
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </MainLayout>
  );
};

export default Appointments; 