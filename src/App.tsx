import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AssessmentList from './pages/AssessmentList';
import AssessmentDetail from './pages/AssessmentDetail';
import AssessmentSession from './pages/AssessmentSession';
import AssessmentResult from './pages/AssessmentResult';
import ReportHistory from './pages/ReportHistory';
import ReportDetail from './pages/ReportDetail';
import ReportManagement from './pages/ReportManagement';
import UserManagement from './pages/UserManagement';
import AssessmentManagement from './pages/AssessmentManagement';
// 导入临时页面组件
import { Box, Typography, Paper, Container, Button } from '@mui/material';
import MainLayout from './components/layout/MainLayout';

// 临时页面组件 - 用于尚未实现的功能
const UnderConstructionPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <MainLayout>
      <Container maxWidth="md">
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            该功能正在开发中，敬请期待...
          </Typography>
          <Button variant="contained" onClick={() => window.history.back()}>
            返回上一页
          </Button>
        </Paper>
      </Container>
    </MainLayout>
  );
};

// 路由守卫组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/assessments" element={
            <ProtectedRoute>
              <AssessmentList />
            </ProtectedRoute>
          } />
          <Route path="/assessments/:id" element={
            <ProtectedRoute>
              <AssessmentDetail />
            </ProtectedRoute>
          } />
          <Route path="/assessment-session/:id" element={
            <ProtectedRoute>
              <AssessmentSession />
            </ProtectedRoute>
          } />
          <Route path="/assessment-result/:id" element={
            <ProtectedRoute>
              <AssessmentResult />
            </ProtectedRoute>
          } />
          
          {/* 报告相关路由 */}
          <Route path="/reports" element={
            <ProtectedRoute>
              <ReportHistory />
            </ProtectedRoute>
          } />
          <Route path="/reports/:id" element={
            <ProtectedRoute>
              <ReportDetail />
            </ProtectedRoute>
          } />
          <Route path="/reports-management" element={
            <ProtectedRoute>
              <ReportManagement />
            </ProtectedRoute>
          } />
          
          {/* 用户管理路由 */}
          <Route path="/users" element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          } />
          
          {/* 测评管理路由 */}
          <Route path="/assessment-management" element={
            <ProtectedRoute>
              <AssessmentManagement />
            </ProtectedRoute>
          } />
          
          {/* 添加临时页面路由 */}
          <Route path="/appointments" element={
            <ProtectedRoute>
              <UnderConstructionPage title="预约咨询" />
            </ProtectedRoute>
          } />
          <Route path="/self-help" element={
            <ProtectedRoute>
              <UnderConstructionPage title="心理自助" />
            </ProtectedRoute>
          } />
          <Route path="/clients" element={
            <ProtectedRoute>
              <UnderConstructionPage title="来访者管理" />
            </ProtectedRoute>
          } />
          <Route path="/schedule" element={
            <ProtectedRoute>
              <UnderConstructionPage title="预约管理" />
            </ProtectedRoute>
          } />
          <Route path="/risk-alerts" element={
            <ProtectedRoute>
              <UnderConstructionPage title="高风险预警" />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <UnderConstructionPage title="数据分析" />
            </ProtectedRoute>
          } />
          <Route path="/system" element={
            <ProtectedRoute>
              <UnderConstructionPage title="系统配置" />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <UnderConstructionPage title="系统设置" />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;