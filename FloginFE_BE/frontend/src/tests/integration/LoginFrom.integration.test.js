import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../components/Login.jsx';

describe('Login Component', () => {
  let onLoginMock;

  beforeEach(() => {
    onLoginMock = jest.fn();
    render(<Login onLogin={onLoginMock} />);
  });

  test('Hiển thị form login với tất cả input và nút', () => {
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mật khẩu/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Đăng nhập/i })).toBeInTheDocument();
    expect(screen.getByText(/Demo: admin \/ Admin123/i)).toBeInTheDocument();
  });


  test('Validation: không nhập email và password sẽ hiện lỗi', () => {
    fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));
    expect(screen.getByText(/Vui lòng nhập đầy đủ thông tin/i)).toBeInTheDocument();
    expect(onLoginMock).not.toHaveBeenCalled();
  });

  test('Sai email hoặc password sẽ hiện lỗi', () => {
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));
    expect(screen.getByText(/Sai tài khoản hoặc mật khẩu/i)).toBeInTheDocument();
    expect(onLoginMock).not.toHaveBeenCalled();
  });


 test('Đăng nhập đúng sẽ gọi onLogin', () => {
   fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'admin' } });
   fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Admin123' } });
   fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));
   expect(onLoginMock).toHaveBeenCalledTimes(1);
   expect(screen.queryByText(/Sai tài khoản hoặc mật khẩu/i)).not.toBeInTheDocument();
 });


  test('Toggle show/hide password', () => {
    const passwordInput = screen.getByPlaceholderText(/Nhập mật khẩu của bạn/i);
    const toggleBtn = screen.getByLabelText(/Hiện mật khẩu/i);

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('Checkbox "Ghi nhớ đăng nhập" hoạt động', () => {
    const checkbox = screen.getByLabelText(/Ghi nhớ đăng nhập/i);
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });
});
