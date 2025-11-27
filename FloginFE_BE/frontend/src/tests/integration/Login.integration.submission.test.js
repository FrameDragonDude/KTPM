import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Login from '../../components/Login';


jest.mock('axios');

describe('Login Component Integration Tests - Form Submission', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('submits form with valid credentials', async () => {
    const mockOnLogin = jest.fn();
    
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'admin@example.com');
    await userEvent.type(passwordInput, 'Admin123');
    await userEvent.click(submitButton);
    
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  test('does not submit with empty email', async () => {
    const mockOnLogin = jest.fn();
    
    render(<Login onLogin={mockOnLogin} />);
    
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(passwordInput, 'Admin123');
    await userEvent.click(submitButton);
    
    expect(screen.getByText(/Vui lòng nhập đầy đủ thông tin/i)).toBeInTheDocument();
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('does not submit with empty password', async () => {
    const mockOnLogin = jest.fn();
    
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'admin@example.com');
    await userEvent.click(submitButton);
    
    expect(screen.getByText(/Vui lòng nhập đầy đủ thông tin/i)).toBeInTheDocument();
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('handles successful API login', async () => {
    const mockOnLogin = jest.fn();
    
    axios.post.mockResolvedValueOnce({
      data: {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        token: 'fake-jwt-token'
      }
    });
    
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'admin@example.com');
    await userEvent.type(passwordInput, 'Admin123');
    await userEvent.click(submitButton);
    
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  test('handles failed API login', async () => {
    const mockOnLogin = jest.fn();
    
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'wrong@example.com');
    await userEvent.type(passwordInput, 'WrongPass');
    await userEvent.click(submitButton);
    
    expect(screen.getByText(/Sai tài khoản hoặc mật khẩu/i)).toBeInTheDocument();
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('shows error message for empty fields', async () => {
    render(<Login onLogin={() => {}} />);
    
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    await userEvent.click(submitButton);
    
    expect(screen.getByText(/Vui lòng nhập đầy đủ thông tin/i)).toBeInTheDocument();
  });

  test('shows error message for invalid credentials', async () => {
    render(<Login onLogin={() => {}} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'wrong@example.com');
    await userEvent.type(passwordInput, 'WrongPassword');
    await userEvent.click(submitButton);
    
    expect(screen.getByText(/Sai tài khoản hoặc mật khẩu/i)).toBeInTheDocument();
  });
});
