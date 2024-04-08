import React, { useEffect, useState } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Snackbar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Alert from '@mui/material/Alert';
import employeesTmp from './test';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  address: string;
  postalCode: string;
  phone: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Employee;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'id', numeric: true, disablePadding: false, label: 'ID' },
  { id: 'firstName', numeric: false, disablePadding: false, label: '氏名' },
  { id: 'birthDate', numeric: false, disablePadding: false, label: '生年月日' },
  { id: 'gender', numeric: false, disablePadding: false, label: '性別' },
  { id: 'address', numeric: false, disablePadding: false, label: '住所' },
  {
    id: 'postalCode',
    numeric: false,
    disablePadding: false,
    label: '郵便番号',
  },
  { id: 'phone', numeric: false, disablePadding: false, label: '電話番号' },
];

function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([
    /* 初期データ */
  ]);
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Employee>('id');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        // const response = await axios.get('http://example.com/api/employees');
        setEmployees(employeesTmp);
        setLoading(false);
      } catch (error) {
        setError('データの取得中にエラーが発生しました。');
        setOpenSnackbar(true);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleRequestSort = (property: keyof Employee) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortEmployees = (array: Employee[]) => {
    return array.sort((a, b) => {
      if (a[orderBy] < b[orderBy]) {
        return orderDirection === 'asc' ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return orderDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const sortedEmployees = sortEmployees([...employees]);

  const handleRegister = () => {
    console.log('従業員登録');
  };

  const handleImport = () => {
    console.log('インポート');
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click(); // ファイル入力をプログラム的にクリック
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('ファイルが選択されました:', file.name);
      // ここでファイルのアップロード処理や読み込み処理を行います
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            従業員一覧
          </Typography>
          <Button color="inherit" onClick={() => console.log('ログアウト')}>
            ログアウト
          </Button>
        </Toolbar>
      </AppBar>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={null}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
      <Toolbar sx={{ justifyContent: 'flex-end', background: '#f0f0f0' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRegister}
          sx={{ marginX: 1 }}
        >
          従業員登録
        </Button>
        <Button variant="contained" color="info" onClick={handleFileSelect}>
          インポート
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".xls,.xlsx"
        />
      </Toolbar>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? orderDirection : 'asc'}
                    onClick={() => handleRequestSort(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell align="right">{employee.id}</TableCell>
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
                    sx={{
                      '& .MuiPaper-root': {
                        // Menu の内部の Paper コンポーネントに適用されるスタイル
                        boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.1)', // 影の強さを調整
                      },
                    }}
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
}

export default EmployeeList;
