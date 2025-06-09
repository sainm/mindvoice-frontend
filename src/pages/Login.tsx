import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  InputAdornment, 
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  Link
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  // 检查用户是否已登录，如果已登录则跳转到主页
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/home');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单的表单验证
    if (!username.trim() || !password.trim()) {
      setError('用户名和密码不能为空');
      setShowError(true);
      return;
    }
    
    try {
      setLoading(true);
      const response = await login({ username, password });
      
      if (response.success) {
        // 登录成功，导航到首页
        navigate('/home');
      } else {
        // 登录失败，显示错误信息
        setError(response.message || '登录失败');
        setShowError(true);
      }
    } catch (err) {
      setError('登录过程中发生错误，请稍后再试');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  // 使用测试账号
  const useTestAccount = (role: string) => {
    switch (role) {
      case 'admin':
        setUsername('admin');
        setPassword('password');
        break;
      case 'doctor':
        setUsername('doctor');
        setPassword('password');
        break;
      case 'user':
        setUsername('user');
        setPassword('password');
        break;
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            灵犀之声心理评估系统
          </Typography>
          
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="用户名"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密码"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </Button>
            
            <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 2 }}>
              可使用用户名、邮箱或手机号登录
            </Typography>

            <Divider sx={{ my: 2 }}>
              <Typography variant="caption" color="text.secondary">
                测试账号
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Link 
                component="button" 
                variant="body2" 
                onClick={() => useTestAccount('admin')}
                underline="hover"
              >
                管理员账号
              </Link>
              <Link 
                component="button" 
                variant="body2" 
                onClick={() => useTestAccount('doctor')}
                underline="hover"
              >
                咨询师账号
              </Link>
              <Link 
                component="button" 
                variant="body2" 
                onClick={() => useTestAccount('user')}
                underline="hover"
              >
                普通用户账号
              </Link>
            </Box>
          </Box>
        </Paper>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 3 }}>
          © {new Date().getFullYear()} 海口灵犀之声心理健康咨询有限公司
        </Typography>
      </Box>
      
      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login; 