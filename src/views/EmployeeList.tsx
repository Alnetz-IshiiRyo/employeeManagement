import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  Toolbar,
  Button,
  Snackbar,
  IconButton,
  Menu,
  MenuItem,
  Alert,
} from '@mui/material';
import axios from 'axios';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LoadingOverlay from '../components/LoadingOverlay';

import employeesTmp from './test'; // TODO:テストデータ後で消す

import { APIEmployee, Employee } from '../types/commonTypes';
import { convertKeysToCamelCase } from '../utils/commonUtils';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {
  DELETE_EMPLOYEES_API,
  GET_EMPLOYEES_API,
  POST_IMPORT_API,
} from '../config/apiConfig';

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

  // 従業員データ取得
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(GET_EMPLOYEES_API);
      const camelCaseData = convertKeysToCamelCase(response.data);
      const formatdata = formatEmployeeData(camelCaseData as APIEmployee[]);
      setEmployees(formatdata); // 従業員データをセット
    } catch (error) {
      setError('データの取得中にエラーが発生しました。');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // 従業員インポート
  const handleImport = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(POST_IMPORT_API, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('インポートが完了しました。');
      // 成功したらデータを再取得
      fetchEmployees();
    } catch (error) {
      console.error('インポート処理に失敗しました。', error);
    } finally {
      setLoading(false);
    }
  };

  // 従業員削除処理
  const handleDelete = async (userId: string) => {
    if (window.confirm(`${userId}を削除しますか？`)) {
      setLoading(true);

      try {
        await axios.delete(`${DELETE_EMPLOYEES_API}${userId}`);
        alert('削除が完了しました。');
        // 成功したらデータを再取得
        fetchEmployees();
      } catch (error) {
        console.error('削除処理に失敗しました。', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // 従業員データを表示用に整形する関数
  const formatEmployeeData = (employees: APIEmployee[]) => {
    return employees.map((employee) => ({
      ...employee,
      fullName: `${employee.lastName} ${employee.firstName}`, // 氏名の結合
      fullAddress: `${employee.prefcode} ${employee.city} ${employee.address}`, // 住所の結合
    }));
  };

  // 従業員並び替え
  const handleRequestSort = (property: keyof Employee) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // 従業員データ並び替え
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

  // スナックバーを閉じる
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

  // コンポーネントのマウント時に従業員データを取得
  useEffect(() => {
    const formatdata = formatEmployeeData(employeesTmp); // TODO:テスト用
    setEmployees(formatdata); // TODO:テスト用

    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <>
      <LoadingOverlay loading={loading} />
      <Header />
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
          onClick={() => navigate('/employees/register')}
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
                      onClick={() =>
                        navigate(`/employees/edit/${employee.userId}`)
                      }
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
      <Footer />
    </>
  );
}
