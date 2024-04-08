import React, { useState, FormEvent } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../css/Login.css'; // CSSファイルのインポート

// コンポーネントのPropsの型定義（ここではPropsは使用していないため空）
interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  // 状態の型定義
  const [userId, setUserId] = useState<string>(''); // ユーザーID
  const [password, setPassword] = useState<string>(''); // パスワード
  const [showPassword, setShowPassword] = useState<boolean>(false); // パスワード表示
  const [errorMessage, setErrorMessage] = useState<string>(''); // エラーメッセージ
  const [showError, setShowError] = useState<boolean>(false); // エラー表示

  const history = useHistory();

  // フォーム送信処理
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // デフォルトの送信を防止

    // エラー表示のリセット
    setErrorMessage('');
    setShowError(false);

    try {
      const response = await axios.post('/api/admin/login', {
        userId,
        password,
      });

      // レスポンスからトークンを取得し、セッションストレージに保存
      const { token } = response.data;
      sessionStorage.setItem('authToken', token);

      history.push('/employees'); // 従業員一覧ページへリダイレクト
    } catch (error) {
      // エラー処理
      if (axios.isAxiosError(error) && error.response) {
        const message =
          error.response.data.message || 'ログインに失敗しました。';
        setErrorMessage(message);
        setShowError(true);
      } else {
        console.error('Unexpected error:', error);
        setErrorMessage('予期せぬエラーが発生しました。');
        setShowError(true);
      }
    }
  };

  return (
    <Container className="login-container">
      {/* エラーメッセージの表示 */}
      {showError && (
        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
          {errorMessage}
        </Alert>
      )}
      <Card className="login-card">
        <Card.Body>
          <h2 className="text-center">ログイン</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>ユーザーID</Form.Label>
              <Form.Control
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="ユーザーIDを入力"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>パスワード</Form.Label>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
              />
              <Form.Check
                type="checkbox"
                label="パスワードを表示"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="mt-2"
              />
            </Form.Group>
            <Button className="w-100" type="submit">
              ログイン
            </Button>
            <div className="text-center mt-3">
              アカウントをお持ちでないですか？{' '}
              <Link to="/register">こちらで登録</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
