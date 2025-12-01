import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../../components/Login';

describe('Login Form Validation', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
    render(<Login onLogin={mockOnLogin} />);
  });

  test('renders all input fields and login button', () => {
    expect(screen.getByPlaceholderText('admin@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nhập mật khẩu của bạn')).toBeInTheDocument();
    expect(screen.getByText('Đăng nhập')).toBeInTheDocument();
  });

  test('shows error when fields are empty', () => {
    fireEvent.click(screen.getByText('Đăng nhập'));
    expect(screen.getByText('Vui lòng nhập đầy đủ thông tin.')).toBeInTheDocument();
  });

  test('shows error on wrong credentials', () => {
    fireEvent.change(screen.getByPlaceholderText('admin@example.com'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Nhập mật khẩu của bạn'), { target: { value: 'WrongPass' } });
    fireEvent.click(screen.getByText('Đăng nhập'));
    expect(screen.getByText('Sai tài khoản hoặc mật khẩu.')).toBeInTheDocument();
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('calls onLogin on correct credentials', () => {
    fireEvent.change(screen.getByPlaceholderText('admin@example.com'), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Nhập mật khẩu của bạn'), { target: { value: 'Admin123' } });
    fireEvent.click(screen.getByText('Đăng nhập'));
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Sai tài khoản hoặc mật khẩu.')).not.toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    const passwordInput = screen.getByPlaceholderText('Nhập mật khẩu của bạn');
    const toggleBtn = screen.getByLabelText('Hiện mật khẩu');
    expect(passwordInput.type).toBe('password');
    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe('text');
    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe('password');
  });
});
