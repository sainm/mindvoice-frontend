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
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  CalendarMonth as CalendarIcon,
  Event as EventIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { Appointment } from '../types/user.types';
import { 
  getAllAppointments, 
  getAllCounselors, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment 
} from '../services/mockService';

/**
 * 预约咨询管理页面组件
 */
const AppointmentManagement: React.FC = () => {
  // 状态管理
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // 删除对话框状态
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(null);
  
  // 创建/编辑对话框状态
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Partial<Appointment>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // 提示消息状态
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // 咨询师列表
  const [counselors, setCounselors] = useState<{id: number, name: string}[]>([]);

  // 获取所有预约和咨询师
  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsData = await getAllAppointments();
        const counselorsData = await getAllCounselors();
        
        setAppointments(appointmentsData);
        setFilteredAppointments(appointmentsData);
        setCounselors(counselorsData.map(c => ({ id: c.id, name: c.name || c.username })));
        setLoading(false);
      } catch (error) {
        console.error('获取预约列表失败', error);
        setLoading(false);
        showSnackbar('获取预约列表失败', 'error');
      }
    };

    fetchData();
  }, []);

  // 处理搜索和过滤
  useEffect(() => {
    let result = appointments;
    
    // 搜索过滤
    if (searchTerm) {
      result = result.filter(appointment => 
        appointment.counselorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 状态过滤
    if (selectedStatus) {
      result = result.filter(appointment => appointment.status === selectedStatus);
    }
    
    // 类型过滤
    if (selectedType) {
      result = result.filter(appointment => appointment.type === selectedType);
    }
    
    setFilteredAppointments(result);
    setPage(0); // 重置到第一页
  }, [searchTerm, selectedStatus, selectedType, appointments]);

  // 表格分页处理
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 清除筛选
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedType('');
  };

  // 删除预约
  const handleDeleteClick = (id: number) => {
    setAppointmentToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (appointmentToDelete !== null) {
      try {
        const success = deleteAppointment(appointmentToDelete);
        if (success) {
          const updatedAppointments = appointments.filter(
            appointment => appointment.id !== appointmentToDelete
          );
          setAppointments(updatedAppointments);
          showSnackbar('预约已成功删除', 'success');
        } else {
          showSnackbar('删除预约失败', 'error');
        }
      } catch (error) {
        console.error('删除预约出错', error);
        showSnackbar('删除预约出错', 'error');
      }
    }
    setOpenDeleteDialog(false);
    setAppointmentToDelete(null);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setAppointmentToDelete(null);
  };

  // 创建新预约
  const handleCreateAppointment = () => {
    setIsEditing(false);
    setCurrentAppointment({
      userId: 3, // 默认用户ID
      counselorId: counselors[0]?.id,
      counselorName: counselors[0]?.name,
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      status: 'scheduled',
      type: 'online'
    });
    setFormErrors({});
    setOpenFormDialog(true);
  };

  // 编辑预约
  const handleEditAppointment = (id: number) => {
    const appointmentToEdit = appointments.find(a => a.id === id);
    if (appointmentToEdit) {
      setIsEditing(true);
      setCurrentAppointment(appointmentToEdit);
      setFormErrors({});
      setOpenFormDialog(true);
    }
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
        if (isEditing && currentAppointment.id) {
          // 更新现有预约
          const updatedAppointment = updateAppointment(currentAppointment.id, currentAppointment);
          if (updatedAppointment) {
            const updatedAppointments = appointments.map(a => 
              a.id === updatedAppointment.id ? updatedAppointment : a
            );
            setAppointments(updatedAppointments);
            showSnackbar('预约已成功更新', 'success');
          } else {
            showSnackbar('更新预约失败', 'error');
          }
        } else {
          // 创建新预约
          const newAppointment = createAppointment(currentAppointment as Omit<Appointment, 'id'>);
          setAppointments([...appointments, newAppointment]);
          showSnackbar('预约已成功创建', 'success');
        }
        setOpenFormDialog(false);
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
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
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

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
        {/* 页面标题和操作按钮 */}
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
              color: 'primary.main'
            }}
          >
            <CalendarIcon sx={{ mr: 1, fontSize: 32 }} />
            预约咨询管理
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleCreateAppointment}
          >
            新增预约
          </Button>
        </Box>

        {/* 统计卡片 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  总预约数
                </Typography>
                <Typography variant="h4" component="div">
                  {appointments.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  待进行预约
                </Typography>
                <Typography variant="h4" component="div" sx={{ color: 'primary.main' }}>
                  {appointments.filter(a => a.status === 'scheduled').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  已完成预约
                </Typography>
                <Typography variant="h4" component="div" sx={{ color: 'success.main' }}>
                  {appointments.filter(a => a.status === 'completed').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  取消/未出席
                </Typography>
                <Typography variant="h4" component="div" sx={{ color: 'error.main' }}>
                  {appointments.filter(a => ['canceled', 'missed'].includes(a.status)).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 搜索和筛选 */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="搜索咨询师、备注或地点..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearchTerm('')} size="small">
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">按状态筛选</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={selectedStatus}
                  label="按状态筛选"
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <MenuItem value="">全部状态</MenuItem>
                  <MenuItem value="scheduled">已预约</MenuItem>
                  <MenuItem value="completed">已完成</MenuItem>
                  <MenuItem value="canceled">已取消</MenuItem>
                  <MenuItem value="missed">未出席</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="type-filter-label">按类型筛选</InputLabel>
                <Select
                  labelId="type-filter-label"
                  value={selectedType}
                  label="按类型筛选"
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <MenuItem value="">全部类型</MenuItem>
                  <MenuItem value="online">线上咨询</MenuItem>
                  <MenuItem value="offline">线下咨询</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button 
                fullWidth
                variant="outlined" 
                startIcon={<FilterIcon />}
                onClick={handleClearFilters}
              >
                清除筛选
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* 预约列表 */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="预约列表">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>咨询师</TableCell>
                    <TableCell>日期</TableCell>
                    <TableCell>时间</TableCell>
                    <TableCell>类型</TableCell>
                    <TableCell>地点</TableCell>
                    <TableCell>状态</TableCell>
                    <TableCell>备注</TableCell>
                    <TableCell align="center">操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAppointments
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((appointment) => (
                      <TableRow hover key={appointment.id}>
                        <TableCell>{appointment.id}</TableCell>
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
                        <TableCell>{appointment.location || '-'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={getStatusText(appointment.status)} 
                            size="small" 
                            color={getStatusColor(appointment.status)} 
                          />
                        </TableCell>
                        <TableCell>{appointment.notes || '-'}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Tooltip title="编辑">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleEditAppointment(appointment.id)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="删除">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDeleteClick(appointment.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredAppointments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                        没有找到匹配的预约
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAppointments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="每页行数:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} 共 ${count}`}
          />
        </Paper>

        {/* 删除确认对话框 */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteCancel}
        >
          <DialogTitle>确认删除</DialogTitle>
          <DialogContent>
            <DialogContentText>
              您确定要删除这个预约吗？此操作不可逆。
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              取消
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              删除
            </Button>
          </DialogActions>
        </Dialog>

        {/* 创建/编辑预约对话框 */}
        <Dialog
          open={openFormDialog}
          onClose={handleCloseFormDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {isEditing ? '编辑预约' : '创建新预约'}
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
                        {counselor.name}
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
              
              <Grid size={{ xs: 12, sm: 6 }}>
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
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="status-select-label">状态</InputLabel>
                  <Select
                    labelId="status-select-label"
                    name="status"
                    value={currentAppointment.status || 'scheduled'}
                    label="状态"
                    onChange={handleFormChange}
                  >
                    <MenuItem value="scheduled">已预约</MenuItem>
                    <MenuItem value="completed">已完成</MenuItem>
                    <MenuItem value="canceled">已取消</MenuItem>
                    <MenuItem value="missed">未出席</MenuItem>
                  </Select>
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
                  label="备注"
                  name="notes"
                  value={currentAppointment.notes || ''}
                  onChange={handleFormChange}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFormDialog}>
              取消
            </Button>
            <Button onClick={handleSaveAppointment} variant="contained" color="primary">
              保存
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

export default AppointmentManagement; 