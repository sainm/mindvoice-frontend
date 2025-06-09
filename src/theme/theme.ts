import { createTheme, ThemeOptions } from '@mui/material/styles';
import { zhCN } from '@mui/material/locale';
import { UserRole } from '../types/user.types';

// 基础主题配置
const baseTheme: ThemeOptions = {
  palette: {
    primary: {
      main: '#3f51b5', // 靛蓝色作为主色调
      light: '#757de8',
      dark: '#002984',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9c27b0', // 紫色作为次要色调
      light: '#d05ce3',
      dark: '#6a0080',
      contrastText: '#ffffff',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        },
      },
    },
  },
};

// 普通用户主题（暖色调）
const userTheme: ThemeOptions = {
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    primary: {
      main: '#ff7043', // 浅橙色
      light: '#ffa270',
      dark: '#c63f17',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffab40', // 琥珀色
      light: '#ffdd71',
      dark: '#c77c02',
      contrastText: '#000000',
    },
  },
};

// 咨询师主题（冷色调）
const counselorTheme: ThemeOptions = {
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    primary: {
      main: '#42a5f5', // 淡蓝色
      light: '#80d6ff',
      dark: '#0077c2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#26a69a', // 蓝绿色
      light: '#64d8cb',
      dark: '#00766c',
      contrastText: '#ffffff',
    },
  },
};

// 管理员主题（中性灰）
const adminTheme: ThemeOptions = {
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    primary: {
      main: '#546e7a', // 蓝灰色
      light: '#819ca9',
      dark: '#29434e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#78909c', // 灰蓝色
      light: '#a7c0cd',
      dark: '#4b636e',
      contrastText: '#ffffff',
    },
  },
};

// 根据角色获取主题
export const getThemeByRole = (role?: UserRole | null) => {
  switch (role) {
    case UserRole.ADMIN:
      return createTheme(adminTheme, zhCN);
    case UserRole.COUNSELOR:
      return createTheme(counselorTheme, zhCN);
    case UserRole.USER:
      return createTheme(userTheme, zhCN);
    default:
      return createTheme(baseTheme, zhCN);
  }
};

// 默认导出基础主题
export default createTheme(baseTheme, zhCN);