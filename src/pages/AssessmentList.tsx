import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip, 
  CircularProgress, 
  Container,
  Divider,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Grid
} from '@mui/material';
import { 
  AccessTime, 
  Category, 
  Search, 
  FilterList, 
  Clear,
  Psychology
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { Assessment } from '../types/assessment.types';
import { getAllAssessments } from '../services/mockAssessmentService';

const AssessmentList: React.FC = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // 获取所有评测量表
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await getAllAssessments();
        setAssessments(data);
        setFilteredAssessments(data);
        setLoading(false);
      } catch (error) {
        console.error('获取评测列表失败', error);
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  // 处理搜索和过滤
  useEffect(() => {
    let result = assessments;
    
    // 搜索过滤
    if (searchTerm) {
      result = result.filter(assessment => 
        assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        assessment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 分类过滤
    if (selectedCategory) {
      result = result.filter(assessment => assessment.category === selectedCategory);
    }
    
    setFilteredAssessments(result);
  }, [searchTerm, selectedCategory, assessments]);

  // 获取所有唯一的分类
  const categories = [...new Set(assessments.map(assessment => assessment.category))];

  // 开始评测
  const handleStartAssessment = (assessmentId: number) => {
    navigate(`/assessments/${assessmentId}`);
  };

  // 清除筛选
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Paper 
          sx={{ 
            p: { xs: 2, md: 3 }, 
            mb: 4, 
            borderRadius: 2,
            background: 'linear-gradient(145deg, #f0f7ff 0%, #ffffff 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 700,
              color: 'primary.main',
              mb: 2
            }}
          >
            <Psychology sx={{ mr: 1.5, fontSize: 32 }} /> 心理评测中心
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            paragraph
            sx={{ maxWidth: 800, mb: 3 }}
          >
            选择下方的评测量表，了解自己的心理健康状况。所有评测结果仅供参考，如有需要请咨询专业心理医师。
          </Typography>

          {/* 搜索和筛选 */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: 2, 
              mb: 3, 
              mt: 2,
              alignItems: 'center'
            }}
          >
            <TextField
              placeholder="搜索评测量表..."
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchTerm('')} edge="end">
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: 2,
                  backgroundColor: 'white'
                }
              }}
              size="small"
              sx={{ maxWidth: 500 }}
            />
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', ml: { sm: 'auto' } }}>
              <Button 
                variant="outlined" 
                startIcon={<FilterList />}
                size="small"
                sx={{ 
                  whiteSpace: 'nowrap',
                  borderRadius: 2,
                  px: 2
                }}
              >
                筛选
              </Button>
              
              {selectedCategory && (
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small"
                  onClick={handleClearFilters}
                  sx={{ 
                    whiteSpace: 'nowrap',
                    borderRadius: 2,
                    px: 2
                  }}
                >
                  清除筛选
                </Button>
              )}
            </Box>
          </Box>

          {/* 分类筛选 */}
          <Stack 
            direction="row" 
            spacing={1} 
            sx={{ 
              mb: 3, 
              flexWrap: 'wrap', 
              gap: 1,
              '& > *': { mb: 1 } 
            }}
          >
            <Chip 
              label="全部" 
              color={selectedCategory === '' ? 'primary' : 'default'} 
              onClick={() => setSelectedCategory('')}
              clickable
              sx={{ 
                fontWeight: 500,
                px: 1
              }}
            />
            {categories.map((category) => (
              <Chip 
                key={category} 
                label={category} 
                color={selectedCategory === category ? 'primary' : 'default'} 
                onClick={() => setSelectedCategory(category)}
                clickable
                sx={{ 
                  fontWeight: 500,
                  px: 1
                }}
              />
            ))}
          </Stack>
        </Paper>

        {/* 评测列表 */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredAssessments.length > 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            mx: -1.5, // 负外边距，配合内部元素的padding形成间距
            justifyContent: 'flex-start' // 左对齐显示
          }}>
            {filteredAssessments.map((assessment) => (
              <Box 
                key={assessment.id} 
                sx={{ 
                  width: { xs: '100%', sm: '50%', md: '33.333%', lg: '25%' }, 
                  px: 1.5, // 水平内边距
                  pb: 3,   // 底部内边距
                  display: 'flex'
                }}
              >
                <Card sx={{ 
                  width: '100%',
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  borderRadius: 2,
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                  }
                }}>
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    height: 260, // 略微减小高度，使卡片更紧凑
                    p: 2.5 // 增加内边距
                  }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600,
                        mb: 1.5,
                        height: 56, // 固定标题高度
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {assessment.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                      <Chip 
                        label={assessment.category} 
                        size="small" 
                        color="primary" 
                        icon={<Category fontSize="small" />}
                        sx={{ fontWeight: 500 }}
                      />
                      {assessment.timeLimit && (
                        <Chip 
                          label={`${assessment.timeLimit}分钟`} 
                          size="small" 
                          icon={<AccessTime fontSize="small" />}
                          sx={{ fontWeight: 500 }}
                        />
                      )}
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        flexGrow: 0,
                        lineHeight: 1.5
                      }}
                    >
                      {assessment.description}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 0.5, 
                      mb: 0,
                      mt: 'auto' // 将标签推到底部
                    }}>
                      {assessment.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size="small" 
                          variant="outlined" 
                          sx={{ fontSize: '0.7rem', height: 22 }} 
                        />
                      ))}
                    </Box>
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions sx={{ p: 1.5 }}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      onClick={() => handleStartAssessment(assessment.id)}
                      sx={{
                        borderRadius: 1.5,
                        py: 0.7,
                        fontWeight: 500
                      }}
                    >
                      开始测评
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        ) : (
          <Paper sx={{ 
            p: 5, 
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: '#f9f9f9',
            my: 4
          }}>
            <Box sx={{ mb: 3 }}>
              <Search sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            </Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              没有找到符合条件的评测量表
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              请尝试使用其他关键词或清除筛选条件
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleClearFilters} 
              sx={{ 
                mt: 1,
                borderRadius: 2,
                px: 3
              }}
            >
              清除筛选条件
            </Button>
          </Paper>
        )}
      </Container>
    </MainLayout>
  );
};

export default AssessmentList; 