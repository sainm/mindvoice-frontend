import React from 'react';
import { Box, Card, CardContent, Typography, Icon } from '@mui/material';

// 组件属性接口
interface UserStatsCardProps {
  title: string;
  count: number;
  icon: string;
  color: string;
}

// 用户统计卡片组件
const UserStatsCard: React.FC<UserStatsCardProps> = ({ title, count, icon, color }) => {
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
          <Icon sx={{ fontSize: 32, color }}>
            {icon}
          </Icon>
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

export default UserStatsCard; 