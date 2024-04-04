import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(username, password);
    // 認証処理をここに実装
  };

  return (
    <Container className="login-container">
      <Card className="login-card">
        <Card.Body>
          <h2 className="text-center">ログイン</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>ユーザー名</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ユーザー名を入力"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>パスワード</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
              />
              <Form.Check 
                label="パスワードを表示" 
                onChange={(e) => setShowPassword(e.target.checked)}
                className="mt-2"
              />
            </Form.Group>
            <Button className="w-100" type="submit">
              ログイン
            </Button>
            <div className="text-center mt-3">
              アカウントをお持ちでないですか？ <Link to="/register">こちらで登録</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
