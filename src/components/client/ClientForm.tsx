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
  SelectChangeEvent,
  Divider
} from '@mui/material';
import { User, UserRole, UserStatus, UserProfile } from '../../types/user.types';

// 组件属性接口
interface ClientFormProps {
  client: User | null;
  onSave: (clientData: Partial<UserProfile>) => void;
  onCancel: () => void;
}

// 表单错误接口
interface FormErrors {
  username?: string;
  email?: string;
  phone?: string;
  name?: string;
  password?: string;
  gender?: string;
  age?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

// 来访者表单组件
const ClientForm: React.FC<ClientFormProps> = ({ client, onSave, onCancel }) => {
  // 表单状态
  const [formData, setFormData] = useState<Partial<UserProfile> & { password?: string }>({
    username: '',
    email: '',
    phone: '',
    name: '',
    status: UserStatus.ACTIVE,
    role: UserRole.USER,
    password: '',
    gender: '',
    age: undefined,
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: ''
  });
  
  // 错误状态
  const [errors, setErrors] = useState<FormErrors>({});
  
  // 当来访者数据变化时更新表单
  useEffect(() => {
    if (client) {
      setFormData({
        ...client,
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
        password: '',
        gender: '',
        age: undefined,
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
        medicalHistory: ''
      });
    }
  }, [client]);
  
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
    if (!client && !formData.password) {
      newErrors.password = '密码不能为空';
    } else if (!client && formData.password && formData.password.length < 6) {
      newErrors.password = '密码至少需要6个字符';
    }

    // 验证年龄
    if (formData.age !== undefined && (isNaN(Number(formData.age)) || Number(formData.age) <= 0 || Number(formData.age) > 120)) {
      newErrors.age = '请输入有效的年龄';
    }

    // 验证紧急联系人电话
    if (formData.emergencyPhone && !/^1[3-9]\d{9}$/.test(formData.emergencyPhone)) {
      newErrors.emergencyPhone = '请输入有效的手机号码';
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
      if (client && !submitData.password) {
        delete submitData.password;
      }
      
      onSave(submitData);
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        {/* 基本信息 */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            基本信息
          </Typography>
        </Grid>
        
        {/* 用户名 */}
        <Grid item xs={12} sm={6}>
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
            disabled={!!client} // 编辑时不允许修改用户名
          />
        </Grid>
        
        {/* 姓名 */}
        <Grid item xs={12} sm={6}>
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
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="password"
            name="password"
            label={client ? "新密码（留空则不修改）" : "密码"}
            type="password"
            value={formData.password || ''}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            required={!client}
          />
        </Grid>
        
        {/* 状态 */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel id="status-label">状态</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={formData.status?.toString() || UserStatus.ACTIVE.toString()}
              label="状态"
              onChange={handleSelectChange}
            >
              <MenuItem value={UserStatus.ACTIVE.toString()}>活跃</MenuItem>
              <MenuItem value={UserStatus.INACTIVE.toString()}>非活跃</MenuItem>
              <MenuItem value={UserStatus.BLOCKED.toString()}>已封禁</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {/* 联系信息 */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            联系信息
          </Typography>
        </Grid>
        
        {/* 邮箱 */}
        <Grid item xs={12} sm={6}>
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
        
        {/* 手机号 */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label="手机号"
            value={formData.phone || ''}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </Grid>

        {/* 个人信息 */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            个人信息
          </Typography>
        </Grid>

        {/* 性别 */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="gender-label">性别</InputLabel>
            <Select
              labelId="gender-label"
              id="gender"
              name="gender"
              value={formData.gender || ''}
              label="性别"
              onChange={handleSelectChange}
            >
              <MenuItem value="">未指定</MenuItem>
              <MenuItem value="male">男</MenuItem>
              <MenuItem value="female">女</MenuItem>
              <MenuItem value="other">其他</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* 年龄 */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="age"
            name="age"
            label="年龄"
            type="number"
            value={formData.age || ''}
            onChange={handleChange}
            error={!!errors.age}
            helperText={errors.age}
            InputProps={{ inputProps: { min: 1, max: 120 } }}
          />
        </Grid>

        {/* 地址 */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="address"
            name="address"
            label="地址"
            value={formData.address || ''}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
          />
        </Grid>

        {/* 紧急联系人信息 */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            紧急联系人
          </Typography>
        </Grid>

        {/* 紧急联系人 */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="emergencyContact"
            name="emergencyContact"
            label="紧急联系人姓名"
            value={formData.emergencyContact || ''}
            onChange={handleChange}
            error={!!errors.emergencyContact}
            helperText={errors.emergencyContact}
          />
        </Grid>

        {/* 紧急联系人电话 */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="emergencyPhone"
            name="emergencyPhone"
            label="紧急联系人电话"
            value={formData.emergencyPhone || ''}
            onChange={handleChange}
            error={!!errors.emergencyPhone}
            helperText={errors.emergencyPhone}
          />
        </Grid>

        {/* 病史 */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="medicalHistory"
            name="medicalHistory"
            label="既往病史"
            multiline
            rows={4}
            value={formData.medicalHistory || ''}
            onChange={handleChange}
            placeholder="请填写相关心理或身体疾病史，如抑郁症、焦虑症等"
          />
        </Grid>
      </Grid>
      
      {/* 按钮组 */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" variant="contained">
          保存
        </Button>
      </Stack>
    </Box>
  );
};

export default ClientForm; 