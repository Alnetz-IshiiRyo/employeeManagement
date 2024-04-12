// EmployeeEdit.tsx
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  AppBar,
  Toolbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  FormHelperText,
  Alert,
  Snackbar,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ja';

import { POSTEmployee, prefectures } from '../types/commonTypes';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { GET_EMPLOYEE_API, PUT_EMPLOYEES_API } from '../config/apiConfig';

export default function EmployeeEdit() {
  const [employee, setEmployee] = useState<POSTEmployee>({
    userName: '',
    password: '',
    userId: '',
    lastName: '',
    firstName: '',
    birthday: '',
    email: '',
    zipcode: '',
    prefcode: '',
    city: '',
    address: '',
    tel: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success',
  );

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleBackToEmployeeList = () => {
    navigate('/employees');
  };

  // コンポーネントマウント時に従業員の詳細をAPIから取得
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${GET_EMPLOYEE_API}${id}`);
        const employeeData = response.data;
        setEmployee({
          ...employeeData,
          birthday: dayjs(employeeData.birthday).toISOString(), // 日付をISO形式に変換
        });
      } catch (error) {
        console.error('従業員データの取得に失敗しました', error);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  // フォームフィールドが変更されたときのハンドラ
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // 都道府県の選択が変更されたときのハンドラ
  const handlePrefChange = (event: SelectChangeEvent<string>) => {
    setEmployee((prev) => ({ ...prev, prefcode: event.target.value }));
  };

  // 生年月日が変更されたときのハンドラ
  const handleDateChange = (date: Dayjs | null) => {
    setEmployee((prev) => ({
      ...prev,
      birthday: date ? date.toISOString() : '',
    }));
  };

  // フォームの送信処理
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.put(`${PUT_EMPLOYEES_API}${id}`, employee);
        if (response.status === 200) {
          setSnackbarMessage('更新が完了しました。');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          navigate('/employees'); // 更新後は従業員一覧画面にリダイレクト
        }
      } catch (error) {
        console.error('従業員情報の更新に失敗しました', error);
        setSnackbarMessage('更新に失敗しました。');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  // フォームのバリデーション
  const validateForm = () => {
    let newErrors = {};
    // バリデーションロジックをここに追加

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
      <Header />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Box sx={{ maxWidth: '600px', margin: '0 auto' }}>
        <Box
          sx={{ mt: 8 }}
          component="form"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="userId"
                label="ユーザーID"
                name="userId"
                value={employee.userId}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.userId}
                helperText={errors.userId}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="lastName"
                label="姓"
                name="lastName"
                value={employee.lastName}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="firstName"
                label="名"
                name="firstName"
                value={employee.firstName}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider
                adapterLocale={'ja'}
                dateAdapter={AdapterDayjs}
                localeText={{
                  previousMonth: '前月を表示',
                  nextMonth: '次月を表示',
                }}
              >
                <DatePicker
                  disabled
                  label="生年月日"
                  value={employee.birthday ? dayjs(employee.birthday) : null}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      error: !!errors.birthday,
                      helperText: errors.birthday,
                    },
                  }}
                  onError={(newError) =>
                    setErrors(newError ? { birthday: newError } : {})
                  }
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                label="メール"
                name="email"
                value={employee.email}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="zipcode"
                label="郵便番号"
                name="zipcode"
                value={employee.zipcode}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.zipcode}
                helperText={errors.zipcode}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                variant="outlined"
                required
                error={!!errors.prefcode}
              >
                <InputLabel id="pref-label" error={!!errors.prefcode}>
                  都道府県
                </InputLabel>
                <Select
                  labelId="pref-label"
                  id="prefcode"
                  name="prefcode"
                  value={employee.prefcode}
                  onChange={handlePrefChange}
                  label="都道府県"
                  error={!!errors.prefcode}
                  required
                >
                  {prefectures.map((pref) => (
                    <MenuItem key={pref.code} value={pref.code}>
                      {pref.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText style={{ color: '#d32f2f' }}>
                  {errors.prefcode}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="city"
                label="市区町村"
                name="city"
                value={employee.city}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.city}
                helperText={errors.city}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address"
                label="住所"
                name="address"
                value={employee.address}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.address}
                helperText={errors.address}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="tel"
                label="電話番号"
                name="tel"
                value={employee.tel}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.tel}
                helperText={errors.tel}
                required
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="flex-end"
          >
            <Grid item>
              <Grid container spacing={1} alignItems="center">
                <Button
                  variant="text" // テキストボタンに変更
                  color="inherit" // 色を継承
                  onClick={handleBackToEmployeeList}
                  sx={{
                    padding: '6px 8px', // パディングを調整
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)', // ホバー時の背景色を調整
                    },
                  }}
                >
                  戻る
                </Button>
              </Grid>
            </Grid>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
              >
                更新
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
