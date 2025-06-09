import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueFormatter } from '@mui/x-data-grid';
import { User, UserRole, UserStatus } from '../types/user.types';
import { getUsers, createUser, updateUser, deleteUser, updateUserStatus, resetUserPassword, getUserStats } from '../services/userService';
import { isAdmin } from '../services/authService';
import UserForm from '../components/user/UserForm';
import MainLayout from '../components/layout/MainLayout';
// import ClientForm from '../components/client/ClientForm';

// 用户状态标签映射
const userStatusMap = {
  [UserStatus.ACTIVE]: { label: '活跃', color: 'success.main' },
  [UserStatus.INACTIVE]: { label: '非活跃', color: 'warning.main' },
  [UserStatus.BLOCKED]: { label: '已封禁', color: 'error.main' }
};

// 用户统计卡片组件
const ClientStatsCard = ({ title, count, icon, color }: { title: string; count: number; icon: React.ReactNode; color: string }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          backgroundColor: color,
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            width: 56,
            height: 56,
            backgroundColor: `${color}22`,
            mr: 2
          }}
        >
          {icon}
        </Box>
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold">
            {count}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// 定义来访者管理页面组件
const ClientManagement: React.FC = () => {
  const theme = useTheme();
  
  // 状态定义
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(15);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [clientStats, setClientStats] = useState<any>(null);
  const [tabValue, setTabValue] = useState<number>(0);
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState<boolean>(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState<boolean>(false);
  
  // 检查是否有管理员权限
  const hasAdminAccess = isAdmin();
  
  // 加载来访者统计信息
  const loadClientStats = async () => {
    try {
      const stats = await getUserStats();
      // 只保留普通用户的统计
      setClientStats({
        totalUsers: stats.usersByRole[UserRole.USER] || 0,
        activeUsers: stats.activeUsers,
        inactiveUsers: stats.inactiveUsers,
        blockedUsers: stats.blockedUsers
      });
    } catch (error) {
      console.error('加载来访者统计信息失败', error);
    }
  };
  
  // 加载来访者列表
  const loadClients = async () => {
    setLoading(true);
    try {
      // 构建筛选条件
      const filters: any = {
        role: UserRole.USER // 只筛选普通用户/来访者
      };
      
      if (statusFilter) {
        filters.status = parseInt(statusFilter);
      }
      
      if (searchTerm) {
        filters.searchTerm = searchTerm;
      }
      
      // 根据选项卡设置状态筛选
      if (tabValue === 1) {
        filters.status = UserStatus.ACTIVE;
      } else if (tabValue === 2) {
        filters.status = UserStatus.INACTIVE;
      } else if (tabValue === 3) {
        filters.status = UserStatus.BLOCKED;
      }
      
      // 调用API获取用户列表
      const result = await getUsers(page + 1, pageSize, filters);
      setClients(result.users);
      setTotal(result.total);
    } catch (error) {
      console.error('加载来访者列表失败', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 首次加载和筛选条件变化时重新加载数据
  useEffect(() => {
    loadClients();
    loadClientStats();
  }, [page, pageSize, tabValue]);
  
  // 处理搜索
  const handleSearch = () => {
    setPage(0);
    loadClients();
  };
  
  // 处理重置搜索
  const handleResetSearch = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPage(0);
    loadClients();
  };
  
  // 处理添加来访者
  const handleAddClient = () => {
    setSelectedClient(null);
    setIsFormOpen(true);
  };
  
  // 处理编辑来访者
  const handleEditClient = (client: User) => {
    setSelectedClient(client);
    setIsFormOpen(true);
  };
  
  // 处理删除来访者
  const handleDeleteClient = (client: User) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };
  
  // 确认删除来访者
  const confirmDeleteClient = async () => {
    if (!selectedClient) return;
    
    try {
      await deleteUser(selectedClient.id);
      setIsDeleteDialogOpen(false);
      loadClients();
      loadClientStats();
    } catch (error) {
      console.error('删除来访者失败', error);
    }
  };
  
  // 处理重置密码
  const handleResetPassword = (client: User) => {
    setSelectedClient(client);
    setNewPassword('');
    setIsResetPasswordDialogOpen(true);
  };
  
  // 确认重置密码
  const confirmResetPassword = async () => {
    if (!selectedClient || !newPassword) return;
    
    try {
      await resetUserPassword(selectedClient.id, newPassword);
      setIsResetPasswordDialogOpen(false);
    } catch (error) {
      console.error('重置密码失败', error);
    }
  };
  
  // 保存来访者信息
  const handleSaveClient = async (clientData: Partial<User>) => {
    try {
      if (selectedClient) {
        // 更新来访者
        await updateUser(selectedClient.id, clientData);
      } else {
        // 创建新来访者，确保角色为普通用户
        await createUser({ ...clientData, role: UserRole.USER });
      }
      
      setIsFormOpen(false);
      loadClients();
      loadClientStats();
    } catch (error) {
      console.error('保存来访者失败', error);
    }
  };
  
  // 处理来访者状态变更
  const handleChangeClientStatus = async (clientId: number, newStatus: UserStatus) => {
    try {
      await updateUserStatus(clientId, newStatus);
      loadClients();
      loadClientStats();
    } catch (error) {
      console.error('更新来访者状态失败', error);
    }
  };
  
  // 处理选项卡变更
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(0);
  };
  
  // 日期格式化
  const dateFormatter: GridValueFormatter = (params: any) => {
    if (!params.value) return '';
    const date = new Date(params.value);
    return date.toLocaleString('zh-CN');
  };

  // 处理分配测评
  const handleAssignAssessment = (client: User) => {
    setSelectedClient(client);
    setAssessmentDialogOpen(true);
  };

  // 处理预约管理
  const handleManageAppointments = (client: User) => {
    setSelectedClient(client);
    setAppointmentDialogOpen(true);
  };
  
  // 定义表格列
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70
    },
    {
      field: 'username',
      headerName: '用户名',
      width: 120
    },
    {
      field: 'name',
      headerName: '姓名',
      width: 120,
      valueGetter: (params) => params.row.name || '未设置'
    },
    {
      field: 'email',
      headerName: '邮箱',
      width: 180,
      valueGetter: (params) => params.row.email || '未设置'
    },
    {
      field: 'phone',
      headerName: '手机号',
      width: 140,
      valueGetter: (params) => params.row.phone || '未设置'
    },
    {
      field: 'status',
      headerName: '状态',
      width: 100,
      renderCell: (params) => {
        const status = params.value as UserStatus;
        return (
          <Box
            sx={{
              backgroundColor: userStatusMap[status]?.color || 'grey.500',
              color: 'white',
              borderRadius: 1,
              px: 1,
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}
          >
            {userStatusMap[status]?.label || '未知'}
          </Box>
        );
      }
    },
    {
      field: 'lastLoginTime',
      headerName: '最近登录',
      width: 160,
      valueFormatter: dateFormatter
    },
    {
      field: 'createdAt',
      headerName: '创建时间',
      width: 160,
      valueFormatter: dateFormatter
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 240,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEditClient(params.row as User)}
            title="编辑"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteClient(params.row as User)}
            title="删除"
            disabled={!hasAdminAccess}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          
          <IconButton
            size="small"
            color="secondary"
            onClick={() => handleResetPassword(params.row as User)}
            title="重置密码"
          >
            <LockIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            color="info"
            onClick={() => handleAssignAssessment(params.row as User)}
            title="分配测评"
          >
            <AssessmentIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            color="success"
            onClick={() => handleManageAppointments(params.row as User)}
            title="预约管理"
          >
            <EventIcon fontSize="small" />
          </IconButton>
        </Stack>
      )
    }
  ];
  
  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          来访者管理
        </Typography>
        
        {/* 统计卡片 */}
        {clientStats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <ClientStatsCard
                title="来访者总数"
                count={clientStats.totalUsers}
                icon={<PersonIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ClientStatsCard
                title="活跃来访者"
                count={clientStats.activeUsers}
                icon={<PersonIcon sx={{ fontSize: 32, color: theme.palette.success.main }} />}
                color={theme.palette.success.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ClientStatsCard
                title="非活跃来访者"
                count={clientStats.inactiveUsers}
                icon={<PersonIcon sx={{ fontSize: 32, color: theme.palette.warning.main }} />}
                color={theme.palette.warning.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ClientStatsCard
                title="已封禁来访者"
                count={clientStats.blockedUsers}
                icon={<PersonIcon sx={{ fontSize: 32, color: theme.palette.error.main }} />}
                color={theme.palette.error.main}
              />
            </Grid>
          </Grid>
        )}
        
        {/* 筛选工具栏 */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="搜索来访者"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>状态筛选</InputLabel>
                <Select
                  value={statusFilter}
                  label="状态筛选"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">全部</MenuItem>
                  <MenuItem value={UserStatus.ACTIVE.toString()}>活跃</MenuItem>
                  <MenuItem value={UserStatus.INACTIVE.toString()}>非活跃</MenuItem>
                  <MenuItem value={UserStatus.BLOCKED.toString()}>已封禁</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={5}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleResetSearch}
                >
                  重置
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                >
                  搜索
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddClient}
                >
                  添加来访者
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
        
        {/* 选项卡 */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="全部来访者" />
            <Tab label="活跃来访者" />
            <Tab label="非活跃来访者" />
            <Tab label="已封禁来访者" />
          </Tabs>
        </Box>
        
        {/* 数据表格 */}
        <Paper sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={clients}
            columns={columns}
            pagination
            rowCount={total}
            loading={loading}
            pageSizeOptions={[15, 25, 50]}
            paginationModel={{ page, pageSize }}
            paginationMode="server"
            onPaginationModelChange={(model) => {
              setPage(model.page);
              setPageSize(model.pageSize);
            }}
            disableRowSelectionOnClick
            localeText={{
              noRowsLabel: '没有数据',
              footerRowSelected: (count) => `已选择 ${count} 行`
            }}
          />
        </Paper>
        
        {/* 来访者表单对话框 */}
        <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedClient ? '编辑来访者' : '添加来访者'}
          </DialogTitle>
          <DialogContent>
            <UserForm
              user={selectedClient}
              onSave={handleSaveClient}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
        
        {/* 删除确认对话框 */}
        <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
          <DialogTitle>确认删除</DialogTitle>
          <DialogContent>
            <DialogContentText>
              确定要删除来访者 "{selectedClient?.name || selectedClient?.username}" 吗？此操作无法撤销。
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>取消</Button>
            <Button onClick={confirmDeleteClient} color="error">
              删除
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* 重置密码对话框 */}
        <Dialog open={isResetPasswordDialogOpen} onClose={() => setIsResetPasswordDialogOpen(false)}>
          <DialogTitle>重置密码</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              为来访者 "{selectedClient?.name || selectedClient?.username}" 设置新密码：
            </DialogContentText>
            <TextField
              autoFocus
              fullWidth
              label="新密码"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsResetPasswordDialogOpen(false)}>取消</Button>
            <Button
              onClick={confirmResetPassword}
              color="primary"
              disabled={!newPassword}
            >
              确认重置
            </Button>
          </DialogActions>
        </Dialog>

        {/* 分配测评对话框 */}
        <Dialog open={assessmentDialogOpen} onClose={() => setAssessmentDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>分配测评给 {selectedClient?.name || selectedClient?.username}</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              在此处可以为来访者分配心理测评任务
            </Typography>
            {/* 这里将来添加测评分配表单 */}
            <Typography variant="body1">测评分配功能正在开发中...</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssessmentDialogOpen(false)}>关闭</Button>
          </DialogActions>
        </Dialog>

        {/* 预约管理对话框 */}
        <Dialog open={appointmentDialogOpen} onClose={() => setAppointmentDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>管理 {selectedClient?.name || selectedClient?.username} 的预约</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              在此处可以查看和管理来访者的咨询预约
            </Typography>
            {/* 这里将来添加预约管理表单 */}
            <Typography variant="body1">预约管理功能正在开发中...</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAppointmentDialogOpen(false)}>关闭</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
};

export default ClientManagement; 