import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setError('');
    // Demo: chỉ cần đúng tài khoản mẫu là đăng nhập thành công
    if (email === 'admin@example.com' && password === 'Admin123') {
      onLogin();
    } else {
      setError('Sai tài khoản hoặc mật khẩu.');
    }
  };

  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-icon">
          <span role="img" aria-label="box" style={{fontSize: 40}}>📦</span>
        </div>
        <h2>Hệ Thống Quản Lý Sản Phẩm</h2>
        <p className="login-desc">Đăng nhập để quản lý kho hàng của bạn</p>
        <div className="login-group">
          <label>Email</label>
          <input type="email" placeholder="admin@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="login-group">
          <label>Mật khẩu</label>
          <input type="password" placeholder="Nhập mật khẩu của bạn" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="login-options">
          <label>
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
            Ghi nhớ đăng nhập
          </label>
          <button type="button" className="forgot" style={{background:'none',border:'none',padding:0,cursor:'pointer',color:'#4f6ef7'}} onClick={()=>alert('Chức năng chưa hỗ trợ')}>Quên mật khẩu?</button>
        </div>
        {error && <div className="login-error">{error}</div>}
        <button type="submit" className="login-btn">Đăng nhập</button>
        <div className="login-demo">Demo: admin@example.com / Admin123</div>
      </form>
    </div>
  );
};

export default Login;
