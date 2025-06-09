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
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueFormatter } from '@mui/x-data-grid';
import { User, UserRole, UserStatus } from '../types/user.types';
import { getUsers, createUser, updateUser, deleteUser, updateUserStatus, resetUserPassword, getUserStats } from '../services/userService';
import { isAdmin } from '../services/authService';
import UserForm from '../components/user/UserForm';
import MainLayout from '../components/layout/MainLayout';

// 用户状态标签映射
const userStatusMap = {
  [UserStatus.ACTIVE]: { label: '活跃', color: 'success.main' },
  [UserStatus.INACTIVE]: { label: '非活跃', color: 'warning.main' },
  [UserStatus.BLOCKED]: { label: '已封禁', color: 'error.main' }
};

// 用户角色标签映射
const userRoleMap = {
  [UserRole.ADMIN]: { label: '管理员', color: 'primary.main' },
  [UserRole.COUNSELOR]: { label: '心理咨询师', color: 'secondary.main' },
  [UserRole.USER]: { label: '普通用户', color: 'info.main' }
};

// 用户统计卡片组件
const UserStatsCard = ({ title, count, icon, color }: { title: string; count: number; icon: string; color: string }) => {
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
          <Typography component="span" sx={{ fontSize: 32, color }}>
            {icon === 'people' && '👥'}
            {icon === 'check_circle' && '✅'}
            {icon === 'warning' && '⚠️'}
            {icon === 'block' && '🚫'}
          </Typography>
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

// 定义用户管理页面组件
const UserManagement: React.FC = () => {
  const theme = useTheme();
  
  // 状态定义
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(15);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [userStats, setUserStats] = useState<any>(null);
  const [tabValue, setTabValue] = useState<number>(0);
  
  // 检查是否有管理员权限
  const hasAdminAccess = isAdmin();
  
  // 加载用户统计信息
  const loadUserStats = async () => {
    try {
      const stats = await getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error('加载用户统计信息失败', error);
    }
  };
  
  // 加载用户列表
  const loadUsers = async () => {
    setLoading(true);
    try {
      // 构建筛选条件
      const filters: any = {};
      
      if (roleFilter) {
        filters.role = roleFilter;
      }
      
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
      setUsers(result.users);
      setTotal(result.total);
    } catch (error) {
      console.error('加载用户列表失败', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 首次加载和筛选条件变化时重新加载数据
  useEffect(() => {
    loadUsers();
    loadUserStats();
  }, [page, pageSize, tabValue]);
  
  // 处理搜索
  const handleSearch = () => {
    setPage(0);
    loadUsers();
  };
  
  // 处理重置搜索
  const handleResetSearch = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('');
    setPage(0);
    loadUsers();
  };
  
  // 处理添加用户
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };
  
  // 处理编辑用户
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };
  
  // 处理删除用户
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };
  
  // 确认删除用户
  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser(selectedUser.id);
      setIsDeleteDialogOpen(false);
      loadUsers();
      loadUserStats();
    } catch (error) {
      console.error('删除用户失败', error);
    }
  };
  
  // 处理重置密码
  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setNewPassword('');
    setIsResetPasswordDialogOpen(true);
  };
  
  // 确认重置密码
  const confirmResetPassword = async () => {
    if (!selectedUser || !newPassword) return;
    
    try {
      await resetUserPassword(selectedUser.id, newPassword);
      setIsResetPasswordDialogOpen(false);
    } catch (error) {
      console.error('重置密码失败', error);
    }
  };
  
  // 处理保存用户
  const handleSaveUser = async (userData: Partial<User>) => {
    try {
      if (selectedUser) {
        // 更新用户
        await updateUser(selectedUser.id, userData);
      } else {
        // 创建用户
        await createUser(userData);
      }
      
      setIsFormOpen(false);
      loadUsers();
      loadUserStats();
    } catch (error) {
      console.error('保存用户失败', error);
    }
  };
  
  // 处理更改用户状态
  const handleChangeUserStatus = async (userId: number, newStatus: UserStatus) => {
    try {
      await updateUserStatus(userId, newStatus);
      loadUsers();
      loadUserStats();
    } catch (error) {
      console.error('更改用户状态失败', error);
    }
  };
  
  // 处理标签页变化
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // 日期格式化函数
  const dateFormatter: GridValueFormatter = (params: any) => {
    if (!params.value) return '-';
    return new Date(params.value as string).toLocaleString();
  };
  
  // 定义表格列
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: '用户名', width: 120 },
    { field: 'name', headerName: '姓名', width: 120 },
    { field: 'email', headerName: '邮箱', width: 200, flex: 1 },
    { field: 'phone', headerName: '电话', width: 130 },
    {
      field: 'role',
      headerName: '角色',
      width: 130,
      renderCell: (params: GridRenderCellParams<User>) => {
        const role = params.value as UserRole;
        const roleInfo = userRoleMap[role];
        
        return (
          <Typography
            variant="body2"
            sx={{
              color: roleInfo.color,
              fontWeight: 'medium'
            }}
          >
            {roleInfo.label}
          </Typography>
        );
      }
    },
    {
      field: 'status',
      headerName: '状态',
      width: 100,
      renderCell: (params: GridRenderCellParams<User>) => {
        const status = params.value as UserStatus;
        const statusInfo = userStatusMap[status];
        
        return (
          <Typography
            variant="body2"
            sx={{
              color: statusInfo.color,
              fontWeight: 'medium'
            }}
          >
            {statusInfo.label}
          </Typography>
        );
      }
    },
    {
      field: 'lastLoginTime',
      headerName: '最后登录',
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
      width: 180,
      sortable: false,
      renderCell: (params: GridRenderCellParams<User>) => {
        const user = params.row as User;
        
        return (
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEditUser(user)}
              disabled={!hasAdminAccess}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            
            <IconButton
              size="small"
              color="secondary"
              onClick={() => handleResetPassword(user)}
              disabled={!hasAdminAccess}
            >
              <LockIcon fontSize="small" />
            </IconButton>
            
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteUser(user)}
              disabled={!hasAdminAccess || user.id === 1} // 防止删除主管理员
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        );
      }
    }
  ];
  
  return (
    <MainLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Container maxWidth="xl" sx={{ mt: 2, mb: 2, display: 'flex', flexDirection: 'column' }}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: theme.shadows[3],
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #3f51b5, #2196f3, #00bcd4, #009688)',
              }
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              用户管理
            </Typography>
            
            {/* 用户统计信息 */}
            {userStats && (
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={3}>
                  <UserStatsCard
                    title="总用户数"
                    count={userStats.totalUsers}
                    icon="people"
                    color="#3f51b5"
                  />
                </Grid>
                <Grid size={3}>
                  <UserStatsCard
                    title="活跃用户"
                    count={userStats.activeUsers}
                    icon="check_circle"
                    color="#4caf50"
                  />
                </Grid>
                <Grid size={3}>
                  <UserStatsCard
                    title="非活跃用户"
                    count={userStats.inactiveUsers}
                    icon="warning"
                    color="#ff9800"
                  />
                </Grid>
                <Grid size={3}>
                  <UserStatsCard
                    title="已封禁用户"
                    count={userStats.blockedUsers}
                    icon="block"
                    color="#f44336"
                  />
                </Grid>
              </Grid>
            )}
            
            {/* 筛选工具栏 */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="搜索用户"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={handleSearch}>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                
                <Grid size={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>角色</InputLabel>
                    <Select
                      value={roleFilter}
                      label="角色"
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <MenuItem value="">全部</MenuItem>
                      <MenuItem value={UserRole.ADMIN}>管理员</MenuItem>
                      <MenuItem value={UserRole.COUNSELOR}>心理咨询师</MenuItem>
                      <MenuItem value={UserRole.USER}>普通用户</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid size={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>状态</InputLabel>
                    <Select
                      value={statusFilter}
                      label="状态"
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <MenuItem value="">全部</MenuItem>
                      <MenuItem value={UserStatus.ACTIVE.toString()}>活跃</MenuItem>
                      <MenuItem value={UserStatus.INACTIVE.toString()}>非活跃</MenuItem>
                      <MenuItem value={UserStatus.BLOCKED.toString()}>已封禁</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid size={4}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={handleResetSearch}
                    >
                      重置
                    </Button>
                    
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddUser}
                      disabled={!hasAdminAccess}
                    >
                      添加用户
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
            
            {/* 标签页 */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="用户状态标签页"
              >
                <Tab label="全部用户" />
                <Tab label="活跃用户" />
                <Tab label="非活跃用户" />
                <Tab label="已封禁用户" />
              </Tabs>
            </Box>
            
            {/* 用户列表 */}
            <Box sx={{ width: '100%' }}>
              <DataGrid
                rows={users}
                columns={columns}
                pagination
                paginationMode="server"
                rowCount={total}
                loading={loading}
                pageSizeOptions={[15, 25, 50, 100]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize, page },
                  },
                }}
                onPaginationModelChange={(model) => {
                  setPage(model.page);
                  setPageSize(model.pageSize);
                }}
                disableRowSelectionOnClick
                autoHeight
                sx={{
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                  },
                  '& .MuiDataGrid-columnHeader:focus': {
                    outline: 'none',
                  }
                }}
              />
            </Box>
          </Paper>
          
          {/* 用户表单对话框 */}
          <Dialog
            open={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              {selectedUser ? '编辑用户' : '添加用户'}
            </DialogTitle>
            <DialogContent>
              <UserForm
                user={selectedUser}
                onSave={handleSaveUser}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          {/* 删除确认对话框 */}
          <Dialog
            open={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
          >
            <DialogTitle>确认删除</DialogTitle>
            <DialogContent>
              <DialogContentText>
                您确定要删除用户 "{selectedUser?.name || selectedUser?.username}" 吗？此操作不可撤销。
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDeleteDialogOpen(false)}>取消</Button>
              <Button onClick={confirmDeleteUser} color="error" variant="contained">
                删除
              </Button>
            </DialogActions>
          </Dialog>
          
          {/* 重置密码对话框 */}
          <Dialog
            open={isResetPasswordDialogOpen}
            onClose={() => setIsResetPasswordDialogOpen(false)}
          >
            <DialogTitle>重置密码</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ mb: 2 }}>
                为用户 "{selectedUser?.name || selectedUser?.username}" 设置新密码：
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="新密码"
                type="password"
                fullWidth
                variant="outlined"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsResetPasswordDialogOpen(false)}>取消</Button>
              <Button
                onClick={confirmResetPassword}
                color="primary"
                variant="contained"
                disabled={!newPassword}
              >
                确认重置
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default UserManagement; 