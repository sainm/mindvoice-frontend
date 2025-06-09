import React, { useState, useEffect } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Button, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Avatar,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard, 
  Assessment, 
  Psychology, 
  Person, 
  Logout, 
  Settings,
  Security,
  People,
  Storage,
  BarChart,
  CalendarMonth,
  SelfImprovement,
  Warning
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout, getCurrentUser, getUserRole } from '../../services/authService';
import { User, UserRole } from '../../types/user.types';

interface MainLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  roles?: UserRole[];
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  
  useEffect(() => {
    // 获取当前用户信息
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      const role = getUserRole();
      setUserRole(role);
    } else {
      // 如果没有用户信息，重定向到登录页
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // 所有可能的菜单项
  const allMenuItems: MenuItem[] = [
    // 所有角色通用
    { text: '仪表盘', icon: <Dashboard />, path: '/home' },
    
    // 普通用户菜单项
    { text: '评估测试', icon: <Assessment />, path: '/assessments', roles: [UserRole.USER] },
    { text: '历史报告', icon: <Assessment />, path: '/reports', roles: [UserRole.USER] },
    { text: '预约咨询', icon: <CalendarMonth />, path: '/appointments', roles: [UserRole.USER] },
    { text: '心理自助', icon: <SelfImprovement />, path: '/self-help', roles: [UserRole.USER] },
    
    // 咨询师菜单项
    { text: '来访者管理', icon: <People />, path: '/clients', roles: [UserRole.COUNSELOR] },
    { text: '预约管理', icon: <CalendarMonth />, path: '/schedule', roles: [UserRole.COUNSELOR] },
    { text: '报告管理', icon: <Assessment />, path: '/reports-management', roles: [UserRole.COUNSELOR] },
    { text: '高风险预警', icon: <Warning />, path: '/risk-alerts', roles: [UserRole.COUNSELOR] },
    
    // 管理员菜单项
    { text: '用户管理', icon: <People />, path: '/users', roles: [UserRole.ADMIN] },
    { text: '评测管理', icon: <Assessment />, path: '/assessment-management', roles: [UserRole.ADMIN] },
    { text: '数据分析', icon: <BarChart />, path: '/analytics', roles: [UserRole.ADMIN] },
    { text: '系统配置', icon: <Storage />, path: '/system', roles: [UserRole.ADMIN] },
    
    // 所有角色通用
    { text: '个人中心', icon: <Person />, path: '/profile' },
    { text: '系统设置', icon: <Settings />, path: '/settings' },
  ];

  // 根据用户角色过滤菜单项
  const filteredMenuItems = allMenuItems.filter(item => {
    // 如果没有指定角色限制，则所有角色都可见
    if (!item.roles) return true;
    // 如果指定了角色限制，则只有符合角色的用户可见
    return userRole && item.roles.includes(userRole);
  });

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 顶部导航栏 */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            灵犀之声心理评估系统
          </Typography>
          
          {user && (
            <Tooltip title="个人中心">
              <IconButton 
                sx={{ mr: 2 }} 
                onClick={() => navigate('/profile')}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user.name?.charAt(0) || user.username.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
          )}
          
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<Logout />}
          >
            退出登录
          </Button>
        </Toolbar>
      </AppBar>

      {/* 侧边菜单 */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
            top: ['56px', '64px'],
            height: 'auto',
            bottom: 0,
          },
        }}
      >
        {/* 用户信息 */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', mr: 2 }}>
            {user?.name?.charAt(0) || user?.username?.charAt(0) || '?'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1">{user?.name || user?.username || '未登录'}</Typography>
            <Typography variant="body2" color="text.secondary">
              {userRole === UserRole.ADMIN && '管理员'}
              {userRole === UserRole.COUNSELOR && '咨询师'}
              {userRole === UserRole.USER && '来访者'}
            </Typography>
          </Box>
        </Box>
        
        <List>
          {filteredMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'rgba(0, 0, 0, 0.08)',
                    borderRight: `3px solid ${theme.palette.primary.main}`,
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.12)',
                    }
                  }
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
          <Divider sx={{ my: 1 }} />
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="退出登录" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* 主要内容 */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerOpen ? 250 : 0}px)` },
          marginLeft: { sm: drawerOpen ? '250px' : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginTop: '64px', // AppBar 高度
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 