import React, { useState, FormEvent } from 'react';
import { Alert, Button, Container, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Register.css';

export default function Register() {
  const [userId, setUserId] = useState<string>(''); //ユーザーID
  const [password, setPassword] = useState<string>('');
  const [passwordAgain, setPasswordAgain] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [mailAdress, setMailAdress] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const navigate = useNavigate();

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // デフォルトの送信を防止

    // エラー表示のリセット
    setErrorMessage('');
    setShowError(false);

    // 氏名が空白の場合のエラーメッセージ
    if (!userName || !mailAdress || !userId || !password || !passwordAgain) {
      setErrorMessage('各項目は、必須項目です。');
      setShowError(true);
      return; // 関数の実行を終了し、画面遷移を防ぐ
    }
    // passwordとpasswordAgainが一致しない場合のエラーメッセージ
    if (password !== passwordAgain) {
      setErrorMessage('パスワードが一致しません。');
      setShowError(true);
      return; // 関数の実行を終了し、画面遷移を防ぐ
    }

    // 空白でない場合、画面遷移を行う
    navigate('/employees');
  };

  return (
    <Container className="register-container">
      {/* エラーメッセージの表示 */}
      {showError && (
        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
          {errorMessage}
        </Alert>
      )}
      <Card className="register-card">
        <Card.Body>
          <h2 className="text-center">管理者登録</h2>
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label>氏名</Form.Label>
              <Form.Control
                type="text"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                placeholder="氏名を入力"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>メールアドレス</Form.Label>
              <Form.Control
                type="text"
                value={mailAdress}
                onChange={(event) => setMailAdress(event.target.value)}
                placeholder="メールアドレスを入力"
              />
            </Form.Group>
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
                className="mb-3"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="パスワード"
              />
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                value={passwordAgain}
                onChange={(event) => setPasswordAgain(event.target.value)}
                placeholder="パスワード再入力"
              />
              <Form.Check
                type="checkbox"
                label="パスワードを表示"
                checked={showPassword}
                onChange={(event) => setShowPassword(event.target.checked)}
                className="mt-2"
              />
            </Form.Group>

            <Button className="w-100" type="submit">
              登録
            </Button>
            <div className="text-center mt-3">
              <Link to="/login">戻る</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
