import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container, 
  Divider, 
  Chip, 
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack
} from '@mui/material';
import { 
  AccessTime, 
  Category, 
  Help, 
  Info, 
  PlayArrow, 
  Warning,
  CheckCircle
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { Assessment } from '../types/assessment.types';
import { getAssessmentById, createAssessmentSession } from '../services/mockAssessmentService';
import { getCurrentUser } from '../services/authService';

const AssessmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // 获取评测量表详情
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        if (!id) {
          console.error('评测ID无效：', id);
          setError('评测ID无效');
          setLoading(false);
          return;
        }

        // 确保ID是数字
        const assessmentId = parseInt(id);
        console.log('尝试获取评测详情，ID:', assessmentId, '类型:', typeof assessmentId);

        // 检查ID是否为NaN
        if (isNaN(assessmentId)) {
          console.error('ID转换为数字失败:', id);
          setError('评测ID格式无效');
          setLoading(false);
          return;
        }

        const data = await getAssessmentById(assessmentId);
        console.log('API返回数据:', data);
        
        if (data) {
          console.log('成功获取评测详情:', data.title);
          setAssessment(data);
        } else {
          console.error('未找到评测量表，ID:', assessmentId);
          setError('未找到该评测量表');
        }
        setLoading(false);
      } catch (error) {
        console.error('获取评测详情失败', error);
        setError('获取评测详情失败，请稍后再试');
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  // 开始评测
  const handleStartAssessment = async () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser || !assessment) return;

      const session = await createAssessmentSession(assessment.id, currentUser.id);
      navigate(`/assessment-session/${session.id}`);
    } catch (error) {
      console.error('创建评测会话失败', error);
      setError('创建评测会话失败，请稍后再试');
    }
  };

  // 打开确认对话框
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // 关闭确认对话框
  const handleCloseDialog = () => {
    setOpenDialog(false);
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

  if (error || !assessment) {
    return (
      <MainLayout>
        <Container maxWidth="md">
          <Alert severity="error" sx={{ mt: 4 }}>
            {error || '未找到该评测量表'}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/assessments')} 
            sx={{ mt: 2 }}
          >
            返回评测列表
          </Button>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="md">
        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {assessment.title}
          </Typography>
          
          <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              label={assessment.category} 
              color="primary" 
              icon={<Category />}
            />
            {assessment.timeLimit && (
              <Chip 
                label={`预计用时 ${assessment.timeLimit} 分钟`} 
                icon={<AccessTime />}
              />
            )}
            <Chip 
              label={`${assessment.questions.length} 个问题`} 
              icon={<Help />}
            />
          </Stack>
          
          <Typography variant="body1" paragraph>
            {assessment.description}
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Info sx={{ mr: 1 }} /> 评测说明
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {assessment.instructions}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              注意事项
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="请在安静、不受干扰的环境中完成评测" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="根据您的真实感受作答，没有对错之分" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="评测结果仅供参考，如有需要请咨询专业心理医师" />
              </ListItem>
              {assessment.timeLimit && (
                <ListItem>
                  <ListItemIcon>
                    <Warning color="warning" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={`本评测有 ${assessment.timeLimit} 分钟时间限制，请确保有充足的时间完成`} />
                </ListItem>
              )}
            </List>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              startIcon={<PlayArrow />} 
              onClick={handleOpenDialog}
              sx={{ px: 4, py: 1.5 }}
            >
              开始评测
            </Button>
          </Box>
        </Paper>
        
        {/* 标签 */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            相关标签
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {assessment.tags.map((tag, index) => (
              <Chip key={index} label={tag} variant="outlined" />
            ))}
          </Box>
        </Paper>
      </Container>

      {/* 确认对话框 */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>准备开始评测</DialogTitle>
        <DialogContent>
          <DialogContentText>
            您即将开始 <strong>{assessment.title}</strong> 评测。
            {assessment.timeLimit && (
              <>
                <br />
                本评测预计需要 {assessment.timeLimit} 分钟完成，请确保您有充足的时间。
              </>
            )}
            <br /><br />
            开始后，请根据您的真实感受作答，评测结果仅供参考。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">取消</Button>
          <Button onClick={handleStartAssessment} variant="contained" autoFocus>
            开始评测
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default AssessmentDetail; 