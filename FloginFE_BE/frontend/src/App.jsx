import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Product from './components/Product';

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem('loggedIn') === 'true';
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    localStorage.setItem('loggedIn', loggedIn);
  }, [loggedIn]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type }), 2500);
  };

  return (
    <>
      {toast.show && (
        <div style={{position:'fixed',top:24,right:24,zIndex:2000}}>
          <div style={{display:'flex',alignItems:'center',gap:10,background:'#065f46',color:'#fff',borderRadius:10,boxShadow:'0 4px 16px rgba(44,62,80,0.18)',padding:'18px 24px',minWidth:320,fontSize:'1.08rem'}}>
            <span style={{fontSize:20,marginRight:8}}>✔️</span>
            <div>
              <div style={{fontWeight:600}}> {toast.message.split('\n')[0]} </div>
              <div style={{fontSize:'1rem'}}> {toast.message.split('\n')[1]} </div>
            </div>
          </div>
        </div>
      )}
      {loggedIn ? (
        <Product onLogout={() => setLoggedIn(false)} />
      ) : (
        <Login onLogin={() => { setLoggedIn(true); showToast('Đăng nhập thành công!\nChào mừng bạn đến với hệ thống quản lý sản phẩm', 'success'); }} />
      )}
    </>
  );
}

export default App;
