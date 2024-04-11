// src/components/Header.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  // ログアウト機能の実装はここに追加します
  const handleLogout = () => {
    // ログアウト処理を実装します
    console.log('ログアウトしました');
    // ログアウト後にユーザーをログインページにリダイレクトします
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          従業員管理システム
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          ログアウト
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
