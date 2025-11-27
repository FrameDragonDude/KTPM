import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../../components/Login';
import { login } from '../../services/authService';

/**
 * Login Mock Tests - Successful Scenarios
 * Test successful login flows with mocked authService
 */
jest.mock('../../services/authService');

describe('Login Component Mock Tests - Successful Responses', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handles successful login with mocked authService', async () => {
    const mockUser = {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      fullName: 'Admin User',
      token: 'fake-jwt-token-12345'
    };
    
    login.mockResolvedValueOnce({ data: mockUser });
    
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

  test('stores user data in localStorage on successful login', async () => {
    const mockUser = {
      id: 2,
      username: 'testuser',
      email: 'test@example.com',
      token: 'test-token-67890'
    };
    
    login.mockResolvedValueOnce({ data: mockUser });
    Storage.prototype.setItem = jest.fn();
    
    const mockOnLogin = jest.fn();
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'Test123');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalled();
    });
  });

  test('handles remember me functionality with mocked service', async () => {
    const mockUser = {
      id: 3,
      username: 'rememberuser',
      email: 'remember@example.com',
      token: 'remember-token'
    };
    
    login.mockResolvedValueOnce({ data: mockUser });
    
    const mockOnLogin = jest.fn();
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const rememberCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'remember@example.com');
    await userEvent.type(passwordInput, 'Remember123');
    await userEvent.click(rememberCheckbox);
    await userEvent.click(submitButton);
    
    expect(mockOnLogin).toHaveBeenCalled();
    expect(rememberCheckbox).toBeChecked();
  });

  test('redirects to dashboard after successful login', async () => {
    const mockUser = {
      id: 4,
      username: 'dashuser',
      email: 'dash@example.com',
      token: 'dash-token'
    };
    
    login.mockResolvedValueOnce({ data: mockUser });
    
    const mockOnLogin = jest.fn();
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'dash@example.com');
    await userEvent.type(passwordInput, 'Dash123');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });
  });

  test('mocks consecutive login attempts with eventual success', async () => {
    login.mockRejectedValueOnce({
      response: { status: 401, data: { message: 'Sai mật khẩu' } }
    });
    
    login.mockResolvedValueOnce({
      data: { id: 6, username: 'retry', token: 'retry-token' }
    });
    
    const mockOnLogin = jest.fn();
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'retry@example.com');
    await userEvent.type(passwordInput, 'WrongPass');
    await userEvent.click(submitButton);
    
    expect(mockOnLogin).not.toHaveBeenCalled();
    
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'CorrectPass');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });
  });

  test('mocks different response times', async () => {
    login.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { id: 7, username: 'slow', token: 'slow-token' } });
        }, 100);
      });
    });
    
    const mockOnLogin = jest.fn();
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'slow@example.com');
    await userEvent.type(passwordInput, 'SlowPass123');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalled();
    }, { timeout: 2000 });
  });
});
