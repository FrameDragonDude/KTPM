import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../../components/Login';
import { login } from '../../services/authService';

/**
 * Login Mock Tests - Error Scenarios
 * Test error handling with mocked authService
 */
jest.mock('../../services/authService');

describe('Login Component Mock Tests - Error Responses', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handles 401 Unauthorized error', async () => {
    login.mockRejectedValueOnce({
      response: {
        status: 401,
        data: { message: 'Sai tài khoản hoặc mật khẩu' }
      }
    });
    
    const mockOnLogin = jest.fn();
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'wrong@example.com');
    await userEvent.type(passwordInput, 'WrongPass');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Sai tài khoản hoặc mật khẩu/i)).toBeInTheDocument();
    });
    
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('handles 404 Not Found error', async () => {
    login.mockRejectedValueOnce({
      response: {
        status: 404,
        data: { message: 'User không tồn tại' }
      }
    });
    
    const mockOnLogin = jest.fn();
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'notfound@example.com');
    await userEvent.type(passwordInput, 'Pass123');
    await userEvent.click(submitButton);
    
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('handles 500 Internal Server Error', async () => {
    login.mockRejectedValueOnce({
      response: {
        status: 500,
        data: { message: 'Internal Server Error' }
      }
    });
    
    const mockOnLogin = jest.fn();
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'Test123');
    await userEvent.click(submitButton);
    
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('handles network error', async () => {
    login.mockRejectedValueOnce(new Error('Network Error'));
    
    const mockOnLogin = jest.fn();
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'Test123');
    await userEvent.click(submitButton);
    
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('handles timeout error', async () => {
    login.mockRejectedValueOnce({
      code: 'ECONNABORTED',
      message: 'timeout of 5000ms exceeded'
    });
    
    const mockOnLogin = jest.fn();
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'Test123');
    await userEvent.click(submitButton);
    
    expect(mockOnLogin).not.toHaveBeenCalled();
  });
});
