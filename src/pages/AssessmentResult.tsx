import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Container, 
  Button, 
  Divider, 
  CircularProgress, 
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material';
import { 
  CheckCircle, 
  Info, 
  Lightbulb, 
  BarChart, 
  Warning, 
  ArrowForward,
  Download,
  Share
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { AssessmentResult as ResultType } from '../types/assessment.types';
import { getAssessmentById } from '../services/mockAssessmentService';

// 模拟结果数据
const mockResult: ResultType = {
  sessionId: 1,
  assessmentId: 1,
  userId: 1,
  completionTime: new Date().toISOString(),
  scores: [
    {
      category: '焦虑',
      score: 65,
      interpretation: '中度焦虑',
      level: 'medium'
    },
    {
      category: '抑郁',
      score: 45,
      interpretation: '轻度抑郁',
      level: 'low'
    },
    {
      category: '强迫',
      score: 70,
      interpretation: '中度强迫',
      level: 'medium'
    },
    {
      category: '躯体化',
      score: 30,
      interpretation: '正常范围',
      level: 'low'
    },
    {
      category: '人际敏感',
      score: 55,
      interpretation: '轻度人际敏感',
      level: 'low'
    }
  ],
  summary: '根据测评结果，您目前表现出中度焦虑和轻度抑郁症状，同时有一定的强迫倾向。这些症状可能会对您的日常生活和工作产生一定影响，但通过适当的自我调节和专业帮助，这些症状是可以得到改善的。建议您关注自己的心理健康状况，适当寻求专业帮助。',
  recommendations: [
    '保持规律的作息时间，确保充足的睡眠',
    '每天进行适量的体育锻炼，如散步、慢跑等',
    '学习并实践放松技巧，如深呼吸、渐进性肌肉放松等',
    '减少咖啡因和酒精的摄入',
    '与亲友分享您的感受和困扰',
    '考虑寻求心理咨询师的专业帮助'
  ]
};

// 获取分数对应的颜色
const getLevelColor = (level: string): string => {
  switch (level) {
    case 'severe':
      return '#d32f2f'; // 红色
    case 'high':
      return '#f57c00'; // 橙色
    case 'medium':
      return '#ffc107'; // 黄色
    case 'low':
    default:
      return '#4caf50'; // 绿色
  }
};

const AssessmentResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<ResultType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [assessmentTitle, setAssessmentTitle] = useState<string>('');

  // 获取评测结果
  useEffect(() => {
    const fetchResult = async () => {
      try {
        if (!id) {
          setError('结果ID无效');
          setLoading(false);
          return;
        }

        // 在实际应用中，这里应该从API获取评测结果
        // 现在我们使用模拟数据
        setResult(mockResult);
        
        // 获取评测标题
        const assessment = await getAssessmentById(mockResult.assessmentId);
        if (assessment) {
          setAssessmentTitle(assessment.title);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('获取评测结果失败', error);
        setError('获取评测结果失败，请稍后再试');
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  // 处理下载报告
  const handleDownload = () => {
    alert('报告下载功能将在正式版本中提供');
  };

  // 处理分享报告
  const handleShare = () => {
    alert('报告分享功能将在正式版本中提供');
  };

  // 处理预约咨询
  const handleConsultation = () => {
    navigate('/appointments');
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

  if (error || !result) {
    return (
      <MainLayout>
        <Container maxWidth="md">
          <Alert severity="error" sx={{ mt: 4 }}>
            {error || '未找到评测结果'}
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
        {/* 结果标题 */}
        <Paper sx={{ p: 4, mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            评测报告
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            {assessmentTitle}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            完成时间: {new Date(result.completionTime).toLocaleString()}
          </Typography>
        </Paper>

        {/* 结果摘要 */}
        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Info sx={{ mr: 1 }} /> 结果摘要
          </Typography>
          <Typography variant="body1" paragraph>
            {result.summary}
          </Typography>
        </Paper>

        {/* 分数详情 */}
        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <BarChart sx={{ mr: 1 }} /> 评估结果详情
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {result.scores.map((score, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    height: '100%',
                    borderColor: getLevelColor(score.level),
                    borderWidth: 2
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {score.category}
                    </Typography>
                    
                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                      <Box
                        sx={{
                          width: 100,
                          height: 100,
                          position: 'relative',
                        }}
                      >
                        <CircularProgress
                          variant="determinate"
                          value={score.score}
                          size={100}
                          thickness={5}
                          sx={{ 
                            color: getLevelColor(score.level),
                            position: 'absolute',
                            top: 0,
                            left: 0
                          }}
                        />
                        <CircularProgress
                          variant="determinate"
                          value={100}
                          size={100}
                          thickness={5}
                          sx={{ 
                            color: 'rgba(0, 0, 0, 0.1)',
                            position: 'absolute',
                            top: 0,
                            left: 0
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="h5" component="div">
                          {score.score}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Chip 
                      label={score.interpretation} 
                      sx={{ 
                        bgcolor: getLevelColor(score.level),
                        color: '#fff',
                        fontWeight: 'bold',
                        mt: 1
                      }} 
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* 建议 */}
        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Lightbulb sx={{ mr: 1 }} /> 改善建议
          </Typography>
          
          <List>
            {result.recommendations.map((recommendation, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText primary={recommendation} />
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ my: 3 }} />
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body1">
              这些建议仅供参考，如果您的症状持续或加重，请咨询专业心理医师。
            </Typography>
          </Alert>
        </Paper>

        {/* 注意事项 */}
        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Warning sx={{ mr: 1 }} /> 注意事项
          </Typography>
          
          <Typography variant="body1" paragraph>
            本评测结果仅供参考，不能替代专业医疗诊断。如果您有严重的心理健康问题，请及时就医或寻求专业帮助。
          </Typography>
          
          <Typography variant="body1" paragraph>
            心理健康是一个持续的过程，建议您定期进行评估，并关注自己的心理状态变化。
          </Typography>
        </Paper>

        {/* 操作按钮 */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
          <Button 
            variant="outlined" 
            startIcon={<Download />}
            onClick={handleDownload}
            fullWidth
          >
            下载报告
          </Button>
          
          <Button 
            variant="outlined" 
            startIcon={<Share />}
            onClick={handleShare}
            fullWidth
          >
            分享报告
          </Button>
          
          <Button 
            variant="contained" 
            color="primary"
            endIcon={<ArrowForward />}
            onClick={handleConsultation}
            fullWidth
          >
            预约咨询
          </Button>
        </Stack>
      </Container>
    </MainLayout>
  );
};

export default AssessmentResult; 