import React, { useState, FormEvent } from 'react';
import { Button, Container, Card, Form } from 'react-bootstrap';
import '../css/Register.css';

export default function Register() {
  const [userId, setUserId] = useState(''); //ユーザーID
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [mailadress, setMailadress] = useState('');
  const [userName, setUserName] = useState('');

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {};

  return (
    <Container className="register-container">
      <Card className="register-card">
        <Card.Body>
          <h2 className="text-center">管理者登録</h2>
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label>ユーザーID</Form.Label>
              <Form.Control
                type="text"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
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
            <Form.Group className="mb-3">
              <Form.Label>メールアドレス</Form.Label>
              <Form.Control
                type="text"
                value={mailadress}
                onChange={(event) => setMailadress(event.target.value)}
                placeholder="メールアドレスを入力"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>氏名</Form.Label>
              <Form.Control
                type="text"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                placeholder="氏名を入力"
              />
            </Form.Group>
            <Button className="w-100" type="submit">
              登録
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
