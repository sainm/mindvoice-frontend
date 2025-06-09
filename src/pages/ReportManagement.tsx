import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  Alert
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  Assignment,
  Edit,
  Delete,
  Visibility,
  Download,
  Add,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { getCurrentUser } from '../services/authService';

// 模拟报告数据
const mockReports = [
  {
    id: 1,
    title: 'SCL-90 症状自评量表报告',
    assessmentId: 1,
    assessmentTitle: 'SCL-90 症状自评量表',
    userId: 101,
    userName: '张三',
    createdAt: '2025-06-10T15:45:00',
    status: 'completed',
    counselorId: 5,
    counselorName: '王医生'
  },
  {
    id: 2,
    title: 'PHQ-9 抑郁症筛查量表报告',
    assessmentId: 2,
    assessmentTitle: 'PHQ-9 抑郁症筛查量表',
    userId: 102,
    userName: '李四',
    createdAt: '2025-06-05T11:30:00',
    status: 'completed',
    counselorId: 5,
    counselorName: '王医生'
  },
  {
    id: 3,
    title: 'GAD-7 广泛性焦虑量表报告',
    assessmentId: 3,
    assessmentTitle: 'GAD-7 广泛性焦虑量表',
    userId: 103,
    userName: '王五',
    createdAt: '2025-05-28T14:20:00',
    status: 'pending',
    counselorId: null,
    counselorName: null
  },
  {
    id: 4,
    title: 'MBTI 人格类型测试报告',
    assessmentId: 4,
    assessmentTitle: 'MBTI 人格类型测试',
    userId: 104,
    userName: '赵六',
    createdAt: '2025-05-15T09:10:00',
    status: 'completed',
    counselorId: 6,
    counselorName: '李医生'
  },
  {
    id: 5,
    title: '霍兰德职业兴趣测试报告',
    assessmentId: 5,
    assessmentTitle: '霍兰德职业兴趣测试',
    userId: 105,
    userName: '钱七',
    createdAt: '2025-05-10T16:40:00',
    status: 'pending',
    counselorId: null,
    counselorName: null
  }
];

// 定义报告状态类型
type ReportStatus = 'all' | 'completed' | 'pending';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ReportManagement: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<ReportStatus>('all');
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // 模拟从API获取报告数据
    const fetchReports = async () => {
      try {
        // 实际应用中，这里应该调用API获取数据
        setTimeout(() => {
          setReports(mockReports);
          setFilteredReports(mockReports);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('获取报告列表失败', error);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // 处理搜索和过滤
  useEffect(() => {
    let filtered = [...reports];

    // 按状态过滤
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    // 按搜索词过滤
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.assessmentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
    setPage(0);
  }, [searchTerm, reports, statusFilter]);

  // 处理分页变化
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // 处理每页行数变化
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 处理标签页切换
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setStatusFilter(newValue === 0 ? 'all' : newValue === 1 ? 'completed' : 'pending');
  };

  // 查看报告详情
  const handleViewReport = (reportId: number) => {
    navigate(`/reports/${reportId}`);
  };

  // 编辑报告
  const handleEditReport = (reportId: number) => {
    navigate(`/reports/edit/${reportId}`);
  };

  // 创建新报告
  const handleCreateReport = () => {
    navigate('/reports/create');
  };

  // 打开删除确认对话框
  const handleOpenDeleteDialog = (reportId: number) => {
    setReportToDelete(reportId);
    setDeleteDialogOpen(true);
  };

  // 关闭删除确认对话框
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setReportToDelete(null);
  };

  // 确认删除报告
  const handleConfirmDelete = () => {
    if (reportToDelete) {
      // 实际应用中，这里应该调用API删除报告
      const updatedReports = reports.filter(report => report.id !== reportToDelete);
      setReports(updatedReports);
      setSuccessMessage('报告已成功删除');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
    handleCloseDeleteDialog();
  };

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

  // 获取状态标签
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed':
        return <Chip label="已完成" size="small" color="success" icon={<CheckCircle />} />;
      case 'pending':
        return <Chip label="待处理" size="small" color="warning" />;
      default:
        return <Chip label="未知状态" size="small" color="default" />;
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {successMessage && (
          <Alert 
            severity="success" 
            sx={{ mb: 3 }}
            onClose={() => setSuccessMessage(null)}
          >
            {successMessage}
          </Alert>
        )}

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
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Typography
              variant="h4"
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 700,
                color: 'primary.main'
              }}
            >
              <Assignment sx={{ mr: 1.5, fontSize: 32 }} /> 报告管理
            </Typography>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateReport}
              sx={{ 
                borderRadius: 8, 
                px: 2,
                background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                boxShadow: '0 3px 10px rgba(63, 81, 181, 0.3)'
              }}
            >
              创建新报告
            </Button>
          </Box>

          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ maxWidth: 800, mb: 3 }}
          >
            管理所有用户的心理评测报告。您可以查看、编辑或删除报告。
          </Typography>

          {/* 搜索栏 */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mb: 3,
              alignItems: 'center'
            }}
          >
            <TextField
              placeholder="搜索报告、评测类型或用户..."
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
                  borderRadius: 8,
                  backgroundColor: 'white'
                }
              }}
              size="small"
              sx={{ maxWidth: 500 }}
            />

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', ml: { sm: 'auto' } }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="status-filter-label">状态</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="状态"
                  onChange={(e) => setStatusFilter(e.target.value as ReportStatus)}
                  sx={{ borderRadius: 8 }}
                >
                  <MenuItem value="all">全部</MenuItem>
                  <MenuItem value="completed">已完成</MenuItem>
                  <MenuItem value="pending">待处理</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Paper>

        {/* 标签页 */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="report tabs"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 500,
                minWidth: 100,
                transition: 'all 0.2s',
                '&:hover': {
                  color: 'primary.main',
                  opacity: 1
                }
              },
              '& .Mui-selected': {
                fontWeight: 700
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0'
              }
            }}
          >
            <Tab label="全部报告" />
            <Tab label="已完成" />
            <Tab label="待处理" />
          </Tabs>
        </Box>

        {/* 报告列表 */}
        <TabPanel value={tabValue} index={0}>
          <ReportTable 
            filteredReports={filteredReports} 
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            formatDate={formatDate}
            getStatusChip={getStatusChip}
            handleViewReport={handleViewReport}
            handleEditReport={handleEditReport}
            handleOpenDeleteDialog={handleOpenDeleteDialog}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ReportTable 
            filteredReports={filteredReports} 
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            formatDate={formatDate}
            getStatusChip={getStatusChip}
            handleViewReport={handleViewReport}
            handleEditReport={handleEditReport}
            handleOpenDeleteDialog={handleOpenDeleteDialog}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <ReportTable 
            filteredReports={filteredReports} 
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            formatDate={formatDate}
            getStatusChip={getStatusChip}
            handleViewReport={handleViewReport}
            handleEditReport={handleEditReport}
            handleOpenDeleteDialog={handleOpenDeleteDialog}
          />
        </TabPanel>

        {/* 删除确认对话框 */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              position: 'relative',
              overflow: 'hidden'
            }
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4px',
              background: 'linear-gradient(90deg, #f44336, #ff9800)'
            }} 
          />
          <DialogTitle id="alert-dialog-title" sx={{ pb: 1, fontWeight: 600 }}>
            确认删除报告
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ color: 'text.primary' }}>
              您确定要删除这份报告吗？此操作无法撤销。
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={handleCloseDeleteDialog} 
              startIcon={<Cancel />}
              sx={{ 
                borderRadius: 8, 
                px: 2 
              }}
            >
              取消
            </Button>
            <Button 
              onClick={handleConfirmDelete} 
              color="error" 
              autoFocus 
              startIcon={<Delete />}
              variant="contained"
              sx={{ 
                borderRadius: 8, 
                px: 2,
                background: 'linear-gradient(45deg, #f44336 30%, #ff5252 90%)',
                boxShadow: '0 3px 10px rgba(244, 67, 54, 0.3)'
              }}
            >
              删除
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
};

// 报告表格组件
interface ReportTableProps {
  filteredReports: any[];
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  formatDate: (dateString: string) => string;
  getStatusChip: (status: string) => React.ReactNode;
  handleViewReport: (reportId: number) => void;
  handleEditReport: (reportId: number) => void;
  handleOpenDeleteDialog: (reportId: number) => void;
}

const ReportTable: React.FC<ReportTableProps> = ({
  filteredReports,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  formatDate,
  getStatusChip,
  handleViewReport,
  handleEditReport,
  handleOpenDeleteDialog
}) => {
  return (
    <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(63, 81, 181, 0.05)' }}>
              <TableCell sx={{ fontWeight: 600 }}>报告标题</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>评测类型</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>用户</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>生成时间</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>状态</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>咨询师</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.length > 0 ? (
              filteredReports
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((report) => (
                  <TableRow
                    key={report.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { backgroundColor: 'rgba(63, 81, 181, 0.02)' },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                      {report.title}
                    </TableCell>
                    <TableCell>{report.assessmentTitle}</TableCell>
                    <TableCell>{report.userName}</TableCell>
                    <TableCell>{formatDate(report.createdAt)}</TableCell>
                    <TableCell>{getStatusChip(report.status)}</TableCell>
                    <TableCell>{report.counselorName || '未分配'}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewReport(report.id)}
                          title="查看"
                          sx={{ 
                            '&:hover': { 
                              bgcolor: 'rgba(63, 81, 181, 0.1)' 
                            } 
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditReport(report.id)}
                          title="编辑"
                          sx={{ 
                            '&:hover': { 
                              bgcolor: 'rgba(63, 81, 181, 0.1)' 
                            } 
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenDeleteDialog(report.id)}
                          title="删除"
                          sx={{ 
                            '&:hover': { 
                              bgcolor: 'rgba(244, 67, 54, 0.1)' 
                            } 
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      没有找到符合条件的报告
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      请尝试调整搜索条件或创建新报告
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider />
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredReports.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="每页行数:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} 共 ${count}`}
        sx={{
          bgcolor: 'rgba(0, 0, 0, 0.02)',
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontWeight: 500
          }
        }}
      />
    </Paper>
  );
};

export default ReportManagement; 