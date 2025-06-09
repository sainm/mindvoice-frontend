import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { getCurrentUser, getUserRole } from '../services/authService';
import { UserRole, UserProfile, User } from '../types/user.types';
import UserHome from '../components/home/UserHome';
import CounselorHome from '../components/home/CounselorHome';
import AdminHome from '../components/home/AdminHome';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // 检查用户是否已登录
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    // 获取用户信息
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // 获取用户角色
      const role = getUserRole();
      setUserRole(role);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // 根据角色渲染不同的Home组件
  const renderHomeByRole = () => {
    if (!user) return null;

    // 模拟一些额外的用户信息，实际应用中应该从API获取
    const userProfile: UserProfile = {
      ...user,
      gender: '男',
      age: 30,
      emotionalStatus: {
        anxietyIndex: 65,
        depressionIndex: 42,
        lastUpdated: new Date().toISOString(),
        trend: 'down'
      }
    };

    switch (userRole) {
      case UserRole.ADMIN:
        return <AdminHome user={user} />;
      case UserRole.COUNSELOR:
        return <CounselorHome user={user} />;
      case UserRole.USER:
      default:
        return <UserHome user={userProfile} />;
    }
  };

  return (
    <MainLayout>
      <Box sx={{ 
        width: '100%', 
        height: '100%',
        padding: 0 // 移除额外的内边距，因为MainLayout已经提供了内边距
      }}>
        {renderHomeByRole()}
      </Box>
    </MainLayout>
  );
};

export default Home; 