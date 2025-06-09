import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container, 
  LinearProgress, 
  CircularProgress, 
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  FormGroup,
  TextField,
  Slider,
  Stack,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { 
  ArrowBack, 
  ArrowForward, 
  Check, 
  Warning, 
  AccessTime
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Assessment, 
  Question, 
  QuestionType, 
  Answer, 
  AssessmentSession as SessionType
} from '../types/assessment.types';
import { getAssessmentById, saveAnswers, completeAssessment } from '../services/mockAssessmentService';

const AssessmentSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [openExitDialog, setOpenExitDialog] = useState<boolean>(false);
  const [openTimeWarning, setOpenTimeWarning] = useState<boolean>(false);

  // 获取评测量表详情
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        if (!id) {
          setError('会话ID无效');
          setLoading(false);
          return;
        }

        // 在实际应用中，这里应该获取会话信息和对应的评测量表
        // 现在我们简单地获取评测量表，假设会话ID就是评测ID
        const data = await getAssessmentById(parseInt(id));
        if (data) {
          setAssessment(data);
          if (data.timeLimit) {
            setTimeRemaining(data.timeLimit * 60); // 转换为秒
          }
        } else {
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

  // 倒计时
  useEffect(() => {
    if (!timeRemaining || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        
        // 当剩余时间小于5分钟时显示警告
        if (prev === 300) { // 5分钟 = 300秒
          setOpenTimeWarning(true);
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // 更新进度
  useEffect(() => {
    if (!assessment) return;
    
    const totalQuestions = assessment.questions.length;
    const answeredQuestions = answers.length;
    const newProgress = Math.floor((answeredQuestions / totalQuestions) * 100);
    setProgress(newProgress);
  }, [answers, assessment]);

  // 获取当前问题
  const getCurrentQuestion = (): Question | null => {
    if (!assessment || !assessment.questions) return null;
    return assessment.questions[currentQuestionIndex];
  };

  // 获取问题的答案
  const getAnswerForCurrentQuestion = (): Answer | undefined => {
    if (!assessment) return undefined;
    const question = getCurrentQuestion();
    if (!question) return undefined;
    
    return answers.find(answer => answer.questionId === question.id);
  };

  // 处理答案变更
  const handleAnswerChange = (value: string | number | number[]) => {
    if (!assessment) return;
    const question = getCurrentQuestion();
    if (!question) return;

    const newAnswer: Answer = {
      questionId: question.id,
      value
    };

    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.questionId === question.id);
      if (existingAnswerIndex >= 0) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = newAnswer;
        return newAnswers;
      } else {
        return [...prev, newAnswer];
      }
    });
  };

  // 下一题
  const handleNext = async () => {
    const question = getCurrentQuestion();
    if (!question || !assessment) return;

    // 检查是否已回答当前问题（如果是必答题）
    const currentAnswer = getAnswerForCurrentQuestion();
    if (question.required && !currentAnswer) {
      alert('此题为必答题，请作答后继续');
      return;
    }

    // 如果是最后一题，则提交评测
    if (currentQuestionIndex >= assessment.questions.length - 1) {
      await handleSubmit();
      return;
    }

    // 保存答案（在实际应用中，可以定期保存答案）
    if ((currentQuestionIndex + 1) % 5 === 0) {
      try {
        await saveAnswers(parseInt(id || '0'), answers);
      } catch (error) {
        console.error('保存答案失败', error);
      }
    }

    setCurrentQuestionIndex(prev => prev + 1);
  };

  // 上一题
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // 提交评测
  const handleSubmit = async () => {
    if (!assessment) return;
    
    // 检查是否有未回答的必答题
    const unansweredRequiredQuestions = assessment.questions.filter(q => 
      q.required && !answers.some(a => a.questionId === q.id)
    );
    
    if (unansweredRequiredQuestions.length > 0) {
      alert(`还有 ${unansweredRequiredQuestions.length} 个必答题未回答，请检查后再提交`);
      return;
    }
    
    setSubmitting(true);
    
    try {
      const result = await completeAssessment(parseInt(id || '0'), answers);
      // 导航到结果页面
      navigate(`/assessment-result/${result.sessionId}`);
    } catch (error) {
      console.error('提交评测失败', error);
      setError('提交评测失败，请稍后再试');
      setSubmitting(false);
    }
  };

  // 渲染问题
  const renderQuestion = (question: Question) => {
    const answer = getAnswerForCurrentQuestion();
    
    switch (question.type) {
      case QuestionType.SINGLE_CHOICE:
        return (
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ mb: 2 }}>
              {question.required && <span style={{ color: 'red', marginRight: '4px' }}>*</span>}
              {question.text}
            </FormLabel>
            <RadioGroup
              value={answer?.value || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
            >
              {question.options?.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.value.toString()}
                  control={<Radio />}
                  label={option.text}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
        
      case QuestionType.MULTIPLE_CHOICE:
        const selectedValues = answer?.value as number[] || [];
        return (
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ mb: 2 }}>
              {question.required && <span style={{ color: 'red', marginRight: '4px' }}>*</span>}
              {question.text}
            </FormLabel>
            <FormGroup>
              {question.options?.map((option) => (
                <FormControlLabel
                  key={option.id}
                  control={
                    <Checkbox
                      checked={selectedValues.includes(option.value)}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...selectedValues, option.value]
                          : selectedValues.filter(v => v !== option.value);
                        handleAnswerChange(newValues);
                      }}
                    />
                  }
                  label={option.text}
                />
              ))}
            </FormGroup>
          </FormControl>
        );
        
      case QuestionType.LIKERT_SCALE:
        return (
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ mb: 2 }}>
              {question.required && <span style={{ color: 'red', marginRight: '4px' }}>*</span>}
              {question.text}
            </FormLabel>
            <RadioGroup
              value={answer?.value || ''}
              onChange={(e) => handleAnswerChange(parseInt(e.target.value))}
              sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mb: 2 }}
            >
              {question.options?.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.value.toString()}
                  control={<Radio />}
                  label={option.text}
                  sx={{ 
                    flexDirection: 'column-reverse', 
                    alignItems: 'center',
                    margin: 0
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
        
      case QuestionType.TEXT:
        return (
          <FormControl fullWidth>
            <FormLabel component="legend" sx={{ mb: 2 }}>
              {question.required && <span style={{ color: 'red', marginRight: '4px' }}>*</span>}
              {question.text}
            </FormLabel>
            <TextField
              multiline
              rows={4}
              value={answer?.value || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="请在此输入您的回答..."
              variant="outlined"
            />
          </FormControl>
        );
        
      case QuestionType.SLIDER:
        return (
          <FormControl fullWidth>
            <FormLabel component="legend" sx={{ mb: 2 }}>
              {question.required && <span style={{ color: 'red', marginRight: '4px' }}>*</span>}
              {question.text}
            </FormLabel>
            <Box sx={{ px: 2 }}>
              <Slider
                value={answer?.value as number || (question.minValue || 0)}
                min={question.minValue || 0}
                max={question.maxValue || 100}
                step={question.step || 1}
                onChange={(_, value) => handleAnswerChange(value as number)}
                valueLabelDisplay="auto"
                marks={[
                  { value: question.minValue || 0, label: question.minValue || 0 },
                  { value: question.maxValue || 100, label: question.maxValue || 100 }
                ]}
              />
            </Box>
          </FormControl>
        );
        
      default:
        return <Typography>不支持的问题类型</Typography>;
    }
  };

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !assessment) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || '未找到该评测量表'}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/assessments')} 
        >
          返回评测列表
        </Button>
      </Container>
    );
  }

  const currentQuestion = getCurrentQuestion();

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="md">
        {/* 顶部进度条和信息 */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {assessment.title}
            </Typography>
            
            {timeRemaining !== null && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: timeRemaining < 300 ? 'error.main' : 'text.primary'
              }}>
                <AccessTime sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                  剩余时间: {formatTime(timeRemaining)}
                </Typography>
              </Box>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              进度: {currentQuestionIndex + 1} / {assessment.questions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({progress}%)
            </Typography>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 8, borderRadius: 4 }} 
          />
        </Paper>

        {/* 问题内容 */}
        <Paper sx={{ p: 4, mb: 3 }}>
          {currentQuestion ? (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                问题 {currentQuestionIndex + 1}
              </Typography>
              
              {renderQuestion(currentQuestion)}
            </Box>
          ) : (
            <Typography>没有更多问题</Typography>
          )}
        </Paper>

        {/* 导航按钮 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || submitting}
          >
            上一题
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            endIcon={currentQuestionIndex >= assessment.questions.length - 1 ? <Check /> : <ArrowForward />}
            onClick={handleNext}
            disabled={submitting}
          >
            {currentQuestionIndex >= assessment.questions.length - 1 ? '提交' : '下一题'}
          </Button>
        </Box>
      </Container>

      {/* 退出确认对话框 */}
      <Dialog
        open={openExitDialog}
        onClose={() => setOpenExitDialog(false)}
      >
        <DialogTitle>确认退出评测？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            您的评测进度将会保存，但未提交的答案可能会丢失。确定要退出吗？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExitDialog(false)} color="inherit">取消</Button>
          <Button onClick={() => navigate('/assessments')} variant="contained" color="error">
            退出评测
          </Button>
        </DialogActions>
      </Dialog>

      {/* 时间警告对话框 */}
      <Dialog
        open={openTimeWarning}
        onClose={() => setOpenTimeWarning(false)}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Warning color="warning" sx={{ mr: 1 }} />
            时间提醒
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            您的评测时间还剩5分钟，请抓紧时间完成。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTimeWarning(false)} variant="contained">
            我知道了
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessmentSession; 