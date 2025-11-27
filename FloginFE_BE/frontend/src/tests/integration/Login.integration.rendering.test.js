import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Login from '../../components/Login';


jest.mock('axios');

describe('Login Component Integration Tests - Rendering', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all form elements correctly', () => {
    render(<Login onLogin={() => {}} />);
    
    expect(screen.getByText(/Hệ Thống Quản Lý Sản Phẩm/i)).toBeInTheDocument();
    expect(screen.getByText(/Đăng nhập để quản lý kho hàng của bạn/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mật khẩu/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Đăng nhập/i })).toBeInTheDocument();
    expect(screen.getByText(/Ghi nhớ đăng nhập/i)).toBeInTheDocument();
    expect(screen.getByText(/Quên mật khẩu/i)).toBeInTheDocument();
  });

  test('allows user to type in email field', async () => {
    render(<Login onLogin={() => {}} />);
    const emailInput = screen.getByLabelText(/Email/i);
    
    await userEvent.type(emailInput, 'test@example.com');
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  test('allows user to type in password field', async () => {
    render(<Login onLogin={() => {}} />);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    
    await userEvent.type(passwordInput, 'Test123');
    
    expect(passwordInput).toHaveValue('Test123');
  });

  test('toggles password visibility', async () => {
    render(<Login onLogin={() => {}} />);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const toggleButton = screen.getByRole('button', { name: /Hiện mật khẩu/i });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('allows user to check remember me checkbox', async () => {
    render(<Login onLogin={() => {}} />);
    const rememberCheckbox = screen.getByRole('checkbox');
    
    expect(rememberCheckbox).not.toBeChecked();
    
    await userEvent.click(rememberCheckbox);
    expect(rememberCheckbox).toBeChecked();
    
    await userEvent.click(rememberCheckbox);
    expect(rememberCheckbox).not.toBeChecked();
  });

  test('shows alert when forgot password is clicked', async () => {
    window.alert = jest.fn();
    
    render(<Login onLogin={() => {}} />);
    const forgotButton = screen.getByText(/Quên mật khẩu/i);
    
    await userEvent.click(forgotButton);
    
    expect(window.alert).toHaveBeenCalledWith('Chức năng chưa hỗ trợ');
  });

  test('maintains form state during interaction', async () => {
    render(<Login onLogin={() => {}} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const rememberCheckbox = screen.getByRole('checkbox');
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'TestPass123');
    await userEvent.click(rememberCheckbox);
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('TestPass123');
    expect(rememberCheckbox).toBeChecked();
  });

  test('form submission prevents default behavior', async () => {
    const mockOnLogin = jest.fn();
    const mockPreventDefault = jest.fn();
    
    render(<Login onLogin={mockOnLogin} />);
    
    const form = screen.getByRole('button', { name: /Đăng nhập/i }).closest('form');
    
    fireEvent.submit(form, { preventDefault: mockPreventDefault });
    
    expect(mockPreventDefault).toHaveBeenCalled();
  });
});
