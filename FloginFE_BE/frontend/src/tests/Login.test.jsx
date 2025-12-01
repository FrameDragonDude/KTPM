import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../components/Login';

describe('Login Component', () => {
  test('renders login form', () => {
    render(<Login />);
    expect(screen.getByText(/Hệ Thống Quản Lý Sản Phẩm/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mật khẩu/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Đăng nhập/i })).toBeInTheDocument();
  });

  test('shows error when fields are empty', () => {
    render(<Login />);
    const loginButtons = screen.getAllByText(/Đăng nhập/i);
    const submitButton = loginButtons.find(btn => btn.tagName === 'BUTTON');
    fireEvent.click(submitButton);
    expect(screen.getByText(/Vui lòng nhập đầy đủ thông tin/i)).toBeInTheDocument();
  });
});
