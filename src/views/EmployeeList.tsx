import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface Employee {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  address: string;
  postalCode: string;
  phone: string;
}
const EmployeeList: React.FC = () => {
  const employees: Employee[] = [
    // サンプルデータ
    {
      firstName: '洋平',
      lastName: '赤田',
      birthDate: '1980/01/01',
      gender: '男性',
      address: '東京都渋谷区神南1-2-3',
      postalCode: '150-0041',
      phone: '03-1234-5678',
    },
    // 他の従業員データ...
  ];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log('ログアウト処理');
  };

  const handleRegister = () => {
    console.log('従業員登録');
  };

  const handleImport = () => {
    console.log('インポート');
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#f8f8f8' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: '#333' }}
          >
            従業員一覧
          </Typography>
          <Button color="primary" onClick={handleLogout}>
            ログアウト
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ justifyContent: 'flex-end', background: '#f0f0f0' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRegister}
          sx={{ marginX: 1 }}
        >
          従業員登録
        </Button>
        <Button variant="contained" color="secondary" onClick={handleImport}>
          インポート
        </Button>
      </Toolbar>
      <TableContainer
        component={Paper}
        sx={{ mt: 4, overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}
      >
        <Table aria-label="simple table">
          <TableHead sx={{ backgroundColor: '#E3F2FD' }}>
            <TableRow>
              <TableCell>氏名</TableCell>
              <TableCell>生年月日</TableCell>
              <TableCell>性別</TableCell>
              <TableCell>住所</TableCell>
              <TableCell>郵便番号</TableCell>
              <TableCell>電話番号</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee, index) => (
              <TableRow key={index}>
                <TableCell>{`${employee.lastName} ${employee.firstName}`}</TableCell>
                <TableCell>{employee.birthDate}</TableCell>
                <TableCell>{employee.gender}</TableCell>
                <TableCell>{employee.address}</TableCell>
                <TableCell>{employee.postalCode}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>編集</MenuItem>
                    <MenuItem onClick={handleClose}>削除</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default EmployeeList;
