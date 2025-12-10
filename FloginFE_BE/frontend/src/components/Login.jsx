import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setError('');
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
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
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="admin@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="login-group">
            <label htmlFor="password">Mật khẩu</label>
            <div style={{position:'relative'}}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu của bạn"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{paddingRight:32}}
              />
            <button
              type="button"
              style={{position:'absolute',right:6,top:6,border:'none',background:'none',cursor:'pointer',fontSize:18,color:'#6c7a89'}}
              onClick={()=>setShowPassword(v=>!v)}
              tabIndex={-1}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <div className="login-options">
          <label>
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
            Ghi nhớ đăng nhập
          </label>
          <button type="button" className="forgot" style={{background:'none',border:'none',padding:0,cursor:'pointer',color:'#4f6ef7'}} onClick={()=>alert('Chức năng chưa hỗ trợ')}>Quên mật khẩu?</button>
        </div>
        {error && <div className="error-message login-error">{error}</div>}
        <button type="submit" id="loginBtn" className="login-btn">Đăng nhập</button>
        <div className="login-demo">Demo: admin@example.com / Admin123</div>
      </form>
    </div>
  );
};

export default Login;
