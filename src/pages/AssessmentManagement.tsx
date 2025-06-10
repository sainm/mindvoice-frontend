import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Alert,
  Snackbar,
  Grid
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Psychology as PsychologyIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { Assessment } from '../types/assessment.types';
import { getAllAssessments } from '../services/mockAssessmentService';

/**
 * Assessment Management Page Component
 * 评测管理页面组件
 */
const AssessmentManagement: React.FC = () => {
  // 状态管理
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState<number | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

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
        showSnackbar('获取评测列表失败', 'error');
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
    setPage(0); // 重置到第一页
  }, [searchTerm, selectedCategory, assessments]);

  // 获取所有唯一的分类
  const categories = [...new Set(assessments.map(assessment => assessment.category))];

  // 表格分页处理
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 清除筛选
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  // 删除评测量表
  const handleDeleteClick = (id: number) => {
    setAssessmentToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (assessmentToDelete !== null) {
      // 在实际应用中，这里应该调用API删除评测量表
      const updatedAssessments = assessments.filter(
        assessment => assessment.id !== assessmentToDelete
      );
      setAssessments(updatedAssessments);
      showSnackbar('评测量表已成功删除', 'success');
    }
    setOpenDeleteDialog(false);
    setAssessmentToDelete(null);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setAssessmentToDelete(null);
  };

  // 显示提示消息
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // 创建新评测量表
  const handleCreateAssessment = () => {
    // 在实际应用中，这里应该导航到创建评测量表页面
    showSnackbar('创建评测量表功能正在开发中', 'success');
  };

  // 编辑评测量表
  const handleEditAssessment = (id: number) => {
    // 在实际应用中，这里应该导航到编辑评测量表页面
    showSnackbar(`编辑评测量表 ID: ${id} 功能正在开发中`, 'success');
  };

  // 查看评测量表详情
  const handleViewAssessment = (id: number) => {
    // 在实际应用中，这里应该导航到评测量表详情页面
    showSnackbar(`查看评测量表 ID: ${id} 功能正在开发中`, 'success');
  };

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
        {/* 页面标题和操作按钮 */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            <PsychologyIcon sx={{ mr: 1, fontSize: 32 }} />
            评测管理
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleCreateAssessment}
          >
            创建评测量表
          </Button>
        </Box>

        {/* 统计卡片 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  总评测量表数
                </Typography>
                <Typography variant="h4" component="div">
                  {assessments.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  分类数量
                </Typography>
                <Typography variant="h4" component="div">
                  {categories.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  本月新增
                </Typography>
                <Typography variant="h4" component="div">
                  {/* 实际应用中应该计算本月新增量表数量 */}
                  2
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  使用次数最多
                </Typography>
                <Typography variant="h4" component="div">
                  {/* 实际应用中应该显示使用次数最多的量表名称 */}
                  SCL-90
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 搜索和筛选 */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="搜索评测量表..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearchTerm('')} size="small">
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="category-filter-label">按分类筛选</InputLabel>
                <Select
                  labelId="category-filter-label"
                  value={selectedCategory}
                  label="按分类筛选"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="">全部分类</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button 
                fullWidth
                variant="outlined" 
                startIcon={<FilterIcon />}
                onClick={handleClearFilters}
              >
                清除筛选
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* 评测量表列表 */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="评测量表列表">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>名称</TableCell>
                  <TableCell>分类</TableCell>
                  <TableCell>问题数量</TableCell>
                  <TableCell>时间限制</TableCell>
                  <TableCell>创建日期</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAssessments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((assessment) => (
                    <TableRow hover key={assessment.id}>
                      <TableCell>{assessment.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                          {assessment.title}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={assessment.category} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell>{assessment.questions.length}</TableCell>
                      <TableCell>
                        {assessment.timeLimit ? `${assessment.timeLimit}分钟` : '无限制'}
                      </TableCell>
                      <TableCell>
                        {new Date(assessment.createdAt).toLocaleDateString('zh-CN')}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="查看详情">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleViewAssessment(assessment.id)}
                            >
                              <DescriptionIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="编辑">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleEditAssessment(assessment.id)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="删除">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteClick(assessment.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredAssessments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      没有找到匹配的评测量表
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAssessments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="每页行数:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} 共 ${count}`}
          />
        </Paper>

        {/* 删除确认对话框 */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteCancel}
        >
          <DialogTitle>确认删除</DialogTitle>
          <DialogContent>
            <DialogContentText>
              您确定要删除这个评测量表吗？此操作不可逆。
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              取消
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              删除
            </Button>
          </DialogActions>
        </Dialog>

        {/* 提示消息 */}
        <Snackbar 
          open={openSnackbar} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbarSeverity} 
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </MainLayout>
  );
};

export default AssessmentManagement; 