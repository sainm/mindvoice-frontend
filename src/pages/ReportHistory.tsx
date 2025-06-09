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
  Stack
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  Assignment,
  Download,
  Visibility
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
    createdAt: '2025-06-10T15:45:00',
    status: 'completed',
    summary: '根据测评结果，您的整体心理状态稳定，建议继续保持良好的生活习惯...',
    counselorId: 5,
    counselorName: '王医生'
  },
  {
    id: 2,
    title: 'PHQ-9 抑郁症筛查量表报告',
    assessmentId: 2,
    assessmentTitle: 'PHQ-9 抑郁症筛查量表',
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
    createdAt: '2025-05-28T14:20:00',
    status: 'completed',
    counselorId: 6,
    counselorName: '李医生'
  },
  {
    id: 4,
    title: 'MBTI 人格类型测试报告',
    assessmentId: 4,
    assessmentTitle: 'MBTI 人格类型测试',
    createdAt: '2025-05-15T09:10:00',
    status: 'completed',
    counselorId: null,
    counselorName: null
  },
  {
    id: 5,
    title: '霍兰德职业兴趣测试报告',
    assessmentId: 5,
    assessmentTitle: '霍兰德职业兴趣测试',
    createdAt: '2025-05-10T16:40:00',
    status: 'completed',
    counselorId: null,
    counselorName: null
  }
];

const ReportHistory: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

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

  // 处理搜索
  useEffect(() => {
    if (searchTerm) {
      const filtered = reports.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.assessmentTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReports(filtered);
    } else {
      setFilteredReports(reports);
    }
    setPage(0);
  }, [searchTerm, reports]);

  // 处理分页变化
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // 处理每页行数变化
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 查看报告详情
  const handleViewReport = (reportId: number) => {
    navigate(`/reports/${reportId}`);
  };

  // 下载报告
  const handleDownloadReport = (reportId: number) => {
    // 实际应用中，这里应该调用API下载报告
    console.log(`下载报告 ID: ${reportId}`);
    alert('报告下载功能将在后续版本中提供');
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

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 3 }}>
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
              display: 'flex',
              alignItems: 'center',
              fontWeight: 700,
              color: 'primary.main',
              mb: 2
            }}
          >
            <Assignment sx={{ mr: 1.5, fontSize: 32 }} /> 历史报告
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ maxWidth: 800, mb: 3 }}
          >
            查看您完成的所有心理评测报告。您可以查看详情或下载报告以便保存和打印。
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
              placeholder="搜索报告..."
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
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                size="small"
                sx={{
                  whiteSpace: 'nowrap',
                  borderRadius: 8,
                  px: 2
                }}
              >
                筛选
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* 报告列表 */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(63, 81, 181, 0.05)' }}>
                  <TableCell sx={{ fontWeight: 600 }}>报告标题</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>评测类型</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>生成时间</TableCell>
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
                        <TableCell>{formatDate(report.createdAt)}</TableCell>
                        <TableCell>
                          {report.counselorName || '系统生成'}
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => handleViewReport(report.id)}
                              sx={{ borderRadius: 8, px: 2 }}
                            >
                              查看
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Download />}
                              onClick={() => handleDownloadReport(report.id)}
                              sx={{ borderRadius: 8, px: 2 }}
                            >
                              下载
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                          没有找到符合条件的报告
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          请尝试调整搜索条件或完成更多评测
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
      </Container>
    </MainLayout>
  );
};

export default ReportHistory; 