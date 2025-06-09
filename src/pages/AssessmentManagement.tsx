import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Tooltip,
  Alert,
  Snackbar,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CloudDownload as DownloadIcon,
  CloudUpload as UploadIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueFormatter } from '@mui/x-data-grid';
import { Assessment, QuestionType } from '../types/assessment.types';
import { 
  getAssessments, 
  createAssessment, 
  updateAssessment, 
  deleteAssessment, 
  exportAssessment, 
  importAssessment,
  getAssessmentStats 
} from '../services/assessmentManagementService';
import { isAdmin } from '../services/authService';
import MainLayout from '../components/layout/MainLayout';

// 统计卡片组件
const StatsCard = ({ title, count, icon, color }: { title: string; count: number; icon: React.ReactNode; color: string }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          backgroundColor: color,
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            width: 56,
            height: 56,
            backgroundColor: `${color}22`,
            mr: 2
          }}
        >
          {icon}
        </Box>
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold">
            {count}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// 定义测评管理页面组件
const AssessmentManagement: React.FC = () => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 状态定义
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(15);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [stats, setStats] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // 检查是否有管理员权限
  const hasAdminAccess = isAdmin();
  
  // 加载统计信息
  const loadStats = async () => {
    try {
      const statsData = await getAssessmentStats();
      setStats(statsData);
      
      // 提取所有类别
      if (statsData.categoryCounts) {
        setCategories(Object.keys(statsData.categoryCounts));
      }
    } catch (error) {
      console.error('加载统计信息失败', error);
      showSnackbar('加载统计信息失败', 'error');
    }
  };
  
  // 加载评测量表列表
  const loadAssessments = async () => {
    setLoading(true);
    try {
      // 构建筛选条件
      const filters: any = {};
      
      if (categoryFilter) {
        filters.category = categoryFilter;
      }
      
      if (searchTerm) {
        filters.searchTerm = searchTerm;
      }
      
      // 调用API获取评测量表列表
      const result = await getAssessments(page + 1, pageSize, filters);
      setAssessments(result.assessments);
      setTotal(result.total);
    } catch (error) {
      console.error('加载评测量表列表失败', error);
      showSnackbar('加载评测量表列表失败', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // 首次加载和筛选条件变化时重新加载数据
  useEffect(() => {
    loadAssessments();
    loadStats();
  }, [page, pageSize]);
  
  // 处理搜索
  const handleSearch = () => {
    setPage(0);
    loadAssessments();
  };
  
  // 处理重置搜索
  const handleResetSearch = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setPage(0);
    loadAssessments();
  };
  
  // 处理删除评测量表
  const handleDeleteAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setIsDeleteDialogOpen(true);
  };
  
  // 确认删除评测量表
  const confirmDeleteAssessment = async () => {
    if (!selectedAssessment) return;
    
    try {
      await deleteAssessment(selectedAssessment.id);
      setIsDeleteDialogOpen(false);
      loadAssessments();
      loadStats();
      showSnackbar('评测量表已删除', 'success');
    } catch (error) {
      console.error('删除评测量表失败', error);
      showSnackbar('删除评测量表失败', 'error');
    }
  };
  
  // 处理导出评测量表
  const handleExportAssessment = async (id?: number) => {
    try {
      await exportAssessment(id);
      showSnackbar(id ? '评测量表导出成功' : '所有评测量表导出成功', 'success');
    } catch (error) {
      console.error('导出评测量表失败', error);
      showSnackbar('导出评测量表失败', 'error');
    }
  };
  
  // 处理导入评测量表
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // 处理文件选择
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const jsonData = e.target?.result as string;
        
        try {
          const result = await importAssessment(jsonData);
          loadAssessments();
          loadStats();
          
          const count = Array.isArray(result) ? result.length : 1;
          showSnackbar(`成功导入 ${count} 个评测量表`, 'success');
        } catch (error) {
          console.error('导入评测量表失败', error);
          showSnackbar('导入评测量表失败：格式无效', 'error');
        }
      };
      reader.readAsText(file);
      
      // 清空文件输入，以便可以重新选择同一个文件
      event.target.value = '';
    } catch (error) {
      console.error('读取文件失败', error);
      showSnackbar('读取文件失败', 'error');
    }
  };
  
  // 显示提示信息
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  // 关闭提示信息
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  // 日期格式化函数
  const dateFormatter: GridValueFormatter = (params: any) => {
    if (!params.value) return '-';
    return new Date(params.value as string).toLocaleString();
  };
  
  // 定义表格列
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: '量表名称', width: 200, flex: 1 },
    { field: 'category', headerName: '类别', width: 120 },
    { 
      field: 'questions', 
      headerName: '问题数量', 
      width: 100,
      valueGetter: (params) => params.row.questions?.length || 0
    },
    {
      field: 'timeLimit',
      headerName: '时间限制',
      width: 100,
      valueFormatter: (params) => params.value ? `${params.value}分钟` : '无限制'
    },
    {
      field: 'createdAt',
      headerName: '创建时间',
      width: 160,
      valueFormatter: dateFormatter
    },
    {
      field: 'updatedAt',
      headerName: '更新时间',
      width: 160,
      valueFormatter: dateFormatter
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 180,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Assessment>) => {
        const assessment = params.row as Assessment;
        
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="编辑量表">
              <IconButton
                size="small"
                color="primary"
                onClick={() => console.log('编辑量表', assessment.id)}
                disabled={!hasAdminAccess}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="导出量表">
              <IconButton
                size="small"
                color="secondary"
                onClick={() => handleExportAssessment(assessment.id)}
              >
                <ExportIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="删除量表">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteAssessment(assessment)}
                disabled={!hasAdminAccess}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      }
    }
  ];
  
  return (
    <MainLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Container maxWidth="xl" sx={{ mt: 2, mb: 2, display: 'flex', flexDirection: 'column' }}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: theme.shadows[3],
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #3f51b5, #2196f3, #00bcd4, #009688)',
              }
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              测评管理
            </Typography>
            
            {/* 统计信息 */}
            {stats && (
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={3}>
                  <StatsCard
                    title="总量表数"
                    count={stats.totalAssessments}
                    icon={<DownloadIcon sx={{ fontSize: 32, color: '#3f51b5' }} />}
                    color="#3f51b5"
                  />
                </Grid>
                
                {categories.slice(0, 3).map((category, index) => (
                  <Grid size={3} key={category}>
                    <StatsCard
                      title={`${category}量表`}
                      count={stats.categoryCounts[category]}
                      icon={
                        index === 0 ? <DownloadIcon sx={{ fontSize: 32, color: '#4caf50' }} /> :
                        index === 1 ? <DownloadIcon sx={{ fontSize: 32, color: '#ff9800' }} /> :
                        <DownloadIcon sx={{ fontSize: 32, color: '#f44336' }} />
                      }
                      color={
                        index === 0 ? '#4caf50' :
                        index === 1 ? '#ff9800' :
                        '#f44336'
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            )}
            
            {/* 筛选工具栏 */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="搜索量表"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={handleSearch}>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                
                <Grid size={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>类别</InputLabel>
                    <Select
                      value={categoryFilter}
                      label="类别"
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <MenuItem value="">全部</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid size={5}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={handleResetSearch}
                    >
                      重置
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<ImportIcon />}
                      onClick={handleImportClick}
                      disabled={!hasAdminAccess}
                    >
                      导入量表
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<ExportIcon />}
                      onClick={() => handleExportAssessment()}
                    >
                      全部导出
                    </Button>
                    
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => console.log('添加量表')}
                      disabled={!hasAdminAccess}
                    >
                      添加量表
                    </Button>
                    
                    {/* 隐藏的文件输入 */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept=".json"
                      onChange={handleFileSelect}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Box>
            
            {/* 量表列表 */}
            <Box sx={{ width: '100%' }}>
              <DataGrid
                rows={assessments}
                columns={columns}
                pagination
                paginationMode="server"
                rowCount={total}
                loading={loading}
                pageSizeOptions={[15, 25, 50, 100]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize, page },
                  },
                }}
                onPaginationModelChange={(model) => {
                  setPage(model.page);
                  setPageSize(model.pageSize);
                }}
                disableRowSelectionOnClick
                autoHeight
                sx={{
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                  },
                  '& .MuiDataGrid-columnHeader:focus': {
                    outline: 'none',
                  }
                }}
              />
            </Box>
          </Paper>
          
          {/* 删除确认对话框 */}
          <Dialog
            open={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
          >
            <DialogTitle>确认删除</DialogTitle>
            <DialogContent>
              <DialogContentText>
                您确定要删除量表 "{selectedAssessment?.title}" 吗？此操作不可撤销。
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDeleteDialogOpen(false)}>取消</Button>
              <Button onClick={confirmDeleteAssessment} color="error" variant="contained">
                删除
              </Button>
            </DialogActions>
          </Dialog>
          
          {/* 提示信息 */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default AssessmentManagement; 