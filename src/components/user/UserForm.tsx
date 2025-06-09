import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  SelectChangeEvent
} from '@mui/material';
import { User, UserRole, UserStatus } from '../../types/user.types';

// 组件属性接口
interface UserFormProps {
  user: User | null;
  onSave: (userData: Partial<User>) => void;
  onCancel: () => void;
}

// 表单错误接口
interface FormErrors {
  username?: string;
  email?: string;
  phone?: string;
  name?: string;
  password?: string;
}

// 用户表单组件
const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel }) => {
  // 表单状态
  const [formData, setFormData] = useState<Partial<User> & { password?: string }>({
    username: '',
    email: '',
    phone: '',
    name: '',
    status: UserStatus.ACTIVE,
    role: UserRole.USER,
    password: ''
  });
  
  // 错误状态
  const [errors, setErrors] = useState<FormErrors>({});
  
  // 当用户数据变化时更新表单
  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: '' // 编辑时不显示密码
      });
    } else {
      // 重置为默认值
      setFormData({
        username: '',
        email: '',
        phone: '',
        name: '',
        status: UserStatus.ACTIVE,
        role: UserRole.USER,
        password: ''
      });
    }
  }, [user]);
  
  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!name) return;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除对应字段的错误
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // 处理Select组件的变化
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    if (!name) return;
    
    if (name === 'status') {
      // 将字符串转换为数字
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value, 10)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // 验证用户名
    if (!formData.username) {
      newErrors.username = '用户名不能为空';
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名至少需要3个字符';
    }
    
    // 验证邮箱
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    // 验证手机号
    if (formData.phone && !/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的手机号码';
    }
    
    // 验证密码（仅在添加新用户时）
    if (!user && !formData.password) {
      newErrors.password = '密码不能为空';
    } else if (!user && formData.password && formData.password.length < 6) {
      newErrors.password = '密码至少需要6个字符';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 处理提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // 如果是编辑用户且密码为空，则不提交密码字段
      const submitData = { ...formData };
      if (user && !submitData.password) {
        delete submitData.password;
      }
      
      onSave(submitData);
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        {/* 基本信息 */}
        <Grid size={12}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            基本信息
          </Typography>
        </Grid>
        
        {/* 用户名 */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            id="username"
            name="username"
            label="用户名"
            value={formData.username || ''}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            disabled={!!user} // 编辑时不允许修改用户名
          />
        </Grid>
        
        {/* 姓名 */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="姓名"
            value={formData.name || ''}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
        
        {/* 密码 */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            id="password"
            name="password"
            label={user ? "新密码（留空则不修改）" : "密码"}
            type="password"
            value={formData.password || ''}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            required={!user}
          />
        </Grid>
        
        {/* 角色 */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth required>
            <InputLabel id="role-label">角色</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formData.role || UserRole.USER}
              label="角色"
              onChange={handleSelectChange}
            >
              <MenuItem value={UserRole.USER}>普通用户</MenuItem>
              <MenuItem value={UserRole.COUNSELOR}>心理咨询师</MenuItem>
              <MenuItem value={UserRole.ADMIN}>管理员</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {/* 联系信息 */}
        <Grid size={12} sx={{ mt: 2 }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            联系信息
          </Typography>
        </Grid>
        
        {/* 邮箱 */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="邮箱"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>
        
        {/* 电话 */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label="电话"
            value={formData.phone || ''}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </Grid>
        
        {/* 账号状态 */}
        <Grid size={12} sx={{ mt: 2 }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            账号状态
          </Typography>
        </Grid>
        
        {/* 状态 */}
        <Grid size={12}>
          <FormControl fullWidth required>
            <InputLabel id="status-label">状态</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={formData.status !== undefined ? formData.status.toString() : UserStatus.ACTIVE.toString()}
              label="状态"
              onChange={handleSelectChange}
            >
              <MenuItem value={UserStatus.ACTIVE.toString()}>活跃</MenuItem>
              <MenuItem value={UserStatus.INACTIVE.toString()}>非活跃</MenuItem>
              <MenuItem value={UserStatus.BLOCKED.toString()}>已封禁</MenuItem>
            </Select>
            <FormHelperText>
              活跃：用户可以正常登录和使用系统
              <br />
              非活跃：用户账号已创建但未激活
              <br />
              已封禁：用户被禁止登录系统
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      
      {/* 按钮组 */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" variant="contained">
          {user ? '保存' : '创建'}
        </Button>
      </Stack>
    </Box>
  );
};

export default UserForm; 