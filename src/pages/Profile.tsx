import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Person,
  Edit,
  Save,
  Cancel,
  Assessment,
  CalendarMonth,
  Psychology,
  Email,
  Phone,
  Security
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { User, UserProfile, UserRole } from '../types/user.types';
import { getCurrentUser } from '../services/authService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState<number>(0);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  });
  const [saving, setSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // 模拟评测历史数据
  const assessmentHistory = [
    { id: 1, title: 'SCL-90 症状自评量表', date: '2025-05-15', score: 65 },
    { id: 2, title: 'PHQ-9 抑郁症筛查量表', date: '2025-05-10', score: 45 },
    { id: 3, title: 'GAD-7 广泛性焦虑量表', date: '2025-05-05', score: 70 }
  ];

  // 模拟咨询预约数据
  const appointments = [
    { id: 1, counselor: '张医生', date: '2025-05-20 14:00', status: '已确认' },
    { id: 2, counselor: '李医生', date: '2025-06-01 10:00', status: '待确认' }
  ];

  useEffect(() => {
    // 获取当前用户信息
    const fetchUserData = async () => {
      try {
        // 在实际应用中，这里应该从API获取用户信息
        // 现在我们使用模拟数据
        const currentUser = getCurrentUser() as UserProfile;
        if (currentUser) {
          setUser(currentUser);
          setFormData({
            name: currentUser.name || '',
            email: currentUser.email || '',
            phone: currentUser.phone || '',
            address: currentUser.address || '',
            bio: ''  // 这个字段在UserProfile中不存在，但我们仍然保留在表单中
          });
        } else {
          navigate('/login');
        }
        setLoading(false);
      } catch (error) {
        console.error('获取用户信息失败', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    if (editMode) {
      // 取消编辑，恢复原始数据
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          bio: ''  // 这个字段在UserProfile中不存在
        });
      }
    }
    setEditMode(!editMode);
    setSaveError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 更新本地用户数据
      if (user) {
        const updatedUser = {
          ...user,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
          // bio字段不保存，因为UserProfile中没有此字段
        };
        setUser(updatedUser);
        // 在实际应用中，这里应该调用API保存用户数据
      }

      setEditMode(false);
    } catch (error) {
      console.error('保存用户信息失败', error);
      setSaveError('保存失败，请稍后再试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <Container maxWidth="md">
          <Alert severity="error" sx={{ mt: 4 }}>
            无法获取用户信息，请重新登录
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/login')} 
            sx={{ mt: 2 }}
          >
            返回登录页面
          </Button>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="md">
        {/* 个人资料卡片 */}
        <Paper sx={{ p: 4, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar 
              sx={{ width: 100, height: 100, bgcolor: 'primary.main', mr: 3 }}
            >
              {user.name?.charAt(0) || user.username.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5" gutterBottom>
                {user.name || user.username}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user.role === UserRole.USER ? '来访者' : user.role === UserRole.COUNSELOR ? '咨询师' : '管理员'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                注册时间: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '未知'}
              </Typography>
            </Box>
            {!editMode && (
              <Button 
                variant="outlined" 
                startIcon={<Edit />} 
                sx={{ ml: 'auto' }}
                onClick={handleEditToggle}
              >
                编辑资料
              </Button>
            )}
            {editMode && (
              <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  color="error" 
                  startIcon={<Cancel />} 
                  onClick={handleEditToggle}
                >
                  取消
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<Save />} 
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={24} /> : '保存'}
                </Button>
              </Box>
            )}
          </Box>

          {saveError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {saveError}
            </Alert>
          )}

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ width: '100%' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab icon={<Person />} label="基本信息" />
              <Tab icon={<Assessment />} label="评测历史" />
              <Tab icon={<CalendarMonth />} label="咨询预约" />
              <Tab icon={<Security />} label="账号安全" />
            </Tabs>

            {/* 基本信息 */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="姓名"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    variant={editMode ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editMode
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="用户名"
                    value={user.username}
                    disabled
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="邮箱"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    variant={editMode ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editMode
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="电话"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    variant={editMode ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editMode
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="地址"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    variant={editMode ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editMode
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="个人简介"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    multiline
                    rows={4}
                    variant={editMode ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editMode
                    }}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* 评测历史 */}
            <TabPanel value={tabValue} index={1}>
              {assessmentHistory.length > 0 ? (
                <List>
                  {assessmentHistory.map((assessment) => (
                    <Paper key={assessment.id} sx={{ mb: 2, p: 2 }}>
                      <ListItem>
                        <ListItemIcon>
                          <Psychology />
                        </ListItemIcon>
                        <ListItemText
                          primary={assessment.title}
                          secondary={`完成时间: ${assessment.date}`}
                        />
                        <Chip 
                          label={`得分: ${assessment.score}`} 
                          color={
                            assessment.score > 70 ? 'error' : 
                            assessment.score > 50 ? 'warning' : 'success'
                          } 
                        />
                        <Button 
                          sx={{ ml: 2 }}
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/assessment-result/${assessment.id}`)}
                        >
                          查看详情
                        </Button>
                      </ListItem>
                    </Paper>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  暂无评测记录
                </Typography>
              )}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/assessments')}
                >
                  开始新的评测
                </Button>
              </Box>
            </TabPanel>

            {/* 咨询预约 */}
            <TabPanel value={tabValue} index={2}>
              {appointments.length > 0 ? (
                <List>
                  {appointments.map((appointment) => (
                    <Paper key={appointment.id} sx={{ mb: 2, p: 2 }}>
                      <ListItem>
                        <ListItemIcon>
                          <CalendarMonth />
                        </ListItemIcon>
                        <ListItemText
                          primary={`咨询师: ${appointment.counselor}`}
                          secondary={`预约时间: ${appointment.date}`}
                        />
                        <Chip 
                          label={appointment.status} 
                          color={appointment.status === '已确认' ? 'success' : 'warning'} 
                        />
                        <Button 
                          sx={{ ml: 2 }}
                          variant="outlined"
                          size="small"
                          onClick={() => navigate('/appointments')}
                        >
                          查看详情
                        </Button>
                      </ListItem>
                    </Paper>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  暂无预约记录
                </Typography>
              )}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/appointments')}
                >
                  预约咨询
                </Button>
              </Box>
            </TabPanel>

            {/* 账号安全 */}
            <TabPanel value={tabValue} index={3}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText
                    primary="邮箱验证"
                    secondary={user.email ? "已验证" : "未验证"}
                  />
                  {!user.email && (
                    <Button variant="outlined" size="small">
                      验证邮箱
                    </Button>
                  )}
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText
                    primary="手机绑定"
                    secondary={user.phone ? "已绑定" : "未绑定"}
                  />
                  {!user.phone && (
                    <Button variant="outlined" size="small">
                      绑定手机
                    </Button>
                  )}
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText
                    primary="修改密码"
                    secondary="定期更换密码可以提高账号安全性"
                  />
                  <Button variant="outlined" size="small">
                    修改密码
                  </Button>
                </ListItem>
              </List>
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default Profile; 