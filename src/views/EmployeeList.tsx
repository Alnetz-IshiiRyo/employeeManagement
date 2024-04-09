import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Alert,
} from '@mui/material';
import axios from 'axios';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import employeesTmp from './test'; // TODO:テストデータ後で消す

// API従業員情報の型定義
interface APIEmployee {
  userId: string;
  lastName: string;
  firstName: string;
  birthday: string;
  email: string;
  zipcode: string;
  prefcode: string;
  city: string;
  address: string;
  tel: string;
}

// 従業員情報の型定義
interface Employee {
  userId: string;
  fullName: string;
  birthday: string;
  email: string;
  zipcode: string;
  fullAddress: string;
  tel: string;
}

// テーブルヘッダーの情報を定義する型
interface HeadCell {
  disablePadding: boolean;
  id: keyof Employee;
  label: string;
  numeric: boolean;
}

// テーブルヘッダーの設定を修正
const headCells: HeadCell[] = [
  { id: 'userId', numeric: false, disablePadding: false, label: 'ユーザーID' },
  { id: 'fullName', numeric: false, disablePadding: false, label: '氏名' },
  { id: 'birthday', numeric: false, disablePadding: false, label: '生年月日' },
  { id: 'email', numeric: false, disablePadding: false, label: 'メール' },
  { id: 'fullAddress', numeric: false, disablePadding: false, label: '住所' },
  { id: 'tel', numeric: false, disablePadding: false, label: '電話番号' },
];

// 従業員データ取得API
const GET_EMPLOYEES_API = '/api/admin/employees'; // TODO:後で編集
// 従業員インポートAPI
const POST_IMPORT_API = '/api/employees/import'; // TODO:後で編集
// 従業員削除API
const DELETE_EMPLOYEES_API = '/api/employees/'; // TODO:後で編集

// 従業員インポート処理
const handleImport = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    await axios.post(POST_IMPORT_API, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    alert('インポートが完了しました。');
    // 成功したらデータを再取得するなどの処理
  } catch (error) {
    console.error('インポート処理に失敗しました。', error);
  }
};

// 従業員削除処理
const handleDelete = async (userId: string) => {
  if (window.confirm(`${userId}を削除しますか？`)) {
    try {
      await axios.delete(`${DELETE_EMPLOYEES_API}${userId}`);
      alert('削除が完了しました。');
      // 成功したらデータを再取得するなどの処理
    } catch (error) {
      console.error('削除処理に失敗しました。', error);
    }
  }
};

// 従業員一覧コンポーネント
export default function EmployeeList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Employee>('userId');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const formatdata = formatEmployeeData(employeesTmp);
    setEmployees(formatdata); // 従業員データをセット

    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await axios.get(GET_EMPLOYEES_API);
        const formatdata = formatEmployeeData(response.data);
        setEmployees(formatdata); // 従業員データをセット
      } catch (error) {
        setError('データの取得中にエラーが発生しました。');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // 従業員データを表示用に整形する関数
  const formatEmployeeData = (employees: APIEmployee[]) => {
    return employees.map((employee) => ({
      ...employee,
      fullName: `${employee.lastName} ${employee.firstName}`, // 氏名の結合
      fullAddress: `${employee.prefcode} ${employee.city} ${employee.address}`, // 住所の結合
    }));
  };

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

  // ファイル選択イベント
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImport(file); // インポート処理を呼び出し
    }
  };

  const sortedEmployees = sortEmployees([...employees]);

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
          onClick={() => navigate('/register')} // 登録画面への遷移
          sx={{ marginX: 1 }}
        >
          従業員登録
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={() => fileInputRef.current?.click()}
        >
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
              <TableRow key={employee.userId}>
                <TableCell>{employee.userId}</TableCell>
                <TableCell>{employee.fullName}</TableCell>
                <TableCell>{employee.birthday}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.fullAddress}</TableCell>
                <TableCell>{employee.tel}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    sx={{
                      '& .MuiPaper-root': {
                        boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => navigate(`/edit/${employee.userId}`)}
                    >
                      編集
                    </MenuItem>
                    <MenuItem onClick={() => handleDelete(employee.userId)}>
                      削除
                    </MenuItem>
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
