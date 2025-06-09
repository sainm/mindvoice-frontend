import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Divider,
  Grid,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert
} from '@mui/material';
import {
  Assignment,
  CalendarToday,
  Person,
  Download,
  Print,
  ArrowBack,
  CheckCircle,
  Info,
  Warning,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  BarChart
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

// 模拟报告数据
const mockReportData = {
  id: 1,
  title: 'SCL-90 症状自评量表报告',
  assessmentId: 1,
  assessmentTitle: 'SCL-90 症状自评量表',
  createdAt: '2025-06-10T15:45:00',
  status: 'completed',
  counselorId: 5,
  counselorName: '王医生',
  counselorNotes: '患者整体心理状态良好，存在轻微焦虑情绪，建议进行适当的放松训练和情绪管理。',
  scores: [
    {
      category: '躯体化',
      score: 1.5,
      interpretation: '正常范围',
      level: 'normal'
    },
    {
      category: '强迫症状',
      score: 1.8,
      interpretation: '轻度',
      level: 'mild'
    },
    {
      category: '人际关系敏感',
      score: 2.2,
      interpretation: '中度',
      level: 'moderate'
    },
    {
      category: '抑郁',
      score: 1.6,
      interpretation: '轻度',
      level: 'mild'
    },
    {
      category: '焦虑',
      score: 2.5,
      interpretation: '中度',
      level: 'moderate'
    },
    {
      category: '敌对',
      score: 1.2,
      interpretation: '正常范围',
      level: 'normal'
    },
    {
      category: '恐怖',
      score: 1.0,
      interpretation: '正常范围',
      level: 'normal'
    },
    {
      category: '偏执',
      score: 1.7,
      interpretation: '轻度',
      level: 'mild'
    },
    {
      category: '精神病性',
      score: 1.1,
      interpretation: '正常范围',
      level: 'normal'
    }
  ],
  summary: '根据SCL-90量表评估结果，您的总体心理健康状况处于轻度不良状态。您在焦虑和人际关系敏感方面表现出中度症状，在强迫症状、抑郁和偏执方面表现出轻度症状，其他维度在正常范围内。这表明您可能在人际交往中感到不安和紧张，同时伴有一定程度的焦虑情绪和强迫思维。',
  recommendations: [
    '建议进行规律的有氧运动，如散步、慢跑等，每周至少3-4次，每次30分钟以上',
    '学习并实践放松技巧，如深呼吸、渐进性肌肉放松等，每天进行10-15分钟',
    '保持规律的作息时间，确保充足的睡眠',
    '适当参加社交活动，增强人际交往能力',
    '如症状持续或加重，建议寻求专业心理咨询师的帮助'
  ],
  trends: [
    {
      date: '2025-05-10',
      score: 2.8
    },
    {
      date: '2025-05-25',
      score: 2.5
    },
    {
      date: '2025-06-10',
      score: 2.0
    }
  ]
};

const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 模拟从API获取报告数据
    const fetchReport = async () => {
      try {
        // 实际应用中，这里应该调用API获取数据
        setTimeout(() => {
          // 检查ID是否有效
          if (!id || isNaN(parseInt(id))) {
            setError('无效的报告ID');
            setLoading(false);
            return;
          }

          // 模拟API返回数据
          setReport(mockReportData);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('获取报告详情失败', error);
        setError('获取报告详情失败，请稍后再试');
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 获取得分级别对应的颜色
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'normal':
        return 'success';
      case 'mild':
        return 'info';
      case 'moderate':
        return 'warning';
      case 'severe':
        return 'error';
      default:
        return 'default';
    }
  };

  // 获取趋势图标
  const getTrendIcon = () => {
    if (!report || !report.trends || report.trends.length < 2) return <TrendingFlat />;
    
    const latestScore = report.trends[report.trends.length - 1].score;
    const previousScore = report.trends[report.trends.length - 2].score;
    
    if (latestScore < previousScore) {
      return <TrendingDown color="success" />;
    } else if (latestScore > previousScore) {
      return <TrendingUp color="error" />;
    } else {
      return <TrendingFlat color="info" />;
    }
  };

  // 下载报告
  const handleDownloadReport = () => {
    // 实际应用中，这里应该调用API下载报告
    console.log(`下载报告 ID: ${id}`);
    alert('报告下载功能将在后续版本中提供');
  };

  // 打印报告
  const handlePrintReport = () => {
    window.print();
  };

  // 返回报告列表
  const handleBackToList = () => {
    navigate('/reports');
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

  if (error || !report) {
    return (
      <MainLayout>
        <Container maxWidth="md">
          <Alert severity="error" sx={{ mt: 4 }}>
            {error || '未找到该报告'}
          </Alert>
          <Button
            variant="contained"
            onClick={handleBackToList}
            sx={{ mt: 2 }}
          >
            返回报告列表
          </Button>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* 顶部操作栏 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBackToList}
            sx={{ borderRadius: 8, px: 2 }}
          >
            返回列表
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={handlePrintReport}
              sx={{ borderRadius: 8, px: 2 }}
            >
              打印报告
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleDownloadReport}
              sx={{ 
                borderRadius: 8, 
                px: 2,
                background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                boxShadow: '0 3px 10px rgba(63, 81, 181, 0.3)'
              }}
            >
              下载报告
            </Button>
          </Box>
        </Box>

        {/* 报告标题 */}
        <Paper
          sx={{
            p: { xs: 2, md: 3 },
            mb: 3,
            borderRadius: 2,
            background: 'linear-gradient(145deg, #f0f7ff 0%, #ffffff 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4px',
              background: 'linear-gradient(90deg, #3f51b5, #9c27b0)'
            }} 
          />
          
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 2
            }}
          >
            {report.title}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid sx={{ gridColumn: { xs: '1 / span 12', sm: '1 / span 6', md: '1 / span 4' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Assignment sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">
                  评测类型: <b>{report.assessmentTitle}</b>
                </Typography>
              </Box>
            </Grid>
            
            <Grid sx={{ gridColumn: { xs: '1 / span 12', sm: '1 / span 6', md: '1 / span 4' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">
                  生成时间: <b>{formatDate(report.createdAt)}</b>
                </Typography>
              </Box>
            </Grid>
            
            <Grid sx={{ gridColumn: { xs: '1 / span 12', sm: '1 / span 6', md: '1 / span 4' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">
                  咨询师: <b>{report.counselorName || '系统生成'}</b>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* 报告内容 */}
        <Grid container spacing={3}>
          {/* 左侧 - 得分和趋势 */}
          <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '1 / span 5' } }}>
            {/* 分数卡片 */}
            <Paper 
              sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <BarChart sx={{ mr: 1, color: 'primary.main' }} /> 评测得分
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Stack spacing={2.5}>
                {report.scores.map((score: any, index: number) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                      <Typography variant="body2" fontWeight={500}>{score.category}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight={700} sx={{ mr: 1 }}>
                          {score.score.toFixed(1)}
                        </Typography>
                        <Chip
                          label={score.interpretation}
                          size="small"
                          color={getLevelColor(score.level) as any}
                          sx={{ 
                            height: 22, 
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            px: 0.5
                          }}
                        />
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        width: '100%',
                        height: 10,
                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                        borderRadius: 2,
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      <Box
                        sx={{
                          width: `${Math.min(score.score / 4 * 100, 100)}%`,
                          height: '100%',
                          bgcolor: getLevelColor(score.level) + '.main',
                          borderRadius: 2,
                          transition: 'width 0.5s ease-in-out'
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Stack>
              
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  分数范围: 0-4 (0=无症状, 4=严重)
                </Typography>
              </Box>
            </Paper>

            {/* 趋势卡片 */}
            {report.trends && report.trends.length > 0 && (
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)'
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <TrendingUp sx={{ mr: 1, color: 'primary.main' }} /> 评测趋势
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(0, 0, 0, 0.02)'
                  }}
                >
                  <Typography variant="body1" sx={{ mr: 1 }}>整体趋势:</Typography>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      ml: 'auto',
                      bgcolor: report.trends[report.trends.length - 1].score < report.trends[0].score 
                        ? 'success.light' 
                        : report.trends[report.trends.length - 1].score > report.trends[0].score 
                        ? 'error.light' 
                        : 'info.light',
                      color: 'white',
                      borderRadius: 1,
                      px: 1.5,
                      py: 0.5
                    }}
                  >
                    {getTrendIcon()}
                    <Typography variant="body2" fontWeight={500} sx={{ ml: 0.5 }}>
                      {report.trends[report.trends.length - 1].score < report.trends[0].score
                        ? '改善中'
                        : report.trends[report.trends.length - 1].score > report.trends[0].score
                        ? '恶化中'
                        : '保持稳定'}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 1 }}>
                  {report.trends.map((trend: any, index: number) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1.5,
                        p: 1.5,
                        bgcolor: index === report.trends.length - 1 
                          ? 'rgba(33, 150, 243, 0.08)' 
                          : 'transparent',
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: index === report.trends.length - 1 
                          ? 'primary.light' 
                          : 'transparent'
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {new Date(trend.date).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </Typography>
                        {index === report.trends.length - 1 && (
                          <Typography variant="caption" color="primary.main">
                            最新评测
                          </Typography>
                        )}
                      </Box>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          bgcolor: trend.score > 3 
                            ? 'error.main' 
                            : trend.score > 2 
                            ? 'warning.main' 
                            : trend.score > 1 
                            ? 'info.main' 
                            : 'success.main',
                          color: 'white',
                          borderRadius: 10,
                          px: 1.5,
                          py: 0.3
                        }}
                      >
                        <Typography variant="body2" fontWeight={700}>
                          {trend.score.toFixed(1)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            )}
          </Grid>

          {/* 右侧 - 总结和建议 */}
          <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '6 / span 7' } }}>
            {/* 总结卡片 */}
            <Paper 
              sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <Info sx={{ mr: 1, color: 'primary.main' }} /> 评测总结
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ p: 1.5, bgcolor: 'rgba(33, 150, 243, 0.05)', borderRadius: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
                <Typography variant="body1" paragraph sx={{ mb: 0, lineHeight: 1.7 }}>
                  {report.summary}
                </Typography>
              </Box>
            </Paper>

            {/* 建议卡片 */}
            <Paper 
              sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} /> 改善建议
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <List 
                disablePadding
                sx={{
                  bgcolor: 'rgba(76, 175, 80, 0.05)',
                  borderRadius: 2,
                  p: 2
                }}
              >
                {report.recommendations.map((recommendation: string, index: number) => (
                  <ListItem 
                    key={index} 
                    disablePadding 
                    sx={{ 
                      mb: 1.5,
                      pb: 1.5,
                      borderBottom: index < report.recommendations.length - 1 ? '1px dashed rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircle fontSize="small" color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={recommendation} 
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        fontWeight: 500,
                        lineHeight: 1.5
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* 咨询师备注 */}
            {report.counselorNotes && (
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)'
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1, color: 'info.main' }} /> 咨询师备注
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Alert 
                  severity="info" 
                  icon={false} 
                  sx={{ 
                    mb: 2,
                    borderRadius: 2,
                    '& .MuiAlert-message': { width: '100%' }
                  }}
                >
                  <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2, lineHeight: 1.7 }}>
                    "{report.counselorNotes}"
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, textAlign: 'right', fontWeight: 500 }}>
                    — {report.counselorName}
                  </Typography>
                </Alert>
              </Paper>
            )}
          </Grid>
        </Grid>

        {/* 底部免责声明 */}
        <Paper 
          sx={{ 
            p: 3, 
            mt: 3, 
            borderRadius: 2, 
            bgcolor: 'rgba(0, 0, 0, 0.02)',
            border: '1px dashed rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            <Warning fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
            免责声明
          </Typography>
          <Typography variant="body2" color="text.secondary">
            本报告仅供参考，不能作为医疗诊断依据。如有需要，请咨询专业心理医师或心理咨询师。
          </Typography>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default ReportDetail; 