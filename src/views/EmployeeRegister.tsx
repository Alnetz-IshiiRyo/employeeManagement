// EmployeeRegister.tsx
import React, { useState } from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { APIEmployee, prefectures } from '../types/commonTypes';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ja'; // 日本語のロケールをインポート
import axios from 'axios';

const POST_EMPLOYEES_API = '/api/employees'; // TODO:後で修正

export default function EmployeeRegister() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success',
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [employee, setEmployee] = useState<APIEmployee>({
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

  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrefChange = (event: SelectChangeEvent<string>) => {
    setEmployee((prev) => ({ ...prev, prefcode: event.target.value }));
  };

  const handleDateChange = (date: Dayjs | null) => {
    setEmployee((prev) => ({
      ...prev,
      birthday: date ? date.toISOString() : '', // 日付をISO形式の文字列に変換
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post(POST_EMPLOYEES_API, employee);
        if (response.status === 200) {
          // フォームフィールドをクリア
          setEmployee({
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
          // 成功メッセージを表示
          setSnackbarMessage('登録が完了しました。');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage('登録に失敗しました。');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  const validateForm = () => {
    let newErrors = {};

    // ユーザーIDが半角英数字のみであることをチェック
    const userIdRegex = /^[a-zA-Z0-9]+$/;
    if (!userIdRegex.test(employee.userId)) {
      newErrors = { ...newErrors, userId: 'ユーザーIDは半角英数字のみです。' };
    }

    // メールがメールアドレス形式であることをチェック
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(employee.email)) {
      newErrors = {
        ...newErrors,
        email: 'メールアドレス形式で入力してください。',
      };
    }

    // 郵便番号が数字のみであることをチェック
    const zipcodeRegex = /^\d+$/;
    if (!zipcodeRegex.test(employee.zipcode)) {
      newErrors = { ...newErrors, zipcode: '郵便番号は数字のみです。' };
    }

    // 電話番号が数字のみであることをチェック
    const telRegex = /^\d+$/;
    if (!telRegex.test(employee.tel)) {
      newErrors = { ...newErrors, tel: '電話番号は数字のみです。' };
    }

    // 必須項目の配列を定義
    const requiredFields: (keyof APIEmployee)[] = [
      'userId',
      'email',
      'lastName',
      'firstName',
      'birthday',
      'zipcode',
      'city',
      'address',
      'tel',
      'prefcode', // 都道府県を必須項目として追加
    ];

    // 各必須項目に対してバリデーションチェックを行う
    requiredFields.forEach((field) => {
      if (!employee[field]) {
        newErrors = { ...newErrors, [field]: '必須項目です。' };
      }
    });

    setErrors(newErrors);

    // エラーがない場合はtrueを返す
    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            従業員登録
          </Typography>
          <Button color="inherit" onClick={() => navigate(-1)}>
            戻る
          </Button>
        </Toolbar>
      </AppBar>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={null}
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
                required
              />
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
          <Grid item xs={12} container justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              登録
            </Button>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
